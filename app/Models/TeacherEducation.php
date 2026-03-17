<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TeacherEducation extends Model
{
    protected $table = 'teacher_educations';
    
    protected $fillable = ['teacher_id', 'degree', 'institution', 'field_of_study', 'passing_year', 'grade'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}