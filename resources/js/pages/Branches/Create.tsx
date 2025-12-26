import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, useForm } from '@inertiajs/react';

type CreateBranchForm = {
    name: string;
    code: string;
    location: string;
    is_active: boolean;
};

export default function Create() {
    const { data, setData, post, processing } = useForm<CreateBranchForm>({
        name: '',
        code: '',
        location: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/branches');
    };

    return (
        <>
            <Head title="Create branch" />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/branches">Branches</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>New branch</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/branches">Cancel</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="mx-auto w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4">
                                <h1 className="text-base font-semibold tracking-tight">New branch</h1>
                                <p className="text-xs text-slate-600">
                                    Add a physical store or location where you are selling.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">Branch name</FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="Downtown Branch"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="code">Branch code</FieldLabel>
                                        <Input
                                            id="code"
                                            type="text"
                                            placeholder="DT-01"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            required
                                        />
                                        <FieldDescription>
                                            Short identifier used in reports and stock locations.
                                        </FieldDescription>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="location">Location</FieldLabel>
                                        <Input
                                            id="location"
                                            type="text"
                                            placeholder="Quezon City, Metro Manila"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                        />
                                        <FieldDescription>
                                            Optional description so your team can recognize this branch quickly.
                                        </FieldDescription>
                                    </Field>
                                    <Field>
                                        <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            Active branch
                                        </label>
                                        <FieldDescription>
                                            Inactive branches stay in your history but disappear from day-to-day flows.
                                        </FieldDescription>
                                    </Field>
                                    <Field>
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            Create branch
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

