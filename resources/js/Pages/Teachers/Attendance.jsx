import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Attendance({ teachers, date }) {
    const [selectedDate, setSelectedDate] = useState(date);
    const [saving, setSaving] = useState(false);

    const [attendances, setAttendances] = useState(() => {
        const init = {};
        teachers.forEach((t) => {
            const existing = t.attendances?.[0];
            init[t.id] = {
                status: existing?.status || "present",
                remarks: existing?.remarks || "",
            };
        });
        return init;
    });

    const setAll = (status) => {
        const updated = {};
        teachers.forEach((t) => {
            updated[t.id] = { ...attendances[t.id], status };
        });
        setAttendances(updated);
    };

    const handleSave = () => {
        setSaving(true);
        router.post(
            "/teachers-attendance",
            {
                date: selectedDate,
                attendances,
            },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const statusColors = {
        present: "bg-green-500",
        absent: "bg-red-500",
        late: "bg-yellow-500",
        leave: "bg-blue-500",
    };

    const statusCount = (s) =>
        Object.values(attendances).filter((a) => a.status === s).length;

    return (
        <AuthenticatedLayout>
            <Head title="Teacher Attendance" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/teachers"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold">
                                👨‍🏫 Teacher Attendance
                            </h3>
                            <p className="text-blue-100 text-sm">
                                {teachers.length} Active Teachers
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                router.get(
                                    "/teachers-attendance",
                                    { date: e.target.value },
                                    { preserveState: false },
                                );
                            }}
                            className="border-0 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none"
                        />
                        <Link
                            href="/teachers-attendance-report"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg text-sm"
                        >
                            📊 Report
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-white text-blue-700 px-5 py-2 rounded-lg text-sm hover:bg-blue-50 font-bold disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "💾 Save"}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {["present", "absent", "late", "leave"].map((s) => (
                        <div
                            key={s}
                            className="bg-white rounded-xl shadow p-4 text-center"
                        >
                            <p
                                className={`text-3xl font-bold ${s === "present" ? "text-green-600" : s === "absent" ? "text-red-600" : s === "late" ? "text-yellow-600" : "text-blue-600"}`}
                            >
                                {statusCount(s)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                                {s}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 items-center">
                    <span className="text-sm font-medium text-gray-600">
                        Mark All:
                    </span>
                    {["present", "absent", "late", "leave"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setAll(s)}
                            className={`${statusColors[s]} text-white px-4 py-1.5 rounded-lg text-xs hover:opacity-90 capitalize font-medium`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Teachers Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {teachers.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">
                                No active teachers found
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Teacher</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher, i) => (
                                    <tr
                                        key={teacher.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {i + 1}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold">
                                                {teacher.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {teacher.email}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {teacher.department?.name || "-"}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {[
                                                    "present",
                                                    "absent",
                                                    "late",
                                                    "leave",
                                                ].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() =>
                                                            setAttendances(
                                                                (p) => ({
                                                                    ...p,
                                                                    [teacher.id]:
                                                                        {
                                                                            ...p[
                                                                                teacher
                                                                                    .id
                                                                            ],
                                                                            status: s,
                                                                        },
                                                                }),
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                                                            attendances[
                                                                teacher.id
                                                            ]?.status === s
                                                                ? `${statusColors[s]} text-white shadow-md`
                                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                                                    attendances[teacher.id]
                                                        ?.remarks || ""
                                                }
                                                onChange={(e) =>
                                                    setAttendances((p) => ({
                                                        ...p,
                                                        [teacher.id]: {
                                                            ...p[teacher.id],
                                                            remarks:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                                className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                                                placeholder="Optional"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Bottom Save */}
                {teachers.length > 0 && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 font-bold"
                        >
                            {saving ? "Saving..." : "💾 Save Attendance"}
                        </button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
