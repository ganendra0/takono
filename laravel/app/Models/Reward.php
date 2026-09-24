<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'destination_id',
        'name',
        'category',
        'partner',
        'description',
        'image',
        'points_required',
        'quota',
        'stock',
        'claimed_count',
        'valid_until',
        'valid_from',
        'terms',
        'status',
    ];

    protected $casts = [
        'points_required' => 'integer',
        'quota' => 'integer',
        'stock' => 'integer',
        'claimed_count' => 'integer',
        'terms' => 'array',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function redemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }
}
