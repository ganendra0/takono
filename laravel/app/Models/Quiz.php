<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'explore_point_id',
        'title',
        'questions',
    ];

    protected $casts = [
        'questions' => 'array',
    ];

    public function explorePoint()
    {
        return $this->belongsTo(ExplorePoint::class);
    }
}
