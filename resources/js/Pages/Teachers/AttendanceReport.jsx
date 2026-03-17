import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

const statusColors = {
    present: "bg-green-100 text-green-700",
    absent: "bg-red-100 text-red-700",
    late: "bg-yellow-100 text-yellow-700",
    leave: "bg-blue-100 text-blue-700",
};

const statusDot = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-500",
    leave: "bg-blue-500",
};

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// View Modal — date wise attendance
const ViewModal = ({ teacher, month, year, onClose }) => {
    if (!teacher) return null;

    const records = teacher.records || [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">
                                {teacher.name}
                            </h2>
                            <p className="text-blue-200 text-sm mt-1">
                                {teacher.department || "No Department"}
                            </p>
                            <p className="text-blue-100 text-sm mt-1">
                                📅 {months[month - 1]} {year}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Summary badges */}
                    <div className="flex gap-3 mt-4 flex-wrap">
                        <span className="bg-green-500/30 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ✅ Present: {teacher.present}
                        </span>
                        <span className="bg-red-500/30 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ❌ Absent: {teacher.absent}
                        </span>
                        <span className="bg-yellow-500/30 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ⏰ Late: {teacher.late}
                        </span>
                        <span className="bg-blue-500/30 text-white px-3 py-1 rounded-full text-xs font-bold">
                            🏖️ Leave: {teacher.leave}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${teacher.percentage >= 75 ? "bg-green-500/30" : "bg-red-500/30"} text-white`}
                        >
                            📊 {teacher.percentage}%
                        </span>
                    </div>
                </div>

                {/* Date wise records */}
                <div className="p-6">
                    <h3 className="font-bold text-gray-700 mb-4 text-sm">
                        📋 Date-wise Attendance
                    </h3>

                    {records.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-2">📭</p>
                            <p className="text-gray-400 text-sm">
                                No attendance records found for this month
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                            {records.map((rec, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                                >
                                    {/* Date */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${statusDot[rec.status] || "bg-gray-400"}`}
                                        ></div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {new Date(
                                                    rec.date,
                                                ).toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            {rec.remarks && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    📝 {rec.remarks}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Status badge */}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[rec.status] || "bg-gray-100 text-gray-600"}`}
                                    >
                                        {rec.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AttendanceReport({ teachers, report: initialReport }) {
    const [filters, setFilters] = useState({
        teacher_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [report, setReport] = useState(initialReport || null);
    const [loading, setLoading] = useState(false);
    const [viewTeacher, setViewTeacher] = useState(null);

    const loadReport = () => {
        setLoading(true);
        router.get("/teachers-attendance-report", filters, {
            preserveState: true,
            onSuccess: (page) => {
                setReport(page.props.report);
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Teacher Attendance Report" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/teachers-attendance"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold">
                                📊 Teacher Attendance Report
                            </h3>
                            <p className="text-blue-100 text-sm">
                                Monthly attendance summary with date-wise
                                details
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teacher
                            </label>
                            <select
                                value={filters.teacher_id}
                                onChange={(e) =>
                                    setFilters((p) => ({
                                        ...p,
                                        teacher_id: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Teachers</option>
                                {teachers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Month
                            </label>
                            <select
                                value={filters.month}
                                onChange={(e) =>
                                    setFilters((p) => ({
                                        ...p,
                                        month: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {months.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <select
                                value={filters.year}
                                onChange={(e) =>
                                    setFilters((p) => ({
                                        ...p,
                                        year: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(
                                    (y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={loadReport}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {loading ? "Loading..." : "🔍 Generate Report"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Table */}
                {report ? (
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">
                                📅 {months[filters.month - 1]} {filters.year} —
                                Attendance Report
                            </h3>
                            <span className="text-sm text-gray-400">
                                {report.length} teachers
                            </span>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Teacher</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4 text-center text-green-600">
                                        Present
                                    </th>
                                    <th className="p-4 text-center text-red-600">
                                        Absent
                                    </th>
                                    <th className="p-4 text-center text-yellow-600">
                                        Late
                                    </th>
                                    <th className="p-4 text-center text-blue-600">
                                        Leave
                                    </th>
                                    <th className="p-4 text-center">Total</th>
                                    <th className="p-4 text-center">%</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((row, i) => (
                                    <tr
                                        key={row.teacher_id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {i + 1}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {row.name}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {row.department || "-"}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {row.present}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {row.absent}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {row.late}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {row.leave}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-bold">
                                            {row.total}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${row.percentage >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {row.percentage}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() =>
                                                    setViewTeacher(row)
                                                }
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 font-medium"
                                            >
                                                👁️ View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">📊</p>
                        <p className="text-gray-400">
                            Select filters and click Generate Report
                        </p>
                    </div>
                )}
            </div>

            {/* View Modal */}
            <ViewModal
                teacher={viewTeacher}
                month={filters.month}
                year={filters.year}
                onClose={() => setViewTeacher(null)}
            />
        </AuthenticatedLayout>
    );
}
