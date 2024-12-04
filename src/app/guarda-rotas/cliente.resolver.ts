import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Cliente } from '../modelo/cliente';
import { ClienteService } from '../clientes/servicos/cliente.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteResolver {
  constructor(private service: ClienteService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Cliente> {
    if (route.params && route.params['idCliente']) {
      return this.service.buscarPorId(route.params['idCliente']);
    }
    return of({
      nomeBusca: '',
      idCliente: '',
      nome: '',
      cpfCnpj: '',
      razaoSocial: '',
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
      tipoPgto: '',
      cepEntrega: '',
      logradouroEntrega: '',
      numeroEntrega: '',
      complementoEntrega: '',
      bairroEntrega: '',
      cidadeEntrega: '',
      estadoEntrega: '',
      sfobras: '',
      cno: '',
      ie: '',
      mangueira: '',
      precoCx5: '',
      precoCx10: '',
      precoCx15: '',
      precoLv5: '',
      precoLv10: '',
      precoLv15: '',
      observacao: '',
      dataAtualizacaoCliente: '',
    });
  }
}
