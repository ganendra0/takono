<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RewardRedemption extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'terms',
        'user_id',
        'reward_id',
        'reward_name',
        'partner',
        'redemption_code',
        'points_spent',
        'claimed_at',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'terms' => 'array',
        'points_spent' => 'integer',
        'claimed_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }
}
