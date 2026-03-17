<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $programs = Program::latest()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Programs/Index', [
            'programs' => $programs,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'age_range'   => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
            'sort_order'  => 'nullable|integer',
            'status'      => 'required|in:active,inactive',
        ]);

        $data = $request->only(['title', 'age_range', 'description', 'sort_order', 'status']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('programs', 'public');
        }

        Program::create($data);

        return redirect()->back()->with('success', 'Program added successfully!');
    }

    public function update(Request $request, Program $program)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'age_range'   => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
            'sort_order'  => 'nullable|integer',
            'status'      => 'required|in:active,inactive',
        ]);

        $data = $request->only(['title', 'age_range', 'description', 'sort_order', 'status']);

        if ($request->hasFile('image')) {
            if ($program->image) {
                \Storage::disk('public')->delete($program->image);
            }
            $data['image'] = $request->file('image')->store('programs', 'public');
        }

        $program->update($data);

        return redirect()->back()->with('success', 'Program updated successfully!');
    }

    public function destroy(Program $program)
    {
        if ($program->image) {
            \Storage::disk('public')->delete($program->image);
        }
        $program->delete();

        return redirect()->back()->with('success', 'Program deleted successfully!');
    }
}