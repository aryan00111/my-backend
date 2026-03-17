import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function StudentReport({ student, attendances, summary }) {
    return (
        <AuthenticatedLayout>
            <Head title="Student Attendance Report" />

            <div className="py-8 px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            📋 Student Attendance Report
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {student.name} — {student.student_id}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/attendance/download-pdf?student_id=${student.id}`}
                            target="_blank"
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                        >
                            📄 Download PDF
                        </a>
                        <a
                            href={`/attendance/download-excel?student_id=${student.id}`}
                            target="_blank"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                        >
                            📊 Download Excel
                        </a>
                        <Link
                            href="/attendance/report"
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Student Info */}
                <div className="bg-white rounded-xl shadow p-5 mb-6">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Name</p>
                            <p className="font-bold">{student.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Student ID</p>
                            <p className="font-bold font-mono text-blue-600">
                                {student.student_id}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Class</p>
                            <p className="font-bold">
                                {student.school_class?.name || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Section</p>
                            <p className="font-bold">
                                {student.section?.name || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                        <p className="text-3xl font-bold text-blue-600">
                            {summary.total}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total Days</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                        <p className="text-3xl font-bold text-green-600">
                            {summary.present}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Present</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                        <p className="text-3xl font-bold text-red-500">
                            {summary.absent}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Absent</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-yellow-500">
                        <p className="text-3xl font-bold text-yellow-500">
                            {summary.late}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Late</p>
                    </div>
                    <div
                        className={`bg-white rounded-xl shadow p-4 text-center border-l-4 ${
                            summary.percentage >= 75
                                ? "border-green-500"
                                : summary.percentage >= 50
                                  ? "border-yellow-500"
                                  : "border-red-500"
                        }`}
                    >
                        <p
                            className={`text-3xl font-bold ${
                                summary.percentage >= 75
                                    ? "text-green-600"
                                    : summary.percentage >= 50
                                      ? "text-yellow-500"
                                      : "text-red-500"
                            }`}
                        >
                            {summary.percentage}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Attendance %
                        </p>
                    </div>
                </div>

                {/* Month wise data */}
                {attendances.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">📭</p>
                        <p className="text-gray-400">
                            Koi attendance record nahi hai
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {attendances.map((month, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow overflow-hidden"
                            >
                                {/* Month Header */}
                                <div className="bg-blue-600 px-5 py-3 flex justify-between items-center text-white">
                                    <h3 className="font-bold">{month.month}</h3>
                                    <div className="flex gap-4 text-sm">
                                        <span>Total: {month.total}</span>
                                        <span className="text-green-300">
                                            Present: {month.present}
                                        </span>
                                        <span className="text-red-300">
                                            Absent: {month.absent}
                                        </span>
                                        <span className="text-yellow-300">
                                            Late: {month.late}
                                        </span>
                                        <span className="font-bold">
                                            {month.percentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Records Table */}
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-3">#</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Day</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {month.records.map((rec, j) => (
                                            <tr
                                                key={j}
                                                className={`border-t ${
                                                    rec.status === "absent"
                                                        ? "bg-red-50"
                                                        : rec.status === "late"
                                                          ? "bg-yellow-50"
                                                          : ""
                                                }`}
                                            >
                                                <td className="p-3 text-gray-400">
                                                    {j + 1}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {rec.date}
                                                </td>
                                                <td className="p-3 text-gray-500">
                                                    {new Date(
                                                        rec.date,
                                                    ).toLocaleDateString("en", {
                                                        weekday: "long",
                                                    })}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            rec.status ===
                                                            "present"
                                                                ? "bg-green-100 text-green-700"
                                                                : rec.status ===
                                                                    "absent"
                                                                  ? "bg-red-100 text-red-700"
                                                                  : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                    >
                                                        {rec.status ===
                                                        "present"
                                                            ? "✅"
                                                            : rec.status ===
                                                                "absent"
                                                              ? "❌"
                                                              : "⏰"}{" "}
                                                        {rec.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-gray-500">
                                                    {rec.remarks || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
