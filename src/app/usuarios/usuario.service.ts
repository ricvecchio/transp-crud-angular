import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { Usuario } from '../modelo/usuario';
import { UsuarioPagina } from '../modelo/usuario-pagina';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // private readonly API = `${environment.apiBaseUrl}/users`;
  private readonly API = 'https://saotomecatimesaotomecatime.com/api/users';

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
      .get<UsuarioPagina>(`${this.API}/list`, { headers, params })
      .pipe(first());
  }

  buscarPorId(idUser: String): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/${idUser}`;
    return this.http.get<Usuario>(url, { headers });
  }

  buscarPorUsername(username: String): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/${username}`;
    return this.http.get<Usuario>(url, { headers });
  }

  buscarPorNome(nomeBusca: String): Observable<Usuario[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/trecho/${nomeBusca}`;
    return this.http.get<Usuario[]>(url, { headers });
  }

  salvar(usuario: Partial<Usuario>) {
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
    return this.http.delete(`${this.API}/${idUser}`, { headers }).pipe(first());
  }
}
