import { Usuario } from "./usuario";

export interface UsuarioPagina {
  usuarios: Usuario[];
  totalElementos: number;
  totalPaginas: number;
}
