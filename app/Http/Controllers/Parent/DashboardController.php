<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Fee;
use App\Models\Exam;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getStudent()
    {
        return auth()->user()->student;
    }

    public function dashboard()
    {
        $student = $this->getStudent();

        if (!$student) {
            return Inertia::render('Parent/NoStudent');
        }

        $totalFees    = Fee::where('student_id', $student->id)->sum('amount');
        $paidFees     = Fee::where('student_id', $student->id)->sum('paid_amount');
        $pendingFees  = Fee::where('student_id', $student->id)->sum('remaining');
        $totalPresent = Attendance::where('student_id', $student->id)->where('status', 'present')->count();
        $totalAbsent  = Attendance::where('student_id', $student->id)->where('status', 'absent')->count();
        $totalDays    = Attendance::where('student_id', $student->id)->count();
        $attendance   = $totalDays > 0 ? round(($totalPresent / $totalDays) * 100) : 0;

        $recentAttendance = Attendance::where('student_id', $student->id)
            ->latest('date')->take(7)->get();

        $recentFees = Fee::where('student_id', $student->id)
            ->latest()->take(5)->get();

        return Inertia::render('Parent/Dashboard', [
            'student'          => $student->load(['schoolClass', 'section']),
            'totalFees'        => $totalFees,
            'paidFees'         => $paidFees,
            'pendingFees'      => $pendingFees,
            'attendance'       => $attendance,
            'totalPresent'     => $totalPresent,
            'totalAbsent'      => $totalAbsent,
            'recentAttendance' => $recentAttendance,
            'recentFees'       => $recentFees,
        ]);
    }

    public function attendance(Request $request)
    {
        $student = $this->getStudent();

        $month = $request->month ?? now()->month;
        $year  = $request->year  ?? now()->year;

        $query = Attendance::where('student_id', $student->id);

        if ($request->month && $request->year) {
            $query->whereMonth('date', $month)->whereYear('date', $year);
        }

        $attendances  = $query->orderBy('date', 'desc')->get();
        $totalPresent = $attendances->where('status', 'present')->count();
        $totalAbsent  = $attendances->where('status', 'absent')->count();
        $totalLate    = $attendances->where('status', 'late')->count();
        $totalDays    = $attendances->count();
        $percentage   = $totalDays > 0 ? round(($totalPresent / $totalDays) * 100) : 0;

        return Inertia::render('Parent/Attendance', [
            'student'      => $student->load(['schoolClass', 'section']),
            'attendances'  => $attendances,
            'totalPresent' => $totalPresent,
            'totalAbsent'  => $totalAbsent,
            'totalLate'    => $totalLate,
            'percentage'   => $percentage,
            'filters'      => ['month' => $month, 'year' => $year],
        ]);
    }

    public function fees()
    {
        $student = $this->getStudent();
        $fees = Fee::where('student_id', $student->id)->latest()->get();

        return Inertia::render('Parent/Fees', [
            'student'     => $student->load(['schoolClass', 'section']),
            'fees'        => $fees,
            'totalFees'   => $fees->sum('amount'),
            'paidFees'    => $fees->sum('paid_amount'),
            'pendingFees' => $fees->sum('remaining'),
        ]);
    }

    public function results()
    {
        $student = $this->getStudent();
        $exams = Exam::where('school_class_id', $student->class_id)
            ->where('is_published', true)
            ->with(['results' => function($q) use ($student) {
                $q->where('student_id', $student->id)->with('subject');
            }])
            ->latest()
            ->get();

        return Inertia::render('Parent/Results', [
            'student' => $student->load(['schoolClass', 'section']),
            'exams'   => $exams,
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:6',
            'confirm_password' => 'required|same:new_password',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect!']);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return back()->with('success', 'Password changed successfully!');
    }
}