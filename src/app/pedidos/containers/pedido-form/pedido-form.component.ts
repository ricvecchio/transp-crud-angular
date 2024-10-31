import { AsyncPipe, Location } from '@angular/common';
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
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Pedido } from '../../../modelo/pedido';
import { PedidoService } from '../../servico/pedido.service';
import { ClienteService } from './../../../clientes/servicos/cliente.service';

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
    FormsModule,
    ReactiveFormsModule,
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
    MatAutocompleteModule,
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
    const pedido: Pedido = this.route.snapshot.data['pedido'];
    this.formulario = this.formBuilder.group({
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
  }

  // this.filteredOptions = this.myControl.valueChanges.pipe(
  //   startWith(''),
  //   map((value) => {
  //     const name = typeof value === 'string' ? value : value?.name;
  //     return name ? this._filter(name as string) : this.options.slice();
  //   }),
  // );

  // myControl = new FormControl<string | User>('');

  // options: User[] = [
  //   { name: 'Bruno' },
  //   { name: 'Brunelson' },
  //   { name: 'Pedrola' },
  //   { name: 'Jeréba' },
  //   { name: 'Ricardo 01' },
  //   { name: 'Ricardo 02' },
  //   { name: 'Ricardo 03' },
  //   { name: 'Ricardola' },
  //   { name: 'Salomonstro' },
  // ];

  // filteredOptions: Observable<User[]> = of([]);

  // displayFn(user: User): string {
  //   return user && user.name ? user.name : '';
  // }

  // private _filter(name: string): User[] {
  //   const filterValue = name.toLowerCase();

  //   return this.options.filter((option) =>
  //     option.name.toLowerCase().includes(filterValue),
  //   );
  // }

  checked = false;

  isAdressChecked = false;
  onToggleChange(event: any): void {
    this.isAdressChecked = event.checked;
  }

  isPaymentChecked = false;
  onPaymentCheckBoxChange(event: any): void {
    this.isPaymentChecked = event.checked;
    this.formulario.patchValue({
      tipoPgto: 'Á vista',
    });
  }

  selectClick() {
    const diaFaturado = this.formulario.get('tipoPgto')?.value;
    this.formulario.patchValue({
      tipoPgto: diaFaturado,
    });
  }

  // checked = false;
  // isAdressChecked = false;
  // this.isAdressChecked = this.formulario.get('deliveryAddress')?.value || false;
  // this.formulario.get('deliveryAddress')?.valueChanges.subscribe(value => {
  //   this.isAdressChecked = value || false;
  // });

  // disabled = false;

  // this.isPaymentChecked = this.formulario.get('cashPayment')?.value || false;
  // this.formulario.get('cashPayment')?.valueChanges.subscribe(value => {
  //   this.isPaymentChecked = value || false;
  // });
  // }

  // consultaClienteNome() {
  //   const nomeCliente = this.formulario.get('nome')?.value;
  //   if (nomeCliente != '') {
  //     this.clienteService.buscarPorNome(nomeCliente).subscribe((dados: any) => {
  //       this.formulario.patchValue({
  //         nome: dados.nome,
  //         cpfcnpj: dados.cpfcnpj,
  //         telefone: dados.telefone,
  //         celular: dados.celular,
  //         email: dados.email,
  //         cep: dados.cep,
  //         logradouro: dados.logradouro,
  //         numero: dados.numero,
  //         complemento: dados.complemento,
  //         bairro: dados.bairro,
  //         cidade: dados.cidade,
  //         estado: dados.estado
  //       });
  //     });
  //   }
  // }

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
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: 'Cliente não encontrado, deseja cadastrar?',
          });
          dialogRef.afterClosed().subscribe((result: boolean) => {
            console.log(result);
            if (result) {
              this.router.navigate(['/cadastrar-cliente'], {
                relativeTo: this.route,
              });
            }
          });
        }
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
    this.snackBar.open('Pedido Salvo/Emitido com sucesso!', '', {
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
