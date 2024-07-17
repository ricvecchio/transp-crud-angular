import { Cliente } from "./cliente";

export interface ClientePagina {
  clientes: Cliente[];
  totalElementos: number;
  totalPaginas: number;
}
