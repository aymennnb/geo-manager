<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Vérifie si l'utilisateur a le rôle requis pour accéder à la route.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $roles)
    {
        $allowedRoles = explode(',', $roles);

        if (!Auth::check()) {
            return redirect()->route('login');
        }
        if (in_array(Auth::user()->role, $allowedRoles)) {
            return $next($request);
        }
        return redirect()->route('unauthorized');
    }
}
