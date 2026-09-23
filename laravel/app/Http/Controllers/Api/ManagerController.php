<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\ExplorePoint;
use Illuminate\Http\Request;

class ManagerController extends Controller
{
    public function dashboard()
    {
        $destination = Destination::where('slug', 'kebun-binatang-surabaya')->first();

        $stats = [
            'totalPlatformActivities' => 1482,
            'activeExploreSessions' => 86,
            'totalExplorePointsDiscovered' => 640,
            'totalQuizzesCompleted' => 412,
            'totalQuizSubmissions' => 412,
            'totalEventParticipations' => 195,
            'totalRewardsRedeemed' => 235,
            'totalRewardRedemptions' => 235,
            'totalLocalDiscoveryVisits' => 318,
            'popularCategories' => [
                ['category' => 'Edukasi', 'count' => 420],
                ['category' => 'Sejarah', 'count' => 260],
                ['category' => 'Keluarga', 'count' => 210],
                ['category' => 'Kuliner', 'count' => 190],
            ],
            'activityTrendsByDay' => [
                ['date' => '2026-09-17', 'count' => 142],
                ['date' => '2026-09-18', 'count' => 165],
                ['date' => '2026-09-19', 'count' => 210],
                ['date' => '2026-09-20', 'count' => 340],
                ['date' => '2026-09-21', 'count' => 280],
                ['date' => '2026-09-22', 'count' => 195],
                ['date' => '2026-09-23', 'count' => 150],
            ],
            'hourlyActivityPeak' => [
                ['hour' => '08:00', 'count' => 35],
                ['hour' => '10:00', 'count' => 110],
                ['hour' => '12:00', 'count' => 85],
                ['hour' => '14:00', 'count' => 95],
                ['hour' => '16:00', 'count' => 45],
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'destination' => $destination,
                'stats' => $stats,
                'terminologyDisclaimer' => 'Metrik platform pariwisata ini merefleksikan engagement digital wisatawan di ekosistem TAKONO.',
            ],
        ]);
    }

    public function explorePoints()
    {
        $points = ExplorePoint::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $points,
        ]);
    }

    public function storeExplorePoint(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'story' => 'required|string',
        ]);

        $point = ExplorePoint::create(array_merge($validated, [
            'destination_id' => 1,
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'image' => '/src/assets/images/kbs_surabaya_zoo_1790168132396.jpg',
            'latitude' => -7.2958,
            'longitude' => 112.7365,
            'status' => 'published',
            'points_reward' => 25,
            'secure_token' => 'ep_' . \Illuminate\Support\Str::random(12),
        ]));

        return response()->json([
            'success' => true,
            'data' => $point,
            'message' => 'Titik jelajah baru berhasil ditambahkan.',
        ]);
    }

    public function updateExplorePoint(Request $request, string $id)
    {
        $point = ExplorePoint::findOrFail($id);
        $point->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $point,
            'message' => 'Titik jelajah berhasil diperbarui.',
        ]);
    }

    public function destroyExplorePoint(string $id)
    {
        $point = ExplorePoint::findOrFail($id);
        $point->delete();

        return response()->json([
            'success' => true,
            'message' => 'Titik jelajah berhasil dihapus.',
        ]);
    }
}
