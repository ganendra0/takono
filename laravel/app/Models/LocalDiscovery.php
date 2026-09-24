<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocalDiscovery extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'destination_id',
        'name',
        'category',
        'description',
        'image',
        'address',
        'latitude',
        'longitude',
        'operating_hours',
        'contact',
        'phone',
        'promotion',
        'reward_text',
        'status',
        'points_reward',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'points_reward' => 'integer',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
