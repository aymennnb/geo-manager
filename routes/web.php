<?php

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('sites')->controller(SitesController::class)->group(function(){
        Route::get('/','index')->name('sites');
        Route::inertia('add','Sites/AddSite')->name('sites.add');
        Route::post('create','create')->name('sites.create');
        Route::get('edit/{id}','edit');
        Route::post('update', 'update')->name('sites.update');
        Route::get('details/{id}','show');
        Route::delete('delete/{id}','delete');
    });
});

require __DIR__.'/auth.php';
