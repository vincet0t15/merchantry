<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanManageBranches
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, ['super_admin', 'branch_manager'], true)) {
            return redirect()->route('dashboard')->with('error', 'You are not allowed to manage branches.');
        }

        return $next($request);
    }
}

