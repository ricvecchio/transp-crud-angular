import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { UsuarioPagina } from '../modelo/usuario-pagina';
import { Usuario } from '../modelo/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // private readonly API = 'https://transp-api-crud-spring.onrender.com/users;
  private readonly API = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token'); // Obtém o token salvo
    const username = sessionStorage.getItem('username'); // Obtém o usuário salvo

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'X-User': username || '', // Adiciona o usuário no header
    });
  }

  listar(page = 0, pageSize = 10, filter = '') {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('filter', filter);

    return this.http
      .get<UsuarioPagina>(`${this.API}/list`, { headers, params })
      .pipe(first());
  }

  buscarPorId(idUser: String): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/${idUser}`;
    return this.http.get<Usuario>(url, { headers });
  }

  buscarPorNome(nomeBusca: String): Observable<Usuario[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/trecho/${nomeBusca}`;
    return this.http.get<Usuario[]>(url, { headers });
  }

  salvar(usuario: Partial<Usuario>) {
    console.log('Salvar Service idUser: ' + usuario.idUser); // EXCLUIR
    console.log('Salvar Service permission: ' + usuario.permission); // EXCLUIR
    if (usuario.idUser) {
      return this.editar(usuario);
    }
    return this.criar(usuario);
  }

  salvarEmitir(usuario: Partial<Usuario>) {
    return this.criar(usuario);
  }

  private criar(usuario: Partial<Usuario>) {
    const headers = this.getAuthHeaders();
    return this.http
      .post<Usuario>(this.API, usuario, { headers })
      .pipe(first());
  }

  private editar(usuario: Partial<Usuario>) {
    const headers = this.getAuthHeaders();
    return this.http
      .put<Usuario>(`${this.API}/${usuario.idUser}`, usuario, { headers })
      .pipe(first());
  }

  excluir(idUser: string) {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.API}/${idUser}`, { headers })
      .pipe(first());
  }
}
