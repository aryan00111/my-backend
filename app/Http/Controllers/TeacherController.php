<?php
namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Department;
use App\Models\TeacherEducation;
use App\Models\TeacherAttendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\SchoolClass;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Teacher::with(['department', 'user'])
            ->when($request->search, function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            })
            ->when($request->department_id, function($q) use ($request) {
                $q->where('department_id', $request->department_id);
            })
            ->when($request->status, function($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Teachers/Index', [
            'teachers'    => $teachers,
            'departments' => Department::where('status', 'active')->get(),
            'filters'     => $request->only(['search', 'department_id', 'status']),
        ]);
    }

    public function create()
    {
        $departments = Department::where('status', 'active')->get();
        return Inertia::render('Teachers/Create', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:teachers',
            'phone'         => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'qualification' => 'required|string',
            'gender'        => 'required|in:male,female',
            'joining_date'  => 'nullable|date',
            'salary'        => 'nullable|numeric',
            'address'       => 'nullable|string',
        ]);

        $user = User::create([
    'name'     => $request->name,
    'email'    => $request->email,
    'password' => Hash::make($request->password ?? '123456'),
    'role'     => 'teacher',
]);

$teacher = Teacher::create([
    'user_id'       => $user->id,
    'name'          => $request->name,
    'email'         => $request->email,
            'phone'         => $request->phone,
            'department_id' => $request->department_id,
            'subject'       => '',
            'subject_ids'   => [],
            'qualification' => $request->qualification,
            'gender'        => $request->gender,
            'joining_date'  => $request->joining_date,
            'salary'        => $request->salary,
            'address'       => $request->address,
        ]);

        if ($request->educations) {
            foreach ($request->educations as $edu) {
                if (!empty($edu['degree'])) {
                    TeacherEducation::create([
                        'teacher_id'     => $teacher->id,
                        'degree'         => $edu['degree'],
                        'institution'    => $edu['institution'] ?? '',
                        'field_of_study' => $edu['field_of_study'] ?? null,
                        'passing_year'   => $edu['passing_year'] ?? null,
                        'grade'          => $edu['grade'] ?? null,
                    ]);
                }
            }
        }

        return redirect()->route('teachers.index')->with('success', 'Teacher added successfully!');
    }

    public function show(Teacher $teacher)
{
    $teacher->load(['department', 'educations', 'classes']);
    $allClasses = SchoolClass::where('status', 'active')->get();

    return Inertia::render('Teachers/Show', [
        'teacher'    => $teacher,
        'subjects'   => [],
        'allClasses' => $allClasses,
    ]);
}

    public function edit(Teacher $teacher)
    {
        $teacher->load('educations');
        $departments = Department::where('status', 'active')->get();
        return Inertia::render('Teachers/Edit', [
            'teacher'     => $teacher,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:teachers,email,' . $teacher->id,
            'phone'         => 'nullable|string',
            'department_id' => 'nullable|exists:departments,id',
            'qualification' => 'required|string',
            'gender'        => 'required|in:male,female',
            'joining_date'  => 'nullable|date',
            'salary'        => 'nullable|numeric',
            'address'       => 'nullable|string',
            'status'        => 'required|in:active,inactive',
        ]);

        $teacher->update([
            'name'          => $request->name,
            'email'         => $request->email,
            'phone'         => $request->phone,
            'department_id' => $request->department_id,
            'qualification' => $request->qualification,
            'gender'        => $request->gender,
            'joining_date'  => $request->joining_date,
            'salary'        => $request->salary,
            'address'       => $request->address,
            'status'        => $request->status,
        ]);

        if ($request->educations !== null) {
            $teacher->educations()->delete();
            foreach ($request->educations as $edu) {
                if (!empty($edu['degree'])) {
                    TeacherEducation::create([
                        'teacher_id'     => $teacher->id,
                        'degree'         => $edu['degree'],
                        'institution'    => $edu['institution'] ?? '',
                        'field_of_study' => $edu['field_of_study'] ?? null,
                        'passing_year'   => $edu['passing_year'] ?? null,
                        'grade'          => $edu['grade'] ?? null,
                    ]);
                }
            }
        }

        return redirect()->route('teachers.index')->with('success', 'Teacher updated successfully!');
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();
        return redirect()->route('teachers.index')->with('success', 'Teacher deleted successfully!');
    }

    public function createLogin(Teacher $teacher)
{
    if ($teacher->user_id) {
        return redirect()->back()->with('error', 'Login already exists!');
    }

    $user = \App\Models\User::create([
        'name'     => $teacher->name,
        'email'    => $teacher->email,
        'password' => \Illuminate\Support\Facades\Hash::make('123456'),
        'role'     => 'teacher',
    ]);

    $teacher->update(['user_id' => $user->id]);

    return redirect()->back()->with('success', "Login created! Email: {$teacher->email} | Password: 123456");
}

