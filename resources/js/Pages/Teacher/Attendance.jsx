import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Attendance({
    teacher,
    classes,
    selectedClass,
    students,
    existingAttendance,
    filters,
    today,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";
    const [classId, setClassId] = useState(filters?.class_id || "");
    const [date, setDate] = useState(filters?.date || today);
    const [saving, setSaving] = useState(false);

    const [attendanceData, setAttendanceData] = useState(() => {
        const init = {};
        students.forEach((s) => {
            init[s.id] = {
                status: existingAttendance[s.id]?.status || "present",
                remarks: existingAttendance[s.id]?.remarks || "",
            };
        });
        return init;
    });

    const applyFilter = (cId, d) => {
        router.get(
            "/teacher/attendance",
            { class_id: cId, date: d },
            { preserveState: false },
        );
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks },
        }));
    };

    const markAll = (status) => {
        const updated = {};
        students.forEach((s) => {
            updated[s.id] = { ...attendanceData[s.id], status };
        });
        setAttendanceData(updated);
    };

    const saveAttendance = () => {
        setSaving(true);
        router.post(
            "/teacher/attendance",
            {
                class_id: classId,
                date: date,
                attendances: attendanceData,
            },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const presentCount = Object.values(attendanceData).filter(
        (a) => a.status === "present",
    ).length;
    const absentCount = Object.values(attendanceData).filter(
        (a) => a.status === "absent",
    ).length;
    const lateCount = Object.values(attendanceData).filter(
        (a) => a.status === "late",
    ).length;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Attendance" />

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
                    className="hover:text-blue-200 font-medium"
                >
                    📋 Attendance
                </Link>
                <Link
                    href="/teacher/attendance/report"
                    className="hover:text-blue-200"
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
                <span className="text-sm font-medium">📋 Attendance</span>
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
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📋 Attendance
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Mark student attendance
                    </p>
                </div>

                {/* Filter */}
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
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={today}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => applyFilter(classId, date)}
                        disabled={!classId}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        Load Students
                    </button>
                </div>

                {students.length > 0 && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                                <p className="text-2xl font-bold text-green-600">
                                    {presentCount}
                                </p>
                                <p className="text-xs text-gray-500">Present</p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                                <p className="text-2xl font-bold text-red-500">
                                    {absentCount}
                                </p>
                                <p className="text-xs text-gray-500">Absent</p>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-yellow-500">
                                <p className="text-2xl font-bold text-yellow-500">
                                    {lateCount}
                                </p>
                                <p className="text-xs text-gray-500">Late</p>
                            </div>
                        </div>

                        {/* Mark All */}
                        <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3 items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Mark All:
                            </span>
                            <button
                                onClick={() => markAll("present")}
                                className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-sm hover:bg-green-200 font-medium"
                            >
                                ✅ All Present
                            </button>
                            <button
                                onClick={() => markAll("absent")}
                                className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-sm hover:bg-red-200 font-medium"
                            >
                                ❌ All Absent
                            </button>
                            <button
                                onClick={() => markAll("late")}
                                className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-lg text-sm hover:bg-yellow-200 font-medium"
                            >
                                ⏰ All Late
                            </button>
                        </div>

                        {/* Students List */}
                        <div className="bg-white rounded-xl shadow overflow-x-auto mb-5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="p-4">#</th>
                                        <th className="p-4">Student</th>
                                        <th className="p-4">Roll No</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, i) => (
                                        <tr
                                            key={student.id}
                                            className={`border-t ${
                                                attendanceData[student.id]
                                                    ?.status === "absent"
                                                    ? "bg-red-50"
                                                    : attendanceData[student.id]
                                                            ?.status === "late"
                                                      ? "bg-yellow-50"
                                                      : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <td className="p-4 text-gray-500">
                                                {i + 1}
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium">
                                                    {student.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {student.section?.name
                                                        ? `Section ${student.section.name}`
                                                        : ""}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                {student.roll_number || "-"}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {[
                                                        "present",
                                                        "absent",
                                                        "late",
                                                        "leave",
                                                    ].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    student.id,
                                                                    s,
                                                                )
                                                            }
                                                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                                                attendanceData[
                                                                    student.id
                                                                ]?.status === s
                                                                    ? s ===
                                                                      "present"
                                                                        ? "bg-green-500 text-white"
                                                                        : s ===
                                                                            "absent"
                                                                          ? "bg-red-500 text-white"
                                                                          : s ===
                                                                              "late"
                                                                            ? "bg-yellow-500 text-white"
                                                                            : "bg-blue-500 text-white"
                                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                            }`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <input
                                                    type="text"
                                                    value={
                                                        attendanceData[
                                                            student.id
                                                        ]?.remarks || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleRemarksChange(
                                                            student.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Optional"
                                                    className="border rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={saveAttendance}
                                disabled={saving}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Saving..." : "💾 Save Attendance"}
                            </button>
                        </div>
                    </>
                )}

                {students.length === 0 && classId && (
                    <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                        <p className="text-5xl mb-3">📋</p>
                        <p>Select class and date then click Load Students</p>
                    </div>
                )}

                {!classId && (
                    <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                        <p className="text-5xl mb-3">📋</p>
                        <p>Select a class to take attendance</p>
                    </div>
                )}
            </div>
        </div>
    );
}
