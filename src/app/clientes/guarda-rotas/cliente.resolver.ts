import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Cliente } from '../../modelo/cliente';
import { ClienteService } from '../servicos/cliente.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteResolver  {

  constructor(private service: ClienteService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cliente> {
    if (route.params && route.params['id']) {
      return this.service.buscarPorId(route.params['id']);
    }
    return of({
      id: '',
      nome: '',
      cpfcnpj: '',
      telefone: '',
      celular: '',
      email: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pedidos: []
    });
  }
};
