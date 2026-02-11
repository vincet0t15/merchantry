<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::where('name', 'like', "%$search%")
            ->orWhere('username', 'like', "%$search%")
            ->paginate(25)
            ->withQueryString();

        return inertia('settings/Account/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }
}
