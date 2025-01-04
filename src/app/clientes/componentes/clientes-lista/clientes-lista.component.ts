import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMiniFabButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
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
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  tap,
} from 'rxjs';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../../compartilhado/componentes/error-dialog/error-dialog.component';
import { Cliente } from '../../../modelo/cliente';
import { ClientePagina } from '../../../modelo/cliente-pagina';
import { ClienteService } from '../../servicos/cliente.service';

@Component({
    selector: 'app-clientes-lista',
    templateUrl: './clientes-lista.component.html',
    styleUrl: './clientes-lista.component.css',
    imports: [
        MatCard,
        MatToolbar,
        MatTable,
        MatLabel,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatCellDef,
        MatCell,
        MatMiniFabButton,
        MatIcon,
        MatAutocompleteModule,
        MatFormField,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow,
        MatPaginator,
        MatProgressSpinner,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        AsyncPipe,
    ]
})
export class ClientesListaComponent implements OnInit {
  clientes$: Observable<ClientePagina> | null = null;
  readonly displayedColumns: string[] = [
    'acaoConsulta',
    'idCliente',
    'nome',
    'razaoSocial',
    'cpfCnpj',
    'enderecoEntrega',
    'acao',
  ];

  dataSource = new MatTableDataSource<Cliente>();
  filterControl = new FormControl('');

  ngOnInit(): void {
    this.filterControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filterValue: string | null) => {
        this.atualiza(
          { length: 0, pageIndex: 0, pageSize: this.pageSize },
          filterValue,
        );
      });
  }

  constructor(
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
  ) {
    this.atualiza();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;

  atualiza(
    pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 },
    filterValue: string | null = '',
  ) {
    const normalizedFilter = filterValue?.trim().toLowerCase() || '';

    this.clientes$ = this.clienteService
      .listar(pageEvent.pageIndex, pageEvent.pageSize, normalizedFilter)
      .pipe(
        tap((pagina) => {
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
          this.dataSource.data = pagina.clientes;
        }),
        catchError((error) => {
          this.onError('Erro ao carregar clientes.');
          return of({ clientes: [], totalElementos: 0, totalPaginas: 0 });
        }),
      );
  }

  listar(
    page: number,
    pageSize: number,
    filter: string = '',
  ): Observable<ClientePagina> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('filter', filter);
    return this.httpClient.get<ClientePagina>('/api/clientes', { params });
  }

  clearFilters() {
    this.filterControl.reset();
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  onAdd() {
    this.router.navigate(['/cadastrar-cliente'], { relativeTo: this.route });
  }

  onEdit(cliente: Cliente) {
    this.router.navigate(['/editar-cliente', cliente.idCliente], {
      relativeTo: this.route,
    });
  }

  onSearch(cliente: Cliente) {
    this.router.navigate(['/expandir-cliente', cliente.idCliente], {
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

  onMenu() {
    this.router.navigate(['/menu'], {
      relativeTo: this.route,
    });
  }
}
