import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({
    student,
    totalFees,
    paidFees,
    pendingFees,
    attendance,
    totalPresent,
    totalAbsent,
    recentAttendance,
    recentFees,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Parent Dashboard" />

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
                        <p className="text-xs text-gray-500">Parent Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="hidden sm:block text-sm text-gray-600">
                        👋 Welcome, Parent
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
            <nav className="bg-green-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link
                    href="/parent/dashboard"
                    className="hover:text-green-200 font-medium"
                >
                    📊 Dashboard
                </Link>
                <Link
                    href="/parent/attendance"
                    className="hover:text-green-200"
                >
                    📋 Attendance
                </Link>
                <Link href="/parent/fees" className="hover:text-green-200">
                    💰 Fees
                </Link>
                <Link href="/parent/results" className="hover:text-green-200">
                    🏆 Results
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-green-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">📊 Parent Portal</span>
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="text-white text-xl"
                >
                    ☰
                </button>
            </div>
            {mobileNavOpen && (
                <div className="bg-green-800 text-white md:hidden flex flex-col text-sm">
                    <Link
                        href="/parent/dashboard"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700 border-b border-green-700"
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        href="/parent/attendance"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700 border-b border-green-700"
                    >
                        📋 Attendance
                    </Link>
                    <Link
                        href="/parent/fees"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700 border-b border-green-700"
                    >
                        💰 Fees
                    </Link>
                    <Link
                        href="/parent/results"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700"
                    >
                        🏆 Results
                    </Link>
                </div>
            )}

            <div className="px-4 md:px-6 py-6 md:py-8">
                {/* Student Info Card */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-5 md:p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                            🎓
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">
                                {student.name}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-1 text-green-100 text-sm">
                                <span>ID: {student.student_id}</span>
                                <span>Class: {student.school_class?.name}</span>
                                {student.section && (
                                    <span>Section: {student.section.name}</span>
                                )}
                                <span>Roll: {student.roll_number}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500">Attendance</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
                            {attendance}%
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            P: {totalPresent} | A: {totalAbsent}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Fees</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
                            Rs. {totalFees.toLocaleString()}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-purple-500">
                        <p className="text-sm text-gray-500">Paid Fees</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mt-1">
                            Rs. {paidFees.toLocaleString()}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 md:p-5 border-l-4 border-red-500">
                        <p className="text-sm text-gray-500">Pending Fees</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-red-500 mt-1">
                            Rs. {pendingFees.toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Attendance */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Recent Attendance
                            </h3>
                            <Link
                                href="/parent/attendance"
                                className="text-blue-500 text-xs hover:underline"
                            >
                                View All →
                            </Link>
                        </div>
                        {recentAttendance.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">
                                No attendance records
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {recentAttendance.map((att) => (
                                    <div
                                        key={att.id}
                                        className="flex justify-between items-center py-2 border-b last:border-0"
                                    >
                                        <span className="text-sm text-gray-600">
                                            {att.date}
                                        </span>
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

                    {/* Recent Fees */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Recent Fees
                            </h3>
                            <Link
                                href="/parent/fees"
                                className="text-blue-500 text-xs hover:underline"
                            >
                                View All →
                            </Link>
                        </div>
                        {recentFees.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">
                                No fee records
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {recentFees.map((fee) => (
                                    <div
                                        key={fee.id}
                                        className="flex justify-between items-center py-2 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {fee.fee_type}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {fee.month}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">
                                                Rs. {fee.amount}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    fee.status === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : fee.status ===
                                                            "partial"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {fee.status}
                                            </span>
                                        </div>
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
