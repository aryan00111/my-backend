<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title', 'content', 'image', 'type',
        'audience', 'status', 'published_at', 'expires_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at'   => 'datetime',
    ];
}