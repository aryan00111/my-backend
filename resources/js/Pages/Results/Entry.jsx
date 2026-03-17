import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Entry({ exam, students, subjects }) {
    const [showGrade, setShowGrade] = useState(true);
    const [saving, setSaving] = useState(false);

    const [results, setResults] = useState(() => {
        const init = {};
        students.forEach((student) => {
            init[student.id] = {};
            subjects.forEach((subject) => {
                const existing = student.results?.find(
                    (r) => r.subject_id === subject.id,
                );
                init[student.id][subject.id] = {
                    marks_obtained: existing?.marks_obtained ?? "",
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
        setResults((prev) => {
            const updated = {
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [subjectId]: {
                        ...prev[studentId][subjectId],
                        [field]: value,
                    },
                },
            };
            const subject = subjects.find((s) => s.id === subjectId);
            if (
                subject?.has_practical &&
                (field === "theory_marks_obtained" ||
                    field === "practical_marks_obtained")
            ) {
                const t =
                    parseFloat(
                        updated[studentId][subjectId].theory_marks_obtained,
                    ) || 0;
                const p =
                    parseFloat(
                        updated[studentId][subjectId].practical_marks_obtained,
                    ) || 0;
                updated[studentId][subjectId].marks_obtained = t + p;
            }
            return updated;
        });
    };

    const handleSave = () => {
        setSaving(true);
        const resultsArray = [];
        students.forEach((student) => {
            subjects.forEach((subject) => {
                const data = results[student.id]?.[subject.id];
                const marks = subject.has_practical
                    ? parseFloat(data?.theory_marks_obtained || 0) +
                      parseFloat(data?.practical_marks_obtained || 0)
                    : parseFloat(data?.marks_obtained || 0);
                if (
                    data?.marks_obtained !== "" ||
                    data?.theory_marks_obtained !== "" ||
                    data?.practical_marks_obtained !== ""
                ) {
                    resultsArray.push({
                        student_id: student.id,
                        subject_id: subject.id,
                        marks_obtained: marks,
                        theory_marks_obtained:
                            data?.theory_marks_obtained || null,
                        practical_marks_obtained:
                            data?.practical_marks_obtained || null,
                        total_marks: subject.total_marks,
                        passing_marks: subject.passing_marks,
                        show_grade: showGrade,
                        remarks: data?.remarks,
                    });
                }
            });
        });
        router.post(
            "/results",
            { exam_id: exam.id, results: resultsArray },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const getStatus = (marks, passingMarks) => {
        if (marks === "" || marks === null) return null;
        return parseFloat(marks) >= passingMarks ? "pass" : "fail";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Result Entry" />
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
                                    {exam.name} — Result Entry
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {exam.school_class?.name} |{" "}
                                    {students.length} Students |{" "}
                                    {subjects.length} Subjects
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
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
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-white text-blue-700 px-5 py-2 rounded-lg text-sm hover:bg-blue-50 font-bold disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "💾 Save Results"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* No Subjects */}
                {subjects.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <p className="text-5xl mb-3">📭</p>
                        <p className="text-gray-400 mb-4">
                            No subjects found in this class
                        </p>
                    </div>
                )}

                {/* Results Table */}
                {subjects.length > 0 && students.length > 0 && (
                    <div className="bg-white rounded-xl shadow overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-3 min-w-8">#</th>
                                    <th className="p-3 min-w-40">Student</th>
                                    {subjects.map((sub) => (
                                        <th
                                            key={sub.id}
                                            className="p-3 text-center"
                                            colSpan={sub.has_practical ? 2 : 1}
                                        >
                                            <div className="font-bold">
                                                {sub.name}
                                            </div>
                                            <div className="text-xs font-normal text-gray-400">
                                                {sub.has_practical
                                                    ? `Theory: ${sub.theory_marks} | Practical: ${sub.practical_marks}`
                                                    : `Total: ${sub.total_marks} | Pass: ${sub.passing_marks}`}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                <tr className="bg-gray-100 text-xs text-gray-500">
                                    <th></th>
                                    <th></th>
                                    {subjects.map((sub) =>
                                        sub.has_practical ? (
                                            <>
                                                <th
                                                    key={`${sub.id}-t`}
                                                    className="p-2 text-center text-blue-600"
                                                >
                                                    Theory (/{sub.theory_marks})
                                                </th>
                                                <th
                                                    key={`${sub.id}-p`}
                                                    className="p-2 text-center text-purple-600"
                                                >
                                                    Practical (/
                                                    {sub.practical_marks})
                                                </th>
                                            </>
                                        ) : (
                                            <th
                                                key={sub.id}
                                                className="p-2 text-center"
                                            >
                                                Marks (/{sub.total_marks})
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, i) => (
                                    <tr
                                        key={student.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-3 text-gray-400">
                                            {i + 1}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold">
                                                {student.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {student.student_id}
                                            </div>
                                        </td>
                                        {subjects.map((subject) => {
                                            const data =
                                                results[student.id]?.[
                                                    subject.id
                                                ] || {};
                                            if (subject.has_practical) {
                                                const tMarks = parseFloat(
                                                    data.theory_marks_obtained,
                                                );
                                                const pMarks = parseFloat(
                                                    data.practical_marks_obtained,
                                                );
                                                const tFail =
                                                    data.theory_marks_obtained !==
                                                        "" &&
                                                    tMarks <
                                                        subject.theory_passing;
                                                const tPass =
                                                    data.theory_marks_obtained !==
                                                        "" &&
                                                    tMarks >=
                                                        subject.theory_passing;
                                                const pFail =
                                                    data.practical_marks_obtained !==
                                                        "" &&
                                                    pMarks <
                                                        subject.practical_passing;
                                                const pPass =
                                                    data.practical_marks_obtained !==
                                                        "" &&
                                                    pMarks >=
                                                        subject.practical_passing;
                                                return (
                                                    <>
                                                        <td
                                                            key={`${subject.id}-t`}
                                                            className={`p-2 ${tFail ? "bg-red-50" : tPass ? "bg-blue-50" : ""}`}
                                                        >
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={
                                                                    subject.theory_marks
                                                                }
                                                                value={
                                                                    data.theory_marks_obtained
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        student.id,
                                                                        subject.id,
                                                                        "theory_marks_obtained",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`w-20 border rounded px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 ${tFail ? "border-red-300" : tPass ? "border-blue-300" : ""}`}
                                                                placeholder="0"
                                                            />
                                                            {tFail && (
                                                                <p className="text-red-500 text-xs text-center">
                                                                    ❌
                                                                </p>
                                                            )}
                                                            {tPass && (
                                                                <p className="text-blue-500 text-xs text-center">
                                                                    ✅
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td
                                                            key={`${subject.id}-p`}
                                                            className={`p-2 ${pFail ? "bg-red-50" : pPass ? "bg-purple-50" : ""}`}
                                                        >
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={
                                                                    subject.practical_marks
                                                                }
                                                                value={
                                                                    data.practical_marks_obtained
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        student.id,
                                                                        subject.id,
                                                                        "practical_marks_obtained",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`w-20 border rounded px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 ${pFail ? "border-red-300" : pPass ? "border-purple-300" : ""}`}
                                                                placeholder="0"
                                                            />
                                                            {pFail && (
                                                                <p className="text-red-500 text-xs text-center">
                                                                    ❌
                                                                </p>
                                                            )}
                                                            {pPass && (
                                                                <p className="text-purple-500 text-xs text-center">
                                                                    ✅
                                                                </p>
                                                            )}
                                                        </td>
                                                    </>
                                                );
                                            } else {
                                                const status = getStatus(
                                                    data.marks_obtained,
                                                    subject.passing_marks,
                                                );
                                                return (
                                                    <td
                                                        key={subject.id}
                                                        className={`p-2 ${status === "fail" ? "bg-red-50" : status === "pass" ? "bg-green-50" : ""}`}
                                                    >
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={
                                                                subject.total_marks
                                                            }
                                                            value={
                                                                data.marks_obtained
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    student.id,
                                                                    subject.id,
                                                                    "marks_obtained",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`w-full border rounded px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 ${status === "fail" ? "border-red-300" : status === "pass" ? "border-green-300" : ""}`}
                                                            placeholder="0"
                                                        />
                                                        {status === "fail" && (
                                                            <p className="text-red-500 text-xs text-center mt-0.5">
                                                                ❌ Fail
                                                            </p>
                                                        )}
                                                        {status === "pass" && (
                                                            <p className="text-green-500 text-xs text-center mt-0.5">
                                                                ✅ Pass
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            }
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Bottom Save */}
                {subjects.length > 0 && students.length > 0 && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 font-bold"
                        >
                            {saving ? "Saving..." : "💾 Save All Results"}
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
