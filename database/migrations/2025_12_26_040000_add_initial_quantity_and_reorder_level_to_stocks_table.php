<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stocks', function (Blueprint $table) {
            if (!Schema::hasColumn('stocks', 'initial_quantity')) {
                $table->decimal('initial_quantity', 12, 3)->default(0)->after('branch_id');
            }

            if (!Schema::hasColumn('stocks', 'reorder_level')) {
                $table->decimal('reorder_level', 12, 3)->default(0)->after('quantity');
            }
        });
    }

    public function down(): void
    {
        Schema::table('stocks', function (Blueprint $table) {
            if (Schema::hasColumn('stocks', 'initial_quantity')) {
                $table->dropColumn('initial_quantity');
            }

            if (Schema::hasColumn('stocks', 'reorder_level')) {
                $table->dropColumn('reorder_level');
            }
        });
    }
};

