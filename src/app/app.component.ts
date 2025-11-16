import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './models/employee';
import { EmployeeService } from './services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'IntegratedWeb';

  emps: Employee[] = [];

  constructor(private empService: EmployeeService){
    this.empService.getAllEmployees().subscribe(res => {
      this.emps = res;
    }, err => {

    })
  }

}
