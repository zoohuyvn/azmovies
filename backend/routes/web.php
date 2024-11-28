<?php
use App\Http\Controllers\CommentsController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoveMoviesController;
use App\Http\Controllers\SavedMoviesController;
use App\Http\Controllers\ViewHistoriesController;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::resource('movies', MovieController::class);
Route::delete('/movies/{slug}', [MovieController::class, 'destroy']);
Route::resource('users', UserController::class);
Route::resource('love_movies', LoveMoviesController::class);
Route::delete('/love_movies/{user_email}/{slug_movie}', [LoveMoviesController::class, 'destroy']);
Route::resource('saved_movies', SavedMoviesController::class);
Route::delete('/saved_movies/{user_email}/{slug_movie}', [SavedMoviesController::class, 'destroy']);
Route::resource('view_histories', ViewHistoriesController::class);
Route::delete('/view_histories/{user_email}/{slug_movie}', [ViewHistoriesController::class, 'destroy']);
Route::put('/view_histories/{user_email}/{slug_movie}', [ViewHistoriesController::class, 'update']);
Route::resource('comments', CommentsController::class);
Route::delete('/comments/{user_email}/{slug_movie}/{content}', [CommentsController::class, 'destroy']);
Route::get('/csrf-token', function () {
    $csrfToken = csrf_token();
    return response()->json([
        'csrf_token' => $csrfToken
    ])->header('X-CSRF-TOKEN', $csrfToken);
});