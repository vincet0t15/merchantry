export interface EmployeeProps {
    id: number;
    name: string;
    username: string;
    password: string;
    branch_id: number;
    is_active: boolean;
}

export type EmployeeCreateRequest = Omit<EmployeeProps, "id">;
