import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
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
  MatLabel,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';

import { lastValueFrom } from 'rxjs';
import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { MensagemService } from '../../../compartilhado/mensagem.service';
import { Cliente } from '../../../modelo/cliente';
import { Pedido } from '../../../modelo/pedido';
import { OfflineDbService } from '../../../offline/offline-db.service';
import { PedidoService } from '../../servico/pedido.service';

interface Volumes {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.css',
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
    MatError,
    MatDividerModule,
    MatListModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
  ],
})
export class PedidoFormComponent implements OnInit, AfterViewInit {
  formulario!: FormGroup;
  dataAtual: Date = new Date();
  isModoOffline = false;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private consultaCepService: ConsultaCepService,
    private pedidoService: PedidoService,
    private mensagemService: MensagemService,
    private offlineDbService: OfflineDbService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public formUtils: FormUtilsService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.isModoOffline =
      sessionStorage.getItem('permission') === 'OFFLINE' ||
      sessionStorage.getItem('offline-mode') === 'true';

    const pedido: Pedido = this.route.snapshot.data['pedido'];
    this.formulario = this.formBuilder.group({
      idPedido: [pedido.idPedido],
      nome: [pedido.nome],
      cpfCnpj: [pedido.cpfCnpj],
      razaoSocial: [pedido.razaoSocial],
      idCliente: [pedido.idCliente],
      telefone: [pedido.telefone],
      celular: [pedido.celular],
      email: [pedido.email],
      contatosAdicionais: [pedido.contatosAdicionais],
      cep: [pedido.cep],
      logradouro: [pedido.logradouro],
      numero: [pedido.numero],
      complemento: [pedido.complemento],
      bairro: [pedido.bairro],
      cidade: [pedido.cidade],
      estado: [pedido.estado],
      tipoPgto: [pedido.tipoPgto],
      infoPagamento: [pedido.infoPagamento],
      cepEntrega: [this.formatarCep(pedido.cepEntrega)],
      logradouroEntrega: [pedido.logradouroEntrega],
      numeroEntrega: [pedido.numeroEntrega],
      complementoEntrega: [pedido.complementoEntrega],
      bairroEntrega: [pedido.bairroEntrega],
      cidadeEntrega: [pedido.cidadeEntrega],
      estadoEntrega: [pedido.estadoEntrega],
      sfobras: [pedido.sfobras],
      cno: [pedido.cno],
      ie: [pedido.ie],
      mangueira: [pedido.mangueira],
      valorAjudanteVuc: [pedido.valorAjudanteVuc || pedido.valorAjudante || ''],
      valorAjudanteToco: [pedido.valorAjudanteToco || ''],
      adicionalMangueira: [
        pedido.adicionalMangueira || pedido.valorAdicional || '',
      ],
      adicionalBombaGas: [pedido.adicionalBombaGas || ''],
      valorAjudante: [pedido.valorAjudanteVuc || pedido.valorAjudante || ''],
      valorAdicional: [pedido.adicionalMangueira || pedido.valorAdicional || ''],
      volume: [pedido.volume],
      precoCx5: [this.formatarParaReais(pedido.precoCx5)],
      precoCx10: [this.formatarParaReais(pedido.precoCx10)],
      precoCx15: [this.formatarParaReais(pedido.precoCx15)],
      precoLv5: [this.formatarParaReais(pedido.precoLv5)],
      precoLv10: [this.formatarParaReais(pedido.precoLv10)],
      precoLv15: [this.formatarParaReais(pedido.precoLv15)],
      precoCx5Sabado: [this.formatarParaReais(pedido.precoCx5Sabado)],
      precoCx10Sabado: [this.formatarParaReais(pedido.precoCx10Sabado)],
      precoCx15Sabado: [this.formatarParaReais(pedido.precoCx15Sabado)],
      precoLv5Sabado: [this.formatarParaReais(pedido.precoLv5Sabado)],
      precoLv10Sabado: [this.formatarParaReais(pedido.precoLv10Sabado)],
      precoLv15Sabado: [this.formatarParaReais(pedido.precoLv15Sabado)],
      precoEscolhido: [''],
      entregaSabado: [this.normalizarFlagSimNao(pedido.entregaSabado)],
      exibirPreco: [this.normalizarFlagSimNao(pedido.exibirPreco)],
      ajudante: [this.normalizarFlagSimNao(pedido.ajudante)],
      adicional: [this.normalizarFlagSimNao(pedido.adicional)],
      ajudanteToco: [this.normalizarFlagSimNao(pedido.ajudanteToco)],
      bombaGas: [this.normalizarFlagSimNao(pedido.bombaGas)],
      precoFinal: [this.formatarParaReais(pedido.precoFinal)],
      observacao: [pedido.observacao],
      observacao2: [pedido.observacao2],
      dataAtualizacaoPedido: [pedido.dataAtualizacaoPedido],
      status: [pedido.status],
      imagemPedido: [pedido.imagemPedido],
    });

