import { AsyncPipe } from '@angular/common';
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
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  tap,
} from 'rxjs';

import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { MensagemService } from '../../../compartilhado/mensagem.service';
import { Cliente } from '../../../modelo/cliente';
import { ClientePagina } from '../../../modelo/cliente-pagina';
import { ClienteService } from '../../servicos/cliente.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css',
  standalone: true,
  imports: [
    MatCard,
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
  ],
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

  permissaoUsuario: string | null = null;

  ngOnInit(): void {
    this.permissaoUsuario = sessionStorage.getItem('permission');

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
    private mensagemService: MensagemService,
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
          const errorMessage =
            error.status === 403
              ? 'Usuário sem Permissão!'
              : error.status === 500
                ? 'Erro interno no servidor. Contate o suporte.'
                : 'Erro ao carregar clientes.';
          this.mensagemService.showErrorMessage(errorMessage);
          console.error('Erro ao carregar clientes: ', error);
          return of({ clientes: [], totalElementos: 0, totalPaginas: 0 });
        }),
      );
  }

  clearFilters() {
    this.filterControl.reset();
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
            this.mensagemService.showSuccessMessage(
              'Cliente removido com sucesso!',
            );
          },
          () => {
            this.mensagemService.showErrorMessage(
              'Erro ao tentar remover cliente.',
            );
          },
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
