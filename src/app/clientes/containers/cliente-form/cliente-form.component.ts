import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Pedido } from '../../../pedidos/model/pedido';
import { ConsultaCepService } from '../../../pedidos/service/consulta-cep.service';
import { Cliente } from '../../modelo/cliente';
import { ClienteService } from '../../servicos/cliente.service';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint, MatError, MatPrefix } from '@angular/material/form-field';

@Component({
    selector: 'app-cliente-form',
    templateUrl: './cliente-form.component.html',
    styleUrl: './cliente-form.component.css',
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatError,
    MatPrefix
],
})
export class ClienteFormComponent implements OnInit {

  formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private consultaCepService: ConsultaCepService,
    private service: ClienteService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    const cliente: Cliente = this.route.snapshot.data['cliente'];

    this.formulario = this.formBuilder.group({
      id: [cliente.id],
      nome: [cliente.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(100),],],
      cpfcnpj: [cliente.cpfcnpj, [Validators.required]],
      telefone: [cliente.telefone, [Validators.required]],
      celular: [cliente.celular],
      email: [cliente.email, [Validators.required]],
      cep: [cliente.cep, [Validators.required]],
      logradouro: [cliente.logradouro, [Validators.required]],
      numero: [cliente.numero],
      complemento: [cliente.complemento],
      bairro: [cliente.bairro],
      cidade: [cliente.cidade],
      estado: [cliente.estado],
      pedidos: this.formBuilder.array(this.obterPedidos(cliente),),
    });
  }

  private obterPedidos(cliente: Cliente) {
    const pedidos = [];
    if (cliente?.pedidos) {
      cliente.pedidos.forEach((pedido) =>
        pedidos.push(this.criarPedido(pedido)),
      );
    } else {
      pedidos.push(this.criarPedido());
    }
    return pedidos;
  }

  private criarPedido(
    pedido: Pedido = {
      idPedido: '',
      nomePedido: '',
      razaoSocial: '',
      cpfcnpjPedido: '',
      tipoPgto: '',
      cepPedido: '',
      logradouroPedido: '',
      numeroPedido: '',
      complementoPedido: '',
      bairroPedido: '',
      cidadePedido: '',
      estadoPedido: '',
      sfobras: '',
      cno: '',
      ie: '',
      mangueira: '',
      volume: '',
      precoCx5: '',
      precoCx10: '',
      precoCx15: '',
      precoLv5: '',
      precoLv10: '',
      precoLv15: '',
      ajudanteHora: '',
      observacao: '',
    },
  ) {
    return this.formBuilder.group({
      idPedido: [pedido.idPedido],
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
  }

  // getPedidosFormArray() {
  //   return (<UntypedFormArray>this.formulario.get('pedidos')).controls;
  // }

  // addNovoPedido() {
  //   const pedidos = this.formulario.get('pedidos') as UntypedFormArray;
  //   pedidos.push(this.criarPedido());
  // }

  // removePedido(index: number) {
  //   const pedidos = this.formulario.get('pedidos') as UntypedFormArray;
  //   pedidos.removeAt(index);
  // }

  // formulario = this.formBuilder.group({
  //   idCliente: [''],
  //   nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100),],],
  //   cpfcnpj: ['', Validators.required],
  //   telefone: ['', Validators.required],
  //   celular: [''],
  //   email: ['', [Validators.required, Validators.email]],
  //   cep: ['', [Validators.required, Validators.pattern('^(d{5})(-?d{3})$')]],
  //   logradouro: [''],
  //   numero: [''],
  //   complemento: [''],
  //   bairro: [''],
  //   cidade: [''],
  //   estado: [''],
  // });

  // clientes: Cliente[] = [];

  // @Input() dadosCliente: Cliente = {
  //   idCliente: '',
  //   nome: '',
  //   cpfcnpj: '',
  //   telefone: '',
  //   celular: '',
  //   email: '',
  //   cep: '',
  //   logradouro: '',
  //   numero: '',
  //   complemento: '',
  //   bairro: '',
  //   cidade: '',
  //   estado: '',
  // };



  consultaCEP() {
    const cep = this.formulario.get('cep')?.value;
    if (cep != '') {
      this.consultaCepService.getConsultaCep(cep).subscribe((dados: any) => {
        this.formulario.patchValue({
          logradouro: dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,
        });
      });
    }
  }

  dataAtual: Date = new Date();

  checked = false;
  disabled = false;

  onSubmit() {
    if (this.formulario.valid) {
    this.service.salvar(this.formulario.value).subscribe(
      (result) => this.onSucess(),
      (error) => this.onError(),
    );
    } else {
      this.formUtils.validarTodosCamposFormFields(this.formulario);
    }
  }

  private onSucess() {
    this.snackBar.open('Cliente Salvo com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o cliente!', '', { duration: 5000 });
  }
}
