<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
            ->with('sections')
            ->latest()
            ->get();

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'grade_level' => [
                'nullable', 'string', 'max:50',
                function ($attribute, $value, $fail) {
                    if ($value && SchoolClass::whereRaw('LOWER(grade_level) = ?', [strtolower($value)])->exists()) {
                        $fail('Ye grade level already exist karta hai!');
                    }
                },
            ],
            'description' => 'nullable|string',
            'sections'    => 'nullable|array',
            'capacity'    => 'nullable|integer',
        ]);

        $class = SchoolClass::create([
            'name'        => $request->name,
            'grade_level' => $request->grade_level,
            'description' => $request->description,
            'status'      => 'active',
        ]);

        // Sections bhi create karo
        if ($request->sections && count($request->sections) > 0) {
            foreach ($request->sections as $sectionName) {
                \App\Models\Section::create([
                    'school_class_id' => $class->id,
                    'name'            => strtoupper($sectionName),
                    'capacity'        => $request->capacity ?? 30,
                    'status'          => 'active',
                ]);
            }
        }

        return redirect()->route('classes.index')
            ->with('success', 'Class aur sections add ho gaye!');
    }

    public function update(Request $request, SchoolClass $class)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'grade_level' => [
                'nullable', 'string', 'max:50',
                function ($attribute, $value, $fail) use ($class) {
                    if ($value && SchoolClass::whereRaw('LOWER(grade_level) = ?', [strtolower($value)])
                        ->where('id', '!=', $class->id)
                        ->exists()) {
                        $fail('Ye grade level already exist karta hai!');
                    }
                },
            ],
            'description' => 'nullable|string',
            'status'      => 'required|in:active,inactive',
        ]);

        $class->update($request->all());

        return redirect()->route('classes.index')
            ->with('success', 'Class update ho gayi!');
    }

    public function destroy(SchoolClass $class)
    {
        if ($class->students()->count() > 0) {
            return redirect()->route('classes.index')
                ->with('error', 'Is class me students hain, delete nahi ho sakta!');
        }

        $class->delete();

        return redirect()->route('classes.index')
            ->with('success', 'Class delete ho gayi!');
    }
}