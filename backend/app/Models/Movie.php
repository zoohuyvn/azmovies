<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model {
    use HasFactory;
    protected $guarded = [];
    public $timestamps = false;
    protected $table = 'movies';
    protected $primaryKey = 'slug';
    protected $keyType = 'string';
    public $incrementing = false;

    public function comments() {
        return $this->hasMany(Comments::class, 'slug_movie', 'slug');
    }

    public function love_movies() {
        return $this->hasMany(LoveMovies::class, 'slug_movie', 'slug');
    }

    public function saved_movies() {
        return $this->hasMany(SavedMovies::class, 'slug_movie', 'slug');
    }

    public function view_histories() {
        return $this->hasMany(ViewHistories::class, 'slug_movie', 'slug');
    }
}