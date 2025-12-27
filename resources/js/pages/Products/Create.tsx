import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Info, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

    type VariantOption = {
        id: string;
        name: string;
        values: string[];
    };

    type VariantRow = {
        id: string;
        name: string;
        sku: string;
        price: string;
        cost: string;
        stock: string;
        attributes: Record<string, string>;
    };

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
        has_variants: boolean;
        variant_options: VariantOption[];
        variants: VariantRow[];
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
        tracking_mode: 'track',
        initial_stock: '',
        reorder_level: '',
        stocks: branches.map((branch) => ({
            branch_id: branch.id,
            initial_quantity: '',
            reorder_level: '',
        })),
        has_variants: false,
        variant_options: [],
        variants: [],
    });

    const { data, setData, processing, reset } = form;

    const [localCategories, setLocalCategories] = useState<Category[]>(categories);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingCategory(true);
        try {
            const response = await axios.post(
                '/categories',
                {
                    name: newCategoryName,
                    is_active: true,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );
            const newCategory = response.data;
            setLocalCategories([...localCategories, newCategory]);
            setData('category_id', newCategory.id);
            setIsCategoryModalOpen(false);
            setNewCategoryName('');
        } catch (error) {
            console.error('Failed to create category', error);
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const addOption = () => {
        setData('variant_options', [...data.variant_options, { id: Math.random().toString(36).substr(2, 9), name: '', values: [] }]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...data.variant_options];
        newOptions.splice(index, 1);
        setData('variant_options', newOptions);
    };

    const updateOptionName = (index: number, name: string) => {
        const newOptions = [...data.variant_options];
        newOptions[index].name = name;
        setData('variant_options', newOptions);
    };

    const addOptionValue = (index: number, value: string) => {
        if (!value.trim()) return;
        const newOptions = [...data.variant_options];
        if (!newOptions[index].values.includes(value.trim())) {
            newOptions[index].values.push(value.trim());
            setData('variant_options', newOptions);
        }
    };

    const removeOptionValue = (optionIndex: number, valueIndex: number) => {
        const newOptions = [...data.variant_options];
        newOptions[optionIndex].values.splice(valueIndex, 1);
        setData('variant_options', newOptions);
    };

    // Generate variants when options change
    useEffect(() => {
        if (!data.has_variants) return;

        const validOptions = data.variant_options.filter((o) => o.name && o.values.length > 0);
        if (validOptions.length === 0) {
            setData('variants', []);
            return;
        }

        const combinations = validOptions.reduce(
            (acc, option) => {
                const values = option.values.map((v) => ({ [option.name]: v }));
                if (acc.length === 0) return values;

                const result: Record<string, string>[] = [];
                acc.forEach((a) => {
                    values.forEach((b) => {
                        result.push({ ...a, ...b });
                    });
                });
                return result;
            },
            [] as Record<string, string>[],
        );

        const newVariants = combinations.map((combo, index) => {
            const variantName = `${data.name} - ${Object.values(combo).join(' / ')}`;
            // Try to preserve existing variant data if attributes match
            const existing = data.variants.find((v) => JSON.stringify(v.attributes) === JSON.stringify(combo));

            if (existing) {
                return { ...existing, name: variantName };
            }

            return {
                id: `new-${index}`,
                name: variantName,
                sku: `${data.sku}-${index + 1}`,
                price: data.price,
                cost: data.cost,
                stock: '0',
                attributes: combo,
            };
        });

        setData('variants', newVariants);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.variant_options, data.name, data.sku, data.has_variants, data.price, data.cost]);

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
                                        <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>New Product or Service</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/products">Cancel</Link>
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
                                                        {localCategories.map((category) => (
                                                            <SelectItem key={category.id} value={String(category.id)}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button type="button" variant="outline" className="shrink-0">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            New
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>New Category</DialogTitle>
                                                            <DialogDescription>Create a new category for your products.</DialogDescription>
                                                        </DialogHeader>
                                                        <form onSubmit={handleCreateCategory} className="space-y-4">
                                                            <div className="space-y-2">
                                                                <FieldLabel htmlFor="new-category-name">Name</FieldLabel>
                                                                <Input
                                                                    id="new-category-name"
                                                                    value={newCategoryName}
                                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                                    placeholder="Category name"
                                                                    required
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button type="submit" disabled={isCreatingCategory || !newCategoryName}>
                                                                    {isCreatingCategory ? 'Creating...' : 'Create Category'}
                                                                </Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
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

                                        {!data.has_variants ? (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-9 text-xs font-medium"
                                                    onClick={() => {
                                                        setData('has_variants', true);
                                                        if (data.variant_options.length === 0) {
                                                            setData('variant_options', [
                                                                { id: Math.random().toString(36).substr(2, 9), name: 'Size', values: [] },
                                                            ]);
                                                        }
                                                    }}
                                                >
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
                                            </>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    {data.variant_options.map((option, index) => (
                                                        <div key={option.id} className="rounded-lg border border-slate-200 p-4">
                                                            <div className="mb-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <FieldLabel className="mb-0">Option Name</FieldLabel>
                                                                    <Input
                                                                        value={option.name}
                                                                        onChange={(e) => updateOptionName(index, e.target.value)}
                                                                        className="h-8 w-40"
                                                                        placeholder="e.g. Size"
                                                                    />
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeOption(index)}
                                                                    className="text-slate-500 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {option.values.map((value, vIndex) => (
                                                                    <span
                                                                        key={vIndex}
                                                                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700"
                                                                    >
                                                                        {value}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeOptionValue(index, vIndex)}
                                                                            className="ml-1 text-slate-400 hover:text-slate-600"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        className="h-8 w-32"
                                                                        placeholder="Add value..."
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault();
                                                                                addOptionValue(index, e.currentTarget.value);
                                                                                e.currentTarget.value = '';
                                                                            }
                                                                        }}
                                                                        onBlur={(e) => {
                                                                            if (e.target.value) {
                                                                                addOptionValue(index, e.target.value);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2">
                                                        <Plus className="h-4 w-4" /> Add Option
                                                    </Button>
                                                </div>

                                                <div className="rounded-lg border border-slate-200">
                                                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                                        <h3 className="text-sm font-medium text-slate-700">Preview Variants</h3>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                                                                    <th className="px-4 py-2">Variant</th>
                                                                    <th className="px-4 py-2">SKU</th>
                                                                    <th className="w-24 px-4 py-2">Price</th>
                                                                    <th className="w-24 px-4 py-2">Cost</th>
                                                                    {data.tracking_mode === 'track' && <th className="w-24 px-4 py-2">Stock</th>}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {data.variants.map((variant, index) => (
                                                                    <tr key={variant.id}>
                                                                        <td className="px-4 py-2 text-slate-700">{variant.name}</td>
                                                                        <td className="px-4 py-2">
                                                                            <Input
                                                                                value={variant.sku}
                                                                                onChange={(e) => {
                                                                                    const newVariants = [...data.variants];
                                                                                    newVariants[index].sku = e.target.value;
                                                                                    setData('variants', newVariants);
                                                                                }}
                                                                                className="h-8"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <Input
                                                                                type="number"
                                                                                value={variant.price}
                                                                                onChange={(e) => {
                                                                                    const newVariants = [...data.variants];
                                                                                    newVariants[index].price = e.target.value;
                                                                                    setData('variants', newVariants);
                                                                                }}
                                                                                className="h-8"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <Input
                                                                                type="number"
                                                                                value={variant.cost}
                                                                                onChange={(e) => {
                                                                                    const newVariants = [...data.variants];
                                                                                    newVariants[index].cost = e.target.value;
                                                                                    setData('variants', newVariants);
                                                                                }}
                                                                                className="h-8"
                                                                            />
                                                                        </td>
                                                                        {data.tracking_mode === 'track' && (
                                                                            <td className="px-4 py-2">
                                                                                <Input
                                                                                    type="number"
                                                                                    value={variant.stock}
                                                                                    onChange={(e) => {
                                                                                        const newVariants = [...data.variants];
                                                                                        newVariants[index].stock = e.target.value;
                                                                                        setData('variants', newVariants);
                                                                                    }}
                                                                                    className="h-8"
                                                                                />
                                                                            </td>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                                {data.variants.length === 0 && (
                                                                    <tr>
                                                                        <td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-500">
                                                                            Add options and values to generate variants
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setData('has_variants', false);
                                                        setData('variants', []);
                                                    }}
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    Cancel Variants & Revert to Simple Product
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" size="lg" disabled={processing}>
                                        Create Product
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
