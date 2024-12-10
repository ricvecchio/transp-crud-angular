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
  dataInicialControl = new FormControl('', [Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)]);
  dataFinalControl = new FormControl('', [Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)]);

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

  constructor(
    private pedidoService: PedidoService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.atualiza();
  }

  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.atualiza();
    this.dataInicialControl.valueChanges.subscribe(() => this.applyFilter());
    this.dataFinalControl.valueChanges.subscribe(() => this.applyFilter());
  }

  atualiza(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.pedidos$ = this.pedidoService
      .listar(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap((pagina: PedidoPagina) => {
          this.dataSource.data = pagina.pedidos;
          this.dataSource.paginator = this.paginator;
        }),
        catchError((error) => {
          this.onError('Erro ao carregar pedidos.');
          return of({ pedidos: [], totalElementos: 0, totalPaginas: 0 });
        }),
      );
  }

  applyFilter() {
    const dataInicial = this.dataInicialControl.value
      ? new Date(this.dataInicialControl.value)
      : null;
    const dataFinal = this.dataFinalControl.value
      ? new Date(this.dataFinalControl.value)
      : null;

    this.dataSource.filterPredicate = (data: Pedido) => {
      const dataAtualizacao = new Date(data.dataAtualizacaoPedido);

      if (dataInicial && dataFinal) {
        return (
          dataAtualizacao >= dataInicial &&
          dataAtualizacao <= new Date(dataFinal.setHours(23, 59, 59, 999))
        );
      } else if (dataInicial) {
        return dataAtualizacao >= dataInicial;
      } else if (dataFinal) {
        return dataAtualizacao <= new Date(dataFinal.setHours(23, 59, 59, 999));
      }
      return true;
    };

    this.dataSource.filter = `${dataInicial || ''}-${dataFinal || ''}`;
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
