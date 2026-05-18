import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SyncOfflineService } from './offline/sync-offline.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'transportadora';

  online = navigator.onLine;

  sincronizandoOffline = false;

  private subscriptions = new Subscription();

  constructor(
    private syncOfflineService: SyncOfflineService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.online = navigator.onLine;

    this.syncOfflineService.iniciarMonitoramento();

    this.subscriptions.add(
      this.syncOfflineService.online$.subscribe((online) => {
        const estavaOnline = this.online;

        this.online = online;

        if (!online && estavaOnline) {
          this.ativarModoOfflineAutomaticamente();
        }
      }),
    );

    this.subscriptions.add(
      this.syncOfflineService.sincronizando$.subscribe((sincronizando) => {
        this.sincronizandoOffline = sincronizando;
      }),
    );

    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (
          event instanceof NavigationStart &&
          !navigator.onLine &&
          !this.isRotaOfflinePermitida(event.url)
        ) {
          this.ativarModoOfflineAutomaticamente();
        }
      }),
    );

    /**
     * Caso a aplicação abra já offline,
     * ativa automaticamente o modo offline.
     */
    if (!navigator.onLine) {
      this.ativarModoOfflineAutomaticamente();
    }
  }

  private ativarModoOfflineAutomaticamente(): void {
    const permissaoAtual = sessionStorage.getItem('permission');

    if (permissaoAtual === 'OFFLINE') {
      return;
    }

    sessionStorage.clear();

    this.router.navigate(['/home']);
  }

  private isRotaOfflinePermitida(url: string): boolean {
    return (
      url.includes('/home') ||
      url.includes('/menu') ||
      url.includes('/cadastrar-pedido') ||
      url.includes('/consultar-clientes') ||
      url.includes('/expandir-cliente') ||
      url.includes('/cadastrar-cliente')
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}