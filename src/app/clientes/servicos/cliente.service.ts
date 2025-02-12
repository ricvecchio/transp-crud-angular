import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Cliente } from '../../modelo/cliente';
import { ClientePagina } from '../../modelo/cliente-pagina';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  // private readonly API = 'https://transp-api-crud-spring.onrender.com/api/clientes';
  private readonly API = 'http://82.29.62.50:8080/api/clientes';
  // private readonly API = '/api/clientes';

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

  listar(page = 0, pageSize = 10, filter = '') {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('filter', filter);

    return this.http
      .get<ClientePagina>(this.API, { headers, params })
      .pipe(first());
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
    return this.http
      .post<Cliente>(this.API, cliente, { headers })
      .pipe(first());
  }

  private editar(cliente: Partial<Cliente>) {
    const headers = this.getAuthHeaders();
    return this.http
      .put<Cliente>(`${this.API}/${cliente.idCliente}`, cliente, { headers })
      .pipe(first());
  }

  excluir(idCliente: string) {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.API}/${idCliente}`, { headers })
      .pipe(first());
  }
}
