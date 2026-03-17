<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'title', 'content', 'attachment', 'type',
        'audience', 'status', 'published_at', 'expires_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at'   => 'datetime',
    ];
}