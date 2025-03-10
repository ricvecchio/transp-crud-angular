import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';

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
    const username = sessionStorage.getItem('username');
    this.permissaoUsuario = sessionStorage.getItem('permission');

  }
}
