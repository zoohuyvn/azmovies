<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Models\ViewHistories;
use Illuminate\Http\Request;

class ViewHistoriesController extends Controller {
    public function store(Request $request) {
        $validatedData = $request->validate([
            'user_email' => 'string|max:255',
            'slug_movie' => 'string|max:255',
            'progress' => 'integer'
        ]);
        $datetime = date('Y-m-d h:i:s', time());
        $exists = ViewHistories::where('user_email', $validatedData['user_email'])
                                ->where('slug_movie', $validatedData['slug_movie'])
                                ->exists();
        $user = User::where('email', $validatedData['user_email'])->first();
        if(count($request->toArray()) < 4) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        } else if (($user && count($request->toArray()) == 4) &&  (strlen($request->toArray()['token']) != 16 || strcmp($user['token'], $request->toArray()['token']) != 0)) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'You already view this movie.'
            ], 400);
        }
        ViewHistories::create(array_merge($validatedData, ['datetime' => $datetime]));
        return response()->json([
            'status' => true,
            'data' => $validatedData
        ]);
    }

    public function update(Request $request, $user_email, $slug_movie) {
        $validatedData = $request->validate([
            'progress' => 'integer',
        ]);
        $user = User::where('email', $user_email)->first();
        if(count($request->toArray()) < 2) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        } else if (($user && count($request->toArray()) == 2) &&  (strlen($request->toArray()['token']) != 16 || strcmp($user['token'], $request->toArray()['token']) != 0)) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }
        $viewHistory = ViewHistories::where('user_email', $user_email)
                                    ->where('slug_movie', $slug_movie)
                                    ->first();
        if (!$viewHistory) {
            return response()->json([
                'status' => false,
                'message' => 'View history not found.',
            ], 404);
        }
        $viewHistory->update($validatedData);
        return response()->json([
            'status' => true,
            'message' => 'View history updated successful.',
            'data' => $viewHistory,
        ], 200);
    }

    public function destroy(Request $request ,$user_email, $slug_movie) {   
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
        $viewHistory = ViewHistories::where('user_email', $user_email)
                                    ->where('slug_movie', $slug_movie)
                                    ->delete();
        if (!$viewHistory) {
            return response()->json([
                'status' => false,
                'message' => 'View history not found.'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'message' => 'Movie removed from view list.'
        ], 200);
    }
}