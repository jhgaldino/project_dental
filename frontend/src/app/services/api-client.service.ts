import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiPath } from '../constants/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { Department } from '../models/deparmtents';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly httpClient = inject(HttpClient);

  public getAllDepartments() {
    return toSignal(
      this.httpClient.get<Department[]>(`${apiPath}/departments`)
    );
  }
}
