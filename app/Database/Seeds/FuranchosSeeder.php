<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class FuranchosSeeder extends Seeder
{
    public function run()
    {
        $table = $this->db->table('furanchos');

        if ($table->countAllResults() > 0) {
            return;
        }

        $now = date('Y-m-d H:i:s');

        $table->insertBatch([
            [
                'name'        => 'Furancho Pouca Cousa',
                'description' => 'Vinos da casa e petiscos tradicionais.',
                'address'     => 'Centro',
                'lat'         => 42.2405990,
                'lng'         => -8.7207270,
                'image_url'   => 'https://picsum.photos/seed/furancho1/300/200',
                'is_open'     => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Furancho A Lareira',
                'description' => 'Empanada, tortilla e viño tinto.',
                'address'     => 'Barrio',
                'lat'         => 42.2361000,
                'lng'         => -8.7149000,
                'image_url'   => 'https://picsum.photos/seed/furancho2/300/200',
                'is_open'     => 0,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Furancho O Recuncho',
                'description' => 'Chourizo ao viño e queixo.',
                'address'     => 'Zona vella',
                'lat'         => 42.2450000,
                'lng'         => -8.7160000,
                'image_url'   => 'https://picsum.photos/seed/furancho3/300/200',
                'is_open'     => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ]);
    }
}
