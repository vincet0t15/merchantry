<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $methods = PaymentMethod::orderBy('name')->get(['id', 'name', 'code', 'is_active']);

        return Inertia::render('PaymentMethods/Index', [
            'methods' => $methods,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:32', 'unique:payment_methods,code'],
            'is_active' => ['boolean'],
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        PaymentMethod::create($validated);

        return redirect()->route('payment-methods.index')->with('success', 'Payment method created successfully.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:32', 'unique:payment_methods,code,' . $paymentMethod->id],
            'is_active' => ['boolean'],
        ]);

        $data = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'is_active' => $request->boolean('is_active', true),
        ];

        $paymentMethod->update($data);

        return redirect()->route('payment-methods.index')->with('success', 'Payment method updated successfully.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();

        return redirect()->route('payment-methods.index')->with('success', 'Payment method deleted successfully.');
    }
}

