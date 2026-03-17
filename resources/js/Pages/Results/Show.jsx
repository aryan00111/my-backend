import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ exam, subjects, studentSummary }) {
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [showGrade, setShowGrade] = useState(true);

    const gradeColors = {
        "A+": "bg-green-100 text-green-800",
        A: "bg-green-100 text-green-700",
        "B+": "bg-blue-100 text-blue-800",
        B: "bg-blue-100 text-blue-700",
        C: "bg-yellow-100 text-yellow-700",
        D: "bg-orange-100 text-orange-700",
        F: "bg-red-100 text-red-700",
    };

    const statusColor = (status) =>
        status === "pass"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
    const statusLabel = (status) => (status === "pass" ? "✅ Pass" : "❌ Fail");

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
        <AuthenticatedLayout>
            <Head title="Exam Results" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-5 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/results/class?class_id=${exam.school_class_id}`}
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
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <label className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showGrade}
                                    onChange={(e) =>
                                        setShowGrade(e.target.checked)
                                    }
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-white">
                                    Show Grade
                                </span>
                            </label>
                            <a
                                href={`/results/${exam.id}/pdf?show_grade=${showGrade ? 1 : 0}`}
                                target="_blank"
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                            >
                                📄 Class PDF
                            </a>
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
                        <p className="text-5xl mb-3">📭</p>
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
                                        {showGrade && (
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColors[item.grade] || "bg-gray-100"}`}
                                            >
                                                Grade {item.grade}
                                            </span>
                                        )}
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(item.status)}`}
                                        >
                                            {statusLabel(item.status)}
                                        </span>
                                        <a
                                            href={`/results/student-pdf?student_id=${item.student.id}&exam_id=${exam.id}&show_grade=${showGrade ? 1 : 0}`}
                                            target="_blank"
                                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            📄 PDF
                                        </a>
                                        <span className="text-gray-400 ml-1">
                                            {expandedStudent === item.student.id
                                                ? "▲"
                                                : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {/* Subject Detail */}
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
                                                        Total
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Passing
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Theory
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Practical
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        Obtained
                                                    </th>
                                                    <th className="p-3 text-center">
                                                        %
                                                    </th>
                                                    {showGrade && (
                                                        <th className="p-3 text-center">
                                                            Grade
                                                        </th>
                                                    )}
                                                    <th className="p-3 text-center">
                                                        Status
                                                    </th>
                                                    <th className="p-3">
                                                        Remarks
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.results.map((r, ri) => {
                                                    const sub = subjects.find(
                                                        (s) =>
                                                            s.id ===
                                                            r.subject_id,
                                                    );
                                                    return (
                                                        <tr
                                                            key={r.id}
                                                            className={`border-t ${r.status === "fail" ? "bg-red-50" : ""}`}
                                                        >
                                                            <td className="p-3 text-gray-400">
                                                                {ri + 1}
                                                            </td>
                                                            <td className="p-3 font-medium">
                                                                {
                                                                    r.subject
                                                                        ?.name
                                                                }
                                                                {sub?.has_practical && (
                                                                    <span className="ml-1 bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded">
                                                                        +P
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {sub?.has_practical ? (
                                                                    <div className="text-xs">
                                                                        <div>
                                                                            T:{" "}
                                                                            {
                                                                                sub.theory_marks
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            P:{" "}
                                                                            {
                                                                                sub.practical_marks
                                                                            }
                                                                        </div>
                                                                        <div className="font-bold">
                                                                            ={" "}
                                                                            {
                                                                                r.total_marks
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    r.total_marks
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {sub?.has_practical ? (
                                                                    <div className="text-xs">
                                                                        <div>
                                                                            T:{" "}
                                                                            {
                                                                                sub.theory_passing
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            P:{" "}
                                                                            {
                                                                                sub.practical_passing
                                                                            }
                                                                        </div>
                                                                        <div className="font-bold">
                                                                            ={" "}
                                                                            {
                                                                                sub?.passing_marks
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    sub?.passing_marks
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center font-medium text-blue-700">
                                                                {r.theory_marks_obtained ??
                                                                    "-"}
                                                            </td>
                                                            <td className="p-3 text-center font-medium text-purple-700">
                                                                {sub?.has_practical
                                                                    ? (r.practical_marks_obtained ??
                                                                      "-")
                                                                    : "-"}
                                                            </td>
                                                            <td className="p-3 text-center font-bold">
                                                                {
                                                                    r.marks_obtained
                                                                }
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {r.percentage}%
                                                            </td>
                                                            {showGrade && (
                                                                <td className="p-3 text-center">
                                                                    <span
                                                                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColors[r.grade] || "bg-gray-100"}`}
                                                                    >
                                                                        {r.grade ??
                                                                            "-"}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            <td className="p-3 text-center">
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor(r.status)}`}
                                                                >
                                                                    {statusLabel(
                                                                        r.status,
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-gray-500 text-xs">
                                                                {r.remarks ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
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
