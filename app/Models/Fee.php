<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    protected $fillable = [
        'student_id',
        'fee_type',
        'amount',
        'paid_amount',
        'remaining',
        'status',
        'due_date',
        'paid_date',
        'month',
        'remarks',
    ];

    // Student ke saath relation
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}