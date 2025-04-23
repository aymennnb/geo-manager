<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(){
        $users = User::select('id', 'name', 'email', 'role')->get();

        return Inertia::render('Utilisateurs/IndexUsers', [
            'users' => $users
        ]);
    }

    public function create(){
        return inertia('Utilisateurs/AddUser');
    }
}
