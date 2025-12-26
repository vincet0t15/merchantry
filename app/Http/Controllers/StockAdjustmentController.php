<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockAdjustmentController extends Controller
{
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
                    'quantity' => 0,
                ]
            );

            $newQuantity = $stock->quantity + $validated['quantity_change'];

            if ($newQuantity < 0) {
                abort(422, 'Stock cannot go below zero.');
            }

            $stock->update([
                'quantity' => $newQuantity,
            ]);

            StockAdjustment::create([
                'product_id' => $product->id,
                'branch_id' => $validated['branch_id'],
                'user_id' => $request->user()?->id,
                'quantity_change' => $validated['quantity_change'],
                'reason' => $validated['reason'] ?? null,
            ]);
        });

        return redirect()->route('inventory.index')->with('success', 'Stock adjusted successfully.');
    }
}

