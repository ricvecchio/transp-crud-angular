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

  private readonly API = 'http://saotomecatimesaotomecatime.com/users';

  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(this.API + '/login', { username, password })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.username);
          this.usuarioSubject.next(value);
        }),
      );
  }

  signup(name: string, email: string, username: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(this.API + '/register', {
        name,
        email,
        username,
        password,
      })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('username', value.username);
          this.usuarioSubject.next(value);
        }),
      );
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    this.usuarioSubject.next(null);
  }

  retornaUsuario() {
    return this.usuarioSubject.asObservable();
  }
}
