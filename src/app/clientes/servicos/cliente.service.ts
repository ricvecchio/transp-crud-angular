import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Cliente } from '../../modelo/cliente';
import { ClientePagina } from '../../modelo/cliente-pagina';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly API = 'https://transp-api-crud-spring.onrender.com/api/clientes';
  // private readonly API = '/api/clientes';

  constructor(private http: HttpClient) {}

  listar(page = 0, pageSize = 10, filter = '') {
    return this.http
      .get<ClientePagina>(this.API, {
        params: { page, pageSize, filter },
      })
      .pipe(first());
  }

  buscarPorId(idCliente: number): Observable<Cliente> {
    const url = `${this.API}/${idCliente}`;
    return this.http.get<Cliente>(url);
  }

  buscarPorNome(nomeBusca: String): Observable<Cliente[]> {
    const url = `${this.API}/trecho/${nomeBusca}`;
    return this.http.get<Cliente[]>(url);
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
    return this.http.post<Cliente>(this.API, cliente).pipe(first());
  }

  private editar(cliente: Partial<Cliente>) {
    return this.http
      .put<Cliente>(`${this.API}/${cliente.idCliente}`, cliente)
      .pipe(first());
  }

  excluir(idCliente: string) {
    return this.http.delete(`${this.API}/${idCliente}`).pipe(first());
  }
}
