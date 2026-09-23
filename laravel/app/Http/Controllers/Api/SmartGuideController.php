<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExplorePoint;
use App\Models\Destination;
use Illuminate\Http\Request;

class SmartGuideController extends Controller
{
    public function recommendations(Request $request)
    {
        $preferences = $request->input('preferences');
        $prefList = $preferences ? explode(',', $preferences) : [];

        $query = ExplorePoint::where('status', 'published');

        if (!empty($prefList)) {
            $query->whereIn('category', $prefList);
        }

        $points = $query->orderBy('id', 'asc')->get();

        if ($points->isEmpty()) {
            $points = ExplorePoint::where('status', 'published')->get();
        }

        $firstPoint = $points->first();

        return response()->json([
            'success' => true,
            'data' => [
                'nextRecommendation' => [
                    'point' => $firstPoint,
                    'distanceMeters' => 120,
                    'reason' => 'Sesuai preferensi jalur edukasi terdekat dari gerbang masuk',
                ],
                'recommendedPoints' => $points,
                'progress' => [
                    'totalExplorePoints' => 6,
                    'completedExplorePoints' => 0,
                    'completedPointIds' => [],
                ],
                'walkingRoute' => [
                    'totalDistanceMeters' => 1850,
                    'estimatedDurationMinutes' => 45,
                    'orderedPointIds' => $points->pluck('id'),
                ],
            ],
        ]);
    }
}
