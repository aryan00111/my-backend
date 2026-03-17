<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
{
    $query = \App\Models\Student::with(['schoolClass', 'section'])
        ->when($request->search, function($q) use ($request) {
            $q->where('name', 'like', "%{$request->search}%")
              ->orWhere('student_id', 'like', "%{$request->search}%")
             ->orWhere('phone', 'like', "%{$request->search}%");
        })
        ->when($request->class_id, function($q) use ($request) {
    $q->where('class_id', $request->class_id);
})
        ->when($request->status, function($q) use ($request) {
            $q->where('status', $request->status);
        })
        ->latest();

    $students = $query->paginate(10)->withQueryString();

    return Inertia::render('Students/Index', [
        'students' => $students,
        'classes'  => \App\Models\SchoolClass::all(),
        'filters'  => $request->only(['search', 'class_id', 'status']),
    ]);
}

    public function create(Request $request)
    {
        $classes = SchoolClass::with('sections')
            ->where('status', 'active')
            ->get();

        return Inertia::render('Students/Create', [
            'classes'        => $classes,
            'selected_class' => $request->class_id ?? null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'father_name'   => 'required|string|max:255',
            'class_id'      => 'required|exists:school_classes,id',
            'section_id'    => 'nullable|exists:sections,id',
            'roll_number'   => 'required|string|unique:students,roll_number,NULL,id,class_id,' . $request->class_id,
            'gender'        => 'required|in:male,female',
            'phone'         => 'nullable|string',
            'address'       => 'nullable|string',
            'date_of_birth' => 'nullable|date',
        ]);

        // Auto generate Student ID
        $lastStudent = Student::latest()->first();
        $nextId      = $lastStudent ? (intval(substr($lastStudent->student_id, 4)) + 1) : 1;
        $studentId   = 'STU-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        Student::create([
            'student_id'    => $studentId,
            'name'          => $request->name,
            'father_name'   => $request->father_name,
            'class_id'      => $request->class_id,
            'section_id'    => $request->section_id,
            'roll_number'   => $request->roll_number,
            'gender'        => $request->gender,
            'phone'         => $request->phone,
            'address'       => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'status'        => 'active',
        ]);

        return redirect()->route('students.index')
            ->with('success', 'Student add ho gaya!');
    }
public function show(Student $student)
{
    return Inertia::render('Students/Show', [
        'student' => $student->load(['schoolClass', 'section']),
    ]);
}
public function edit(Student $student)
    {
        $classes = SchoolClass::with('sections')
            ->where('status', 'active')
            ->get();

        return Inertia::render('Students/Edit', [
            'student' => $student->load(['schoolClass', 'section']),
            'classes' => $classes,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'father_name'   => 'required|string|max:255',
            'class_id'      => 'required|exists:school_classes,id',
            'section_id'    => 'nullable|exists:sections,id',
            'roll_number'   => 'required|string|unique:students,roll_number,' . $student->id . ',id,class_id,' . $request->class_id,
            'gender'        => 'required|in:male,female',
            'phone'         => 'nullable|string',
            'address'       => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'status'        => 'required|in:active,inactive',
        ]);

        $student->update($request->all());

        return redirect()->route('students.index')
            ->with('success', 'Student update ho gaya!');
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return redirect()->route('students.index')
            ->with('success', 'Student delete ho gaya!');
    }
}