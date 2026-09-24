<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExplorePoint extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'destination_id',
        'name',
        'slug',
        'category',
        'description',
        'story',
        'educational_content',
        'fun_facts',
        'image',
        'latitude',
        'longitude',
        'estimated_duration',
        'difficulty',
        'secure_token',
        'points_reward',
        'status',
        'audio_guide_url',
    ];

    protected $casts = [
        'fun_facts' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'points_reward' => 'integer',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
}
