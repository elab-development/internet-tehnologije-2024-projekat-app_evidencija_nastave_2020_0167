<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    //lista svih rasporeda
    public function index(Request $request)
    {
        $query = Schedule::with(['user', 'subject']);

        //filtriranje
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('day_of_week')) {
            $query->where('day_of_week', $request->day_of_week);
        }

        if ($request->has('classroom')) {
            $query->where('classroom', 'like', '%' . $request->classroom . '%');
        }


        $sortBy = $request->get('sort_by', 'day_of_week');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);


        //paginacija
        $perPage = $request->get('per_page', 10);
        $schedules = $query->paginate($perPage);

        return response()->json([
            'message' => 'Schedules retrieved successfully',
            'data' => $schedules->items(),
            'pagination' => [
                'current_page' => $schedules->currentPage(),
                'last_page' => $schedules->lastPage(),
                'per_page' => $schedules->perPage(),
                'total' => $schedules->total()
            ],
            'filters_applied' => $request->only(['user_id', 'subject_id', 'day_of_week', 'classroom'])
        ]);
    }

    //create
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'classroom' => 'required|string|max:50'
        ]);

        $conflict = Schedule::where('user_id', $request->user_id)
            ->where('day_of_week', $request->day_of_week)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Schedule conflict detected',
                'error' => 'Student already has a class at this time'
            ], 422);
        }

        $schedule = Schedule::create($request->all());
        $schedule->load(['user', 'subject']);

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $schedule
        ], 201);
    }

    //read
    public function show($id)
    {
        $schedule = Schedule::with(['user', 'subject', 'attendances'])->find($id);

        if (!$schedule) {
            return response()->json([
                'message' => 'Schedule not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Schedule retrieved successfully',
            'data' => $schedule
        ]);
    }

    //update
    public function update(Request $request, $id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'message' => 'Schedule not found'
            ], 404);
        }

        $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'day_of_week' => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'classroom' => 'sometimes|string|max:50'
        ]);

        $schedule->update($request->all());
        $schedule->load(['user', 'subject']);

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $schedule
        ]);
    }

    //delete
    public function destroy($id)
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            return response()->json([
                'message' => 'Schedule not found'
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully'
        ]);
    }

    //raspored po danu
    public function getByDay($day)
    {
        $validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        if (!in_array($day, $validDays)) {
            return response()->json([
                'message' => 'Invalid day of week'
            ], 400);
        }

        $schedules = Schedule::with(['user', 'subject'])
            ->where('day_of_week', $day)
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'message' => 'Schedules for ' . $day,
            'day' => $day,
            'data' => $schedules,
            'count' => $schedules->count()
        ]);
    }
}