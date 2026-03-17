<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'title',
        'age_range',
        'description',
        'image',
        'sort_order',
        'status',
    ];
}