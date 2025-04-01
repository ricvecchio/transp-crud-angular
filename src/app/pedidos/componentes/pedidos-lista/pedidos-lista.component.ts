import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, Observable, of, tap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { MensagemService } from '../../../compartilhado/mensagem.service';
import { Pedido } from '../../../modelo/pedido';
import { PedidoPagina } from '../../../modelo/pedido-pagina';
import { PedidoService } from '../../servico/pedido.service';

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pedidos-lista',
  templateUrl: './pedidos-lista.component.html',
  styleUrl: './pedidos-lista.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatCard,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatMiniFabButton,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatProgressSpinner,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class PedidosListaComponent implements OnInit {
  pedidos$: Observable<PedidoPagina> | null = null;

  permissaoUsuario: string | null = null;

  dataSource = new MatTableDataSource<Pedido>();

  filterControl = new FormControl('');
  statusControl = new FormControl('Emitido');

  dataInicialControl = new FormControl('', [
    Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/),
  ]);
  dataFinalControl = new FormControl('', [
    Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/),
  ]);

  readonly displayedColumns: string[] = [
    'acaoConsulta',
    'acaoPrint',
    'idPedido',
    'idCliente',
    'nome',
    'razaoSocial',
    'cpfCnpj',
    'enderecoEntrega',
    'dataAtualizacaoPedido',
    'status',
    'acao',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;

  constructor(
    private pedidoService: PedidoService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private mensagemService: MensagemService,
  ) {}

  ngOnInit(): void {
    this.permissaoUsuario = sessionStorage.getItem('permission');

    this.setupFilterListeners();
    this.atualiza();
  }

  setupFilterListeners() {
    this.dataInicialControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((dataInicial) => this.isValidDate(dataInicial)),
        tap((dataInicial) => {
          const parsedDataInicial = this.parseDate(dataInicial);
          this.applyFilter(parsedDataInicial);
        }),
      )
      .subscribe();

    this.dataFinalControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((dataFinal) => this.isValidDate(dataFinal)),
        tap(() => {
          const dataInicial = this.parseDate(this.dataInicialControl.value);
          const dataFinal = this.parseDate(this.dataFinalControl.value);
          this.applyFilter(dataInicial, dataFinal);
        }),
      )
      .subscribe();

    this.filterControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          const clienteFiltro = this.filterControl.value?.trim() || undefined;
          this.applyFilter(clienteFiltro);
        }),
      )
      .subscribe();

    this.statusControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          const statusFiltro = this.statusControl.value?.trim() || undefined;
          this.applyFilter(statusFiltro);
        }),
      )
      .subscribe();
  }

  applyFilter(
    clienteFiltro?: string,
    dataInicial?: string,
    dataFinal?: string,
    status?: string,
  ) {
    this.atualiza({
      length: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
    });
  }

  atualiza(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    const dataInicial = this.parseDate(this.dataInicialControl.value);
    const dataFinal = this.parseDate(this.dataFinalControl.value);
    const clienteFiltro = this.filterControl.value?.trim() || undefined;
    const statusFiltro = this.statusControl.value?.trim() || undefined;

    this.pedidos$ = this.pedidoService
      .listar(
        pageEvent.pageIndex,
        pageEvent.pageSize,
        clienteFiltro,
        dataInicial,
        dataFinal,
        statusFiltro,
      )
      .pipe(
        tap((pagina) => {
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
          this.dataSource.data = pagina.pedidos;
        }),
        catchError((error) => {
          const errorMessage =
            error.status === 403
              ? 'Usuário sem Permissão!'
              : error.status === 500
                ? 'Erro interno no servidor. Contate o suporte.'
                : 'Erro ao carregar Pedidos.';
          this.mensagemService.showErrorMessage(errorMessage);
          console.error('Erro ao carregar pedidos: ', error);
          return of({ pedidos: [], totalElementos: 0, totalPaginas: 0 });
        }),
      );
  }

  clearFilters() {
    this.filterControl.reset('', { emitEvent: false });
    this.dataInicialControl.reset('', { emitEvent: false });
    this.dataFinalControl.reset('', { emitEvent: false });
    this.statusControl.reset('Emitido', { emitEvent: false });

    this.atualiza({
      length: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
    });
  }

  private isValidDate(dateString: string | null): boolean {
    if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      !isNaN(date.getTime()) &&
      date.getDate() === day &&
      date.getMonth() + 1 === month &&
      date.getFullYear() === year
    );
  }

  private parseDate(dateString: string | null): string | undefined {
    if (!dateString || !this.isValidDate(dateString)) return undefined;
    const [day, month, year] = dateString.split('/').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  onDateInput(
    event: Event,
    controlName: 'dataInicialControl' | 'dataFinalControl',
  ): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5);
    }

    const parts = value.split('/').map(Number);
    const [day, month, year] = parts;

    if (day && (day < 1 || day > 31)) {
      value = `31/${value.split('/').slice(1).join('/')}`;
    }
    if (month && (month < 1 || month > 12)) {
      value = `${value.split('/')[0]}/12/${value.split('/').slice(2).join('/')}`;
    }
    if (year && year > 9999) {
      value = `${value.split('/').slice(0, 2).join('/')}/9999`;
    }

    this[controlName].setValue(value, { emitEvent: false });
  }

  listaStatus: Status[] = [
    { value: 'Emitido', viewValue: 'Emitido' },
    { value: 'Cancelado', viewValue: 'Cancelado' },
    { value: 'Salvo', viewValue: 'Salvo' },
  ];

  onEdit(pedido: Pedido) {
    this.router.navigate(['/editar-pedido', pedido.idPedido], {
      relativeTo: this.route,
    });
  }

  onSearch(pedido: Pedido) {
    this.router.navigate(['/expandir-pedido', pedido.idPedido], {
      relativeTo: this.route,
    });
  }

  async onPrint(pedido: Pedido) {
    console.log('Dados Recebidos onPrint pedido: ', pedido);
    console.log('Dados Recebidos onPrint imagemPedido: ', pedido.imagemPedido);

    if (!pedido.imagemPedido) {
      this.mensagemService.showErrorMessage('Imagem do pedido não disponível.');
      return;
    }

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
        return;
      }

      iframeDocument.open();
      iframeDocument.write(`
      <html>
        <head>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; }
            .pedido-id { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
            .image-container { display: flex; justify-content: center; align-items: center; width: 100%; height: 80vh; }
            .image { max-width: 100%; max-height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <div class="image-container">
            <img src="${pedido.imagemPedido}" class="image" />
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
    } catch (error) {
      this.mensagemService.showErrorMessage('Erro ao imprimir o pedido.');
    }
  }

  onDelete(pedido: Pedido) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse pedido?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.pedidoService.excluir(pedido.idPedido).subscribe(
          () => {
            this.atualiza();
            this.mensagemService.showSuccessMessage(
              'Pedido removido com sucesso!',
            );
          },
          () =>
            this.mensagemService.showErrorMessage(
              'Erro ao tentar remover o pedido.',
            ),
        );
      }
    });
  }

  onMenu() {
    this.router.navigate(['/menu'], {
      relativeTo: this.route,
    });
  }
}
