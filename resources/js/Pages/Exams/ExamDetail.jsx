import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

const TIMES = [
    "07:00 AM",
    "07:15 AM",
    "07:30 AM",
    "07:45 AM",
    "08:00 AM",
    "08:15 AM",
    "08:30 AM",
    "08:45 AM",
    "09:00 AM",
    "09:15 AM",
    "09:30 AM",
    "09:45 AM",
    "10:00 AM",
    "10:15 AM",
    "10:30 AM",
    "10:45 AM",
    "11:00 AM",
    "11:15 AM",
    "11:30 AM",
    "11:45 AM",
    "12:00 PM",
    "12:15 PM",
    "12:30 PM",
    "12:45 PM",
    "01:00 PM",
    "01:15 PM",
    "01:30 PM",
    "01:45 PM",
    "02:00 PM",
    "02:15 PM",
    "02:30 PM",
    "02:45 PM",
    "03:00 PM",
    "03:15 PM",
    "03:30 PM",
    "03:45 PM",
    "04:00 PM",
    "04:15 PM",
    "04:30 PM",
    "04:45 PM",
    "05:00 PM",
];

const toAmPm = (time) => {
    if (!time) return "";
    if (time.includes("AM") || time.includes("PM")) return time;
    const parts = time.split(":");
    const hour = parseInt(parts[0]);
    const min = parts[1]?.substring(0, 2) || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${min} ${ampm}`;
};

export default function ExamDetail({ exam, subjects, examSubjects }) {
    const [subjectDates, setSubjectDates] = useState(() => {
        const init = {};
        subjects.forEach((s) => {
            const existing = examSubjects[s.id];
            init[s.id] = {
                exam_date: existing?.exam_date?.split("T")[0] || "",
                start_time: toAmPm(existing?.start_time) || "",
                end_time: toAmPm(existing?.end_time) || "",
                room: existing?.room || "",
                practical_date: existing?.practical_date?.split("T")[0] || "",
                practical_start_time:
                    toAmPm(existing?.practical_start_time) || "",
                practical_end_time: toAmPm(existing?.practical_end_time) || "",
                practical_room: existing?.practical_room || "",
            };
        });
        return init;
    });

    const [saving, setSaving] = useState(false);
    const savedCount = Object.values(examSubjects).length;

    const handleChange = (subjectId, field, value) => {
        setSubjectDates((prev) => ({
            ...prev,
            [subjectId]: { ...prev[subjectId], [field]: value },
        }));
    };

    const handleSave = () => {
        setSaving(true);
        router.post(
            "/exams/subject-dates",
            {
                exam_id: exam.id,
                subjects: subjectDates,
            },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const TimeSelect = ({ value, onChange, color = "blue" }) => (
        <select
            value={value}
            onChange={onChange}
            className={`border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-${color}-500 w-full`}
        >
            <option value="">-- Select --</option>
            {TIMES.map((t) => (
                <option key={t} value={t}>
                    {t}
                </option>
            ))}
        </select>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Exam Detail" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/exams/class?class_id=${exam.school_class_id}`}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold">{exam.name}</h3>
                            <p className="text-blue-100 text-sm">
                                {exam.school_class?.name} |{" "}
                                {exam.type?.replace("_", " ")} |{" "}
                                {exam.start_date?.split("T")[0]} →{" "}
                                {exam.end_date?.split("T")[0]}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={`/exams/schedule-pdf?exam_id=${exam.id}`}
                            target="_blank"
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                        >
                            📄 Download PDF
                        </a>
                        <div className="text-right">
                            <p className="text-sm text-blue-100">Scheduled</p>
                            <p className="text-2xl font-bold">
                                {savedCount}/{subjects.length}
                            </p>
                        </div>
                    </div>
                </div>

                {subjects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">📭</p>
                        <p className="text-gray-400 mb-4">No subjects found</p>
                        <Link
                            href={`/subjects/class?class_id=${exam.school_class_id}`}
                            className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                        >
                            + Add Subjects
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
                            <div className="p-4 bg-gray-50 border-b">
                                <h3 className="font-semibold text-gray-800">
                                    📅 Subject-wise Exam Dates
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter theory and practical exam dates
                                </p>
                            </div>

                            {subjects.map((sub, i) => {
                                const data = subjectDates[sub.id] || {};
                                const isSaved = !!examSubjects[sub.id];

                                return (
                                    <div
                                        key={sub.id}
                                        className={`border-b p-4 ${isSaved ? "bg-green-50" : ""}`}
                                    >
                                        {/* Subject Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 font-bold">
                                                    #{i + 1}
                                                </span>
                                                <div>
                                                    <span className="font-bold text-gray-800">
                                                        {sub.name}
                                                    </span>
                                                    {sub.has_practical && (
                                                        <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">
                                                            +Practical
                                                        </span>
                                                    )}
                                                    {sub.code && (
                                                        <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">
                                                            {sub.code}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {isSaved ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                                    ✅ Saved
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                                                    ⬜ Pending
                                                </span>
                                            )}
                                        </div>

                                        {/* Theory Row */}
                                        <div className="bg-blue-50 rounded-lg p-3 mb-2">
                                            <p className="text-xs font-semibold text-blue-700 mb-2">
                                                📝 Theory Exam
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">
                                                        Date *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={
                                                            data.exam_date || ""
                                                        }
                                                        min={
                                                            exam.start_date?.split(
                                                                "T",
                                                            )[0]
                                                        }
                                                        max={
                                                            exam.end_date?.split(
                                                                "T",
                                                            )[0]
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                sub.id,
                                                                "exam_date",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">
                                                        Start Time
                                                    </label>
                                                    <TimeSelect
                                                        value={
                                                            data.start_time ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                sub.id,
                                                                "start_time",
                                                                e.target.value,
                                                            )
                                                        }
                                                        color="blue"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">
                                                        End Time
                                                    </label>
                                                    <TimeSelect
                                                        value={
                                                            data.end_time || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                sub.id,
                                                                "end_time",
                                                                e.target.value,
                                                            )
                                                        }
                                                        color="blue"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">
                                                        Room
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.room || ""}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                sub.id,
                                                                "room",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Room No."
                                                        className="border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Practical Row */}
                                        {sub.has_practical && (
                                            <div className="bg-purple-50 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-purple-700 mb-2">
                                                    🔬 Practical Exam
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">
                                                            Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={
                                                                data.practical_date ||
                                                                ""
                                                            }
                                                            min={
                                                                exam.start_date?.split(
                                                                    "T",
                                                                )[0]
                                                            }
                                                            max={
                                                                exam.end_date?.split(
                                                                    "T",
                                                                )[0]
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    sub.id,
                                                                    "practical_date",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">
                                                            Start Time
                                                        </label>
                                                        <TimeSelect
                                                            value={
                                                                data.practical_start_time ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    sub.id,
                                                                    "practical_start_time",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            color="purple"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">
                                                            End Time
                                                        </label>
                                                        <TimeSelect
                                                            value={
                                                                data.practical_end_time ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    sub.id,
                                                                    "practical_end_time",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            color="purple"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">
                                                            Room
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                data.practical_room ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    sub.id,
                                                                    "practical_room",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Room No."
                                                            className="border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Saving..." : "💾 Save All Dates"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
