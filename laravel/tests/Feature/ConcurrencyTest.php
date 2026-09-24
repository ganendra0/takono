<?php
namespace Tests\Feature;
use Tests\TestCase;
use App\Models\{User,Destination,Reward,RewardRedemption,PointTransaction,UserActivity};
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;
class ConcurrencyTest extends TestCase {
    public function test_mysql_concurrent_redemption_never_oversells(): void {
        $destination = Destination::create(['name'=>'Concurrency test','slug'=>(string)Str::uuid(),'code'=>Str::random(12),'status'=>'published']);
        $users=[]; $workers=[];
        try {
            $reward=Reward::create(['destination_id'=>$destination->id,'name'=>'Last voucher','description'=>'Test','partner'=>'Test','points_required'=>20,'quota'=>1,'stock'=>1,'claimed_count'=>0,'valid_until'=>today()->addDay()->toDateString(),'status'=>'active']);
            $start=microtime(true)+1;
            for($i=0;$i<2;$i++) {
                $u=User::create(['name'=>'Concurrent test','email'=>Str::uuid().'@example.test','password'=>'test-password-123','role'=>'traveler','active'=>true,'points_balance'=>30]);$users[]=$u;
                $token=$u->createToken('test')->plainTextToken;
                $worker=new Process([PHP_BINARY,base_path('tests/redeem-worker.php'),(string)$reward->id,$token,(string)Str::uuid(),(string)$start],base_path());
                $worker->start();$workers[]=$worker;
            }
            $statuses=[];foreach($workers as $w){$w->wait();$this->assertSame(0,$w->getExitCode(),$w->getErrorOutput());$statuses[]=(int)$w->getOutput();}
            sort($statuses);$this->assertSame([200,422],$statuses);
            $this->assertSame(1,$reward->fresh()->claimed_count);
            $this->assertSame(1,RewardRedemption::where('reward_id',$reward->id)->count());
            $this->assertSame(40,(int)User::whereIn('id',array_map(fn($u)=>$u->id,$users))->sum('points_balance'));
        } finally {
            foreach($workers as $worker) if($worker->isRunning()) $worker->stop();
            foreach($users as $u) { $u->tokens()->delete(); UserActivity::where('user_id',$u->id)->delete(); $u->delete(); }
            if(isset($reward)) $reward->forceDelete();
            $destination->delete();
        }
    }
}
