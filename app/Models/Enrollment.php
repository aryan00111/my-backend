<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = [
        'student_name', 'date_of_birth', 'gender', 'religion',
'nationality', 'previous_school', 'last_class_passed', 'apply_for_class',
'aadhaar_card', 'father_name', 'father_occupation', 'father_phone',
'mother_name', 'mother_phone', 'email', 'address', 'city',
'status', 'remarks',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];
}