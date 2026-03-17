<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'school_class_id',
        'name',
        'code',
        'total_marks',
        'passing_marks',
        'has_practical',
        'theory_marks',
        'practical_marks',
        'theory_passing',
        'practical_passing',
        'status',
    ];

    protected $casts = [
        'has_practical' => 'boolean',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}