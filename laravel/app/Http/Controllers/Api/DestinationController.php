<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::where('status', 'published')->get();

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    public function show(string $slug)
    {
        $destination = Destination::where('slug', $slug)->first();

        if (!$destination) {
            return response()->json([
                'success' => false,
                'message' => 'Destinasi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'destination' => $destination,
                'explorePoints' => $destination->explorePoints()->where('status', 'published')->get(),
                'events' => $destination->events()->where('status', 'published')->get(),
                'localDiscoveries' => $destination->localDiscoveries()->where('status', 'published')->get(),
                'rewards' => $destination->rewards()->where('status', 'active')->get(),
            ],
        ]);
    }

    public function scanDestinationQR(string $code)
    {
        $destination = Destination::where('code', strtoupper($code))->first();

        if (!$destination) {
            return response()->json([
                'success' => false,
                'message' => "Kode QR destinasi '{$code}' tidak terdaftar.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'destination' => $destination,
                'welcomeTitle' => "Selamat Datang di {$destination->name}",
                'welcomeSubtitle' => "Malu bertanya? TAKONO. Pindai titik jelajah dan temukan kisah tersembunyi!",
            ],
        ]);
    }
}
