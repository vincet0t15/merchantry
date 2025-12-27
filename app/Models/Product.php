<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'barcode',
        'type',
        'category_id',
        'unit_id',
        'price',
        'cost',
        'is_active',
        'is_for_sale',
        'parent_id',
        'variant_definitions',
        'variant_attributes',
    ];

    protected $casts = [
        'variant_definitions' => 'array',
        'variant_attributes' => 'array',
        'is_active' => 'boolean',
        'is_for_sale' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Product::class, 'parent_id');
    }

    public function variants()
    {
        return $this->hasMany(Product::class, 'parent_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}
