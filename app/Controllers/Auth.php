<?php

namespace App\Controllers;

use App\Models\UserModel;

class Auth extends BaseController
{
    public function loginForm()
    {
        if (session()->has('user_id')) {
            return redirect()->to('/map');
        }

        return view('login');
    }

    public function login()
    {
        $email = (string) $this->request->getPost('email');
        $password = (string) $this->request->getPost('password');

        $model = new UserModel();
        $user = $model->where('email', $email)->first();

        if (! $user || ! isset($user['password_hash']) || ! password_verify($password, (string) $user['password_hash'])) {
            return redirect()->to('/login')->with('error', 'Credenciales inválidas');
        }

        session()->regenerate();
        session()->set('user_id', (int) $user['id']);
        session()->set('user_email', (string) $user['email']);

        return redirect()->to('/map');
    }

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login');
    }
}
