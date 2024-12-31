import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Cliente } from '../../../modelo/cliente';
import { Pedido } from '../../../modelo/pedido';
import { PedidoService } from '../../../pedidos/servico/pedido.service';

@Component({
  selector: 'app-expandir-cliente',
  templateUrl: './expandir-cliente.component.html',
  styleUrl: './expandir-cliente.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  providers: [DatePipe],
})
export class ExpandirClienteComponent implements OnInit {
  formulario!: FormGroup;

  ultimosPedidos: {
    dataPedido: string;
    volume: string;
    valor: string;
    idPedido: number;
  }[] = [];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public formUtils: FormUtilsService,
    private datePipe: DatePipe,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit(): void {
    const cliente: Cliente = this.route.snapshot.data['cliente'];

    this.carregarUltimosPedidos(Number(cliente.idCliente));
    const formattedDate = this.datePipe.transform(
      cliente.dataAtualizacaoCliente,
      'dd/MM/yyyy',
    );

    this.formulario = this.formBuilder.group({
      idCliente: [cliente.idCliente],
      nome: [cliente.nome],
      cpfCnpj: [cliente.cpfCnpj],
      razaoSocial: [cliente.razaoSocial],
      telefone: [cliente.telefone],
      celular: [cliente.celular],
      email: [cliente.email],
      cep: [cliente.cep],
      logradouro: [cliente.logradouro],
      numero: [cliente.numero],
      complemento: [cliente.complemento],
      bairro: [cliente.bairro],
      cidade: [cliente.cidade],
      estado: [cliente.estado],
      tipoPgto: [cliente.tipoPgto],
      cepEntrega: [cliente.cepEntrega],
      logradouroEntrega: [cliente.logradouroEntrega],
      numeroEntrega: [cliente.numeroEntrega],
      complementoEntrega: [cliente.complementoEntrega],
      bairroEntrega: [cliente.bairroEntrega],
      cidadeEntrega: [cliente.cidadeEntrega],
      estadoEntrega: [cliente.estadoEntrega],
      sfobras: [cliente.sfobras],
      cno: [cliente.cno],
      ie: [cliente.ie],
      mangueira: [cliente.mangueira],
      precoCx5: [cliente.precoCx5],
      precoCx10: [cliente.precoCx10],
      precoCx15: [cliente.precoCx15],
      precoLv5: [cliente.precoLv5],
      precoLv10: [cliente.precoLv10],
      precoLv15: [cliente.precoLv15],
      observacao: [cliente.observacao],
      dataAtualizacaoCliente: [formattedDate],
    });
  }

  private carregarUltimosPedidos(idCliente: number): void {
    this.pedidoService
      .buscarUltimosPedidos(idCliente, 3)
      .subscribe((pedidos) => {
        this.ultimosPedidos = pedidos.map((pedido) => {
          let valor = '';

          switch (pedido.volume) {
            case 'CX-5m³':
              valor = pedido.precoCx5;
              break;
            case 'CX-10m³':
              valor = pedido.precoCx10;
              break;
            case 'CX-15m³':
              valor = pedido.precoCx15;
              break;
            case 'LAV-5m³':
              valor = pedido.precoLv5;
              break;
            case 'LAV-10m³':
              valor = pedido.precoLv10;
              break;
            case 'LAV-15m³':
              valor = pedido.precoLv15;
              break;
            default:
              valor = '';
          }

          return {
            dataPedido:
              this.datePipe.transform(
                pedido.dataAtualizacaoPedido,
                'dd/MM/yyyy',
              ) || '',
            volume: pedido.volume,
            valor: valor,
            idPedido: Number(pedido.idPedido),
          };
        });
      });
  }

  onSubmit() {
    const pedido = this.formulario.value as Pedido;

    this.router.navigate(['/cadastrar-pedido'], {
      queryParams: {
        idPedido: pedido.idPedido,
        nome: pedido.nome,
        cpfCnpj: pedido.cpfCnpj,
        razaoSocial: pedido.razaoSocial,
        idCliente: pedido.idCliente,
        telefone: pedido.telefone,
        celular: pedido.celular,
        email: pedido.email,
        cep: pedido.cep,
        logradouro: pedido.logradouro,
        numero: pedido.numero,
        complemento: pedido.complemento,
        bairro: pedido.bairro,
        cidade: pedido.cidade,
        estado: pedido.estado,
        tipoPgto: pedido.tipoPgto,
        cepEntrega: pedido.cepEntrega,
        logradouroEntrega: pedido.logradouroEntrega,
        numeroEntrega: pedido.numeroEntrega,
        complementoEntrega: pedido.complementoEntrega,
        bairroEntrega: pedido.bairroEntrega,
        cidadeEntrega: pedido.cidadeEntrega,
        estadoEntrega: pedido.estadoEntrega,
        sfobras: pedido.sfobras,
        cno: pedido.cno,
        ie: pedido.ie,
        mangueira: pedido.mangueira,
        volume: pedido.volume,
        precoCx5: pedido.precoCx5,
        precoCx10: pedido.precoCx10,
        precoCx15: pedido.precoCx15,
        precoLv5: pedido.precoLv5,
        precoLv10: pedido.precoLv10,
        precoLv15: pedido.precoLv15,
        ajudante: pedido.ajudante,
        status: pedido.status,
        dataAtualizacaoPedido: pedido.dataAtualizacaoPedido,
      },
    });
  }

  onBack() {
    this.location.back();
  }
}
