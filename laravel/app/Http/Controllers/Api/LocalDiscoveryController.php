<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Services\{Catalog,PointService};
use App\Support\Api;
use Illuminate\Http\Request;
class LocalDiscoveryController extends Controller {
    public function index(Request $r) { return Api::ok(Catalog::local()->when($r->query('destinationId'),fn($q,$id)=>$q->where('destination_id',$id))->get()); }
    public function visit(Request $r,string $id) {
        $e=Catalog::local()->findOrFail($id);
        return Api::ok(PointService::award($r->user()->id,$e->destination_id,'local_discovery_visited',$e->id,$e->points_reward,"Local Discovery {$e->name}"));
    }
}
