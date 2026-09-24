<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Services\Catalog;
use App\Support\Api;
use Illuminate\Http\Request;
class SmartGuideController extends Controller {
    private function distance($a,$b,$c,$d): int {
        $x=sin(deg2rad($c-$a)/2)**2+cos(deg2rad($a))*cos(deg2rad($c))*sin(deg2rad($d-$b)/2)**2;
        return (int)round(6371000*2*atan2(sqrt($x),sqrt(max(0,1-$x))));
    }
    public function recommendations(Request $r) {
        $r->validate(['destinationId'=>'required','lat'=>'nullable|numeric|between:-90,90','lng'=>'nullable|numeric|between:-180,180','preferences'=>'nullable|string|max:255']);
        $d=Catalog::destination($r->query('destinationId')); $progress=Catalog::progress($r->user()->id,$d);
        $prefs=array_filter(explode(',',$r->query('preferences',''))); $located=$r->filled('lat')&&$r->filled('lng');
        $points=Catalog::points()->where('destination_id',$d->id)->whereNotIn('id',$progress['completedPointIds'])->get()->sortBy(fn($p)=>[
            in_array($p->category,$prefs)||!count($prefs)?0:1,
            $located?$this->distance($r->lat,$r->lng,$p->latitude,$p->longitude):$p->id,
        ])->values();
        $next=$points->first(); $distance=$next&&$located?$this->distance($r->lat,$r->lng,$next->latitude,$next->longitude):null;
        return Api::ok(['nextRecommendation'=>['point'=>$next?Api::point($next):null,'distanceMeters'=>$distance,'reason'=>$next?'Sesuai preferensi dan titik yang belum dijelajahi.':'Tidak ada titik tersedia yang belum dijelajahi.'],
            'recommendedPoints'=>$points->map(fn($p)=>Api::point($p)),'progress'=>$progress,
            'walkingRoute'=>$distance!==null?['distanceMeters'=>$distance,'estimatedWalkingMinutes'=>max(1,(int)ceil($distance/70)),'waypoints'=>[[(float)$r->lat,(float)$r->lng],[$next->latitude,$next->longitude]],'isApproximate'=>true]:null]);
    }
}
