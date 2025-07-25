import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, CommonModule, HeaderComponent, FooterComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Shoping Mall';
}
