import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Pedido } from '../modelo/pedido';
import { PedidoService } from '../pedidos/servico/pedido.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoResolver {
  constructor(private service: PedidoService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Pedido> {
    if (route.params && route.params['idPedido']) {
      return this.service.buscarPorId(route.params['idPedido']);
    }
    return of({
      idPedido: '',
      nome: '',
      cpfCnpj: '',
      razaoSocial: '',
      idCliente: '',
      telefone: '',
      celular: '',
      email: '',
      contatosAdicionais: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      tipoPgto: '',
      infoPagamento: '',
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
      valorAjudanteVuc: '',
      valorAjudanteToco: '',
      adicionalMangueira: '',
      adicionalBombaGas: '',
      valorAjudante: '',
      valorAdicional: '',
      volume: '',
      precoCx5: '',
      precoCx10: '',
      precoCx15: '',
      precoLv5: '',
      precoLv10: '',
      precoLv15: '',
      precoCx5Sabado: '',
      precoCx10Sabado: '',
      precoCx15Sabado: '',
      precoLv5Sabado: '',
      precoLv10Sabado: '',
      precoLv15Sabado: '',
      entregaSabado: 'NÃO',
      exibirPreco: 'NÃO',
      ajudante: '',
      adicional: '',
      precoFinal: '',
      observacao: '',
      observacao2: '',
      status: '',
      dataAtualizacaoPedido: '',
      imagemPedido: '',
    });
  }
}
