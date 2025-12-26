import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, router, useForm } from '@inertiajs/react';

type Branch = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    sku: string;
    category_id: number | null;
    unit_id: number | null;
    price: number;
    is_active: boolean;
};

type StockRow = {
    id: number;
    branch_id: number;
    initial_quantity: number;
    quantity: number;
    reorder_level: number;
    branch?: Branch | null;
};

type UserSummary = {
    id: number;
    name: string;
} | null;

type StockAdjustment = {
    id: number;
    product_id: number;
    branch_id: number;
    user_id: number | null;
    quantity_change: number;
    reason: string | null;
    created_at: string;
    branch?: Branch | null;
    user?: UserSummary;
};

type StockPageProps = {
    product: Product;
    stocks: StockRow[];
    branches: Branch[];
    adjustments: StockAdjustment[];
};

export default function StockPage({ product, stocks, branches, adjustments }: StockPageProps) {
    type AdjustStockForm = {
        product_id: number;
        branch_id: string;
        quantity: string;
        direction: 'increase' | 'decrease';
        reason: string;
    };

    const { data, setData, processing, reset } = useForm<AdjustStockForm>({
        product_id: product.id,
        branch_id: '',
        quantity: '',
        direction: 'increase',
        reason: '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const quantityNumber = Number(data.quantity);
        if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
            return;
        }
        const signedQuantity = data.direction === 'increase' ? quantityNumber : quantityNumber * -1;
        router.post(
            '/stock-adjustments',
            {
                product_id: data.product_id,
                branch_id: data.branch_id,
                quantity_change: signedQuantity,
                reason: data.reason,
            },
            {
                onSuccess: () => {
                    reset();
                },
            },
        );
    };

    const getBranchQuantity = (branchId: number) => {
        const stock = stocks.find((s) => s.branch_id === branchId);
        return stock?.quantity ?? 0;
    };

    const formatQuantityChange = (value: number) => {
        if (value > 0) {
            return `+${value}`;
        }
        return String(value);
    };

    const formatDateTime = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleString();
    };

    return (
        <>
            <Head title={`Stock • ${product.name}`} />
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
                                        <BreadcrumbLink href="/inventory">Catalog</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/inventory">Products/Services</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Stock for {product.name}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/inventory">Back to products</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                            <div className="space-y-4">
                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="mb-3">
                                        <h1 className="text-sm font-semibold tracking-tight">{product.name}</h1>
                                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-200">
                                        <table className="min-w-full table-auto text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                                    <th className="px-3 py-2">Branch</th>
                                                    <th className="px-3 py-2 text-right">Initial stock</th>
                                                    <th className="px-3 py-2 text-right">Current stock</th>
                                                    <th className="px-3 py-2 text-right">Reorder level</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {branches.map((branch) => {
                                                    const stock = stocks.find((s) => s.branch_id === branch.id);
                                                    return (
                                                        <tr key={branch.id} className="border-b border-slate-100 last:border-b-0">
                                                            <td className="px-3 py-1.5 text-[11px] text-slate-700">{branch.name}</td>
                                                            <td className="px-3 py-1.5 text-right text-[11px] text-slate-700">
                                                                {stock?.initial_quantity ?? 0}
                                                            </td>
                                                            <td className="px-3 py-1.5 text-right text-[11px] text-slate-700">
                                                                {stock?.quantity ?? 0}
                                                            </td>
                                                            <td className="px-3 py-1.5 text-right text-[11px] text-slate-700">
                                                                {stock?.reorder_level ?? 0}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <h2 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">Adjust stock</h2>
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="branch_id">Branch</FieldLabel>
                                                <Select value={data.branch_id} onValueChange={(value) => setData('branch_id', value)}>
                                                    <SelectTrigger id="branch_id" className="mt-1 w-full text-xs">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {branches.map((branch) => (
                                                            <SelectItem key={branch.id} value={String(branch.id)}>
                                                                {branch.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Change</FieldLabel>
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={data.direction}
                                                        onValueChange={(value) => setData('direction', value as AdjustStockForm['direction'])}
                                                    >
                                                        <SelectTrigger className="mt-1 w-28 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="increase">Increase</SelectItem>
                                                            <SelectItem value="decrease">Decrease</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.001"
                                                        placeholder="0"
                                                        value={data.quantity}
                                                        onChange={(event) => setData('quantity', event.target.value)}
                                                        className="mt-1 text-xs"
                                                    />
                                                </div>
                                                <FieldDescription>Use positive quantities. Decrease will subtract stock.</FieldDescription>
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="reason">Reason</FieldLabel>
                                                <Input
                                                    id="reason"
                                                    type="text"
                                                    placeholder="Received delivery, correction, etc."
                                                    value={data.reason}
                                                    onChange={(event) => setData('reason', event.target.value)}
                                                    className="text-xs"
                                                />
                                            </Field>
                                            <Field>
                                                <Button type="submit" className="w-full" disabled={processing || !data.branch_id || !data.quantity}>
                                                    Record adjustment
                                                </Button>
                                            </Field>
                                        </FieldGroup>
                                    </form>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Adjustment history</h2>
                                </div>
                                {adjustments.length === 0 ? (
                                    <p className="text-xs text-slate-500">No adjustments recorded yet.</p>
                                ) : (
                                    <div className="max-h-[480px] overflow-y-auto">
                                        <table className="min-w-full table-auto text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                                    <th className="px-3 py-2">Date</th>
                                                    <th className="px-3 py-2">Branch</th>
                                                    <th className="px-3 py-2">User</th>
                                                    <th className="px-3 py-2 text-right">Change</th>
                                                    <th className="px-3 py-2">Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adjustments.map((adjustment) => (
                                                    <tr key={adjustment.id} className="border-b border-slate-100 last:border-b-0">
                                                        <td className="px-3 py-1.5 text-[11px] text-slate-700">
                                                            {formatDateTime(adjustment.created_at)}
                                                        </td>
                                                        <td className="px-3 py-1.5 text-[11px] text-slate-700">
                                                            {adjustment.branch?.name ??
                                                                branches.find((branch) => branch.id === adjustment.branch_id)?.name ??
                                                                '—'}
                                                        </td>
                                                        <td className="px-3 py-1.5 text-[11px] text-slate-700">{adjustment.user?.name ?? '—'}</td>
                                                        <td className="px-3 py-1.5 text-right text-[11px] text-slate-700">
                                                            {formatQuantityChange(adjustment.quantity_change)}
                                                        </td>
                                                        <td className="px-3 py-1.5 text-[11px] text-slate-700">{adjustment.reason ?? '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
