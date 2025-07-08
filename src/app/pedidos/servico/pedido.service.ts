import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

import { first, Observable } from 'rxjs';

import { MensagemService } from '../../compartilhado/mensagem.service';
import { Pedido } from '../../modelo/pedido';
import { PedidoPagina } from '../../modelo/pedido-pagina';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API = 'https://saotomecatimesaotomecatime.com/api/pedidos';
  // private readonly API = 'http://localhost:8080/api/pedidos'; //EXCLUIR

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
    console.time('PedidoService.listar'); // EXCLUIR
    console.log('→ INÍCIO: listar'); // EXCLUIR
    const headers = this.getAuthHeaders();
    const params: any = { page, pageSize };

    if (clienteFiltro) params.clienteFiltro = clienteFiltro;
    if (dataInicial) params.dataInicial = dataInicial;
    if (dataFinal) params.dataFinal = dataFinal;
    if (statusFiltro) params.statusFiltro = statusFiltro;
    console.log('← FIM: listar'); //EXCLUIR
    console.timeEnd('PedidoService.listar'); //EXCLUIR

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
    console.time('PedidoService.salvar'); // EXCLUIR
    console.log('→ INÍCIO: salvar'); // EXCLUIR
    if (pedido.idPedido) {
      console.log('← FIM: salvar.editar'); //EXCLUIR
      console.timeEnd('PedidoService.salvar.editar'); //EXCLUIR
      return this.editar(pedido);
    }
    console.log('← FIM: salvar.criar'); //EXCLUIR
    console.timeEnd('PedidoService.salvar.criar'); //EXCLUIR
    return this.criar(pedido);
  }

  private criar(pedido: Partial<Pedido>) {
    console.time('PedidoService.criar'); // EXCLUIR
    console.log('→ INÍCIO: criar'); // EXCLUIR
    const headers = this.getAuthHeaders();
    return this.http.post<Pedido>(this.API, pedido, { headers }).pipe(first());
  }

  private editar(pedido: Partial<Pedido>) {
    console.time('PedidoService.editar'); // EXCLUIR
    console.log('→ INÍCIO: editar'); // EXCLUIR
    const headers = this.getAuthHeaders();
    return this.http
      .put<Pedido>(`${this.API}/${pedido.idPedido}`, pedido, { headers })
      .pipe(first());
  }

  excluir(idPedido: string) {
    console.time('PedidoService.excluir'); // EXCLUIR
    console.log('→ INÍCIO: excluir'); // EXCLUIR
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.API}/${idPedido}`, { headers })
      .pipe(first());
  }

  // async gerarImagemBase64(): Promise<string | null> {
  //   console.time('PedidoService.gerarImagemBase64'); // EXCLUIR
  //   console.log('→ INÍCIO: gerarImagemBase64'); // EXCLUIR

  //   const container = document.querySelector(
  //     '.container-previa',
  //   ) as HTMLElement;
  //   if (!container) {
  //     this.mensagemService.showErrorMessage(
  //       'Elemento .container-previa não encontrado',
  //     );
  //     return null;
  //   }

  //   try {
  //     const clone = container.cloneNode(true) as HTMLElement;

  //     clone
  //       .querySelectorAll('button, input, select, textarea, .nao-imprimir')
  //       .forEach((el) => el.remove());

  //     clone.style.position = 'fixed';
  //     clone.style.top = '0';
  //     clone.style.left = '0';

  //     document.body.appendChild(clone);

  //     const beforeCanvas = performance.now(); // EXCLUIR
  //     console.time('→ INÍCIO: domtoimage-render'); // EXCLUIR

  //     const dataUrl = await domtoimage.toPng(clone, {
  //       cacheBust: true,
  //       bgcolor: '#fff',
  //     });

  //     console.log('Canvas render time:', performance.now() - beforeCanvas); // EXCLUIR
  //     console.timeEnd('→ FIM: domtoimage-render'); // EXCLUIR

  //     document.body.removeChild(clone);

  //     console.log('← FIM: gerarImagemBase64'); // EXCLUIR
  //     console.timeEnd('PedidoService.gerarImagemBase64'); // EXCLUIR

  //     return dataUrl;
  //   } catch (error) {
  //     this.mensagemService.showErrorMessage('Erro ao gerar imagem do pedido.');
  //     return null;
  //   }
  // }
  async gerarImagemBase64(): Promise<string | null> {
    console.time('PedidoService.gerarImagemBase64'); // EXCLUIR
    console.log('→ INÍCIO: gerarImagemBase64'); // EXCLUIR
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

      // clone.style.position = 'fixed';
      // clone.style.top = '0';
      // clone.style.left = '0';
      // clone.style.opacity = '1';
      // clone.style.background = 'white';

      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.opacity = '1';
      clone.style.visibility = 'visible';
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '10000';
      clone.style.background = 'white';
      clone.style.transform = 'scale(1)';

      document.body.appendChild(clone);

      const dataUrl = await domtoimage.toPng(clone, {
        cacheBust: true,
        bgcolor: '#fff',
      });

      document.body.removeChild(clone);
      console.log('← FIM: gerarImagemBase64'); // EXCLUIR
      console.timeEnd('PedidoService.gerarImagemBase64'); // EXCLUIR

      return dataUrl;
    } catch (error) {
      this.mensagemService.showErrorMessage('Erro ao gerar imagem do pedido.');
      return null;
    }
  }

  async gerarImpressaoUsandoImagem(imagemData: string): Promise<void> {
    console.time('PedidoService.gerarImpressaoUsandoImagem'); // EXCLUIR
    console.log('→ INÍCIO: gerarImpressaoUsandoImagem'); // EXCLUIR
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
                <img src="${imagemData}" class="image" />
              </div>
              <div class="image-container" style="top: 50%;">
                <img src="${imagemData}" class="image" />
              </div>
            </div>
          </body>
        </html>
      `);
        iframeDocument.close();
        console.log('← FIM: gerarImpressaoUsandoImagem'); //EXCLUIR
        console.timeEnd('PedidoService.gerarImpressaoUsandoImagem'); //EXCLUIR
      } catch (error) {
        this.mensagemService.showErrorMessage('Erro ao imprimir o pedido.');
        reject(error);
      }
    });
  }
}
