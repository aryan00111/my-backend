<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_id',
        'name',
        'father_name',
        'class_id',
        'section_id',
        'roll_number',
        'phone',
        'address',
        'gender',
        'date_of_birth',
        'status',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function fees()
    {
        return $this->hasMany(Fee::class);
    }

    public function results()
{
    return $this->hasMany(Result::class);
}


    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function parents()
{
    return $this->hasMany(ParentDetail::class);
}
}