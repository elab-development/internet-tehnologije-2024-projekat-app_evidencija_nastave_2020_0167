<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'schedule_id',
        'date',
        'is_present',
    ];

    protected $casts = [
        'date' => 'date',
        'is_present' => 'boolean',
    ];
}