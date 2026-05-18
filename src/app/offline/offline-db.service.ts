import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { Cliente } from '../modelo/cliente';
import { Pedido } from '../modelo/pedido';

export interface PedidoOffline {
  offlineId: string;
  pedido: Partial<Pedido>;
  sincronizado: boolean;
  dataCriacaoOffline: string;
  dataSincronizacao?: string;
  idPedidoBackend?: string;
  erroSincronizacao?: string;
}

export interface ClienteOffline {
  offlineId: string;
  cliente: Partial<Cliente>;
  sincronizado: boolean;
  dataCriacaoOffline: string;
  dataSincronizacao?: string;
  idClienteBackend?: string;
  erroSincronizacao?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OfflineDbService extends Dexie {
  offlinePedidos!: Table<PedidoOffline, string>;

  offlineClientes!: Table<Cliente, string>;

  offlineClientesPendentes!: Table<ClienteOffline, string>;

  constructor() {
    super('transportadora-offline-db');

    this.version(3).stores({
      offlinePedidos:
        'offlineId, sincronizado, dataCriacaoOffline, dataSincronizacao, idPedidoBackend',

      offlineClientes:
        'idCliente, nome, razaoSocial, cpfCnpj, cidade, estado',

      offlineClientesPendentes:
        'offlineId, sincronizado, dataCriacaoOffline, dataSincronizacao, idClienteBackend',
    });
  }

  async salvarClientesOffline(clientes: Cliente[]): Promise<void> {
    await this.offlineClientes.clear();

    await this.offlineClientes.bulkPut(clientes);
  }

  async listarClientesOffline(): Promise<Cliente[]> {
    const clientesCacheados = await this.offlineClientes.toArray();

    const clientesPendentes = await this.offlineClientesPendentes.toArray();

    const clientesOfflineNovos = clientesPendentes.map((clientePendente) => ({
      ...clientePendente.cliente,
      idCliente: clientePendente.offlineId,
    })) as Cliente[];

    return [...clientesOfflineNovos, ...clientesCacheados];
  }

  async buscarClienteOfflinePorId(
    idCliente: string,
  ): Promise<Cliente | undefined> {
    const clientePendente = await this.offlineClientesPendentes.get(idCliente);

    if (clientePendente) {
      return {
        ...clientePendente.cliente,
        idCliente: clientePendente.offlineId,
      } as Cliente;
    }

    const clientesCacheados = await this.offlineClientes.toArray();

    return clientesCacheados.find(
      (cliente) => String(cliente.idCliente) === String(idCliente),
    );
  }

  async buscarClientesOfflinePorFiltro(filtro: string): Promise<Cliente[]> {
    const filtroNormalizado = filtro.trim().toLowerCase();

    const clientes = await this.listarClientesOffline();

    return clientes.filter((cliente) => {
      return (
        cliente.nome?.toLowerCase().includes(filtroNormalizado) ||
        cliente.razaoSocial?.toLowerCase().includes(filtroNormalizado) ||
        cliente.cpfCnpj?.toLowerCase().includes(filtroNormalizado)
      );
    });
  }

  async salvarClienteOffline(clienteOffline: ClienteOffline): Promise<string> {
    await this.offlineClientesPendentes.put(clienteOffline);

    return clienteOffline.offlineId;
  }

  async listarClientesPendentes(): Promise<ClienteOffline[]> {
    return this.offlineClientesPendentes
      .filter((cliente) => cliente.sincronizado === false)
      .toArray();
  }

  async marcarClienteComoSincronizado(
    offlineId: string,
    idClienteBackend: string,
  ): Promise<void> {
    await this.offlineClientesPendentes.update(offlineId, {
      sincronizado: true,
      idClienteBackend,
      dataSincronizacao: new Date().toISOString(),
      erroSincronizacao: '',
    });
  }

  async salvarPedidoOffline(pedidoOffline: PedidoOffline): Promise<string> {
    await this.offlinePedidos.put(pedidoOffline);

    return pedidoOffline.offlineId;
  }

  async listarPedidosPendentes(): Promise<PedidoOffline[]> {
    return this.offlinePedidos
      .filter((pedidoOffline) => pedidoOffline.sincronizado === false)
      .toArray();
  }

  async listarTodosPedidosOffline(): Promise<PedidoOffline[]> {
    return this.offlinePedidos.orderBy('dataCriacaoOffline').reverse().toArray();
  }

  async buscarPedidoOffline(
    offlineId: string,
  ): Promise<PedidoOffline | undefined> {
    return this.offlinePedidos.get(offlineId);
  }

  async marcarComoSincronizado(
    offlineId: string,
    idPedidoBackend: string,
  ): Promise<void> {
    await this.offlinePedidos.update(offlineId, {
      sincronizado: true,
      idPedidoBackend,
      dataSincronizacao: new Date().toISOString(),
      erroSincronizacao: '',
    });
  }

  async registrarErroSincronizacao(
    offlineId: string,
    erroSincronizacao: string,
  ): Promise<void> {
    await this.offlinePedidos.update(offlineId, {
      erroSincronizacao,
    });
  }

  async removerPedidoOffline(offlineId: string): Promise<void> {
    await this.offlinePedidos.delete(offlineId);
  }

  gerarIdOffline(): string {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');

    return `OFF-${ano}${mes}${dia}-${hora}${minuto}${segundo}`;
  }
}