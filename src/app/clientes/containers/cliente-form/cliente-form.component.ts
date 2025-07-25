import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';

import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { MensagemService } from '../../../compartilhado/mensagem.service';
import { Cliente } from '../../../modelo/cliente';
import { ClienteService } from './../../../clientes/servicos/cliente.service';

export interface User {
  name: string;
}

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatError,
    MatPrefix,
    MatDividerModule,
    MatListModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
  ],
})
export class ClienteFormComponent implements OnInit {
  formulario!: FormGroup;
  isPaymentChecked = false;
  listaOpcoesPgto: string[] = [
    '10 dias',
    '11 dias',
    '12 dias',
    '13 dias',
    '14 dias',
    '15 dias',
    '16 dias',
    '17 dias',
    '18 dias',
    '19 dias',
    '20 dias',
    '21 dias',
    '22 dias',
    '23 dias',
    '24 dias',
    '25 dias',
    '26 dias',
    '27 dias',
    '28 dias',
    '29 dias',
    '30 dias',
  ];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private consultaCepService: ConsultaCepService,
    private clienteService: ClienteService,
    private mensagemService: MensagemService,
    private location: Location,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    const cliente: Cliente = this.route.snapshot.data['cliente'];

    this.formulario = this.formBuilder.group({
      nomeBusca: [cliente.nomeBusca],
      idCliente: [cliente.idCliente],
      nome: [
        cliente.nome,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      cpfCnpj: [cliente.cpfCnpj],
      razaoSocial: [cliente.razaoSocial],
      telefone: [cliente.telefone, [Validators.required]],
      celular: [cliente.celular],
      email: [cliente.email, [Validators.required]],
      contatosAdicionais: [cliente.contatosAdicionais],
      cep: [this.formatarCep(cliente.cep)],
      logradouro: [cliente.logradouro, [Validators.required]],
      numero: [cliente.numero],
      complemento: [cliente.complemento],
      bairro: [cliente.bairro],
      cidade: [cliente.cidade],
      estado: [cliente.estado],
      tipoPgto: [cliente.tipoPgto],
      infoPagamento: [cliente.infoPagamento],
      cepEntrega: [this.formatarCep(cliente.cepEntrega)],
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
      valorAjudante: cliente.valorAjudante
        ? this.formatarParaReais(cliente.valorAjudante)
        : '80,00',
      valorAdicional: cliente.valorAdicional
        ? this.formatarParaReais(cliente.valorAdicional)
        : '30,00',
      precoCx5: [this.formatarParaReais(cliente.precoCx5)],
      precoCx10: [this.formatarParaReais(cliente.precoCx10)],
      precoCx15: [this.formatarParaReais(cliente.precoCx15)],
      precoLv5: [this.formatarParaReais(cliente.precoLv5)],
      precoLv10: [this.formatarParaReais(cliente.precoLv10)],
      precoLv15: [this.formatarParaReais(cliente.precoLv15)],
      observacao: [cliente.observacao],
      dataAtualizacaoCliente: [cliente.dataAtualizacaoCliente],
    });

    this.isPaymentChecked = cliente.tipoPgto === 'Á VISTA';
    if (cliente.tipoPgto && cliente.tipoPgto !== 'Á VISTA') {
      this.formulario.patchValue({ tipoPgto: cliente.tipoPgto });
    }

    this.formatarCampoCep();

    this.formatarCampos([
      'valorAjudante',
      'valorAdicional',
      'precoCx5',
      'precoCx10',
      'precoCx15',
      'precoLv5',
      'precoLv10',
      'precoLv15',
    ]);
  }

  onCpfCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 14) {
      value = value.substring(0, 14);
    }

    let formattedValue = '';
    if (value.length > 11) {
      formattedValue = value.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
        '$1.$2.$3/$4-$5',
      );
    } else if (value.length === 11) {
      formattedValue = value.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2}).*/,
        '$1.$2.$3-$4',
      );
    } else if (value.length > 6) {
      formattedValue = value.replace(/^(\d{3})(\d{3})(\d+).*/, '$1.$2.$3');
    } else if (value.length > 3) {
      formattedValue = value.replace(/^(\d{3})(\d+).*/, '$1.$2');
    } else {
      formattedValue = value;
    }

    input.value = formattedValue;
    this.formulario.get('cpfCnpj')?.setValue(formattedValue);

    const cpfCnpjControl = this.formulario.get('cpfCnpj');

    const isCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formattedValue);
    const isCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formattedValue);
    const isEmpty = formattedValue.trim() === '';

    if (cpfCnpjControl) {
      if (isCpf || isCnpj || isEmpty) {
        cpfCnpjControl.setErrors(null);
      } else {
        cpfCnpjControl.setErrors({ invalidCpfCnpj: true });
        setTimeout(() => {
          input.focus();
        });
      }
    }
  }

  onTelefoneOuCelularInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (controlName === 'telefone' && value.length > 10) {
      value = value.substring(0, 10);
    } else if (controlName === 'celular' && value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length === 11) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length === 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d+)$/, '($1) $2');
    }

    input.value = value;
    this.formulario.get(controlName)?.setValue(value);
  }

  private formatarCampoCep(): void {
    const cepControl = this.formulario.get('cep');
    if (cepControl) {
      cepControl.valueChanges.subscribe((valor) => {
        const formatado = this.formatarCep(valor);
        if (formatado !== valor) {
          cepControl.setValue(formatado, { emitEvent: false });
        }
      });
    }
    const cepEntregaControl = this.formulario.get('cepEntrega');
    if (cepEntregaControl) {
      cepEntregaControl.valueChanges.subscribe((valor) => {
        const formatado = this.formatarCep(valor);
        if (formatado !== valor) {
          cepEntregaControl.setValue(formatado, { emitEvent: false });
        }
      });
    }
  }

  private formatarCep(valor: any): string {
    if (!valor) return '';
    valor = valor.toString().replace(/\D/g, '');
    if (valor.length > 5) {
      valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
    }
    return valor;
  }

  consultaCEP() {
    const cep = this.formulario.get('cep')?.value;
    const cepEntrega = this.formulario.get('cepEntrega')?.value;
    if (!this.isAdressChecked && cepEntrega != '') {
      this.consultaCepService
        .getConsultaCep(cepEntrega)
        .subscribe((dados: any) => {
          this.formulario.patchValue({
            logradouroEntrega: dados.logradouro,
            bairroEntrega: dados.bairro,
            cidadeEntrega: dados.localidade,
            estadoEntrega: dados.uf,
          });
        });
    } else if (cep != '') {
      this.consultaCepService.getConsultaCep(cep).subscribe((dados: any) => {
        this.formulario.patchValue({
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,
        });
      });
    }
  }

  private formatarCampos(campos: string[]): void {
    campos.forEach((campo) => {
      this.formulario.get(campo)?.valueChanges.subscribe((valor) => {
        const formatado = this.formatarParaReais(valor);
        if (valor !== formatado) {
          this.formulario.get(campo)?.setValue(formatado, { emitEvent: false });
        }
      });
    });
  }

  private formatarParaReais(valor: any): string {
    if (!valor) return '';
    valor = valor.toString().replace(/[^\d]/g, '');
    const numero = parseFloat(valor) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  checked = false;

  onPaymentCheckBoxChange(event: any): void {
    this.isPaymentChecked = event.checked;

    if (this.isPaymentChecked) {
      this.formulario.patchValue({ tipoPgto: 'Á VISTA' });
    } else {
      if (
        !this.formulario.value.tipoPgto ||
        this.formulario.value.tipoPgto === 'Á VISTA'
      ) {
        this.formulario.patchValue({ tipoPgto: this.listaOpcoesPgto[0] });
      }
    }
  }

  onSelectChange(event: any): void {
    this.isPaymentChecked = false;
    this.formulario.patchValue({ tipoPgto: event.value });
  }

  isAdressChecked = false;
  onToggleChange(event: any): void {
    this.isAdressChecked = event.checked;
    if (this.isAdressChecked) {
      this.limpaEndereco();
      this.buscaEndereco();
    } else {
      this.limpaEndereco();
      this.consultaCEP();
    }
  }

  buscaEndereco() {
    this.limpaEndereco();
    this.formulario.patchValue({
      cepEntrega: this.formulario.get('cep')?.value,
      logradouroEntrega: this.formulario.get('logradouro')?.value,
      numeroEntrega: this.formulario.get('numero')?.value,
      complementoEntrega: this.formulario.get('complemento')?.value,
      bairroEntrega: this.formulario.get('bairro')?.value,
      cidadeEntrega: this.formulario.get('cidade')?.value,
      estadoEntrega: this.formulario.get('estado')?.value,
    });
  }

  limpaEndereco() {
    this.formulario.patchValue({
      cepEntrega: [''],
      logradouroEntrega: [''],
      numeroEntrega: [''],
      complementoEntrega: [''],
      bairroEntrega: [''],
      cidadeEntrega: [''],
      estadoEntrega: [''],
    });
  }

  convertToUppercase(controlName: string): void {
    const control = this.formulario.get(controlName);
    if (control) {
      const value = control.value || '';
      control.setValue(value.toUpperCase(), { emitEvent: false });
    }
  }

  dataAtual: Date = new Date();

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagemService.showErrorMessage(
        'Verifique os campos obrigatórios ou inválidos!',
      );
      return;
    }

    const dataAjustada = new Date(
      this.dataAtual.getTime() - 3 * 60 * 60 * 1000,
    );
    const dataFormatada = dataAjustada.toISOString();

    this.formulario.patchValue({
      dataAtualizacaoCliente: dataFormatada,
    });

    const formValue = this.formulario.value;
    Object.keys(formValue).forEach((key) => {
      if (typeof formValue[key] === 'string') {
        formValue[key] = formValue[key].toUpperCase();
      }
    });

    this.clienteService.salvar(this.formulario.value).subscribe(
      (result) => this.onSucess(),
      (error) => this.onError(error),
    );
  }

  private onSucess() {
    this.mensagemService.showSuccessMessage('Cliente Salvo com sucesso!');
    this.onCancel();
  }

  onCancel() {
    this.location.back();
  }

  private onError(error: any) {
    if (error.status === 409) {
      this.mensagemService.showErrorMessage('CPF/CNPJ já está cadastrado.');
    } else {
      this.mensagemService.showErrorMessage('Erro ao salvar o cliente!');
    }
  }
}
