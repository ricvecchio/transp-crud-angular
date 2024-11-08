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
import { ActivatedRoute } from '@angular/router';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Cliente } from '../../../modelo/cliente';

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
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    const cliente: Cliente = this.route.snapshot.data['cliente'];

    this.formulario = this.formBuilder.group({
      dataAtualizacaoCliente: [cliente.dataAtualizacaoCliente],
      idCliente: [cliente.idCliente],
      nome: [cliente.nome],
      cpfcnpj: [cliente.cpfcnpj],
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
    });
    this.formulario.get('dataAtualizacaoCliente')?.disable();
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
