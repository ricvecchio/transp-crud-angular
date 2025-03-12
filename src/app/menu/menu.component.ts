import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, RouterLink],
})
export class MenuComponent {
  permissaoUsuario: string | null = null;

  ngOnInit(): void {
    this.permissaoUsuario = sessionStorage.getItem('permission');
  }

}
