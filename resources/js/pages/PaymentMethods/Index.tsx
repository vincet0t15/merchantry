import * as AlertDialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, router, useForm } from '@inertiajs/react';

type PaymentMethod = {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
};

type IndexProps = {
    methods: PaymentMethod[];
};

export default function Index({ methods }: IndexProps) {
    type CreateMethodForm = {
        name: string;
        code: string;
        is_active: boolean;
    };

    const { data, setData, post, processing, reset } = useForm<CreateMethodForm>({
        name: '',
        code: '',
        is_active: true,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/payment-methods', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Payment methods" />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Payment methods</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button>New payment method</Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-0">
                                <SheetHeader className="border-b border-slate-200">
                                    <SheetTitle>New payment method</SheetTitle>
                                    <SheetDescription>Define how customers can pay in your POS.</SheetDescription>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Cash"
                                                    value={data.name}
                                                    onChange={(event) => setData('name', event.target.value)}
                                                    required
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="code">Code</FieldLabel>
                                                <Input
                                                    id="code"
                                                    type="text"
                                                    placeholder="cash"
                                                    value={data.code}
                                                    onChange={(event) => setData('code', event.target.value)}
                                                    required
                                                />
                                                <FieldDescription>Short identifier used in integrations and reports.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_active}
                                                        onChange={(event) => setData('is_active', event.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    Active payment method
                                                </label>
                                                <FieldDescription>
                                                    Inactive methods stay in history but disappear from day-to-day flows.
                                                </FieldDescription>
                                            </Field>
                                            <Field>
                                                <Button type="submit" className="w-full" disabled={processing}>
                                                    Create payment method
                                                </Button>
                                            </Field>
                                        </FieldGroup>
                                    </form>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <div>
                                    <h1 className="text-base font-semibold tracking-tight">Payment methods</h1>
                                    <p className="text-xs text-slate-600">
                                        Control which payment options appear when your team checks out customers.
                                    </p>
                                </div>
                            </div>
                            {methods.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">No payment methods yet</p>
                                    <p className="max-w-sm text-xs text-slate-600">
                                        Add options like &quot;Cash&quot;, &quot;Card&quot;, or &quot;GCash&quot; so your team can complete sales.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Code</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {methods.map((method) => (
                                                <tr key={method.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                                                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{method.name}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600 lowercase">{method.code}</td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {method.is_active ? (
                                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-xs">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <EditPaymentMethodSheet method={method} />
                                                            <DeletePaymentMethodAlert method={method} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

type EditPaymentMethodSheetProps = {
    method: PaymentMethod;
};

function EditPaymentMethodSheet({ method }: EditPaymentMethodSheetProps) {
    type EditMethodForm = {
        name: string;
        code: string;
        is_active: boolean;
    };

    const { data, setData, put, processing } = useForm<EditMethodForm>({
        name: method.name,
        code: method.code,
        is_active: method.is_active,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/payment-methods/${method.id}`);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
                <SheetHeader className="border-b border-slate-200">
                    <SheetTitle>Edit payment method</SheetTitle>
                    <SheetDescription>Update how this payment method appears in POS and reports.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor={`edit-name-${method.id}`}>Name</FieldLabel>
                                <Input
                                    id={`edit-name-${method.id}`}
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-code-${method.id}`}>Code</FieldLabel>
                                <Input
                                    id={`edit-code-${method.id}`}
                                    type="text"
                                    value={data.code}
                                    onChange={(event) => setData('code', event.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(event) => setData('is_active', event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    Active payment method
                                </label>
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    Save changes
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

type DeletePaymentMethodAlertProps = {
    method: PaymentMethod;
};

function DeletePaymentMethodAlert({ method }: DeletePaymentMethodAlertProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/payment-methods/${method.id}`, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" type="button">
                    Delete
                </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg">
                    <div className="space-y-2">
                        <AlertDialog.Title className="text-sm font-semibold text-slate-900">Delete payment method</AlertDialog.Title>
                        <AlertDialog.Description className="text-xs text-slate-600">
                            Are you sure you want to delete &quot;{method.name}&quot;? This cannot be undone.
                        </AlertDialog.Description>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" type="button" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}

