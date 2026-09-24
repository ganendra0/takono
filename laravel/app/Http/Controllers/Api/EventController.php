<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Services\{Catalog,PointService};
use App\Support\Api;
use Illuminate\Http\Request;
class EventController extends Controller {
    public function index(Request $r) { return Api::ok(Catalog::events()->when($r->query('destinationId'),fn($q,$id)=>$q->where('destination_id',$id))->orderBy('start_date')->get()); }
    public function participate(Request $r,string $id) {
        $e=Catalog::events()->findOrFail($id);
        return Api::ok(['event'=>$e]+PointService::award($r->user()->id,$e->destination_id,'event_participated',$e->id,$e->points_reward,"Event {$e->title}"));
    }
}
