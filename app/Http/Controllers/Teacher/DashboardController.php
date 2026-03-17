<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getTeacher()
    {
        return Teacher::where('user_id', auth()->id())
            ->with('classes')
            ->first();
    }

    private function getAssignedClassIds($teacher)
    {
        return $teacher->classes->pluck('id')->toArray();
    }

    public function dashboard()
    {
        $teacher = $this->getTeacher();

        if (!$teacher) {
            return Inertia::render('Teacher/NoTeacher');
        }

        $classIds = $this->getAssignedClassIds($teacher);

        $totalStudents = Student::whereIn('class_id', $classIds)->where('status', 'active')->count();
        $totalClasses  = count($classIds);

        $todayAttendance = Attendance::whereIn('class_id', $classIds)->whereDate('date', today());
        $presentToday    = (clone $todayAttendance)->where('status', 'present')->count();
        $totalToday      = (clone $todayAttendance)->count();

        $recentAttendance = Attendance::with(['student.schoolClass'])
            ->whereIn('class_id', $classIds)
            ->whereDate('date', today())
            ->latest()
            ->take(5)
            ->get();

        $classes = SchoolClass::whereIn('id', $classIds)
            ->withCount('students')
            ->with('sections')
            ->get();

        return Inertia::render('Teacher/Dashboard', [
            'teacher'          => $teacher->load('department'),
            'totalStudents'    => $totalStudents,
            'totalClasses'     => $totalClasses,
            'presentToday'     => $presentToday,
            'totalToday'       => $totalToday,
            'recentAttendance' => $recentAttendance,
            'classes'          => $classes,
        ]);
    }

    public function students(Request $request)
    {
        $teacher  = $this->getTeacher();
        $classIds = $this->getAssignedClassIds($teacher);

        $classes = SchoolClass::whereIn('id', $classIds)->get();

        $students = Student::with(['schoolClass', 'section'])
            ->whereIn('class_id', $classIds)
            ->where('status', 'active')
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('student_id', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Teacher/Students', [
            'teacher'  => $teacher->load('department'),
            'students' => $students,
            'classes'  => $classes,
            'filters'  => $request->only(['search', 'class_id']),
        ]);
    }

    public function attendance(Request $request)
    {
        $teacher  = $this->getTeacher();
        $classIds = $this->getAssignedClassIds($teacher);

        $classes = SchoolClass::whereIn('id', $classIds)->get();
        $selectedClass = $request->class_id ? SchoolClass::find($request->class_id) : null;

        $students = [];
        $existingAttendance = [];

        if ($request->class_id && $request->date && in_array($request->class_id, $classIds)) {
            $students = Student::with('section')
                ->where('class_id', $request->class_id)
                ->where('status', 'active')
                ->get();

            $existingAttendance = Attendance::where('class_id', $request->class_id)
                ->whereDate('date', $request->date)
                ->get()
                ->keyBy('student_id');
        }

        return Inertia::render('Teacher/Attendance', [
            'teacher'            => $teacher->load('department'),
            'classes'            => $classes,
            'selectedClass'      => $selectedClass,
            'students'           => $students,
            'existingAttendance' => $existingAttendance,
            'filters'            => $request->only(['class_id', 'date']),
            'today'              => today()->format('Y-m-d'),
        ]);
    }

    public function saveAttendance(Request $request)
    {
        $teacher  = $this->getTeacher();
        $classIds = $this->getAssignedClassIds($teacher);

        $request->validate([
            'class_id'    => 'required|exists:school_classes,id',
            'date'        => 'required|date',
            'attendances' => 'required|array',
        ]);

        if (!in_array($request->class_id, $classIds)) {
            return back()->withErrors(['error' => 'Unauthorized!']);
        }

        foreach ($request->attendances as $studentId => $data) {
            Attendance::updateOrCreate(
                ['student_id' => $studentId, 'date' => $request->date],
                [
                    'class_id' => $request->class_id,
                    'status'   => $data['status'],
                    'remarks'  => $data['remarks'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Attendance saved successfully!');
    }

    public function results(Request $request)
    {
        $teacher  = $this->getTeacher();
        $classIds = $this->getAssignedClassIds($teacher);

        $classes = SchoolClass::whereIn('id', $classIds)->get();

        $exams = Exam::with('schoolClass')
            ->whereIn('school_class_id', $classIds)
            ->when($request->class_id, fn($q) => $q->where('school_class_id', $request->class_id))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Teacher/Results', [
            'teacher' => $teacher->load('department'),
            'exams'   => $exams,
            'classes' => $classes,
            'filters' => $request->only(['class_id']),
        ]);
    }

    public function showResult(Request $request, $examId)
{
    $teacher  = $this->getTeacher();
    $classIds = $this->getAssignedClassIds($teacher);

    $exam = Exam::with(['schoolClass'])->findOrFail($examId);

    // Check authorized
    if (!in_array($exam->school_class_id, $classIds)) {
        abort(403, 'Unauthorized');
    }

    $subjects = \App\Models\Subject::where('school_class_id', $exam->school_class_id)
        ->where('status', 'active')
        ->get();

    $students = \App\Models\Student::where('class_id', $exam->school_class_id)
        ->where('status', 'active')
        ->get();

    $studentSummary = $students->map(function ($student) use ($exam, $subjects) {
        $results = \App\Models\Result::where('exam_id', $exam->id)
            ->where('student_id', $student->id)
            ->with('subject')
            ->get();

        $totalMarks    = $results->sum('total_marks');
        $obtainedMarks = $results->sum('marks_obtained');
        $percentage    = $totalMarks > 0 ? round(($obtainedMarks / $totalMarks) * 100, 1) : 0;
        $hasFail       = $results->where('status', 'fail')->count() > 0;

        $grade = match(true) {
            $percentage >= 90 => 'A+',
            $percentage >= 80 => 'A',
            $percentage >= 70 => 'B',
            $percentage >= 60 => 'C',
            $percentage >= 50 => 'D',
            default           => 'F',
        };

        return [
            'student'         => $student,
            'results'         => $results,
            'total_marks'     => $totalMarks,
            'marks_obtained'  => $obtainedMarks,
            'percentage'      => $percentage,
            'grade'           => $grade,
            'status'          => $hasFail ? 'fail' : 'pass',
        ];
    })->filter(fn($s) => $s['results']->count() > 0)->values();

    return Inertia::render('Teacher/ShowResult', [
        'teacher'       => $teacher->load('department'),
        'exam'          => $exam,
        'subjects'      => $subjects,
        'studentSummary' => $studentSummary,
    ]);
}

public function resultEntry(Request $request, $examId)
{
    $teacher  = $this->getTeacher();
    $classIds = $this->getAssignedClassIds($teacher);

    $exam = Exam::with(['schoolClass', 'examSubjects.subject'])->findOrFail($examId);

    if (!in_array($exam->school_class_id, $classIds)) {
        abort(403, 'Unauthorized');
    }

    $subjects = \App\Models\Subject::where('school_class_id', $exam->school_class_id)
        ->where('status', 'active')
        ->get();

    $students = \App\Models\Student::where('class_id', $exam->school_class_id)
        ->where('status', 'active')
        ->orderBy('roll_number')
        ->get();

    $existingResults = \App\Models\Result::where('exam_id', $examId)
        ->get()
        ->groupBy('student_id')
        ->map(fn($r) => $r->keyBy('subject_id'));

    return Inertia::render('Teacher/ResultEntry', [
        'teacher'         => $teacher->load('department'),
        'exam'            => $exam,
        'subjects'        => $subjects,
        'students'        => $students,
        'existingResults' => $existingResults,
    ]);
}

public function resultStore(Request $request)
{
    $teacher  = $this->getTeacher();
    $classIds = $this->getAssignedClassIds($teacher);

    $exam = Exam::findOrFail($request->exam_id);

    if (!in_array($exam->school_class_id, $classIds)) {
        abort(403, 'Unauthorized');
    }

    foreach ($request->results as $studentId => $subjects) {
        foreach ($subjects as $subjectId => $data) {
            if (!isset($data['marks_obtained'])) continue;

            $subject = \App\Models\Subject::find($subjectId);
            $totalMarks = $data['total_marks'] ?? 0;
            $obtained   = $data['marks_obtained'] ?? 0;
            $percentage = $totalMarks > 0 ? round(($obtained / $totalMarks) * 100, 1) : 0;

            $grade = match(true) {
                $percentage >= 90 => 'A+',
                $percentage >= 80 => 'A',
                $percentage >= 70 => 'B',
                $percentage >= 60 => 'C',
                $percentage >= 50 => 'D',
                default           => 'F',
            };

            $passingMarks = $subject->passing_marks ?? ($totalMarks * 0.33);
            $status = $obtained >= $passingMarks ? 'pass' : 'fail';

            \App\Models\Result::updateOrCreate(
                ['exam_id' => $exam->id, 'student_id' => $studentId, 'subject_id' => $subjectId],
                [
                    'marks_obtained' => $obtained,
                    'total_marks'    => $totalMarks,
                    'percentage'     => $percentage,
                    'grade'          => $grade,
                    'status'         => $status,
                    'remarks'        => $data['remarks'] ?? null,
                ]
            );
        }
    }

    return redirect()->back()->with('success', 'Results saved successfully!');
}

public function attendanceReport(Request $request)
{
    $teacher  = $this->getTeacher();
    $classIds = $this->getAssignedClassIds($teacher);

    $classes = SchoolClass::whereIn('id', $classIds)->get();

    $report = null;
    $students = [];

    if ($request->class_id && $request->month && $request->year) {
        $students = Student::where('class_id', $request->class_id)
            ->where('status', 'active')
            ->orderBy('roll_number')
            ->get();

        $report = $students->map(function ($student) use ($request) {
            $attendances = Attendance::where('student_id', $student->id)
                ->whereMonth('date', $request->month)
                ->whereYear('date', $request->year)
                ->get();

            $present = $attendances->where('status', 'present')->count();
            $absent  = $attendances->where('status', 'absent')->count();
            $late    = $attendances->where('status', 'late')->count();
            $leave   = $attendances->where('status', 'leave')->count();
            $total   = $attendances->count();

            return [
    'student_id'  => $student->id,
    'name'        => $student->name,
    'roll_number' => $student->roll_number,
    'present'     => $present,
    'absent'      => $absent,
    'late'        => $late,
    'leave'       => $leave,
    'total'       => $total,
    'percentage'  => $total > 0 ? round((($present + $late) / $total) * 100) : 0,
    'dates'       => $attendances->map(fn($a) => [
        'date'    => $a->date,
        'status'  => $a->status,
        'remarks' => $a->remarks,
    ])->sortBy('date')->values(),
];
        })->values();
    }

    return Inertia::render('Teacher/AttendanceReport', [
        'teacher'  => $teacher->load('department'),
        'classes'  => $classes,
        'report'   => $report,
        'filters'  => $request->only(['class_id', 'month', 'year']),
    ]);
}

public function studentDates(Request $request)
{
    $teacher  = $this->getTeacher();
    $classIds = $this->getAssignedClassIds($teacher);

    $student = Student::findOrFail($request->student_id);

    if (!in_array($student->class_id, $classIds)) {
        abort(403);
    }

    $dates = Attendance::where('student_id', $request->student_id)
        ->whereMonth('date', $request->month)
        ->whereYear('date', $request->year)
        ->orderBy('date')
        ->get(['date', 'status', 'remarks']);

    return back()->with('studentDates', $dates);
}

    public function profile()
    {
        $teacher = $this->getTeacher();

        return Inertia::render('Teacher/Profile', [
            'teacher' => $teacher->load(['department', 'educations']),
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