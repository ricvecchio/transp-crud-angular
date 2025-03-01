import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsuarioService } from '../usuarios/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class HomeResolver {
  usuario = '';
  senha = '';

  constructor(private service: UsuarioService) {}

  resolve(): Observable<any> {
    return this.service.buscarPorUsername(this.usuario);
  }
}
