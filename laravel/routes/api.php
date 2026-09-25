<?php
use Illuminate\Support\Facades\{Route,Gate};
use App\Http\Controllers\Api\{AuthController,DestinationController,ExplorePointController,SmartGuideController,EventController,LocalDiscoveryController,RewardController,ManagerController,GovernmentController,AdminController};
Gate::define('manage-destination',[\App\Policies\DestinationPolicy::class,'manage']);
Route::middleware('throttle:10,1')->group(function() {
    Route::post('auth/login',[AuthController::class,'login']);
    Route::post('auth/register',[AuthController::class,'register']);
});
Route::get('destinations',[DestinationController::class,'index']);
Route::get('destinations/{slug}',[DestinationController::class,'show']);
Route::get('scan/{code}',[DestinationController::class,'scanDestinationQR']);
Route::get('events',[EventController::class,'index']);
Route::get('rewards',[RewardController::class,'index']);
Route::get('local-discoveries',[LocalDiscoveryController::class,'index']);
Route::middleware(['auth:sanctum','role:traveler,destination_manager,government,super_admin'])->group(function() {
    Route::get('auth/me',[AuthController::class,'me']); Route::patch('auth/me',[AuthController::class,'updateProfile']); Route::post('auth/logout',[AuthController::class,'logout']);
    Route::middleware('role:traveler')->group(function() {
        Route::get('me/points',[AuthController::class,'points']); Route::get('me/activities',[AuthController::class,'activities']); Route::get('me/album',[AuthController::class,'album']);
        Route::get('smart-guide/recommendations',[SmartGuideController::class,'recommendations']);
        Route::get('explore-points/{idOrSlug}',[ExplorePointController::class,'show']);
        Route::post('scan/explore/{token}',[ExplorePointController::class,'scanExplorePointToken'])->middleware('throttle:60,1');
        Route::post('explore-points/{id}/quiz/submit',[ExplorePointController::class,'submitQuiz'])->middleware('throttle:30,1');
        Route::post('scan/event/{token}',[EventController::class,'scan'])->middleware('throttle:30,1');
        Route::post('local-discoveries/{id}/visit',[LocalDiscoveryController::class,'visit']);
        Route::post('rewards/{id}/redeem',[RewardController::class,'redeem'])->middleware('throttle:30,1');
    });
    Route::prefix('manager')->middleware('role:destination_manager,super_admin')->group(function() {
        Route::get('dashboard',[ManagerController::class,'dashboard']);
        Route::get('destination',[ManagerController::class,'profile']);
        Route::put('destination',[ManagerController::class,'updateDestination']);
        Route::get('{kind}',[ManagerController::class,'index']);
        Route::post('{kind}',[ManagerController::class,'store']);
        Route::match(['put','patch'],'{kind}/{id}',[ManagerController::class,'update']);
        Route::delete('{kind}/{id}',[ManagerController::class,'destroy']);
    });
    Route::prefix('government')->middleware('role:government,super_admin')->group(function() {
        foreach(['dashboard','destinations','insights','reports'] as $action) Route::get($action,[GovernmentController::class,$action]);
    });
    Route::prefix('admin')->middleware('role:super_admin')->group(function() {
        Route::get('dashboard',[AdminController::class,'index']);
        Route::post('users',[AdminController::class,'save']); Route::put('users/{id}',[AdminController::class,'save']);
        Route::post('destinations',[AdminController::class,'destination']);
    });
});
