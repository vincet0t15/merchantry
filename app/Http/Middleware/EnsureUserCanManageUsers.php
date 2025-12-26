<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanManageUsers
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'super_admin') {
            return redirect()->route('dashboard')->with('error', 'You are not allowed to manage users.');
        }

        return $next($request);
    }
}

