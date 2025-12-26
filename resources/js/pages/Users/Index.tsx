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

type Branch = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
    username: string;
    role: 'super_admin' | 'branch_manager' | 'cashier';
    is_active: boolean;
    branch_id: number | null;
    branch?: Branch | null;
};

type IndexProps = {
    users: User[];
    branches: Branch[];
};

export default function Index({ users, branches }: IndexProps) {
    type CreateUserForm = {
        name: string;
        username: string;
        role: User['role'];
        branch_id: number | null;
        is_active: boolean;
        password: string;
        password_confirmation: string;
    };

    const { data, setData, post, processing, reset } = useForm<CreateUserForm>({
        name: '',
        username: '',
        role: 'cashier',
        branch_id: null,
        is_active: true,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/users', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Users" />
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
                                        <BreadcrumbPage>Users</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button>New user</Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-0">
                                <SheetHeader className="border-b border-slate-200">
                                    <SheetTitle>New user</SheetTitle>
                                    <SheetDescription>Create a user account for a super admin, branch manager, or cashier.</SheetDescription>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Jane Santos"
                                                    value={data.name}
                                                    onChange={(event) => setData('name', event.target.value)}
                                                    required
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    placeholder="branch_manager"
                                                    value={data.username}
                                                    onChange={(event) => setData('username', event.target.value)}
                                                    required
                                                />
                                                <FieldDescription>This is the username they use to sign in at the POS.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="role">Role</FieldLabel>
                                                <select
                                                    id="role"
                                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                    value={data.role}
                                                    onChange={(event) => setData('role', event.target.value as User['role'])}
                                                >
                                                    <option value="super_admin">Super admin</option>
                                                    <option value="branch_manager">Branch manager</option>
                                                    <option value="cashier">Cashier</option>
                                                </select>
                                                <FieldDescription>Roles control what this user can see in your POS.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="branch_id">Branch</FieldLabel>
                                                <select
                                                    id="branch_id"
                                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                    value={data.branch_id ?? ''}
                                                    onChange={(event) => setData('branch_id', event.target.value ? Number(event.target.value) : null)}
                                                >
                                                    <option value="">No branch (HQ)</option>
                                                    {branches.map((branch) => (
                                                        <option key={branch.id} value={branch.id}>
                                                            {branch.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <FieldDescription>
                                                    Assign this user to a branch for branch-scoped access and reporting.
                                                </FieldDescription>
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Create a secure password"
                                                    value={data.password}
                                                    onChange={(event) => setData('password', event.target.value)}
                                                    required
                                                />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    placeholder="Repeat the password"
                                                    value={data.password_confirmation}
                                                    onChange={(event) => setData('password_confirmation', event.target.value)}
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
                                                    Active user
                                                </label>
                                                <FieldDescription>Inactive users cannot sign in but stay in your reports.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <Button type="submit" className="w-full" disabled={processing}>
                                                    Create user
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
                                    <h1 className="text-base font-semibold tracking-tight">Users</h1>
                                    <p className="text-xs text-slate-600">Manage the people who can sign in to your POS.</p>
                                </div>
                            </div>
                            {users.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">No users yet</p>
                                    <p className="max-w-sm text-xs text-slate-600">
                                        Invite your team by creating accounts for managers and cashiers.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Username</th>
                                                <th className="px-3 py-2">Role</th>
                                                <th className="px-3 py-2">Branch</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                                                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{user.name}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">{user.username}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600 capitalize">{user.role.replace('_', ' ')}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">{user.branch ? user.branch.name : '—'}</td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {user.is_active ? (
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
                                                            <EditUserSheet user={user} branches={branches} />
                                                            <DeleteUserAlert user={user} />
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

type EditUserSheetProps = {
    user: User;
    branches: Branch[];
};

function EditUserSheet({ user, branches }: EditUserSheetProps) {
    type EditUserForm = {
        name: string;
        username: string;
        role: User['role'];
        branch_id: number | null;
        is_active: boolean;
        password: string;
        password_confirmation: string;
    };

    const { data, setData, put, processing } = useForm<EditUserForm>({
        name: user.name,
        username: user.username,
        role: user.role,
        branch_id: user.branch_id,
        is_active: user.is_active,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/users/${user.id}`);
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
                    <SheetTitle>Edit user</SheetTitle>
                    <SheetDescription>Update this user&apos;s access to your POS.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor={`edit-name-${user.id}`}>Full name</FieldLabel>
                                <Input
                                    id={`edit-name-${user.id}`}
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-username-${user.id}`}>Username</FieldLabel>
                                <Input
                                    id={`edit-username-${user.id}`}
                                    type="text"
                                    value={data.username}
                                    onChange={(event) => setData('username', event.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-role-${user.id}`}>Role</FieldLabel>
                                <select
                                    id={`edit-role-${user.id}`}
                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={data.role}
                                    onChange={(event) => setData('role', event.target.value as User['role'])}
                                >
                                    <option value="super_admin">Super admin</option>
                                    <option value="branch_manager">Branch manager</option>
                                    <option value="cashier">Cashier</option>
                                </select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-branch-${user.id}`}>Branch</FieldLabel>
                                <select
                                    id={`edit-branch-${user.id}`}
                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    value={data.branch_id ?? ''}
                                    onChange={(event) => setData('branch_id', event.target.value ? Number(event.target.value) : null)}
                                >
                                    <option value="">No branch (HQ)</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-password-${user.id}`}>New password</FieldLabel>
                                <Input
                                    id={`edit-password-${user.id}`}
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`edit-password-confirmation-${user.id}`}>Confirm new password</FieldLabel>
                                <Input
                                    id={`edit-password-confirmation-${user.id}`}
                                    type="password"
                                    placeholder="Repeat the new password"
                                    value={data.password_confirmation}
                                    onChange={(event) => setData('password_confirmation', event.target.value)}
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
                                    Active user
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

type DeleteUserAlertProps = {
    user: User;
};

function DeleteUserAlert({ user }: DeleteUserAlertProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/users/${user.id}`, {
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
                        <AlertDialog.Title className="text-sm font-semibold text-slate-900">Delete user</AlertDialog.Title>
                        <AlertDialog.Description className="text-xs text-slate-600">
                            Are you sure you want to delete &quot;{user.username}&quot;? This cannot be undone.
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
