<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\{LocalDiscoveryRating,UserActivity};
use App\Services\{Catalog,PointService};
use App\Support\Api;
use Illuminate\Http\Request;
class LocalDiscoveryController extends Controller {
    public function index(Request $r) { return Api::ok(Catalog::local()->when($r->query('destinationId'),fn($q,$id)=>$q->where('destination_id',$id))->get()); }
    public function visit(Request $r,string $id) {
        $e=Catalog::local()->findOrFail($id);
        return Api::ok(PointService::award($r->user()->id,$e->destination_id,'local_discovery_visited',$e->id,$e->points_reward,"Local Discovery {$e->name}"));
    }
    public function rate(Request $r, string $id) {
        $data=$r->validate(['rating'=>'required|integer|between:1,5','comment'=>'nullable|string|max:500']);
        $local=Catalog::local()->findOrFail($id);
        abort_unless(UserActivity::where('user_id',$r->user()->id)->where('destination_id',$local->destination_id)
            ->where('type','local_discovery_visited')->where('reference_id',(string)$local->id)->exists(),422,'Catat kunjungan terlebih dahulu sebelum memberi rating.');
        $rating=LocalDiscoveryRating::updateOrCreate(['local_discovery_id'=>$local->id,'user_id'=>$r->user()->id],$data);
        $local=Catalog::local()->findOrFail($id);
        return Api::ok(['rating'=>$rating,'averageRating'=>(float)($local->ratings_avg_rating ?? 0),'ratingsCount'=>(int)($local->ratings_count ?? 0),'message'=>'Terima kasih, ratingmu sudah tersimpan.']);
    }
    public function myRatings(Request $r) {
        $destinationId=$r->query('destinationId');
        return Api::ok(LocalDiscoveryRating::where('user_id',$r->user()->id)
            ->when($destinationId,fn($query) => $query->whereHas('localDiscovery',fn($local) => $local->where('destination_id',$destinationId)))
            ->get(['local_discovery_id','rating'])->map(fn($rating) => ['localDiscoveryId'=>(string)$rating->local_discovery_id,'rating'=>$rating->rating]));
    }
}
