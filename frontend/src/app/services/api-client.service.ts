import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiPath } from '../constants/api';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  CreatableDepartment,
  CreatableEmployee,
  Department,
} from '../models/deparmtents';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly httpClient = inject(HttpClient);

  //Departments
  public createDepartment(department: CreatableDepartment) {
    return toSignal(
      this.httpClient.post<{ message: string; department: Department }>(
        `${apiPath}/departments`,
        department
      )
    );
  }

  public getAllDepartments() {
    return toSignal(
      this.httpClient.get<Department[]>(`${apiPath}/departments`)
    );
  }

  public getDepartment(id: string) {
    return toSignal(
      this.httpClient.get<Department>(`${apiPath}/departments/${id}`)
    );
  }

  public updateDepartment(id: string, department: CreatableDepartment) {
    return toSignal(
      this.httpClient.put<{ message: string; department: Department }>(
        `${apiPath}/departments/${id}`,
        department
      )
    );
  }

  public deleteDepartment(id: string) {
    return toSignal(
      this.httpClient.delete<{ message: string; department: Department }>(
        `${apiPath}/departments/${id}`
      )
    );
  }

  //Employees
  public createEmployee(employee: CreatableEmployee) {
    return toSignal(
      this.httpClient.post<{ message: string; employee: Employee }>(
        `${apiPath}/employees`,
        employee
      )
    );
  }

  public getAllEmployees() {
    return toSignal(this.httpClient.get<Employee[]>(`${apiPath}/employees`));
  }

  public getEmployee(id: string) {
    return toSignal(
      this.httpClient.get<Employee>(`${apiPath}/employees/${id}`)
    );
  }

  public updateEmployee(id: string, employee: CreatableEmployee) {
    return toSignal(
      this.httpClient.put<{ message: string; employee: Employee }>(
        `${apiPath}/employees/${id}`,
        employee
      )
    );
  }

  public deleteEmployee(id: string) {
    return toSignal(
      this.httpClient.delete<{ message: string; employee: Employee }>(
        `${apiPath}/employees/${id}`
      )
    );
  }
}
