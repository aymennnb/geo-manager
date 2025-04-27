<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Models\Alerts;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(){
        $users = User::all();

        return Inertia::render('Utilisateurs/IndexUsers', [
            'users' => $users
        ]);
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,manager,user',
        ]);

        $user = User::updateOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'],
                'password' => bcrypt($data['password']),
                'role' => $data['role'],
            ]
        );

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'user',
            'message' => "a ajouté un nouveau {$user->role} avec le nom {$user->name} et l'ID {$user->id}.",
        ]);

        return redirect()->route('utilisateurs')->with([
            'success' => 'Utilisateur ajouté avec succès.',
        ]);
    }

    public function updateRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,manager,user',
        ]);

        $user = User::findOrFail($request->user_id);
        $ancien_role = $user->role;
        $user->role = $request->role;
        $user->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'updaterole',
            'type' => 'user',
            'message' => "a changé le rôle d'un acteur avec le nom {$user->name} et l'ID {$user->id} de {$ancien_role} à " . ($request->role === 'admin' ? 'admin' : ($request->role === 'manager' ? 'manager' : 'utilisateur')) . ".",
        ]);

        return redirect('utilisateurs')->with(['success', 'Rôle mis à jour avec succès.']);
    }

    public function resetPassword($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'password' => bcrypt('12345678'),
        ]);

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'reset',
            'type' => 'user',
            'message' => " a réinitialisé le mot de passe d'un " . ($user->role === 'admin' ? "admin" : ($user->role === 'manager' ? 'manager' : 'utilisateur')) . " avec le nom {$user ->name} et L'id " . ($user ->id) . ".",
        ]);

        return redirect('utilisateurs')->with(['success' => "Le mot de passe de {$user->name} a été réinitialisé à 12345678 avec succès."]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return inertia('Utilisateurs/EditUser', [
            'user' => $user
        ]);
    }

    public function update(UserUpdateRequest $request)
    {
        $item = User::find($request->id);

        if (!$item) {
            return redirect('utilisateurs')->with(['error' => 'Utilisateur non trouvé.']);
        }

        $item->name = $request->name;
        $item->email = $request->email;
        $item->role = $request->role;
        $item->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'user',
            'message' => " a modifié les informations d'un " . ($item->role === 'admin' ? "admin" : ($item->role === 'manager' ? 'manager' : 'utilisateur')) . " avec le nom " .($item->name). " et L'id " . ($item->id) . ".",
        ]);

        return redirect('utilisateurs')->with(['success' => 'Utilisateur mis à jour avec succès.']);
    }


    public function delete($id)
    {
        $item = User::findOrFail($id);

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'user',
            'message' => " a supprimé un " . ($item->role === 'admin' ? "admin" : ($item->role === 'manager' ? 'manager' : 'utilisateur')) . " avec le nom {$item->name} et L'id " . ($item->id) . ".",
        ]);

        $item->delete();

        return redirect('utilisateurs')->with(['success' => 'Utilisateur supprimé avec succès.']);
    }
}
