import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, throwError, timeout } from 'rxjs';
import { MensagemService } from '../../../compartilhado/mensagem.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css',
  imports: [CommonModule, FormsModule],
})
export class RecuperarSenhaComponent {
  private readonly API = 'https://saotomecatimesaotomecatime.com/api/users';

  email: string = '';
  username: string = '';
  token: string = '';
  novaSenha: string = '';
  etapa: number = 1;
  // 1 - Inserir e-mail e username
  // 2 - Inserir token e nova senha
  carregando: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public mensagemService: MensagemService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['token']) {
        this.token = params['token'];
        this.etapa = 2;
      }
    });
  }

  solicitarRecuperacao() {
    this.carregando = true;

    this.http
      .post(this.API + '/recoverPassword', {
        email: this.email,
        username: this.username,
      })
      .pipe(
        timeout(10000),
        catchError((error) => {
          let errorMessage = 'Erro ao enviar e-mail de recuperação.';
          if (error.status === 403) {
            errorMessage = 'Usuário ou E-mail não encontrado!';
          } else if (error.name === 'TimeoutError') {
            errorMessage = 'Tempo limite atingido. Tente novamente mais tarde.';
          }
          this.mensagemService.showErrorMessage(errorMessage);
          return throwError(() => error);
        }),
        finalize(() => (this.carregando = false)),
      )
      .subscribe((response: any) => {
        const mensagem =
          response?.message ||
          'E-mail de recuperação enviado! Verifique sua caixa de entrada.';
        this.mensagemService.showSuccessMessage(mensagem);
        this.etapa = 2;
      });
  }

  redefinirSenha() {
    this.http
      .post(this.API + '/resetPassword', {
        token: this.token,
        newPassword: this.novaSenha,
      })
      .pipe(
        catchError((error) => {
          let errorMessage = 'Erro ao redefinir a senha.';
          if (error.status === 403) {
            errorMessage = 'Token inválido ou Expirado!';
          }
          this.mensagemService.showErrorMessage(errorMessage);
          return throwError(() => error);
        }),
      )
      .subscribe((response: any) => {
        const mensagem =
          response?.message ||
          'Senha redefinida com sucesso! Faça login novamente.';
        this.mensagemService.showSuccessMessage(mensagem);
        this.router.navigate(['']);
      });
  }
}
