<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register'])->name('register.post');
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->name('login.post');
});

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('branches', BranchController::class)
        ->except(['show'])
        ->middleware('can-manage-branches');

    Route::resource('users', UserController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can-manage-users');

    Route::resource('categories', CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can-manage-catalog');

    Route::resource('units', UnitController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can-manage-catalog');

    Route::resource('payment-methods', PaymentMethodController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->middleware('can-manage-users');

    Route::get('inventory', [ProductController::class, 'index'])
        ->name('inventory.index')
        ->middleware('can-manage-catalog');

    Route::get('inventory-items', [ProductController::class, 'inventoryItems'])
        ->name('inventory.items')
        ->middleware('can-manage-catalog');

    Route::get('products/create', [ProductController::class, 'createProduct'])
        ->name('products.create')
        ->middleware('can-manage-catalog');

    Route::get('inventory/create', [ProductController::class, 'create'])
        ->name('inventory.create')
        ->middleware('can-manage-catalog');

    Route::resource('products', ProductController::class)
        ->only(['edit', 'store', 'update', 'destroy'])
        ->middleware('can-manage-catalog');

    Route::get('products/{product}/stock', [StockAdjustmentController::class, 'index'])
        ->name('products.stock')
        ->middleware('can-manage-catalog');

    Route::post('stock-adjustments', [StockAdjustmentController::class, 'store'])
        ->name('stock-adjustments.store')
        ->middleware('can-manage-catalog');

    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
});
