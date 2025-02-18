import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API = 'http://saotomecatimesaotomecatime.com/api/pedidos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    const username = sessionStorage.getItem('username');

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'X-User': username || '',
    });
  }

  listar(
    page: number,
    pageSize: number,
    clienteFiltro?: string,
    dataInicial?: string,
    dataFinal?: string,
    statusFiltro?: string,
  ): Observable<PedidoPagina> {
    const headers = this.getAuthHeaders();
    const params: any = { page, pageSize };

    if (clienteFiltro) params.clienteFiltro = clienteFiltro;
    if (dataInicial) params.dataInicial = dataInicial;
    if (dataFinal) params.dataFinal = dataFinal;
    if (statusFiltro) params.statusFiltro = statusFiltro;

    return this.http
      .get<PedidoPagina>(this.API, { headers, params })
      .pipe(first());
  }

  buscarPorId(idPedido: number): Observable<Pedido> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/${idPedido}`;
    return this.http.get<Pedido>(url, { headers });
  }

  buscarUltimosPedidos(
    idCliente: number,
    limite: number,
  ): Observable<Pedido[]> {
    const headers = this.getAuthHeaders();
    const params = {
      idCliente: idCliente.toString(),
      limite: limite.toString(),
    };
    return this.http.get<Pedido[]>(`${this.API}/ultimos`, { headers, params });
  }

  salvar(pedido: Partial<Pedido>) {
    if (pedido.idPedido) {
      return this.editar(pedido);
    }
    return this.criar(pedido);
  }

  private criar(pedido: Partial<Pedido>) {
    const headers = this.getAuthHeaders();
    return this.http.post<Pedido>(this.API, pedido, { headers }).pipe(first());
  }

  private editar(pedido: Partial<Pedido>) {
    const headers = this.getAuthHeaders();
    return this.http
      .put<Pedido>(`${this.API}/${pedido.idPedido}`, pedido, { headers })
      .pipe(first());
  }

  excluir(idPedido: string) {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.API}/${idPedido}`, { headers })
      .pipe(first());
  }
}
