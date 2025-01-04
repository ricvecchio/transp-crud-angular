import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-rodape',
    templateUrl: './rodape.component.html',
    styleUrls: ['./rodape.component.css'],
    imports: [RouterLink]
})
export class RodapeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
