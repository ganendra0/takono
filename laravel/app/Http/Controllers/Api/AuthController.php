<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\{AuthRequest,ProfileRequest};
use App\Models\{User, RewardRedemption, PointTransaction, UserActivity, ExplorePoint, UserDestinationJourney};
use App\Services\{Catalog, JourneyService};
use App\Support\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
class AuthController extends Controller {
    public function register(AuthRequest $r) {
        $v=$r->validated();
        if(User::where('email',$v['email'])->exists()) throw ValidationException::withMessages(['email'=>'Email sudah terdaftar.']);
        $u=User::create(['name'=>$v['name'],'email'=>strtolower($v['email']),'password'=>$v['password'],'role'=>'traveler','points_balance'=>0,'active'=>true]);
        return Api::ok(['user'=>$u,'token'=>$u->createToken('web', ['*'], now()->addDays(7))->plainTextToken],201);
    }
    public function login(AuthRequest $r) {
        $u=User::where('email',strtolower($r->validated('email')))->first();
        if(!$u || !$u->active || !Hash::check($r->validated('password'),$u->password)) throw ValidationException::withMessages(['email'=>'Email atau password salah.']);
        return Api::ok(['user'=>$u,'token'=>$u->createToken('web',['*'],now()->addDays(7))->plainTextToken]);
    }
    public function me(Request $r) { return Api::ok($r->user()); }
    public function updateProfile(ProfileRequest $r) {
        $v=$r->validated();$user=$r->user();
        if(!empty($v['password'])&&!Hash::check($v['currentPassword'],$user->password)) throw ValidationException::withMessages(['currentPassword'=>'Password saat ini salah.']);
        $user->name=$v['name'];
        if(!empty($v['password']))$user->password=$v['password'];
        $user->save();
        if(!empty($v['password'])){$tokenId=$user->currentAccessToken()->id;$user->tokens()->where('id','!=',$tokenId)->delete();}
        return Api::ok($user);
    }
    public function logout(Request $r) { $r->user()->currentAccessToken()->delete(); return Api::ok(['message'=>'Berhasil keluar.']); }
    public function points(Request $r) { return Api::ok(['balance'=>$r->user()->points_balance,'transactions'=>$r->user()->pointTransactions()->latest('id')->get()]); }
    public function activities(Request $r) { return Api::ok($r->user()->activities()->latest('id')->get()); }
    public function album(Request $r) {
        $user = $r->user();
        JourneyService::backfillLegacyCompletions($user);
        $destinationId = $r->query('destinationId');
        $destination = $destinationId ? Catalog::destination($destinationId) : null;
        $progress = $destination ? Catalog::progress($user->id, $destination) : null;
        $journeys = UserDestinationJourney::with('destination')->where('user_id', $user->id)->where('status', 'completed')
            ->latest('completed_at')->get();
        $activeJourney = $destination ? UserDestinationJourney::where('user_id', $user->id)->where('destination_id', $destination->id)
            ->where('status', 'active')->first() : null;
        return Api::ok(['progress'=>$progress,'activeJourney'=>$activeJourney,'journeys'=>$journeys,
            'completedPoints'=>$progress ? Catalog::points()->whereIn('id',$progress['completedPointIds'])->get()->map(fn($p)=>Api::point($p)) : [],
            'redemptions'=>$r->user()->rewardRedemptions()->latest('id')->get(),
            'totalPointsEarned'=>$r->user()->pointTransactions()->where('type','credit')->sum('amount')]);
    }
    public function albumDestination(Request $r, string $idOrSlug) {
        $user=$r->user();
        $destination=Catalog::destination($idOrSlug);
        $journey=UserDestinationJourney::with('destination')->where('user_id',$user->id)->where('destination_id',$destination->id)->where('status','completed')->firstOrFail();
        $visitedIds=UserActivity::where('user_id',$user->id)->where('destination_id',$destination->id)
            ->where('type','explore_point_discovered')->distinct()->pluck('reference_id')->map(fn($id)=>(string)$id)->all();
        $points=Catalog::points()->where('destination_id',$destination->id)->get()->map(function($point) use($visitedIds) {
            $item=Api::point($point); $item['visited']=in_array((string)$point->id,$visitedIds,true); return $item;
        });
        $activities=UserActivity::where('user_id',$user->id)->where('destination_id',$destination->id)->latest('id')->get();
        return Api::ok(['journey'=>$journey,'destination'=>$destination,'explorePoints'=>$points,'activities'=>$activities,
            'summary'=>JourneyService::summary($user,$destination)]);
    }
}
