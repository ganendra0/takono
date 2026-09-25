<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DestinationEvent extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'destination_id',
        'title',
        'slug',
        'qr_token',
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

    protected $hidden = ['qr_token'];

    protected $casts = [
        'points_reward' => 'integer',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
