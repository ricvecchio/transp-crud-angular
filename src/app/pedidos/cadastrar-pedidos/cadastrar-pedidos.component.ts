import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';
import { ConsultaCepService } from '../service/consulta-cep.service';
import { MatError, MatFormField, MatHint, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormUtilsService } from '../../compartilhado/form-utils-service';


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
  selector: 'app-cadastrar-pedidos',
  templateUrl: './cadastrar-pedidos.component.html',
  styleUrl: './cadastrar-pedidos.component.css',
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
export class CadastrarPedidosComponent implements OnInit {

  // formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private consultaCepService: ConsultaCepService,
    // private service: PedidoService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService,
  ) {}


  ngOnInit(): void {
    // const cliente: Cliente = this.route.snapshot.data['cliente'];
    // this.formulario = this.formBuilder.group({
    //   idCliente: [cliente.idCliente],
    //   nome: [cliente.nome, [Validators.required, Validators.minLength(5), Validators.maxLength(100)],],
    //   cpfcnpj: [cliente.cpfcnpj, Validators.required],
    //   telefone: [cliente.telefone, Validators.required],
    //   celular: [cliente.celular],
    //   email: [cliente.email, [Validators.required, Validators.email]],
    //   cep: [cliente.cep, [Validators.required, Validators.pattern('^(d{5})(-?d{3})$')]],
    //   logradouro: [cliente.logradouro],
    //   numero: [cliente.numero],
    //   complemento: [cliente.complemento],
    //   bairro: [cliente.bairro],
    //   cidade: [cliente.cidade],
    //   estado: [cliente.estado],
    //   dadosPedidos: this.formBuilder.array(this.retrievepedidos(cliente), Validators.required)
    // });
    // console.log(this.formulario);
    // console.log(this.formulario.value);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    // this.isAdressChecked = this.formulario.get('deliveryAddress')?.value || false;
    // this.formulario.get('deliveryAddress')?.valueChanges.subscribe(value => {
    //   this.isAdressChecked = value || false;
    // });

    // this.isPaymentChecked = this.formulario.get('cashPayment')?.value || false;
    // this.formulario.get('cashPayment')?.valueChanges.subscribe(value => {
    //   this.isPaymentChecked = value || false;
    // });
  }

  // cliente: Cliente = this.route.snapshot.data['cliente'];
  formulario = this.formBuilder.group({
    idCliente: [''],
    nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)],],
    cpfcnpj: ['', Validators.required],
    telefone: ['', Validators.required],
    celular: [''],
    email: ['', [Validators.required, Validators.email]],
      cep: ['', [Validators.required, Validators.pattern('^(d{5})(-?d{3})$')]],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      // dadosPedido: this.formBuilder.array(this.retrievepedidos(this.cliente), Validators.required)
      // dadosPedido: this.formBuilder.group({
      idPedido: [''],
      nomePedido: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(100),],],
      razaoSocial: [''],
      cpfcnpjPedido: ['', Validators.required],
      tipoPgto: [''],
      deliveryAddress: [false, Validators.requiredTrue],
      cepPedido: ['', [Validators.required, Validators.pattern('^(d{5})(-?d{3})$')],],
      logradouroPedido: ['', Validators.required],
      numeroPedido: [''],
      complementoPedido: [''],
      bairroPedido: [''],
      cidadePedido: [''],
      estadoPedido: [''],
      sfobras: [''],
      cno: [''],
      ie: [''],
      mangueira: [''],
      volume: [''],
      precoCx5: [''],
      precoCx10: [''],
      precoCx15: [''],
      precoLv5: [''],
      precoLv10: [''],
      precoLv15: [''],
      ajudanteHora: [''],
      observacao: [''],
    // }),
    });

  // private retrievepedidos(cliente: Cliente) {
  //   const pedidos = [];
  //   if (cliente?.pedidos) {
  //     cliente.pedidos.forEach(pedido => pedidos.push(this.createPedido(pedido)));
  //   } else {
  //     pedidos.push(this.createPedido());
  //   }
  //   return pedidos;
  // }

  // private createPedido(pedido: Pedido = { idPedido: '', nomePedido: '', razaoSocial: '' , cpfcnpjPedido: '' , tipoPgto: ''
  //   , cepPedido: '' , logradouroPedido: '' , numeroPedido: '' , complementoPedido: '' , bairroPedido: '' , cidadePedido: '' , estadoPedido: ''
  //   , sfobras: '' , cno: '' , ie: '' , mangueira: '' , volume: '' , precoCx5: '' , precoCx10: ''
  //   , precoCx15: '' , precoLv5: '' , precoLv10: '' , precoLv15: '' , ajudanteHora: '' , observacao: ''
  // }) {
  //   return this.formBuilder.group({
  //     idPedido: [pedido.idPedido],
  //     nomePedido: ['' , [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
  //     razaoSocial: [''],
  //     cpfcnpjPedido: [''],
  //     tipoPgto: [pedido.tipoPgto],
  //     cepPedido: [pedido.cepPedido],
  //     logradouroPedido: [pedido.logradouroPedido],
  //     numeroPedido: [pedido.numeroPedido],
  //     complementoPedido: [pedido.complementoPedido],
  //     bairroPedido: [pedido.bairroPedido],
  //     cidadePedido: [pedido.cidadePedido],
  //     estadoPedido: [pedido.estadoPedido],
  //     sfobras: [pedido.sfobras],
  //     cno: [pedido.cno],
  //     ie: [pedido.ie],
  //     mangueira: [pedido.mangueira],
  //     volume: [pedido.volume],
  //     precoCx5: [pedido.precoCx5],
  //     precoCx10: [pedido.precoCx10],
  //     precoCx15: [pedido.precoCx15],
  //     precoLv5: [pedido.precoLv5],
  //     precoLv10: [pedido.precoLv10],
  //     precoLv15: [pedido.precoLv15],
  //     ajudanteHora: [pedido.ajudanteHora],
  //     observacao: [pedido.observacao]
  //   });
  // }

  isAdressChecked = false;
  isPaymentChecked = false;

  myControl = new FormControl<string | User>('');

  options: User[] = [
    { name: 'Bruno' },
    { name: 'Brunelson' },
    { name: 'Pedrola' },
    { name: 'Jeréba' },
    { name: 'Ricardo 01' },
    { name: 'Ricardo 02' },
    { name: 'Ricardo 03' },
    { name: 'Ricardola' },
    { name: 'Salomonstro' },
  ];

  filteredOptions: Observable<User[]> = of([]);

  alertFormValues(formGroup: FormGroup) {
    alert(JSON.stringify(formGroup.value, null, 2));
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue),
    );
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

  getMensagemErro(fieldNome: string) {
    const field = this.formulario.get(fieldNome);

    if (field?.hasError('required')) {
      return 'Campo Obrigatório';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors
        ? field.errors['minlength']['requiredLength']
        : 5;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres.`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors
        ? field.errors['maxlength']['requiredLength']
        : 200;
      return `Tamanho máximo precisa ser de ${requiredLength} caracteres.`;
    }

    return 'Campo Inválido';
  }

  dataAtual: Date = new Date();

  checked = false;
  disabled = false;

  onPaymentCheckBoxChange(event: any): void {
    this.isPaymentChecked = event.checked;
  }

  onToggleChange(event: any): void {
    this.isAdressChecked = event.checked;
  }

  onSubmit() {
    // this.service.salvar(this.formulario.value).subscribe(
    //   (result) => this.onSucess(),
    //   (error) => this.onError(),
    // );
  }


  private onSucess() {
    this.snackBar.open('Pedido Salvo com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o pedido!', '', { duration: 5000 });
  }
}
