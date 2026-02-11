export interface BranchProps {
    id: number;
    name: string;
    address: string;
}

export type BranchCreateProps = Omit<BranchProps, 'id'>;