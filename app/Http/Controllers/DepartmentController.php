<?php
namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::withCount('teachers')
            ->when($request->search, function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'filters'     => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'code'        => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);
        Department::create($request->all());
        return redirect()->back()->with('success', 'Department added successfully!');
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'code'   => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive',
        ]);
        $department->update($request->all());
        return redirect()->back()->with('success', 'Department updated successfully!');
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return redirect()->back()->with('success', 'Department deleted successfully!');
    }
}