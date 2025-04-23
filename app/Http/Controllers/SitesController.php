<?php

namespace App\Http\Controllers;

use App\Http\Requests\SitesRequest;
use App\Http\Requests\SiteUpdateRequest;
use App\Models\Documents;
use App\Models\Sites;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SitesController extends Controller
{
    public function index(Request $request)
    {
        $query = Sites::select('id','image','name','email','phone','web','address','latitude','longitude');
        $addresses = Sites::select('address')->distinct()->get();

        if (request()->has('name')){
            $query->where('name','like','%'.$request->name .'%');
        }
        if (request()->has('address')){
            $query->where('address','like','%'.$request->address .'%');
        }
        $sites = $query->paginate(5);

        return inertia('Sites/IndexSites',[
            'sites'=> $sites,
            'addresses'=>$addresses
        ]);
    }
    public function create(SitesRequest $request)
    {
        $validated = $request->validated();
        $sites = new Sites($validated);
        $sites->name = $request->name;
        $sites->web = $request->web;
        $sites->email = $request->email;
        $sites->phone = $request->phone;
        $sites->address = $request->address;
        $sites->latitude = $request->latitude;
        $sites->longitude = $request->longitude;
        $imagePath = $request->file('image')->store('sitesImages', 'public');
        $sites->image = $imagePath;
        $sites->save();

        return redirect('sites')->with(['success'=>'Sites created successfully']);
    }

    public function edit($id)
    {
        $site = Sites::findOrFail($id);

        return inertia('Sites/EditSite',compact('site'));
    }

    public function update(SiteUpdateRequest $request)
    {
        $item = Sites::where('id',$request->id)->first();
        $item->name = $request->name;
        $item->web = $request->web;
        $item->email = $request->email;
        $item->phone = $request->phone;
        $item->address = $request->address;
        $item->latitude = $request->latitude;
        $item->longitude = $request->longitude;

        if ($request->hasFile('image')) {
            if ($item->file && Storage::disk('public')->exists($item->file)) {
                Storage::disk('public')->delete($item->file);
            }

            $imagePath = $request->file('image')->store('sitesImages', 'public');
            $item->file = $imagePath;
        }

        $item->save();
        return redirect('sites')->with(['success' => 'Site updated successfully.']);
    }

    public function show($id)
    {
        $site = Sites::where('id',$id)->first();
        $documents = Documents::all();

        return inertia('Sites/Details',[
            'site'=> $site,
            'documents'=>$documents
        ]);
    }

    public function delete($id)
    {
        $item = Sites::where('id',$id)->first();

        if (!$item) {
            return redirect('sites')->with(['error' => 'Site not found.']);
        }

        if ($item->image && Storage::disk('public')->exists($item->image)) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        return redirect('sites')->with(['success' => 'Site deleted successfully.']);
    }
    public function map()
    {
        $sitesMaps = Sites::select('id', 'name', 'latitude', 'longitude')->get();

        return Inertia::render('Dashboard', [
            'sitesMaps' => $sitesMaps
        ]);
    }
}
