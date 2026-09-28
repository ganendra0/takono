<?php

namespace App\Services;

use App\Models\{Destination, User, UserActivity, UserDestinationJourney};
use Illuminate\Support\Facades\DB;

class JourneyService
{
    public static function start(User $user, Destination $destination): UserDestinationJourney
    {
        return DB::transaction(function () use ($user, $destination) {
            $journey = UserDestinationJourney::where('user_id', $user->id)
                ->where('destination_id', $destination->id)->lockForUpdate()->first();

            if (!$journey) {
                $journey = UserDestinationJourney::create([
                    'user_id' => $user->id, 'destination_id' => $destination->id,
                    'status' => 'active', 'started_at' => now(),
                ]);
                UserActivity::firstOrCreate(
                    ['user_id' => $user->id, 'destination_id' => $destination->id, 'type' => 'destination_checked_in', 'reference_id' => (string) $destination->id],
                    ['title' => "Memulai perjalanan di {$destination->name}", 'points_earned' => 0],
                );
            }
            return $journey;
        });
    }

    public static function isActive(int $userId, int $destinationId): bool
    {
        return UserDestinationJourney::where('user_id', $userId)->where('destination_id', $destinationId)
            ->where('status', 'active')->exists();
    }

    public static function complete(User $user, Destination $destination): array
    {
        return DB::transaction(function () use ($user, $destination) {
            $journey = UserDestinationJourney::where('user_id', $user->id)
                ->where('destination_id', $destination->id)->lockForUpdate()->first();
            abort_unless($journey, 422, 'Pindai QR pintu masuk untuk memulai perjalanan terlebih dahulu.');
            if ($journey->status === 'completed') return [$journey, Catalog::progress($user->id, $destination)];

            $progress = Catalog::progress($user->id, $destination);
            $journey->update([
                'status' => 'completed', 'completed_at' => now(),
                'explore_points_total' => $progress['totalExplorePoints'],
                'explore_points_completed' => $progress['completedExplorePoints'],
            ]);
            UserActivity::firstOrCreate(
                ['user_id' => $user->id, 'destination_id' => $destination->id, 'type' => 'destination_completed', 'reference_id' => (string) $destination->id],
                ['title' => "Menyelesaikan perjalanan di {$destination->name}", 'points_earned' => 0],
            );
            return [$journey->fresh(), $progress];
        });
    }

    /** A factual trip recap, derived only from this traveler's TAKONO activities. */
    public static function summary(User $user, Destination $destination): array
    {
        $activities = UserActivity::where('user_id', $user->id)
            ->where('destination_id', $destination->id);

        return [
            'destination' => $destination->name,
            'explorePointsVisited' => (clone $activities)->where('type', 'explore_point_discovered')->distinct('reference_id')->count('reference_id'),
            'quizzesCompleted' => (clone $activities)->where('type', 'quiz_completed')->distinct('reference_id')->count('reference_id'),
            'localDiscoveriesVisited' => (clone $activities)->where('type', 'local_discovery_visited')->distinct('reference_id')->count('reference_id'),
            'pointsEarned' => (int) (clone $activities)->where('points_earned', '>', 0)->sum('points_earned'),
        ];
    }

    /** Preserve a completed album for travelers who finished all points before journeys existed. */
    public static function backfillLegacyCompletions(User $user): void
    {
        Destination::where('status', 'published')->each(function (Destination $destination) use ($user) {
            if (UserDestinationJourney::where('user_id', $user->id)->where('destination_id', $destination->id)->exists()) return;
            $progress = Catalog::progress($user->id, $destination);
            if ($progress['totalExplorePoints'] === 0 || $progress['completedExplorePoints'] !== $progress['totalExplorePoints']) return;
            $lastActivity = UserActivity::where('user_id', $user->id)->where('destination_id', $destination->id)
                ->where('type', 'explore_point_discovered')->latest('created_at')->first();
            UserDestinationJourney::firstOrCreate(
                ['user_id' => $user->id, 'destination_id' => $destination->id],
                ['status' => 'completed', 'started_at' => $lastActivity?->created_at ?? now(), 'completed_at' => $lastActivity?->created_at ?? now(),
                    'explore_points_total' => $progress['totalExplorePoints'], 'explore_points_completed' => $progress['completedExplorePoints']],
            );
        });
    }
}
