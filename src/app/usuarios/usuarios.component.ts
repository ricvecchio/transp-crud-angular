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
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  tap,
} from 'rxjs';

import { UsuarioPagina } from '../modelo/usuario-pagina';
import { Usuario } from '../modelo/usuario';
import { UsuarioService } from './usuario.service';
import { ErrorDialogComponent } from '../compartilhado/componentes/error-dialog/error-dialog.component';
import { ConfirmationDialogComponent } from '../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.css',
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
    ]
})
export class UsuariosComponent implements OnInit {
  usuarios$: Observable<UsuarioPagina> | null = null;
  readonly displayedColumns: string[] = [
    'name',
    'email',
    'username',
    'permission',
  ];

  dataSource = new MatTableDataSource<Usuario>();
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
    private usuarioService: UsuarioService,
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

    this.usuarios$ = this.usuarioService
      .listar(pageEvent.pageIndex, pageEvent.pageSize, normalizedFilter)
      .pipe(
        tap((pagina) => {
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
          this.dataSource.data = pagina.usuarios;
        }),
        catchError((error) => {
          const errorMessage =
            error.status === 403 ? 'Usuário sem Permissão!' : 'Erro ao carregar usuários.';
          this.onError(errorMessage);
          return of({ usuarios: [], totalElementos: 0, totalPaginas: 0 });
        }),
      );
  }

  clearFilters() {
    this.filterControl.reset();
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  onEdit(usuario: Usuario) {
    this.router.navigate(['/edit', usuario.idUsuario], {
      relativeTo: this.route,
    });
  }

  onDelete(usuario: Usuario) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse usuário?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.usuarioService.excluir(usuario.idUsuario).subscribe(
          () => {
            this.atualiza();
            this.snackBar.open('Usuário removido com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
          },
          () => this.onError('Erro ao tentar remover o usuário.'),
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

