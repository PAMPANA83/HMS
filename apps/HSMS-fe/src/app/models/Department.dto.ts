export interface DepartmentDto {
 id: number;
  branchId: number;
  branchName: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
   branchId: number; 
  name: string;
  code: string;
}