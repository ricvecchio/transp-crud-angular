import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Cliente } from '../../../modelo/cliente';
import { ClienteService } from '../../servicos/cliente.service';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint, MatError, MatPrefix } from '@angular/material/form-field';
import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { Pedido } from '../../../modelo/pedido';

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
    private router: Router,
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

  onSubmitSave() {
    if (this.formulario.valid) {
    this.service.salvar(this.formulario.value).subscribe(
      (result) => this.onSucess(),
      (error) => this.onError(),
    );
    } else {
      this.formUtils.validarTodosCamposFormFields(this.formulario);
    }
  }

  onSubmitIssue() {
    if (this.formulario.valid) {
    this.service.salvarEmitir(this.formulario.value).subscribe(
      (result) => this.onSucessIssue(),
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

  private onSucessIssue() {
    this.router.navigate(['/cadastrar-pedido'], { relativeTo: this.route });
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o cliente!', '', { duration: 5000 });
  }
}
