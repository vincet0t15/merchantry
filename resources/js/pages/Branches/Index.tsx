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
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';

type Branch = {
    id: number;
    name: string;
    code: string;
    location: string | null;
    is_active: boolean;
};

type IndexProps = {
    branches: Branch[];
};

export default function Index({ branches }: IndexProps) {
    const handleDelete = (branch: Branch) => {
        if (!confirm(`Delete branch "${branch.name}"?`)) {
            return;
        }

        router.delete(`/branches/${branch.id}`);
    };

    return (
        <>
            <Head title="Branches" />
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
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Branches</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button asChild>
                            <Link href="/branches/create">New branch</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <div>
                                    <h1 className="text-base font-semibold tracking-tight">Branches</h1>
                                    <p className="text-xs text-slate-600">
                                        Manage the physical locations where your teams are selling.
                                    </p>
                                </div>
                            </div>
                            {branches.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">No branches yet</p>
                                    <p className="max-w-sm text-xs text-slate-600">
                                        Create your first branch to start assigning managers, cashiers, and stock
                                        locations.
                                    </p>
                                    <Button className="mt-2" asChild>
                                        <Link href="/branches/create">Create a branch</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Code</th>
                                                <th className="px-3 py-2">Location</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {branches.map((branch) => (
                                                <tr
                                                    key={branch.id}
                                                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                                                >
                                                    <td className="px-3 py-2 text-sm font-medium text-slate-900">
                                                        {branch.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">
                                                        {branch.code}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">
                                                        {branch.location || '—'}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {branch.is_active ? (
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
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/branches/${branch.id}/edit`}>
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                type="button"
                                                                onClick={() => handleDelete(branch)}
                                                            >
                                                                Delete
                                                            </Button>
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

