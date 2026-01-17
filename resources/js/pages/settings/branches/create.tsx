
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
}
export default function BranchCreate({ open, setOpen }: Props) {
    const { data, setData, processing, errors, post, reset } = useForm<BranchCreateProps>({
        name: '',
        address: '',
        phone: '',
        location: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(branches.store.url(), {
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

                        <div className="grid gap-2">
                            <Label>Phone</Label>
                            <Input
                                placeholder="Enter branch phone"
                                className=""
                                onChange={handleInputChange}
                                value={data.phone}
                                name="phone"
                            />
                            <InputError className="text-sm text-red-500" message={errors.phone} />
                        </div>


                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer bg-teal-800 text-white hover:bg-teal-900 hover:text-white w-[80px]" type="submit" disabled={processing} variant={'outline'}  >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
