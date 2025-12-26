import * as AlertDialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, router } from '@inertiajs/react';

type Category = {
    id: number;
    name: string;
};

type Branch = {
    id: number;
    name: string;
};

type Unit = {
    id: number;
    name: string;
    code: string;
};

type Product = {
    id: number;
    name: string;
    sku: string;
    type: 'product' | 'menu' | 'consignment';
    category_id: number | null;
    unit_id: number | null;
    price: number | string;
    is_active: boolean;
    category?: Category | null;
    unit?: Unit | null;
    stocks?: {
        id: number;
        branch_id: number;
        quantity: number;
        branch?: Branch | null;
    }[];
};

type IndexProps = {
    products: Product[];
    categories: Category[];
    units: Unit[];
    branches: Branch[];
};

const formatPrice = (price: number | string): string => {
    const numeric = typeof price === 'number' ? price : typeof price === 'string' ? parseFloat(price) : NaN;

    if (!Number.isFinite(numeric)) {
        return String(price);
    }

    return numeric.toFixed(2);
};

export default function Index({ products, branches }: IndexProps) {
    return (
        <>
            <Head title="Inventory" />
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
                                        <BreadcrumbPage>Inventory</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button asChild>
                            <Link href="/inventory/create">New item</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <div>
                                    <h1 className="text-base font-semibold tracking-tight">Inventory</h1>
                                    <p className="text-xs text-slate-600">Manage the products you sell so cashiers can find them quickly.</p>
                                </div>
                            </div>
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">No items yet</p>
                                    <p className="max-w-sm text-xs text-slate-600">
                                        Add your first inventory item to start recording sales and stock.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">SKU</th>
                                                <th className="px-3 py-2">Type</th>
                                                <th className="px-3 py-2">Category</th>
                                                <th className="px-3 py-2">Unit</th>
                                                <th className="px-3 py-2 text-right">Price</th>
                                                <th className="px-3 py-2 text-right">Total stock</th>
                                                <th className="px-3 py-2">Status</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                                                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{product.name}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">{product.sku}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">
                                                        {product.type === 'product' && 'Product'}
                                                        {product.type === 'menu' && 'Menu'}
                                                        {product.type === 'consignment' && 'Consignment'}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">{product.category?.name ?? '—'}</td>
                                                    <td className="px-3 py-2 text-xs text-slate-600">
                                                        {product.unit ? `${product.unit.name} (${product.unit.code})` : '—'}
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-xs text-slate-700">₱ {formatPrice(product.price)}</td>
                                                    <td className="px-3 py-2 text-right text-xs text-slate-700">
                                                        {product.stocks?.reduce((total, stock) => total + stock.quantity, 0) ?? 0}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs">
                                                        {product.is_active ? (
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
                                                                <Link href={`/products/${product.id}/stock`}>Stock</Link>
                                                            </Button>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/products/${product.id}/edit`}>Edit</Link>
                                                            </Button>
                                                            <DeleteProductAlert product={product} />
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

type DeleteProductAlertProps = {
    product: Product;
};

function DeleteProductAlert({ product }: DeleteProductAlertProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/products/${product.id}`, {
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
                        <AlertDialog.Title className="text-sm font-semibold text-slate-900">Delete inventory item</AlertDialog.Title>
                        <AlertDialog.Description className="text-xs text-slate-600">
                            Are you sure you want to delete &quot;{product.name}&quot;? This cannot be undone.
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
