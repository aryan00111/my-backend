import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function Report({
    classes,
    selectedClass,
    students,
    month,
    year,
}) {
    const [selectedClassId, setSelectedClassId] = useState(
        selectedClass?.id || "",
    );
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);

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

    const handleSearch = () => {
        if (!selectedClassId) return;
        router.get("/attendance/report", {
            class_id: selectedClassId,
            month: selectedMonth,
            year: selectedYear,
        });
    };

    const totalStudents = students.length;
    const avgPercentage =
        totalStudents > 0
            ? Math.round(
                  students.reduce((sum, s) => sum + s.percentage, 0) /
                      totalStudents,
              )
            : 0;
    const totalPresent = students.reduce((sum, s) => sum + s.present, 0);
    const totalAbsent = students.reduce((sum, s) => sum + s.absent, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Attendance Report" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Filter Card */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        📈 Attendance Report
                    </h2>
                    <div className="flex gap-4 items-end flex-wrap">
                        <div className="flex-1 min-w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Class *
                            </label>
                            <select
                                value={selectedClassId}
                                onChange={(e) =>
                                    setSelectedClassId(e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Class</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Month
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {months.map((m, i) => (
                                    <option key={m} value={i + 1}>
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
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[
                                    2024, 2025, 2026, 2027, 2028, 2029, 2030,
                                    2031, 2032, 2033, 2034, 2035, 2036, 2037,
                                    2038, 2039, 2040,
                                ].map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={!selectedClassId}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                        >
                            Search
                        </button>
                        {selectedClass && students.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                <a
                                    href={`/attendance/class-report?class_id=${selectedClassId}&month=${selectedMonth}&year=${selectedYear}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                                >
                                    👁️ View All
                                </a>
                                <a
                                    href={`/attendance/download-class-pdf?class_id=${selectedClassId}&month=${selectedMonth}&year=${selectedYear}`}
                                    target="_blank"
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                                >
                                    📄 Class PDF
                                </a>
                                <a
                                    href={`/attendance/download-class-excel?class_id=${selectedClassId}&month=${selectedMonth}&year=${selectedYear}`}
                                    target="_blank"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                                >
                                    📊 Class Excel
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* No class selected */}
                {!selectedClass && (
                    <div className="bg-white rounded-xl shadow p-16 text-center text-gray-400">
                        <p className="text-5xl mb-3">📊</p>
                        <p>Select a class above to view the report</p>
                    </div>
                )}

                {/* Results */}
                {selectedClass && (
                    <>
                        {/* Class Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white">
                            <h3 className="text-xl font-bold">
                                {selectedClass.name} —{" "}
                                {months[selectedMonth - 1]} {selectedYear}
                            </h3>
                            <p className="text-blue-100 text-sm mt-1">
                                {totalStudents} Students
                            </p>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                                <p className="text-3xl font-bold text-blue-600">
                                    {totalStudents}
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
                            <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-purple-500">
                                <p className="text-3xl font-bold text-purple-600">
                                    {avgPercentage}%
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Avg Attendance
                                </p>
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className="bg-white rounded-xl shadow overflow-x-auto">
                            {students.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-5xl mb-3">📭</p>
                                    <p className="text-gray-400">
                                        No attendance records for this month
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-4">#</th>
                                            <th className="p-4">Student ID</th>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Section</th>
                                            <th className="p-4">Roll No</th>
                                            <th className="p-4">Present</th>
                                            <th className="p-4">Absent</th>
                                            <th className="p-4">Late</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Percentage</th>
                                            <th className="p-4">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((s, i) => (
                                            <tr
                                                key={s.id}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="p-4 text-gray-500">
                                                    {i + 1}
                                                </td>
                                                <td className="p-4 font-mono text-xs text-blue-600 font-bold">
                                                    {s.student_id}
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {s.name}
                                                </td>
                                                <td className="p-4">
                                                    {s.section !== "-" ? (
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                                            Sec {s.section}
                                                        </span>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {s.roll_number}
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        {s.present}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        {s.absent}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        {s.late}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {s.total}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${s.percentage >= 75 ? "bg-green-500" : s.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                                                style={{
                                                                    width: `${s.percentage}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            className={`text-xs font-bold ${s.percentage >= 75 ? "text-green-600" : s.percentage >= 50 ? "text-yellow-600" : "text-red-600"}`}
                                                        >
                                                            {s.percentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-1">
                                                        <a
                                                            href={`/attendance/student-report?student_id=${s.id}`}
                                                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                                                        >
                                                            View
                                                        </a>
                                                        <a
                                                            href={`/attendance/download-pdf?student_id=${s.id}`}
                                                            target="_blank"
                                                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                                        >
                                                            PDF
                                                        </a>
                                                        <a
                                                            href={`/attendance/download-excel?student_id=${s.id}`}
                                                            target="_blank"
                                                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                                        >
                                                            XLS
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
