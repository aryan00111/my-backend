import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";

export default function Index({ classes, today }) {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState("");
    const [date, setDate] = useState(today);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const selectedClassData = classes.find((c) => c.id === selectedClass);

    const loadStudents = async (
        classId,
        sectionId = "",
        selectedDate = date,
    ) => {
        setLoading(true);
        try {
            const res = await axios.get("/attendance/students", {
                params: {
                    class_id: classId,
                    section_id: sectionId,
                    date: selectedDate,
                },
            });
            setStudents(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleClassSelect = (classId) => {
        setSelectedClass(classId);
        setSelectedSection("");
        setStudents([]);
        if (classId) loadStudents(classId, "", date);
    };

    const handleSectionChange = (sectionId) => {
        setSelectedSection(sectionId);
        loadStudents(selectedClass, sectionId, date);
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        if (selectedClass)
            loadStudents(selectedClass, selectedSection, newDate);
    };

    const updateStatus = (studentId, status) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === studentId ? { ...s, status } : s)),
        );
    };

    const updateRemarks = (studentId, remarks) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === studentId ? { ...s, remarks } : s)),
        );
    };

    const markAll = (status) => {
        setStudents((prev) => prev.map((s) => ({ ...s, status })));
    };

    const saveAttendance = () => {
        setSaving(true);
        router.post(
            "/attendance",
            {
                class_id: selectedClass,
                date: date,
                attendances: students.map((s) => ({
                    student_id: s.id,
                    status: s.status,
                    remarks: s.remarks,
                })),
            },
            {
                onFinish: () => setSaving(false),
            },
        );
    };

    const presentCount = students.filter((s) => s.status === "present").length;
    const absentCount = students.filter((s) => s.status === "absent").length;
    const lateCount = students.filter((s) => s.status === "late").length;

    return (
        <AuthenticatedLayout>
            <Head title="Attendance" />

            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* ── CLASSES VIEW ── */}
                {!selectedClass ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    📋 Attendance
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select a class to mark attendance
                                </p>
                            </div>
                            {/* Date Picker */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500">
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {classes.length === 0 ? (
                            <div className="bg-white rounded-xl shadow p-16 text-center">
                                <p className="text-6xl mb-4">📭</p>
                                <p className="text-gray-400 text-lg">
                                    No classes found
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-4">#</th>
                                            <th className="p-4">Class Name</th>
                                            <th className="p-4">Grade</th>
                                            <th className="p-4">Sections</th>
                                            <th className="p-4">
                                                Total Students
                                            </th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.map((cls, i) => (
                                            <tr
                                                key={cls.id}
                                                className="border-t hover:bg-blue-50"
                                            >
                                                <td className="p-4 text-gray-500">
                                                    {i + 1}
                                                </td>
                                                <td className="p-4 font-bold text-gray-800">
                                                    {cls.name}
                                                </td>
                                                <td className="p-4">
                                                    {cls.grade_level ? (
                                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                                                            Grade{" "}
                                                            {cls.grade_level}
                                                        </span>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {cls.sections?.length >
                                                        0 ? (
                                                            cls.sections.map(
                                                                (s) => (
                                                                    <span
                                                                        key={
                                                                            s.id
                                                                        }
                                                                        className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                                                                    >
                                                                        Sec{" "}
                                                                        {s.name}
                                                                    </span>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">
                                                                No sections
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                                        {cls.students_count}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() =>
                                                            handleClassSelect(
                                                                cls.id,
                                                            )
                                                        }
                                                        className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-blue-600 font-medium"
                                                    >
                                                        Mark Attendance →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── ATTENDANCE MARKING VIEW ── */
                    <div>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedClass(null);
                                            setStudents([]);
                                        }}
                                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                                    >
                                        ← Back
                                    </button>
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            {selectedClassData?.name} —
                                            Attendance
                                        </h3>
                                        <p className="text-blue-100 text-sm">
                                            {date}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={saveAttendance}
                                    disabled={saving || students.length === 0}
                                    className="bg-white text-blue-700 px-5 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "💾 Save Attendance"}
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-4 items-center">
                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500">
                                    📅 Date:
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        handleDateChange(e.target.value)
                                    }
                                    className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Section Filter */}
                            {selectedClassData?.sections?.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-500">
                                        📚 Section:
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleSectionChange("")
                                            }
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                selectedSection === ""
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            All
                                        </button>
                                        {selectedClassData.sections.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() =>
                                                    handleSectionChange(s.id)
                                                }
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    selectedSection === s.id
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                Sec {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mark All Buttons */}
                            {students.length > 0 && (
                                <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-sm text-gray-500">
                                        Mark All:
                                    </span>
                                    <button
                                        onClick={() => markAll("present")}
                                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
                                    >
                                        ✅ Present
                                    </button>
                                    <button
                                        onClick={() => markAll("absent")}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                                    >
                                        ❌ Absent
                                    </button>
                                    <button
                                        onClick={() => markAll("late")}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-yellow-600"
                                    >
                                        ⏰ Late
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        {students.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {students.length}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Total
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                                    <p className="text-2xl font-bold text-green-600">
                                        {presentCount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Present
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                                    <p className="text-2xl font-bold text-red-500">
                                        {absentCount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Absent
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-yellow-500">
                                    <p className="text-2xl font-bold text-yellow-500">
                                        {lateCount}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Late
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Students Table */}
                        <div className="bg-white rounded-xl shadow overflow-x-auto">
                            {loading ? (
                                <div className="text-center py-16">
                                    <p className="text-4xl mb-3">⏳</p>
                                    <p className="text-gray-400">
                                        Loading students...
                                    </p>
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-5xl mb-3">📭</p>
                                    <p className="text-gray-400">
                                        No students found in this class
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-4">#</th>
                                            <th className="p-4">Student ID</th>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Roll No</th>
                                            <th className="p-4">Section</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, i) => (
                                            <tr
                                                key={student.id}
                                                className={`border-t ${
                                                    student.status === "absent"
                                                        ? "bg-red-50"
                                                        : student.status ===
                                                            "late"
                                                          ? "bg-yellow-50"
                                                          : ""
                                                }`}
                                            >
                                                <td className="p-4 text-gray-500">
                                                    {i + 1}
                                                </td>
                                                <td className="p-4 font-mono text-xs text-blue-600 font-bold">
                                                    {student.student_id}
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {student.name}
                                                </td>
                                                <td className="p-4">
                                                    {student.roll_number}
                                                </td>
                                                <td className="p-4">
                                                    {student.section ? (
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                                            Sec{" "}
                                                            {
                                                                student.section
                                                                    .name
                                                            }
                                                        </span>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        {[
                                                            "present",
                                                            "absent",
                                                            "late",
                                                        ].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        student.id,
                                                                        status,
                                                                    )
                                                                }
                                                                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                                                                    student.status ===
                                                                    status
                                                                        ? status ===
                                                                          "present"
                                                                            ? "bg-green-500 text-white"
                                                                            : status ===
                                                                                "absent"
                                                                              ? "bg-red-500 text-white"
                                                                              : "bg-yellow-500 text-white"
                                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                                }`}
                                                            >
                                                                {status ===
                                                                "present"
                                                                    ? "✅"
                                                                    : status ===
                                                                        "absent"
                                                                      ? "❌"
                                                                      : "⏰"}{" "}
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="text"
                                                        value={student.remarks}
                                                        onChange={(e) =>
                                                            updateRemarks(
                                                                student.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="border rounded px-2 py-1 text-xs w-32 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                        placeholder="Remarks..."
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Bottom Save */}
                        {students.length > 0 && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={saveAttendance}
                                    disabled={saving}
                                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "💾 Save Attendance"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
