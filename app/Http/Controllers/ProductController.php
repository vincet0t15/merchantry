<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'unit', 'stocks.branch'])
            ->where('is_for_sale', true)
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'type', 'category_id', 'unit_id', 'price', 'cost', 'is_active']);

        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
            'branches' => $branches,
        ]);
    }

    public function inventoryItems()
    {
        $products = Product::with(['category', 'unit', 'stocks.branch'])
            ->whereHas('stocks')
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'type', 'category_id', 'unit_id', 'price', 'cost', 'is_active']);

        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Inventory/Items', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
            'branches' => $branches,
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Inventory/Create', [
            'categories' => $categories,
            'units' => $units,
            'branches' => $branches,
        ]);
    }

    public function createProduct()
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'units' => $units,
            'branches' => $branches,
        ]);
    }

    public function edit(Product $product)
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        $product->load('stocks');

        $stocks = $product->stocks->map(function (Stock $stock): array {
            return [
                'id' => $stock->id,
                'branch_id' => $stock->branch_id,
                'initial_quantity' => $stock->initial_quantity,
                'quantity' => $stock->quantity,
                'reorder_level' => $stock->reorder_level,
            ];
        });

        return Inertia::render('Inventory/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'type' => $product->type,
                'category_id' => $product->category_id,
                'unit_id' => $product->unit_id,
                'price' => $product->price,
                'is_active' => $product->is_active,
                'stocks' => $stocks,
            ],
            'categories' => $categories,
            'units' => $units,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'barcode' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:product,menu,consignment'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'is_for_sale' => ['boolean'],
            'has_variants' => ['boolean'],
            'variant_options' => ['nullable', 'array'],
            'variants' => ['nullable', 'array'],
            'stocks' => ['nullable', 'array'],
            'stocks.*.branch_id' => ['required_with:stocks.*.initial_quantity,stocks.*.reorder_level', 'integer', 'exists:branches,id'],
            'stocks.*.initial_quantity' => ['nullable', 'numeric', 'min:0'],
            'stocks.*.reorder_level' => ['nullable', 'numeric', 'min:0'],
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $hasVariants = $request->boolean('has_variants', false);

        $product = Product::create([
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'barcode' => $validated['barcode'] ?? null,
            'type' => $validated['type'],
            'category_id' => $validated['category_id'] ?? null,
            'unit_id' => $validated['unit_id'] ?? null,
            'price' => $validated['price'],
            'cost' => $validated['cost'] ?? 0,
            'is_active' => $validated['is_active'],
            'is_for_sale' => $request->boolean('is_for_sale', true),
            'variant_definitions' => $hasVariants ? ($validated['variant_options'] ?? []) : null,
        ]);

        // Handle Variants
        if ($hasVariants && !empty($validated['variants'])) {
            foreach ($validated['variants'] as $variantData) {
                // Ensure unique SKU for variant if not provided or conflict
                // Ideally, UI should handle SKU uniqueness, but we can catch basic issues

                $variant = Product::create([
                    'parent_id' => $product->id,
                    'name' => $variantData['name'],
                    'sku' => $variantData['sku'],
                    'barcode' => $variantData['barcode'] ?? null,
                    'type' => $product->type,
                    'category_id' => $product->category_id,
                    'unit_id' => $product->unit_id,
                    'price' => $variantData['price'],
                    'cost' => $variantData['cost'] ?? $product->cost,
                    'is_active' => true,
                    'is_for_sale' => true,
                    'variant_attributes' => $variantData['attributes'] ?? [],
                ]);

                // Initialize stock for variant (for all branches, 0 quantity)
                // We could use the parent's branch selection logic if we want to be consistent
                // For now, let's just initialize for ALL branches to be safe, or just the ones passed in stocks?
                // The stocks array in request is for the parent (or general configuration).
                // Let's use the branches from the 'stocks' array if present, otherwise all branches?
                // To be safe and ensure they appear in inventory, let's check which branches were selected for the parent.

                $stocks = $validated['stocks'] ?? [];
                foreach ($stocks as $stockData) {
                    Stock::create([
                        'product_id' => $variant->id,
                        'branch_id' => $stockData['branch_id'],
                        'initial_quantity' => 0, // Variants start at 0 unless specified otherwise
                        'quantity' => 0,
                        'reorder_level' => 0,
                    ]);
                }
            }
        } else {
            // Handle Stocks for Parent (only if no variants, or if parent itself tracks stock - usually parents don't track stock if they have variants)
            // But let's allow it for now, or maybe skip stock creation for parent if has_variants?
            // If it has variants, the parent is abstract.

            if (!$hasVariants) {
                $stocks = $validated['stocks'] ?? [];

                foreach ($stocks as $stockData) {
                    $initialQuantity = $stockData['initial_quantity'] ?? null;
                    $reorderLevel = $stockData['reorder_level'] ?? null;

                    $initialQuantityValue = $initialQuantity !== null ? (float) $initialQuantity : 0.0;
                    $reorderLevelValue = $reorderLevel !== null ? (float) $reorderLevel : 0.0;

                    Stock::create([
                        'product_id' => $product->id,
                        'branch_id' => $stockData['branch_id'],
                        'initial_quantity' => $initialQuantityValue,
                        'quantity' => $initialQuantityValue,
                        'reorder_level' => $reorderLevelValue,
                    ]);
                }
            }
        }

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku,' . $product->id],
            'barcode' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:product,menu,consignment'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'is_for_sale' => ['boolean'],
            'stocks' => ['nullable', 'array'],
            'stocks.*.branch_id' => ['required_with:stocks.*.reorder_level', 'integer', 'exists:branches,id'],
            'stocks.*.reorder_level' => ['nullable', 'numeric', 'min:0'],
        ]);

        $data = [
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'barcode' => $validated['barcode'] ?? null,
            'type' => $validated['type'],
            'category_id' => $validated['category_id'] ?? null,
            'unit_id' => $validated['unit_id'] ?? null,
            'price' => $validated['price'],
            'cost' => $validated['cost'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
            'is_for_sale' => $request->boolean('is_for_sale', true),
        ];

        $product->update($data);

        $stocks = $validated['stocks'] ?? [];

        foreach ($stocks as $stockData) {
            $reorderLevel = $stockData['reorder_level'] ?? null;

            $stock = Stock::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'branch_id' => $stockData['branch_id'],
                ],
                [
                    'initial_quantity' => 0,
                    'quantity' => 0,
                    'reorder_level' => 0,
                ]
            );

            if ($reorderLevel !== null) {
                $stock->reorder_level = (float) $reorderLevel;
            }

            $stock->save();
        }

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
