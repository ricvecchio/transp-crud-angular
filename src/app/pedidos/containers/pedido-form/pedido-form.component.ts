import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';

import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { MensagemService } from '../../../compartilhado/mensagem.service';
import { Cliente } from '../../../modelo/cliente';
import { Pedido } from '../../../modelo/pedido';
import { PedidoService } from '../../servico/pedido.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

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
export class PedidoFormComponent implements OnInit {
  formulario!: FormGroup;
  dataAtual: Date = new Date();

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private consultaCepService: ConsultaCepService,
    private pedidoService: PedidoService,
    private mensagemService: MensagemService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public formUtils: FormUtilsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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
      valorAjudante: [pedido.valorAjudante],
      valorAdicional: [pedido.valorAdicional],
      volume: [pedido.volume],
      precoCx5: [this.formatarParaReais(pedido.precoCx5)],
      precoCx10: [this.formatarParaReais(pedido.precoCx10)],
      precoCx15: [this.formatarParaReais(pedido.precoCx15)],
      precoLv5: [this.formatarParaReais(pedido.precoLv5)],
      precoLv10: [this.formatarParaReais(pedido.precoLv10)],
      precoLv15: [this.formatarParaReais(pedido.precoLv15)],
      precoEscolhido: [''],
      exibirPreco: ['NÃO'],
      ajudante: ['NÃO'],
      adicional: ['NÃO'],
      precoFinal: [this.formatarParaReais(pedido.precoFinal)],
      observacao: [pedido.observacao],
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
          valorAjudante: pedido.valorAjudante,
          valorAdicional: pedido.valorAdicional,
          volume: pedido.volume,
          precoCx5: pedido.precoCx5,
          precoCx10: pedido.precoCx10,
          precoCx15: pedido.precoCx15,
          precoLv5: pedido.precoLv5,
          precoLv10: pedido.precoLv10,
          precoLv15: pedido.precoLv15,
          ajudante: ['NÃO'],
          adicional: ['NÃO'],
          precoFinal: pedido.precoFinal,
          observacao: pedido.observacao,
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
          valorAjudante: cliente.valorAjudante,
          valorAdicional: cliente.valorAdicional,
          precoCx5: cliente.precoCx5,
          precoCx10: cliente.precoCx10,
          precoCx15: cliente.precoCx15,
          precoLv5: cliente.precoLv5,
          precoLv10: cliente.precoLv10,
          precoLv15: cliente.precoLv15,
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
      'precoFinal',
    ]);

    this.formatarCampoCep();

    this.formulario.get('volume')?.valueChanges.subscribe(() => {
      this.atualizarPrecoComExtras();
    });
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
      valorAjudante: pedidoParams.valorAjudante || '',
      valorAdicional: pedidoParams.valorAdicional || '',
      volume: pedidoParams.volume || '',
      precoCx5: pedidoParams.precoCx5 || '',
      precoCx10: pedidoParams.precoCx10 || '',
      precoCx15: pedidoParams.precoCx15 || '',
      precoLv5: pedidoParams.precoLv5 || '',
      precoLv10: pedidoParams.precoLv10 || '',
      precoLv15: pedidoParams.precoLv15 || '',
      ajudante: pedidoParams.ajudante || '',
      adicional: pedidoParams.adicional || '',
      precoFinal: pedidoParams.precoFinal || '',
      observacao: pedidoParams.observacao || '',
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
      valorAjudante: clienteParams.valorAjudante || '',
      valorAdicional: clienteParams.valorAdicional || '',
      precoCx5: clienteParams.precoCx5 || '',
      precoCx10: clienteParams.precoCx10 || '',
      precoCx15: clienteParams.precoCx15 || '',
      precoLv5: clienteParams.precoLv5 || '',
      precoLv10: clienteParams.precoLv10 || '',
      precoLv15: clienteParams.precoLv15 || '',
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

  atualizarPrecoComExtras() {
    console.time('PedidoFormComponent.atualizarPrecoComExtras'); // EXCLUIR
    console.log('→ INÍCIO: atualizarPrecoComExtras'); // EXCLUIR
    let precoBase = 0;

    const volumeControl = this.formulario.get('volume');
    const volumeSelecionado = volumeControl?.value;

    switch (volumeSelecionado) {
      case 'CX-5m³':
        precoBase =
          this.converterParaNumero(this.formulario.get('precoCx5')?.value) || 0;
        break;
      case 'CX-10m³':
        precoBase =
          this.converterParaNumero(this.formulario.get('precoCx10')?.value) ||
          0;
        break;
      case 'CX-15m³':
        precoBase =
          this.converterParaNumero(this.formulario.get('precoCx15')?.value) ||
          0;
        break;
      case 'LAV-5m³':
        precoBase =
          this.converterParaNumero(this.formulario.get('precoLv5')?.value) || 0;
        break;
      case 'LAV-10m³':
        precoBase =
          this.converterParaNumero(this.formulario.get('precoLv10')?.value) ||
          0;
        break;
      case 'LAV-15m³':
        precoBase =
          this.converterParaNumero(this.formulario.get('precoLv15')?.value) ||
          0;
        break;
    }

    if (!volumeSelecionado || precoBase === 0) {
      this.mensagemService.showErrorMessage(
        'O volume selecionado não possui preço de referência. Favor incluir no Cliente!',
      );
      volumeControl?.setValue('', { emitEvent: false });
      return;
    }

    const temAjudante = this.formulario.get('ajudante')?.value === 'SIM';
    const temAdicional = this.formulario.get('adicional')?.value === 'SIM';

    const valorAjudante =
      this.converterParaNumero(this.formulario.get('valorAjudante')?.value) ||
      0;
    const valorAdicional =
      this.converterParaNumero(this.formulario.get('valorAdicional')?.value) ||
      0;

    const adicionalAjudante = temAjudante ? valorAjudante : 0;
    const adicionalAdicional = temAdicional ? valorAdicional : 0;

    const precoFinal = precoBase + adicionalAjudante + adicionalAdicional;

    const precoFormatado = precoFinal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    this.formulario.patchValue({
      precoEscolhido: precoFormatado,
      precoFinal: precoFormatado,
    });

    console.log('← FIM: atualizarPrecoComExtras'); //EXCLUIR
    console.timeEnd('PedidoFormComponent.atualizarPrecoComExtras'); //EXCLUIR
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
    console.time('PedidoFormComponent.onSubmit'); // EXCLUIR
    console.log('→ INÍCIO: onSubmit'); // EXCLUIR
    this.atualizarFormulario(status);

    if (status === 'Salvo') {
      this.salvarPedido();
    } else {
      try {
        await this.emitirPedidoComImagemEImpressao();
        this.mensagemService.showSuccessMessage('Pedido emitido com sucesso!');
        this.router.navigate(['/menu']);
      } catch (error) {
        console.error('Erro ao emitir pedido:', error);
        this.mensagemService.showErrorMessage(
          'Erro ao emitir pedido ou gerar impressão',
        );
      }
    }
    console.log('← FIM: onSubmit'); //EXCLUIR
    console.timeEnd('PedidoFormComponent.onSubmit'); //EXCLUIR
  }

  // private async emitirPedidoComImagemEImpressao(): Promise<void> {
  //   console.time('PedidoFormComponent.emitirPedidoComImagemEImpressao'); // EXCLUIR
  //   console.log('→ INÍCIO: emitirPedidoComImagemEImpressao'); // EXCLUIR
  //   this.prepararFormularioAntesDoEnvio();

  //   const pedidoSalvo = await lastValueFrom(
  //     this.pedidoService.salvar(this.formulario.value),
  //   );
  //   if (!pedidoSalvo?.idPedido) throw new Error('Erro ao salvar pedido');

  //   this.formulario.patchValue({ idPedido: pedidoSalvo.idPedido }, { emitEvent: false });

  //   await new Promise((resolve) => setTimeout(resolve, 0));

  //   const imagemPedido = await this.pedidoService.gerarImagemBase64();
  //   if (!imagemPedido) throw new Error('Erro ao gerar imagem do pedido');

  //   const pedidoComImagem = {
  //     ...pedidoSalvo,
  //     imagemPedido,
  //   };

  //   await Promise.all([
  //     lastValueFrom(this.pedidoService.salvar(pedidoComImagem)),
  //     this.pedidoService.gerarImpressaoUsandoImagem(imagemPedido),
  //   ]);
  //   console.log('← FIM: emitirPedidoComImagemEImpressao'); //EXCLUIR
  //   console.timeEnd('PedidoFormComponent.emitirPedidoComImagemEImpressao'); //EXCLUIR
  // }
  private async emitirPedidoComImagemEImpressao(): Promise<void> {
    console.time('PedidoFormComponent.emitirPedidoComImagemEImpressao'); // EXCLUIR
    console.log('→ INÍCIO: emitirPedidoComImagemEImpressao'); // EXCLUIR
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
    console.log('← FIM: emitirPedidoComImagemEImpressao'); //EXCLUIR
    console.timeEnd('PedidoFormComponent.emitirPedidoComImagemEImpressao'); //EXCLUIR
  }

  private atualizarFormulario(status: string) {
    console.time('PedidoFormComponent.atualizarFormulario'); // EXCLUIR
    console.log('→ INÍCIO: atualizarFormulario'); // EXCLUIR
    const dataFormatada = new Date(
      Date.now() - 3 * 60 * 60 * 1000,
    ).toISOString();

    const valorAjudante = this.converterParaNumero(
      this.formulario.get('valorAjudante')?.value,
    );
    const valorAdicional = this.converterParaNumero(
      this.formulario.get('valorAdicional')?.value,
    );

    this.formulario.patchValue({
      status,
      dataAtualizacaoPedido: dataFormatada,
      valorAjudante,
      valorAdicional,
    });
    console.log('← FIM: atualizarFormulario'); //EXCLUIR
    console.timeEnd('PedidoFormComponent.atualizarFormulario'); //EXCLUIR
  }

  private salvarPedido() {
    console.time('PedidoFormComponent.salvarPedido'); // EXCLUIR
    console.log('→ INÍCIO: salvarPedido'); // EXCLUIR
    this.pedidoService.salvar(this.formulario.value).subscribe({
      next: () => {
        this.onSucess();
        this.router.navigate(['/menu']);
      },
      error: () => this.onError(),
    });
    console.log('← FIM: salvarPedido'); //EXCLUIR
    console.timeEnd('PedidoFormComponent.salvarPedido'); //EXCLUIR
  }

  private prepararFormularioAntesDoEnvio(): void {
    console.time('PedidoFormComponent.prepararFormularioAntesDoEnvio'); // EXCLUIR
    console.log('→ INÍCIO: prepararFormularioAntesDoEnvio'); // EXCLUIR
    const form = this.formulario;

    const exibirPreco =
      form.get('exibirPreco')?.value === 'SIM' ? 'SIM' : 'NÃO';
    const ajudante = form.get('ajudante')?.value === 'SIM' ? 'SIM' : 'NÃO';
    const adicional = form.get('adicional')?.value === 'SIM' ? 'SIM' : 'NÃO';

    const valorAjudante =
      ajudante === 'SIM'
        ? this.converterParaNumero(form.get('valorAjudante')?.value)
        : 0;

    const valorAdicional =
      adicional === 'SIM'
        ? this.converterParaNumero(form.get('valorAdicional')?.value)
        : 0;

    form.patchValue({
      exibirPreco,
      ajudante,
      adicional,
      valorAjudante,
      valorAdicional,
    });
    console.log('← FIM: prepararFormularioAntesDoEnvio'); //EXCLUIR
    console.timeEnd('PedidoFormComponent.prepararFormularioAntesDoEnvio'); //EXCLUIR
  }

  private onSucess() {
    console.time('PedidoFormComponent.onSucess'); // EXCLUIR
    console.log('→ INÍCIO: onSucess'); // EXCLUIR
    this.mensagemService.showSuccessMessage('Pedido Salvo com sucesso!');
    this.formulario.reset();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    console.time('PedidoFormComponent.onError'); // EXCLUIR
    console.log('→ INÍCIO: onError'); // EXCLUIR
    this.mensagemService.showErrorMessage('Erro ao salvar o pedido!');
  }
}
