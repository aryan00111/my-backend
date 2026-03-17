<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherClass extends Model
{
    protected $fillable = ['teacher_id', 'class_id'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}