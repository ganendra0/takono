<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;

class GovernmentController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalPlatformActivities' => 4820,
            'activeExploreSessions' => 240,
            'totalQuizSubmissions' => 1250,
            'totalEventParticipations' => 580,
            'totalRewardRedemptions' => 740,
            'totalLocalDiscoveryVisits' => 1120,
            'popularCategories' => [
                ['category' => 'Edukasi Satwa', 'count' => 1820],
                ['category' => 'Cagar Budaya Sejarah', 'count' => 1240],
                ['category' => 'Kuliner & UMKM Sekitar', 'count' => 980],
                ['category' => 'Wahana Keluarga', 'count' => 780],
            ],
            'activityTrendsByDay' => [
                ['date' => '2026-09-17', 'count' => 520],
                ['date' => '2026-09-18', 'count' => 610],
                ['date' => '2026-09-19', 'count' => 790],
                ['date' => '2026-09-20', 'count' => 1180],
                ['date' => '2026-09-21', 'count' => 890],
                ['date' => '2026-09-22', 'count' => 490],
                ['date' => '2026-09-23', 'count' => 340],
            ],
            'hourlyActivityPeak' => [
                ['hour' => '08:00', 'count' => 95],
                ['hour' => '10:00', 'count' => 340],
                ['hour' => '12:00', 'count' => 280],
                ['hour' => '14:00', 'count' => 310],
                ['hour' => '16:00', 'count' => 150],
            ],
        ];

        $insights = [
            [
                'title' => 'Tingginya Minat Wisatawan pada Sejarah Cagar Budaya KBS',
                'summary' => 'Explore Point Aquarium Bersejarah (1922) mencatat rata-rata waktu singgah tertinggi (18 menit), membuktikan potensi wisata heritage.',
                'recommendation' => 'Disarankan penambahan interpretasi narasi digital di area cagar budaya lainnya di Kota Surabaya.',
            ],
            [
                'title' => 'Efek Spillover Nyata ke Pelaku UMKM Sekitar',
                'summary' => 'Lebih dari 318 voucher kuliner lokal telah ditukarkan di sentra kuliner Wonokromo & Diponegoro.',
                'recommendation' => 'Perluas kemitraan Local Discovery ke sentra cinderamata dan transportasi umum Suroboyo Bus.',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'insights' => $insights,
                'dataTransparency' => [
                    'compliance' => 'Agregat Non-Personal Data',
                    'updatedAt' => now()->toDateTimeString(),
                    'region' => 'Surabaya, Jawa Timur',
                ],
            ],
        ]);
    }

    public function destinations()
    {
        $destinations = Destination::all()->map(function ($dest) {
            return [
                'destination' => $dest,
                'stats' => [
                    'activeSessions' => 86,
                    'engagementScore' => '94%',
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    public function insights()
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['id' => '1', 'topic' => 'Tren Preferensi Keluarga', 'score' => '88%'],
                ['id' => '2', 'topic' => 'Dampak Ekonomi UMKM', 'score' => 'Rp 48.500.000 estimasi perputaran'],
            ],
        ]);
    }

    public function reports()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'generatedAt' => now()->toDateTimeString(),
                'exportFormat' => 'JSON/CSV/PDF Ready',
            ],
        ]);
    }
}
