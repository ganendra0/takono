<?php
require __DIR__.'/../vendor/autoload.php';
$app=require __DIR__.'/../bootstrap/app.php';
$kernel=$app->make(\Illuminate\Contracts\Http\Kernel::class);
$delay=(float)$argv[4]-microtime(true);if($delay>0)usleep((int)($delay*1000000));
$request=\Illuminate\Http\Request::create('/api/rewards/'.$argv[1].'/redeem','POST',[],[],[],['HTTP_ACCEPT'=>'application/json','CONTENT_TYPE'=>'application/json','HTTP_AUTHORIZATION'=>'Bearer '.$argv[2]],json_encode(['requestId'=>$argv[3]]));
$response=$kernel->handle($request);
echo $response->getStatusCode();
$kernel->terminate($request,$response);
