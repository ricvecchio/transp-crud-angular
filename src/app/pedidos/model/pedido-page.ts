import { Pedido } from "./pedido";

export interface PedidoPage {
  pedidos: Pedido[];
  totalElements: number;
  totalPages: number;
}
