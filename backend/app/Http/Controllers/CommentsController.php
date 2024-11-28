<?php
namespace App\Http\Controllers;
use App\Models\Comments;
use App\Models\User;
use Illuminate\Http\Request;

class CommentsController extends Controller {
    public function store(Request $request) {
        $validatedData = $request->validate([
            'user_email' => 'string|max:255',
            'slug_movie' => 'string|max:255',
            'content' => 'string|max:255'
        ]);
        $exists = Comments::where('user_email', $validatedData['user_email'])
                            ->where('slug_movie', $validatedData['slug_movie'])
                            ->where('content', $validatedData['content'])
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
                'message' => 'Can\'t comment with same content.'
            ], 400);
        }
        Comments::create($validatedData);
        return response()->json([
            'status' => true,
            'data' => $validatedData
        ]);
    }

    public function destroy(Request $request ,$user_email, $slug_movie, $content) {
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
        $comment = Comments::where('user_email', $user_email)
                                ->where('slug_movie', $slug_movie)
                                ->where('content', $content)
                                ->delete();
        if (!$comment) {
            return response()->json([
                'status' => false,
                'message' => 'Comment not found.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Comment delete successful.'
        ], 200);
    }
}