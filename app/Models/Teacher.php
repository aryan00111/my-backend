<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use App\Models\SchoolClass;

class Teacher extends Model
{
    protected $fillable = [
    'user_id', 'department_id', 'name', 'email', 'phone',
    'subject', 'subject_ids', 'qualification',
    'gender', 'joining_date', 'salary', 'address', 'status',
];

    protected $casts = [
        'subject_ids' => 'array',
    ];

public function user()
{
    return $this->belongsTo(User::class);
}

public function classes()
{
    return $this->belongsToMany(SchoolClass::class, 'teacher_classes', 'teacher_id', 'class_id');
}

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function educations()
    {
        return $this->hasMany(TeacherEducation::class);
    }

    public function attendances()
    {
        return $this->hasMany(TeacherAttendance::class);
    }
}