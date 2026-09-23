<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\ExplorePointController;
use App\Http\Controllers\Api\SmartGuideController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\LocalDiscoveryController;
use App\Http\Controllers\Api\ManagerController;
use App\Http\Controllers\Api\GovernmentController;

/*
|--------------------------------------------------------------------------
| TAKONO API Routes - Laravel 11 Production Backend
|--------------------------------------------------------------------------
*/

// --- Public / Authentication Routes ---
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/switch-demo-role', [AuthController::class, 'switchDemoRole']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

// --- Public Destinations & Scanning ---
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{slug}', [DestinationController::class, 'show']);
Route::get('/scan/{code}', [DestinationController::class, 'scanDestinationQR']);
Route::get('/scan/explore/{token}', [ExplorePointController::class, 'scanExplorePointToken']);

// --- Smart Guide & Explore Points ---
Route::get('/smart-guide/recommendations', [SmartGuideController::class, 'recommendations']);
Route::get('/explore-points/{idOrSlug}', [ExplorePointController::class, 'show']);
Route::post('/explore-points/{id}/scan', [ExplorePointController::class, 'simulateScan']);
Route::post('/explore-points/{id}/quiz/submit', [ExplorePointController::class, 'submitQuiz']);

// --- Events & Agenda ---
Route::get('/events', [EventController::class, 'index']);
Route::post('/events/{id}/participate', [EventController::class, 'participate']);

// --- Rewards & Gamification ---
Route::get('/rewards', [RewardController::class, 'index']);
Route::post('/rewards/{id}/redeem', [RewardController::class, 'redeem']);

// --- Local Discovery & UMKM ---
Route::get('/local-discoveries', [LocalDiscoveryController::class, 'index']);
Route::post('/local-discoveries/{id}/visit', [LocalDiscoveryController::class, 'visit']);

// --- Authenticated Traveler Private Profile ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me/points', [AuthController::class, 'points']);
    Route::get('/me/activities', [AuthController::class, 'activities']);
    Route::get('/me/album', [AuthController::class, 'album']);
});

// --- Destination Manager Portal ---
Route::prefix('manager')->group(function () {
    Route::get('/dashboard', [ManagerController::class, 'dashboard']);
    Route::get('/explore-points', [ManagerController::class, 'explorePoints']);
    Route::post('/explore-points', [ManagerController::class, 'storeExplorePoint']);
    Route::put('/explore-points/{id}', [ManagerController::class, 'updateExplorePoint']);
    Route::delete('/explore-points/{id}', [ManagerController::class, 'destroyExplorePoint']);
});

// --- Government & Tourism Intelligence Portal ---
Route::prefix('government')->group(function () {
    Route::get('/dashboard', [GovernmentController::class, 'dashboard']);
    Route::get('/destinations', [GovernmentController::class, 'destinations']);
    Route::get('/insights', [GovernmentController::class, 'insights']);
    Route::get('/reports', [GovernmentController::class, 'reports']);
});
