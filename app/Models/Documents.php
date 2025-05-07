<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documents extends Model
{
    protected $fillable = [
        'title',
        'description',
        'file_path',
        'expiration_date',
        'site_id',
        'uploaded_by',
        'created_at',
        'updated_at'
    ];
}
