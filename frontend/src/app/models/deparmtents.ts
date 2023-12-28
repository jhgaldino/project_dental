import { Employee } from './employee';

export type Department = {
  _id: string;
  name: string;
  description?: string;
};

export type DepartmentWithEmployees = Department & {
  employees: Omit<Employee, 'departmentId'>[];
};
