<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model {
    use HasFactory;
    protected $guarded = [];
    public $timestamps = false;
    protected $table = 'users';

    public function love_movies() {
        return $this->hasMany(LoveMovies::class, 'user_email', 'email');
    }

    public function saved_movies() {
        return $this->hasMany(SavedMovies::class, 'user_email', 'email');
    }

    public function view_histories() {
        return $this->hasMany(ViewHistories::class, 'user_email', 'email');
    }
}