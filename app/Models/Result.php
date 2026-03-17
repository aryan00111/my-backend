<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $fillable = [
    'exam_id',
    'student_id',
    'subject_id',
    'marks_obtained',
    'theory_marks_obtained',
    'practical_marks_obtained',
    'total_marks',
    'percentage',
    'grade',
    'status',
    'remarks',
];
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    // Auto grade calculate
   public static function calculateGrade($percentage, $showGrade = true)
{
    if (!$showGrade) return null;
    if ($percentage >= 90) return 'A+';
    if ($percentage >= 80) return 'A';
    if ($percentage >= 70) return 'B+';
    if ($percentage >= 60) return 'B';
    if ($percentage >= 50) return 'C';
    if ($percentage >= 40) return 'D';
    return 'F';
}
}