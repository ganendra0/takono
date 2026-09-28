<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Services\{Catalog, JourneyService};
use App\Support\Api;
use Illuminate\Http\Request;
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
    public function startJourney(Request $request, string $code) {
        $destination = Catalog::destination(strtoupper($code));
        $journey = JourneyService::start($request->user(), $destination);
        $progress = Catalog::progress($request->user()->id, $destination);
        return Api::ok(['destination' => $destination, 'journey' => $journey, 'progress' => $progress,
            'message' => $journey->status === 'completed' ? 'Perjalanan ini sudah tersimpan di Album Jelajah.' : "Perjalanan di {$destination->name} dimulai."]);
    }
    public function completeJourney(Request $request, string $idOrSlug) {
        $destination = Catalog::destination($idOrSlug);
        [$journey, $progress] = JourneyService::complete($request->user(), $destination);
        return Api::ok(['journey' => $journey, 'progress' => $progress, 'summary' => JourneyService::summary($request->user(), $destination), 'message' => "Perjalanan {$destination->name} tersimpan di Album Jelajah."]);
    }
}
