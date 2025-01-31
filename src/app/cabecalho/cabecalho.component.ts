import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LoginService } from '../home/login/services/login.service';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],
  imports: [RouterLink, AsyncPipe],
})
export class CabecalhoComponent {
  usuario = '';
  senha = '';
  user$ = this.loginService.retornaUsuario();

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  logout() {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
