import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

const emptyForm = {
    name: "",
    code: "",
    total_marks: "",
    passing_marks: "",
    has_practical: false,
    theory_marks: "",
    practical_marks: "",
    theory_passing: "",
    practical_passing: "",
};

export default function ClassSubjects({ class: cls, subjects }) {
    const { errors } = usePage().props;
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editForm, setEditForm] = useState({
        ...emptyForm,
        status: "active",
    });

    const submitAdd = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post(
            "/subjects",
            { ...form, school_class_id: cls.id },
            {
                onSuccess: () => {
                    setShowAdd(false);
                    setForm(emptyForm);
                    setSaving(false);
                },
                onError: () => setSaving(false),
            },
        );
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/subjects/${editData.id}`, editForm, {
            onSuccess: () => {
                setEditData(null);
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const deleteSubject = (id) => {
        if (confirm("Delete this subject?")) router.delete(`/subjects/${id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Class Subjects" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/subjects"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold">
                                {cls.name} — Subjects
                            </h3>
                            <p className="text-blue-100 text-sm">
                                {subjects.length} Subjects
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
                        + Add Subject
                    </button>
                </div>

                {/* Add Form */}
                {showAdd && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold mb-4">
                            ➕ Add Subject
                        </h3>
                        <form onSubmit={submitAdd}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject Name *
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
                                        placeholder="e.g. Biology"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                code: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. BIO-101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Marks *
                                    </label>
                                    <input
                                        type="number"
                                        readOnly={form.has_practical}
                                        value={
                                            form.has_practical
                                                ? parseInt(
                                                      form.theory_marks || 0,
                                                  ) +
                                                      parseInt(
                                                          form.practical_marks ||
                                                              0,
                                                      ) || ""
                                                : form.total_marks
                                        }
                                        onChange={(e) =>
                                            !form.has_practical &&
                                            setForm((p) => ({
                                                ...p,
                                                total_marks: e.target.value,
                                            }))
                                        }
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${form.has_practical ? "bg-gray-100" : ""}`}
                                        placeholder="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passing Marks *
                                    </label>
                                    <input
                                        type="number"
                                        readOnly={form.has_practical}
                                        value={
                                            form.has_practical
                                                ? parseInt(
                                                      form.theory_passing || 0,
                                                  ) +
                                                      parseInt(
                                                          form.practical_passing ||
                                                              0,
                                                      ) || ""
                                                : form.passing_marks
                                        }
                                        onChange={(e) =>
                                            !form.has_practical &&
                                            setForm((p) => ({
                                                ...p,
                                                passing_marks: e.target.value,
                                            }))
                                        }
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${form.has_practical ? "bg-gray-100" : ""}`}
                                        placeholder="40"
                                    />
                                </div>
                            </div>

                            {/* Practical Toggle */}
                            <div className="mt-3 flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.has_practical}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                has_practical: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Has Practical?
                                    </span>
                                </label>
                                {form.has_practical && (
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        Total marks will be auto-calculated
                                    </span>
                                )}
                            </div>

                            {/* Practical Fields - Add */}
                            {form.has_practical && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-700 mb-2">
                                        📝 Theory + Practical Marks
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Theory Marks
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 70"
                                                value={form.theory_marks}
                                                onChange={(e) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        theory_marks:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Theory Passing
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 28"
                                                value={form.theory_passing}
                                                onChange={(e) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        theory_passing:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Practical Marks
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 30"
                                                value={form.practical_marks}
                                                onChange={(e) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        practical_marks:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Practical Passing
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 12"
                                                value={form.practical_passing}
                                                onChange={(e) =>
                                                    setForm((p) => ({
                                                        ...p,
                                                        practical_passing:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    {form.theory_marks &&
                                        form.practical_marks && (
                                            <p className="text-xs text-blue-600 mt-2 font-medium">
                                                Total:{" "}
                                                {parseInt(
                                                    form.theory_marks || 0,
                                                ) +
                                                    parseInt(
                                                        form.practical_marks ||
                                                            0,
                                                    )}{" "}
                                                marks | Passing:{" "}
                                                {parseInt(
                                                    form.theory_passing || 0,
                                                ) +
                                                    parseInt(
                                                        form.practical_passing ||
                                                            0,
                                                    )}{" "}
                                                marks
                                            </p>
                                        )}
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Subject"}
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
                            ✏️ Edit Subject
                        </h3>
                        <form onSubmit={submitEdit}>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
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
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.code}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                code: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Marks
                                    </label>
                                    <input
                                        type="number"
                                        readOnly={editForm.has_practical}
                                        value={
                                            editForm.has_practical
                                                ? parseInt(
                                                      editForm.theory_marks ||
                                                          0,
                                                  ) +
                                                      parseInt(
                                                          editForm.practical_marks ||
                                                              0,
                                                      ) || ""
                                                : editForm.total_marks
                                        }
                                        onChange={(e) =>
                                            !editForm.has_practical &&
                                            setEditForm((p) => ({
                                                ...p,
                                                total_marks: e.target.value,
                                            }))
                                        }
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${editForm.has_practical ? "bg-gray-100" : ""}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passing Marks
                                    </label>
                                    <input
                                        type="number"
                                        readOnly={editForm.has_practical}
                                        value={
                                            editForm.has_practical
                                                ? parseInt(
                                                      editForm.theory_passing ||
                                                          0,
                                                  ) +
                                                      parseInt(
                                                          editForm.practical_passing ||
                                                              0,
                                                      ) || ""
                                                : editForm.passing_marks
                                        }
                                        onChange={(e) =>
                                            !editForm.has_practical &&
                                            setEditForm((p) => ({
                                                ...p,
                                                passing_marks: e.target.value,
                                            }))
                                        }
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${editForm.has_practical ? "bg-gray-100" : ""}`}
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
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Practical Toggle - Edit */}
                            <div className="mt-3 flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editForm.has_practical}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                has_practical: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Has Practical?
                                    </span>
                                </label>
                            </div>

                            {/* Practical Fields - Edit */}
                            {editForm.has_practical && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-700 mb-2">
                                        📝 Theory + Practical Marks
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Theory Marks
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 70"
                                                value={editForm.theory_marks}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        theory_marks:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Theory Passing
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 28"
                                                value={editForm.theory_passing}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        theory_passing:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Practical Marks
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 30"
                                                value={editForm.practical_marks}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        practical_marks:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Practical Passing
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 12"
                                                value={
                                                    editForm.practical_passing
                                                }
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        practical_passing:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    {editForm.theory_marks &&
                                        editForm.practical_marks && (
                                            <p className="text-xs text-blue-600 mt-2 font-medium">
                                                Total:{" "}
                                                {parseInt(
                                                    editForm.theory_marks || 0,
                                                ) +
                                                    parseInt(
                                                        editForm.practical_marks ||
                                                            0,
                                                    )}{" "}
                                                marks | Passing:{" "}
                                                {parseInt(
                                                    editForm.theory_passing ||
                                                        0,
                                                ) +
                                                    parseInt(
                                                        editForm.practical_passing ||
                                                            0,
                                                    )}{" "}
                                                marks
                                            </p>
                                        )}
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-yellow-400 text-white px-6 py-2 rounded-lg text-sm hover:bg-yellow-500 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Update Subject"}
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

                {/* Subjects Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {subjects.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📚</p>
                            <p className="text-gray-400 mb-4">
                                No subjects found
                            </p>
                            <button
                                onClick={() => setShowAdd(true)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                            >
                                + Add Subject
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Subject</th>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Theory</th>
                                    <th className="p-4">Practical</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Passing</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub, i) => (
                                    <tr
                                        key={sub.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {sub.name}
                                            {sub.has_practical && (
                                                <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded">
                                                    +Practical
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {sub.code ? (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">
                                                    {sub.code}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {sub.has_practical
                                                ? `${sub.theory_marks} (Pass: ${sub.theory_passing})`
                                                : "-"}
                                        </td>
                                        <td className="p-4">
                                            {sub.has_practical
                                                ? `${sub.practical_marks} (Pass: ${sub.practical_passing})`
                                                : "-"}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {sub.total_marks}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {sub.passing_marks}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(sub);
                                                        setEditForm({
                                                            name: sub.name,
                                                            code:
                                                                sub.code || "",
                                                            total_marks:
                                                                sub.total_marks,
                                                            passing_marks:
                                                                sub.passing_marks,
                                                            has_practical:
                                                                sub.has_practical,
                                                            theory_marks:
                                                                sub.theory_marks ||
                                                                "",
                                                            practical_marks:
                                                                sub.practical_marks ||
                                                                "",
                                                            theory_passing:
                                                                sub.theory_passing ||
                                                                "",
                                                            practical_passing:
                                                                sub.practical_passing ||
                                                                "",
                                                            status: sub.status,
                                                        });
                                                        setShowAdd(false);
                                                    }}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteSubject(sub.id)
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
