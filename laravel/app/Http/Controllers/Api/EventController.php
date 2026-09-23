<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DestinationEvent;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = DestinationEvent::where('status', '!=', 'draft')
            ->orderBy('start_date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    public function participate(Request $request, string $id)
    {
        $event = DestinationEvent::findOrFail($id);
        $pointsAwarded = $event->points_reward ?: 30;

        return response()->json([
            'success' => true,
            'data' => [
                'event' => $event,
                'pointsAwarded' => $pointsAwarded,
                'message' => "Partisipasi acara {$event->title} tercatat (+{$pointsAwarded} Jejak Points)!",
            ],
        ]);
    }
}
