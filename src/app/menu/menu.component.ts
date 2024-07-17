import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class MenuComponent {

  constructor() { }

  ngOnInit(): void {
  }

}
