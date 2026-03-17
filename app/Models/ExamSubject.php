<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamSubject extends Model
{
    protected $fillable = [
        'exam_id', 'subject_id',
        'exam_date', 'start_time', 'end_time', 'room',
        'practical_date', 'practical_start_time', 'practical_end_time', 'practical_room',
    ];

    protected $casts = [
        'exam_date'      => 'date',
        'practical_date' => 'date',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}