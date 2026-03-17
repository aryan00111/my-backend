<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $enrollments = Enrollment::latest()
            ->when($request->search, fn($q) => $q->where('student_name', 'like', "%{$request->search}%")
                ->orWhere('father_name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->class, fn($q) => $q->where('apply_for_class', $request->class))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Enrollments/Index', [
            'enrollments' => $enrollments,
            'filters'     => $request->only(['search', 'status', 'class']),
            'counts'      => [
                'total'     => Enrollment::count(),
                'pending'   => Enrollment::where('status', 'pending')->count(),
                'reviewing' => Enrollment::where('status', 'reviewing')->count(),
                'approved'  => Enrollment::where('status', 'approved')->count(),
                'rejected'  => Enrollment::where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function show(Enrollment $enrollment)
    {
        return Inertia::render('Enrollments/Show', [
            'enrollment' => $enrollment,
        ]);
    }

    public function updateStatus(Request $request, Enrollment $enrollment)
    {
        $request->validate([
            'status'  => 'required|in:pending,reviewing,approved,rejected',
            'remarks' => 'nullable|string',
        ]);

        $enrollment->update([
            'status'  => $request->status,
            'remarks' => $request->remarks,
        ]);

        return redirect()->back()->with('success', 'Enrollment status updated successfully!');
    }

    public function destroy(Enrollment $enrollment)
    {
        if ($enrollment->birth_certificate) \Storage::disk('public')->delete($enrollment->birth_certificate);
        if ($enrollment->previous_marksheet) \Storage::disk('public')->delete($enrollment->previous_marksheet);
        if ($enrollment->passport_photo) \Storage::disk('public')->delete($enrollment->passport_photo);

        $enrollment->delete();

        return redirect()->back()->with('success', 'Enrollment deleted successfully!');
    }

    // Public API - React Frontend se form submit hoga
    public function store(Request $request)
    {
        $request->validate([
    'student_name'    => 'required|string|max:255',
    'date_of_birth'   => 'required|date',
    'gender'          => 'required|in:male,female,other',
    'apply_for_class' => 'required|string',
    'father_name'     => 'required|string|max:255',
    'father_phone'    => 'required|string|max:20',
    'address'         => 'required|string',
    'email'           => 'nullable|email',
    'aadhaar_card'    => 'nullable|string|max:20',
]);

        $data = $request->only([
    'student_name', 'date_of_birth', 'gender', 'religion',
    'nationality', 'previous_school', 'last_class_passed', 'apply_for_class',
    'aadhaar_card', 'father_name', 'father_occupation', 'father_phone',
    'mother_name', 'mother_phone', 'email', 'address', 'city',
]);

        if ($request->hasFile('birth_certificate')) {
            $data['birth_certificate'] = $request->file('birth_certificate')->store('enrollments/docs', 'public');
        }
        if ($request->hasFile('previous_marksheet')) {
            $data['previous_marksheet'] = $request->file('previous_marksheet')->store('enrollments/docs', 'public');
        }
        if ($request->hasFile('passport_photo')) {
            $data['passport_photo'] = $request->file('passport_photo')->store('enrollments/photos', 'public');
        }

        Enrollment::create($data);

        return response()->json(['message' => 'Enrollment submitted successfully!'], 201);
    }
}