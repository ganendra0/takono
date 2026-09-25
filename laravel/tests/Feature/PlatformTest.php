<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use App\Models\{User,Destination,ExplorePoint,Reward,RewardRedemption,UserActivity,PointTransaction};
class PlatformTest extends TestCase {
    use DatabaseTransactions;
    private function destination(): Destination { return Destination::create(['name'=>'Test '.Str::random(6),'slug'=>Str::uuid(),'code'=>Str::random(12),'description'=>'Test','latitude'=>-7.2,'longitude'=>112.7,'status'=>'published','facilities'=>[]]); }
    private function user(string $role='traveler',$destination=null): User { return User::create(['name'=>'Test','email'=>Str::uuid().'@example.test','password'=>'Password-test-123','role'=>$role,'destination_id'=>$destination?->id,'points_balance'=>0,'active'=>true]); }
    private function token(User $u): array { return ['Authorization'=>'Bearer '.$u->createToken('test')->plainTextToken]; }
    private function pointData(): array { return ['name'=>'Point','description'=>'Description','category'=>'Edukasi','latitude'=>-7.2,'longitude'=>112.7,'estimatedDuration'=>'10 menit','difficulty'=>'Mudah','pointsReward'=>30,'status'=>'published','quiz'=>['title'=>'Quiz','questions'=>[['id'=>'q','question'=>'Question','options'=>[['id'=>'a','text'=>'A'],['id'=>'b','text'=>'B']],'correctOptionId'=>'a','explanation'=>'Because A','points'=>20]]]]; }
    public function test_authentication_and_roles(): void {
        $this->getJson('/api/me/points')->assertUnauthorized();
        $email=Str::uuid().'@example.test';
        $r=$this->postJson('/api/auth/register',['name'=>'Traveler','email'=>$email,'password'=>'Password-test-123'])->assertCreated();
        $this->postJson('/api/auth/login',['email'=>$email,'password'=>'incorrect'])->assertUnprocessable();
        $login=$this->postJson('/api/auth/login',['email'=>$email,'password'=>'Password-test-123'])->assertOk();
        $h=['Authorization'=>'Bearer '.$login->json('data.token')];
        $this->getJson('/api/auth/me',$h)->assertOk()->assertJsonPath('data.role','traveler');
        $this->patchJson('/api/auth/me',['name'=>'Traveler Baru'], $h)->assertOk()->assertJsonPath('data.name','Traveler Baru');
        $this->patchJson('/api/auth/me',['name'=>'Traveler Baru','currentPassword'=>'salah','password'=>'Password-baru-123','password_confirmation'=>'Password-baru-123'], $h)->assertUnprocessable();
        foreach(['/api/manager/dashboard','/api/government/dashboard','/api/admin/dashboard'] as $path) $this->getJson($path,$h)->assertForbidden();
        $this->postJson('/api/auth/register',['name'=>'Fake admin','email'=>Str::uuid().'@example.test','password'=>'Password-test-123','role'=>'super_admin'])->assertUnprocessable();
        $this->postJson('/api/auth/logout',[],$h)->assertOk();
        // Clear cached guard user before validating a revoked bearer token.
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/auth/me',$h)->assertUnauthorized();
        $this->postJson('/api/auth/switch-demo-role',['role'=>'super_admin'])->assertNotFound();
    }
    public function test_manager_traveler_roundtrip_and_points(): void {
        $d=$this->destination();$manager=$this->user('destination_manager',$d);$mh=$this->token($manager);
        $p=$this->postJson('/api/manager/explore-points',$this->pointData(),$mh)->assertCreated()->json('data');
        $user=$this->user();$h=$this->token($user);
        $this->getJson('/api/destinations/'.$d->slug)->assertOk()->assertJsonPath('data.explorePoints.0.id',$p['id'])->assertJsonMissingPath('data.explorePoints.0.secureToken')->assertJsonMissingPath('data.explorePoints.0.quiz.questions.0.correctOptionId');
        $this->getJson('/api/scan/'.$d->code)->assertOk();
        $this->getJson('/api/smart-guide/recommendations?destinationId='.$d->id.'&preferences=Edukasi&lat=-7.2&lng=112.7',$h)->assertOk()->assertJsonPath('data.nextRecommendation.point.id',$p['id']);
        $this->postJson('/api/scan/explore/invalid',[],$h)->assertNotFound();
        $this->postJson('/api/scan/explore/'.$p['secureToken'],['pointsReward'=>999999],$h)->assertOk()->assertJsonPath('data.awardResult.pointsAwarded',30);
        $this->postJson('/api/scan/explore/'.$p['secureToken'],[],$h)->assertOk()->assertJsonPath('data.awardResult.pointsAwarded',0);
        $this->postJson('/api/explore-points/'.$p['id'].'/quiz/submit',['answers'=>[['questionId'=>'q','selectedOptionId'=>'b']]],$h)->assertOk()->assertJsonPath('data.pointsAwarded',0);
        $answer=['answers'=>[['questionId'=>'q','selectedOptionId'=>'a']]];
        $this->postJson('/api/explore-points/'.$p['id'].'/quiz/submit',$answer,$h)->assertOk()->assertJsonPath('data.pointsAwarded',20);
        $this->postJson('/api/explore-points/'.$p['id'].'/quiz/submit',$answer,$h)->assertOk()->assertJsonPath('data.pointsAwarded',0);
        $this->getJson('/api/me/points',$h)->assertOk()->assertJsonPath('data.balance',50);
        $this->getJson('/api/me/album?destinationId='.$d->id,$h)->assertOk()->assertJsonPath('data.progress.completedExplorePoints',1);
        $this->getJson('/api/smart-guide/recommendations?destinationId='.$d->id,$h)->assertOk()->assertJsonPath('data.nextRecommendation.point',null);
        $event=['title'=>'Event','description'=>'Test','startDate'=>today()->toDateString(),'endDate'=>today()->addDay()->toDateString(),'time'=>'10:00','location'=>'Gate','pointsReward'=>10,'status'=>'published'];
        $e=$this->postJson('/api/manager/events',$event,$mh)->assertCreated()->json('data');
        $this->assertNotEmpty($e['qrToken']);
        $this->getJson('/api/events?destinationId='.$d->id)->assertOk()->assertJsonPath('data.0.id',$e['id'])->assertJsonMissingPath('data.0.qrToken');
        $this->postJson('/api/events/'.$e['id'].'/participate',[],$h)->assertNotFound();
        $this->postJson('/api/scan/event/invalid',[],$h)->assertNotFound();
        $this->postJson('/api/scan/event/'.$e['qrToken'],[],$h)->assertOk()->assertJsonPath('data.pointsAwarded',10);
        $this->postJson('/api/scan/event/'.$e['qrToken'],[],$h)->assertOk()->assertJsonPath('data.pointsAwarded',0);
        $local=['name'=>'Business','description'=>'Test','category'=>'Kuliner','address'=>'Street','latitude'=>-7.2,'longitude'=>112.7,'pointsReward'=>0,'status'=>'published'];
        $l=$this->postJson('/api/manager/local-discoveries',$local,$mh)->assertCreated()->json('data');
        $this->postJson('/api/local-discoveries/'.$l['id'].'/visit',[],$h)->assertOk()->assertJsonPath('data.pointsAwarded',0);
        $reward=['name'=>'Voucher','description'=>'Test','partner'=>'Partner','pointsRequired'=>20,'quota'=>1,'validFrom'=>today()->toDateString(),'validUntil'=>today()->addDay()->toDateString(),'status'=>'active'];
        $rw=$this->postJson('/api/manager/rewards',$reward,$mh)->assertCreated()->json('data');
        $key=(string)Str::uuid();
        $redeem=$this->postJson('/api/rewards/'.$rw['id'].'/redeem',['requestId'=>$key],$h)->assertOk()->assertJsonPath('data.remainingBalance',40);
        $this->postJson('/api/rewards/'.$rw['id'].'/redeem',['requestId'=>$key],$h)->assertOk()->assertJsonPath('data.redemption.id',$redeem->json('data.redemption.id'));
        $this->postJson('/api/rewards/'.$rw['id'].'/redeem',['requestId'=>(string)Str::uuid()],$h)->assertUnprocessable();
        $this->putJson('/api/manager/rewards/'.$rw['id'],array_merge($reward,['name'=>'Edited','status'=>'inactive']),$mh)->assertOk();
        $this->deleteJson('/api/manager/rewards/'.$rw['id'],[],$mh)->assertOk();
        $this->assertEquals('Voucher',RewardRedemption::find($redeem->json('data.redemption.id'))->reward_name);
        foreach([['events',$e,$event],['local-discoveries',$l,$local],['explore-points',$p,$this->pointData()]] as [$kind,$item,$body]) {
            $this->putJson('/api/manager/'.$kind.'/'.$item['id'],array_merge($body,['status'=>'draft']),$mh)->assertOk();
            $this->deleteJson('/api/manager/'.$kind.'/'.$item['id'],[],$mh)->assertOk();
        }
    }
    public function test_ownership_validation_government_and_admin(): void {
        $a=$this->destination();$b=$this->destination();$ma=$this->token($this->user('destination_manager',$a));$mb=$this->token($this->user('destination_manager',$b));
        $p=$this->postJson('/api/manager/explore-points',$this->pointData(),$mb)->assertCreated()->json('data');
        $this->putJson('/api/manager/explore-points/'.$p['id'],$this->pointData(),$ma)->assertForbidden();
        $this->deleteJson('/api/manager/explore-points/'.$p['id'],[],$ma)->assertForbidden();
        $this->getJson('/api/manager/destination?destinationId='.$b->id,$ma)->assertForbidden();
        $this->postJson('/api/manager/explore-points',array_merge($this->pointData(),['destinationId'=>$b->id]),$ma)->assertUnprocessable();
        $this->postJson('/api/manager/explore-points',array_merge($this->pointData(),['pointsReward'=>-1]),$ma)->assertUnprocessable();
        $gov=$this->token($this->user('government'));
        $this->getJson('/api/government/dashboard',$gov)->assertOk()->assertJsonMissingPath('data.users');
        $this->getJson('/api/government/insights',$gov)->assertOk();
        $this->getJson('/api/government/reports',$gov)->assertOk()->assertJsonPath('data.dataSource','Aktivitas Pengguna TAKONO');
        $this->postJson('/api/manager/explore-points',$this->pointData(),$gov)->assertForbidden();
        $admin=$this->token($this->user('super_admin'));
        $this->getJson('/api/admin/dashboard',$admin)->assertOk();
        $u=$this->user();
        $body=['name'=>$u->name,'email'=>$u->email,'role'=>'destination_manager','destinationId'=>(string)$a->id,'active'=>true];
        $this->putJson('/api/admin/users/'.$u->id,$body,$admin)->assertOk()->assertJsonPath('data.destinationId',(string)$a->id);
        $h=$this->token($u->fresh());
        $this->putJson('/api/admin/users/'.$u->id,array_merge($body,['active'=>false]),$admin)->assertOk();
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/auth/me',$h)->assertUnauthorized();
    }
    public function test_all_content_ownership_and_destination_publishing(): void {
        $a=$this->destination();$b=$this->destination();
        $ma=$this->token($this->user('destination_manager',$a));$mb=$this->token($this->user('destination_manager',$b));
        $cases=[
            'events'=>['title'=>'Test','description'=>'Test','startDate'=>today()->toDateString(),'endDate'=>today()->addDay()->toDateString(),'time'=>'10:00','location'=>'Gate','pointsReward'=>0,'status'=>'published'],
            'rewards'=>['name'=>'Test','description'=>'Test','partner'=>'Test','quota'=>1,'pointsRequired'=>0,'validUntil'=>today()->addDay()->toDateString(),'status'=>'active'],
            'local-discoveries'=>['name'=>'Test','description'=>'Test','category'=>'Kuliner','address'=>'Gate','latitude'=>0,'longitude'=>0,'pointsReward'=>0,'status'=>'published'],
        ];
        foreach($cases as $kind=>$body) {
            $item=$this->postJson('/api/manager/'.$kind,$body,$mb)->assertCreated()->json('data');
            $this->getJson('/api/manager/'.$kind,$ma)->assertOk()->assertJsonMissing(['id'=>$item['id']]);
            $this->putJson('/api/manager/'.$kind.'/'.$item['id'],$body,$ma)->assertForbidden();
            $this->deleteJson('/api/manager/'.$kind.'/'.$item['id'],[],$ma)->assertForbidden();
        }
        $point=$this->pointData();$point['quiz']=null;
        $this->postJson('/api/manager/explore-points',$point,$ma)->assertCreated();
        $profile=['name'=>'Updated','description'=>'Changed','heroImage'=>'https://example.test/image.jpg','gallery'=>['https://example.test/gallery.jpg'],'address'=>'Address','city'=>'City','province'=>'Province','latitude'=>0,'longitude'=>0,'operatingHours'=>'10:00','facilities'=>[['id'=>'f','name'=>'Toilet','icon'=>'Info','latitude'=>0,'longitude'=>0]],'status'=>'draft'];
        $this->putJson('/api/manager/destination',$profile,$ma)->assertOk()->assertJsonPath('data.name','Updated');
        $this->getJson('/api/destinations/'.$a->slug)->assertNotFound();
        $this->putJson('/api/manager/destination?destinationId='.$b->id,$profile,$ma)->assertForbidden();
        $this->putJson('/api/manager/destination',array_merge($profile,['status'=>'published']),$ma)->assertOk();
        $this->getJson('/api/destinations/'.$a->slug)->assertOk()->assertJsonPath('data.destination.facilities.0.name','Toilet');
    }
    public function test_reward_and_legacy_point_guards(): void {
        $d=$this->destination();$mh=$this->token($this->user('destination_manager',$d));$u=$this->user();$h=$this->token($u);
        $p=$this->postJson('/api/manager/explore-points',$this->pointData(),$mh)->assertCreated()->json('data');
        UserActivity::create(['user_id'=>$u->id,'destination_id'=>$d->id,'type'=>'explore_point_discovered','reference_id'=>$p['id'],'title'=>'Legacy visit','points_earned'=>30]);
        $this->postJson('/api/scan/explore/'.$p['secureToken'],[],$h)->assertOk()->assertJsonPath('data.awardResult.pointsAwarded',0);
        $reward=['name'=>'Test','description'=>'Test','partner'=>'Test','quota'=>1,'pointsRequired'=>20,'validUntil'=>today()->addDay()->toDateString(),'status'=>'active'];
        $rw=$this->postJson('/api/manager/rewards',$reward,$mh)->assertCreated()->json('data');
        $this->postJson('/api/rewards/'.$rw['id'].'/redeem',['requestId'=>(string)Str::uuid()],$h)->assertUnprocessable();
        foreach([['status'=>'inactive'],['validUntil'=>today()->subDay()->toDateString()],['validFrom'=>today()->addDay()->toDateString(),'validUntil'=>today()->addDays(2)->toDateString()]] as $change) {
            $this->putJson('/api/manager/rewards/'.$rw['id'],array_merge($reward,$change),$mh)->assertOk();
            $this->postJson('/api/rewards/'.$rw['id'].'/redeem',['requestId'=>(string)Str::uuid()],$h)->assertUnprocessable();
            $this->getJson('/api/rewards?destinationId='.$d->id)->assertOk()->assertJsonCount(0,'data');
        }
        $this->postJson('/api/manager/rewards',array_merge($reward,['quota'=>-1]),$mh)->assertUnprocessable();
        $this->postJson('/api/manager/rewards',array_merge($reward,['pointsRequired'=>-1]),$mh)->assertUnprocessable();
        $this->getJson('/api/me/points',$h)->assertJsonPath('data.balance',0);
    }
}
