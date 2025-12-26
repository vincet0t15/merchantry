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

type CreateProps = {
    categories: Category[];
    units: Unit[];
};

export default function Create({ categories, units }: CreateProps) {
    type CreateProductForm = {
        name: string;
        sku: string;
        category_id: number | null;
        unit_id: number | null;
        price: string;
        is_active: boolean;
    };

    const { data, setData, post, processing, reset } = useForm<CreateProductForm>({
        name: '',
        sku: '',
        category_id: null,
        unit_id: null,
        price: '',
        is_active: true,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/products', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head title="New inventory item" />
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
                                        <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>New item</BreadcrumbPage>
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
                            <div className="mb-6">
                                <h1 className="text-base font-semibold tracking-tight">New inventory item</h1>
                                <p className="text-xs text-slate-600">Add a product you sell so you can track it in POS.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <h2 className="mb-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Details</h2>
                                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                                        <Field>
                                            <FieldLabel htmlFor="name">Name</FieldLabel>
                                            <Input
                                                id="name"
                                                type="text"
                                                autoFocus
                                                placeholder="Bottled water 500ml"
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
                                                placeholder="SKU-0001"
                                                value={data.sku}
                                                onChange={(event) => setData('sku', event.target.value)}
                                                required
                                            />
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
                                            <FieldLabel htmlFor="unit_id">Base unit</FieldLabel>
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
                                            <FieldLabel htmlFor="price">Cost (per base unit)</FieldLabel>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
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
                                </div>

                                <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4">
                                    <Button variant="outline" type="button" asChild>
                                        <Link href="/inventory">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Save
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
