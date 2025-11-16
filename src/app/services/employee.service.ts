import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }


  getAllEmployees():Observable<Employee[]>{
    return this.http.get<Employee[]>(this.baseUrl + "/Employee/GetEmployees")
  }

}
