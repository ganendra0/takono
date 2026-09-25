<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\GoogleIdentity;
use App\Support\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache, DB};
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GoogleAuthController extends Controller
{
    public function configuration()
    {
        $id = config('google.client_id');
        if (!$id) return Api::ok(['enabled' => false]);
        $nonce = Str::random(64);
        Cache::put('google-nonce:'.hash('sha256', $nonce), true, now()->addMinutes(5));
        return Api::ok(['enabled' => true, 'clientId' => $id, 'nonce' => $nonce]);
    }

    public function login(Request $request, GoogleIdentity $identity)
    {
        abort_unless(config('google.client_id'), 503, 'Login Google belum diaktifkan.');
        $data = $request->validate(['credential' => 'required|string|max:10000', 'nonce' => 'required|string|size:64']);
        $claims = $identity->verify($data['credential']);
        if (!hash_equals($data['nonce'], (string) ($claims['nonce'] ?? ''))) {
            throw ValidationException::withMessages(['credential' => 'Sesi Google tidak cocok. Muat ulang halaman login.']);
        }
        $key = 'google-nonce:'.hash('sha256', $data['nonce']);
        $consumed = Cache::lock($key.':lock', 10)->get(fn () => Cache::pull($key));
        if (!$consumed) throw ValidationException::withMessages(['credential' => 'Sesi Google sudah digunakan atau kedaluwarsa. Silakan coba lagi.']);

        $user = DB::transaction(function () use ($claims) {
            $user = User::where('google_subject', $claims['sub'])->lockForUpdate()->first();
            if (!$user) {
                $email = strtolower($claims['email']);
                // An email match alone must never grant access to an existing account.
                if (User::where('email', $email)->exists()) {
                    throw ValidationException::withMessages(['email' => 'Email ini sudah memiliki akun TAKONO. Masuk dengan password akun tersebut.']);
                }
                $user = User::create(['name' => Str::limit($claims['name'] ?? Str::before($email, '@'), 160, ''), 'email' => $email, 'password' => Str::random(64), 'role' => 'traveler', 'active' => true, 'points_balance' => 0]);
                $user->forceFill(['google_subject' => $claims['sub']])->save();
            }
            if (!$user->active) throw ValidationException::withMessages(['email' => 'Akun ini tidak aktif. Hubungi administrator.']);
            return $user;
        });
        return Api::ok(['user' => $user, 'token' => $user->createToken('google', ['*'], now()->addDays(7))->plainTextToken]);
    }
}
