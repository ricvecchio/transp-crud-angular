import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Pedido } from '../../../modelo/pedido';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-expandir-pedido',
  templateUrl: './expandir-pedido.component.html',
  styleUrl: './expandir-pedido.component.css',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput],
})
export class ExpandirPedidoComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    const pedido: Pedido = this.route.snapshot.data['pedido'];

    this.formulario = this.formBuilder.group({
      dataAtualizacaoPedido: [pedido.dataAtualizacaoPedido],
      idPedido: [pedido.idPedido],
      idCliente: [pedido.idCliente],
      nome: [pedido.nome],
      cpfcnpj: [pedido.cpfcnpj],
      telefone: [pedido.telefone],
      celular: [pedido.celular],
      email: [pedido.email],
      cep: [pedido.cep],
      logradouro: [pedido.logradouro],
      numero: [pedido.numero],
      complemento: [pedido.complemento],
      bairro: [pedido.bairro],
      cidade: [pedido.cidade],
      estado: [pedido.estado],
      nomePedido: [pedido.nomePedido],
      razaoSocial: [pedido.razaoSocial],
      cpfcnpjPedido: [pedido.cpfcnpjPedido],
      tipoPgto: [pedido.tipoPgto],
      cepPedido: [pedido.cepPedido],
      logradouroPedido: [pedido.logradouroPedido],
      numeroPedido: [pedido.numeroPedido],
      complementoPedido: [pedido.complementoPedido],
      bairroPedido: [pedido.bairroPedido],
      cidadePedido: [pedido.cidadePedido],
      estadoPedido: [pedido.estadoPedido],
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
      ajudanteHora: [pedido.ajudanteHora],
      observacao: [pedido.observacao],
    });
    this.formulario.get('dataAtualizacaoPedido')?.disable();
    this.formulario.get('idPedido')?.disable();
    this.formulario.get('idCliente')?.disable();
    this.formulario.get('nome')?.disable();
    this.formulario.get('cpfcnpj')?.disable();
    this.formulario.get('telefone')?.disable();
    this.formulario.get('celular')?.disable();
    this.formulario.get('email')?.disable();
    this.formulario.get('cep')?.disable();
    this.formulario.get('logradouro')?.disable();
    this.formulario.get('numero')?.disable();
    this.formulario.get('complemento')?.disable();
    this.formulario.get('bairro')?.disable();
    this.formulario.get('cidade')?.disable();
    this.formulario.get('estado')?.disable();
    this.formulario.get('nomePedido')?.disable();
    this.formulario.get('razaoSocial')?.disable();
    this.formulario.get('cpfcnpjPedido')?.disable();
    this.formulario.get('tipoPgto')?.disable();
    this.formulario.get('cepPedido')?.disable();
    this.formulario.get('logradouroPedido')?.disable();
    this.formulario.get('numeroPedido')?.disable();
    this.formulario.get('complementoPedido')?.disable();
    this.formulario.get('bairroPedido')?.disable();
    this.formulario.get('cidadePedido')?.disable();
    this.formulario.get('estadoPedido')?.disable();
    this.formulario.get('sfobras')?.disable();
    this.formulario.get('cno')?.disable();
    this.formulario.get('ie')?.disable();
    this.formulario.get('mangueira')?.disable();
    this.formulario.get('volume')?.disable();
    this.formulario.get('precoCx5')?.disable();
    this.formulario.get('precoCx10')?.disable();
    this.formulario.get('precoCx15')?.disable();
    this.formulario.get('precoLv5')?.disable();
    this.formulario.get('precoLv10')?.disable();
    this.formulario.get('precoLv15')?.disable();
    this.formulario.get('ajudanteHora')?.disable();
    this.formulario.get('observacao')?.disable();
    this.formulario.get('status')?.disable();

  }

  onBack() {
    this.location.back();
  }
}
