<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sitef extends Model
{
    use HasFactory;

    protected $table = 'sitesf';

    protected $fillable = [
        'ville',
        'adresse',
        'titre_foncier',
        'superficie_terrain',
        'zoning_urbanistique',
        'consistance',
        'surface_gla',
        'image',
        'uploaded_by',
        'latitude',
        'longitude',
        'surfaces_details',
        'type_site',
    ];

    protected $casts = [
        'surfaces_details' => 'array',
        'latitude' => 'decimal:14',
        'longitude' => 'decimal:14',
    ];

    public function location()
    {
        return $this->hasOne(Location::class, 'sitef_id');
    }
}
