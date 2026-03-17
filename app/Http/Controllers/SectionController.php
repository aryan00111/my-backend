<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'name'            => 'required|string|max:255',
            'capacity'        => 'nullable|integer|min:1',
        ]);

        // Same class me same section check
        $exists = Section::where('school_class_id', $request->school_class_id)
            ->whereRaw('LOWER(name) = ?', [strtolower($request->name)])
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withErrors(['name' => 'Ye section is class me already exist karta hai!'])
                ->withInput();
        }

        Section::create([
            'school_class_id' => $request->school_class_id,
            'name'            => strtoupper($request->name),
            'capacity'        => $request->capacity ?? 30,
            'status'          => 'active',
        ]);

        return redirect()->route('classes.index')
            ->with('success', 'Section add ho gaya!');
    }

    public function update(Request $request, Section $section)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'status'   => 'required|in:active,inactive',
        ]);

        // Same class me same section check (apne ko chhod ke)
        $exists = Section::where('school_class_id', $section->school_class_id)
            ->whereRaw('LOWER(name) = ?', [strtolower($request->name)])
            ->where('id', '!=', $section->id)
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->withErrors(['name' => 'Ye section is class me already exist karta hai!'])
                ->withInput();
        }

        $section->update([
            'name'     => strtoupper($request->name),
            'capacity' => $request->capacity ?? $section->capacity,
            'status'   => $request->status,
        ]);

        return redirect()->route('classes.index')
            ->with('success', 'Section update ho gaya!');
    }

    public function destroy(Section $section)
    {
        if ($section->students()->count() > 0) {
            return redirect()->route('classes.index')
                ->with('error', 'Is section me students hain, delete nahi ho sakta!');
        }

        $section->delete();

        return redirect()->route('classes.index')
            ->with('success', 'Section delete ho gaya!');
    }
}