<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class AttendanceController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
            ->with('sections')
            ->where('status', 'active')
            ->latest()
            ->get();

        return Inertia::render('Attendance/Index', [
            'classes' => $classes,
            'today'   => now()->format('Y-m-d'),
        ]);
    }

    public function getStudents(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:school_classes,id',
            'date'     => 'required|date',
        ]);

        $students = Student::where('class_id', $request->class_id)
            ->where('status', 'active')
            ->with(['section', 'attendances' => function($q) use ($request) {
                $q->where('date', $request->date);
            }])
            ->when($request->section_id, fn($q) => $q->where('section_id', $request->section_id))
            ->get()
            ->map(function($student) {
                $att = $student->attendances->first();
                return [
                    'id'          => $student->id,
                    'name'        => $student->name,
                    'student_id'  => $student->student_id,
                    'roll_number' => $student->roll_number,
                    'section'     => $student->section,
                    'status'      => $att ? $att->status : 'present',
                    'remarks'     => $att ? $att->remarks : '',
                    'marked'      => $att ? true : false,
                ];
            });

        return response()->json($students);
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id'    => 'required|exists:school_classes,id',
            'date'        => 'required|date',
            'attendances' => 'required|array',
        ]);

        foreach ($request->attendances as $att) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $att['student_id'],
                    'date'       => $request->date,
                ],
                [
                    'class_id' => $request->class_id,
                    'status'   => $att['status'],
                    'remarks'  => $att['remarks'] ?? '',
                ]
            );
        }

        return redirect()->route('attendance.index')
            ->with('success', 'Attendance save ho gayi!');
    }

    public function report(Request $request)
    {
        $classes = SchoolClass::withCount('students')
            ->with('sections')
            ->where('status', 'active')
            ->latest()
            ->get();

        $selectedClass  = null;
        $studentsReport = collect();
        $month          = $request->month ?? now()->month;
        $year           = $request->year  ?? now()->year;

        if ($request->class_id) {
            $selectedClass = SchoolClass::with('sections')->find($request->class_id);

            $students = Student::where('class_id', $request->class_id)
                ->where('status', 'active')
                ->with('section')
                ->get();

            $studentsReport = $students->map(function($student) use ($month, $year) {
                $atts    = Attendance::where('student_id', $student->id)
                    ->whereMonth('date', $month)
                    ->whereYear('date', $year)
                    ->get();

                $total   = $atts->count();
                $present = $atts->where('status', 'present')->count();
                $absent  = $atts->where('status', 'absent')->count();
                $late    = $atts->where('status', 'late')->count();

                return [
                    'id'          => $student->id,
                    'name'        => $student->name,
                    'student_id'  => $student->student_id,
                    'roll_number' => $student->roll_number,
                    'section'     => $student->section?->name ?? '-',
                    'total'       => $total,
                    'present'     => $present,
                    'absent'      => $absent,
                    'late'        => $late,
                    'percentage'  => $total > 0 ? round(($present / $total) * 100) : 0,
                ];
            });
        }

        return Inertia::render('Attendance/Report', [
            'classes'       => $classes,
            'selectedClass' => $selectedClass,
            'students'      => $studentsReport->values(),
            'month'         => (int) $month,
            'year'          => (int) $year,
        ]);
    }

    public function studentReport(Request $request)
    {
        $student = Student::with(['schoolClass', 'section'])
            ->findOrFail($request->student_id);

        $attendances = Attendance::where('student_id', $request->student_id)
            ->orderBy('date')
            ->get()
            ->groupBy(function($att) {
                return \Carbon\Carbon::parse($att->date)->format('Y-m');
            })
            ->map(function($month, $key) {
                $total   = $month->count();
                $present = $month->where('status', 'present')->count();
                $absent  = $month->where('status', 'absent')->count();
                $late    = $month->where('status', 'late')->count();
                return [
                    'month'      => \Carbon\Carbon::parse($key)->format('F Y'),
                    'total'      => $total,
                    'present'    => $present,
                    'absent'     => $absent,
                    'late'       => $late,
                    'percentage' => $total > 0 ? round(($present / $total) * 100) : 0,
                    'records'    => $month->map(fn($a) => [
                        'date'    => $a->date,
                        'status'  => $a->status,
                        'remarks' => $a->remarks,
                    ])->values(),
                ];
            })->values();

        $totalAll    = Attendance::where('student_id', $request->student_id)->count();
        $presentAll  = Attendance::where('student_id', $request->student_id)->where('status', 'present')->count();
        $absentAll   = Attendance::where('student_id', $request->student_id)->where('status', 'absent')->count();
        $lateAll     = Attendance::where('student_id', $request->student_id)->where('status', 'late')->count();

        $summary = [
            'total'      => $totalAll,
            'present'    => $presentAll,
            'absent'     => $absentAll,
            'late'       => $lateAll,
            'percentage' => $totalAll > 0 ? round(($presentAll / $totalAll) * 100) : 0,
        ];

        return Inertia::render('Attendance/StudentReport', [
            'student'     => $student,
            'attendances' => $attendances,
            'summary'     => $summary,
        ]);
    }

    public function downloadPdf(Request $request)
    {
        $student = Student::with(['schoolClass', 'section'])
            ->findOrFail($request->student_id);

        $attendances = Attendance::where('student_id', $request->student_id)
            ->orderBy('date')
            ->get()
            ->groupBy(function($att) {
                return \Carbon\Carbon::parse($att->date)->format('Y-m');
            })
            ->map(function($month, $key) {
                $total   = $month->count();
                $present = $month->where('status', 'present')->count();
                return [
                    'month'      => \Carbon\Carbon::parse($key)->format('F Y'),
                    'total'      => $total,
                    'present'    => $present,
                    'absent'     => $month->where('status', 'absent')->count(),
                    'late'       => $month->where('status', 'late')->count(),
                    'percentage' => $total > 0 ? round(($present / $total) * 100) : 0,
                    'records'    => $month->map(fn($a) => [
                        'date'    => $a->date,
                        'status'  => $a->status,
                        'remarks' => $a->remarks,
                    ])->values(),
                ];
            })->values();

        $totalAll   = Attendance::where('student_id', $request->student_id)->count();
        $presentAll = Attendance::where('student_id', $request->student_id)->where('status', 'present')->count();

        $summary = [
            'total'      => $totalAll,
            'present'    => $presentAll,
            'absent'     => Attendance::where('student_id', $request->student_id)->where('status', 'absent')->count(),
            'late'       => Attendance::where('student_id', $request->student_id)->where('status', 'late')->count(),
            'percentage' => $totalAll > 0 ? round(($presentAll / $totalAll) * 100) : 0,
        ];

        $pdf = Pdf::loadView('pdf.attendance', compact('student', 'attendances', 'summary'));

        return $pdf->download("attendance_{$student->student_id}.pdf");
    }

   public function downloadClassPdf(Request $request)
{
    $class = SchoolClass::with('sections')->findOrFail($request->class_id);
    $month = $request->month ?? now()->month;
    $year  = $request->year  ?? now()->year;

    $students = Student::where('class_id', $request->class_id)
        ->where('status', 'active')
        ->with('section')
        ->get()
        ->map(function($student) use ($month, $year) {
            $atts    = Attendance::where('student_id', $student->id)
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get();

            $total   = $atts->count();
            $present = $atts->where('status', 'present')->count();
            $absent  = $atts->where('status', 'absent')->count();
            $late    = $atts->where('status', 'late')->count();

            return [
                'name'        => $student->name,
                'student_id'  => $student->student_id,
                'roll_number' => $student->roll_number,
                'section'     => $student->section?->name ?? '-',
                'total'       => $total,
                'present'     => $present,
                'absent'      => $absent,
                'late'        => $late,
                'percentage'  => $total > 0 ? round(($present / $total) * 100) : 0,
            ];
        });

    $months = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

    $pdf = Pdf::loadView('pdf.attendance-class', compact('class', 'students', 'month', 'year', 'months'));
    $pdf->setPaper('A4', 'landscape');

    return $pdf->download("attendance_{$class->name}_{$months[$month]}_{$year}.pdf");
}

