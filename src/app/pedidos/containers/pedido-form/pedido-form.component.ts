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
import html2canvas from 'html2canvas';

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
    const pedido: Pedido = this.route.snapshot.data['pedido'];
    this.formulario = this.formBuilder.group({
      nomeBusca: [
        pedido.nomeBusca,
        [Validators.required, Validators.minLength(3)],
      ],
      // idCliente: [pedido.idCliente, [Validators.pattern(/^\d+$/)]],
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
      cepPedido: [this.formatarCep(pedido.cepPedido)],
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
      precoCx5: [this.formatarParaReais(pedido.precoCx5)],
      precoCx10: [this.formatarParaReais(pedido.precoCx10)],
      precoCx15: [this.formatarParaReais(pedido.precoCx15)],
      precoLv5: [this.formatarParaReais(pedido.precoLv5)],
      precoLv10: [this.formatarParaReais(pedido.precoLv10)],
      precoLv15: [this.formatarParaReais(pedido.precoLv15)],
      precoEscolhido: [''],
      ajudanteHora: [pedido.ajudanteHora],
      observacao: [pedido.observacao],
      dataAtualizacaoPedido: [pedido.dataAtualizacaoPedido],
      status: [pedido.status],
    });

    this.route.queryParams.subscribe((params) => {
      if (params) {
        const pedido: Pedido = this.formatarPedido(params);
        this.formulario.patchValue({
          idCliente: pedido.idCliente,
          nome: pedido.nome,
          cpfcnpj: pedido.cpfcnpj,
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
          idPedido: pedido.idPedido,
          nomePedido: pedido.nomePedido,
          razaoSocial: pedido.razaoSocial,
          cpfcnpjPedido: pedido.cpfcnpjPedido,
          tipoPgto: pedido.tipoPgto,
          cepPedido: pedido.cepPedido,
          logradouroPedido: pedido.logradouroPedido,
          numeroPedido: pedido.numeroPedido,
          complementoPedido: pedido.complementoPedido,
          bairroPedido: pedido.bairroPedido,
          cidadePedido: pedido.cidadePedido,
          estadoPedido: pedido.estadoPedido,
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
          ajudanteHora: pedido.ajudanteHora,
          observacao: pedido.observacao,
          status: pedido.status,
        });
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params) {
        const cliente: Cliente = this.formatarCliente(params);
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
      }
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

    this.formatarCampos([
      'precoCx5',
      'precoCx10',
      'precoCx15',
      'precoLv5',
      'precoLv10',
      'precoLv15',
    ]);

    this.formatarCampoCep();

    this.formulario
      .get('volume')
      ?.valueChanges.subscribe((volumeSelecionado) => {
        let precoSelecionado = '';
        switch (volumeSelecionado) {
          case 'cx-5m³':
            precoSelecionado = this.formulario.get('precoCx5')?.value;
            break;
          case 'cx-10m³':
            precoSelecionado = this.formulario.get('precoCx10')?.value;
            break;
          case 'cx-15m³':
            precoSelecionado = this.formulario.get('precoCx15')?.value;
            break;
          case 'lav-5m³':
            precoSelecionado = this.formulario.get('precoLv5')?.value;
            break;
          case 'lav-10m³':
            precoSelecionado = this.formulario.get('precoLv10')?.value;
            break;
          case 'lav-15m³':
            precoSelecionado = this.formulario.get('precoLv15')?.value;
            break;
        }
        this.formulario.get('precoEscolhido')?.setValue(precoSelecionado);
      });
  }

  // Método para formatar dados do pedido vindo da consulta expandida.
  private formatarPedido(pedidoParams: any): Pedido {
    return {
      dataAtualizacaoPedido: pedidoParams.dataAtualizacaoPedido || '',
      nomeBusca: pedidoParams.nomeBusca || '',
      idCliente: pedidoParams.idCliente || '',
      nome: pedidoParams.nome || '',
      cpfcnpj: pedidoParams.cpfcnpj || '',
      telefone: pedidoParams.telefone || '',
      celular: pedidoParams.celular || '',
      email: pedidoParams.email || '',
      cep: pedidoParams.cep || '',
      logradouro: pedidoParams.logradouro || '',
      numero: pedidoParams.numero || '',
      complemento: pedidoParams.complemento || '',
      bairro: pedidoParams.bairro || '',
      cidade: pedidoParams.cidade || '',
      estado: pedidoParams.estado || '',
      idPedido: pedidoParams.idPedido || '',
      nomePedido: pedidoParams.nomePedido || '',
      razaoSocial: pedidoParams.razaoSocial || '',
      cpfcnpjPedido: pedidoParams.cpfcnpjPedido || '',
      tipoPgto: pedidoParams.tipoPgto || '',
      cepPedido: pedidoParams.cepPedido || '',
      logradouroPedido: pedidoParams.logradouroPedido || '',
      numeroPedido: pedidoParams.numeroPedido || '',
      complementoPedido: pedidoParams.complementoPedido || '',
      bairroPedido: pedidoParams.bairroPedido || '',
      cidadePedido: pedidoParams.cidadePedido || '',
      estadoPedido: pedidoParams.estadoPedido || '',
      sfobras: pedidoParams.sfobras || '',
      cno: pedidoParams.cno || '',
      ie: pedidoParams.ie || '',
      mangueira: pedidoParams.mangueira || '',
      volume: pedidoParams.volume || '',
      precoCx5: pedidoParams.precoCx5 || '',
      precoCx10: pedidoParams.precoCx10 || '',
      precoCx15: pedidoParams.precoCx15 || '',
      precoLv5: pedidoParams.precoLv5 || '',
      precoLv10: pedidoParams.precoLv10 || '',
      precoLv15: pedidoParams.precoLv15 || '',
      ajudanteHora: pedidoParams.ajudanteHora || '',
      observacao: pedidoParams.observacao || '',
      status: pedidoParams.status || '',
    };
  }

  // Método para formatar dados do cliente
  private formatarCliente(clienteParams: any): Cliente {
    return {
      dataAtualizacaoCliente: clienteParams.dataAtualizacaoCliente || '',
      idCliente: clienteParams.idCliente || '',
      nome: clienteParams.nome || '',
      cpfcnpj: this.formatarCpfCnpj(clienteParams.cpfcnpj || ''),
      telefone: this.formatarTelefone(clienteParams.telefone || ''),
      celular: this.formatarTelefone(clienteParams.celular || ''),
      email: clienteParams.email || '',
      cep: clienteParams.cep || '',
      logradouro: clienteParams.logradouro || '',
      numero: clienteParams.numero || '',
      complemento: clienteParams.complemento || '',
      bairro: clienteParams.bairro || '',
      cidade: clienteParams.cidade || '',
      estado: clienteParams.estado || '',
    };
  }

  // Métodos auxiliares para formatação
  private formatarCpfCnpj(cpfcnpj: string): string {
    if (!cpfcnpj) return '';
    return cpfcnpj.length === 11
      ? cpfcnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // Formato CPF
      : cpfcnpj.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          '$1.$2.$3/$4-$5',
        ); // Formato CNPJ
  }

  private formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3'); // Formato (XX) XXXXX-XXXX
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

  // consultaClienteId() {
  //   const idCliente = this.formulario.get('idCliente')?.value;
  //   if (idCliente != '') {
  //     this.clienteService.buscarPorId(idCliente).subscribe((dados: any) => {
  //       if (dados !== null && dados != undefined) {
  //         this.formulario.patchValue({
  //           nome: dados.nome,
  //           cpfcnpj: dados.cpfcnpj,
  //           telefone: dados.telefone,
  //           celular: dados.celular,
  //           email: dados.email,
  //           cep: dados.cep,
  //           logradouro: dados.logradouro,
  //           numero: dados.numero,
  //           complemento: dados.complemento,
  //           bairro: dados.bairro,
  //           cidade: dados.cidade,
  //           estado: dados.estado,
  //         });
  //       } else {
  //         this.dialogoClienteNaoEncontrado();
  //         this.formulario.patchValue({
  //           idCliente: idCliente.clear_all,
  //         });
  //       }
  //     });
  //   }
  // }

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

  onCpfCnpjPedidoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 14) {
      value = value.substring(0, 14);
    }

    if (value.length > 11) {
      // Formata como CNPJ: xx.xxx.xxx/xxxx-xx
      value = value.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
        '$1.$2.$3/$4-$5',
      );
    } else if (value.length > 9) {
      // Formata como CPF: xxx.xxx.xxx-xx
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d+).*/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d+).*/, '$1.$2');
    }

    input.value = value;
    this.formulario.get('cpfcnpj')?.setValue(value);
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

  private formatarCampoCep(): void {
    const cepControl = this.formulario.get('cepPedido');
    if (cepControl) {
      cepControl.valueChanges.subscribe((valor) => {
        const formatado = this.formatarCep(valor);
        if (formatado !== valor) {
          cepControl.setValue(formatado, { emitEvent: false }); // Evitar loops infinitos
        }
      });
    }
  }

  private formatarCep(valor: any): string {
    if (!valor) return '';
    valor = valor.toString().replace(/\D/g, ''); // Remove tudo que não for número
    if (valor.length > 5) {
      valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
    }
    return valor;
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
    valor = valor.toString().replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    const numero = parseFloat(valor) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  dataAtual: Date = new Date();

   async onSubmit(status: string) {
    this.formulario.patchValue({ status: status });

    if (status == 'Salvo') {
      this.service.salvar(this.formulario.value).subscribe({
        next: (result) => {
          this.onSucess();
          this.router.navigate(['/menu']);
        },
        error: (error) => this.onError(),
      });
    } else {
      try {
        const idPedido = await this.emitirPedido(status);

        await new Promise((resolve) => setTimeout(resolve, 100));

        const container = document.querySelector(
          '.container-previa',
        ) as HTMLElement;

        if (container) {
          html2canvas(container)
            .then((canvas) => {
              const imageData = canvas.toDataURL('image/png');

              const iframe = document.createElement('iframe');
              iframe.style.position = 'absolute';
              iframe.style.width = '0px';
              iframe.style.height = '0px';
              iframe.style.border = 'none';
              document.body.appendChild(iframe);

              const iframeDocument = iframe.contentWindow?.document;
              if (iframeDocument) {
                iframeDocument.open();
                iframeDocument.write(`
                <html>
                  <body>
                    <img src="${imageData}" style="width: 100%; max-width: 100%;" />
                  </body>
                </html>
              `);
                iframeDocument.close();

                iframe.onload = () => {
                  iframe.contentWindow?.print();

                  const iframeContentWindow = iframe.contentWindow;
                  if (
                    iframeContentWindow &&
                    iframeContentWindow.onafterprint !== undefined
                  ) {
                    iframeContentWindow.onafterprint = () => {
                      document.body.removeChild(iframe);
                    };
                  }
                };
              }
              this.router.navigate(['/menu']);
            })
            .catch((error) => {
              console.error('Erro ao capturar a tela:', error);
            });
        } else {
          console.error('Elemento .container-previa não encontrado');
        }
      } catch (error) {
        console.error('Erro ao emitir pedido ou capturar tela:', error);
      }
    }
  }

  emitirPedido(status: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const dataFormatada = this.formatarData(this.dataAtual);

      this.formulario.patchValue({
        dataAtualizacaoPedido: dataFormatada,
      });

      this.formulario.patchValue({ status: status });

      this.service.salvar(this.formulario.value).subscribe({
        next: (result) => {
          this.formulario.patchValue({ idPedido: result.idPedido });
          resolve(result.idPedido);
        },
        error: (error) => {
          this.onError();
          reject(error);
        },
      });
    });
  }

  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }

  private onSucess() {
    this.snackBar.open('Pedido Salvo com sucesso!', '', {
      duration: 5000,
    });
    this.formulario.reset();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o pedido!', '', { duration: 5000 });
  }
}
