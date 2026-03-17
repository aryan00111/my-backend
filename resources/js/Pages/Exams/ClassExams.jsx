import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function ClassExams({ class: cls, exams }) {
    const { errors } = usePage().props;
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({
        name: "",
        type: "unit_test",
        start_date: "",
        end_date: "",
    });
    const [editForm, setEditForm] = useState({
        name: "",
        type: "",
        start_date: "",
        end_date: "",
        status: "scheduled",
    });
    const [saving, setSaving] = useState(false);

    const submitAdd = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post(
            "/exams",
            { ...form, school_class_id: cls.id },
            {
                onSuccess: () => {
                    setShowAdd(false);
                    setForm({
                        name: "",
                        type: "unit_test",
                        start_date: "",
                        end_date: "",
                    });
                    setSaving(false);
                },
                onError: () => setSaving(false),
            },
        );
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/exams/${editData.id}`, editForm, {
            onSuccess: () => {
                setEditData(null);
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const deleteExam = (id) => {
        if (confirm("Delete this exam?")) {
            router.delete(`/exams/${id}`);
        }
    };

    const examTypes = [
        { value: "unit_test", label: "Unit Test" },
        { value: "half_yearly", label: "Half Yearly" },
        { value: "annual", label: "Annual" },
        { value: "other", label: "Other" },
    ];

    const statusColors = {
        scheduled: "bg-blue-100 text-blue-700",
        ongoing: "bg-yellow-100 text-yellow-700",
        completed: "bg-green-100 text-green-700",
    };

    return (
        <AuthenticatedLayout>
            <Head title="Class Exams" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/exams"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold">
                                {cls.name} — Exams
                            </h3>
                            <p className="text-blue-100 text-sm">
                                {exams.length} Exams
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowAdd(true);
                            setEditData(null);
                        }}
                        className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium"
                    >
                        + Add Exam
                    </button>
                </div>

                {/* Add Form */}
                {showAdd && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold mb-4">
                            ➕ Add Exam
                        </h3>
                        <form onSubmit={submitAdd}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exam Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Mid Term Exam"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exam Type *
                                    </label>
                                    <select
                                        value={form.type}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {examTypes.map((t) => (
                                            <option
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={form.start_date}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                start_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={form.end_date}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                end_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Exam"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAdd(false)}
                                    className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Edit Form */}
                {editData && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-yellow-400">
                        <h3 className="text-lg font-semibold mb-4">
                            ✏️ Edit Exam
                        </h3>
                        <form onSubmit={submitEdit}>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exam Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        value={editForm.type}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {examTypes.map((t) => (
                                            <option
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.start_date}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                start_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.end_date}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                end_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="scheduled">
                                            Scheduled
                                        </option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-yellow-400 text-white px-6 py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Update"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditData(null)}
                                    className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Exams Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {exams.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400 mb-4">No exams found</p>
                            <button
                                onClick={() => setShowAdd(true)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                            >
                                + Add Exam
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Exam Name</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Start Date</th>
                                    <th className="p-4">End Date</th>
                                    <th className="p-4">Subjects</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Published</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam, i) => (
                                    <tr
                                        key={exam.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {exam.name}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs capitalize">
                                                {exam.type?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {exam.start_date?.split("T")[0]}
                                        </td>
                                        <td className="p-4">
                                            {exam.end_date?.split("T")[0]}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/exams/detail?exam_id=${exam.id}`}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                            >
                                                📅 Subject Dates (
                                                {exam.exam_subjects_count || 0})
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[exam.status] || "bg-gray-100"}`}
                                            >
                                                {exam.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() =>
                                                    router.post(
                                                        `/exams/${exam.id}/publish`,
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    exam.is_published
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                {exam.is_published
                                                    ? "✅ Published"
                                                    : "⬜ Unpublished"}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(exam);
                                                        setEditForm({
                                                            name: exam.name,
                                                            type: exam.type,
                                                            start_date:
                                                                exam.start_date?.split(
                                                                    "T",
                                                                )[0] || "",
                                                            end_date:
                                                                exam.end_date?.split(
                                                                    "T",
                                                                )[0] || "",
                                                            status: exam.status,
                                                        });
                                                        setShowAdd(false);
                                                    }}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteExam(exam.id)
                                                    }
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