public function downloadClassExcel(Request $request)
{
    $class = SchoolClass::findOrFail($request->class_id);
    $month = $request->month ?? now()->month;
    $year  = $request->year  ?? now()->year;

    $students = Student::where('class_id', $request->class_id)
        ->where('status', 'active')
        ->with('section')
        ->get();

    return Excel::download(
        new \App\Exports\ClassAttendanceExport($class, $students, $month, $year),
        "attendance_{$class->name}_{$month}_{$year}.xlsx"
    );
}
    public function downloadExcel(Request $request)
    {
        $student = Student::with(['schoolClass', 'section'])
            ->findOrFail($request->student_id);

        $attendances = Attendance::where('student_id', $request->student_id)
            ->orderBy('date')
            ->get();

        return Excel::download(
            new \App\Exports\AttendanceExport($student, $attendances),
            "attendance_{$student->student_id}.xlsx"
        );
    }

    public function classReport(Request $request)
{
    $class = SchoolClass::with('sections')->findOrFail($request->class_id);
    $month = $request->month ?? now()->month;
    $year  = $request->year  ?? now()->year;

    $students = Student::where('class_id', $request->class_id)
        ->where('status', 'active')
        ->with('section')
        ->get()
        ->map(function($student) use ($month, $year) {
            $atts = Attendance::where('student_id', $student->id)
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->orderBy('date')
                ->get();

            $total   = $atts->count();
            $present = $atts->where('status', 'present')->count();
            $absent  = $atts->where('status', 'absent')->count();
            $late    = $atts->where('status', 'late')->count();

            return [
                'id'          => $student->id,
                'name'        => $student->name,
                'student_id'  => $student->student_id,
                'roll_number' => $student->roll_number,
                'section'     => $student->section?->name ?? '-',
                'total'       => $total,
                'present'     => $present,
                'absent'      => $absent,
                'late'        => $late,
                'percentage'  => $total > 0 ? round(($present / $total) * 100) : 0,
                'records'     => $atts->map(fn($a) => [
                    'date'    => $a->date,
                    'status'  => $a->status,
                    'remarks' => $a->remarks,
                ])->values(),
            ];
        });

    $months = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

    return Inertia::render('Attendance/ClassReport', [
        'class'    => $class,
        'students' => $students->values(),
        'month'    => (int) $month,
        'year'     => (int) $year,
        'monthName'=> $months[(int)$month],
    ]);
}

}