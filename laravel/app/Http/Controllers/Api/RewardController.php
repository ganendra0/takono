<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\PointTransaction;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RewardController extends Controller
{
    public function index()
    {
        $rewards = Reward::where('status', 'active')->get();

        return response()->json([
            'success' => true,
            'data' => $rewards,
        ]);
    }

    public function redeem(Request $request, string $id)
    {
        $reward = Reward::findOrFail($id);
        $user = $request->user();

        $code = 'TAKONO-' . strtoupper(Str::random(6));
        $remaining = 35;

        if ($user) {
            if ($user->points_balance < $reward->points_required) {
                return response()->json([
                    'success' => false,
                    'message' => 'Poin Anda tidak mencukupi untuk menukar reward ini.',
                ], 400);
            }

            $user->points_balance -= $reward->points_required;
            $user->save();
            $remaining = $user->points_balance;

            $redemption = RewardRedemption::create([
                'user_id' => $user->id,
                'reward_id' => $reward->id,
                'reward_name' => $reward->name,
                'partner' => $reward->partner,
                'redemption_code' => $code,
                'points_spent' => $reward->points_required,
                'claimed_at' => now(),
                'expires_at' => now()->addDays(7),
                'status' => 'active',
            ]);

            PointTransaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'source_type' => 'reward_redeemed',
                'source_id' => $reward->id,
                'amount' => $reward->points_required,
                'description' => "Penukaran: {$reward->name}",
                'balance_after' => $remaining,
            ]);

            UserActivity::create([
                'user_id' => $user->id,
                'destination_id' => $reward->destination_id,
                'type' => 'reward_redeemed',
                'reference_id' => $reward->id,
                'title' => "Klaim Voucher {$reward->name}",
                'points_earned' => -$reward->points_required,
            ]);
        } else {
            $redemption = [
                'id' => 'redempt-demo',
                'rewardName' => $reward->name,
                'partner' => $reward->partner,
                'redemptionCode' => $code,
                'pointsSpent' => $reward->points_required,
                'claimedAt' => now()->toISOString(),
                'status' => 'active',
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'redemption' => $redemption,
                'remainingBalance' => $remaining,
                'message' => "Selamat! Voucher {$reward->name} berhasil ditukarkan. Tunjukkan kode {$code} ke kasir!",
            ],
        ]);
    }
}
