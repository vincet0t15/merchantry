<?php

namespace Database\Seeders;

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
        ]);

        User::create([
            'name' => 'Cashier',
            'username' => 'cashier',
            'password' => Hash::make('password'),
            'is_active' => true,
            'role' => 'cashier',
        ]);
    }
}
