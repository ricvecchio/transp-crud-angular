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
import { catchError, Observable, of, tap } from 'rxjs';

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

  ngOnInit(): void {
    this.dataInicialControl.valueChanges.subscribe(() => this.applyFilter());
    this.dataFinalControl.valueChanges.subscribe(() => this.applyFilter());
  }

  constructor(
    private pedidoService: PedidoService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.atualiza();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10

  atualiza(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
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
  }

  applyFilter() {
    const dataInicial: Date | null = this.dataInicialControl.value
      ? this.parseDate(this.dataInicialControl.value)
      : null;
    const dataFinal: Date | null = this.dataFinalControl.value
      ? this.parseDate(this.dataFinalControl.value)
      : null;

    this.dataSource.filterPredicate = (data: Pedido) => {
      const dataAtualizacao = this.parseDate(
        data.dataAtualizacaoPedido.split(' ')[0],
      ); // Ignorar hora

      if (dataAtualizacao) {
        if (dataInicial && dataFinal) {
          return dataAtualizacao >= dataInicial && dataAtualizacao <= dataFinal;
        } else if (dataInicial) {
          return dataAtualizacao >= dataInicial;
        } else if (dataFinal) {
          return dataAtualizacao <= dataFinal;
        }
      }

      return false;
    };

    this.dataSource.filter = `${dataInicial || ''}-${dataFinal || ''}`;
  }

  private parseDate(dateString: string): Date | null {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    date.setHours(0, 0, 0, 0);

    return date;
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
