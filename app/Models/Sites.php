<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sites extends Model
{
    protected $fillable = [
        'name',
        'web',
        'email',
        'phone',
        'address',
        'latitude',
        'longitude',
        'image',
    ];
}
