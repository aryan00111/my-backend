<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
    ->with('sections')
    ->where('status', 'active')
    ->latest()
    ->get()
    ->map(function($cls) {
        $cls->subjects_count = \App\Models\Subject::where('school_class_id', $cls->id)->count();
        return $cls;
    });

        return Inertia::render('Subjects/Index', [
            'classes' => $classes,
        ]);
    }

    public function classSubjects(Request $request)
    {
        $class    = SchoolClass::findOrFail($request->class_id);
        $subjects = Subject::where('school_class_id', $request->class_id)
            ->latest()
            ->get();

        return Inertia::render('Subjects/ClassSubjects', [
            'class'    => $class,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'school_class_id' => 'required|exists:school_classes,id',
        'name'            => 'required|string|max:255',
        'code'            => 'nullable|string|max:20',
        'total_marks'     => 'required|integer|min:1',
        'passing_marks'   => 'required|integer|min:1',
        'has_practical'   => 'boolean',
        'theory_marks'    => 'nullable|integer|min:1',
        'practical_marks' => 'nullable|integer|min:1',
        'theory_passing'  => 'nullable|integer|min:1',
        'practical_passing' => 'nullable|integer|min:1',
    ]);

    $data = $request->all();

    // Agar practical hai to total auto calculate
    if ($request->has_practical) {
        $data['total_marks']   = ($request->theory_marks ?? 0) + ($request->practical_marks ?? 0);
        $data['passing_marks'] = ($request->theory_passing ?? 0) + ($request->practical_passing ?? 0);
    }

    Subject::create($data);

    return redirect()->back()->with('success', 'Subject add ho gaya!');
}


   public function update(Request $request, Subject $subject)
{
    $request->validate([
        'name'            => 'required|string|max:255',
        'code'            => 'nullable|string|max:20',
        'total_marks'     => 'required|integer|min:1',
        'passing_marks'   => 'required|integer|min:1',
        'has_practical'   => 'boolean',
        'theory_marks'    => 'nullable|integer|min:1',
        'practical_marks' => 'nullable|integer|min:1',
        'theory_passing'  => 'nullable|integer|min:1',
        'practical_passing' => 'nullable|integer|min:1',
        'status'          => 'required|in:active,inactive',
    ]);

    $data = $request->all();

    if ($request->has_practical) {
        $data['total_marks']   = ($request->theory_marks ?? 0) + ($request->practical_marks ?? 0);
        $data['passing_marks'] = ($request->theory_passing ?? 0) + ($request->practical_passing ?? 0);
    }

    $subject->update($data);

    return redirect()->back()->with('success', 'Subject update ho gaya!');
}

    public function destroy(Subject $subject)
    {
        if ($subject->results()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Is subject ke results hain, delete nahi ho sakta!');
        }

        $subject->delete();

        return redirect()->back()->with('success', 'Subject delete ho gaya!');
    }
}