import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ConsultaCepService } from '../../../compartilhado/consulta-cep.service';
import { FormUtilsService } from '../../../compartilhado/form-utils-service';
import { Cliente } from '../../../modelo/cliente';
import { ClienteService } from '../../servicos/cliente.service';
import { ConfirmationDialogComponent } from '../../../compartilhado/componentes/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatError,
    MatPrefix,
  ],
})
export class ClienteFormComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private consultaCepService: ConsultaCepService,
    private service: ClienteService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public formUtils: FormUtilsService,
  ) {}

  ngOnInit(): void {
    const cliente: Cliente = this.route.snapshot.data['cliente'];

    this.formulario = this.formBuilder.group({
      idCliente: [cliente.idCliente],
      nome: [
        cliente.nome,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      cpfcnpj: [cliente.cpfcnpj, [Validators.required]],
      telefone: [cliente.telefone, [Validators.required]],
      celular: [cliente.celular],
      email: [cliente.email, [Validators.required]],
      cep: [cliente.cep, [Validators.required]],
      logradouro: [cliente.logradouro, [Validators.required]],
      numero: [cliente.numero],
      complemento: [cliente.complemento],
      bairro: [cliente.bairro],
      cidade: [cliente.cidade],
      estado: [cliente.estado],
    });
  }

  consultaCEP() {
    const cep = this.formulario.get('cep')?.value;
    if (cep != '') {
      this.consultaCepService.getConsultaCep(cep).subscribe((dados: any) => {
        this.formulario.patchValue({
          logradouro: dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf,
        });
      });
    }
  }

  dataAtual: Date = new Date();

  checked = false;
  disabled = false;

  // onSubmit() {
  //   if (this.formulario.valid) {
  //   this.service.salvarEmitir(this.formulario.value).subscribe(
  //     (result) => this.onSucess(),
  //     (error) => this.onError(),
  //   );
  //   } else {
  //     this.formUtils.validarTodosCamposFormFields(this.formulario);
  //   }
  // }

  onSubmit() {
    this.dialogoNavegacaoClienteSalvo();
  }

  private onSucess() {
    this.snackBar.open('Cliente Salvo com sucesso!', '', { duration: 5000 });
    this.onCancel();
  }

  onCancel() {
    this.location.back();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o cliente!', '', { duration: 5000 });
  }

  dialogoNavegacaoClienteSalvo() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Cliente salvo, deseja emitir o pedido?',
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const cliente = this.formulario.value as Cliente;
        this.service
          .salvarEmitir(cliente)
          .subscribe((clienteCriado: Cliente) => {
            this.router.navigate(['/cadastrar-pedido'], {
              queryParams: {
                idCliente: clienteCriado.idCliente,
                nome: clienteCriado.nome,
                cpfcnpj: clienteCriado.cpfcnpj,
                telefone: clienteCriado.telefone,
                celular: clienteCriado.celular,
                email: clienteCriado.email,
                cep: clienteCriado.cep,
                logradouro: clienteCriado.logradouro,
                numero: clienteCriado.numero,
                complemento: clienteCriado.complemento,
                bairro: clienteCriado.bairro,
                cidade: clienteCriado.cidade,
                estado: clienteCriado.estado,
              },
            });
          });
      } else {
        this.service.salvarEmitir(this.formulario.value).subscribe(
          (result) => this.onSucess(),
          (error) => this.onError(),
        );
      }
    });
  }
}
