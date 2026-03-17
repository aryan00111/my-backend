<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\ParentController;
use App\Http\Controllers\Parent\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\FeeTypeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProgramController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// ── PUBLIC API ROUTES (for React Frontend) ────────────────
Route::prefix('api/public')->group(function () {
    Route::get('/blogs', [\App\Http\Controllers\Api\PublicController::class, 'blogs']);
    Route::get('/blogs/{slug}', [\App\Http\Controllers\Api\PublicController::class, 'blog']);
    Route::get('/announcements', [\App\Http\Controllers\Api\PublicController::class, 'announcements']);
    Route::get('/notices', [\App\Http\Controllers\Api\PublicController::class, 'notices']);
    Route::get('/gallery', [\App\Http\Controllers\Api\PublicController::class, 'gallery']);
    Route::post('/enrollment', [\App\Http\Controllers\EnrollmentController::class, 'store']);
    Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store']);
    Route::get('/programs', [\App\Http\Controllers\Api\PublicController::class, 'programs']);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // ── ADMIN + TEACHER ────────────────────────────────────
    Route::middleware('role:admin,teacher')->group(function () {

        Route::get('/dashboard', function () {
            $user = auth()->user();
            $todayAttendance = \App\Models\TeacherAttendance::whereDate('date', today());
            $settings = \App\Models\Setting::whereIn('key', ['school_name', 'school_tagline', 'school_logo'])
                ->pluck('value', 'key');

            return Inertia::render('Dashboard', [
                'schoolName'             => $settings['school_name'] ?? 'School Name',
                'schoolTagline'          => $settings['school_tagline'] ?? '',
                'schoolLogo'             => $settings['school_logo'] ?? null,
                'totalStudents'          => \App\Models\Student::count(),
                'totalTeachers'          => \App\Models\Teacher::count(),
                'totalClasses'           => \App\Models\SchoolClass::count(),
                'totalDepartments'       => \App\Models\Department::count(),
                'totalFees'              => \App\Models\Fee::where('status', 'paid')->sum('amount'),
                'totalPendingFees'       => \App\Models\Fee::where('status', 'pending')->sum('amount'),
                'todayTeacherAttendance' => [
                    'present' => (clone $todayAttendance)->where('status', 'present')->count(),
                    'total'   => \App\Models\Teacher::where('status', 'active')->count(),
                ],
                'latestStudents' => \App\Models\Student::with(['schoolClass', 'section'])->latest()->take(5)->get(),
                'userRole'       => $user->role,
            ]);
        })->name('dashboard');

        // Attendance
        Route::get('attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');
        Route::get('attendance/student-report', [AttendanceController::class, 'studentReport'])->name('attendance.student-report');
        Route::get('attendance/download-pdf', [AttendanceController::class, 'downloadPdf'])->name('attendance.download-pdf');
        Route::get('attendance/download-excel', [AttendanceController::class, 'downloadExcel'])->name('attendance.download-excel');
        Route::get('attendance/students', [AttendanceController::class, 'getStudents'])->name('attendance.students');
        Route::resource('attendance', AttendanceController::class)->only(['index', 'store']);
        Route::get('attendance/download-class-pdf', [AttendanceController::class, 'downloadClassPdf'])->name('attendance.download-class-pdf');
        Route::get('attendance/download-class-excel', [AttendanceController::class, 'downloadClassExcel'])->name('attendance.download-class-excel');
        Route::get('attendance/class-report', [AttendanceController::class, 'classReport'])->name('attendance.class-report');

        // Results
        Route::get('results', [ResultController::class, 'index'])->name('results.index');
        Route::get('results/class', [ResultController::class, 'classResults'])->name('results.class');
        Route::get('results/{exam}/entry', [ResultController::class, 'entry'])->name('results.entry');
        Route::post('results', [ResultController::class, 'store'])->name('results.store');
        Route::get('results/{exam}/show', [ResultController::class, 'show'])->name('results.show');
        Route::get('results/{exam}/pdf', [ResultController::class, 'downloadResultPdf'])->name('results.pdf');
        Route::get('results/student-pdf', [ResultController::class, 'studentResultPdf'])->name('results.student-pdf');

        // Fees
        Route::get('fees/class-view', [FeeController::class, 'classView'])->name('fees.class-view');
        Route::get('fees/student-fees', [FeeController::class, 'studentFees'])->name('fees.student-fees');
        Route::get('fees/receipt/{fee}', [FeeController::class, 'downloadReceipt'])->name('fees.receipt');
        Route::resource('fees', FeeController::class);
        Route::resource('fee-types', FeeTypeController::class)->only(['index', 'store', 'update', 'destroy']);

        // Settings
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
        Route::post('settings/change-password', [SettingController::class, 'changePassword'])->name('settings.change-password');
    });

    // ── ADMIN ONLY ─────────────────────────────────────────
    Route::middleware('role:admin')->group(function () {

    Route::resource('programs', ProgramController::class)->except(['show', 'create', 'edit']);

        // Classes & Sections
        Route::resource('classes', SchoolClassController::class)->except(['show', 'create', 'edit']);
        Route::post('sections', [SectionController::class, 'store'])->name('sections.store');
        Route::put('sections/{section}', [SectionController::class, 'update'])->name('sections.update');
        Route::delete('sections/{section}', [SectionController::class, 'destroy'])->name('sections.destroy');

        // Students
        Route::resource('students', StudentController::class);

        // Teachers
        Route::resource('teachers', TeacherController::class);
        Route::post('teachers/{teacher}/create-login', [TeacherController::class, 'createLogin'])->name('teachers.create-login');
        Route::post('teachers/{teacher}/change-login', [TeacherController::class, 'changeLogin'])->name('teachers.change-login');
        Route::post('teachers/{teacher}/assign-classes', [TeacherController::class, 'assignClasses'])->name('teachers.assign-classes');
        Route::get('teachers-attendance', [TeacherController::class, 'attendance'])->name('teachers.attendance');
        Route::post('teachers-attendance', [TeacherController::class, 'saveAttendance'])->name('teachers.save-attendance');
        Route::get('teachers-attendance-report', [TeacherController::class, 'attendanceReport'])->name('teachers.attendance-report');

        // Departments
        Route::resource('departments', DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);

        // Subjects
        Route::get('subjects/class', [SubjectController::class, 'classSubjects'])->name('subjects.class');
        Route::resource('subjects', SubjectController::class)->except(['show', 'create', 'edit']);

        // Exams
        Route::get('exams/class', [ExamController::class, 'classExams'])->name('exams.class');
        Route::get('exams/detail', [ExamController::class, 'examDetail'])->name('exams.detail');
        Route::get('exams/schedule-pdf', [ExamController::class, 'schedulePdf'])->name('exams.schedule-pdf');
        Route::post('exams/subject-dates', [ExamController::class, 'saveSubjectDates'])->name('exams.subject-dates');
        Route::post('exams/{exam}/publish', [ExamController::class, 'publish'])->name('exams.publish');
        Route::resource('exams', ExamController::class)->except(['show', 'create', 'edit']);

        // Parents
        Route::resource('parents', ParentController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::post('parents/{parent}/change-password', [ParentController::class, 'changePassword'])->name('parents.change-password');

        // Blog, Announcements, Notices
        Route::resource('blogs', BlogController::class)->except(['show', 'create', 'edit']);
        Route::resource('announcements', AnnouncementController::class)->except(['show', 'create', 'edit']);
        Route::resource('notices', NoticeController::class)->except(['show', 'create', 'edit']);

        // Gallery
        Route::resource('gallery', GalleryController::class)->except(['show', 'create', 'edit']);

        // Enrollments
Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
Route::get('enrollments/{enrollment}', [EnrollmentController::class, 'show'])->name('enrollments.show');
Route::post('enrollments/{enrollment}/status', [EnrollmentController::class, 'updateStatus'])->name('enrollments.status');
Route::delete('enrollments/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

        // Contact Messages
Route::get('contact', [ContactController::class, 'index'])->name('contact.index');
Route::get('contact/{contact}', [ContactController::class, 'show'])->name('contact.show');
Route::post('contact/{contact}/reply', [ContactController::class, 'reply'])->name('contact.reply');
Route::delete('contact/{contact}', [ContactController::class, 'destroy'])->name('contact.destroy');

    });

    // ── TEACHER PANEL ──────────────────────────────────────
    Route::middleware(['auth', 'verified', 'role:teacher'])->group(function () {
        Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'dashboard'])->name('teacher.dashboard');
        Route::get('/teacher/students', [TeacherDashboardController::class, 'students'])->name('teacher.students');
        Route::get('/teacher/attendance', [TeacherDashboardController::class, 'attendance'])->name('teacher.attendance');
        Route::post('/teacher/attendance', [TeacherDashboardController::class, 'saveAttendance'])->name('teacher.save-attendance');
        Route::get('/teacher/results', [TeacherDashboardController::class, 'results'])->name('teacher.results');
        Route::get('/teacher/profile', [TeacherDashboardController::class, 'profile'])->name('teacher.profile');
        Route::get('/teacher/results/{exam}/show', [TeacherDashboardController::class, 'showResult'])->name('teacher.results.show');
        Route::post('/teacher/change-password', [TeacherDashboardController::class, 'changePassword'])->name('teacher.change-password');
        Route::get('/teacher/results/{exam}/entry', [TeacherDashboardController::class, 'resultEntry'])->name('teacher.results.entry');
        Route::post('/teacher/results/store', [TeacherDashboardController::class, 'resultStore'])->name('teacher.results.store');
        Route::get('/teacher/attendance/student-dates', [TeacherDashboardController::class, 'studentDates'])->name('teacher.attendance.student-dates');
        Route::get('/teacher/attendance/report', [TeacherDashboardController::class, 'attendanceReport'])->name('teacher.attendance.report');
    });

    // ── PARENT PANEL ───────────────────────────────────────
    Route::middleware(['auth', 'verified', 'role:parent'])->group(function () {
        Route::get('/parent/dashboard', [DashboardController::class, 'dashboard'])->name('parent.dashboard');
        Route::get('/parent/attendance', [DashboardController::class, 'attendance'])->name('parent.attendance');
        Route::get('/parent/fees', [DashboardController::class, 'fees'])->name('parent.fees');
        Route::get('/parent/results', [DashboardController::class, 'results'])->name('parent.results');
        Route::post('/parent/change-password', [DashboardController::class, 'changePassword'])->name('parent.change-password');
    });

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';