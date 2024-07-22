import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesListaComponent } from './clientes/componentes/clientes-lista/clientes-lista.component';
import { ClienteFormComponent } from './clientes/containers/cliente-form/cliente-form.component';
import { ClienteResolver } from './clientes/guarda-rotas/cliente.resolver';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { NovoUsuarioComponent } from './home/novo-usuario/novo-usuario.component';
import { MenuComponent } from './menu/menu.component';
import { PedidoFormComponent } from './pedidos/containers/pedido-form/pedido-form.component';
import { PedidoResolver } from './clientes/guarda-rotas/pedido.resolver';
import { PedidosListaComponent } from './pedidos/componentes/pedidos-lista/pedidos-lista.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'novousuario',
        component: NovoUsuarioComponent,
      },
    ],
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'cadastrar-cliente',
    component: ClienteFormComponent,
    resolve: { cliente: ClienteResolver },
  },
  {
    path: 'consultar-clientes',
    component: ClientesListaComponent,
    resolve: { cliente: ClienteResolver },
  },
  {
    path: 'editar-cliente/:id',
    component: ClienteFormComponent,
    resolve: { cliente: ClienteResolver },
  },
  // {
  //   path: 'cadastrar-pedido',
  //   component: PedidoFormComponent,
  //   resolve: { pedido: PedidoResolver },
  // }
  {
    path: 'cadastrar-pedido',
    component: PedidoFormComponent,
    resolve: { cliente: ClienteResolver },
  },
  {
    path: 'consultar-pedidos',
    component: PedidosListaComponent,
    resolve: { cliente: ClienteResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