    this.route.queryParams.subscribe((params) => {
      if (params && Object.keys(params).length > 0) {
        const pedido: Pedido = this.formatarPedido(params);
        this.formulario.patchValue({
          idPedido: pedido.idPedido,
          nome: pedido.nome,
          cpfCnpj: pedido.cpfCnpj,
          razaoSocial: pedido.razaoSocial,
          idCliente: pedido.idCliente,
          telefone: pedido.telefone,
          celular: pedido.celular,
          email: pedido.email,
          contatosAdicionais: pedido.contatosAdicionais,
          cep: pedido.cep,
          logradouro: pedido.logradouro,
          numero: pedido.numero,
          complemento: pedido.complemento,
          bairro: pedido.bairro,
          cidade: pedido.cidade,
          estado: pedido.estado,
          tipoPgto: pedido.tipoPgto,
          infoPagamento: pedido.infoPagamento,
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
          valorAjudanteVuc: pedido.valorAjudanteVuc || pedido.valorAjudante || '',
          valorAjudanteToco: pedido.valorAjudanteToco || '',
          adicionalMangueira:
            pedido.adicionalMangueira || pedido.valorAdicional || '',
          adicionalBombaGas: pedido.adicionalBombaGas || '',
          valorAjudante: pedido.valorAjudanteVuc || pedido.valorAjudante || '',
          valorAdicional:
            pedido.adicionalMangueira || pedido.valorAdicional || '',
          volume: pedido.volume,
          precoCx5: pedido.precoCx5,
          precoCx10: pedido.precoCx10,
          precoCx15: pedido.precoCx15,
          precoLv5: pedido.precoLv5,
          precoLv10: pedido.precoLv10,
          precoLv15: pedido.precoLv15,
          precoCx5Sabado: pedido.precoCx5Sabado,
          precoCx10Sabado: pedido.precoCx10Sabado,
          precoCx15Sabado: pedido.precoCx15Sabado,
          precoLv5Sabado: pedido.precoLv5Sabado,
          precoLv10Sabado: pedido.precoLv10Sabado,
          precoLv15Sabado: pedido.precoLv15Sabado,
          entregaSabado: this.normalizarFlagSimNao(
            params['entregaSabado'] || pedido.entregaSabado,
          ),
          exibirPreco: this.normalizarFlagSimNao(
            params['exibirPreco'] || pedido.exibirPreco,
          ),
          ajudante: this.normalizarFlagSimNao(pedido.ajudante),
          adicional: this.normalizarFlagSimNao(pedido.adicional),
          ajudanteToco: this.normalizarFlagSimNao(pedido.ajudanteToco),
          bombaGas: this.normalizarFlagSimNao(pedido.bombaGas),
          precoFinal: pedido.precoFinal,
          observacao: pedido.observacao,
          observacao2: pedido.observacao2,
          status: pedido.status,
          imagemPedido: pedido.imagemPedido,
        });
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params && Object.keys(params).length > 0) {
        const cliente: Cliente = this.formatarCliente(params);
        this.formulario.patchValue({
          idCliente: cliente.idCliente,
          nome: cliente.nome,
          cpfCnpj: cliente.cpfCnpj,
          razaoSocial: cliente.razaoSocial,
          telefone: cliente.telefone,
          celular: cliente.celular,
          email: cliente.email,
          contatosAdicionais: cliente.contatosAdicionais,
          cep: cliente.cep,
          logradouro: cliente.logradouro,
          numero: cliente.numero,
          complemento: cliente.complemento,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          tipoPgto: cliente.tipoPgto,
          infoPagamento: cliente.infoPagamento,
          cepEntrega: cliente.cepEntrega,
          logradouroEntrega: cliente.logradouroEntrega,
          numeroEntrega: cliente.numeroEntrega,
          complementoEntrega: cliente.complementoEntrega,
          bairroEntrega: cliente.bairroEntrega,
          cidadeEntrega: cliente.cidadeEntrega,
          estadoEntrega: cliente.estadoEntrega,
          sfobras: cliente.sfobras,
          cno: cliente.cno,
          ie: cliente.ie,
          mangueira: cliente.mangueira,
          precoCx5: cliente.precoCx5,
          precoCx10: cliente.precoCx10,
          precoCx15: cliente.precoCx15,
          precoLv5: cliente.precoLv5,
          precoLv10: cliente.precoLv10,
          precoLv15: cliente.precoLv15,
          precoCx5Sabado: cliente.precoCx5Sabado,
          precoCx10Sabado: cliente.precoCx10Sabado,
          precoCx15Sabado: cliente.precoCx15Sabado,
          precoLv5Sabado: cliente.precoLv5Sabado,
          precoLv10Sabado: cliente.precoLv10Sabado,
          precoLv15Sabado: cliente.precoLv15Sabado,
          observacao: cliente.observacao,
          dataAtualizacaoCliente: cliente.dataAtualizacaoCliente,
        });
      }
    });

