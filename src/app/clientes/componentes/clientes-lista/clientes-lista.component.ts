import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

import {
  ConfirmationDialogComponent,
} from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../../compartilhado/componentes/error-dialog/error-dialog.component';
import { Cliente } from '../../../modelo/cliente';
import { ClienteService } from '../../servicos/cliente.service';
import { ClientePagina } from '../../../modelo/cliente-pagina';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'app-clientes-lista',
    templateUrl: './clientes-lista.component.html',
    styleUrl: './clientes-lista.component.css',
    standalone: true,
    imports: [MatCard, MatToolbar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatMiniFabButton, MatIcon, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, MatProgressSpinner, AsyncPipe]
})
export class ClientesListaComponent implements OnInit {

  clientes$: Observable<ClientePagina> | null = null;
  readonly displayedColumns: string[] = [
    'idCliente',
    'nome',
    'cpfcnpj',
    'telefone',
    'celular',
    'email',
    'bairro',
    'acao'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;

  constructor(
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.atualiza();
  }

  atualiza(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.clientes$ = this.clienteService.listar(pageEvent.pageIndex, pageEvent.pageSize)
    .pipe(
      tap(() => {
        this.pageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
      }),
      catchError((error) => {
        this.onError('Erro ao carregar clientes.');
        return of( {clientes: [], totalElementos: 0, totalPaginas: 0 })
      })
    );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  ngOnInit(): void {}

  onAdd() {
    this.router.navigate(['/cadastrar-cliente'], { relativeTo: this.route });
  }

  onEdit(cliente: Cliente) {
    this.router.navigate(['/editar-cliente', cliente.idCliente], {
      relativeTo: this.route,
    });
  }

  onDelete(cliente: Cliente) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse cliente?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.clienteService.excluir(cliente.idCliente).subscribe(
          () => {
            this.atualiza();
            this.snackBar.open('Cliente removido com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
          },
          () => this.onError('Erro ao tentar remover cliente.'),
        );
      }
    });
  }
}
