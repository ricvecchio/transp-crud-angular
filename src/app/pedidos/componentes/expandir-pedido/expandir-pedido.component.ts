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
import { Pedido } from '../../../modelo/pedido';

@Component({
  selector: 'app-expandir-pedido',
  templateUrl: './expandir-pedido.component.html',
  styleUrl: './expandir-pedido.component.css',
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
export class ExpandirPedidoComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public formUtils: FormUtilsService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    const pedido: Pedido = this.route.snapshot.data['pedido'];

    const formattedDate = this.datePipe.transform(
      pedido.dataAtualizacaoPedido,
      'dd/MM/yyyy HH:mm:ss'
    );

    this.formulario = this.formBuilder.group({
      idPedido: [pedido.idPedido],
      nome: [pedido.nome],
      cpfCnpj: [pedido.cpfCnpj],
      razaoSocial: [pedido.razaoSocial],
      idCliente: [pedido.idCliente],
      telefone: [pedido.telefone],
      celular: [pedido.celular],
      email: [pedido.email],
      contatosAdicionais: [pedido.contatosAdicionais],
      cep: [pedido.cep],
      logradouro: [pedido.logradouro],
      numero: [pedido.numero],
      complemento: [pedido.complemento],
      bairro: [pedido.bairro],
      cidade: [pedido.cidade],
      estado: [pedido.estado],
      tipoPgto: [pedido.tipoPgto],
      infoPagamento: [pedido.infoPagamento],
      cepEntrega: [pedido.cepEntrega],
      logradouroEntrega: [pedido.logradouroEntrega],
      numeroEntrega: [pedido.numeroEntrega],
      complementoEntrega: [pedido.complementoEntrega],
      bairroEntrega: [pedido.bairroEntrega],
      cidadeEntrega: [pedido.cidadeEntrega],
      estadoEntrega: [pedido.estadoEntrega],
      sfobras: [pedido.sfobras],
      cno: [pedido.cno],
      ie: [pedido.ie],
      mangueira: [pedido.mangueira],
      volume: [pedido.volume],
      precoCx5: [pedido.precoCx5],
      precoCx10: [pedido.precoCx10],
      precoCx15: [pedido.precoCx15],
      precoLv5: [pedido.precoLv5],
      precoLv10: [pedido.precoLv10],
      precoLv15: [pedido.precoLv15],
      ajudante: [pedido.ajudante],
      valorAjudante: [pedido.valorAjudante],
      adicional: [pedido.adicional],
      valorAdicional: [pedido.valorAdicional],
      precoFinal: [pedido.precoFinal],
      observacao: [pedido.observacao],
      status: [pedido.status],
      dataAtualizacaoPedido: [formattedDate],
    });
  }

  onSubmitIssue() {
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
        contatosAdicionais: pedido.contatosAdicionais,
        cep: pedido.cep,
        logradouro: pedido.logradouro,
        numero: pedido.numero,
        complemento: pedido.complemento,
        bairro: pedido.bairro,
        cidade: pedido.cidade,
        estado: pedido.estado,
        tipoPgto: pedido.tipoPgto,
        infoPagamento: pedido.infoPagamento,
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
        valorAjudante: pedido.valorAjudante,
        adicional: pedido.adicional,
        valorAdicional: pedido.valorAdicional,
        precoFinal: [pedido.precoFinal],
        observacao: pedido.observacao,
        status: pedido.status,
        dataAtualizacaoPedido: pedido.dataAtualizacaoPedido,
      },
    });
  }

  onBack() {
    this.location.back();
  }
}
