import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../modelo/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioResolver {
  constructor(private service: UsuarioService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Usuario> {
    if (route.params && route.params['idUsuario']) {
      return this.service.buscarPorId(route.params['idUsuario']);
    }
    return of({
      nomeBusca: '',
      idUsuario: '',
      name: '',
      email: '',
      username: '',
      password: '',
      permission: '',
    });
  }
}
