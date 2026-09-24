<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Services\{Catalog,PointService};
use App\Support\Api;
use Illuminate\Http\Request;
class ExplorePointController extends Controller {
    public function show(Request $r,string $idOrSlug) {
        $p=Catalog::points()->where(fn($q)=>$q->where('slug',$idOrSlug)->orWhere('id',ctype_digit($idOrSlug)?$idOrSlug:0))->firstOrFail();
        return Api::ok(['explorePoint'=>Api::point($p),'alreadyCompleted'=>PointService::completed($r->user()->id,'explore_point_discovered',$p->id),
            'quizCompleted'=>$p->quiz ? PointService::completed($r->user()->id,'quiz_completed',$p->quiz->id):false]);
    }
    public function scanExplorePointToken(Request $r,string $token) {
        $p=Catalog::points()->where('secure_token',$token)->firstOrFail();
        $award=PointService::award($r->user()->id,$p->destination_id,'explore_point_discovered',$p->id,$p->points_reward,"Menjelajahi {$p->name}");
        return Api::ok(['explorePoint'=>Api::point($p),'destination'=>$p->destination,'awardResult'=>$award,'alreadyCompleted'=>$award['alreadyCompleted'],'message'=>$award['message']]);
    }
    public function submitQuiz(Request $r,string $id) {
        $p=Catalog::points()->findOrFail($id); $q=$p->quiz; abort_unless($q,404);
        $v=$r->validate(['answers'=>'required|array','answers.*.questionId'=>'required|string|distinct','answers.*.selectedOptionId'=>'required|string']);
        abort_unless(PointService::completed($r->user()->id,'explore_point_discovered',$p->id),422,'Pindai QR titik terlebih dahulu.');
        $answers=collect($v['answers'])->keyBy('questionId');
        abort_unless($answers->count()===count($q->questions),422,'Jawab seluruh pertanyaan.');
        $correct=0; $points=0;
        foreach($q->questions as $question) {
            $answer=$answers->get((string)$question['id']);
            abort_unless($answer && in_array($answer['selectedOptionId'],array_column($question['options'],'id'),true),422,'Pilihan jawaban tidak valid.');
            if($answer['selectedOptionId']===$question['correctOptionId']) $correct++;
            $points+=(int)$question['points'];
        }
        $done=PointService::completed($r->user()->id,'quiz_completed',$q->id);
        $all=$correct===count($q->questions);
        $award=$all ? PointService::award($r->user()->id,$p->destination_id,'quiz_completed',$q->id,$points,"Kuis {$p->name}") : ['pointsAwarded'=>0,'message'=>'Jawaban belum tepat. Baca materi dan coba lagi.'];
        return Api::ok(['isCorrect'=>$all,'score'=>round(100*$correct/max(1,count($q->questions))),'pointsAwarded'=>$award['pointsAwarded'],'alreadyCompleted'=>$done,'explanation'=>implode(' ',array_column($q->questions,'explanation')),'message'=>$award['message']]);
    }
}
