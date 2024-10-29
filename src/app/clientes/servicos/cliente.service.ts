import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { Cliente } from '../../modelo/cliente';
import { ClientePagina } from '../../modelo/cliente-pagina';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // private readonly API = 'http://localhost:2000/clientes'
    private readonly API = '/api/clientes'

  constructor(private http: HttpClient) { }

  listar(page = 0, pageSize = 10) {
    return this.http.get<ClientePagina>(this.API, { params: { page, pageSize } })
      .pipe(
        first(),
      );
  }

  buscarPorId(id: number): Observable<Cliente> {
    const url = `${this.API}/${id}`
    return this.http.get<Cliente>(url)
  }

  // buscarPorNome(nome: String): Observable<Cliente> {
  //   const url = `${this.API}/trecho/${nome}`
  //   return this.http.get<Cliente>(url)
  // }

  salvar(cliente: Partial<Cliente>) {
    if (cliente.id) {
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
    return this.http.put<Cliente>(`${this.API}/${cliente.id}`, cliente).pipe(first());
  }

  excluir(idCliente: string) {
    return this.http.delete(`${this.API}/${idCliente}`).pipe(first());
  }

}
