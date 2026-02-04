<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $table = $this->db->table('users');

        $exists = $table->where('email', 'admin@furanchofinder.local')->countAllResults();
        if ($exists > 0) {
            return;
        }

        $table->insert([
            'email'         => 'admin@furanchofinder.local',
            'password_hash' => password_hash('admin123', PASSWORD_DEFAULT),
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);
    }
}
