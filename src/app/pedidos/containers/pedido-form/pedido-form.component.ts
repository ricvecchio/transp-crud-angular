import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Pedido } from '../../../modelo/pedido';
import { PedidoService } from '../../servico/pedido.service';
import { ClienteService } from './../../../clientes/servicos/cliente.service';
import { Cliente } from '../../../modelo/cliente';

interface Metros {
  value: string;
  viewValue: string;
}

interface Volumes {
  value: string;
  viewValue: string;
}

export interface User {
  name: string;
}

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.css',
  standalone: true,
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
    AsyncPipe,
  ],
})
export class PedidoFormComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private clienteService: ClienteService,
    private consultaCepService: ConsultaCepService,
    private service: PedidoService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      console.log('Dados recebidos:', params);

      // const cliente: Cliente = params;
      // // Use os dados como necessário
      // this.formulario = this.formBuilder.group({
      //   idCliente: [cliente.idCliente],
      //   nome: [cliente.nome],
    });


    const pedido: Pedido = this.route.snapshot.data['pedido'];
    this.formulario = this.formBuilder.group({
      nomeBusca: [
        pedido.nomeBusca,
        [Validators.required, Validators.minLength(3)],
      ],
      idCliente: [pedido.idCliente, [Validators.pattern(/^\d+$/)]],
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
      idPedido: [pedido.idPedido],
      nomePedido: [
        pedido.nomePedido,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
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

    this.formulario
      .get('nomeBusca')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300), // Adiciona um atraso de 300ms antes de prosseguir
        switchMap((nomeBusca) =>
          nomeBusca && nomeBusca.trim() !== ''
            ? this.clienteService.buscarPorNome(nomeBusca)
            : [],
        ),
      )
      .subscribe((dados: any[]) => {
        this.clientesEncontrados = Array.isArray(dados) ? dados : [];
        if (this.clientesEncontrados.length === 0) {
          this.dialogoClienteNaoEncontrado();
        }
      });
  }

  @ViewChild('focusElement') focusElement!: ElementRef;

  clientesEncontrados: any[] = [];

  selecionarCliente(cliente: any) {
    this.formulario.patchValue({
      idCliente: cliente.idCliente,
      nome: cliente.nome,
      cpfcnpj: cliente.cpfcnpj,
      telefone: cliente.telefone,
      celular: cliente.celular,
      email: cliente.email,
      cep: cliente.cep,
      logradouro: cliente.logradouro,
      numero: cliente.numero,
      complemento: cliente.complemento,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      estado: cliente.estado,
    });
    this.clientesEncontrados = [];
  }

  consultaClienteId() {
    const idCliente = this.formulario.get('idCliente')?.value;
    if (idCliente != '') {
      this.clienteService.buscarPorId(idCliente).subscribe((dados: any) => {
        if (dados !== null && dados != undefined) {
          this.formulario.patchValue({
            nome: dados.nome,
            cpfcnpj: dados.cpfcnpj,
            telefone: dados.telefone,
            celular: dados.celular,
            email: dados.email,
            cep: dados.cep,
            logradouro: dados.logradouro,
            numero: dados.numero,
            complemento: dados.complemento,
            bairro: dados.bairro,
            cidade: dados.cidade,
            estado: dados.estado,
          });
        } else {
          this.dialogoClienteNaoEncontrado();
          this.formulario.patchValue({
            idCliente: idCliente.clear_all,
          });
        }
      });
    }
  }

  dialogoClienteNaoEncontrado() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Cliente não encontrado, deseja cadastrar?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/cadastrar-cliente'], {
          relativeTo: this.route,
        });
      } else {
        this.setFocus();
      }
    });
  }

  setFocus() {
    this.focusElement.nativeElement.focus();
  }

  checked = false;

  isPaymentChecked = false;
  onPaymentCheckBoxChange(event: any): void {
    this.isPaymentChecked = event.checked;
    if (this.isPaymentChecked) {
      this.formulario.patchValue({
        tipoPgto: 'Á vista',
      });
    }
  }

  selectClick() {
    const diaFaturado = this.formulario.get('tipoPgto')?.value;
    this.formulario.patchValue({
      tipoPgto: diaFaturado,
    });
  }

  isAdressChecked = false;
  onToggleChange(event: any): void {
    this.isAdressChecked = event.checked;
    if (this.isAdressChecked) {
      this.limpaEndereco();
      this.buscaEndereco();
    } else {
      this.limpaEndereco();
    }
  }

  buscaEndereco() {
    this.limpaEndereco();
    this.formulario.patchValue({
      cepPedido: this.formulario.get('cep')?.value,
      logradouroPedido: this.formulario.get('logradouro')?.value,
      numeroPedido: this.formulario.get('numero')?.value,
      complementoPedido: this.formulario.get('complemento')?.value,
      bairroPedido: this.formulario.get('bairro')?.value,
      cidadePedido: this.formulario.get('cidade')?.value,
      estadoPedido: this.formulario.get('estado')?.value,
    });
  }

  limpaEndereco() {
    this.formulario.patchValue({
      cepPedido: [''],
      logradouroPedido: [''],
      numeroPedido: [''],
      complementoPedido: [''],
      bairroPedido: [''],
      cidadePedido: [''],
      estadoPedido: [''],
    });
  }

  consultaCEP() {
    const cep = this.formulario.get('cepPedido')?.value;
    if (cep != '') {
      this.consultaCepService.getConsultaCep(cep).subscribe((dados: any) => {
        this.formulario.patchValue({
          logradouroPedido: dados.logradouro,
          complementoPedido: dados.complemento,
          bairroPedido: dados.bairro,
          cidadePedido: dados.localidade,
          estadoPedido: dados.uf,
        });
      });
    }
  }

  selectedMetros!: string;
  metros: Metros[] = [
    { value: '15 metros', viewValue: '15 metros' },
    { value: '30 metros', viewValue: '30 metros' },
    { value: '45 metros', viewValue: '45 metros' },
    { value: '60 metros', viewValue: '60 metros' },
    { value: '75 metros', viewValue: '75 metros' },
    { value: '90 metros', viewValue: '90 metros' },
  ];

  listaVolume!: string;
  volumes: Volumes[] = [
    { value: 'cx-5m³', viewValue: 'cx-5m³' },
    { value: 'cx-10m³', viewValue: 'cx-10m³' },
    { value: 'cx-15m³', viewValue: 'cx-15m³' },
    { value: 'lav-5m³', viewValue: 'lav-5m³' },
    { value: 'lav-10m³', viewValue: 'lav-10m³' },
    { value: 'lav-15m³', viewValue: 'lav-15m³' },
  ];

  dataAtual: Date = new Date();

  // onSubmit() {
  //   if (this.formulario.valid) {
  //   this.service.salvar(this.formulario.value).subscribe(
  //     (result) => this.onSucess(),
  //     (error) => this.onError(),
  //   );
  //   } else {
  //     this.formUtils.validarTodosCamposFormFields(this.formulario);
  //   }
  // }

  onSubmitIssue() {
    this.service.emitir(this.formulario.value).subscribe(
      (result) => this.onSucess(),
      (error) => this.onError(),
    );
  }

  onSubmitSave() {
    this.service.salvar(this.formulario.value).subscribe(
      (result) => this.onSucess(),
      (error) => this.onError(),
    );
  }

  private onSucess() {
    this.snackBar.open('Pedido Salvo e Emitido com sucesso!', '', {
      duration: 5000,
    });
    this.onCancel();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o pedido!', '', { duration: 5000 });
  }
}
