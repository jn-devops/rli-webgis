<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('dashboard');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');


Route::get('view-map/{map?}/{sku?}', App\Http\Controllers\MapController::class)->name('view-map');
Route::get('update-status/{property_code}', [App\Http\Controllers\MapActionsController::class, 'updateStatus']);