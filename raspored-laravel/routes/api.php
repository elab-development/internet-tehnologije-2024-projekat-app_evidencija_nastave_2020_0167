<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\Api\AttendanceController; 
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SubjectController;

// test rute
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now()
    ]);
});

Route::get('/test-seeders', function () {
    $users = \App\Models\User::all();
    $subjects = \App\Models\Subject::all();
    
    return response()->json([
        'message' => 'Seeders working!',
        'users_count' => $users->count(),
        'subjects_count' => $subjects->count()
    ]);
});

// javne rute
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/reset-request', [AuthController::class, 'requestPasswordReset']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

// zasticene rute
//STUDENT
Route::middleware(['auth:sanctum', 'role:student'])->prefix('student')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/password/change', [AuthController::class, 'changePassword']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);
    Route::delete('/profile/image', [ProfileController::class, 'deleteImage']);

    Route::get('/calendar-export', [CalendarController::class, 'exportSchedule']);


    Route::get('/schedule', function (Request $request) {
        $schedules = $request->user()->schedules()->with('subject')->get();
        return response()->json([
            'message' => 'Your schedule',
            'schedules' => $schedules
        ]);
    });

    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::get('/attendance/my-attendance', [AttendanceController::class, 'myAttendance']);
    Route::get('/attendance/today-classes', [AttendanceController::class, 'todayClasses']);
});


//ADMIN
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/password/change', [AuthController::class, 'changePassword']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);
    Route::delete('/profile/image', [ProfileController::class, 'deleteImage']);

    
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Admin dashboard',
            'users_count' => \App\Models\User::count()
        ]);
    });

    Route::post('/schedules', [App\Http\Controllers\ScheduleController::class, 'store']);
    Route::put('/schedules/{id}', [App\Http\Controllers\ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [App\Http\Controllers\ScheduleController::class, 'destroy']);

    Route::get('/attendance/all', [AttendanceController::class, 'getAllAttendance']);
    Route::get('/attendance/stats', [AttendanceController::class, 'attendanceStats']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users-stats', [UserController::class, 'stats']);

    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::get('/subjects/{id}', [SubjectController::class, 'show']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
    Route::get('/subjects-by-semester', [SubjectController::class, 'bySemester']);
});



Route::get('/test-attendance', function () {
    $schedules = \App\Models\Schedule::with(['user', 'subject'])->take(5)->get();
    $attendances = [];
    
    foreach ($schedules as $schedule) {
        for ($i = 0; $i < 3; $i++) {
            $date = \Carbon\Carbon::now()->subWeeks($i)->startOfWeek();
            
            $classDays = [
                'Monday' => 1, 'Tuesday' => 2, 'Wednesday' => 3, 
                'Thursday' => 4, 'Friday' => 5, 'Saturday' => 6, 'Sunday' => 0
            ];
            
            $classDate = $date->copy()->addDays($classDays[$schedule->day_of_week]);
            
            $attendance = \App\Models\Attendance::create([
                'user_id' => $schedule->user_id,
                'schedule_id' => $schedule->id,
                'date' => $classDate->toDateString(),
                'is_present' => rand(0, 10) > 2 
            ]);
            
            $attendances[] = $attendance;
        }
    }
    
    return response()->json([
        'message' => 'Test attendance data created',
        'attendance_records' => count($attendances),
        'sample_data' => $attendances
    ]);
});