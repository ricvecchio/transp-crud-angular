import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesListaComponent } from './clientes/componentes/clientes-lista/clientes-lista.component';
import { ExpandirClienteComponent } from './clientes/componentes/expandir-cliente/expandir-cliente.component';
import { ClienteFormComponent } from './clientes/containers/cliente-form/cliente-form.component';
import { ClienteResolver } from './guarda-rotas/cliente.resolver';
import { PedidoResolver } from './guarda-rotas/pedido.resolver';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { NovoUsuarioComponent } from './home/novo-usuario/novo-usuario.component';
import { MenuComponent } from './menu/menu.component';
import { ExpandirPedidoComponent } from './pedidos/componentes/expandir-pedido/expandir-pedido.component';
import { PedidosListaComponent } from './pedidos/componentes/pedidos-lista/pedidos-lista.component';
import { PedidoFormComponent } from './pedidos/containers/pedido-form/pedido-form.component';

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
    path: 'editar-cliente/:idCliente',
    component: ClienteFormComponent,
    resolve: { cliente: ClienteResolver },
  },
  {
    path: 'expandir-cliente/:idCliente',
    component: ExpandirClienteComponent,
    resolve: { cliente: ClienteResolver },
  },
  {
    path: 'cadastrar-pedido',
    component: PedidoFormComponent,
    resolve: { pedido: PedidoResolver },
  },
  {
    path: 'consultar-pedidos',
    component: PedidosListaComponent,
    resolve: { pedido: PedidoResolver },
  },
  {
    path: 'editar-pedido/:idPedido',
    component: PedidoFormComponent,
    resolve: { pedido: PedidoResolver },
  },
  {
    path: 'expandir-pedido/:idPedido',
    component: ExpandirPedidoComponent,
    resolve: { pedido: PedidoResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
