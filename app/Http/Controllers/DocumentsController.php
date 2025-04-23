<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentUpdateRequest;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Documents;
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
            'users' => $users
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

        return redirect()->route('documents')->with(['success' => 'Document ajouté avec succès.']);
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
        $item = Documents::find($request->id);

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

        return redirect('documents')->with(['success' => 'Document mis à jour avec succès.']);
    }

    public  function show()
    {
        //
    }

    public function delete($id)
    {
        $item = Documents::where('id',$id)->first();

        if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
            Storage::disk('public')->delete($item->file_path);
        }

        $item->delete();

        return redirect()->route('documents')->with(['success' => 'Document supprimé avec succès.']);
    }
}
