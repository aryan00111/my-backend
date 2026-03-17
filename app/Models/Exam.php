<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'name', 'type', 'school_class_id',
        'exam_date', 'start_date', 'end_date',
        'status', 'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'exam_date'    => 'date',
        'start_date'   => 'date',
        'end_date'     => 'date',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public function examSubjects()
    {
        return $this->hasMany(ExamSubject::class);
    }
}