<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    protected $fillable = [
        'name',
        'grade_level',
        'description',
        'status',
    ];

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function getTotalStudentsAttribute()
    {
        return $this->students()->count();
    }

    public function subjects()
{
    return $this->hasMany(\App\Models\Subject::class, 'school_class_id');
}

public function exams()
{
    return $this->hasMany(\App\Models\Exam::class, 'school_class_id');
}
}