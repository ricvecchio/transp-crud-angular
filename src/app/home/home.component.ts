import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
