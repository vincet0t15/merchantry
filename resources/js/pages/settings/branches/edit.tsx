
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import branches from '@/routes/branches';
import { BranchCreateProps, BranchProps } from '@/types/branch';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    branch: BranchProps;
}
export default function BranchEdit({ open, setOpen, branch }: Props) {
    const { data, setData, processing, errors, put, reset } = useForm<BranchCreateProps>({
        name: branch.name,
        address: branch.address,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(branches.update.url(branch.id), {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form className="mt-4 flex flex-col gap-6" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create Branch</DialogTitle>
                        <DialogDescription>Fill in the details below to create a branch.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
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
                                value={data.address}
                                name="address"
                            />
                            <InputError className="text-sm text-red-500" message={errors.address} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer bg-teal-800 text-white hover:bg-teal-900 hover:text-white " type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Update Branch
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
