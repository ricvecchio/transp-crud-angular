import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

import {
  ConfirmationDialogComponent,
} from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../../../compartilhado/componentes/error-dialog/error-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';
import { PedidoPagina } from '../../../modelo/pedido-pagina';
import { PedidoService } from '../../servico/pedido.service';
import { Pedido } from '../../../modelo/pedido';

@Component({
    selector: 'app-pedidos-lista',
    templateUrl: './pedidos-lista.component.html',
    styleUrl: './pedidos-lista.component.css',
    standalone: true,
    imports: [MatCard, MatToolbar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatMiniFabButton, MatIcon, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, MatProgressSpinner, AsyncPipe]
})
export class PedidosListaComponent implements OnInit {

  pedidos$: Observable<PedidoPagina> | null = null;
  readonly displayedColumns: string[] = [
    'idPedido',
    'nomePedido',
    'mangueira',
    'volume',
    'acao'
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
  ) {
    this.atualiza();
  }

  atualiza(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.pedidos$ = this.pedidoService.listar(pageEvent.pageIndex, pageEvent.pageSize)
    .pipe(
      tap(() => {
        this.pageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
      }),
      catchError((error) => {
        this.onError('Erro ao carregar pedidos.');
        return of( {pedidos: [], totalElementos: 0, totalPaginas: 0 })
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
    this.router.navigate(['/cadastrar-pedido'], { relativeTo: this.route });
  }

  onEdit(pedido: Pedido) {
    this.router.navigate(['/editar-pedido', pedido.idPedido], {
      relativeTo: this.route,
    });
  }

  onDelete(pedido: Pedido) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse pedido?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(result);
      console.log(pedido);
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


// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { catchError, Observable, of } from 'rxjs';

// import { ErrorDialogComponent } from '../../compartilhado/componentes/error-dialog/error-dialog.component';
// import { PedidoService } from '../pedido.service';
// import { CadastrarPedidosComponent } from '../cadastrar-pedidos/cadastrar-pedidos.component';
// import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
// import { Pedido } from '../model/pedido';

// export interface UserData {
//   id: string;
//   nome: string;
//   endereco: string;
//   volume: string;
//   mangueira: string;
//   valor: string;
//   status: string;
//   acao: string;
// }

// @Component({
//   selector: 'app-consultar-pedidos',
//   templateUrl: './consultar-pedidos.component.html',
//   styleUrl: './consultar-pedidos.component.css',
// })
// export class ConsultarPedidosComponent implements OnInit {
//   // @Input() courses: Course[] = [];
//   // @Output() add = new EventEmitter(false);
//   // @Output() edit = new EventEmitter(false);
//   // @Output() remove = new EventEmitter(false);

//   pedidos$: Observable<Pedido[]> | null = null;
//   readonly displayedColumns: string[] = [
//     'id',
//     'nome',
//     'endereco',
//     'volume',
//     'mangueira',
//     'valor',
//     'status',
//     'acao'
//   ];

//   constructor(
//     private pedidosService: PedidoService,
//     public dialog: MatDialog,
//     private router: Router,
//     private route: ActivatedRoute,
//     private snackBar: MatSnackBar,
//   ) {
//     this.refresh();
//   }

//   onError(errorMsg: string) {
//     this.dialog.open(ErrorDialogComponent, {
//       data: errorMsg,
//     });
//   }

//   ngOnInit(): void {}

//   onAdd() {
//     this.router.navigate(['/cadastrar-pedidos'], { relativeTo: this.route });
//   }

//   onEdit(pedido: Pedido) {
//     this.router.navigate(['/editar-pedidos/', pedido.idPedido], { relativeTo: this.route });
//   }

//   onDelete(pedido: Pedido) {
//     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//       data: 'Tem certeza que deseja remover esse pedido?',
//     });

//     dialogRef.afterClosed().subscribe((result: boolean) => {
//       if (result) {
//         this.pedidosService.excluir(pedido.idPedido).subscribe(
//           () => {
//             this.refresh();
//             this.snackBar.open('Pedido removido com sucesso!', 'X', {
//               duration: 5000,
//               verticalPosition: 'top',
//               horizontalPosition: 'center',
//             });
//           },
//           () => this.onError('Erro ao tentar remover o pedido.'),
//         );
//       }
//     });
//   }

//   refresh() {
//     this.pedidos$ = this.pedidosService.listar().pipe(
//       catchError((error) => {
//         this.onError('Erro ao carregar os pedidos.');
//         return of([]);
//       }),
//     );
//   }
// }
