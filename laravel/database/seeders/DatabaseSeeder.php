<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\{Destination,ExplorePoint,DestinationEvent,LocalDiscovery,Reward};
class DatabaseSeeder extends Seeder {
 public function run():void {
  $catalog=json_decode(file_get_contents(database_path('data/catalog.json')),true,512,JSON_THROW_ON_ERROR);
  DB::transaction(function()use($catalog){
   $ids=[];
   foreach($catalog['destinations'] as $row){
    $key=$row['id'];unset($row['id']);$v=$this->snake($row);
    $destination=Destination::where('code',$v['code'])->first()??new Destination;
    $destination->fill($v)->save();$ids[$key]=$destination->id;
   }
   $map=['explorePoints'=>ExplorePoint::class,'events'=>DestinationEvent::class,'localDiscoveries'=>LocalDiscovery::class,'rewards'=>Reward::class];
   foreach($map as $key=>$model){foreach($catalog[$key] as $row){
    $quiz=$row['quiz']??null;unset($row['id'],$row['quiz']);$row['destinationId']=$ids[$row['destinationId']];$v=$this->snake($row);
    $query=$model::withTrashed()->where('destination_id',$v['destination_id']);
    if(isset($v['slug']))$query->where('slug',$v['slug']); else $query->where('name',$v['name']);
    $item=$query->first()??new $model;
    if($key==='explorePoints'&&!$item->secure_token)$v['secure_token']=Str::random(48);
    if($key==='events'&&!$item->qr_token)$v['qr_token']=Str::random(48);
    if($key==='rewards'){$claimed=(int)($item->claimed_count??0);$v['quota']=max($v['quota'],$claimed);$v['claimed_count']=$claimed;$v['stock']=$v['quota']-$claimed;}
    $item->fill($v);$item->save();if(method_exists($item,'restore')&&$item->trashed())$item->restore();
    if($quiz){$item->quiz()->updateOrCreate(['explore_point_id'=>$item->id],['title'=>$quiz['title'],'questions'=>$quiz['questions']]);}
   }}
  });
 }
 private function snake(array $row):array {$out=[];foreach($row as $k=>$v)$out[Str::snake($k)]=$v;return $out;}
}
