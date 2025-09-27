<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin'),
            'role' => 'admin',
            'student_id' => null,
            'phone' => '060-123-4567'
        ]);

        // studenti
        User::create([
            'name' => 'Marko Petrović',
            'email' => 'marko@student.com',
            'password' => Hash::make('marko123'),
            'role' => 'student',
            'student_id' => '2020/0001',
            'phone' => '065-111-2222'
        ]);

        User::create([
            'name' => 'Ana Jovanović',
            'email' => 'ana@student.com',
            'password' => Hash::make('ana123'),
            'role' => 'student',
            'student_id' => '2019/0123',
            'phone' => '064-333-4444'
        ]);

        User::create([
            'name' => 'Petar Nikolić',
            'email' => 'petar@student.com',
            'password' => Hash::make('petar123'),
            'role' => 'student',
            'student_id' => '2020/0167',
            'phone' => '063-555-6666'
        ]);
    }
}
