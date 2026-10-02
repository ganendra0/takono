<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{AuditLog, RewardRedemption};
use App\Support\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TenantController extends Controller
{
    public function dashboard(Request $request)
    {
        $tenant = $request->user();
        $rewards = $tenant->tenantRewards()->withCount(['redemptions as active_redemptions_count' => fn ($query) => $query->where('status', 'active')])->get();
        $redemptions = RewardRedemption::with(['reward:id,name,partner', 'user:id,name'])
            ->whereHas('reward', fn ($query) => $query->where('tenant_user_id', $tenant->id))
            ->latest('id')->limit(100)->get();
        return Api::ok(['tenant' => $tenant, 'rewards' => $rewards, 'redemptions' => $redemptions]);
    }

    public function validateVoucher(Request $request)
    {
        $data = $request->validate(['code' => 'required|string|max:160']);
        $code = preg_replace('/^TAKONO:VOUCHER:/i', '', trim($data['code']));
        return DB::transaction(function () use ($request, $code) {
            $redemption = RewardRedemption::with(['reward', 'user'])->where('redemption_code', $code)->lockForUpdate()->firstOrFail();
            abort_unless((string) $redemption->reward->tenant_user_id === (string) $request->user()->id, 403, 'Voucher ini bukan untuk tenant Anda.');
            abort_unless($redemption->status === 'active', 422, 'Voucher ini sudah digunakan atau tidak aktif.');
            abort_unless(! $redemption->expires_at || $redemption->expires_at->isFuture(), 422, 'Voucher sudah kedaluwarsa.');
            $redemption->update(['status' => 'used', 'used_at' => now(), 'verified_by_user_id' => $request->user()->id]);
            AuditLog::create(['user_id' => $request->user()->id, 'action' => 'validate_voucher', 'resource' => 'reward_redemptions', 'resource_id' => (string) $redemption->id]);
            return Api::ok(['redemption' => $redemption->fresh(['reward', 'user']), 'message' => 'Voucher valid dan sudah ditandai sebagai digunakan.']);
        });
    }
}
