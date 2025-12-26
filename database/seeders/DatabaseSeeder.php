<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $mainBranch = Branch::create([
            'name' => 'Main Branch',
            'code' => 'MAIN-01',
            'location' => 'HQ',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Super Admin',
            'username' => 'super_admin',
            'password' => Hash::make('password'),
            'is_active' => true,
            'role' => 'super_admin',
        ]);

        User::create([
            'name' => 'Branch Manager',
            'username' => 'branch_manager',
            'password' => Hash::make('password'),
            'is_active' => true,
            'role' => 'branch_manager',
            'branch_id' => $mainBranch->id,
        ]);

        User::create([
            'name' => 'Cashier',
            'username' => 'cashier',
            'password' => Hash::make('password'),
            'is_active' => true,
            'role' => 'cashier',
            'branch_id' => $mainBranch->id,
        ]);
    }
}
