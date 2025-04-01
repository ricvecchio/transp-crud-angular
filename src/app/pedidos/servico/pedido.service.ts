import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';
import { MensagemService } from '../../compartilhado/mensagem.service';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API = 'https://saotomecatimesaotomecatime.com/api/pedidos';

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
    return this.http.get<Pedido[]>(`${this.API}/ultimos`, { headers, params });
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
    return this.http
      .delete(`${this.API}/${idPedido}`, { headers })
      .pipe(first());
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
      const canvas = await html2canvas(container);
      const imageData = canvas.toDataURL('image/png');
      return imageData;
    } catch (error) {
      this.mensagemService.showErrorMessage('Erro ao gerar imagem do pedido.');
      return null;
    }
  }

  async gerarImpressao(): Promise<string | null> {
    const imageData = await this.gerarImagemBase64();

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
        return null;
      }

      iframeDocument.open();
      iframeDocument.write(`
        <html>
          <head>
            <style>
              @page { size: A4 portrait; margin: 0; }
              body { margin: 0; display: flex; flex-direction: column; height: 100vh; }
              .page { position: relative; width: 100%; height: 100vh; }
              .image-container { width: 100%; height: 50%; position: absolute; padding: 20px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; }
              .image { width: 100%; height: 100%; object-fit: contain; position: relative; }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="image-container" style="top: 0;">
                <img src="${imageData}" class="image" />
              </div>
              <div class="image-container" style="top: 50%;">
                <img src="${imageData}" class="image" />
              </div>
            </div>
          </body>
        </html>
      `);
      iframeDocument.close();

      await new Promise<void>((resolve) => {
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          iframe.contentWindow?.addEventListener('afterprint', () => {
            document.body.removeChild(iframe);
            resolve();
          });
        };
      });
      return imageData;
    } catch (error) {
      this.mensagemService.showErrorMessage('Erro ao imprimir o pedido.');
      return null;
    }
  }
}
