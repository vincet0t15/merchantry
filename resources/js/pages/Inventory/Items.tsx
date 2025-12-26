import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';

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

type ItemsPageProps = {
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

export default function ItemsPage({ products }: ItemsPageProps) {
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
                        <Button asChild>
                            <Link href="/inventory">Go to products</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <div>
                                    <h1 className="text-base font-semibold tracking-tight">Inventory items</h1>
                                    <p className="text-xs text-slate-600">
                                        Ito lang yung products na may stock at mino-monitor ang movement.
                                    </p>
                                </div>
                            </div>
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                                    <p className="text-sm font-medium text-slate-700">Wala pang inventory items</p>
                                    <p className="max-w-sm text-xs text-slate-600">
                                        Gumawa ng product na may initial stock para lumabas dito.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">SKU</th>
                                                <th className="px-3 py-2 text-right">Total stock</th>
                                                <th className="px-3 py-2 text-right">Total value</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => {
                                                const totalStock =
                                                    product.stocks?.reduce((total, stock) => total + stock.quantity, 0) ?? 0;
                                                const totalValue =
                                                    typeof product.price === 'number'
                                                        ? product.price * totalStock
                                                        : parseFloat(String(product.price)) * totalStock;

                                                return (
                                                    <tr
                                                        key={product.id}
                                                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                                                    >
                                                        <td className="px-3 py-2 text-sm font-medium text-slate-900">{product.name}</td>
                                                        <td className="px-3 py-2 text-xs text-slate-600">{product.sku}</td>
                                                        <td className="px-3 py-2 text-right text-xs text-slate-700">{totalStock}</td>
                                                        <td className="px-3 py-2 text-right text-xs text-slate-700">
                                                            ₱ {formatPrice(totalValue)}
                                                        </td>
                                                        <td className="px-3 py-2 text-right text-xs">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/products/${product.id}/stock`}>Stock details</Link>
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

