import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MensagemService } from '../../compartilhado/mensagem.service';
import { UsuarioService } from '../../usuarios/usuario.service';
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
    private usuarioService: UsuarioService,
    private mensagemService: MensagemService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login() {
    this.loginService.login(this.usuario, this.senha).subscribe(
      () => {
        this.usuarioService.buscarPorUsername(this.usuario).subscribe(
          (usuario) => {
            if (!usuario.permission || usuario.permission.trim() === '') {
              this.mensagemService.showErrorMessage('Usuário sem Permissão!');
            } else {
              this.router.navigate(['menu']);
            }
          },
          (error) => {
            if (error.status === 0) {
              this.mensagemService.showErrorMessage(
                'Erro de conexão com o servidor.',
              );
            } else {
              this.mensagemService.showErrorMessage(
                'Erro ao verificar permissões do usuário.',
              );
            }
          },
        );
      },
      (error) => {
        if (error.status === 0) {
          this.mensagemService.showErrorMessage(
            'Erro de conexão com o servidor.',
          );
        } else if (error.status === 502) {
          this.mensagemService.showErrorMessage(
            'Erro no servidor. Tente novamente mais tarde.',
          );
        } else if (error.status === 401) {
          this.mensagemService.showErrorMessage('Usuário ou senha inválidos.');
        } else {
          this.mensagemService.showErrorMessage('Erro ao realizar login.');
        }
      },
    );
  }
}
