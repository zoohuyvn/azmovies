<?php
namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller {
    public function index() {
        $users = User::with([
            'love_movies' => function($query) {$query;},
            'saved_movies' => function($query) {$query;},
            'view_histories' => function($query) {$query;}
        ])->get();
        return response()->json([
            'status' => true,
            'data' => $users
        ], 200);
    }

    public function update(Request $request, $email) {
        $user = User::where('email', $email)->firstOrFail();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found.'
            ], 404);
        }
        $validatedData = $request->validate([
            'first_name' => 'string|max:50',
            'last_name'  => 'string|max:50',
            'password'   => 'string'
        ]);
        if(count($request->toArray()) < 5) {
            return response()->json([
                'status' => false,
                'message' => 'Please provided token.'
            ], 400);
        } else if (($user && count($request->toArray()) == 5) &&  (strlen($request->toArray()['token']) != 16 || strcmp($user['token'], $request->toArray()['token']) != 0)) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalid.'  
            ], 400);
        }    
        if (!Hash::check($request->toArray()['old_password'], $user['password'])) {
            return response()->json([
                'status' => false,
                'message' => 'Wrong password.'  
            ], 400);
        }
        if (isset($validatedData['password'])) {
            $validatedData['password'] = bcrypt($validatedData['password']);
        }
        User::where('email', $email)->update($validatedData);
        return response()->json([
            'status' => true,
            'data' => array_merge([
                'email' => $email
            ], $validatedData)
        ], 200);
    }

    public function show($email) {
        $user = User::with([
            'love_movies' => function($query) {$query;},
            'saved_movies' => function($query) {$query;},
            'view_histories' => function($query) {$query;}
        ])->where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found.'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ], 200);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'string|max:255',
            'password' => 'string'
        ]);
        if(count($validated) == 2) {
            $user = User::where('email', $validated['email'])->first();
            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Wrong email or password.'
                ], 401);
            }
            $token = Str::random(16);
            $user->where('email', $validated['email'])->update(['token' => $token]);
            return response()->json([
                'status' => 'true',
                'data' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'token' => $token,
                ]
            ], 200);
        } else if (count($validated) == 4) {
            $userOld = User::where('email', $request['email'])->first();
            if ($userOld) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email has been registered.'
                ], 404);
            }
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'token' => Str::random(16),
                'role' => 0,
            ]);
            return response()->json([
                'status' => 'success',
                'data' => $user
            ], 201);
        }
    }
}