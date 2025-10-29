<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        if ($request->user()->peran !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda bukan ' . $role,
            ], 403);
        }

        return $next($request);
    }
}