export interface Pedido {
  idPedido: string;
  nome: string;
  cpfCnpj: string;
  razaoSocial: string;
  idCliente: string;
  telefone: string;
  celular: string;
  email: string;
  contatosAdicionais: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  tipoPgto: string;
  infoPagamento: string;
  cepEntrega: string;
  logradouroEntrega: string;
  numeroEntrega: string;
  complementoEntrega: string;
  bairroEntrega: string;
  cidadeEntrega: string;
  estadoEntrega: string;
  sfobras: string;
  cno: string;
  ie: string;
  mangueira: string;
  volume: string;
  precoCx5: string;
  precoCx10: string;
  precoCx15: string;
  precoLv5: string;
  precoLv10: string;
  precoLv15: string;
  ajudante: string;
  observacao: string;
  status: string;
  dataAtualizacaoPedido: string;
  imagemPedido: string;
}
