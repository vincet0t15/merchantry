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

type Unit = {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
};

type IndexProps = {
    units: Unit[];
};

export default function Index({ units }: IndexProps) {
    type CreateUnitForm = {
        name: string;
        code: string;
        is_active: boolean;
    };

    const { data, setData, post, processing, reset } = useForm<CreateUnitForm>({
        name: '',
        code: '',
        is_active: true,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/units', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Units" />
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
                                        <BreadcrumbPage>Units</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button>New unit</Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-0">
                                <SheetHeader className="border-b border-slate-200">
                                    <SheetTitle>New unit</SheetTitle>
                                    <SheetDescription>Define how you measure items in your catalog (pcs, kg, box, etc.).</SheetDescription>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="name">Unit name</FieldLabel>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Piece"
                                                    value={data.name}
                                                    onChange={(event) => setData('name', event.target.value)}
                                                    required
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="code">Short code</FieldLabel>
                                                <Input
                                                    id="code"
                                                    type="text"
                                                    placeholder="pcs"
                                                    value={data.code}
                                                    onChange={(event) => setData('code', event.target.value)}
                                                    required
                                                />
                                                <FieldDescription>Appears next to quantities in your POS and reports.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_active}
                                                        onChange={(event) => setData('is_active', event.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    Active unit
                                                </label>
                                                <FieldDescription>
                                                    Inactive units stay in history but disappear from day-to-day flows.
                                                </FieldDescription>
                                            </Field>
                                            <Field>
                                                <Button type="submit" className="w-full" disabled={processing}>
                                                    Create unit
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
                                    <h1 className="text-base font-semibold tracking-tight">Units of measure</h1>
                                    <p className="text-xs text-slate-600">
                                        Control the units that appear when you add and sell products.
                                    </p>
                                </div>
                            </div>
                            {units.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">No units yet</p>
                                    <p className="max-w-sm text-xs text-slate-600">
                                        Create common units like &quot;pcs&quot;, &quot;kg&quot;, or &quot;box&quot; so your catalog is consistent.
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
                                            {units.map((unit) => (
                                                <tr key={unit.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                                                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{unit.name}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600 uppercase">{unit.code}</td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {unit.is_active ? (
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
                                                            <EditUnitSheet unit={unit} />
                                                            <DeleteUnitAlert unit={unit} />
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

type EditUnitSheetProps = {
    unit: Unit;
};

function EditUnitSheet({ unit }: EditUnitSheetProps) {
    type EditUnitForm = {
        name: string;
        code: string;
        is_active: boolean;
    };

    const { data, setData, put, processing } = useForm<EditUnitForm>({
        name: unit.name,
        code: unit.code,
        is_active: unit.is_active,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/units/${unit.id}`);
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
                    <SheetTitle>Edit unit</SheetTitle>
                    <SheetDescription>Update how this unit appears in POS and reports.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor={`edit-name-${unit.id}`}>Unit name</FieldLabel>
                                <Input
                                    id={`edit-name-${unit.id}`}
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-code-${unit.id}`}>Short code</FieldLabel>
                                <Input
                                    id={`edit-code-${unit.id}`}
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
                                    Active unit
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

type DeleteUnitAlertProps = {
    unit: Unit;
};

function DeleteUnitAlert({ unit }: DeleteUnitAlertProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/units/${unit.id}`, {
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
                        <AlertDialog.Title className="text-sm font-semibold text-slate-900">Delete unit</AlertDialog.Title>
                        <AlertDialog.Description className="text-xs text-slate-600">
                            Are you sure you want to delete &quot;{unit.name}&quot; ({unit.code})? This cannot be undone.
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

