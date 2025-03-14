import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Usuario } from '../modelo/usuario';
import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioResolver {
  constructor(private service: UsuarioService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Usuario> {
    if (route.params && route.params['idUser']) {
      return this.service.buscarPorId(route.params['idUser']);
    }
    return of({
      nomeBusca: '',
      idUser: '',
      name: '',
      email: '',
      username: '',
      password: '',
      permission: '',
    });
  }
}
