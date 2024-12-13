import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
import {
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../../compartilhado/componentes/error-dialog/error-dialog.component';
import { Pedido } from '../../../modelo/pedido';
import { PedidoPagina } from '../../../modelo/pedido-pagina';
import { PedidoService } from '../../servico/pedido.service';

@Component({
  selector: 'app-pedidos-lista',
  templateUrl: './pedidos-lista.component.html',
  styleUrl: './pedidos-lista.component.css',
  standalone: true,
  imports: [
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
    'tipoPgto',
    'logradouroEntrega',
    'mangueira',
    'volume',
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
    this.atualiza(); // Carrega os dados inicialmente.
  }

  setupFilterListeners() {
    combineLatest([
      this.dataInicialControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => !!value && this.isValidDate(value)),
      ),
      this.dataFinalControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => !!value && this.isValidDate(value)),
      ),
    ])
      .pipe(
        map(([dataInicial, dataFinal]) => ({
          dataInicial: this.parseDate(dataInicial),
          dataFinal: this.parseDate(dataFinal),
        })),
      )
      .subscribe(({ dataInicial, dataFinal }) => {
        this.applyFilter(dataInicial, dataFinal);
        console.log('Data Inicial:', dataInicial);
        console.log('Data Final:', dataFinal);
      });
  }

  atualiza(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    const dataInicial = this.parseDate(this.dataInicialControl.value);
    const dataFinal = this.parseDate(this.dataFinalControl.value);

    // Se as datas estiverem vazias, não filtra, apenas carrega todos os pedidos
    if (!dataInicial && !dataFinal) {
      this.pedidos$ = this.pedidoService
        .listar(pageEvent.pageIndex, pageEvent.pageSize)
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
      return;
    }

    // Se as datas forem válidas, faz a requisição com os filtros
    if (dataInicial && dataFinal) {
      this.pedidos$ = this.pedidoService
        .listar(pageEvent.pageIndex, pageEvent.pageSize, dataInicial, dataFinal)
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
  }

  applyFilter(dataInicial?: string, dataFinal?: string) {
    // Se as datas forem válidas, faz a requisição com os filtros
    if (dataInicial && dataFinal) {
      this.atualiza({ length: 0, pageIndex: 0, pageSize: this.pageSize });
    } else {
      this.clearFilters();
    }
  }

  clearFilters() {
    this.dataInicialControl.reset();
    this.dataFinalControl.reset();
    this.atualiza({ length: 0, pageIndex: 0, pageSize: this.pageSize });
  }

  private isValidDate(dateString: string | null): boolean {
    if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return false;
    }
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
    // Convertendo para o formato ISO com a hora em UTC
    const isoString = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}T00:00:00Z`;
    return isoString;
  }

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
}
