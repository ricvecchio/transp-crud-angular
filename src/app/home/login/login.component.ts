import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AutenticacaoService } from '../../autenticacao/autenticacao.service';
import { MensagemComponent } from '../mensagem/mensagem.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, MensagemComponent, RouterLink]
})
export class LoginComponent implements OnInit {
  usuario = '';
  senha = '';

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login() {
    this.authService.autenticar(this.usuario, this.senha).subscribe(
      () => {
        this.router.navigate(['menu']);
      },
      (error) => {
        alert('Usuário ou senha inválido');
        console.log(error);
      },
    );
  }
}
