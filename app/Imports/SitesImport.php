<?php

namespace App\Imports;

use App\Models\Sites;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SitesImport implements ToModel, WithHeadingRow
{
    /**
     * Transforme chaque ligne du fichier en instance du modèle Sites
     *
     * @param array $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public int $count = 0;

    public function model(array $row)
    {
        $this->count++;

        return new Sites([
            'name'      => $row['name'],
            'web'       => $row['web'],
            'email'     => $row['email'],
            'phone'     => $row['phone'],
            'address'   => $row['address'],
            'latitude'  => $row['latitude'],
            'longitude' => $row['longitude'],
            'image'     => isset($row['image']) && !empty($row['image']) ? $row['image'] : null,
        ]);
    }
}
