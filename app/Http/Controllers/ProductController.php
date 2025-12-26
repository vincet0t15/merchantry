<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Product;
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

        return Inertia::render('Inventory/Create', [
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function edit(Product $product)
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        $units = Unit::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Inventory/Edit', [
            'product' => $product->only(['id', 'name', 'sku', 'category_id', 'unit_id', 'price', 'is_active']),
            'categories' => $categories,
            'units' => $units,
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
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        Product::create($validated);

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

        return redirect()->route('inventory.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('inventory.index')->with('success', 'Product deleted successfully.');
    }
}
