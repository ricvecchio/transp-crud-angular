import { Pedido } from './pedido';

export interface PedidoPagina {
  pedidos: Pedido[];
  totalElementos: number;
  totalPaginas: number;
}
