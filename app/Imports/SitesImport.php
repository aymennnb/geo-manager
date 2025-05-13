<?php

namespace App\Imports;

use App\Models\Sites;
use App\Models\Alerts;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterImport;

class SitesImport implements ToModel, WithHeadingRow, WithEvents
{
    public int $count = 0;

    // Tableau pour stocker les sites créés
    public array $sitesCreated = [];

    public function model(array $row)
    {
        $this->count++;

        $site = new Sites([
            'name'      => $row['name'],
            'web'       => $row['web'],
            'email'     => $row['email'],
            'phone'     => $row['phone'],
            'address'   => $row['address'],
            'latitude'  => $row['latitude'],
            'longitude' => $row['longitude'],
            'image'     => array_key_exists('image', $row) && !empty($row['image']) ? $row['image'] : null,
        ]);

        // Ajouter au tableau temporaire
        $this->sitesCreated[] = $site;

        return $site;
    }

    public function registerEvents(): array
    {
        return [
            AfterImport::class => function (AfterImport $event) {
                foreach ($this->sitesCreated as $site) {
                    $savedSite = Sites::where('name', $site->name)
                        ->where('email', $site->email)
                        ->latest()
                        ->first();

                    if ($savedSite) {
                        Alerts::create([
                            'user_id' => Auth::id(),
                            'role' => Auth::user()->role,
                            'action' => 'add',
                            'type' => 'site',
                            'message' => "a ajouté un site avec le nom {$savedSite->name} et l'id {$savedSite->id}.",
                        ]);
                    }
                }
            },
        ];
    }
}
