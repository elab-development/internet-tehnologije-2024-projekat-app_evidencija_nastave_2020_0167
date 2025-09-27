<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Holiday;

class HolidaySeeder extends Seeder
{
    public function run()
    {
        Holiday::create([
            'name' => 'Nova godina',
            'date' => '2025-01-01',
            'description' => 'Državni praznik'
        ]);

        Holiday::create([
            'name' => 'Božić',
            'date' => '2025-01-07',
            'description' => 'Državni praznik'
        ]);

        Holiday::create([
            'name' => 'Dan državnosti',
            'date' => '2025-02-15',
            'description' => 'Državni praznik'
        ]);

        Holiday::create([
            'name' => 'Veliki petak',
            'date' => '2025-04-18',
            'description' => 'Verski praznik'
        ]);

        Holiday::create([
            'name' => 'Uskrs',
            'date' => '2025-04-20',
            'description' => 'Verski praznik'
        ]);

        Holiday::create([
            'name' => 'Praznik rada',
            'date' => '2025-05-01',
            'description' => 'Državni praznik'
        ]);
    }
}
