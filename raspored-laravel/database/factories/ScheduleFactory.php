<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition()
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $startHours = ['08:00', '10:00', '12:00', '14:00', '16:00'];
        
        $startTime = $this->faker->randomElement($startHours);
        $endTime = date('H:i', strtotime($startTime . ' +2 hours'));

        return [
            'user_id' => User::where('role', 'student')->inRandomOrder()->first()->id,
            'subject_id' => Subject::inRandomOrder()->first()->id,
            'day_of_week' => $this->faker->randomElement($days),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'classroom' => 'Sala ' . $this->faker->numberBetween(101, 505),
        ];
    }
}