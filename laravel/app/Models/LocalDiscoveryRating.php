<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalDiscoveryRating extends Model
{
    protected $fillable = ['local_discovery_id', 'user_id', 'rating', 'comment'];
    protected $casts = ['rating' => 'integer'];
    public function localDiscovery() { return $this->belongsTo(LocalDiscovery::class); }
    public function user() { return $this->belongsTo(User::class); }
}
