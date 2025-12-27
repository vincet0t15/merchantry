<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->constrained('products')->nullOnDelete();
            $table->json('variant_definitions')->nullable()->comment('Available options like Size, Color stored on parent');
            $table->json('variant_attributes')->nullable()->comment('Selected options like Size: S, Color: Red stored on variant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'variant_definitions', 'variant_attributes']);
        });
    }
};
