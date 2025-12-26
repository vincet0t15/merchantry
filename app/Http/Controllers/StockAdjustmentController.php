<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockAdjustmentController extends Controller
{
    public function index(Product $product)
    {
        $product->load(['stocks.branch']);

        $branches = Branch::orderBy('name')->get(['id', 'name']);

        $adjustments = StockAdjustment::with(['branch', 'user'])
            ->where('product_id', $product->id)
            ->orderByDesc('created_at')
            ->get([
                'id',
                'product_id',
                'branch_id',
                'user_id',
                'quantity_change',
                'reason',
                'created_at',
            ]);

        return Inertia::render('Inventory/Stock', [
            'product' => $product->only(['id', 'name', 'sku', 'category_id', 'unit_id', 'price', 'is_active']),
            'stocks' => $product->stocks,
            'branches' => $branches,
            'adjustments' => $adjustments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'quantity_change' => ['required', 'numeric', 'not_in:0'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        DB::transaction(function () use ($validated, $request, $product): void {
            $stock = Stock::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'branch_id' => $validated['branch_id'],
                ],
                [
                    'initial_quantity' => 0,
                    'quantity' => 0,
                    'reorder_level' => 0,
                ]
            );

            $newQuantity = $stock->quantity + $validated['quantity_change'];

            if ($newQuantity < 0) {
                abort(422, 'Stock cannot go below zero.');
            }

            if ($stock->wasRecentlyCreated) {
                $stock->initial_quantity = $newQuantity;
            }

            $stock->quantity = $newQuantity;
            $stock->save();

            StockAdjustment::create([
                'product_id' => $product->id,
                'branch_id' => $validated['branch_id'],
                'user_id' => $request->user()?->id,
                'quantity_change' => $validated['quantity_change'],
                'reason' => $validated['reason'] ?? null,
            ]);
        });

        return back()->with('success', 'Stock adjusted successfully.');
    }
}
