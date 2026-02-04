<?php

namespace App\Models;

use CodeIgniter\Model;

class FuranchoModel extends Model
{
    protected $table = 'furanchos';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;
    protected $returnType = 'array';

    protected $allowedFields = [
        'name',
        'description',
        'address',
        'lat',
        'lng',
        'image_url',
        'is_open',
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
