<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model {
    use HasFactory;
    protected $guarded = [];
    public $timestamps = false;
    protected $table = 'comments';
    protected $primaryKey = ['user_email', 'slug_movie', 'content'];
    protected $keyType = 'string';
    public $incrementing = false;

    public function movie() {
        return $this->belongsTo(Movie::class, 'slug_movie', 'slug');
    }
}