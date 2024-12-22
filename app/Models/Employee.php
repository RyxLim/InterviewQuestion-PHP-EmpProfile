<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'myKad',
        'gender',
        'marital_status',
        'phone',
        'email',
        'address',
        'date_of_birth',
        'nationality',
        'hire_date',
        'department',
    ];
}
