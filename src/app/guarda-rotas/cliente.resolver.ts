import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from, Observable, of } from 'rxjs';

import { ClienteService } from '../clientes/servicos/cliente.service';
import { Cliente } from '../modelo/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteResolver {
  constructor(private service: ClienteService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Cliente> {
    const idCliente = route.params?.['idCliente'];

    const modoOffline =
      sessionStorage.getItem('permission') === 'OFFLINE' ||
      sessionStorage.getItem('offline-mode') === 'true' ||
      !navigator.onLine;

    if (idCliente && modoOffline) {
      return from(this.buscarClienteOfflineOuVazio(idCliente));
    }

    if (idCliente) {
      return this.service.buscarPorId(idCliente);
    }

    return of(this.getClienteVazio());
  }

  private async buscarClienteOfflineOuVazio(
    idCliente: string,
  ): Promise<Cliente> {
    const clienteOffline = await this.service.buscarOfflinePorId(idCliente);

    return clienteOffline || this.getClienteVazio();
  }

  private getClienteVazio(): Cliente {
    return {
      nomeBusca: '',
      idCliente: '',
      nome: '',
      cpfCnpj: '',
      razaoSocial: '',
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
      valorAjudante: '',
      valorAdicional: '',
      precoCx5: '',
      precoCx10: '',
      precoCx15: '',
      precoLv5: '',
      precoLv10: '',
      precoLv15: '',
      observacao: '',
      dataAtualizacaoCliente: '',
    };
  }
}