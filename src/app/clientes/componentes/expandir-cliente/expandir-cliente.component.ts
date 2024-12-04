import { Location } from '@angular/common';
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

@Component({
  selector: 'app-expandir-cliente',
  templateUrl: './expandir-cliente.component.html',
  styleUrl: './expandir-cliente.component.css',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput],
})
export class ExpandirClienteComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    const cliente: Cliente = this.route.snapshot.data['cliente'];

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
      dataAtualizacaoCliente: [cliente.dataAtualizacaoCliente],
    });
    this.formulario.get('idCliente')?.disable();
    this.formulario.get('nome')?.disable();
    this.formulario.get('cpfCnpj')?.disable();
    this.formulario.get('razaoSocial')?.disable();
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
    this.formulario.get('tipoPgto')?.disable();
    this.formulario.get('cepEntrega')?.disable();
    this.formulario.get('logradouroEntrega')?.disable();
    this.formulario.get('numeroEntrega')?.disable();
    this.formulario.get('complementoEntrega')?.disable();
    this.formulario.get('bairroEntrega')?.disable();
    this.formulario.get('cidadeEntrega')?.disable();
    this.formulario.get('estadoEntrega')?.disable();
    this.formulario.get('sfobras')?.disable();
    this.formulario.get('cno')?.disable();
    this.formulario.get('ie')?.disable();
    this.formulario.get('mangueira')?.disable();
    this.formulario.get('precoCx5')?.disable();
    this.formulario.get('precoCx10')?.disable();
    this.formulario.get('precoCx15')?.disable();
    this.formulario.get('precoLv5')?.disable();
    this.formulario.get('precoLv10')?.disable();
    this.formulario.get('precoLv15')?.disable();
    this.formulario.get('observacao')?.disable();
    this.formulario.get('dataAtualizacaoCliente')?.disable();
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
