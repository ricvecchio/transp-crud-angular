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
import html2canvas from 'html2canvas';

import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { MensagemService } from '../../../compartilhado/mensagem.service';
import { Cliente } from '../../../modelo/cliente';
import { Pedido } from '../../../modelo/pedido';
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
export class PedidoFormComponent implements OnInit {
  formulario!: FormGroup;

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
      volume: [pedido.volume],
      precoCx5: [this.formatarParaReais(pedido.precoCx5)],
      precoCx10: [this.formatarParaReais(pedido.precoCx10)],
      precoCx15: [this.formatarParaReais(pedido.precoCx15)],
      precoLv5: [this.formatarParaReais(pedido.precoLv5)],
      precoLv10: [this.formatarParaReais(pedido.precoLv10)],
      precoLv15: [this.formatarParaReais(pedido.precoLv15)],
      precoEscolhido: [''],
      exibirPreco: [''],
      ajudante: [pedido.ajudante],
      observacao: [pedido.observacao],
      dataAtualizacaoPedido: [pedido.dataAtualizacaoPedido],
      status: [pedido.status],
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
          volume: pedido.volume,
          precoCx5: pedido.precoCx5,
          precoCx10: pedido.precoCx10,
          precoCx15: pedido.precoCx15,
          precoLv5: pedido.precoLv5,
          precoLv10: pedido.precoLv10,
          precoLv15: pedido.precoLv15,
          ajudante: pedido.ajudante,
          observacao: pedido.observacao,
          status: pedido.status,
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
    ]);

    this.formatarCampoCep();

    this.formulario
      .get('volume')
      ?.valueChanges.subscribe((volumeSelecionado) => {
        let precoSelecionado = '';
        switch (volumeSelecionado) {
          case 'CX-5m³':
            precoSelecionado = this.formulario.get('precoCx5')?.value;
            break;
          case 'CX-10m³':
            precoSelecionado = this.formulario.get('precoCx10')?.value;
            break;
          case 'CX-15m³':
            precoSelecionado = this.formulario.get('precoCx15')?.value;
            break;
          case 'LAV-5m³':
            precoSelecionado = this.formulario.get('precoLv5')?.value;
            break;
          case 'LAV-10m³':
            precoSelecionado = this.formulario.get('precoLv10')?.value;
            break;
          case 'LAV-15m³':
            precoSelecionado = this.formulario.get('precoLv15')?.value;
            break;
        }
        this.formulario.get('precoEscolhido')?.setValue(precoSelecionado);
      }
    );
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
      volume: pedidoParams.volume || '',
      precoCx5: pedidoParams.precoCx5 || '',
      precoCx10: pedidoParams.precoCx10 || '',
      precoCx15: pedidoParams.precoCx15 || '',
      precoLv5: pedidoParams.precoLv5 || '',
      precoLv10: pedidoParams.precoLv10 || '',
      precoLv15: pedidoParams.precoLv15 || '',
      ajudante: pedidoParams.ajudante || '',
      observacao: pedidoParams.observacao || '',
      status: pedidoParams.status || '',
      dataAtualizacaoPedido: pedidoParams.dataAtualizacaoPedido || '',
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

    let precoEscolhido = '';
    if (exibirPreco === 'SIM') {
      const volumeSelecionado = this.formulario.get('volume')?.value;
      switch (volumeSelecionado) {
        case 'CX-5m³':
          precoEscolhido = this.formulario.get('precoCx5')?.value;
          break;
        case 'CX-10m³':
          precoEscolhido = this.formulario.get('precoCx10')?.value;
          break;
        case 'CX-15m³':
          precoEscolhido = this.formulario.get('precoCx15')?.value;
          break;
        case 'LAV-5m³':
          precoEscolhido = this.formulario.get('precoLv5')?.value;
          break;
        case 'LAV-10m³':
          precoEscolhido = this.formulario.get('precoLv10')?.value;
          break;
        case 'LAV-15m³':
          precoEscolhido = this.formulario.get('precoLv15')?.value;
          break;
      }
    }

    this.formulario.patchValue({
      exibirPreco: exibirPreco,
      precoEscolhido: precoEscolhido,
    });
  }

  onCheckboxChangeAjudante(value: string) {
    this.formulario.patchValue({ ajudante: value });
  }

  async onSubmit(status: string) {
    this.formulario.patchValue({ status: status });

    if (status == 'Salvo') {
      const dataAjustada = new Date(this.dataAtual.getTime() - 3 * 60 * 60 * 1000);
      const dataFormatada = dataAjustada.toISOString();

      this.formulario.patchValue({
        dataAtualizacaoPedido: dataFormatada,
      });
      this.pedidoService.salvar(this.formulario.value).subscribe({
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
              // if (iframeDocument) {
              //   iframeDocument.open();
              //   iframeDocument.write(`
              //   <html>
              //     <body>
              //       <div style="display: flex; flex-direction: column;">
              //         <img src="${imageData}" style="width: 100%; max-width: 100%; margin-bottom: 20px;" />
              //         <img src="${imageData}" style="width: 100%; max-width: 100%;" />
              //       </div>
              //     </body>
              //   </html>
              // `);
              //   iframeDocument.close();
              if (iframeDocument) {
                iframeDocument.open();
                iframeDocument.write(`
                  <html>
                    <head>
                      <style>
                        @page { size: A4 portrait; margin: 0; }
                        body {
                          margin: 0;
                          display: flex;
                          flex-direction: column;
                          height: 100vh;
                        }
                        .page {
                          position: relative;
                          width: 100%;
                          height: 100vh;
                        }
                        .image-container {
                          width: 100%;
                          height: 50%;
                          position: absolute;
                          padding: 20px; /* Adiciona espaçamento para afastar das bordas */
                          box-sizing: border-box;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        }
                        .image {
                          width: 100%;
                          height: 100%;
                          object-fit: contain;
                          position: relative;
                        }
                        .corner-borders {
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          top: 0;
                          left: 0;
                          pointer-events: none;
                        }
                        .corner-borders::before,
                        .corner-borders::after {
                          content: "";
                          position: absolute;
                          width: 20px;
                          height: 20px;
                          border-color: black;
                          border-style: solid;
                        }
                        /* Cantos superiores */
                        .corner-borders::before {
                          top: 0;
                          left: 0;
                          border-width: 4px 0 0 4px;
                        }
                        .corner-borders::after {
                          top: 0;
                          right: 0;
                          border-width: 4px 4px 0 0;
                        }
                        /* Criando os cantos inferiores */
                        .corner-borders.bottom::before {
                          bottom: 0;
                          left: 0;
                          top: auto;
                          border-width: 0 0 4px 4px;
                        }
                        .corner-borders.bottom::after {
                          bottom: 0;
                          right: 0;
                          top: auto;
                          border-width: 0 4px 4px 0;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="page">
                        <div class="image-container" style="top: 0;">
                          <img src="${imageData}" class="image" />
                          <div class="corner-borders"></div>
                        </div>
                        <div class="image-container" style="top: 50%;">
                          <img src="${imageData}" class="image" />
                          <div class="corner-borders bottom"></div>
                        </div>
                      </div>
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
              this.mensagemService.showSuccessMessage(
                'Pedido Emitido com sucesso!',
              );
            })
            .catch((error) => {
              console.error('Erro ao capturar a tela: ', error);
              this.mensagemService.showErrorMessage('Erro ao capturar a tela');
            });
        } else {
          this.mensagemService.showErrorMessage(
            'Elemento .container-previa não encontrado',
          );
        }
      } catch (error) {
        console.error('Erro ao emitir pedido ou capturar tela: ', error);
        this.mensagemService.showErrorMessage(
          'Erro ao emitir pedido ou capturar tela',
        );
      }
    }
  }

  dataAtual: Date = new Date();

  emitirPedido(status: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const dataAjustada = new Date(this.dataAtual.getTime() - 3 * 60 * 60 * 1000);
      const dataFormatada = dataAjustada.toISOString();

      this.formulario.patchValue({
        dataAtualizacaoPedido: dataFormatada,
      });

      this.formulario.patchValue({ status: status });

      this.pedidoService.salvar(this.formulario.value).subscribe({
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

  private onSucess() {
    this.mensagemService.showSuccessMessage('Pedido Salvo com sucesso!');
    this.formulario.reset();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.mensagemService.showErrorMessage('Erro ao salvar o pedido!');
  }
}
