import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cliente } from '../../modelo/cliente';
import { ClientePagina } from '../../modelo/cliente-pagina';
import { OfflineDbService } from '../../offline/offline-db.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly API = `${environment.apiBaseUrl}/clientes`;

  constructor(
    private http: HttpClient,
    private offlineDbService: OfflineDbService,
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    const username = sessionStorage.getItem('username');

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'X-User': username || '',
    });
  }

  listar(page = 0, pageSize = 10, filter = '') {
    const headers = this.getAuthHeaders();

    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('filter', filter);

    return this.http
      .get<ClientePagina>(this.API, { headers, params })
      .pipe(
        tap((pagina) => {
          this.offlineDbService.salvarClientesOffline(pagina.clientes);
        }),
        first(),
      );
  }

  async listarOffline(filter = ''): Promise<Cliente[]> {
    if (!filter) {
      return this.offlineDbService.listarClientesOffline();
    }

    return this.offlineDbService.buscarClientesOfflinePorFiltro(filter);
  }

  async buscarOfflinePorId(idCliente: string): Promise<Cliente | undefined> {
    return this.offlineDbService.buscarClienteOfflinePorId(idCliente);
  }

  buscarPorId(idCliente: number): Observable<Cliente> {
    const headers = this.getAuthHeaders();

    const url = `${this.API}/${idCliente}`;

    return this.http.get<Cliente>(url, { headers });
  }

  buscarPorNome(nomeBusca: String): Observable<Cliente[]> {
    const headers = this.getAuthHeaders();

    const url = `${this.API}/trecho/${nomeBusca}`;

    return this.http.get<Cliente[]>(url, { headers });
  }

  salvar(cliente: Partial<Cliente>) {
    if (cliente.idCliente) {
      return this.editar(cliente);
    }

    return this.criar(cliente);
  }

  salvarEmitir(cliente: Partial<Cliente>) {
    return this.criar(cliente);
  }

  private criar(cliente: Partial<Cliente>) {
    const headers = this.getAuthHeaders();

    return this.http.post<Cliente>(this.API, cliente, { headers }).pipe(first());
  }

  private editar(cliente: Partial<Cliente>) {
    const headers = this.getAuthHeaders();

    return this.http
      .put<Cliente>(`${this.API}/${cliente.idCliente}`, cliente, {
        headers,
      })
      .pipe(first());
  }

  excluir(idCliente: string) {
    const headers = this.getAuthHeaders();

    return this.http.delete(`${this.API}/${idCliente}`, { headers }).pipe(first());
  }
}