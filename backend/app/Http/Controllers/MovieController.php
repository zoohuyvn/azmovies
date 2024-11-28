<?php
namespace App\Http\Controllers;
use App\Models\LoveMovies;
use Illuminate\Http\Request;
use App\Models\Movie;
use App\Models\SavedMovies;
use App\Models\User;
use App\Models\ViewHistories;

class MovieController extends Controller {
    public function index() {
        $movies = Movie::with(['comments' => function($query) {
            $query->orderBy('datetime', 'desc');
        }])->get();
        return response()->json([
            'status' => true,
            'data' => $movies
        ], 200);
    }

    public function show($slug) {
        $movie = Movie::with(['comments' => function($query) {
            $query->orderBy('datetime', 'desc');
        }])->where('slug', $slug)->first();
        if (!$movie) {
            return response()->json([
                'status' => false,
                'message' => 'Movie not found.'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $movie
        ], 200);
    }

    public function update(Request $request, $slug) {
        $movie = Movie::where('slug', $slug)->firstOrFail();
        if (!$movie) {
            return response()->json([
                'success' => false,
                'message' => 'Movie not found.',
            ], 404);
        }
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'duration' => 'integer',
            'released' => 'string|max:50',
            'genre' => 'string|max:50',
            'country' => 'string|max:50',
            'thumbnail' => 'string|max:255',
            'url' => 'string|max:255',
            'rating' => 'numeric|between:0,5'
        ]);
        $admin1 = User::where('email', 'nnd0302@gmail.com')->first();
        $admin2 = User::where('email', 'zoohuy123@gmail.com')->first();
        $dk =   ($admin1 && $admin2 && count($request->toArray()) == 10) &&  
                (
                    strlen($request->toArray()['token']) != 16 ||
                    (
                        strcmp($admin1['token'], $request->toArray()['token']) != 0 && 
                        strcmp($admin2['token'], $request->toArray()['token']) != 0
                    )
                );
        if(count($request->toArray()) < 10) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        }
        else if ($dk) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        Movie::where('slug', $slug)->update($validated);
        return response()->json([
            'status' => true,
            'data' => array_merge([
                'slug' => $slug
            ], $validated)
        ], 200);
    }

    public function store(Request $request) {      
        $validated = $request->validate([
            'slug' => 'string|max:255',
            'title' => 'string|max:255',
            'description' => 'string',
            'duration' => 'integer',
            'released' => 'string|max:50',
            'genre' => 'string|max:50',
            'country' => 'string|max:50',
            'thumbnail' => 'string|max:255',
            'url' => 'string|max:255',
            'rating' => 'numeric|between:0,5'
        ]);
        $admin1 = User::where('email', 'nnd0302@gmail.com')->first();
        $admin2 = User::where('email', 'zoohuy123@gmail.com')->first();
        $dk =   ($admin1 && $admin2 && count($request->toArray()) == 11) &&  
                (
                    strlen($request->toArray()['token']) != 16 ||
                    (
                        strcmp($admin1['token'], $request->toArray()['token']) != 0 && 
                        strcmp($admin2['token'], $request->toArray()['token']) != 0
                    )
                );
        if(count($request->toArray()) < 11) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        }
        else if ($dk) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        $slug = Movie::where('slug', $validated['slug'])->first();
        if ($slug) {
            return response()->json([
                'status' => false,
                'message' => 'Movie already exist.'
            ], 404);
        }
        $movie = Movie::create([
            'slug' => $validated['slug'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'duration' => $validated['duration'],
            'released' => $validated['released'],
            'genre' => $validated['genre'],
            'country' => $validated['country'],
            'thumbnail' => $validated['thumbnail'],
            'url' => $validated['url'],
            'rating' => $validated['rating']
        ]);
        return response()->json([
            'status' => 'success',
            'data' => $movie
        ], 201);
    }
    
    public function destroy(Request $request, $slug) {   
        $admin1 = User::where('email', 'nnd0302@gmail.com')->first();
        $admin2 = User::where('email', 'zoohuy123@gmail.com')->first();
        $dk =   ($admin1 && $admin2 && count($request->toArray()) == 1) &&  
                (
                    strlen($request->toArray()['token']) != 16 ||
                    (
                        strcmp($admin1['token'], $request->toArray()['token']) != 0 && 
                        strcmp($admin2['token'], $request->toArray()['token']) != 0
                    )
                );
        if(count($request->toArray()) < 1) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        }
        else if ($dk) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        $movie = Movie::where('slug', $slug)->firstOrFail();
        $movie->love_movies()->delete();
        $movie->saved_movies()->delete();
        $movie->view_histories()->delete();
        $movie->comments()->delete();
        $movie->delete();
        if ($movie) {
            return response()->json([
                'status' => true,
                'message' => 'Movie deleted successfully.'
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Movie not found.'
            ], 404);
        }
    }
}