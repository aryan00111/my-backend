import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function ResultEntry({
    teacher,
    exam,
    subjects,
    students,
    existingResults,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";
    const [saving, setSaving] = useState(false);

    const [results, setResults] = useState(() => {
        const init = {};
        students.forEach((student) => {
            init[student.id] = {};
            subjects.forEach((subject) => {
                const existing = existingResults[student.id]?.[subject.id];
                init[student.id][subject.id] = {
                    marks_obtained: existing?.marks_obtained ?? "",
                    total_marks:
                        existing?.total_marks ?? subject.total_marks ?? "",
                    theory_total: subject.theory_marks ?? "",
                    practical_total: subject.practical_marks ?? "",
                    theory_marks_obtained:
                        existing?.theory_marks_obtained ?? "",
                    practical_marks_obtained:
                        existing?.practical_marks_obtained ?? "",
                    remarks: existing?.remarks ?? "",
                };
            });
        });
        return init;
    });

    const handleChange = (studentId, subjectId, field, value) => {
        setResults((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [subjectId]: { ...prev[studentId][subjectId], [field]: value },
            },
        }));
    };

    const saveResults = () => {
        setSaving(true);
        router.post(
            "/teacher/results/store",
            { exam_id: exam.id, results },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const getPercentage = (obtained, total) => {
        if (!obtained || !total) return "-";
        return (
            ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(1) + "%"
        );
    };

    const getGrade = (percentage) => {
        const p = parseFloat(percentage);
        if (p >= 90) return { grade: "A+", color: "text-green-700" };
        if (p >= 80) return { grade: "A", color: "text-green-600" };
        if (p >= 70) return { grade: "B", color: "text-blue-600" };
        if (p >= 60) return { grade: "C", color: "text-yellow-600" };
        if (p >= 50) return { grade: "D", color: "text-orange-600" };
        return { grade: "F", color: "text-red-600" };
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Result Entry" />

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
                <span className="text-sm font-medium">✏️ Result Entry</span>
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
                                    {exam.type?.replace("_", " ")} |{" "}
                                    {students.length} Students |{" "}
                                    {subjects.length} Subjects
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={saveResults}
                            disabled={saving}
                            className="bg-white text-blue-700 px-5 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "💾 Save All Results"}
                        </button>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">📭</p>
                        <p className="text-gray-400">
                            No students found in this class
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {students.map((student, si) => (
                            <div
                                key={student.id}
                                className="bg-white rounded-xl shadow overflow-hidden"
                            >
                                {/* Student Header */}
                                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">
                                            {si + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {student.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {student.student_id} | Roll:{" "}
                                                {student.roll_number || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subjects Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-blue-50 text-left">
                                                <th className="p-3">Subject</th>
                                                <th className="p-3 text-center">
                                                    Total Marks
                                                </th>
                                                <th className="p-3 text-center">
                                                    Theory Obtained
                                                </th>
                                                <th className="p-3 text-center">
                                                    Practical Obtained
                                                </th>
                                                <th className="p-3 text-center">
                                                    Total Obtained
                                                </th>
                                                <th className="p-3 text-center">
                                                    %
                                                </th>
                                                <th className="p-3 text-center">
                                                    Grade
                                                </th>
                                                <th className="p-3">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjects.map((subject) => {
                                                const data =
                                                    results[student.id]?.[
                                                        subject.id
                                                    ] || {};
                                                const pct = getPercentage(
                                                    data.marks_obtained,
                                                    data.total_marks,
                                                );
                                                const { grade, color } =
                                                    pct !== "-"
                                                        ? getGrade(pct)
                                                        : {
                                                              grade: "-",
                                                              color: "text-gray-400",
                                                          };
                                                const theoryObtained =
                                                    parseFloat(
                                                        data.theory_marks_obtained,
                                                    ) || 0;
                                                const practicalObtained =
                                                    subject.has_practical
                                                        ? parseFloat(
                                                              data.practical_marks_obtained,
                                                          ) || 0
                                                        : 0;
                                                const totalObtained =
                                                    subject.has_practical
                                                        ? theoryObtained +
                                                          practicalObtained
                                                        : parseFloat(
                                                              data.marks_obtained,
                                                          ) || 0;

                                                return (
                                                    <tr
                                                        key={subject.id}
                                                        className="border-t hover:bg-gray-50"
                                                    >
                                                        {/* Subject Name */}
                                                        <td className="p-3 font-medium">
                                                            {subject.name}
                                                            {subject.has_practical && (
                                                                <span className="ml-1 bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded">
                                                                    +P
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Total Marks */}
                                                        <td className="p-3 text-center">
                                                            {subject.has_practical ? (
                                                                <div className="text-xs space-y-1">
                                                                    <div className="flex items-center gap-1 justify-center">
                                                                        <span className="text-blue-600 font-medium w-5">
                                                                            T:
                                                                        </span>
                                                                        <input
                                                                            type="number"
                                                                            value={
                                                                                data.theory_total ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                handleChange(
                                                                                    student.id,
                                                                                    subject.id,
                                                                                    "theory_total",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                );
                                                                                const p =
                                                                                    parseFloat(
                                                                                        data.practical_total,
                                                                                    ) ||
                                                                                    0;
                                                                                handleChange(
                                                                                    student.id,
                                                                                    subject.id,
                                                                                    "total_marks",
                                                                                    (parseFloat(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    ) ||
                                                                                        0) +
                                                                                        p,
                                                                                );
                                                                            }}
                                                                            className="border rounded px-1 py-1 text-xs w-14 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                            placeholder="70"
                                                                            min="0"
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-1 justify-center">
                                                                        <span className="text-purple-600 font-medium w-5">
                                                                            P:
                                                                        </span>
                                                                        <input
                                                                            type="number"
                                                                            value={
                                                                                data.practical_total ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                handleChange(
                                                                                    student.id,
                                                                                    subject.id,
                                                                                    "practical_total",
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                );
                                                                                const t =
                                                                                    parseFloat(
                                                                                        data.theory_total,
                                                                                    ) ||
                                                                                    0;
                                                                                handleChange(
                                                                                    student.id,
                                                                                    subject.id,
                                                                                    "total_marks",
                                                                                    t +
                                                                                        (parseFloat(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        ) ||
                                                                                            0),
                                                                                );
                                                                            }}
                                                                            className="border rounded px-1 py-1 text-xs w-14 text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                                            placeholder="30"
                                                                            min="0"
                                                                        />
                                                                    </div>
                                                                    <div className="font-bold text-gray-700">
                                                                        ={" "}
                                                                        {(parseFloat(
                                                                            data.theory_total,
                                                                        ) ||
                                                                            0) +
                                                                            (parseFloat(
                                                                                data.practical_total,
                                                                            ) ||
                                                                                0)}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        data.total_marks ??
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleChange(
                                                                            student.id,
                                                                            subject.id,
                                                                            "total_marks",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="border rounded px-2 py-1 text-xs w-16 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    placeholder="100"
                                                                />
                                                            )}
                                                        </td>

                                                        {/* Theory Obtained */}
                                                        <td className="p-3 text-center">
                                                            <input
                                                                type="number"
                                                                value={
                                                                    data.theory_marks_obtained ??
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const val =
                                                                        e.target
                                                                            .value;
                                                                    handleChange(
                                                                        student.id,
                                                                        subject.id,
                                                                        "theory_marks_obtained",
                                                                        val,
                                                                    );
                                                                    if (
                                                                        !subject.has_practical
                                                                    ) {
                                                                        handleChange(
                                                                            student.id,
                                                                            subject.id,
                                                                            "marks_obtained",
                                                                            val,
                                                                        );
                                                                    } else {
                                                                        const p =
                                                                            parseFloat(
                                                                                data.practical_marks_obtained,
                                                                            ) ||
                                                                            0;
                                                                        handleChange(
                                                                            student.id,
                                                                            subject.id,
                                                                            "marks_obtained",
                                                                            (parseFloat(
                                                                                val,
                                                                            ) ||
                                                                                0) +
                                                                                p,
                                                                        );
                                                                    }
                                                                }}
                                                                className="border rounded px-2 py-1 text-xs w-16 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="0"
                                                                min="0"
                                                            />
                                                        </td>

                                                        {/* Practical Obtained */}
                                                        <td className="p-3 text-center">
                                                            {subject.has_practical ? (
                                                                <input
                                                                    type="number"
                                                                    value={
                                                                        data.practical_marks_obtained ??
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const val =
                                                                            e
                                                                                .target
                                                                                .value;
                                                                        handleChange(
                                                                            student.id,
                                                                            subject.id,
                                                                            "practical_marks_obtained",
                                                                            val,
                                                                        );
                                                                        const t =
                                                                            parseFloat(
                                                                                data.theory_marks_obtained,
                                                                            ) ||
                                                                            0;
                                                                        handleChange(
                                                                            student.id,
                                                                            subject.id,
                                                                            "marks_obtained",
                                                                            t +
                                                                                (parseFloat(
                                                                                    val,
                                                                                ) ||
                                                                                    0),
                                                                        );
                                                                    }}
                                                                    className="border rounded px-2 py-1 text-xs w-16 text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                                    placeholder="0"
                                                                    min="0"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Total Obtained */}
                                                        <td className="p-3 text-center font-bold text-gray-700">
                                                            {totalObtained ||
                                                                "-"}
                                                        </td>

                                                        {/* Percentage */}
                                                        <td className="p-3 text-center text-xs font-medium">
                                                            {pct}
                                                        </td>

                                                        {/* Grade */}
                                                        <td className="p-3 text-center">
                                                            <span
                                                                className={`text-xs font-bold ${color}`}
                                                            >
                                                                {grade}
                                                            </span>
                                                        </td>

                                                        {/* Remarks */}
                                                        <td className="p-3">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    data.remarks ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        student.id,
                                                                        subject.id,
                                                                        "remarks",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="border rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="Optional"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Save */}
                {students.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={saveResults}
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                        >
                            {saving ? "Saving..." : "💾 Save All Results"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
