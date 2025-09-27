<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

// zasticene rute
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/schedules', [App\Http\Controllers\ScheduleController::class, 'index']);
    Route::get('/schedules/{id}', [App\Http\Controllers\ScheduleController::class, 'show']);
    Route::get('/schedules/day/{day}', [App\Http\Controllers\ScheduleController::class, 'getByDay']);
    
    
    // sdmin
    Route::middleware('role:admin')->get('/admin/dashboard', function () {
        Route::post('/schedules', [App\Http\Controllers\ScheduleController::class, 'store']);
        Route::put('/schedules/{id}', [App\Http\Controllers\ScheduleController::class, 'update']);
        Route::delete('/schedules/{id}', [App\Http\Controllers\ScheduleController::class, 'destroy']);
    
        return response()->json([
            'message' => 'Admin dashboard',
            'users_count' => \App\Models\User::count()
        ]);
    });
    
    // student
    Route::middleware('role:student')->get('/student/schedule', function (Request $request) {
        $schedules = $request->user()->schedules()->with('subject')->get();
        return response()->json([
            'message' => 'Your schedule',
            'schedules' => $schedules
        ]);
    });
    
    // gost + student
    Route::middleware('role:guest,student')->get('/schedule/public', function () {
        $schedules = \App\Models\Schedule::with(['user', 'subject'])->get();
        return response()->json([
            'message' => 'Public schedules',
            'schedules' => $schedules
        ]);
    });
});