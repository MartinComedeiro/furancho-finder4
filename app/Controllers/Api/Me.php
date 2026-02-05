<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class Me extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        if (! session()->has('user_id')) {
            return $this->respond(['logged_in' => false], 200);
        }

        return $this->respond([
            'logged_in' => true,
            'user_id'   => (int) session()->get('user_id'),
            'email'     => (string) session()->get('user_email'),
        ]);
    }
}
