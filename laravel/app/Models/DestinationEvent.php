<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DestinationEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'destination_id',
        'title',
        'slug',
        'description',
        'image',
        'start_date',
        'end_date',
        'time',
        'location',
        'organizer',
        'points_reward',
        'status',
    ];

    protected $casts = [
        'points_reward' => 'integer',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
