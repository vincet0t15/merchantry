import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, useForm } from '@inertiajs/react';

type Category = {
    id: number;
    name: string;
};

type Unit = {
    id: number;
    name: string;
    code: string;
};

type Branch = {
    id: number;
    name: string;
};

type StockRow = {
    id: number;
    branch_id: number;
    initial_quantity: number;
    quantity: number;
    reorder_level: number;
};

type Product = {
    id: number;
    name: string;
    sku: string;
    type: 'product' | 'menu' | 'consignment';
    category_id: number | null;
    unit_id: number | null;
    price: number;
    is_active: boolean;
    stocks?: StockRow[];
};

type EditProps = {
    product: Product;
    categories: Category[];
    units: Unit[];
    branches: Branch[];
};

export default function Edit({ product, categories, units, branches }: EditProps) {
    type EditProductForm = {
        name: string;
        sku: string;
        type: 'product' | 'menu' | 'consignment';
        category_id: number | null;
        unit_id: number | null;
        price: string;
        is_active: boolean;
        stocks: {
            branch_id: number;
            reorder_level: string;
        }[];
    };

    const initialStocks = branches.map((branch) => {
        const existing = product.stocks?.find((stock) => stock.branch_id === branch.id);
        return {
            branch_id: branch.id,
            reorder_level: existing ? String(existing.reorder_level ?? 0) : '',
        };
    });

    const { data, setData, put, processing } = useForm<EditProductForm>({
        name: product.name,
        sku: product.sku,
        type: product.type as EditProductForm['type'],
        category_id: product.category_id,
        unit_id: product.unit_id,
        price: String(product.price),
        is_active: product.is_active,
        stocks: initialStocks,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/products/${product.id}`);
    };

    return (
        <>
            <Head title={`Edit ${product.name}`} />
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
                                        <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Edit item</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/inventory">Cancel</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h1 className="text-base font-semibold tracking-tight">Edit inventory item</h1>
                                <p className="text-xs text-slate-600">Update how this item appears in POS and reports.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <h2 className="mb-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Details</h2>
                                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                                        <Field>
                                            <FieldLabel htmlFor="name">Item name</FieldLabel>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(event) => setData('name', event.target.value)}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Type</FieldLabel>
                                            <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-700">
                                                <label className="inline-flex items-center gap-1.5">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="product"
                                                        checked={data.type === 'product'}
                                                        onChange={() => setData('type', 'product')}
                                                        className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span>Product</span>
                                                </label>
                                                <label className="inline-flex items-center gap-1.5">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="menu"
                                                        checked={data.type === 'menu'}
                                                        onChange={() => setData('type', 'menu')}
                                                        className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span>Menu</span>
                                                </label>
                                                <label className="inline-flex items-center gap-1.5">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="consignment"
                                                        checked={data.type === 'consignment'}
                                                        onChange={() => setData('type', 'consignment')}
                                                        className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                    <span>Consignment</span>
                                                </label>
                                            </div>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="sku">SKU / Code</FieldLabel>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="sku"
                                                    type="text"
                                                    value={data.sku}
                                                    onChange={(event) => setData('sku', event.target.value)}
                                                    required
                                                    className="flex-1"
                                                />
                                            </div>
                                            <FieldDescription>Unique identifier used in barcodes, imports, and reports.</FieldDescription>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="category_id">Category</FieldLabel>
                                            <Select
                                                value={data.category_id !== null ? String(data.category_id) : 'none'}
                                                onValueChange={(value) => setData('category_id', value === 'none' ? null : Number(value))}
                                            >
                                                <SelectTrigger id="category_id" className="mt-1 w-full text-xs">
                                                    <SelectValue placeholder="No category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No category</SelectItem>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={String(category.id)}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="unit_id">Unit of measure</FieldLabel>
                                            <Select
                                                value={data.unit_id !== null ? String(data.unit_id) : 'none'}
                                                onValueChange={(value) => setData('unit_id', value === 'none' ? null : Number(value))}
                                            >
                                                <SelectTrigger id="unit_id" className="mt-1 w-full text-xs">
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No unit</SelectItem>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={String(unit.id)}>
                                                            {unit.name} ({unit.code})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </FieldGroup>
                                </div>

                                <div>
                                    <h2 className="mb-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Stock information</h2>
                                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                                        <Field>
                                            <FieldLabel htmlFor="price">Selling price</FieldLabel>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(event) => setData('price', event.target.value)}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <label className="mt-5 inline-flex items-center gap-2 text-xs text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    onChange={(event) => setData('is_active', event.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                Active item
                                            </label>
                                            <FieldDescription>Inactive items stay in history but disappear from day-to-day flows.</FieldDescription>
                                        </Field>
                                    </FieldGroup>

                                    <div className="mt-6 rounded-lg border border-slate-200">
                                        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                            Stock per branch
                                        </div>
                                        <table className="min-w-full table-auto text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                                    <th className="px-3 py-2">Branch</th>
                                                    <th className="px-3 py-2 text-right">Initial stock</th>
                                                    <th className="px-3 py-2 text-right">Current stock</th>
                                                    <th className="px-3 py-2 text-right">Reorder level</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {branches.map((branch, index) => {
                                                    const stock = product.stocks?.find((item) => item.branch_id === branch.id);
                                                    const formStock = data.stocks[index];
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
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.001"
                                                                    value={formStock?.reorder_level ?? ''}
                                                                    onChange={(event) => {
                                                                        const value = event.target.value;
                                                                        setData(
                                                                            'stocks',
                                                                            data.stocks.map((item, i) =>
                                                                                i === index
                                                                                    ? {
                                                                                          ...item,
                                                                                          reorder_level: value,
                                                                                      }
                                                                                    : item,
                                                                            ),
                                                                        );
                                                                    }}
                                                                    className="h-7 w-24 text-right text-[11px]"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="outline" type="button" asChild>
                                        <Link href="/inventory">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Save changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
