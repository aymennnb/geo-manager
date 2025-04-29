<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentUpdateRequest;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Alerts;
use App\Models\Documents;
use App\Models\DocumentsAccess;
use App\Models\Sites;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentsController extends Controller
{
    public function index()
    {
        $documents = Documents::select('id', 'title', 'description', 'file_path', 'site_id', 'uploaded_by', 'created_at', 'updated_at')->get();
        $sites = Sites::select('id', 'name')->get();
        $users = User::select('id', 'name')->get();
        return Inertia::render('Documents/IndexDocuments', [
            'documents' => $documents,
            'sites' => $sites,
            'users' => $users,
        ]);
    }


    public function SitesRender()
    {
        $sites = Sites::select('id', 'name')->get();

        return inertia('Documents/AddDocuments', [
            'sites' => $sites
        ]);
    }

    public function create(StoreDocumentRequest $request)
    {
        $validated = $request->validated();
        $document = new Documents($validated);
        $document->title = $request->title;
        $document->description = $request->description;
        $document->site_id = $request->site_id;
        $document->uploaded_by = $request->uploaded_by;

        $filePath = $request->file('file_path')->store('documents', 'public');
        $document->file_path = $filePath;

        $document->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'document',
            'message' => " a ajouté un document avec le titre {$document->title} et l'ID {$document->id}.",
        ]);

    return response()->json([
        'message' => 'Document créé et alerte envoyée avec succès.',
        'id' => $document->id
    ]);
    }

    public function edit($id)
    {
        $document = Documents::findOrFail($id);
        $sites = Sites::select('id', 'name')->get();
        return inertia('Documents/EditDocuments', [
            'document' => $document,
            'sites' => $sites
        ]);
    }

    public function update(DocumentUpdateRequest $request)
    {
        $item = Documents::findOrFail($request->id);

        if (!$item) {
            return redirect('documents')->with(['error' => 'Document non trouvé.']);
        }

        $item->title = $request->title;
        $item->description = $request->description;
        $item->site_id = $request->site_id;
        $item->uploaded_by = $request->uploaded_by;

        if ($request->hasFile('file_path')) {
            if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }

            $filePath = $request->file('file_path')->store('documents', 'public');
            $item->file_path = $filePath;
        }

        $item->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'document',
            'message' => " a modifié un document avec le titre {$item->title} et l'ID {$item->id} .",
        ]);

        return redirect('documents')->with(['success' => 'Document mis à jour avec succès.']);
    }

    public  function show($id)
    {
        $document = Documents::where('id',$id)->first();
        $sites = Sites::select('id', 'name')->get();
        $users = User::select('id', 'name')->get();

        return inertia('Documents/DetailsDocument',[
            'document'=>$document,
            'sites'=>$sites,
            'users'=>$users
        ]);
    }

    public function delete($id)
    {
        $item = Documents::where('id',$id)->first();
        $documentTitle = $item->title;
        if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
            Storage::disk('public')->delete($item->file_path);
        }

        $item->delete();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'document',
            'message' => " a supprimé un document avec le titre {$documentTitle} et l'ID {$item->id}.",
        ]);

        return redirect()->route('documents')->with(['success' => 'Document supprimé avec succès.']);
    }

    public function recover($id)
    {
        $users = User::select('id', 'name')->get();
        $documentAccesses = DocumentsAccess::where('document_id', $id)->pluck('user_id')->toArray();
        return Inertia::render('Documents/DocumentAcces', [
            'documentId' => $id,
            'users' => $users,
            'documentAccesses' => $documentAccesses
        ]);
    }


    public function updateAccess(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:documents,id',
            'users' => 'required|array|min:1',
            'users.*' => 'exists:users,id'
        ]);

        $documentId = $request->document_id;
        $document = Documents::find($documentId);

        $existingAccess = DocumentsAccess::where('document_id', $documentId)->pluck('user_id')->toArray();

        $usersToAdd = array_diff($request->users, $existingAccess);
        $usersToRemove = array_diff($existingAccess, $request->users);

        DocumentsAccess::where('document_id', $documentId)->delete();

        foreach ($request->users as $userId) {
            DocumentsAccess::create([
                'document_id' => $documentId,
                'user_id' => $userId
            ]);
        }

        foreach ($usersToAdd as $userId) {
            $user = User::find($userId);
            Alerts::create([
                'user_id' => auth()->user()->id,
                'role' => auth()->user()->role,
                'action' => 'update',
                'type' => 'document',
                'message' => "a limité l'accès au document {$document->title} avec L'ID {$documentId} à l'utilisateur qui a l'id {$user->id}."
            ]);
        }

        foreach ($usersToRemove as $userId) {
            $user = User::find($userId);
            Alerts::create([
                'user_id' => auth()->user()->id,
                'role' => auth()->user()->role,
                'action' => 'update',
                'type' => 'document',
                'message' => "a retiré l'accès au document {$document->title} avec l'id {$documentId} à l'utilisateur {$user->name} qui a l'id {$user->id}."
            ]);
        }

        // Message global de succès
        return redirect()->route('documents')->with('success', 'Les accès ont été mis à jour.');
    }
}
