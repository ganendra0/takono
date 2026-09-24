<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class Role {
    public function handle(Request $request, Closure $next, ...$roles) {
        abort_unless($request->user() && $request->user()->active, 401, 'Silakan masuk dengan akun aktif.');
        abort_unless(in_array($request->user()->role, $roles, true), 403, 'Akses ditolak.');
        return $next($request);
    }
}
