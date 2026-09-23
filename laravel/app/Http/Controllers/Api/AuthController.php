<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PointTransaction;
use App\Models\UserActivity;
use App\Models\RewardRedemption;
use App\Models\ExplorePoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'] ?? 'takono123456'),
            'role' => 'traveler',
            'points_balance' => 0,
        ]);

        $token = $user->createToken('takono_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => 'Registrasi penjelajah TAKONO berhasil.',
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'nullable|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Auto-provision demo user if email is demo account
            $role = 'traveler';
            if (str_contains($validated['email'], 'manager')) $role = 'destination_manager';
            elseif (str_contains($validated['email'], 'dinas')) $role = 'government';
            elseif (str_contains($validated['email'], 'admin')) $role = 'super_admin';

            $user = User::create([
                'name' => explode('@', $validated['email'])[0],
                'email' => $validated['email'],
                'password' => Hash::make('takono123456'),
                'role' => $role,
                'points_balance' => 85,
            ]);
        }

        $token = $user->createToken('takono_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => 'Login berhasil.',
        ]);
    }

    public function switchDemoRole(Request $request)
    {
        $role = $request->input('role', 'traveler');
        
        $roleNames = [
            'traveler' => ['name' => 'Budi Santoso', 'email' => 'traveler@takono.id', 'balance' => 85],
            'destination_manager' => ['name' => 'Maya Indah (Pengelola KBS)', 'email' => 'manager@kbs.id', 'balance' => 0],
            'government' => ['name' => 'Drs. Hendra W. (Dinas Pariwisata)', 'email' => 'dinas@surabaya.go.id', 'balance' => 0],
            'super_admin' => ['name' => 'Admin Platform TAKONO', 'email' => 'admin@takono.id', 'balance' => 0],
        ];

        $target = $roleNames[$role] ?? $roleNames['traveler'];
        
        $user = User::firstOrCreate(
            ['email' => $target['email']],
            [
                'name' => $target['name'],
                'password' => Hash::make('demo123456'),
                'role' => $role,
                'points_balance' => $target['balance'],
            ]
        );

        $user->role = $role;
        $user->save();

        $token = $user->createToken('takono_demo_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => "Beralih ke peran {$role}.",
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    public function points(Request $request)
    {
        $user = $request->user();
        $transactions = PointTransaction::where('user_id', $user->id)
            ->latest()
            ->take(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $user->points_balance,
                'transactions' => $transactions,
            ],
        ]);
    }

    public function activities(Request $request)
    {
        $user = $request->user();
        $activities = UserActivity::where('user_id', $user->id)
            ->latest()
            ->take(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    public function album(Request $request)
    {
        $user = $request->user();
        $completedPointIds = UserActivity::where('user_id', $user->id)
            ->where('type', 'explore_point_discovered')
            ->pluck('reference_id')
            ->toArray();

        $completedPoints = ExplorePoint::whereIn('id', $completedPointIds)->get();
        $redemptions = RewardRedemption::where('user_id', $user->id)->latest()->get();
        $totalEarned = PointTransaction::where('user_id', $user->id)->where('type', 'credit')->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'completedPoints' => $completedPoints,
                'redemptions' => $redemptions,
                'totalPointsEarned' => $totalEarned,
                'progress' => [
                    'totalExplorePoints' => 6,
                    'completedExplorePoints' => count($completedPointIds),
                ],
            ],
        ]);
    }
}
