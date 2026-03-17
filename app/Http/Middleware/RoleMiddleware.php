<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        if (!in_array(auth()->user()->role, $roles)) {
            // Har role ko apne dashboard pe redirect karo
            $user = auth()->user();
            if ($user->role === 'parent') {
                return redirect('/parent/dashboard')
                    ->with('error', 'Aapke paas permission nahi hai!');
            }
            return redirect('/dashboard')
                ->with('error', 'Aapke paas permission nahi hai!');
        }

        return $next($request);
    }
}