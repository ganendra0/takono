<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContentRequest;
use App\Models\{Destination,ExplorePoint,DestinationEvent,Reward,LocalDiscovery,AuditLog};
use App\Services\InsightService;
use App\Support\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Gate,DB};
use Illuminate\Support\Str;
class ManagerController extends Controller {
    private function destination(Request $r): Destination {
        $id=$r->user()->role==='super_admin' ? $r->query('destinationId',$r->user()->destination_id) : $r->user()->destination_id;
        abort_unless($id,403,'Akun belum ditugaskan ke destinasi.');
        if($r->query('destinationId')) abort_unless($r->user()->role==='super_admin'||(string)$id===(string)$r->query('destinationId'),403);
        $d=Destination::findOrFail($id); Gate::authorize('manage-destination',$d); return $d;
    }
    private function model(string $kind): string { return match($kind) {
        'explore-points'=>ExplorePoint::class,'events'=>DestinationEvent::class,'rewards'=>Reward::class,'local-discoveries'=>LocalDiscovery::class,default=>abort(404),
    }; }
    private function audit(Request $r,string $action,$model): void { AuditLog::create(['user_id'=>$r->user()->id,'action'=>$action,'resource'=>$model->getTable(),'resource_id'=>(string)$model->id,'changes'=>array_keys($model->getChanges())]); }
    public function dashboard(Request $r) { $d=$this->destination($r); return Api::ok(['destination'=>$d,'stats'=>InsightService::stats($d->id),'terminologyDisclaimer'=>'Aktivitas Pengguna TAKONO, bukan total pengunjung fisik destinasi.']); }
    public function profile(Request $r) { return Api::ok($this->destination($r)); }
    public function updateDestination(ContentRequest $r) { return DB::transaction(function()use($r){ $d=$this->destination($r); $d->update($r->validated()); $this->audit($r,'update',$d); return Api::ok($d); }); }
    public function index(Request $r,string $kind) {
        $d=$this->destination($r); $q=$this->model($kind)::where('destination_id',$d->id);
        if($kind==='explore-points') $q->with('quiz');
        $items=$q->latest('id')->get(); if($kind==='events') $items->each->makeVisible('qr_token');
        return Api::ok($items);
    }
    public function store(ContentRequest $r,string $kind) {
        return DB::transaction(function()use($r,$kind) {
            $d=$this->destination($r); $v=$r->validated(); $quiz=$v['quiz']??null; unset($v['quiz']);
            $v['destination_id']=$d->id;
            if(in_array($kind,['events','explore-points'])) $v['slug']=Str::slug($v['name']??$v['title']).'-'.Str::lower(Str::random(8));
            if($kind==='events') $v['qr_token']=Str::random(48);
            if($kind==='explore-points') $v['secure_token']=Str::random(48);
            if($kind==='rewards') { $v['claimed_count']=0; $v['stock']=$v['quota']; }
            $m=$this->model($kind)::create($v);
            if($kind==='explore-points' && $quiz) $m->quiz()->create($quiz);
            $this->audit($r,'create',$m); if($kind==='events')$m->makeVisible('qr_token'); return Api::ok($kind==='explore-points'?$m->load('quiz'):$m,201);
        });
    }
    public function update(ContentRequest $r,string $kind,string $id) {
        return DB::transaction(function()use($r,$kind,$id) {
            $m=$this->model($kind)::lockForUpdate()->findOrFail($id); Gate::authorize('manage-destination',$m->destination);
            $v=$r->validated(); $hasQuiz=array_key_exists('quiz',$v); $quiz=$v['quiz']??null; unset($v['quiz']);
            if($kind==='rewards') { abort_if($v['quota']<$m->claimed_count,422,'Kuota tidak boleh lebih kecil dari jumlah penukaran.'); $v['stock']=$v['quota']-$m->claimed_count; }
            $m->update($v);
            if($kind==='explore-points' && $hasQuiz) {
                // Preserve quiz ID so editing content never grants another reward.
                if($quiz) $m->quiz()->updateOrCreate(['explore_point_id'=>$m->id],$quiz);
                else abort_if($m->quiz,422,'Kuis yang sudah dibuat dipertahankan untuk menjaga riwayat poin.');
            }
            $this->audit($r,'update',$m); if($kind==='events')$m->makeVisible('qr_token'); return Api::ok($kind==='explore-points'?$m->load('quiz'):$m);
        });
    }
    public function destroy(Request $r,string $kind,string $id) {
        return DB::transaction(function()use($r,$kind,$id) { $m=$this->model($kind)::lockForUpdate()->findOrFail($id); Gate::authorize('manage-destination',$m->destination); $m->delete(); $this->audit($r,'delete',$m); return Api::ok(['message'=>'Konten dihapus. Riwayat aktivitas tetap tersimpan.']); });
    }
}
