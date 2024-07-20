import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, first, of, tap } from 'rxjs';
import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly API = 'api/clientes'
  // private readonly API = 'http://localhost:2000/clientes'
  // private readonly API = '/backend/db.json';

  constructor(private http: HttpClient) { }

  listar(page = 0, pageSize = 10) {
    return this.http.get<PedidoPagina>(this.API, { params: { page, pageSize } })
      .pipe(
        first(),
      );
  }

  buscarPorId(id: number): Observable<Pedido> {
    const url = `${this.API}/${id}`
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

}
