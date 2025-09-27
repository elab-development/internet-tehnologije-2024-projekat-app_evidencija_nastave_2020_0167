<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {

    //testiranje relacija
    Route::get('/test-relations', function () {

        $user = \App\Models\User::create([
            'name' => 'Test Student',
            'email' => 'test@student.com',
            'password' => bcrypt('test'),
            'role' => 'student',
            'student_id' => 'ST001'
        ]);

        $subject = \App\Models\Subject::create([
            'name' => 'Matematika 1',
            'code' => 'MAT1',
            'credits' => 6,
            'semester' => 1
        ]);

        $schedule = \App\Models\Schedule::create([
            'user_id' => $user->id,
            'subject_id' => $subject->id,
            'day_of_week' => 'Monday',
            'start_time' => '09:00',
            'end_time' => '10:30',
            'classroom' => 'A1'
        ]);

        return response()->json([
            'message' => 'Test data created!',
            'user' => $user->name,
            'subject' => $subject->name,
            'schedule' => $schedule->day_of_week . ' ' . $schedule->start_time,
            'user_schedules_count' => $user->schedules()->count()
        ]);
    });
    
    Route::get('/test', function () {
        return response()->json([
            'message' => 'API is working!',
            'timestamp' => now()
        ]);
    });

    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
});