public function changeLogin(Request $request, Teacher $teacher)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'nullable|min:6',
    ]);

    if (!$teacher->user_id) {
        return redirect()->back()->with('error', 'No login account found!');
    }

    $user = \App\Models\User::find($teacher->user_id);

    $updateData = ['email' => $request->email, 'name' => $teacher->name];

    if ($request->password) {
        $updateData['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
    }

    $user->update($updateData);
    $teacher->update(['email' => $request->email]);

    return redirect()->back()->with('success', 'Login credentials updated successfully!');
}


public function assignClasses(Request $request, Teacher $teacher)
{
    $request->validate([
        'class_ids' => 'array',
        'class_ids.*' => 'exists:school_classes,id',
    ]);

    $teacher->classes()->sync($request->class_ids ?? []);

    return redirect()->back()->with('success', 'Classes assigned successfully!');
}




    public function attendance(Request $request)
{
    $date = $request->date ?? today()->format('Y-m-d');

    $teachers = Teacher::where('status', 'active')
        ->with(['department', 'attendances' => function($q) use ($date) {
            $q->whereDate('date', $date);
        }])->get();

    return Inertia::render('Teachers/Attendance', [
        'teachers' => $teachers,
        'date'     => $date,
    ]);
}

    public function saveAttendance(Request $request)
    {
        $request->validate([
            'date'        => 'required|date',
            'attendances' => 'required|array',
        ]);

        foreach ($request->attendances as $teacherId => $data) {
            TeacherAttendance::updateOrCreate(
                ['teacher_id' => $teacherId, 'date' => $request->date],
                ['status' => $data['status'], 'remarks' => $data['remarks'] ?? null]
            );
        }

        return redirect()->back()->with('success', 'Attendance saved successfully!');
    }

   public function attendanceReport(Request $request)
{
    $teachers = Teacher::where('status', 'active')->with('department')->get();

    $report = null;

    if ($request->has('month')) {
        $query = Teacher::where('status', 'active')
            ->with(['department', 'attendances' => function($q) use ($request) {
                $q->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year)
                  ->orderBy('date');
            }]);

        if ($request->teacher_id) {
            $query->where('id', $request->teacher_id);
        }

        $report = $query->get()->map(function($teacher) {
            $attendances = $teacher->attendances;
            $present = $attendances->where('status', 'present')->count();
            $absent  = $attendances->where('status', 'absent')->count();
            $late    = $attendances->where('status', 'late')->count();
            $leave   = $attendances->where('status', 'leave')->count();
            $total   = $attendances->count();

            return [
                'teacher_id' => $teacher->id,
                'name'       => $teacher->name,
                'department' => $teacher->department?->name,
                'present'    => $present,
                'absent'     => $absent,
                'late'       => $late,
                'leave'      => $leave,
                'total'      => $total,
                'percentage' => $total > 0 ? round((($present + $late) / $total) * 100) : 0,
                'records'    => $attendances->map(fn($a) => [
                    'date'    => $a->date,
                    'status'  => $a->status,
                    'remarks' => $a->remarks,
                ])->values(),
            ];
        })->values();
    }

    return Inertia::render('Teachers/AttendanceReport', [
        'teachers' => $teachers,
        'report'   => $report,
    ]);
}
}