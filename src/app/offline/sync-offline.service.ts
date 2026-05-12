import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pedido } from '../modelo/pedido';
import { OfflineDbService, PedidoOffline } from './offline-db.service';

@Injectable({
  providedIn: 'root',
})
export class SyncOfflineService implements OnDestroy {
  private readonly API = `${environment.apiBaseUrl}/pedidos`;

  /**
   * ID técnico usado somente para sincronizar pedidos emitidos offline.
   *
   * Motivo:
   * - No fluxo offline o pedido é digitado manualmente.
   * - Ele não vem da tela de consulta de clientes.
   * - O banco exige idCliente como NOT NULL.
   *
   * IMPORTANTE:
   * Garanta que exista um cliente técnico com ID 1 no banco local/produção,
   * por exemplo: "CLIENTE OFFLINE" ou "PEDIDOS OFFLINE".
   */
  private readonly ID_CLIENTE_OFFLINE_PADRAO = 1;

  private sincronizando = false;
  private intervaloSincronizacao: any = null;

  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  online$ = this.onlineSubject.asObservable();

  private sincronizandoSubject = new BehaviorSubject<boolean>(false);
  sincronizando$ = this.sincronizandoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private offlineDbService: OfflineDbService,
  ) {}

  iniciarMonitoramento(): void {
    window.addEventListener('online', this.onOnline);
    window.addEventListener('offline', this.onOffline);

    if (!this.intervaloSincronizacao) {
      this.intervaloSincronizacao = setInterval(() => {
        this.sincronizarPedidosPendentes();
      }, 10000);
    }

    this.sincronizarPedidosPendentes();
  }

  private onOnline = (): void => {
    this.onlineSubject.next(true);
    this.sincronizarPedidosPendentes();
  };

  private onOffline = (): void => {
    this.onlineSubject.next(false);
  };

  async sincronizarPedidosPendentes(): Promise<void> {
    if (this.sincronizando || !navigator.onLine) {
      return;
    }

    const authToken = sessionStorage.getItem('auth-token');
    const modoOffline = sessionStorage.getItem('offline-mode') === 'true';

    if (!authToken || modoOffline || authToken === 'OFFLINE_TOKEN') {
      return;
    }

    this.sincronizando = true;
    this.sincronizandoSubject.next(true);

    try {
      const pedidosPendentes =
        await this.offlineDbService.listarPedidosPendentes();

      for (const pedidoOffline of pedidosPendentes) {
        await this.sincronizarPedido(pedidoOffline);
      }
    } finally {
      this.sincronizando = false;
      this.sincronizandoSubject.next(false);
    }
  }

  private async sincronizarPedido(pedidoOffline: PedidoOffline): Promise<void> {
    try {
      const pedidoParaEnviar = this.prepararPedidoParaSincronizacao(
        pedidoOffline.pedido,
      );

      const pedidoSalvo = await firstValueFrom(
        this.http.post<Pedido>(this.API, pedidoParaEnviar, {
          headers: this.getAuthHeaders(),
        }),
      );

      if (!pedidoSalvo?.idPedido) {
        throw new Error('Backend não retornou o ID do pedido sincronizado.');
      }

      await this.offlineDbService.marcarComoSincronizado(
        pedidoOffline.offlineId,
        pedidoSalvo.idPedido,
      );
    } catch (error: any) {
      console.error('Erro ao sincronizar pedido offline:', error);

      const mensagemErro =
        error?.error?.message ||
        error?.message ||
        'Erro desconhecido ao sincronizar pedido offline.';

      await this.offlineDbService.registrarErroSincronizacao(
        pedidoOffline.offlineId,
        mensagemErro,
      );
    }
  }

  private prepararPedidoParaSincronizacao(
    pedido: Partial<Pedido>,
  ): Partial<Pedido> {
    const pedidoParaEnviar: any = {
      ...pedido,
    };

    if (
      pedidoParaEnviar.idPedido &&
      pedidoParaEnviar.idPedido.toString().startsWith('OFF-')
    ) {
      delete pedidoParaEnviar.idPedido;
    }

    if (!pedidoParaEnviar.idCliente) {
      pedidoParaEnviar.idCliente = this.ID_CLIENTE_OFFLINE_PADRAO;
    }

    if (!pedidoParaEnviar.imagemPedido) {
      pedidoParaEnviar.imagemPedido = '';
    }

    return pedidoParaEnviar;
  }

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    const username = sessionStorage.getItem('username');

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'X-User': username || '',
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);

    if (this.intervaloSincronizacao) {
      clearInterval(this.intervaloSincronizacao);
    }
  }
}