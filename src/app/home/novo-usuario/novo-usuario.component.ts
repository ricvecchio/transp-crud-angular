import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { minusculoValidator } from './minusculo.validator';
import { NovoUsuario } from './novo-usuario';
import { NovoUsuarioService } from './novo-usuario.service';
import { UsuarioExisteService } from './usuario-existe.service';
import { usuarioSenhaIguaisValidator } from './usuario-senha-iguais.validator';
import { MensagemComponent } from '../mensagem/mensagem.component';


@Component({
    selector: "app-novo-usuario",
    templateUrl: "./novo-usuario.component.html",
    styleUrls: ["./novo-usuario.component.css"],
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    MensagemComponent,
    RouterLink
],
})
export class NovoUsuarioComponent implements OnInit {
  novoUsuarioForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private novoUsuarioService: NovoUsuarioService,
    private usuarioExistenteServive: UsuarioExisteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.novoUsuarioForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        fullName: ["", [Validators.required, Validators.minLength(4)]],
        userName: [
          "",
          [minusculoValidator],
          [this.usuarioExistenteServive.usuarioJaExite()],
        ],
        password: [""],
      },
      {
        validators: [usuarioSenhaIguaisValidator],
      }
    );
  }

  cadastrar() {
    if (this.novoUsuarioForm.valid) {
      const novoUsuario = this.novoUsuarioForm.getRawValue() as NovoUsuario;
      this.novoUsuarioService.cadastraNovoUsuario(novoUsuario).subscribe(
        () => {
          this.router.navigate([""]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
