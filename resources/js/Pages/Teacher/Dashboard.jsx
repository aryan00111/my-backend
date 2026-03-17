import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({
    teacher,
    totalStudents,
    totalClasses,
    presentToday,
    totalToday,
    recentAttendance,
    classes,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Teacher Dashboard" />

            {/* Header */}
            <header className="bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {schoolLogo ? (
                        <img
                            src={`/storage/${schoolLogo}`}
                            alt="Logo"
                            className="w-9 h-9 object-contain rounded"
                        />
                    ) : (
                        <span className="text-2xl">🏫</span>
                    )}
                    <div>
                        <h1 className="text-base md:text-lg font-bold text-gray-800">
                            {schoolName}
                        </h1>
                        <p className="text-xs text-gray-500">Teacher Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="hidden sm:block text-sm text-gray-600">
                        👋 {teacher.name}
                    </span>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                        Logout
                    </Link>
                </div>
            </header>

            {/* Nav — Desktop */}
            <nav className="bg-blue-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link
                    href="/teacher/dashboard"
                    className="hover:text-blue-200 font-medium"
                >
                    📊 Dashboard
                </Link>
                <Link href="/teacher/students" className="hover:text-blue-200">
                    🎓 Students
                </Link>
                <Link
                    href="/teacher/attendance"
                    className="hover:text-blue-200"
                >
                    📋 Attendance
                </Link>
                <Link href="/teacher/results" className="hover:text-blue-200">
                    🏆 Results
                </Link>
                <Link href="/teacher/profile" className="hover:text-blue-200">
                    👤 Profile
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-blue-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">📊 Dashboard</span>
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="text-white text-xl"
                >
                    ☰
                </button>
            </div>
            {mobileNavOpen && (
                <div className="bg-blue-800 text-white md:hidden flex flex-col text-sm">
                    <Link
                        href="/teacher/dashboard"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        href="/teacher/students"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        🎓 Students
                    </Link>
                    <Link
                        href="/teacher/attendance"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        📋 Attendance
                    </Link>
                    <Link
                        href="/teacher/results"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        🏆 Results
                    </Link>
                    <Link
                        href="/teacher/profile"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700"
                    >
                        👤 Profile
                    </Link>
                </div>
            )}

            <div className="px-4 md:px-6 py-6 md:py-8">
                {/* Teacher Info Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 md:p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                            {teacher.name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">
                                {teacher.name}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-1 text-blue-100 text-sm">
                                <span>📧 {teacher.email}</span>
                                {teacher.department && (
                                    <span>🏢 {teacher.department.name}</span>
                                )}
                                <span>🎓 {teacher.qualification}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Students</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">
                            {totalStudents}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500">Total Classes</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
                            {totalClasses}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-purple-500">
                        <p className="text-sm text-gray-500">Present Today</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mt-1">
                            {presentToday}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-500">
                            Attendance Taken
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 mt-1">
                            {totalToday}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Classes */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            🏫 Classes
                        </h3>
                        {classes.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">
                                No classes found
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {classes.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="flex justify-between items-center py-2 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {cls.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {cls.sections?.length || 0}{" "}
                                                sections
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                {cls.students_count} students
                                            </span>
                                            <Link
                                                href={`/teacher/attendance?class_id=${cls.id}`}
                                                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                            >
                                                Attendance
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Attendance */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Today's Attendance
                            </h3>
                            <Link
                                href="/teacher/attendance"
                                className="text-blue-500 text-xs hover:underline"
                            >
                                View All →
                            </Link>
                        </div>
                        {recentAttendance.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">
                                No attendance taken today
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {recentAttendance.map((att) => (
                                    <div
                                        key={att.id}
                                        className="flex justify-between items-center py-2 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {att.student?.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {
                                                    att.student?.school_class
                                                        ?.name
                                                }
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                att.status === "present"
                                                    ? "bg-green-100 text-green-700"
                                                    : att.status === "late"
                                                      ? "bg-yellow-100 text-yellow-700"
                                                      : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {att.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