    this.formatarCampos([
      'precoCx5',
      'precoCx10',
      'precoCx15',
      'precoLv5',
      'precoLv10',
      'precoLv15',
      'precoCx5Sabado',
      'precoCx10Sabado',
      'precoCx15Sabado',
      'precoLv5Sabado',
      'precoLv10Sabado',
      'precoLv15Sabado',
      'precoFinal',
    ]);

    this.formatarCampoCep();

    this.formulario.get('volume')?.valueChanges.subscribe(() => {
      this.atualizarPrecoComExtras();
    });
  }

  ngAfterViewInit(): void {
    this.liberarCamposSomenteNoModoOffline();
  }

  private liberarCamposSomenteNoModoOffline(): void {
    if (!this.isModoOffline) {
      return;
    }

    setTimeout(() => {
      const inputsBloqueados =
        this.elementRef.nativeElement.querySelectorAll('input[readonly]');

      inputsBloqueados.forEach((input: HTMLInputElement) => {
        input.removeAttribute('readonly');
        input.removeAttribute('tabindex');
      });

      this.cdr.detectChanges();
    }, 0);
  }

  private formatarPedido(pedidoParams: any): Pedido {
    return {
      idPedido: pedidoParams.idPedido || '',
      nome: pedidoParams.nome || '',
      cpfCnpj: pedidoParams.cpfCnpj || '',
      razaoSocial: pedidoParams.razaoSocial || '',
      idCliente: pedidoParams.idCliente || '',
      telefone: pedidoParams.telefone || '',
      celular: pedidoParams.celular || '',
      email: pedidoParams.email || '',
      contatosAdicionais: pedidoParams.contatosAdicionais || '',
      cep: pedidoParams.cep || '',
      logradouro: pedidoParams.logradouro || '',
      numero: pedidoParams.numero || '',
      complemento: pedidoParams.complemento || '',
      bairro: pedidoParams.bairro || '',
      cidade: pedidoParams.cidade || '',
      estado: pedidoParams.estado || '',
      tipoPgto: pedidoParams.tipoPgto || '',
      infoPagamento: pedidoParams.infoPagamento || '',
      cepEntrega: pedidoParams.cepEntrega || '',
      logradouroEntrega: pedidoParams.logradouroEntrega || '',
      numeroEntrega: pedidoParams.numeroEntrega || '',
      complementoEntrega: pedidoParams.complementoEntrega || '',
      bairroEntrega: pedidoParams.bairroEntrega || '',
      cidadeEntrega: pedidoParams.cidadeEntrega || '',
      estadoEntrega: pedidoParams.estadoEntrega || '',
      sfobras: pedidoParams.sfobras || '',
      cno: pedidoParams.cno || '',
      ie: pedidoParams.ie || '',
      mangueira: pedidoParams.mangueira || '',
      valorAjudanteVuc:
        pedidoParams.valorAjudanteVuc || pedidoParams.valorAjudante || '',
      valorAjudanteToco: pedidoParams.valorAjudanteToco || '',
      adicionalMangueira:
        pedidoParams.adicionalMangueira || pedidoParams.valorAdicional || '',
      adicionalBombaGas: pedidoParams.adicionalBombaGas || '',
      valorAjudante:
        pedidoParams.valorAjudanteVuc || pedidoParams.valorAjudante || '',
      valorAdicional:
        pedidoParams.adicionalMangueira || pedidoParams.valorAdicional || '',
      volume: pedidoParams.volume || '',
      precoCx5: pedidoParams.precoCx5 || '',
      precoCx10: pedidoParams.precoCx10 || '',
      precoCx15: pedidoParams.precoCx15 || '',
      precoLv5: pedidoParams.precoLv5 || '',
      precoLv10: pedidoParams.precoLv10 || '',
      precoLv15: pedidoParams.precoLv15 || '',
      precoCx5Sabado: pedidoParams.precoCx5Sabado || '',
      precoCx10Sabado: pedidoParams.precoCx10Sabado || '',
      precoCx15Sabado: pedidoParams.precoCx15Sabado || '',
      precoLv5Sabado: pedidoParams.precoLv5Sabado || '',
      precoLv10Sabado: pedidoParams.precoLv10Sabado || '',
      precoLv15Sabado: pedidoParams.precoLv15Sabado || '',
      entregaSabado: pedidoParams.entregaSabado || 'NÃO',
      exibirPreco: pedidoParams.exibirPreco || 'NÃO',
      ajudante: pedidoParams.ajudante || '',
      adicional: pedidoParams.adicional || '',
      ajudanteToco: pedidoParams.ajudanteToco || '',
      bombaGas: pedidoParams.bombaGas || '',
      precoFinal: pedidoParams.precoFinal || '',
      observacao: pedidoParams.observacao || '',
      observacao2: pedidoParams.observacao2 || '',
      status: pedidoParams.status || '',
      dataAtualizacaoPedido: pedidoParams.dataAtualizacaoPedido || '',
      imagemPedido: pedidoParams.imagemPedido || '',
    };
  }

  private formatarCliente(clienteParams: any): Cliente {
    return {
      nomeBusca: clienteParams.nomeBusca || '',
      idCliente: clienteParams.idCliente || '',
      nome: clienteParams.nome || '',
      cpfCnpj: clienteParams.cpfCnpj || '',
      razaoSocial: clienteParams.razaoSocial || '',
      telefone: clienteParams.telefone || '',
      celular: clienteParams.celular || '',
      email: clienteParams.email || '',
      contatosAdicionais: clienteParams.contatosAdicionais || '',
      cep: clienteParams.cep || '',
      logradouro: clienteParams.logradouro || '',
      numero: clienteParams.numero || '',
      complemento: clienteParams.complemento || '',
      bairro: clienteParams.bairro || '',
      cidade: clienteParams.cidade || '',
      estado: clienteParams.estado || '',
      tipoPgto: clienteParams.tipoPgto || '',
      infoPagamento: clienteParams.infoPagamento || '',
      cepEntrega: clienteParams.cepEntrega || '',
      logradouroEntrega: clienteParams.logradouroEntrega || '',
      numeroEntrega: clienteParams.numeroEntrega || '',
      complementoEntrega: clienteParams.complementoEntrega || '',
      bairroEntrega: clienteParams.bairroEntrega || '',
      cidadeEntrega: clienteParams.cidadeEntrega || '',
      estadoEntrega: clienteParams.estadoEntrega || '',
      sfobras: clienteParams.sfobras || '',
      cno: clienteParams.cno || '',
      ie: clienteParams.ie || '',
      mangueira: clienteParams.mangueira || '',
      valorAjudanteVuc:
        clienteParams.valorAjudanteVuc || clienteParams.valorAjudante || '',
      valorAjudanteToco: clienteParams.valorAjudanteToco || '',
      adicionalMangueira:
        clienteParams.adicionalMangueira || clienteParams.valorAdicional || '',
      adicionalBombaGas: clienteParams.adicionalBombaGas || '',
      valorAjudante: clienteParams.valorAjudante || '',
      valorAdicional: clienteParams.valorAdicional || '',
      precoCx5: clienteParams.precoCx5 || '',
      precoCx10: clienteParams.precoCx10 || '',
      precoCx15: clienteParams.precoCx15 || '',
      precoLv5: clienteParams.precoLv5 || '',
      precoLv10: clienteParams.precoLv10 || '',
      precoLv15: clienteParams.precoLv15 || '',
      precoCx5Sabado: clienteParams.precoCx5Sabado || '',
      precoCx10Sabado: clienteParams.precoCx10Sabado || '',
      precoCx15Sabado: clienteParams.precoCx15Sabado || '',
      precoLv5Sabado: clienteParams.precoLv5Sabado || '',
      precoLv10Sabado: clienteParams.precoLv10Sabado || '',
      precoLv15Sabado: clienteParams.precoLv15Sabado || '',
      observacao: clienteParams.observacao || '',
      dataAtualizacaoCliente: clienteParams.dataAtualizacaoCliente || '',
    };
  }

  checked = false;

  isAdressChecked = false;

  onToggleChange(event: any): void {
    this.isAdressChecked = event.checked;
    if (this.isAdressChecked) {
      this.limpaEndereco();
      this.buscaEndereco();
    } else {
      this.limpaEndereco();
    }

    this.liberarCamposSomenteNoModoOffline();
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

  private formatarCampoCep(): void {
    const cepControl = this.formulario.get('cepEntrega');
    if (cepControl) {
      cepControl.valueChanges.subscribe((valor) => {
        const formatado = this.formatarCep(valor);
        if (formatado !== valor) {
          cepControl.setValue(formatado, { emitEvent: false });
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
    const cep = this.formulario.get('cepEntrega')?.value;
    if (cep != '') {
      this.consultaCepService.getConsultaCep(cep).subscribe((dados: any) => {
        this.formulario.patchValue({
          logradouroEntrega: dados.logradouro,
          bairroEntrega: dados.bairro,
          cidadeEntrega: dados.localidade,
          estadoEntrega: dados.uf,
        });

        this.liberarCamposSomenteNoModoOffline();
      });
    }
  }

  listaVolume!: string;

  volumes: Volumes[] = [
    { value: 'CX-5m³', viewValue: 'CX-5m³' },
    { value: 'CX-10m³', viewValue: 'CX-10m³' },
    { value: 'CX-15m³', viewValue: 'CX-15m³' },
    { value: 'LAV-5m³', viewValue: 'LAV-5m³' },
    { value: 'LAV-10m³', viewValue: 'LAV-10m³' },
    { value: 'LAV-15m³', viewValue: 'LAV-15m³' },
  ];

  verificarVolumeSelecionado(): boolean {
    const volumeSelecionado = this.formulario.get('volume')?.value;
    return volumeSelecionado && volumeSelecionado !== '';
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

  private normalizarFlagSimNao(valor: string | undefined): string {
    return valor === 'SIM' ? 'SIM' : 'NÃO';
  }

  convertToUppercase(controlName: string): void {
    const control = this.formulario.get(controlName);
    if (control) {
      const value = control.value || '';
      control.setValue(value.toUpperCase(), { emitEvent: false });
    }
  }

  onCheckboxChangeExibirPreco(valor: boolean) {
    const exibirPreco = valor ? 'SIM' : 'NÃO';

    this.formulario.patchValue({ exibirPreco: exibirPreco });

    if (exibirPreco === 'SIM') {
      this.atualizarPrecoComExtras();
    } else {
      this.formulario.patchValue({ precoEscolhido: '' });
    }
  }

  onCheckboxChangeEntregaSabado(valor: boolean) {
    const entregaSabado = valor ? 'SIM' : 'NÃO';

    this.formulario.patchValue({ entregaSabado: entregaSabado });

    this.atualizarPrecoComExtras();
  }

  onCheckboxChangeValorAjudante(checked: boolean) {
    const valor = checked ? 'SIM' : 'NÃO';
    this.formulario.patchValue({ ajudante: valor });
    this.atualizarPrecoComExtras();
  }

  onCheckboxChangeValorAdicional(checked: boolean) {
    const valor = checked ? 'SIM' : 'NÃO';
    this.formulario.patchValue({ adicional: valor });
    this.atualizarPrecoComExtras();
  }

  onCheckboxChangeValorAjudanteToco(checked: boolean) {
    const valor = checked ? 'SIM' : 'NÃO';
    this.formulario.patchValue({ ajudanteToco: valor });
    this.atualizarPrecoComExtras();
  }

  onCheckboxChangeAdicionalBombaGas(checked: boolean) {
    const valor = checked ? 'SIM' : 'NÃO';
    this.formulario.patchValue({ bombaGas: valor });
    this.atualizarPrecoComExtras();
  }

  atualizarPrecoComExtras() {
    let precoBase = 0;

    const volumeControl = this.formulario.get('volume');
    const volumeSelecionado = volumeControl?.value;
    const entregaSabado = this.formulario.get('entregaSabado')?.value === 'SIM';

    switch (volumeSelecionado) {
      case 'CX-5m³':
        precoBase = this.converterParaNumero(
          this.formulario.get(entregaSabado ? 'precoCx5Sabado' : 'precoCx5')
            ?.value,
        );
        break;
      case 'CX-10m³':
        precoBase = this.converterParaNumero(
          this.formulario.get(entregaSabado ? 'precoCx10Sabado' : 'precoCx10')
            ?.value,
        );
        break;
      case 'CX-15m³':
        precoBase = this.converterParaNumero(
          this.formulario.get(entregaSabado ? 'precoCx15Sabado' : 'precoCx15')
            ?.value,
        );
        break;
      case 'LAV-5m³':
        precoBase = this.converterParaNumero(
          this.formulario.get(entregaSabado ? 'precoLv5Sabado' : 'precoLv5')
            ?.value,
        );
        break;
      case 'LAV-10m³':
        precoBase = this.converterParaNumero(
          this.formulario.get(entregaSabado ? 'precoLv10Sabado' : 'precoLv10')
            ?.value,
        );
        break;
      case 'LAV-15m³':
        precoBase = this.converterParaNumero(
          this.formulario.get(entregaSabado ? 'precoLv15Sabado' : 'precoLv15')
            ?.value,
        );
        break;
    }

    if (!volumeSelecionado || precoBase === 0) {
      this.mensagemService.showErrorMessage(
        'O volume selecionado não possui preço de referência. Favor incluir no Cliente!',
      );
      volumeControl?.setValue('', { emitEvent: false });
      return;
    }

    const temAjudanteVuc = this.formulario.get('ajudante')?.value === 'SIM';
    const temAjudanteToco =
      this.formulario.get('ajudanteToco')?.value === 'SIM';
    const temAdicionalMangueira =
      this.formulario.get('adicional')?.value === 'SIM';
    const temAdicionalBombaGas =
      this.formulario.get('bombaGas')?.value === 'SIM';

    const valorAjudanteVuc =
      this.converterParaNumero(this.formulario.get('valorAjudanteVuc')?.value) ||
      0;
    const valorAjudanteToco =
      this.converterParaNumero(this.formulario.get('valorAjudanteToco')?.value) ||
      0;
    const adicionalMangueira =
      this.converterParaNumero(this.formulario.get('adicionalMangueira')?.value) ||
      0;
    const adicionalBombaGas =
      this.converterParaNumero(this.formulario.get('adicionalBombaGas')?.value) ||
      0;

    const somaExtras =
      (temAjudanteVuc ? valorAjudanteVuc : 0) +
      (temAjudanteToco ? valorAjudanteToco : 0) +
      (temAdicionalMangueira ? adicionalMangueira : 0) +
      (temAdicionalBombaGas ? adicionalBombaGas : 0);

    const precoFinal = precoBase + somaExtras;

    const precoFormatado = precoFinal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    this.formulario.patchValue({
      precoEscolhido: precoFormatado,
      precoFinal: precoFormatado,
    });
  }

  private converterParaNumero(valorFormatado: string): number {
    if (!valorFormatado) return 0;

    const valorLimpo = valorFormatado
      .toString()
      .replace(/[^\d,]/g, '')
      .replace(',', '.');

    return parseFloat(valorLimpo) || 0;
  }

  async onSubmit(status: string) {
    this.atualizarFormulario(status);

    if (status === 'Salvo') {
      this.pedidoService.salvar(this.formulario.value).subscribe({
        next: () => {
          this.mensagemService.showSuccessMessage('Pedido salvo com sucesso!');
          this.router.navigate(['/menu']);
        },
        error: () => this.onError(),
      });
      return;
    }

    try {
      if (this.isModoOffline || !navigator.onLine) {
        await this.emitirPedidoOfflineComImagemEImpressao();
        this.mensagemService.showSuccessMessage(
          'Pedido emitido offline com sucesso! Será sincronizado quando a internet voltar.',
        );
      } else {
        await this.emitirPedidoComImagemEImpressao();
        this.mensagemService.showSuccessMessage('Pedido emitido com sucesso!');
      }

      this.router.navigate(['/menu']);
    } catch (error) {
      console.error('Erro ao emitir pedido:', error);
      this.mensagemService.showErrorMessage(
        'Erro ao emitir pedido ou gerar impressão',
      );
    }
  }

  private async emitirPedidoComImagemEImpressao(): Promise<void> {
    this.prepararFormularioAntesDoEnvio();

    const pedidoSalvo = await lastValueFrom(
      this.pedidoService.salvar(this.formulario.value),
    );

    if (!pedidoSalvo?.idPedido) {
      throw new Error('Erro ao salvar pedido');
    }

    this.formulario.patchValue(
      { idPedido: pedidoSalvo.idPedido },
      { emitEvent: false },
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const imagemPedido = await this.pedidoService.gerarImagemBase64();
    if (!imagemPedido) {
      throw new Error('Erro ao gerar imagem do pedido');
    }

    const pedidoComImagem = {
      ...pedidoSalvo,
      imagemPedido,
    };

    await Promise.all([
      lastValueFrom(this.pedidoService.salvar(pedidoComImagem)),
      this.pedidoService.gerarImpressaoUsandoImagem(imagemPedido),
    ]);
  }

private async emitirPedidoOfflineComImagemEImpressao(): Promise<void> {
  this.prepararFormularioAntesDoEnvio();

  const offlineId = this.offlineDbService.gerarIdOffline();

  this.formulario.patchValue(
    {
      idPedido: offlineId,
      status: 'Emitido',
      imagemPedido: '',
    },
    { emitEvent: false },
  );

  await new Promise((resolve) => setTimeout(resolve, 0));

  const imagemPedido = await this.pedidoService.gerarImagemBase64();

  const pedidoOffline: Partial<Pedido> = {
    ...this.formulario.value,
    idPedido: offlineId,
    imagemPedido: imagemPedido || '',
    status: 'Emitido',
  };

  await this.offlineDbService.salvarPedidoOffline({
    offlineId,
    pedido: pedidoOffline,
    sincronizado: false,
    dataCriacaoOffline: new Date().toISOString(),
  });

  if (imagemPedido) {
    await this.pedidoService.gerarImpressaoUsandoImagem(imagemPedido);
    return;
  }

  await this.pedidoService.gerarImpressaoOfflineDireta();
}

  private atualizarFormulario(status: string) {
    const dataFormatada = new Date(
      Date.now() - 3 * 60 * 60 * 1000,
    ).toISOString();

    const valorAjudanteVuc = this.converterParaNumero(
      this.formulario.get('valorAjudanteVuc')?.value,
    );
    const valorAjudanteToco = this.converterParaNumero(
      this.formulario.get('valorAjudanteToco')?.value,
    );
    const adicionalMangueira = this.converterParaNumero(
      this.formulario.get('adicionalMangueira')?.value,
    );
    const adicionalBombaGas = this.converterParaNumero(
      this.formulario.get('adicionalBombaGas')?.value,
    );

    const valorAjudante = valorAjudanteVuc + valorAjudanteToco;
    const valorAdicional = adicionalMangueira + adicionalBombaGas;

    this.formulario.patchValue({
      status,
      dataAtualizacaoPedido: dataFormatada,
      valorAjudanteVuc,
      valorAjudanteToco,
      adicionalMangueira,
      adicionalBombaGas,
      valorAjudante,
      valorAdicional,
    });
  }

  private prepararFormularioAntesDoEnvio(): void {
    const form = this.formulario;

    const exibirPreco =
      form.get('exibirPreco')?.value === 'SIM' ? 'SIM' : 'NÃO';
    const ajudante = form.get('ajudante')?.value === 'SIM' ? 'SIM' : 'NÃO';
    const adicional = form.get('adicional')?.value === 'SIM' ? 'SIM' : 'NÃO';
    const ajudanteToco =
      form.get('ajudanteToco')?.value === 'SIM' ? 'SIM' : 'NÃO';
    const bombaGas = form.get('bombaGas')?.value === 'SIM' ? 'SIM' : 'NÃO';

    const valorAjudanteVuc =
      ajudante === 'SIM'
        ? this.converterParaNumero(form.get('valorAjudanteVuc')?.value)
        : 0;
    const valorAjudanteToco =
      ajudanteToco === 'SIM'
        ? this.converterParaNumero(form.get('valorAjudanteToco')?.value)
        : 0;
    const adicionalMangueira =
      adicional === 'SIM'
        ? this.converterParaNumero(form.get('adicionalMangueira')?.value)
        : 0;
    const adicionalBombaGas =
      bombaGas === 'SIM'
        ? this.converterParaNumero(form.get('adicionalBombaGas')?.value)
        : 0;

    const valorAjudante = valorAjudanteVuc + valorAjudanteToco;
    const valorAdicional = adicionalMangueira + adicionalBombaGas;

    form.patchValue({
      exibirPreco,
      entregaSabado:
        form.get('entregaSabado')?.value === 'SIM' ? 'SIM' : 'NÃO',
      ajudante,
      adicional,
      ajudanteToco,
      bombaGas,
      valorAjudanteVuc,
      valorAjudanteToco,
      adicionalMangueira,
      adicionalBombaGas,
      valorAjudante,
      valorAdicional,
    });

    const precoFinal = form.get('precoFinal')?.value;
    if (Array.isArray(precoFinal)) {
      form.patchValue({
        precoFinal: precoFinal[0],
      });
    }
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.mensagemService.showErrorMessage('Erro ao salvar o pedido!');
  }
}