<?php

namespace App\Controllers\Api;

use App\Models\FavoriteModel;
use CodeIgniter\RESTful\ResourceController;

class Favorites extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        if (! session()->has('user_id')) {
            return $this->failUnauthorized();
        }

        $userId = (int) session()->get('user_id');
        $model = new FavoriteModel();

        $rows = $model->select('furancho_id')->where('user_id', $userId)->findAll();
        $ids = array_map(static fn ($r) => (int) $r['furancho_id'], $rows);

        return $this->respond(['favorites' => $ids]);
    }

    public function create($furanchoId = null)
    {
        if (! session()->has('user_id')) {
            return $this->failUnauthorized();
        }

        $userId = (int) session()->get('user_id');
        $fid = (int) $furanchoId;
        if ($fid <= 0) {
            return $this->failValidationErrors('Invalid furancho id');
        }

        $db = \Config\Database::connect();
        $table = $db->table('favorites');
        $exists = $table->where('user_id', $userId)->where('furancho_id', $fid)->countAllResults();
        if ($exists === 0) {
            $table->insert([
                'user_id'     => $userId,
                'furancho_id' => $fid,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ]);
        }

        return $this->respondCreated(['ok' => true]);
    }

    public function delete($furanchoId = null)
    {
        if (! session()->has('user_id')) {
            return $this->failUnauthorized();
        }

        $userId = (int) session()->get('user_id');
        $fid = (int) $furanchoId;
        if ($fid <= 0) {
            return $this->failValidationErrors('Invalid furancho id');
        }

        $db = \Config\Database::connect();
        $db->table('favorites')->where('user_id', $userId)->where('furancho_id', $fid)->delete();

        return $this->respondDeleted(['ok' => true]);
    }
}
