<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Services\InsightService;
use App\Support\Api;
class GovernmentController extends Controller {
    public function dashboard() { return Api::ok(['stats'=>InsightService::stats(),'insights'=>InsightService::insights(),'dataTransparency'=>['dataSource'=>'Aktivitas Pengguna TAKONO','privacySafeguards'=>'Hanya agregat, tanpa identitas individu.','updatedAt'=>now()->toISOString()]]); }
    public function destinations() { return Api::ok(Destination::all()->map(fn($d)=>['destination'=>$d,'stats'=>InsightService::stats($d->id)])); }
    public function insights() { return Api::ok(InsightService::insights()); }
    public function reports() { return Api::ok(['generatedAt'=>now()->toISOString(),'dataSource'=>'Aktivitas Pengguna TAKONO','stats'=>InsightService::stats(),'destinationsSummary'=>Destination::all()->map(fn($d)=>['id'=>(string)$d->id,'name'=>$d->name,'stats'=>InsightService::stats($d->id)])]); }
}
