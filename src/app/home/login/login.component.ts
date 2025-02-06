import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MensagemComponent } from './mensagem/mensagem.component';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, MensagemComponent, RouterModule],
})
export class LoginComponent implements OnInit {
  usuario = '';
  senha = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login() {
    this.loginService.login(this.usuario, this.senha).subscribe(
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
