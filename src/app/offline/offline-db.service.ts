import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

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

@Injectable({
  providedIn: 'root',
})
export class OfflineDbService extends Dexie {
  offlinePedidos!: Table<PedidoOffline, string>;

  constructor() {
    super('transportadora-offline-db');

    this.version(1).stores({
      offlinePedidos:
        'offlineId, sincronizado, dataCriacaoOffline, dataSincronizacao, idPedidoBackend',
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