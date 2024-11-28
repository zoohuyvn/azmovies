<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedMovies extends Model {
    use HasFactory;
    protected $guarded = [];
    public $timestamps = false;
    protected $table = 'saved_movies';
    protected $primaryKey = ['user_email', 'slug_movie'];
    protected $keyType = 'string';
    public $incrementing = false;

    public function user() {
        return $this->belongsTo(User::class, 'user_email', 'user');
    }
}