<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDestinationJourney extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'destination_id', 'status', 'started_at', 'completed_at',
        'explore_points_total', 'explore_points_completed',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'explore_points_total' => 'integer',
        'explore_points_completed' => 'integer',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function destination() { return $this->belongsTo(Destination::class); }
}
