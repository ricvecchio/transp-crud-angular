import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API = `${environment.apiBaseUrl}/dashboard`;

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

  listarDadosDashboard(page = 0, pageSize = 60) {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<{ dados: any[] }>(`${this.API}`, { headers, params })
      .pipe(first());
  }
}
