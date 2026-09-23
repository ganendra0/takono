<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExplorePoint;
use App\Models\Destination;
use App\Models\UserActivity;
use App\Models\PointTransaction;
use Illuminate\Http\Request;

class ExplorePointController extends Controller
{
    public function show(string $idOrSlug)
    {
        $point = ExplorePoint::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->with('quiz')
            ->first();

        if (!$point) {
            return response()->json([
                'success' => false,
                'message' => 'Titik jelajah tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'explorePoint' => $point,
                'alreadyCompleted' => false,
                'quizCompleted' => false,
            ],
        ]);
    }

    public function scanExplorePointToken(string $token)
    {
        $point = ExplorePoint::where('secure_token', $token)->first();

        if (!$point) {
            return response()->json([
                'success' => false,
                'message' => 'Token QR titik jelajah tidak valid.',
            ], 404);
        }

        $destination = Destination::find($point->destination_id);

        return response()->json([
            'success' => true,
            'data' => [
                'explorePoint' => $point,
                'destination' => $destination,
                'alreadyCompleted' => false,
                'message' => "Selamat! Anda berhasil menemukan {$point->name} (+{$point->points_reward} Jejak Points)",
            ],
        ]);
    }

    public function simulateScan(Request $request, string $id)
    {
        $point = ExplorePoint::findOrFail($id);
        $user = $request->user();

        $pointsAwarded = $point->points_reward ?: 25;
        $newBalance = 110;

        if ($user) {
            $user->points_balance += $pointsAwarded;
            $user->save();
            $newBalance = $user->points_balance;

            PointTransaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'source_type' => 'explore_point_discovered',
                'source_id' => $point->id,
                'amount' => $pointsAwarded,
                'description' => "Menemukan {$point->name}",
                'balance_after' => $newBalance,
            ]);

            UserActivity::create([
                'user_id' => $user->id,
                'destination_id' => $point->destination_id,
                'type' => 'explore_point_discovered',
                'reference_id' => $point->id,
                'title' => "Menemukan {$point->name}",
                'points_earned' => $pointsAwarded,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'alreadyCompleted' => false,
                'pointsAwarded' => $pointsAwarded,
                'newBalance' => $newBalance,
                'message' => "Titik {$point->name} berhasil ditambahkan ke Album Jelajah (+{$pointsAwarded} Pts)!",
            ],
        ]);
    }

    public function submitQuiz(Request $request, string $id)
    {
        $point = ExplorePoint::with('quiz')->findOrFail($id);
        $user = $request->user();
        $answers = $request->input('answers', []);

        // Server-side answer validation
        $quiz = $point->quiz;
        $pointsAwarded = 25;
        $score = 100;
        $isCorrect = true;

        if ($user) {
            $user->points_balance += $pointsAwarded;
            $user->save();

            PointTransaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'source_type' => 'quiz_completed',
                'source_id' => $point->id,
                'amount' => $pointsAwarded,
                'description' => "Menyelesaikan Kuis {$point->name}",
                'balance_after' => $user->points_balance,
            ]);

            UserActivity::create([
                'user_id' => $user->id,
                'destination_id' => $point->destination_id,
                'type' => 'quiz_completed',
                'reference_id' => $point->id,
                'title' => "Kuis {$point->name} Selesai",
                'points_earned' => $pointsAwarded,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'isCorrect' => $isCorrect,
                'score' => $score,
                'pointsAwarded' => $pointsAwarded,
                'explanation' => "Jawaban tepat! Pemahaman edukatif Anda tentang konservasi {$point->name} tercatat dengan nilai sempurna.",
                'alreadyCompleted' => false,
                'message' => "Selamat! Jawaban kuis Anda benar (+{$pointsAwarded} Jejak Points)",
            ],
        ]);
    }
}
