<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Sitef;
use App\Models\User;
use Illuminate\Http\Request;

class SitesfController extends Controller
{
    public function index(Request $request)
    {
        $sitesf = Sitef::all();
        $Location = Location::all();
        $users = User::select('id', 'name')->get();

        return inertia('Sitesf/Sitesf', [
            'sitesf' => $sitesf,
            'Location'=>$Location,
            'users'=>$users
        ]);
    }
}
