import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({
    schoolName,
    schoolTagline,
    schoolLogo,
    totalStudents,
    totalTeachers,
    totalClasses,
    totalDepartments,
    totalFees,
    totalPendingFees,
    todayTeacherAttendance,
    latestStudents,
    userRole,
}) {
    const isAdmin = userRole === "admin";

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-4 px-4 md:py-8 md:px-6 space-y-6">
                {/* Welcome Banner */}
                <div
                    className={`rounded-2xl p-6 text-white ${isAdmin ? "bg-gradient-to-r from-blue-600 to-blue-800" : "bg-gradient-to-r from-green-600 to-green-800"}`}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                {schoolLogo && (
                                    <img
                                        src={`/storage/${schoolLogo}`}
                                        alt="Logo"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-50"
                                    />
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {schoolName}
                                    </h2>
                                    <p className="mt-1 opacity-90 text-sm">
                                        {schoolTagline ||
                                            (isAdmin
                                                ? "Complete school overview at a glance!"
                                                : "Mark today's attendance and manage results!")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-6xl opacity-20">
                            {isAdmin ? "🏫" : "📚"}
                        </div>
                    </div>
                </div>

                {/* Main Stats */}
                {isAdmin && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/students"
                            className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Total Students
                                    </p>
                                    <h2 className="text-4xl font-bold text-blue-600 mt-1">
                                        {totalStudents}
                                    </h2>
                                    <p className="text-xs text-blue-400 mt-2">
                                        View All →
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                    🎓
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/teachers"
                            className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Total Teachers
                                    </p>
                                    <h2 className="text-4xl font-bold text-green-600 mt-1">
                                        {totalTeachers}
                                    </h2>
                                    <p className="text-xs text-green-400 mt-2">
                                        View All →
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                    👨‍🏫
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/departments"
                            className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Departments
                                    </p>
                                    <h2 className="text-4xl font-bold text-purple-600 mt-1">
                                        {totalDepartments}
                                    </h2>
                                    <p className="text-xs text-purple-400 mt-2">
                                        View All →
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                                    🏢
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/classes"
                            className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Total Classes
                                    </p>
                                    <h2 className="text-4xl font-bold text-yellow-600 mt-1">
                                        {totalClasses}
                                    </h2>
                                    <p className="text-xs text-yellow-400 mt-2">
                                        View All →
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                                    🏫
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Fee Stats + Teacher Attendance */}
                {isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-emerald-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Total Fees Collected
                                    </p>
                                    <h2 className="text-3xl font-bold text-emerald-600 mt-1">
                                        Rs. {totalFees?.toLocaleString()}
                                    </h2>
                                    <Link
                                        href="/fees"
                                        className="text-xs text-emerald-400 mt-2 block"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                                    💰
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-400">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Pending Fees
                                    </p>
                                    <h2 className="text-3xl font-bold text-red-500 mt-1">
                                        Rs. {totalPendingFees?.toLocaleString()}
                                    </h2>
                                    <Link
                                        href="/fees"
                                        className="text-xs text-red-400 mt-2 block"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                                    ⚠️
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-400">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Teacher Attendance Today
                                    </p>
                                    <h2 className="text-3xl font-bold text-blue-500 mt-1">
                                        {todayTeacherAttendance?.present ?? 0}{" "}
                                        <span className="text-lg font-normal text-gray-400">
                                            /{" "}
                                            {todayTeacherAttendance?.total ?? 0}
                                        </span>
                                    </h2>
                                    <Link
                                        href="/teachers-attendance"
                                        className="text-xs text-blue-400 mt-2 block"
                                    >
                                        Mark Attendance →
                                    </Link>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                    ✅
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">
                        ⚡ Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <Link
                            href="/attendance"
                            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                            <span className="text-3xl">📋</span>
                            <span className="text-xs font-medium text-blue-700 text-center">
                                Student Attendance
                            </span>
                        </Link>
                        {isAdmin && (
                            <>
                                <Link
                                    href="/students/create"
                                    className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                                >
                                    <span className="text-3xl">➕</span>
                                    <span className="text-xs font-medium text-green-700 text-center">
                                        Add Student
                                    </span>
                                </Link>
                                <Link
                                    href="/teachers/create"
                                    className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                                >
                                    <span className="text-3xl">👨‍🏫</span>
                                    <span className="text-xs font-medium text-purple-700 text-center">
                                        Add Teacher
                                    </span>
                                </Link>
                                <Link
                                    href="/teachers-attendance"
                                    className="flex flex-col items-center gap-2 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
                                >
                                    <span className="text-3xl">✅</span>
                                    <span className="text-xs font-medium text-yellow-700 text-center">
                                        Teacher Attendance
                                    </span>
                                </Link>
                                <Link
                                    href="/exams"
                                    className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <span className="text-3xl">📝</span>
                                    <span className="text-xs font-medium text-red-700 text-center">
                                        Manage Exams
                                    </span>
                                </Link>
                            </>
                        )}
                        {!isAdmin && (
                            <Link
                                href="/results"
                                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                            >
                                <span className="text-3xl">🏆</span>
                                <span className="text-xs font-medium text-purple-700 text-center">
                                    View Results
                                </span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Latest Students */}
                {isAdmin && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-semibold text-gray-800">
                                🎓 Latest Students
                            </h3>
                            <Link
                                href="/students"
                                className="text-blue-500 text-sm hover:underline"
                            >
                                View All →
                            </Link>
                        </div>
                        {latestStudents.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-5xl">📭</span>
                                <p className="text-gray-400 mt-2">
                                    No students found
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-3">Student ID</th>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Class</th>
                                            <th className="p-3">Section</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestStudents.map((student) => (
                                            <tr
                                                key={student.id}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="p-3 font-mono text-xs text-blue-600 font-bold">
                                                    {student.student_id}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {student.name}
                                                </td>
                                                <td className="p-3">
                                                    {student.school_class
                                                        ?.name || "-"}
                                                </td>
                                                <td className="p-3">
                                                    {student.section
                                                        ? `Section ${student.section.name}`
                                                        : "-"}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                    >
                                                        {student.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Links */}
                {isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/fees"
                            className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                                💰
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Fee Management
                                </p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    View All Fees →
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/attendance/report"
                            className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                📈
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Attendance
                                </p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    View Reports →
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/results"
                            className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                                🏆
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Results</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    View Results →
                                </p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
