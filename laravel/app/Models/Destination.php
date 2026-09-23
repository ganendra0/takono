<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'slug',
        'tagline',
        'description',
        'hero_image',
        'gallery',
        'address',
        'city',
        'province',
        'latitude',
        'longitude',
        'boundary_coordinates',
        'operating_hours',
        'ticket_info',
        'contact_phone',
        'contact_email',
        'facilities',
        'status',
        'is_demo',
    ];

    protected $casts = [
        'gallery' => 'array',
        'boundary_coordinates' => 'array',
        'facilities' => 'array',
        'is_demo' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function explorePoints()
    {
        return $this->hasMany(ExplorePoint::class);
    }

    public function events()
    {
        return $this->hasMany(DestinationEvent::class);
    }

    public function localDiscoveries()
    {
        return $this->hasMany(LocalDiscovery::class);
    }

    public function rewards()
    {
        return $this->hasMany(Reward::class);
    }
}
