<?php

namespace App\Controllers;

class Map extends BaseController
{
    public function index()
    {
        if (! session()->has('user_id')) {
            return redirect()->to('/login');
        }

        return view('map');
    }
}
