import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './models/employee';
import { EmployeeService } from './services/employee.service';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IntegratedWeb';

  emps: Employee[] = [];

  constructor(private empService: EmployeeService, private cartService: CartService){

  }

}
