import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API = 'https://transp-api-crud-spring.onrender.com/api/pedidos';
  // private readonly API = '/api/pedidos';

  constructor(private http: HttpClient) {}

  listar(
    page: number,
    pageSize: number,
    clienteFiltro?: string,
    dataInicial?: string,
    dataFinal?: string,
    statusFiltro?: string,
  ): Observable<PedidoPagina> {
    const params: any = { page, pageSize };
    if (clienteFiltro) params.clienteFiltro = clienteFiltro;
    if (dataInicial) params.dataInicial = dataInicial;
    if (dataFinal) params.dataFinal = dataFinal;
    if (statusFiltro) params.statusFiltro = statusFiltro;

    return this.http.get<PedidoPagina>('https://transp-api-crud-spring.onrender.com/api/pedidos', { params });
  }

  buscarPorId(idPedido: number): Observable<Pedido> {
    const url = `${this.API}/${idPedido}`;
    return this.http.get<Pedido>(url);
  }

  buscarUltimosPedidos(
    idCliente: number,
    limite: number,
  ): Observable<Pedido[]> {
    const params = {
      idCliente: idCliente.toString(),
      limite: limite.toString(),
    };
    return this.http.get<Pedido[]>(`${this.API}/ultimos`, { params });
  }

  salvar(pedido: Partial<Pedido>) {
    if (pedido.idPedido) {
      return this.editar(pedido);
    }
    return this.criar(pedido);
  }

  private criar(pedido: Partial<Pedido>) {
    return this.http.post<Pedido>(this.API, pedido).pipe(first());
  }

  private editar(pedido: Partial<Pedido>) {
    return this.http
      .put<Pedido>(`${this.API}/${pedido.idPedido}`, pedido)
      .pipe(first());
  }

  excluir(idPedido: string) {
    return this.http.delete(`${this.API}/${idPedido}`).pipe(first());
  }
}
