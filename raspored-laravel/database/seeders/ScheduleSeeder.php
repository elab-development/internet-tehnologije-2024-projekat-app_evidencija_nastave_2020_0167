<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Subject;

class ScheduleSeeder extends Seeder
{
    public function run()
    {
        //uzmi studente
        $students = User::where('role', 'student')->get();
        $subjects = Subject::all();

        //Markov raspored
        $marko = User::where('email', 'marko@student.com')->first();
        
        Schedule::create([
            'user_id' => $marko->id,
            'subject_id' => Subject::where('code', 'MAT1')->first()->id,
            'day_of_week' => 'Monday',
            'start_time' => '08:00',
            'end_time' => '09:30',
            'classroom' => 'A101'
        ]);

        Schedule::create([
            'user_id' => $marko->id,
            'subject_id' => Subject::where('code', 'PRO1')->first()->id,
            'day_of_week' => 'Tuesday',
            'start_time' => '10:00',
            'end_time' => '11:30',
            'classroom' => 'B202'
        ]);

        //Anin raspored
        $ana = User::where('email', 'ana@student.com')->first();
        
        Schedule::create([
            'user_id' => $ana->id,
            'subject_id' => Subject::where('code', 'ENG1')->first()->id,
            'day_of_week' => 'Wednesday',
            'start_time' => '09:00',
            'end_time' => '10:30',
            'classroom' => 'C301'
        ]);

        Schedule::create([
            'user_id' => $ana->id,
            'subject_id' => Subject::where('code', 'BP')->first()->id,
            'day_of_week' => 'Thursday',
            'start_time' => '11:00',
            'end_time' => '12:30',
            'classroom' => 'D102'
        ]);
    }
}