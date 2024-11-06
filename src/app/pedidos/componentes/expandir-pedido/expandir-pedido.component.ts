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
    });
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
  }

  onBack() {
    this.location.back();
  }
}

// idPedido: string;
// nomePedido: string;
// razaoSocial: string;
// cpfcnpjPedido: string;
// tipoPgto: string;
// cepPedido: string;
// logradouroPedido: string;
// numeroPedido: string;
// complementoPedido: string;
// bairroPedido: string;
// cidadePedido: string;
// estadoPedido: string;
// sfobras: string;
// cno: string;
// ie: string;
// mangueira: string;
// volume: string;
// precoCx5: string;
// precoCx10: string;
// precoCx15: string;
// precoLv5: string;
// precoLv10: string;
// precoLv15: string;
// ajudanteHora: string;
// observacao: string;
// status: string;
