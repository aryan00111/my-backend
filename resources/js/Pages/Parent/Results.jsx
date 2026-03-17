import { Head, Link, usePage } from "@inertiajs/react";
import { useState, useRef } from "react";

export default function Results({ student, exams }) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";
    const printRef = useRef();

    const gradeColors = {
        "A+": "bg-green-100 text-green-700",
        A: "bg-green-100 text-green-600",
        B: "bg-blue-100 text-blue-600",
        C: "bg-yellow-100 text-yellow-600",
        D: "bg-orange-100 text-orange-600",
        F: "bg-red-100 text-red-600",
    };

    const examTypes = {
        unit_test: "Unit Test",
        half_yearly: "Half Yearly",
        annual: "Annual",
        other: "Other",
    };

    const handlePrint = (exam) => {
        const results = exam.results || [];
        const totalMarks = results.reduce(
            (sum, r) => sum + parseFloat(r.total_marks),
            0,
        );
        const obtainedMarks = results.reduce(
            (sum, r) => sum + parseFloat(r.marks_obtained),
            0,
        );
        const percentage =
            totalMarks > 0
                ? ((obtainedMarks / totalMarks) * 100).toFixed(1)
                : 0;
        const hasFail = results.some((r) => r.status === "fail");
        const overallGrade = () => {
            if (percentage >= 90) return "A+";
            if (percentage >= 80) return "A";
            if (percentage >= 70) return "B";
            if (percentage >= 60) return "C";
            if (percentage >= 50) return "D";
            return "F";
        };

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Result Card - ${student.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
                    .header { text-align: center; border-bottom: 2px solid #166534; padding-bottom: 15px; margin-bottom: 20px; }
                    .school-name { font-size: 22px; font-weight: bold; color: #166534; }
                    .school-sub { font-size: 13px; color: #666; margin-top: 3px; }
                    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
                    .student-info { background: #f0fdf4; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 30px; flex-wrap: wrap; }
                    .student-info span { font-size: 13px; }
                    .student-info strong { color: #166534; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th { background: #166534; color: white; padding: 8px 10px; text-align: left; font-size: 13px; }
                    td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
                    tr:nth-child(even) { background: #f9fafb; }
                    .summary { margin-top: 20px; background: #f0fdf4; padding: 12px 16px; border-radius: 8px; display: flex; gap: 30px; flex-wrap: wrap; }
                    .summary span { font-size: 14px; font-weight: bold; }
                    .pass { color: #16a34a; } .fail { color: #dc2626; }
                    .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 10px; }
                    @media print { body { padding: 15px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="school-name">${schoolName}</div>
                    <div class="school-sub">Result Card</div>
                    <div class="title">${exam.name} — ${examTypes[exam.type] || exam.type}</div>
                </div>
                <div class="student-info">
                    <span><strong>Name:</strong> ${student.name}</span>
                    <span><strong>ID:</strong> ${student.student_id}</span>
                    <span><strong>Class:</strong> ${student.school_class?.name || "-"}</span>
                    <span><strong>Roll No:</strong> ${student.roll_number || "-"}</span>
                    <span><strong>Exam Date:</strong> ${exam.exam_date ? new Date(exam.exam_date).toLocaleDateString("en-GB") : "-"}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Marks Obtained</th>
                            <th>Total Marks</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results
                            .map(
                                (r, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${r.subject?.name || "-"}</td>
                                <td><strong>${r.marks_obtained}</strong></td>
                                <td>${r.total_marks}</td>
                                <td>${r.percentage}%</td>
                                <td>${r.grade}</td>
                                <td class="${r.status === "pass" ? "pass" : "fail"}">${r.status}</td>
                            </tr>
                        `,
                            )
                            .join("")}
                    </tbody>
                </table>
                <div class="summary">
                    <span>Total: <strong>${obtainedMarks}/${totalMarks}</strong></span>
                    <span>Percentage: <strong>${percentage}%</strong></span>
                    <span>Grade: <strong>${overallGrade()}</strong></span>
                    <span class="${hasFail ? "fail" : "pass"}">Result: <strong>${hasFail ? "FAIL" : "PASS"}</strong></span>
                </div>
                <div class="footer">Generated from ${schoolName} — ${new Date().toLocaleDateString()}</div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Results" />

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
            <nav className="bg-green-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link href="/parent/dashboard" className="hover:text-green-200">
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
                <Link
                    href="/parent/results"
                    className="hover:text-green-200 font-medium"
                >
                    🏆 Results
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-green-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">🏆 Results</span>
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
                {/* Student Info */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        🎓
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800">
                            {student.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {student.school_class?.name} | Roll:{" "}
                            {student.roll_number}
                        </p>
                    </div>
                </div>

                {/* Exams */}
                {exams.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                        <p className="text-lg">No published results yet</p>
                        <p className="text-sm mt-2">
                            Results will appear here once school publishes them
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {exams.map((exam) => {
                            const results = exam.results || [];
                            const totalMarks = results.reduce(
                                (sum, r) => sum + parseFloat(r.total_marks),
                                0,
                            );
                            const obtainedMarks = results.reduce(
                                (sum, r) => sum + parseFloat(r.marks_obtained),
                                0,
                            );
                            const percentage =
                                totalMarks > 0
                                    ? (
                                          (obtainedMarks / totalMarks) *
                                          100
                                      ).toFixed(1)
                                    : 0;
                            const hasFail = results.some(
                                (r) => r.status === "fail",
                            );
                            const overallGrade = () => {
                                if (percentage >= 90) return "A+";
                                if (percentage >= 80) return "A";
                                if (percentage >= 70) return "B";
                                if (percentage >= 60) return "C";
                                if (percentage >= 50) return "D";
                                return "F";
                            };

                            return (
                                <div
                                    key={exam.id}
                                    className="bg-white rounded-xl shadow p-5 md:p-6"
                                >
                                    {/* Exam Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {exam.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                                                <span>
                                                    {examTypes[exam.type]}
                                                </span>
                                                <span>
                                                    📅{" "}
                                                    {exam.exam_date
                                                        ? new Date(
                                                              exam.exam_date,
                                                          ).toLocaleDateString(
                                                              "en-GB",
                                                          )
                                                        : "-"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-800">
                                                    {obtainedMarks}/{totalMarks}
                                                </div>
                                                <div
                                                    className={`text-lg font-bold ${percentage >= 60 ? "text-green-600" : "text-red-500"}`}
                                                >
                                                    {percentage}%
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handlePrint(exam)
                                                }
                                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 flex items-center gap-1"
                                            >
                                                🖨️ Download / Print
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary Bar */}
                                    <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-lg items-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColors[overallGrade()] || ""}`}
                                        >
                                            Grade: {overallGrade()}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${hasFail ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                                        >
                                            {hasFail ? "❌ Fail" : "✅ Pass"}
                                        </span>
                                        <div className="flex-1 min-w-24">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className={`h-2 rounded-full ${percentage >= 60 ? "bg-green-500" : "bg-red-500"}`}
                                                    style={{
                                                        width: `${Math.min(percentage, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subject Results */}
                                    {results.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 text-left">
                                                        <th className="p-2">
                                                            Subject
                                                        </th>
                                                        <th className="p-2 text-center">
                                                            Marks
                                                        </th>
                                                        <th className="p-2 text-center">
                                                            Total
                                                        </th>
                                                        <th className="p-2 text-center">
                                                            %
                                                        </th>
                                                        <th className="p-2 text-center">
                                                            Grade
                                                        </th>
                                                        <th className="p-2 text-center">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results.map((result) => (
                                                        <tr
                                                            key={result.id}
                                                            className="border-t"
                                                        >
                                                            <td className="p-2 font-medium">
                                                                {
                                                                    result
                                                                        .subject
                                                                        ?.name
                                                                }
                                                            </td>
                                                            <td className="p-2 text-center font-bold">
                                                                {
                                                                    result.marks_obtained
                                                                }
                                                            </td>
                                                            <td className="p-2 text-center text-gray-500">
                                                                {
                                                                    result.total_marks
                                                                }
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                {
                                                                    result.percentage
                                                                }
                                                                %
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColors[result.grade] || ""}`}
                                                                >
                                                                    {
                                                                        result.grade
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-full text-xs ${result.status === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                                                >
                                                                    {
                                                                        result.status
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
