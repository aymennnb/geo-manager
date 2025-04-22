<?php

use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'CheckRole:admin'])->get('/admin-only', function () {
    return 'Bienvenue, ADMIN !';
});
Route::middleware(['auth', 'CheckRole:user'])->get('/user-only', function () {
    return 'Bienvenue, USER !';
});

Route::middleware(['auth','verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [SitesController::class, 'map'])->name('dashboard');

    Route::prefix('sites')->controller(SitesController::class)->group(function(){
        Route::get('/','index')->name('sites');
        Route::inertia('add','Sites/AddSite')->name('sites.add');
        Route::post('create','create')->name('sites.create');
        Route::get('edit/{id}','edit');
        Route::post('update', 'update')->name('sites.update');
        Route::get('details/{id}','show');
        Route::delete('delete/{id}','delete');
    });

    Route::prefix('documents')->controller(DocumentsController::class)->group(function(){
        Route::get('/','index')->name('documents');
        Route::inertia('add','Documents/AddDocuments')->name('documents.add');
        Route::post('create','create')->name('documents.create');
    });

});

require __DIR__.'/auth.php';
