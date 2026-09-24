<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\{User,Reward,RewardRedemption,PointTransaction,UserActivity};
use App\Services\Catalog;
use App\Support\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class RewardController extends Controller {
    public function index(Request $r) { return Api::ok(Catalog::rewards()->when($r->query('destinationId'),fn($q,$id)=>$q->where('destination_id',$id))->get()); }
    public function redeem(Request $r,string $id) {
        $v=$r->validate(['requestId'=>'required|uuid']);
        return DB::transaction(function()use($r,$id,$v) {
            $u=User::lockForUpdate()->findOrFail($r->user()->id);
            $old=RewardRedemption::where('user_id',$u->id)->where('request_id',$v['requestId'])->first();
            if($old) {
                abort_unless((string)$old->reward_id===$id,422,'Request penukaran tidak cocok.');
                return Api::ok(['redemption'=>$old,'remainingBalance'=>$u->points_balance,'message'=>'Penukaran sudah tercatat.']);
            }
            $reward=Reward::lockForUpdate()->findOrFail($id);
            // Validate the locked row, not a snapshot read under MySQL REPEATABLE READ.
            $today=today()->toDateString();
            abort_unless($reward->status==='active' && $reward->claimed_count<$reward->quota
                && $reward->valid_until && $reward->valid_until >= $today
                && (!$reward->valid_from || $reward->valid_from <= $today)
                && $reward->destination?->status==='published',422,'Reward tidak aktif, kedaluwarsa, atau habis.');
            abort_if($reward->points_required<0 || $u->points_balance<$reward->points_required,422,'Poin tidak mencukupi.');
            $u->decrement('points_balance',$reward->points_required);
            $reward->increment('claimed_count');
            $reward->update(['stock'=>max(0,$reward->quota-$reward->claimed_count)]);
            $red=RewardRedemption::create(['user_id'=>$u->id,'reward_id'=>$reward->id,'reward_name'=>$reward->name,'partner'=>$reward->partner,
                'redemption_code'=>'TAKONO-'.strtoupper(Str::random(16)),'points_spent'=>$reward->points_required,'claimed_at'=>now(),
                'expires_at'=>\Illuminate\Support\Carbon::parse($reward->valid_until)->endOfDay(),'status'=>'active','request_id'=>$v['requestId'],'terms'=>$reward->terms]);
            PointTransaction::create(['user_id'=>$u->id,'type'=>'debit','source_type'=>'reward_redeemed','source_id'=>(string)$red->id,'amount'=>$reward->points_required,'description'=>"Penukaran {$reward->name}",'balance_after'=>$u->points_balance]);
            UserActivity::create(['user_id'=>$u->id,'destination_id'=>$reward->destination_id,'type'=>'reward_redeemed','reference_id'=>(string)$red->id,'title'=>"Reward {$reward->name}",'points_earned'=>0]);
            return Api::ok(['redemption'=>$red,'remainingBalance'=>$u->points_balance,'message'=>'Reward berhasil ditukarkan.']);
        },3);
    }
}
