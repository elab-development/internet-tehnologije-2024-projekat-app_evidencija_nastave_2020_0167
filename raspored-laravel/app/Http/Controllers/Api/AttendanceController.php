<?php

namespace App\Http\Controllers\Api;

use App\Models\Attendance;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class AttendanceController extends Controller
{
    public function checkIn(Request $request)
        {
            $request->validate([
                'schedule_id' => 'required|exists:schedules,id',
                'date' => 'required|date'
            ]);

            $schedule = Schedule::find($request->schedule_id);
            
            if ($schedule->user_id !== $request->user()->id) {
                return response()->json([
                    'message' => 'You are not enrolled in this class'
                ], 403);
            }

            $requestDate = Carbon::parse($request->date);
            if ($requestDate->format('l') !== $schedule->day_of_week) {
                return response()->json([
                    'message' => 'This class is not scheduled for this day'
                ], 422);
            }

            $attendance = Attendance::updateOrCreate([
                'user_id' => $request->user()->id,
                'schedule_id' => $request->schedule_id,
                'date' => $request->date
            ], [
                'is_present' => true
            ]);

            return response()->json([
                'message' => 'Attendance marked successfully',
                'attendance' => $attendance,
                'class_info' => [
                    'subject' => $schedule->subject->name,
                    'time' => $schedule->start_time . ' - ' . $schedule->end_time,
                    'classroom' => $schedule->classroom
                ]
            ]);
        }

    public function getAllAttendance(Request $request)
    {
        $query = Attendance::with(['user', 'schedule.subject']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('subject_id')) {
            $query->whereHas('schedule', function($q) use ($request) {
                $q->where('subject_id', $request->subject_id);
            });
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $attendances = $query->orderBy('date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'message' => 'All attendance records',
            'data' => $attendances->items(),
            'pagination' => [
                'current_page' => $attendances->currentPage(),
                'total' => $attendances->total()
            ]
        ]);
    }

        public function attendanceStats()
        {
            $stats = [
                'total_attendance' => \App\Models\Attendance::count(),
                'total_present' => \App\Models\Attendance::where('is_present', true)->count(),
                'total_absent' => \App\Models\Attendance::where('is_present', false)->count(),
                'by_user' => \App\Models\Attendance::select('user_id')
                    ->selectRaw('SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) as present_count')
                    ->selectRaw('SUM(CASE WHEN is_present = 0 THEN 1 ELSE 0 END) as absent_count')
                    ->with('user:id,name')
                    ->groupBy('user_id')
                    ->get()
                    ->map(function($item) {
                        return [
                            'user_name' => $item->user->name,
                            'present_count' => $item->present_count,
                            'absent_count' => $item->absent_count
                        ];
                    })
            ];

            return response()->json(['data' => $stats]);
        }

    public function todayClasses(Request $request)
    {
        $user = $request->user();
        $today = now()->format('l'); // 'Friday'
        
        $classes = Schedule::where('user_id', $user->id)
            ->where('day_of_week', $today)
            ->with('subject')  // Proveri da li ovo postoji
            ->get();
        
        return response()->json([
            'classes' => $classes,
            'debug' => [
                'user_id' => $user->id,
                'today' => $today,
                'schedules_count' => $classes->count()
            ]
        ]);
    }
}
