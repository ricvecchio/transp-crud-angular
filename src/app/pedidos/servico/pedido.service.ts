import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import domtoimage from 'dom-to-image';

import { first, Observable } from 'rxjs';

import { MensagemService } from '../../compartilhado/mensagem.service';
import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API = `${environment.apiBaseUrl}/pedidos`;

  constructor(
    private http: HttpClient,
    private mensagemService: MensagemService,
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    const username = sessionStorage.getItem('username');

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'X-User': username || '',
    });
  }

  listar(
    page: number,
    pageSize: number,
    clienteFiltro?: string,
    dataInicial?: string,
    dataFinal?: string,
    statusFiltro?: string,
  ): Observable<PedidoPagina> {
    const headers = this.getAuthHeaders();
    const params: any = { page, pageSize };

    if (clienteFiltro) params.clienteFiltro = clienteFiltro;
    if (dataInicial) params.dataInicial = dataInicial;
    if (dataFinal) params.dataFinal = dataFinal;
    if (statusFiltro) params.statusFiltro = statusFiltro;

    return this.http
      .get<PedidoPagina>(this.API, { headers, params })
      .pipe(first());
  }

  buscarPorId(idPedido: number): Observable<Pedido> {
    const headers = this.getAuthHeaders();
    const url = `${this.API}/${idPedido}`;
    return this.http.get<Pedido>(url, { headers });
  }

  buscarUltimosPedidos(
    idCliente: number,
    limite: number,
  ): Observable<Pedido[]> {
    const headers = this.getAuthHeaders();
    const params = {
      idCliente: idCliente.toString(),
      limite: limite.toString(),
    };

    return this.http.get<Pedido[]>(`${this.API}/ultimos`, {
      headers,
      params,
    });
  }

  salvar(pedido: Partial<Pedido>) {
    if (pedido.idPedido) {
      return this.editar(pedido);
    }

    return this.criar(pedido);
  }

  private criar(pedido: Partial<Pedido>) {
    const headers = this.getAuthHeaders();

    return this.http.post<Pedido>(this.API, pedido, { headers }).pipe(first());
  }

  private editar(pedido: Partial<Pedido>) {
    const headers = this.getAuthHeaders();

    return this.http
      .put<Pedido>(`${this.API}/${pedido.idPedido}`, pedido, { headers })
      .pipe(first());
  }

  excluir(idPedido: string) {
    const headers = this.getAuthHeaders();

    return this.http.delete(`${this.API}/${idPedido}`, { headers }).pipe(first());
  }

  async gerarImagemBase64(): Promise<string | null> {
    const container = document.querySelector(
      '.container-previa',
    ) as HTMLElement;

    if (!container) {
      this.mensagemService.showErrorMessage(
        'Elemento .container-previa não encontrado',
      );
      return null;
    }

    try {
      const clone = container.cloneNode(true) as HTMLElement;

      clone
        .querySelectorAll('button, input, select, textarea, .nao-imprimir')
        .forEach((el) => el.remove());

      clone.style.background = 'white';
      clone.style.position = 'fixed';
      clone.style.top = '-99999px';
      clone.style.left = '-99999px';
      clone.style.width = '1200px';

      document.body.appendChild(clone);

      const dataUrl = await domtoimage.toPng(clone, {
        cacheBust: false,
        bgcolor: '#ffffff',
      });

      document.body.removeChild(clone);

      return dataUrl;
    } catch (error) {
      console.error('Erro gerarImagemBase64:', error);
      this.mensagemService.showErrorMessage('Erro ao gerar imagem do pedido.');
      return null;
    }
  }

  async gerarImpressaoUsandoImagem(imagemData: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const iframe = document.createElement('iframe');

        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';

        document.body.appendChild(iframe);

        const iframeDocument = iframe.contentWindow?.document;

        if (!iframeDocument) {
          this.mensagemService.showErrorMessage(
            'Erro ao acessar o documento do iframe',
          );
          document.body.removeChild(iframe);
          return reject();
        }

        iframe.onload = () => {
          const printWindow = iframe.contentWindow;

          const afterPrintHandler = () => {
            printWindow?.removeEventListener('afterprint', afterPrintHandler);
            document.body.removeChild(iframe);
            resolve();
          };

          printWindow?.addEventListener('afterprint', afterPrintHandler);
          printWindow?.focus();
          printWindow?.print();
        };

        iframeDocument.open();

        iframeDocument.write(`
          <html>
            <head>
              <style>
                @page {
                  size: A4 portrait;
                  margin: 0;
                }

                body {
                  margin: 0;
                  padding: 0;
                }

                img {
                  width: 100%;
                  display: block;
                }
              </style>
            </head>

            <body>
              <img src="${imagemData}" />
              <img src="${imagemData}" />
            </body>
          </html>
        `);

        iframeDocument.close();
      } catch (error) {
        this.mensagemService.showErrorMessage('Erro ao imprimir o pedido.');
        reject(error);
      }
    });
  }

  async gerarImpressaoOfflineDireta(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const containerOriginal = document.querySelector(
          '.container-previa',
        ) as HTMLElement;

        if (!containerOriginal) {
          this.mensagemService.showErrorMessage('Prévia do pedido não encontrada.');
          return reject();
        }

        const primeiraVia = this.criarConteudoOfflineFormatado(containerOriginal);
        const segundaVia = this.criarConteudoOfflineFormatado(containerOriginal);

        const iframe = document.createElement('iframe');

        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';

        document.body.appendChild(iframe);

        const iframeDocument = iframe.contentWindow?.document;

        if (!iframeDocument) {
          document.body.removeChild(iframe);
          return reject();
        }

        iframe.onload = () => {
          const printWindow = iframe.contentWindow;

          const afterPrintHandler = () => {
            printWindow?.removeEventListener('afterprint', afterPrintHandler);
            document.body.removeChild(iframe);
            resolve();
          };

          printWindow?.addEventListener('afterprint', afterPrintHandler);
          printWindow?.focus();
          printWindow?.print();
        };

        iframeDocument.open();

        iframeDocument.write(`
          <html>
            <head>
              <title>Pedido Offline</title>

              <style>
                @page {
                  size: A4 portrait;
                  margin: 6mm;
                }

                * {
                  box-sizing: border-box;
                }

                body {
                  margin: 0;
                  padding: 0;
                  color: #222;
                  background: #ffffff;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 13px;
                }

                .via-pedido {
                  width: 100%;
                  min-height: 48%;
                  margin-bottom: 20px;
                  page-break-inside: avoid;
                }

                .container-previa {
                  display: block;
                  width: 100%;
                  margin: 0;
                }

                .container-previa-obs {
                  color: #a10f0f;
                  font-size: 13px;
                  font-weight: bold;
                  margin-bottom: 8px;
                }

                .modelo {
                  width: 100%;
                  border: 0;
                  padding: 0;
                  margin: 0;
                }

                .cabecalho-offline {
                  border: 4px solid #000;
                  padding: 6px 10px 4px;
                  margin-bottom: 8px;
                  text-align: center;
                }

                .cabecalho-titulo {
                  color: #142b67;
                  font-size: 26px;
                  font-weight: 900;
                  letter-spacing: 1px;
                  line-height: 1.1;
                  border-bottom: 1px solid #333;
                  padding-bottom: 4px;
                }

                .gota {
                  color: #0b4f9c;
                  margin-left: 8px;
                }

                .cabecalho-contatos {
                  display: flex;
                  justify-content: space-between;
                  gap: 10px;
                  font-size: 10px;
                  font-weight: bold;
                  padding-top: 4px;
                }

                .linha-pedido {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 5px;
                  margin-bottom: 8px;
                  font-size: 16px;
                  font-weight: bold;
                }

                .pedido-numero {
                  color: #a10f0f;
                }

                .pedido-data {
                  color: #142b67;
                }

                .modelo > .col-md-12.d-flex {
                  display: flex;
                  align-items: flex-start;
                  width: 100%;
                  margin-bottom: 6px;
                  line-height: 1.35;
                }

                .modelo > .d-flex {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  column-gap: 24px;
                  row-gap: 5px;
                  width: 100%;
                  margin-top: 8px;
                  margin-bottom: 6px;
                  align-items: start;
                }

                .modelo > .d-flex > .col-md-4 {
                  width: 100%;
                  min-width: 0;
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  white-space: normal;
                }

                .modelo > .d-flex.align-items-center > .col-md-4 {
                  display: block;
                }

                .modelo > .d-flex.align-items-center > .col-md-4 .container-previa-texto-fixo {
                  display: block;
                }

                .container-previa-texto-fixo {
                  color: #142b67;
                  font-weight: 900;
                  font-size: 13px;
                  margin-right: 5px;
                  white-space: nowrap;
                  display: inline-block;
                }

                .container-previa-texto {
                  color: #222;
                  font-size: 13px;
                  font-weight: 400;
                  display: inline-block;
                  word-break: break-word;
                }

                .obs-vermelha,
                .container-previa-obs .texto-vermelho {
                  color: #a10f0f;
                  font-weight: bold;
                  margin: 10px 0 8px;
                }

                .texto-vermelho {
                  color: #a10f0f;
                }

                .texto-azul-escuro {
                  color: #142b67;
                }

                .rodape-offline {
                  display: grid;
                  grid-template-columns: 36% 64%;
                  border: 4px solid #000;
                  min-height: 48px;
                  margin-top: 8px;
                }

                .rodape-esquerda {
                  border-right: 4px solid #000;
                  padding: 7px;
                  font-size: 9px;
                  font-weight: bold;
                  line-height: 1.1;
                }

                .rodape-direita {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  position: relative;
                  overflow: hidden;
                  padding: 4px;
                }

                .conferencia {
                  color: #d8d8d8;
                  font-size: 20px;
                  font-weight: 900;
                  letter-spacing: 1px;
                  line-height: 1;
                  white-space: nowrap;
                }

                .assinatura {
                  color: #000;
                  font-size: 10px;
                  font-weight: 900;
                  margin-top: 4px;
                }

                img,
                mat-list,
                mat-divider,
                .preview-image-container {
                  display: none !important;
                }

                .col-md-12,
                .col-md-9,
                .col-md-6,
                .col-md-4,
                .col-md-3,
                .col-md-2,
                .col-md-1 {
                  padding: 0;
                  max-width: none;
                }

                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                }
              </style>
            </head>

            <body>
              <div class="via-pedido">
                ${primeiraVia}
              </div>

              <div class="via-pedido">
                ${segundaVia}
              </div>
            </body>
          </html>
        `);

        iframeDocument.close();
      } catch (error) {
        console.error('Erro gerarImpressaoOfflineDireta:', error);
        this.mensagemService.showErrorMessage('Erro ao gerar impressão offline.');
        reject(error);
      }
    });
  }

  private criarConteudoOfflineFormatado(containerOriginal: HTMLElement): string {
    const clone = containerOriginal.cloneNode(true) as HTMLElement;

    const logo = clone.querySelector('img[alt="Logo São Tomé"]');
    if (logo) {
      logo.outerHTML = `
        <div class="cabecalho-offline">
          <div class="cabecalho-titulo">
            SÃO TOMÉ CATIME <span class="gota">💧</span>
          </div>

          <div class="cabecalho-contatos">
            <div>TELS.: (11) 96448-2908 / (11) 5073-0376 / (11) 5073-9610</div>
            <div>
              saotome@transportadorasaotome.com.br<br />
              www.transportadorasaotome.com.br
            </div>
          </div>
        </div>
      `;
    }

    const rodape = clone.querySelector('img[alt="Rodapé da Prévia do Pedido"]');
    if (rodape) {
      rodape.outerHTML = `
        <div class="rodape-offline">
          <div class="rodape-esquerda">
            OBS.: Permanecer no máximo 1 hora no local, após este período será acrescido 50% do valor frete.
          </div>

          <div class="rodape-direita">
            <div class="conferencia">CONFERÊNCIA NA CHEGADA E SAÍDA</div>
            <div class="assinatura">RECEBIDO - ASSINATURA LEGÍVEL OU CARIMBO</div>
          </div>
        </div>
      `;
    }

    this.reformatarLinhaPedido(clone);

    return clone.innerHTML;
  }

  private reformatarLinhaPedido(clone: HTMLElement): void {
    const pedido = clone.querySelector('.texto-vermelho');
    const data = clone.querySelector('.texto-azul-escuro');

    if (!pedido || !data) {
      return;
    }

    const linhaOriginal = pedido.closest('.container-previa-texto');

    if (!linhaOriginal) {
      return;
    }

    linhaOriginal.outerHTML = `
      <div class="linha-pedido">
        <div class="pedido-numero">${pedido.textContent || ''}</div>
        <div class="pedido-data">${data.textContent || ''}</div>
      </div>
    `;
  }
}