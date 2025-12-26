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
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'category_id', 'unit_id', 'price', 'is_active']);

        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Inventory/Index', [
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
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'stocks' => ['nullable', 'array'],
            'stocks.*.branch_id' => ['required_with:stocks.*.initial_quantity,stocks.*.reorder_level', 'integer', 'exists:branches,id'],
            'stocks.*.initial_quantity' => ['nullable', 'numeric', 'min:0'],
            'stocks.*.reorder_level' => ['nullable', 'numeric', 'min:0'],
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        $product = Product::create([
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'category_id' => $validated['category_id'] ?? null,
            'unit_id' => $validated['unit_id'] ?? null,
            'price' => $validated['price'],
            'is_active' => $validated['is_active'],
        ]);

        $stocks = $validated['stocks'] ?? [];

        foreach ($stocks as $stockData) {
            $initialQuantity = $stockData['initial_quantity'] ?? null;
            $reorderLevel = $stockData['reorder_level'] ?? null;

            if ($initialQuantity === null && $reorderLevel === null) {
                continue;
            }

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

        return redirect()->route('inventory.index')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku,' . $product->id],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'stocks' => ['nullable', 'array'],
            'stocks.*.branch_id' => ['required_with:stocks.*.reorder_level', 'integer', 'exists:branches,id'],
            'stocks.*.reorder_level' => ['nullable', 'numeric', 'min:0'],
        ]);

        $data = [
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'category_id' => $validated['category_id'] ?? null,
            'unit_id' => $validated['unit_id'] ?? null,
            'price' => $validated['price'],
            'is_active' => $request->boolean('is_active', true),
        ];

        $product->update($data);

        $stocks = $validated['stocks'] ?? [];

        foreach ($stocks as $stockData) {
            $reorderLevel = $stockData['reorder_level'] ?? null;

            if ($reorderLevel === null) {
                continue;
            }

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

            $stock->reorder_level = (float) $reorderLevel;
            $stock->save();
        }

        return redirect()->route('inventory.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('inventory.index')->with('success', 'Product deleted successfully.');
    }
}
