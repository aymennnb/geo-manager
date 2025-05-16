<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SitesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255', 'unique:sites,name'],
            'web' => ['nullable', 'url', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'ville' => ['required', 'string', 'max:255'],
            'titre_foncier' => ['nullable', 'string', 'max:255'],
            'superficie_terrain' => ['nullable', 'numeric'],
            'zoning_urbanistique' => ['nullable', 'string', 'max:255'],
            'consistance' => ['nullable', 'string'],
            'surface_gla' => ['nullable', 'numeric'],
            'uploaded_by' => ['required', 'integer'],
            'type_site' => ['required', 'in:propre,location'],

            // location fields
            'exploitant' => ['nullable', 'string', 'max:255'],
            'bailleur' => ['nullable', 'string', 'max:255'],
            'date_effet' => ['nullable', 'date'],
            'duree_bail' => ['nullable', 'string', 'max:50'],
            'loyer_actuel' => ['nullable', 'numeric'],
            'taux_revision' => ['nullable', 'numeric'],
            'prochaine_revision' => ['nullable', 'date'],

            // Totaux globaux
            'total' => ['nullable', 'numeric'],
            'vo' => ['nullable', 'numeric'],
            'parking' => ['nullable', 'numeric'],

            // Zone VN
            'vn.total' => ['nullable', 'numeric'],
            'vn.show_room_dacia' => ['nullable', 'numeric'],
            'vn.show_room_renault' => ['nullable', 'numeric'],
            'vn.show_room_nouvelle_marque' => ['nullable', 'numeric'],
            'vn.zone_de_preparation' => ['nullable', 'numeric'],

            // Zone APV
            'apv.total' => ['nullable', 'numeric'],
            'apv.rms' => ['nullable', 'numeric'],
            'apv.atelier_mecanique' => ['nullable', 'numeric'],
            'apv.atelier_carrosserie' => ['nullable', 'numeric'],
        ];
        // Ajout de règles conditionnelles si type_site == "location"
        if ($this->input('type_site') === 'location') {
            $rules['exploitant'] = ['required', 'string', 'max:255'];
            $rules['bailleur'] = ['required', 'string', 'max:255'];
            $rules['date_effet'] = ['required', 'date'];
            $rules['duree_bail'] = ['required', 'string', 'max:50'];
            $rules['loyer_actuel'] = ['required', 'numeric'];
            $rules['taux_revision'] = ['required', 'numeric'];
            $rules['prochaine_revision'] = ['required', 'date', 'after:date_effet'];
        }
        return $rules;
    }
}
