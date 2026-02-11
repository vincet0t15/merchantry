import { BranchProps } from "./branch";

export interface EmployeeProps {
    id: number;
    name: string;
    username: string;
    password: string;
    branch_id: number;
    is_active: boolean;
    branch: BranchProps;
}

export type EmployeeCreateRequest = Omit<EmployeeProps, "id" | "branch">;
