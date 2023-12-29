import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiClientService } from './services/api-client.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  //Departments
  private readonly apiClient = inject(ApiClientService);

  public readonly createDepartment = this.apiClient.createDepartment;

  public readonly allDepartments = this.apiClient.getAllDepartments();

  public readonly getDepartment = this.apiClient.getDepartment;

  public readonly updateDepartment = this.apiClient.updateDepartment;

  public readonly deleteDepartment = this.apiClient.deleteDepartment;

  //Employees
  public readonly createEmployee = this.apiClient.createEmployee;

  public readonly allEmployees = this.apiClient.getAllEmployees();

  public readonly getEmployee = this.apiClient.getEmployee;

  public readonly updateEmployee = this.apiClient.updateEmployee;

  public readonly deleteEmployee = this.apiClient.deleteEmployee;
}
