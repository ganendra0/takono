<?php
namespace App\Services;
use App\Models\{Destination, ExplorePoint, DestinationEvent, Reward, LocalDiscovery};
class Catalog {
    public static function destination($key) { return Destination::where('status','published')->where(fn($q)=>$q->where('slug',$key)->orWhere('code',$key)->orWhere('id',ctype_digit((string)$key)?$key:0))->firstOrFail(); }
    public static function points() { return ExplorePoint::with('quiz')->where('status','published')->whereHas('destination',fn($q)=>$q->where('status','published')); }
    public static function events() { return DestinationEvent::whereIn('status',['published','upcoming'])->where('end_date','>=',today()->toDateString())->whereHas('destination',fn($q)=>$q->where('status','published')); }
    public static function rewards() { return Reward::where('status','active')->where('valid_until','>=',today()->toDateString())->where(fn($q)=>$q->whereNull('valid_from')->orWhere('valid_from','<=',today()))->whereColumn('claimed_count','<','quota')->whereHas('destination',fn($q)=>$q->where('status','published')); }
    public static function local() { return LocalDiscovery::where('status','published')->whereHas('destination',fn($q)=>$q->where('status','published')); }
    public static function progress($userId,$destination) {
        $points = self::points()->where('destination_id',$destination->id)->pluck('id');
        $done = \App\Models\UserActivity::where('user_id',$userId)->where('destination_id',$destination->id)->where('type','explore_point_discovered')->whereIn('reference_id',$points)->distinct()->pluck('reference_id')->map(fn($v)=>(string)$v);
        return ['destinationId'=>(string)$destination->id,'destinationName'=>$destination->name,'totalExplorePoints'=>$points->count(),'completedExplorePoints'=>$done->count(),'completedPointIds'=>$done];
    }
}
