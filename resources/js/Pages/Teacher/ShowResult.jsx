import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function ShowResult({
    teacher,
    exam,
    subjects,
    studentSummary,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [expandedStudent, setExpandedStudent] = useState(null);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";

    const gradeColors = {
        "A+": "bg-green-100 text-green-800",
        A: "bg-green-100 text-green-700",
        B: "bg-blue-100 text-blue-700",
        C: "bg-yellow-100 text-yellow-700",
        D: "bg-orange-100 text-orange-700",
        F: "bg-red-100 text-red-700",
    };

    const passCount = studentSummary.filter((s) => s.status === "pass").length;
    const failCount = studentSummary.filter((s) => s.status === "fail").length;
    const avgPct =
        studentSummary.length > 0
            ? Math.round(
                  studentSummary.reduce((sum, s) => sum + s.percentage, 0) /
                      studentSummary.length,
              )
            : 0;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Exam Results" />

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
                    href="/teacher/results"
                    className="hover:text-blue-200 font-medium"
                >
                    🏆 Results
                </Link>
                <Link href="/teacher/profile" className="hover:text-blue-200">
                    👤 Profile
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-blue-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">🏆 Results</span>
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
                {/* Exam Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-5 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/teacher/results"
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                            >
                                ← Back
                            </Link>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold">
                                    {exam.name}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {exam.school_class?.name} —{" "}
                                    {exam.type?.replace("_", " ")}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-xs">Exam Date</p>
                            <p className="font-bold">
                                {exam.start_date?.split("T")[0]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                        <p className="text-3xl font-bold text-blue-600">
                            {studentSummary.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Students
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                        <p className="text-3xl font-bold text-green-600">
                            {passCount}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Pass</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                        <p className="text-3xl font-bold text-red-500">
                            {failCount}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Fail</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-purple-500">
                        <p className="text-3xl font-bold text-purple-600">
                            {avgPct}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Class Average
                        </p>
                    </div>
                </div>

                {/* Students Results */}
                {studentSummary.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">📝</p>
                        <p className="text-gray-400">No results found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {studentSummary.map((item, i) => (
                            <div
                                key={item.student.id}
                                className="bg-white rounded-xl shadow overflow-hidden"
                            >
                                {/* Student Row */}
                                <div
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer hover:bg-gray-50 gap-3"
                                    onClick={() =>
                                        setExpandedStudent(
                                            expandedStudent === item.student.id
                                                ? null
                                                : item.student.id,
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 font-bold w-8 text-center">
                                            #{i + 1}
                                        </span>
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                            {item.student.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {item.student.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {item.student.student_id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="text-center">
                                            <p className="text-sm font-bold">
                                                {item.marks_obtained}/
                                                {item.total_marks}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Total Marks
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-blue-600">
                                                {item.percentage}%
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Percentage
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[item.grade] || "bg-gray-100"}`}
                                        >
                                            Grade {item.grade}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {item.status === "pass"
                                                ? "✅ Pass"
                                                : "❌ Fail"}
                                        </span>
                                        <span className="text-gray-400">
                                            {expandedStudent === item.student.id
                                                ? "▲"
                                                : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {/* Subject Details */}
                                {expandedStudent === item.student.id && (
                                    <div className="border-t overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 text-left">
                                                    <th className="p-3">#</th>
                                                    <th className="p-3">
                                                        Subject
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Obtained
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Total
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        %
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Grade
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.results.map((r, ri) => (
                                                    <tr
                                                        key={r.id}
                                                        className={`border-t ${r.status === "fail" ? "bg-red-50" : ""}`}
                                                    >
                                                        <td className="p-3 text-gray-400">
                                                            {ri + 1}
                                                        </td>
                                                        <td className="p-3 font-medium">
                                                            {r.subject?.name}
                                                        </td>
                                                        <td className="p-3 text-center font-bold">
                                                            {r.marks_obtained}
                                                        </td>
                                                        <td className="p-3 text-center text-gray-500">
                                                            {r.total_marks}
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            {r.percentage}%
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColors[r.grade] || "bg-gray-100"}`}
                                                            >
                                                                {r.grade ?? "-"}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.status === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                            >
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
