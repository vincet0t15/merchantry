
import CustomSelect from '@/components/custom-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import branches from '@/routes/branches';
import employees from '@/routes/employees';
import { BranchCreateProps, BranchProps } from '@/types/branch';
import { EmployeeCreateRequest, EmployeeProps } from '@/types/employee';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler, useMemo } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    branches: BranchProps[];
}
export default function EmployeeCreate({ open, setOpen, branches }: Props) {
    const { data, setData, processing, errors, post, reset } = useForm<EmployeeCreateRequest>({
        name: '',
        username: '',
        password: '',
        branch_id: 0,
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(employees.store.url(), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const branchOptions = useMemo(() => branches.map(branch => ({
        value: String(branch.id),
        label: branch.name,
    })), [branches]);



    const handleChangeBranch = (branch_id: string) => {
        setData((prev) => ({ ...prev, branch_id: Number(branch_id) }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form className="mt-4 flex flex-col gap-6" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create Employee</DialogTitle>
                        <DialogDescription>Fill in the details below to create an employee.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Branch</Label>
                            <CustomSelect
                                placeholder="Select branch"
                                options={branchOptions}
                                value={data.branch_id ? String(data.branch_id) : '0'}
                                onChange={handleChangeBranch}
                                name="branch_id"
                            />
                            <InputError className="text-sm text-red-500" message={errors.branch_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                placeholder="Enter branch name"
                                className=""
                                onChange={handleInputChange}
                                value={data.name}
                                name="name"
                            />
                            <InputError className="text-sm text-red-500" message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Address</Label>
                            <Input
                                placeholder="Enter branch address"
                                className=""
                                onChange={handleInputChange}
                                value={data.username}
                                name="username"
                            />
                            <InputError className="text-sm text-red-500" message={errors.username} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Password</Label>
                            <Input
                                placeholder="Enter branch password"
                                className=""
                                onChange={handleInputChange}
                                value={data.password}
                                name="password"
                            />
                            <InputError className="text-sm text-red-500" message={errors.password} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer bg-teal-800 text-white hover:bg-teal-900 hover:text-white " type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create Branch
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
