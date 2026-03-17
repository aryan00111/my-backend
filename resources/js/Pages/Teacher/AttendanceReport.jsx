import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AttendanceReport({
    teacher,
    classes,
    report,
    filters,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";
    const currentYear = new Date().getFullYear();
    const [classId, setClassId] = useState(filters?.class_id || "");
    const [month, setMonth] = useState(
        filters?.month || new Date().getMonth() + 1,
    );
    const [year, setYear] = useState(filters?.year || currentYear);
    const [expandedStudent, setExpandedStudent] = useState(null);

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    const years = Array.from({ length: 19 }, (_, i) => currentYear + 15 - i);

    const applyFilter = () => {
        router.get(
            "/teacher/attendance/report",
            { class_id: classId, month, year },
            { preserveState: true, replace: true },
        );
    };

    const avgAttendance =
        report?.length > 0
            ? Math.round(
                  report.reduce((sum, r) => sum + r.percentage, 0) /
                      report.length,
              )
            : 0;

    const getColor = (pct) => {
        if (pct >= 75) return "text-green-600";
        if (pct >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getBg = (pct) => {
        if (pct >= 75) return "bg-green-100 text-green-700";
        if (pct >= 50) return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Attendance Report" />

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
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                    Logout
                </Link>
            </header>

            {/* Nav — Desktop */}
            <nav className="bg-blue-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link href="/teacher/dashboard" className="hover:text-blue-200">
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
                <Link
                    href="/teacher/attendance/report"
                    className="hover:text-blue-200 font-medium"
                >
                    📊 Att. Report
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
                <span className="text-sm font-medium">📊 Att. Report</span>
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
                        href="/teacher/attendance/report"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        📊 Att. Report
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
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📊 Attendance Report
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Monthly student attendance summary
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Class
                        </label>
                        <select
                            value={classId}
                            onChange={(e) => setClassId(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Month
                        </label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Year
                        </label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={applyFilter}
                        disabled={!classId}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                        🔍 Generate Report
                    </button>
                </div>

                {/* Summary Stats */}
                {report && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                            <p className="text-3xl font-bold text-blue-600">
                                {report.length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Total Students
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                            <p className="text-3xl font-bold text-green-600">
                                {
                                    report.filter((r) => r.percentage >= 75)
                                        .length
                                }
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Good (75%+)
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                            <p className="text-3xl font-bold text-red-500">
                                {report.filter((r) => r.percentage < 75).length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Low (Below 75%)
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-purple-500">
                            <p className="text-3xl font-bold text-purple-600">
                                {avgAttendance}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Class Average
                            </p>
                        </div>
                    </div>
                )}

                {/* Report Table */}
                {report === null ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center text-gray-400">
                        <p className="text-5xl mb-3">📊</p>
                        <p>
                            Select class, month and year then click Generate
                            Report
                        </p>
                    </div>
                ) : report.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center text-gray-400">
                        <p className="text-5xl mb-3">📭</p>
                        <p>No attendance records found for this period</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">
                                {months.find((m) => m.value == month)?.label}{" "}
                                {year} — Attendance Report
                            </h3>
                            <span className="text-sm text-gray-500">
                                {report.length} students
                            </span>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Student</th>
                                    <th className="p-4 text-center">Roll No</th>
                                    <th className="p-4 text-center bg-green-50">
                                        Present
                                    </th>
                                    <th className="p-4 text-center bg-red-50">
                                        Absent
                                    </th>
                                    <th className="p-4 text-center bg-yellow-50">
                                        Late
                                    </th>
                                    <th className="p-4 text-center bg-blue-50">
                                        Leave
                                    </th>
                                    <th className="p-4 text-center">
                                        Total Days
                                    </th>
                                    <th className="p-4 text-center">
                                        Attendance %
                                    </th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((row, i) => (
                                    <>
                                        <tr
                                            key={row.student_id}
                                            className={`border-t hover:bg-gray-50 ${row.percentage < 75 ? "bg-red-50" : ""}`}
                                        >
                                            <td className="p-4 text-gray-400">
                                                {i + 1}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() =>
                                                        setExpandedStudent(
                                                            expandedStudent ===
                                                                row.student_id
                                                                ? null
                                                                : row.student_id,
                                                        )
                                                    }
                                                    className="font-bold text-blue-600 hover:underline text-left"
                                                >
                                                    {row.name}{" "}
                                                    {expandedStudent ===
                                                    row.student_id
                                                        ? "▲"
                                                        : "▼"}
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.roll_number || "-"}
                                            </td>
                                            <td className="p-4 text-center font-bold text-green-600">
                                                {row.present}
                                            </td>
                                            <td className="p-4 text-center font-bold text-red-500">
                                                {row.absent}
                                            </td>
                                            <td className="p-4 text-center font-bold text-yellow-600">
                                                {row.late}
                                            </td>
                                            <td className="p-4 text-center font-bold text-blue-500">
                                                {row.leave}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.total}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${row.percentage >= 75 ? "bg-green-500" : row.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                                            style={{
                                                                width: `${row.percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span
                                                        className={`font-bold text-xs ${getColor(row.percentage)}`}
                                                    >
                                                        {row.percentage}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBg(row.percentage)}`}
                                                >
                                                    {row.percentage >= 75
                                                        ? "✅ Good"
                                                        : row.percentage >= 50
                                                          ? "⚠️ Average"
                                                          : "❌ Low"}
                                                </span>
                                            </td>
                                        </tr>

                                        {/* Date-wise Expanded Row */}
                                        {expandedStudent === row.student_id && (
                                            <tr key={`dates-${row.student_id}`}>
                                                <td
                                                    colSpan="10"
                                                    className="px-4 pb-4 bg-blue-50"
                                                >
                                                    <div className="pt-3">
                                                        <p className="text-xs font-semibold text-gray-600 mb-2">
                                                            📅 Date-wise
                                                            Attendance —{" "}
                                                            {
                                                                months.find(
                                                                    (m) =>
                                                                        m.value ==
                                                                        month,
                                                                )?.label
                                                            }{" "}
                                                            {year}
                                                        </p>
                                                        {(row.dates || [])
                                                            .length === 0 ? (
                                                            <p className="text-xs text-gray-400">
                                                                No records found
                                                            </p>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {(
                                                                    row.dates ||
                                                                    []
                                                                ).map((att) => (
                                                                    <div
                                                                        key={
                                                                            att.date
                                                                        }
                                                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                                                            att.status ===
                                                                            "present"
                                                                                ? "bg-green-100 text-green-700"
                                                                                : att.status ===
                                                                                    "absent"
                                                                                  ? "bg-red-100 text-red-700"
                                                                                  : att.status ===
                                                                                      "late"
                                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                                    : "bg-blue-100 text-blue-700"
                                                                        }`}
                                                                    >
                                                                        <span className="font-bold">
                                                                            {new Date(
                                                                                att.date,
                                                                            ).getDate()}
                                                                        </span>
                                                                        <span className="ml-1">
                                                                            {att.status ===
                                                                            "present"
                                                                                ? "P"
                                                                                : att.status ===
                                                                                    "absent"
                                                                                  ? "A"
                                                                                  : att.status ===
                                                                                      "late"
                                                                                    ? "L"
                                                                                    : "Le"}
                                                                        </span>
                                                                        {att.remarks && (
                                                                            <span className="ml-1 italic opacity-75">
                                                                                —{" "}
                                                                                {
                                                                                    att.remarks
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                                P = Present
                                                            </span>
                                                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                                                A = Absent
                                                            </span>
                                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                                                L = Late
                                                            </span>
                                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                                Le = Leave
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
