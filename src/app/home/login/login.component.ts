import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MensagemService } from '../../compartilhado/mensagem.service';
import { SyncOfflineService } from '../../offline/sync-offline.service';
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

  private readonly USUARIO_OFFLINE = 'UsuarioOffline';
  private readonly SENHA_OFFLINE = 'UsuarioOffline';

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private mensagemService: MensagemService,
    private syncOfflineService: SyncOfflineService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login() {
    this.usuario = this.usuario.trim();

    if (this.loginOfflineValido()) {
      this.criarSessaoOffline();
      this.mensagemService.showSuccessMessage(
        'Login offline realizado com sucesso!',
      );
      this.router.navigate(['menu']);
      return;
    }

    this.loginService.login(this.usuario, this.senha).subscribe(
      () => {
        this.usuarioService.buscarPorUsername(this.usuario).subscribe(
          (usuario) => {
            if (!usuario.permission || usuario.permission.trim() === '') {
              this.mensagemService.showErrorMessage('Usuário sem Permissão!');
            } else {
              sessionStorage.removeItem('offline-mode');

              this.router.navigate(['menu']);

              setTimeout(() => {
                this.syncOfflineService.sincronizarPedidosPendentes();
              }, 1000);
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
          this.mensagemService.showErrorMessage('Senha incorreta.');
        } else if (error.status === 404) {
          this.mensagemService.showErrorMessage('Username não cadastrado.');
        } else {
          console.error('Erro ao realizar login:', error);
          this.mensagemService.showErrorMessage('Erro ao realizar login.');
        }
      },
    );
  }

  private loginOfflineValido(): boolean {
    return (
      !navigator.onLine &&
      this.usuario === this.USUARIO_OFFLINE &&
      this.senha === this.SENHA_OFFLINE
    );
  }

  private criarSessaoOffline(): void {
    sessionStorage.setItem('auth-token', 'OFFLINE_TOKEN');
    sessionStorage.setItem('username', this.USUARIO_OFFLINE);
    sessionStorage.setItem('permission', 'OFFLINE');
    sessionStorage.setItem('offline-mode', 'true');
  }
}