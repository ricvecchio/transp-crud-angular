import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, first, of, tap } from 'rxjs';
import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly API = '/api/pedidos'
  // private readonly API = 'http://localhost:2000/pedidos'
  // private readonly API = '/backend/db.json';

  constructor(private http: HttpClient) { }

  listar(page = 0, pageSize = 10, dataInicial?: string, dataFinal?: string): Observable<PedidoPagina> {
    const params: any = { page, pageSize };
    if (dataInicial) params.dataInicial = dataInicial;
    if (dataFinal) params.dataFinal = dataFinal;

    return this.http.get<PedidoPagina>(this.API, { params }).pipe(first());
  }

  buscarPorId(idPedido: number): Observable<Pedido> {
    const url = `${this.API}/${idPedido}`
    return this.http.get<Pedido>(url)
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
    return this.http.put<Pedido>(`${this.API}/${pedido.idPedido}`, pedido).pipe(first());
  }

  excluir(idPedido: string) {
    return this.http.delete(`${this.API}/${idPedido}`).pipe(first());
  }
}
