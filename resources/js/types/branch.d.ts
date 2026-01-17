export interface BranchProps {
    id: number;
    name: string;
    address: string;
    phone: string;
    location: string;

}

export type BranchCreateProps = Omit<BranchProps, 'id'>;