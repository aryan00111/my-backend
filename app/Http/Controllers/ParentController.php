<?php

namespace App\Http\Controllers;

use App\Models\ParentDetail;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ParentController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
            ->with(['sections'])
            ->where('status', 'active')
            ->latest()
            ->get();

        $parents = ParentDetail::with([
            'user',
            'student.schoolClass',
            'student.section',
        ])->get();

        return Inertia::render('Parents/Index', [
            'classes' => $classes,
            'parents' => $parents,
        ]);
    }

    public function create(Request $request)
    {
        $students = Student::with(['schoolClass', 'section'])
            ->where('status', 'active')
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->get();

        $classes = SchoolClass::where('status', 'active')->get();

        return Inertia::render('Parents/Create', [
            'students'       => $students,
            'classes'        => $classes,
            'selected_class' => $request->class_id ?? null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:6',
            'student_id' => 'required|exists:students,id',
            'relation'   => 'required|in:father,mother,guardian',
            'phone'      => 'nullable|string',
            'cnic'       => 'nullable|string',
            'occupation' => 'nullable|string',
            'address'    => 'nullable|string',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'parent',
        ]);

        ParentDetail::create([
            'user_id'    => $user->id,
            'student_id' => $request->student_id,
            'relation'   => $request->relation,
            'phone'      => $request->phone,
            'cnic'       => $request->cnic,
            'occupation' => $request->occupation,
            'address'    => $request->address,
        ]);

        return redirect()->route('parents.index')
            ->with('success', 'Parent account created successfully!');
    }

    public function edit(ParentDetail $parent)
    {
        $students = Student::with(['schoolClass', 'section'])
            ->where('status', 'active')
            ->get();

        return Inertia::render('Parents/Edit', [
            'parent'   => $parent->load(['user', 'student.schoolClass', 'student.section']),
            'students' => $students,
        ]);
    }

    public function update(Request $request, ParentDetail $parent)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'relation'   => 'required|in:father,mother,guardian',
            'phone'      => 'nullable|string',
            'cnic'       => 'nullable|string',
            'occupation' => 'nullable|string',
            'address'    => 'nullable|string',
        ]);

        $parent->user->update(['name' => $request->name]);

        $parent->update([
            'relation'   => $request->relation,
            'phone'      => $request->phone,
            'cnic'       => $request->cnic,
            'occupation' => $request->occupation,
            'address'    => $request->address,
        ]);

        return redirect()->route('parents.index')
            ->with('success', 'Parent updated successfully!');
    }

    public function changePassword(Request $request, ParentDetail $parent)
{
    $request->validate([
        'email'    => 'required|email|unique:users,email,' . $parent->user_id,
        'password' => 'nullable|min:6|confirmed',
    ]);

    if (!$parent->user_id) {
        return redirect()->back()->with('error', 'No login account found!');
    }

    $updateData = ['email' => $request->email];

    if ($request->password) {
        $updateData['password'] = Hash::make($request->password);
    }

    User::find($parent->user_id)->update($updateData);

    return redirect()->back()->with('success', 'Login credentials updated successfully!');
}

    public function destroy(ParentDetail $parent)
    {
        $user = $parent->user;
        $parent->delete();
        if ($user) $user->delete();

        return redirect()->route('parents.index')
            ->with('success', 'Parent deleted successfully!');
    }
}