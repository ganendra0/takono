<?php
namespace App\Services;
use App\Models\{UserActivity,ExplorePoint};
class InsightService {
    public static function stats($destinationId=null): array {
        $q=UserActivity::query()->when($destinationId,fn($q)=>$q->where('user_activities.destination_id',$destinationId));
        $counts=(clone $q)->selectRaw('type, COUNT(*) as total')->groupBy('type')->pluck('total','type');
        $categories=(clone $q)->where('type','explore_point_discovered')->join('explore_points','user_activities.reference_id','=','explore_points.id')->selectRaw('explore_points.category, COUNT(*) as total')->groupBy('explore_points.category')->get();
        $sum=$categories->sum('total');
        $days=(clone $q)->where('user_activities.created_at','>=',now()->subDays(6)->startOfDay())->selectRaw('DATE(user_activities.created_at) as day, COUNT(*) as total')->groupBy('day')->pluck('total','day');
        return [
            'totalPlatformActivities'=>(clone $q)->count(),'activeExploreSessions'=>(clone $q)->distinct()->count('user_id'),
            'totalExplorePointsDiscovered'=>(int)($counts['explore_point_discovered']??0),
            'totalQuizzesCompleted'=>(int)($counts['quiz_completed']??0),'totalQuizSubmissions'=>(int)($counts['quiz_completed']??0),
            'totalEventParticipations'=>(int)($counts['event_participated']??0),'totalRewardsRedeemed'=>(int)($counts['reward_redeemed']??0),
            'totalRewardRedemptions'=>(int)($counts['reward_redeemed']??0),'totalLocalDiscoveryVisits'=>(int)($counts['local_discovery_visited']??0),
            'popularCategories'=>$categories->map(fn($c)=>['category'=>$c->category,'count'=>(int)$c->total,'percentage'=>$sum?round(100*$c->total/$sum):0]),
            'activityTrendsByDay'=>collect(range(6,0))->map(fn($i)=>['date'=>now()->subDays($i)->toDateString(),'count'=>(int)($days[now()->subDays($i)->toDateString()]??0)]),
            'hourlyActivityPeak'=>[],
        ];
    }
    public static function insights($destinationId=null): array {
        $stats=self::stats($destinationId);
        if(!$stats['totalPlatformActivities']) return [];
        return [['id'=>'activity','title'=>'Aktivitas Pengguna TAKONO','finding'=>$stats['totalPlatformActivities'].' aktivitas tercatat, termasuk '.$stats['totalQuizzesCompleted'].' penyelesaian kuis dan '.$stats['totalRewardRedemptions'].' penukaran reward.','impact'=>'Info','recommendation'=>'Gunakan distribusi kategori dan aktivitas destinasi untuk meninjau konten.']];
    }
}
