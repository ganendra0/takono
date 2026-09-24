<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\{Destination,ExplorePoint,Quiz,DestinationEvent,LocalDiscovery,Reward};
class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Catalog only: no users, sessions, activity, balances or fabricated redemptions.
        $catalog=json_decode(file_get_contents(database_path('data/catalog.json')),true,512,JSON_THROW_ON_ERROR);
        DB::transaction(function()use($catalog) {
            $ids=[];
            foreach($catalog['destinations'] as $row) {
                $old=$row['id'];unset($row['id']);
                $v=[];foreach($row as $k=>$value)$v[Str::snake($k)]=$value;
                $d=Destination::firstOrCreate(['code'=>$v['code']],$v);$ids[$old]=$d->id;
            }
            foreach(['explorePoints'=>ExplorePoint::class,'events'=>DestinationEvent::class,'localDiscoveries'=>LocalDiscovery::class,'rewards'=>Reward::class] as $key=>$model) {
                foreach($catalog[$key] as $row) {
                    $quiz=$row['quiz']??null;unset($row['id'],$row['quiz']);$row['destinationId']=$ids[$row['destinationId']];
                    $v=[];foreach($row as $k=>$value)$v[Str::snake($k)]=$value;
                    if($key==='rewards'){$v['claimed_count']=0;$v['stock']=$v['quota'];}
                    if($key==='explorePoints')$v['secure_token']=Str::random(48);
                    $m=$model::firstOrCreate(['destination_id'=>$v['destination_id'],isset($v['slug'])?'slug':'name'=>$v['slug']??$v['name']],$v);
                    if($quiz){unset($quiz['id'],$quiz['explorePointId']);$m->quiz()->firstOrCreate(['explore_point_id'=>$m->id],$quiz);}
                }
            }
        });
    }
}
