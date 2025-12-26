import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link } from '@inertiajs/react';
import { Image as ImageIcon, Plus } from 'lucide-react';

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

export default function Index({ products }: IndexProps) {
    return (
        <>
            <Head title="Catalog" />
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
                                        <BreadcrumbPage>Catalog</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button asChild className="gap-2">
                            <Link href="/products/create">
                                <Plus className="h-4 w-4" />
                                New
                            </Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Products/Services</h1>
                        </div>

                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                                    <ImageIcon className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900">No products found</h3>
                                <p className="text-sm text-slate-500">Get started by creating your first product.</p>
                                <Button asChild className="mt-4" size="sm">
                                    <Link href="/inventory/create">Create Product</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {products.map((product) => {
                                    const totalStock = product.stocks?.reduce((total, stock) => total + stock.quantity, 0) ?? 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            {/* Image Placeholder */}
                                            <div className="aspect-[4/3] w-full bg-slate-100">
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                    <ImageIcon className="h-10 w-10" />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-1 flex-col p-4">
                                                <div className="mb-1 text-xs text-slate-500">{product.category?.name || 'Default'}</div>
                                                <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900" title={product.name}>
                                                    {product.name}
                                                </h3>

                                                <div className="mt-auto flex items-end justify-between">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{formatCurrency(product.price)}</div>
                                                        <div className="text-xs font-medium text-emerald-600">
                                                            Stock: {totalStock}
                                                            {product.unit?.code ? ` ${product.unit.code}` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Link overlay */}
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="absolute inset-0 z-10 rounded-xl focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                                            >
                                                <span className="sr-only">View details for {product.name}</span>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
