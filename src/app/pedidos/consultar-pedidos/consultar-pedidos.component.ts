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
