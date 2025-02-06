import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, RouterLink],
})
export class MenuComponent {
  permissaoUsuario: string | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const username = sessionStorage.getItem('username'); // Pegando o username do usuário logado

    console.log('Menu: username do usuário logado - username: ', username) // EXCLUIR
    if (username) {
      this.usuarioService.buscarPorId(username).subscribe((usuario) => {
        this.permissaoUsuario = usuario.permission;
        console.log('Menu: permissão do usuário logado - permissaoUsuario: ', usuario.permission) // EXCLUIR
      });
    }
  }
}
