import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API = 'https://saotomecatimesaotomecatime.com/api/dashboard';
  // private readonly API = 'http://localhost:8080/api/dashboard'; //EXCLUIR

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

  // listarDadosDashboard(page = 0, pageSize = 60) {
  //   const headers = this.getAuthHeaders();
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('pageSize', pageSize.toString());

  //   return this.http
  //     .get<any[]>(`${this.API}`, { headers, params })
  //     .pipe(first());
  // }
  listarDadosDashboard(page = 0, pageSize = 60) {
  const headers = this.getAuthHeaders();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  return this.http
    .get<{ dados: any[] }>(`${this.API}`, { headers, params })  // Retorna um objeto com 'dados'
    .pipe(first());
}

}
