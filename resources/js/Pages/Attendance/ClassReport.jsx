import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function ClassReport({
    class: cls,
    students,
    month,
    year,
    monthName,
}) {
    const [expandedStudent, setExpandedStudent] = useState(null);

    const totalPresent = students.reduce((sum, s) => sum + s.present, 0);
    const totalAbsent = students.reduce((sum, s) => sum + s.absent, 0);
    const totalLate = students.reduce((sum, s) => sum + s.late, 0);
    const avgPct =
        students.length > 0
            ? Math.round(
                  students.reduce((sum, s) => sum + s.percentage, 0) /
                      students.length,
              )
            : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Class Attendance Report" />

            <div className="py-8 px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            📋 Class Attendance Report
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {cls.name} — {monthName} {year}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/attendance/download-class-pdf?class_id=${cls.id}&month=${month}&year=${year}`}
                            target="_blank"
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                        >
                            📄 PDF
                        </a>
                        <a
                            href={`/attendance/download-class-excel?class_id=${cls.id}&month=${month}&year=${year}`}
                            target="_blank"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                        >
                            📊 Excel
                        </a>
                        <Link
                            href="/attendance/report"
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                        <p className="text-3xl font-bold text-blue-600">
                            {students.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Students
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                        <p className="text-3xl font-bold text-green-600">
                            {totalPresent}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Present
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                        <p className="text-3xl font-bold text-red-500">
                            {totalAbsent}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Absent
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-yellow-500">
                        <p className="text-3xl font-bold text-yellow-500">
                            {totalLate}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total Late</p>
                    </div>
                    <div
                        className={`bg-white rounded-xl shadow p-4 text-center border-l-4 ${
                            avgPct >= 75
                                ? "border-green-500"
                                : avgPct >= 50
                                  ? "border-yellow-500"
                                  : "border-red-500"
                        }`}
                    >
                        <p
                            className={`text-3xl font-bold ${
                                avgPct >= 75
                                    ? "text-green-600"
                                    : avgPct >= 50
                                      ? "text-yellow-500"
                                      : "text-red-500"
                            }`}
                        >
                            {avgPct}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Avg Attendance
                        </p>
                    </div>
                </div>

                {/* Students List */}
                {students.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">📭</p>
                        <p className="text-gray-400">
                            Is month ki koi attendance nahi hai
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {students.map((s, i) => (
                            <div
                                key={s.id}
                                className="bg-white rounded-xl shadow overflow-hidden"
                            >
                                {/* Student Row */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() =>
                                        setExpandedStudent(
                                            expandedStudent === s.id
                                                ? null
                                                : s.id,
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 text-sm w-6">
                                            {i + 1}
                                        </span>
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {s.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {s.student_id}{" "}
                                                {s.section !== "-"
                                                    ? `| Sec ${s.section}`
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-green-600">
                                                {s.present}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Present
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-red-500">
                                                {s.absent}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Absent
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-yellow-500">
                                                {s.late}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Late
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        s.percentage >= 75
                                                            ? "bg-green-500"
                                                            : s.percentage >= 50
                                                              ? "bg-yellow-500"
                                                              : "bg-red-500"
                                                    }`}
                                                    style={{
                                                        width: `${s.percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-bold ${
                                                    s.percentage >= 75
                                                        ? "text-green-600"
                                                        : s.percentage >= 50
                                                          ? "text-yellow-600"
                                                          : "text-red-600"
                                                }`}
                                            >
                                                {s.percentage}%
                                            </span>
                                        </div>
                                        <span className="text-gray-400 text-sm">
                                            {expandedStudent === s.id
                                                ? "▲"
                                                : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Records */}
                                {expandedStudent === s.id && (
                                    <div className="border-t">
                                        {s.records.length === 0 ? (
                                            <p className="text-center text-gray-400 py-4 text-sm">
                                                Koi record nahi
                                            </p>
                                        ) : (
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="p-3 text-left">
                                                            #
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Date
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Day
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Status
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Remarks
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {s.records.map((rec, j) => (
                                                        <tr
                                                            key={j}
                                                            className={`border-t ${
                                                                rec.status ===
                                                                "absent"
                                                                    ? "bg-red-50"
                                                                    : rec.status ===
                                                                        "late"
                                                                      ? "bg-yellow-50"
                                                                      : ""
                                                            }`}
                                                        >
                                                            <td className="p-3 text-gray-400">
                                                                {j + 1}
                                                            </td>
                                                            <td className="p-3">
                                                                {rec.date}
                                                            </td>
                                                            <td className="p-3 text-gray-500">
                                                                {new Date(
                                                                    rec.date,
                                                                ).toLocaleDateString(
                                                                    "en",
                                                                    {
                                                                        weekday:
                                                                            "long",
                                                                    },
                                                                )}
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
                                                                {rec.remarks ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
