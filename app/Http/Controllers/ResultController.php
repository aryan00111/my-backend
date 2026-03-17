<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Exam;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ResultController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
            ->with('sections')
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function($cls) {
                $cls->exams_count = Exam::where('school_class_id', $cls->id)->count();
                return $cls;
            });

        return Inertia::render('Results/Index', [
            'classes' => $classes,
        ]);
    }

    public function classResults(Request $request)
    {
        $class = SchoolClass::findOrFail($request->class_id);
        $exams = Exam::where('school_class_id', $request->class_id)
            ->latest()
            ->get()
            ->map(function($exam) {
                $exam->results_count = Result::where('exam_id', $exam->id)->count();
                return $exam;
            });

        return Inertia::render('Results/ClassResults', [
            'class' => $class,
            'exams' => $exams,
        ]);
    }

    public function entry(Exam $exam)
    {
        $students = Student::where('class_id', $exam->school_class_id)
            ->where('status', 'active')
            ->with(['results' => function($q) use ($exam) {
                $q->where('exam_id', $exam->id)->with('subject');
            }])
            ->get();

        $subjects = Subject::where('school_class_id', $exam->school_class_id)
            ->where('status', 'active')
            ->get();

        return Inertia::render('Results/Entry', [
            'exam'     => $exam->load('schoolClass'),
            'students' => $students,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'results' => 'required|array',
        ]);

        foreach ($request->results as $result) {
            if (!isset($result['marks_obtained']) || $result['marks_obtained'] === '') continue;

            $percentage = ($result['marks_obtained'] / $result['total_marks']) * 100;
$grade = $result['show_grade'] ?? true ? Result::calculateGrade($percentage) : null;
$status = $result['marks_obtained'] >= $result['passing_marks'] ? 'pass' : 'fail';

Result::updateOrCreate(
    [
        'exam_id'    => $request->exam_id,
        'student_id' => $result['student_id'],
        'subject_id' => $result['subject_id'],
    ],
    [
        'marks_obtained'           => $result['marks_obtained'],
        'theory_marks_obtained'    => $result['theory_marks_obtained'] ?? null,
        'practical_marks_obtained' => $result['practical_marks_obtained'] ?? null,
        'total_marks'              => $result['total_marks'],
        'percentage'               => round($percentage, 2),
        'grade'                    => $grade,
        'status'                   => $status,
        'remarks'                  => $result['remarks'] ?? null,
    ]
);
        }

        $exam = Exam::find($request->exam_id);
        return redirect()->route('results.class', ['class_id' => $exam->school_class_id])
            ->with('success', 'Results save ho gaye!');
    }

    public function show(Exam $exam)
    {
        $results  = Result::where('exam_id', $exam->id)
            ->with(['student', 'subject'])
            ->get()
            ->groupBy('student_id');

        $subjects = Subject::where('school_class_id', $exam->school_class_id)->get();

        // Student-wise total calculate karo
        $studentSummary = $results->map(function($studentResults) {
            $totalMarks    = $studentResults->sum('total_marks');
            $marksObtained = $studentResults->sum('marks_obtained');
            $percentage    = $totalMarks > 0 ? round(($marksObtained / $totalMarks) * 100, 2) : 0;
            $failCount     = $studentResults->where('status', 'fail')->count();

            return [
                'student'       => $studentResults->first()->student,
                'results'       => $studentResults,
                'total_marks'   => $totalMarks,
                'marks_obtained'=> $marksObtained,
                'percentage'    => $percentage,
                'grade'         => Result::calculateGrade($percentage),
                'status'        => $failCount > 0 ? 'fail' : 'pass',
            ];
        })->sortByDesc('percentage')->values();

        return Inertia::render('Results/Show', [
            'exam'           => $exam->load('schoolClass'),
            'subjects'       => $subjects,
            'studentSummary' => $studentSummary,
        ]);
    }

public function downloadResultPdf(Exam $exam, Request $request)
{
    $results  = Result::where('exam_id', $exam->id)
        ->with(['student', 'subject'])
        ->get()
        ->groupBy('student_id');

    $subjects = Subject::where('school_class_id', $exam->school_class_id)->get();

    $studentSummary = $results->map(function($studentResults) {
        $totalMarks    = $studentResults->sum('total_marks');
        $marksObtained = $studentResults->sum('marks_obtained');
        $percentage    = $totalMarks > 0 ? round(($marksObtained / $totalMarks) * 100, 2) : 0;
        $failCount     = $studentResults->where('status', 'fail')->count();

        return [
            'student'        => $studentResults->first()->student,
            'results'        => $studentResults,
            'total_marks'    => $totalMarks,
            'marks_obtained' => $marksObtained,
            'percentage'     => $percentage,
            'grade'          => Result::calculateGrade($percentage),
            'status'         => $failCount > 0 ? 'fail' : 'pass',
        ];
    })->sortByDesc('percentage')->values();

    $exam->load('schoolClass');

   $showGrade = $request->get('show_grade', 1);

$pdf = Pdf::loadView('pdf.results', [
    'exam'           => $exam,
    'subjects'       => $subjects,
    'studentSummary' => $studentSummary,
    'showGrade'      => $showGrade,
]);
    $pdf->setPaper('A4', 'landscape');

    return $pdf->download("results_{$exam->name}.pdf");
}

public function studentResultPdf(Request $request)
{
    $student = Student::with(['schoolClass', 'section'])->findOrFail($request->student_id);
    $exam    = Exam::with('schoolClass')->findOrFail($request->exam_id);

    $results = Result::where('exam_id', $request->exam_id)
        ->where('student_id', $request->student_id)
        ->with('subject')
        ->get();

    $totalMarks    = $results->sum('total_marks');
    $marksObtained = $results->sum('marks_obtained');
    $percentage    = $totalMarks > 0 ? round(($marksObtained / $totalMarks) * 100, 2) : 0;
    $failCount     = $results->where('status', 'fail')->count();

    $summary = [
        'total_marks'    => $totalMarks,
        'marks_obtained' => $marksObtained,
        'percentage'     => $percentage,
        'grade'          => Result::calculateGrade($percentage),
        'status'         => $failCount > 0 ? 'fail' : 'pass',
    ];

    $showGrade = $request->get('show_grade', 1);

$pdf = Pdf::loadView('pdf.student-result', compact('student', 'exam', 'results', 'summary') + ['showGrade' => $showGrade]);
    $pdf->setPaper('A4', 'portrait');

    return $pdf->download("result_{$student->student_id}_{$exam->name}.pdf");
}


   
}