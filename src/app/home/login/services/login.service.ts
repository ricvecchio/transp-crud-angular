import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginResponse } from '../types/login-response.types';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private usuarioSubject = new BehaviorSubject<LoginResponse | null>(null);

  apiUrl: string = 'http://localhost:8080/users';

  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/login', { username, password })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.username);
          this.usuarioSubject.next(value); // Atualiza o usuário logado
        }),
      );
  }

  signup(name: string, email: string, username: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/register', {
        name,
        email,
        username,
        password,
      })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.username);
          this.usuarioSubject.next(value); // Atualiza o usuário logado
        }),
      );
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    this.usuarioSubject.next(null); // Notifica que o usuário saiu
  }

  retornaUsuario() {
    return this.usuarioSubject.asObservable();
  }
}
