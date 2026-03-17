<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'description', 'status'];

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }
}