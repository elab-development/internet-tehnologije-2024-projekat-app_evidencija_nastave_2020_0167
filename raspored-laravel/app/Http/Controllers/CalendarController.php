<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class CalendarController extends Controller
{
    public function exportSchedule(Request $request)
    {
        $user = $request->user();
        $schedules = Schedule::with('subject')->where('user_id', $user->id)->get();

        $ics = "BEGIN:VCALENDAR\r\n";
        $ics .= "VERSION:2.0\r\n";
        $ics .= "X-WR-CALNAME:Moj Raspored\r\n";

        foreach ($schedules as $schedule) {
            $ics .= "BEGIN:VEVENT\r\n";
            $ics .= "UID:" . $schedule->id . "@raspored.app\r\n";
            $ics .= "SUMMARY:{$schedule->subject->name}\r\n";
            $ics .= "DESCRIPTION:{$schedule->classroom}\r\n";
            $ics .= "RRULE:FREQ=WEEKLY\r\n";
            $ics .= "END:VEVENT\r\n";
        }

        $ics .= "END:VCALENDAR\r\n";

        return response($ics)
            ->header('Content-Type', 'text/calendar')
            ->header('Content-Disposition', 'attachment; filename="raspored.ics"');
    }
}