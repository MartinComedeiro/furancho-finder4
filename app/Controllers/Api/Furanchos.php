<?php

namespace App\Controllers\Api;

use App\Models\FuranchoModel;
use CodeIgniter\RESTful\ResourceController;

class Furanchos extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new FuranchoModel();
        $furanchos = $model->findAll();

        return $this->respond($furanchos);
    }
}
