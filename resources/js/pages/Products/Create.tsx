import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';

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

type CreateProductOnlyProps = {
    categories: Category[];
    units: Unit[];
    branches: Branch[];
};

export default function CreateProductOnly({ categories, units, branches }: CreateProductOnlyProps) {
    type TrackingMode = 'track' | 'bundle' | 'none';

    type CreateProductForm = {
        name: string;
        sku: string;
        barcode: string;
        type: 'product' | 'menu' | 'consignment';
        category_id: number | null;
        unit_id: number | null;
        price: string;
        cost: string;
        is_active: boolean;
        tracking_mode: TrackingMode;
        initial_stock: string;
        reorder_level: string;
        stocks: {
            branch_id: number;
            initial_quantity: string;
            reorder_level: string;
        }[];
    };

    const form = useForm<CreateProductForm>({
        name: '',
        sku: '',
        barcode: '',
        type: 'product',
        category_id: null,
        unit_id: null,
        price: '',
        cost: '',
        is_active: true,
        tracking_mode: 'track', // Default to track based on image
        initial_stock: '',
        reorder_level: '',
        stocks: branches.map((branch) => ({
            branch_id: branch.id,
            initial_quantity: '',
            reorder_level: '',
        })),
    });

    const { data, setData, processing, reset } = form;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        form.transform((formData) => {
            const shouldTrack = formData.tracking_mode === 'track';

            const stocks = shouldTrack
                ? branches.map((branch) => ({
                      branch_id: branch.id,
                      initial_quantity: formData.initial_stock,
                      reorder_level: formData.reorder_level,
                  }))
                : [];

            return {
                ...formData,
                stocks,
            };
        });

        form.post('/products', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="New Product or Service" />
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
                                        <BreadcrumbLink href="/inventory">Catalog</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>New Product or Service</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/inventory">Cancel</Link>
                        </Button>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <div>
                                    <h2 className="mb-4 text-sm font-semibold text-slate-900">Basic Information</h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Field>
                                            <FieldLabel htmlFor="category_id">Category</FieldLabel>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={data.category_id !== null ? String(data.category_id) : 'none'}
                                                    onValueChange={(value) => setData('category_id', value === 'none' ? null : Number(value))}
                                                >
                                                    <SelectTrigger id="category_id" className="w-full">
                                                        <SelectValue placeholder="Default" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Default</SelectItem>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={String(category.id)}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button type="button" variant="outline" className="shrink-0">
                                                    Or Create New
                                                </Button>
                                            </div>
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="barcode">Barcode (Optional)</FieldLabel>
                                            <Input
                                                id="barcode"
                                                type="text"
                                                placeholder="Barcode"
                                                value={data.barcode}
                                                onChange={(event) => setData('barcode', event.target.value)}
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="name">Product Name</FieldLabel>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter product name"
                                                value={data.name}
                                                onChange={(event) => setData('name', event.target.value)}
                                                required
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="sku">SKU</FieldLabel>
                                            <Input
                                                id="sku"
                                                type="text"
                                                placeholder="Product SKU"
                                                value={data.sku}
                                                onChange={(event) => setData('sku', event.target.value)}
                                                required
                                            />
                                        </Field>
                                    </div>
                                </div>

                                {/* Inventory & Tracking */}
                                <div>
                                    <h2 className="mb-4 text-sm font-semibold text-slate-900">Inventory & Tracking</h2>
                                    <div className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <button
                                                type="button"
                                                onClick={() => setData('tracking_mode', 'track')}
                                                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors ${
                                                    data.tracking_mode === 'track'
                                                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                                        : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-sm font-semibold text-slate-900">Track Stock</span>
                                                <span className="mt-1 text-xs text-slate-500">Track individual items in your inventory</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setData('tracking_mode', 'bundle')}
                                                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors ${
                                                    data.tracking_mode === 'bundle'
                                                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                                        : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-sm font-semibold text-slate-900">Bundle/Recipe</span>
                                                <span className="mt-1 text-xs text-slate-500">
                                                    Combine multiple items to create a bundle or recipe
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setData('tracking_mode', 'none')}
                                                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-colors ${
                                                    data.tracking_mode === 'none'
                                                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                                        : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-sm font-semibold text-slate-900">No Tracking</span>
                                                <span className="mt-1 text-xs text-slate-500">Sell without counting stock (like services)</span>
                                            </button>
                                        </div>

                                        <div className="w-full md:w-1/2">
                                            <Field>
                                                <FieldLabel htmlFor="unit_id">Base Unit</FieldLabel>
                                                <Select
                                                    value={data.unit_id !== null ? String(data.unit_id) : 'none'}
                                                    onValueChange={(value) => setData('unit_id', value === 'none' ? null : Number(value))}
                                                >
                                                    <SelectTrigger id="unit_id">
                                                        <SelectValue placeholder="Piece" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Piece</SelectItem>
                                                        {units.map((unit) => (
                                                            <SelectItem key={unit.id} value={String(unit.id)}>
                                                                {unit.name} ({unit.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Configuration */}
                                <div>
                                    <h2 className="mb-4 text-sm font-semibold text-slate-900">Product Configuration</h2>
                                    <div className="space-y-6">
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <div className="flex gap-2">
                                                <Info className="h-5 w-5 shrink-0 text-slate-400" />
                                                <div className="space-y-1 text-xs text-slate-600">
                                                    <p className="font-medium text-slate-900">
                                                        You can create a simple product or one with multiple variants (like different sizes, colors,
                                                        etc.).
                                                    </p>
                                                    <ul className="ml-1 list-inside list-disc space-y-1">
                                                        <li>
                                                            <span className="font-medium text-slate-700">Simple Product:</span> One version with fixed
                                                            price and stock
                                                        </li>
                                                        <li>
                                                            <span className="font-medium text-slate-700">Product with Variants:</span> Multiple
                                                            versions, each with their own pricing and inventory
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="button" variant="outline" className="h-9 text-xs font-medium">
                                            Create Variants
                                        </Button>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <Field>
                                                <FieldLabel htmlFor="price">Price</FieldLabel>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0"
                                                    value={data.price}
                                                    onChange={(event) => setData('price', event.target.value)}
                                                    required
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="cost">Cost (Per Base Unit)</FieldLabel>
                                                <Input
                                                    id="cost"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0"
                                                    value={data.cost}
                                                    onChange={(event) => setData('cost', event.target.value)}
                                                />
                                            </Field>

                                            {data.tracking_mode === 'track' && (
                                                <>
                                                    <Field>
                                                        <FieldLabel htmlFor="initial_stock">Initial Stock</FieldLabel>
                                                        <Input
                                                            id="initial_stock"
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            placeholder="0"
                                                            value={data.initial_stock}
                                                            onChange={(event) => setData('initial_stock', event.target.value)}
                                                        />
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel htmlFor="reorder_level">Reorder Level</FieldLabel>
                                                        <Input
                                                            id="reorder_level"
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            placeholder="0"
                                                            value={data.reorder_level}
                                                            onChange={(event) => setData('reorder_level', event.target.value)}
                                                        />
                                                    </Field>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="outline" type="button" asChild>
                                        <Link href="/inventory">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        Save Product
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
