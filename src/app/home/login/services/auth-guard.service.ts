import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly ROTAS_PERMITIDAS_OFFLINE = [
    '/menu',
    '/cadastrar-pedido',
    '/consultar-clientes',
    '/expandir-cliente',
    '/cadastrar-cliente',
  ];

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authToken = sessionStorage.getItem('auth-token');

    const permissaoUsuario = sessionStorage.getItem('permission');

    const modoOffline = sessionStorage.getItem('offline-mode') === 'true';

    if (!authToken) {
      this.router.navigate(['/home']);

      return false;
    }

    if (modoOffline || permissaoUsuario === 'OFFLINE') {
      const rotaPermitida =
        this.ROTAS_PERMITIDAS_OFFLINE.some((rota) =>
          state.url.startsWith(rota),
        );

      if (rotaPermitida) {
        return true;
      }

      this.router.navigate(['/menu']);

      return false;
    }

    return true;
  }
}