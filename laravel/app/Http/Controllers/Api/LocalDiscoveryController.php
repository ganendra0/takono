<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocalDiscovery;
use Illuminate\Http\Request;

class LocalDiscoveryController extends Controller
{
    public function index()
    {
        $partners = LocalDiscovery::where('status', 'published')->get();

        return response()->json([
            'success' => true,
            'data' => $partners,
        ]);
    }

    public function visit(Request $request, string $id)
    {
        $partner = LocalDiscovery::findOrFail($id);
        $pointsAwarded = 20;

        return response()->json([
            'success' => true,
            'data' => [
                'pointsAwarded' => $pointsAwarded,
                'newBalance' => 105,
                'message' => "Kunjungan ke mitra {$partner->name} tercatat (+{$pointsAwarded} Pts)! Tunjukkan voucher promo Anda saat transaksi.",
            ],
        ]);
    }
}
