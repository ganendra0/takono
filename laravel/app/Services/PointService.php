<?php
namespace App\Services;
use App\Models\{User, UserActivity, PointTransaction};
use Illuminate\Support\Facades\DB;
class PointService {
    public static function completed($userId, $type, $reference): bool {
        return UserActivity::where('user_id',$userId)->where('type',$type)->where('reference_id',(string)$reference)->exists()
            || PointTransaction::where('user_id',$userId)->where('type','credit')->where('source_type',$type)->where('source_id',(string)$reference)->exists();
    }
    public static function award($userId, $destinationId, string $type, $reference, int $points, string $title): array {
        abort_if($points < 0, 422, 'Nilai poin tidak valid.');
        return DB::transaction(function() use($userId,$destinationId,$type,$reference,$points,$title) {
            $user = User::lockForUpdate()->findOrFail($userId);
            if (self::completed($userId,$type,$reference)) return ['alreadyCompleted'=>true,'pointsAwarded'=>0,'newBalance'=>$user->points_balance,'message'=>'Aktivitas sudah tercatat.'];
            $user->increment('points_balance',$points);
            PointTransaction::create(['user_id'=>$userId,'type'=>'credit','source_type'=>$type,'source_id'=>(string)$reference,'claim_key'=>"$userId:$type:$reference",'amount'=>$points,'description'=>$title,'balance_after'=>$user->points_balance]);
            UserActivity::create(['user_id'=>$userId,'destination_id'=>$destinationId,'type'=>$type,'reference_id'=>(string)$reference,'title'=>$title,'points_earned'=>$points]);
            return ['alreadyCompleted'=>false,'pointsAwarded'=>$points,'newBalance'=>$user->points_balance,'message'=>"Aktivitas tercatat. +$points Jejak Points."];
        }, 3);
    }
}
