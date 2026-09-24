<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Services\Catalog;
use App\Support\Api;
class DestinationController extends Controller {
    public function index() { return Api::ok(Destination::where('status','published')->get()); }
    public function show(string $slug) {
        $d=Catalog::destination($slug);
        return Api::ok(['destination'=>$d,'explorePoints'=>Catalog::points()->where('destination_id',$d->id)->get()->map(fn($p)=>Api::point($p)),
            'events'=>Catalog::events()->where('destination_id',$d->id)->get(),'rewards'=>Catalog::rewards()->where('destination_id',$d->id)->get(),
            'localDiscoveries'=>Catalog::local()->where('destination_id',$d->id)->get()]);
    }
    public function scanDestinationQR(string $code) {
        $d=Catalog::destination(strtoupper($code));
        return Api::ok(['destination'=>$d,'welcomeTitle'=>"Selamat Datang di {$d->name}",'welcomeSubtitle'=>$d->tagline]);
    }
}
