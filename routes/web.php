<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\DocumentAccessController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\UserController;
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
})->name('welcome');

Route::middleware(['auth'])->get('/error', function () {
    return inertia::render('NotFound');
})->name('notfound');


// Routes d'un admin
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
        Route::get('add','SitesRender')->name('documents.add');
        Route::post('create','create')->name('documents.create');
        Route::get('edit/{id}','edit');
        Route::post('update', 'update')->name('documents.update');
        Route::get('details/{id}','show');
        Route::delete('delete/{id}', 'delete')->name('document.destroy');
        Route::get('access/{id}', 'recover')->name('access.recover');
        Route::post('accesschange', 'updateAccess')->name('access.update');
    });

    Route::prefix('utilisateurs')->controller(UserController::class)->group(function(){
        Route::get('/','index')->name('utilisateurs');
        Route::inertia('add','Utilisateurs/AddUser')->name('user.add');
        Route::post('create','create')->name('user.create');
        Route::post('update-role','updateRole')->name('users.updateRole');
        Route::post('reset-password/{id}','resetPassword')->name('users.resetPassword');
        Route::get('edit/{id}','edit');
        Route::post('update','update')->name('utilisateurs.update');
        Route::delete('delete/{id}','delete')->name('utilisateurs.destroy');
    });

    Route::prefix('alerts')->controller(AlertController::class)->group(function(){
        Route::get('/','index')->name('alerts');
        Route::post('create','create')->name('alert.create');
    });

});

// Routes d'un simple utilisateur
//Route::middleware(['auth','verified','CheckRole:user'])->group(function () {
//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
//
//    Route::get('/dashboard_user', [SitesController::class, 'map'])->name('dashboard');
//});
//
//// Routes d'un manager (super utilisateur)
//Route::middleware(['auth','verified','CheckRole:manager'])->group(function () {
//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
//
//    Route::get('/dashboard_manager', [SitesController::class, 'map'])->name('dashboard');
//
////    Route::prefix('documents')->controller(DocumentsController::class)->group(function(){
////        Route::get('/','index')->name('documents');
////        Route::inertia('add','Documents/AddDocuments')->name('documents.add');
////        Route::post('create','create')->name('documents.create');
////    });
//
//});

require __DIR__.'/auth.php';
