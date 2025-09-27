<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        Subject::create([
            'name' => 'Matematika 1',
            'code' => 'MAT1',
            'credits' => 6,
            'semester' => 1
        ]);

        Subject::create([
            'name' => 'Programiranje 1',
            'code' => 'PRO1',
            'credits' => 5,
            'semester' => 2
        ]);

        Subject::create([
            'name' => 'Internet tehnologije',
            'code' => 'ITEH',
            'credits' => 6,
            'semester' => 7
        ]);

        Subject::create([
            'name' => 'Baze podataka',
            'code' => 'BP',
            'credits' => 6,
            'semester' => 5
        ]);

        Subject::create([
            'name' => 'Engleski jezik 1',
            'code' => 'ENG1',
            'credits' => 3,
            'semester' => 1
        ]);
    }
}
