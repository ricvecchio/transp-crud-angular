import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MensagemService } from '../../../compartilhado/mensagem.service';
import { MensagemComponent } from '../mensagem/mensagem.component';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-novo-usuario',
  templateUrl: './novo-usuario.component.html',
  styleUrls: ['./novo-usuario.component.css'],
  imports: [FormsModule, ReactiveFormsModule, MensagemComponent, RouterLink],
})
export class NovoUsuarioComponent implements OnInit {
  novoUsuarioForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    public mensagemService: MensagemService,
  ) {}

  ngOnInit(): void {
    this.novoUsuarioForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: [''],
    });
  }

  cadastrar() {
    const name = this.novoUsuarioForm.value.name.trim();
    const email = this.novoUsuarioForm.value.email.trim();
    const username = this.novoUsuarioForm.value.username.trim();
    const password = this.novoUsuarioForm.value.password.trim();

    this.loginService
    .signup(name, email, username, password)
      .subscribe(
        () => {
          this.loginService.logout();
          this.router.navigate(['']);
        },
        (error) => {
          if (error.status === 409) {
            this.mensagemService.showErrorMessage('Username já cadastrado!');
          } else {
            this.mensagemService.showErrorMessage(
              'Erro ao cadastrar. Tente novamente mais tarde.',
            );
          }
        },
      );
  }
}
