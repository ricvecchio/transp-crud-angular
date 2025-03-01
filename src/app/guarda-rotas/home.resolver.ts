import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsuarioService } from '../usuarios/usuario.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HomeResolver {
  usuario = '';
  senha = '';

  constructor(private service: UsuarioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const username = route.paramMap.get('username'); // Ou obter de outro lugar
    return this.service.buscarPorUsername(username || '');
  }
}
