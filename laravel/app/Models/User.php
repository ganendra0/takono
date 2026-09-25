<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'active',
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'destination_id',
        'institution',
        'points_balance',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_subject',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
            'points_balance' => 'integer',
        ];
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function pointTransactions()
    {
        return $this->hasMany(PointTransaction::class);
    }

    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    public function rewardRedemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }
}
