import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

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
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      return canvas.toDataURL('image/png');
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