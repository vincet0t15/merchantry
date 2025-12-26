import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, DollarSign, Package, Pencil, Plus } from 'lucide-react';

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
    cost: number | string;
    is_active: boolean;
    category?: Category | null;
    unit?: Unit | null;
    stocks?: {
        id: number;
        branch_id: number;
        quantity: number;
        reorder_level: number;
        branch?: Branch | null;
    }[];
};

type ItemsPageProps = {
    products: Product[];
    categories: Category[];
    units: Unit[];
    branches: Branch[];
};

const formatCurrency = (amount: number | string): string => {
    const numeric = typeof amount === 'number' ? amount : typeof amount === 'string' ? parseFloat(amount) : NaN;

    if (!Number.isFinite(numeric)) {
        return '0.00';
    }

    return numeric.toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
    });
};

export default function ItemsPage({ products }: ItemsPageProps) {
    // Calculate stats
    const stats = products.reduce(
        (acc, product) => {
            const totalStock = product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) ?? 0;
            const totalReorderLevel = product.stocks?.reduce((sum, stock) => sum + stock.reorder_level, 0) ?? 0;
            const cost = typeof product.cost === 'number' ? product.cost : parseFloat(String(product.cost)) || 0;

            // Inventory Value
            acc.inventoryValue += totalStock * cost;

            // Stock Status
            if (totalStock === 0) {
                acc.outOfStock++;
            } else if (totalStock <= totalReorderLevel) {
                acc.lowStock++;
            }

            return acc;
        },
        { outOfStock: 0, lowStock: 0, inventoryValue: 0 },
    );

    return (
        <>
            <Head title="Inventory items" />
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
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbPage>Inventory</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button asChild className="gap-2">
                            <Link href="/inventory/create">
                                <Plus className="h-4 w-4" />
                                New Item
                            </Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Out of Stock</p>
                                        <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Low Stock</p>
                                        <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                        <DollarSign className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Inventory Value</p>
                                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.inventoryValue)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h2 className="text-base font-semibold text-slate-900">Inventory Items</h2>
                            </div>
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">No inventory items found</p>
                                    <p className="max-w-sm text-xs text-slate-600">Items with tracking enabled will appear here.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">SKU</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Stock</th>
                                                <th className="px-6 py-3">Reorder Level</th>
                                                <th className="px-6 py-3 text-right">Cost</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {products.map((product) => {
                                                const totalStock = product.stocks?.reduce((total, stock) => total + stock.quantity, 0) ?? 0;
                                                const totalReorderLevel = product.stocks?.reduce((sum, stock) => sum + stock.reorder_level, 0) ?? 0;
                                                const cost = typeof product.cost === 'number' ? product.cost : parseFloat(String(product.cost)) || 0;

                                                let statusBadge;
                                                if (totalStock === 0) {
                                                    statusBadge = (
                                                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                                                            Out of Stock
                                                        </span>
                                                    );
                                                } else if (totalStock <= totalReorderLevel) {
                                                    statusBadge = (
                                                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-600/10 ring-inset">
                                                            Low Stock
                                                        </span>
                                                    );
                                                } else {
                                                    statusBadge = (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10 ring-inset">
                                                            In Stock
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <tr key={product.id} className="hover:bg-slate-50/50">
                                                        <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                                                        <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                                                        <td className="px-6 py-4">{statusBadge}</td>
                                                        <td className="px-6 py-4 text-slate-700">
                                                            {totalStock} {product.unit?.code}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-700">{totalReorderLevel}</td>
                                                        <td className="px-6 py-4 text-right text-slate-700">{formatCurrency(cost)}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                                className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                                            >
                                                                <Link href={`/products/${product.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
