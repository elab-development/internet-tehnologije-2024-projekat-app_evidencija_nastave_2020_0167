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

    public function myAttendance(Request $request)
    {
        $attendances = $request->user()->attendances()
            ->with(['schedule.subject'])
            ->orderBy('date', 'desc')
            ->get();

        $stats = [
            'total_classes' => $attendances->count(),
            'present_count' => $attendances->where('is_present', true)->count(),
            'absent_count' => $attendances->where('is_present', false)->count(),
        ];

        $stats['attendance_percentage'] = $stats['total_classes'] > 0 
            ? round(($stats['present_count'] / $stats['total_classes']) * 100, 2) 
            : 0;

        return response()->json([
            'message' => 'Your attendance record',
            'statistics' => $stats,
            'attendances' => $attendances
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

    public function attendanceStats(Request $request)
    {
        $subjectStats = Attendance::join('schedules', 'attendances.schedule_id', '=', 'schedules.id')
            ->join('subjects', 'schedules.subject_id', '=', 'subjects.id')
            ->selectRaw('
                subjects.name as subject_name,
                subjects.code as subject_code,
                COUNT(*) as total_records,
                SUM(CASE WHEN attendances.is_present = 1 THEN 1 ELSE 0 END) as present_count,
                ROUND(SUM(CASE WHEN attendances.is_present = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as attendance_percentage
            ')
            ->groupBy('subjects.id', 'subjects.name', 'subjects.code')
            ->get();

        $studentStats = Attendance::join('users', 'attendances.user_id', '=', 'users.id')
            ->selectRaw('
                users.name as student_name,
                users.student_id,
                COUNT(*) as total_classes,
                SUM(CASE WHEN attendances.is_present = 1 THEN 1 ELSE 0 END) as present_count,
                ROUND(SUM(CASE WHEN attendances.is_present = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as attendance_percentage
            ')
            ->where('users.role', 'student')
            ->groupBy('users.id', 'users.name', 'users.student_id')
            ->orderBy('attendance_percentage', 'desc')
            ->get();

        return response()->json([
            'message' => 'Attendance statistics',
            'by_subject' => $subjectStats,
            'by_student' => $studentStats,
            'summary' => [
                'total_subjects' => $subjectStats->count(),
                'total_students' => $studentStats->count(),
                'average_attendance' => round($studentStats->avg('attendance_percentage'), 2)
            ]
        ]);
    }

    public function todayClasses(Request $request)
    {
        $today = Carbon::today();
        $dayName = $today->format('l'); 

        $todaySchedules = $request->user()->schedules()
            ->with('subject')
            ->where('day_of_week', $dayName)
            ->orderBy('start_time')
            ->get();

        $schedulesWithAttendance = $todaySchedules->map(function($schedule) use ($today) {
            $attendance = Attendance::where([
                'user_id' => $schedule->user_id,
                'schedule_id' => $schedule->id,
                'date' => $today->toDateString()
            ])->first();

            return [
                'schedule_id' => $schedule->id,
                'subject' => $schedule->subject->name,
                'subject_code' => $schedule->subject->code,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'classroom' => $schedule->classroom,
                'is_checked_in' => $attendance ? $attendance->is_present : false,
                'attendance_id' => $attendance ? $attendance->id : null
            ];
        });

        return response()->json([
            'message' => 'Today\'s classes',
            'date' => $today->toDateString(),
            'day' => $dayName,
            'classes' => $schedulesWithAttendance,
            'total_classes' => $schedulesWithAttendance->count(),
            'checked_in_count' => $schedulesWithAttendance->where('is_checked_in', true)->count()
        ]);
    }
}
