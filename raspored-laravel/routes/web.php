<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    
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