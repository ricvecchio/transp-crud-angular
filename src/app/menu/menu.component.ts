import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MensagemService } from '../compartilhado/mensagem.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, RouterLink],
})
export class MenuComponent implements OnInit {
  permissaoUsuario: string | null = null;

  constructor(
    private mensagemService: MensagemService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.permissaoUsuario = sessionStorage.getItem('permission');
  }

  mostrarMensagem(): void {
    this.mensagemService.showErrorMessage('Funcionalidade em desenvolvimento!');
  }

  sairModoOffline(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('permission');
    sessionStorage.removeItem('offline-mode');

    this.mensagemService.showSuccessMessage('Modo offline encerrado.');

    this.router.navigate(['/home']);
  }
}