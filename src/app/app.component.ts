import { Component } from '@angular/core';
import { HomeComponent } from './component/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [HomeComponent],
})
export class AppComponent {}
