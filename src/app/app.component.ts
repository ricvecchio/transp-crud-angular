import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private syncOfflineService: SyncOfflineService) {}

  ngOnInit(): void {
    this.syncOfflineService.iniciarMonitoramento();

    this.subscriptions.add(
      this.syncOfflineService.online$.subscribe((online) => {
        this.online = online;
      }),
    );

    this.subscriptions.add(
      this.syncOfflineService.sincronizando$.subscribe((sincronizando) => {
        this.sincronizandoOffline = sincronizando;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}