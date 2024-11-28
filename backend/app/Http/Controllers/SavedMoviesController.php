<?php
namespace App\Http\Controllers;
use App\Models\SavedMovies;
use App\Models\User;
use Illuminate\Http\Request;

class SavedMoviesController extends Controller {
    public function store(Request $request) {
        $validatedData = $request->validate([
            'user_email' => 'string|max:255',
            'slug_movie' => 'string|max:255',
        ]);
        $exists = SavedMovies::where('user_email', $validatedData['user_email'])
                            ->where('slug_movie', $validatedData['slug_movie'])
                            ->exists();
        $user = User::where('email', $validatedData['user_email'])->first();
        if(count($request->toArray()) < 3) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        } else if (($user && count($request->toArray()) == 3) &&  (strlen($request->toArray()['token']) != 16 || strcmp($user['token'], $request->toArray()['token']) != 0)) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'You already saved this movie.'
            ], 400);
        }
        SavedMovies::create($validatedData);
        return response()->json([
            'status' => true,
            'data' => $validatedData
        ]);
    }

    public function destroy(Request $request ,$user_email, $slug_movie) {
        $savedMovie = SavedMovies::where('user_email', $user_email)
                                ->where('slug_movie', $slug_movie)
                                ->delete();
        $user = User::where('email', $user_email)->first();
        if(count($request->toArray()) < 1) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        } else if (($user && count($request->toArray()) == 1) &&  (strlen($request->toArray()['token']) != 16 || strcmp($user['token'], $request->toArray()['token']) != 0)) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        if (!$savedMovie) {
            return response()->json([
                'status' => false,
                'message' => 'Saved movie not found.'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'Movie removed from saved list.'
        ], 200);
    }
}