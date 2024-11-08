import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Pedido } from '../modelo/pedido';
import { PedidoService } from '../pedidos/servico/pedido.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoResolver  {

  constructor(private service: PedidoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Pedido> {
    if (route.params && route.params['idPedido']) {
      return this.service.buscarPorId(route.params['idPedido']);
    }
    return of({
      dataAtualizacaoPedido: '',
      idCliente: '',
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
      idPedido: '',
      nomePedido: '',
      razaoSocial: '',
      cpfcnpjPedido: '',
      tipoPgto: '',
      cepPedido: '',
      logradouroPedido: '',
      numeroPedido: '',
      complementoPedido: '',
      bairroPedido: '',
      cidadePedido: '',
      estadoPedido: '',
      sfobras: '',
      cno: '',
      ie: '',
      mangueira: '',
      volume: '',
      precoCx5: '',
      precoCx10: '',
      precoCx15: '',
      precoLv5: '',
      precoLv10: '',
      precoLv15: '',
      ajudanteHora: '',
      observacao: '',
      status: ''
    });
  }
};
