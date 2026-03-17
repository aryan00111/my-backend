<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ExamController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
            ->with('sections')
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function($cls) {
                $cls->exams_count = \App\Models\Exam::where('school_class_id', $cls->id)->count();
                return $cls;
            });

        return Inertia::render('Exams/Index', [
            'classes' => $classes,
        ]);
    }

    public function classExams(Request $request)
    {
        $class = SchoolClass::findOrFail($request->class_id);
        $exams = Exam::where('school_class_id', $request->class_id)
            ->withCount('examSubjects')
            ->latest()
            ->get();

        return Inertia::render('Exams/ClassExams', [
            'class' => $class,
            'exams' => $exams,
        ]);
    }

    public function examDetail(Request $request)
    {
        $exam = Exam::with(['schoolClass', 'examSubjects.subject'])->findOrFail($request->exam_id);

        $subjects = Subject::where('school_class_id', $exam->school_class_id)
            ->where('status', 'active')
            ->get();

        $examSubjects = $exam->examSubjects->keyBy('subject_id');

        return Inertia::render('Exams/ExamDetail', [
            'exam'         => $exam,
            'subjects'     => $subjects,
            'examSubjects' => $examSubjects,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'            => 'required|string|max:255',
            'type'            => 'required|in:unit_test,half_yearly,annual,other',
            'school_class_id' => 'required|exists:school_classes,id',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after_or_equal:start_date',
        ]);

        Exam::create([
            'name'            => $request->name,
            'type'            => $request->type,
            'school_class_id' => $request->school_class_id,
            'start_date'      => $request->start_date,
            'end_date'        => $request->end_date,
            'exam_date'       => $request->start_date,
            'status'          => 'scheduled',
        ]);

        return redirect()->back()->with('success', 'Exam add ho gaya!');
    }

    public function update(Request $request, Exam $exam)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'type'       => 'required|in:unit_test,half_yearly,annual,other',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'status'     => 'required|in:scheduled,ongoing,completed',
        ]);

        $exam->update($request->all());

        return redirect()->back()->with('success', 'Exam update ho gaya!');
    }

    public function saveSubjectDates(Request $request)
{
    $request->validate([
        'exam_id'  => 'required|exists:exams,id',
        'subjects' => 'required|array',
    ]);

    $convertTime = function($time) {
        if (empty($time)) return null;
        // Already 24hr format
        if (preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $time)) return $time;
        // Convert AM/PM to 24hr
        $parsed = date_parse_from_format('h:i A', $time);
        if ($parsed && !$parsed['errors']) {
            return sprintf('%02d:%02d:00', $parsed['hour'], $parsed['minute']);
        }
        return null;
    };

    foreach ($request->subjects as $subjectId => $data) {
        if (!empty($data['exam_date'])) {
            ExamSubject::updateOrCreate(
                ['exam_id' => $request->exam_id, 'subject_id' => $subjectId],
                [
                    'exam_date'            => $data['exam_date'],
                    'start_time'           => $convertTime($data['start_time'] ?? null),
                    'end_time'             => $convertTime($data['end_time'] ?? null),
                    'room'                 => $data['room'] ?? null,
                    'practical_date'       => $data['practical_date'] ?? null,
                    'practical_start_time' => $convertTime($data['practical_start_time'] ?? null),
                    'practical_end_time'   => $convertTime($data['practical_end_time'] ?? null),
                    'practical_room'       => $data['practical_room'] ?? null,
                ]
            );
        }
    }

    return redirect()->back()->with('success', 'Subject dates save ho gayi!');
}
    public function destroy(Exam $exam)
    {
        $exam->delete();
        return redirect()->back()->with('success', 'Exam delete ho gaya!');
    }

    public function publish(Exam $exam)
    {
        $exam->update(['is_published' => !$exam->is_published]);
        $msg = $exam->is_published ? 'Result publish ho gaya!' : 'Result unpublish ho gaya!';
        return redirect()->back()->with('success', $msg);
    }

    public function schedulePdf(Request $request)
{
    $exam = Exam::with(['schoolClass', 'examSubjects.subject'])
        ->findOrFail($request->exam_id);

    $examSubjects = $exam->examSubjects->sortBy('exam_date');

    $pdf = Pdf::loadView('pdf.exam-schedule', compact('exam', 'examSubjects'));
    $pdf->setPaper('A4', 'portrait');

    return $pdf->download("exam_schedule_{$exam->name}.pdf");
}
}