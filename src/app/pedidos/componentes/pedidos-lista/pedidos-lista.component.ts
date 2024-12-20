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
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { MatToolbar } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, Observable, of, tap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../../compartilhado/componentes/error-dialog/error-dialog.component';
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
    MatToolbar,
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
    'idPedido',
    'nome',
    'razaoSocial',
    'cpfCnpj',
    'enderecoEntrega',
    'dataAtualizacaoPedido',
    'status',
    'idCliente',
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
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
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
          this.onError('Erro ao carregar pedidos.');
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
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos.

    // Adiciona as barras de formatação (dd/mm/aaaa).
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5);
    }

    // Limita o valor do dia, mês e ano.
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

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

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

  onDelete(pedido: Pedido) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse pedido?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.pedidoService.excluir(pedido.idPedido).subscribe(
          () => {
            this.atualiza();
            this.snackBar.open('Pedido removido com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
          },
          () => this.onError('Erro ao tentar remover o pedido.'),
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
