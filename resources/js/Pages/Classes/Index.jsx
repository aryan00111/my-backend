import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ classes }) {
    const { errors } = usePage().props;
    const [selectedClass, setSelectedClass] = useState(null);
    const [showAddClass, setShowAddClass] = useState(false);
    const [editClassData, setEditClassData] = useState(null);
    const [editSectionData, setEditSectionData] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);

    // Add Class Form State
    const [classForm, setClassForm] = useState({
        name: "",
        grade_level: "",
        description: "",
        sections: [], // Selected sections
    });

    // Edit Class Form State
    const [editForm, setEditForm] = useState({
        name: "",
        grade_level: "",
        description: "",
        status: "active",
    });

    // Section Form State
    const [sectionForm, setSectionForm] = useState({
        name: "",
        capacity: 30,
        status: "active",
    });

    const [saving, setSaving] = useState(false);

    const selectedClassData = classes.find((c) => c.id === selectedClass);

    const getExistingSections = (classId) => {
        const cls = classes.find((c) => c.id === classId);
        return cls ? cls.sections.map((s) => s.name.toUpperCase()) : [];
    };

    const availableSections = selectedClass
        ? ["A", "B", "C", "D", "E"].filter(
              (s) => !getExistingSections(selectedClass).includes(s),
          )
        : [];

    // Toggle section selection in Add Class form
    const toggleSection = (section) => {
        setClassForm((prev) => ({
            ...prev,
            sections: prev.sections.includes(section)
                ? prev.sections.filter((s) => s !== section)
                : [...prev.sections, section],
        }));
    };

    // Submit Add Class
    const submitClass = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post("/classes", classForm, {
            onSuccess: () => {
                setShowAddClass(false);
                setClassForm({
                    name: "",
                    grade_level: "",
                    description: "",
                    sections: [],
                });
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    // Submit Edit Class
    const submitEditClass = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/classes/${editClassData.id}`, editForm, {
            onSuccess: () => {
                setEditClassData(null);
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    // Submit Add Section
    const submitSection = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post(
            "/sections",
            {
                school_class_id: selectedClass,
                name: sectionForm.name,
                capacity: sectionForm.capacity,
            },
            {
                onSuccess: () => {
                    setShowAddSection(false);
                    setSectionForm({
                        name: "",
                        capacity: 30,
                        status: "active",
                    });
                    setSaving(false);
                },
                onError: () => setSaving(false),
            },
        );
    };

    // Submit Edit Section
    const submitEditSection = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/sections/${editSectionData.id}`, sectionForm, {
            onSuccess: () => {
                setEditSectionData(null);
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const deleteClass = (id) => {
        if (confirm("Delete this class?")) {
            router.delete(`/classes/${id}`);
        }
    };

    const deleteSection = (id) => {
        if (confirm("Delete this section?")) {
            router.delete(`/sections/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Classes & Sections" />

            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* ── CLASSES VIEW ── */}
                {!selectedClass ? (
                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    🏫 Classes & Sections
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Total Classes: {classes.length}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddClass(true);
                                    setEditClassData(null);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                            >
                                + Add Class
                            </button>
                        </div>

                        {/* ── ADD CLASS FORM ── */}
                        {showAddClass && (
                            <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-blue-500">
                                <h3 className="text-lg font-semibold mb-5">
                                    ➕ Add New Class
                                </h3>
                                <form onSubmit={submitClass}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                                        {/* Class Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Class Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={classForm.name}
                                                onChange={(e) =>
                                                    setClassForm((p) => ({
                                                        ...p,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g. Class 1, Class 10"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Grade Level */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Grade Level
                                            </label>
                                            <select
                                                value={classForm.grade_level}
                                                onChange={(e) =>
                                                    setClassForm((p) => ({
                                                        ...p,
                                                        grade_level:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Select Grade
                                                </option>
                                                {Array.from(
                                                    { length: 12 },
                                                    (_, i) => i + 1,
                                                ).map((g) => (
                                                    <option key={g} value={g}>
                                                        Grade {g}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.grade_level && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.grade_level}
                                                </p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={classForm.description}
                                                onChange={(e) =>
                                                    setClassForm((p) => ({
                                                        ...p,
                                                        description:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>

                                    {/* Sections Select */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sections Add Karo (Optional)
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {["A", "B", "C", "D", "E"].map(
                                                (s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSection(s)
                                                        }
                                                        className={`w-14 h-14 rounded-xl text-lg font-bold border-2 transition-all ${
                                                            classForm.sections.includes(
                                                                s,
                                                            )
                                                                ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                                                        }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                        {classForm.sections.length > 0 && (
                                            <p className="text-xs text-blue-500 mt-2">
                                                ✅ Selected: Section{" "}
                                                {classForm.sections.join(", ")}
                                            </p>
                                        )}
                                    </div>

                                    {/* Capacity per section */}
                                    {classForm.sections.length > 0 && (
                                        <div className="mb-5 p-4 bg-blue-50 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Capacity per Section
                                            </label>
                                            <select
                                                value={classForm.capacity || 30}
                                                onChange={(e) =>
                                                    setClassForm((p) => ({
                                                        ...p,
                                                        capacity:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {[
                                                    20, 25, 30, 35, 40, 45, 50,
                                                ].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n} Students
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Class"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddClass(false);
                                                setClassForm({
                                                    name: "",
                                                    grade_level: "",
                                                    description: "",
                                                    sections: [],
                                                });
                                            }}
                                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── EDIT CLASS FORM ── */}
                        {editClassData && (
                            <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-yellow-400">
                                <h3 className="text-lg font-semibold mb-5">
                                    ✏️ Edit Class — {editClassData.name}
                                </h3>
                                <form onSubmit={submitEditClass}>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Class Name *
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
                                                Grade Level
                                            </label>
                                            <select
                                                value={editForm.grade_level}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        grade_level:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Select Grade
                                                </option>
                                                {Array.from(
                                                    { length: 12 },
                                                    (_, i) => i + 1,
                                                ).map((g) => (
                                                    <option key={g} value={g}>
                                                        Grade {g}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.description}
                                                onChange={(e) =>
                                                    setEditForm((p) => ({
                                                        ...p,
                                                        description:
                                                            e.target.value,
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
                                                <option value="active">
                                                    Active
                                                </option>
                                                <option value="inactive">
                                                    Inactive
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
                                            {saving
                                                ? "Saving..."
                                                : "Update Class"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditClassData(null)
                                            }
                                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Classes Table */}
                        <div className="bg-white rounded-xl shadow overflow-x-auto">
                            {classes.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-5xl mb-3">📭</p>
                                    <p className="text-gray-400 mb-4">
                                        No classes found
                                    </p>
                                </div>
                            ) : (
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
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.map((cls, i) => (
                                            <tr
                                                key={cls.id}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="p-4 text-gray-500">
                                                    {i + 1}
                                                </td>
                                                <td className="p-4 font-bold text-gray-800">
                                                    {cls.name}
                                                </td>
                                                <td className="p-4">
                                                    {cls.grade_level ? (
                                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
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
                                                                        className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
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
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            cls.status ===
                                                            "active"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {cls.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedClass(
                                                                    cls.id,
                                                                );
                                                            }}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                        >
                                                            Sections
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditClassData(
                                                                    cls,
                                                                );
                                                                setEditForm({
                                                                    name: cls.name,
                                                                    grade_level:
                                                                        cls.grade_level ||
                                                                        "",
                                                                    description:
                                                                        cls.description ||
                                                                        "",
                                                                    status: cls.status,
                                                                });
                                                                setShowAddClass(
                                                                    false,
                                                                );
                                                            }}
                                                            className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                deleteClass(
                                                                    cls.id,
                                                                )
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
                ) : (
                    /* ── SECTIONS VIEW ── */
                    <div>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setSelectedClass(null);
                                        setShowAddSection(false);
                                        setEditSectionData(null);
                                    }}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                                >
                                    ← Back
                                </button>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {selectedClassData?.name} — Sections
                                    </h3>
                                    <p className="text-blue-100 text-sm">
                                        {selectedClassData?.sections?.length}{" "}
                                        Sections |{" "}
                                        {selectedClassData?.students_count}{" "}
                                        Students
                                    </p>
                                </div>
                            </div>
                            {availableSections.length > 0 && (
                                <button
                                    onClick={() => {
                                        setShowAddSection(true);
                                        setEditSectionData(null);
                                        setSectionForm({
                                            name: "",
                                            capacity: 30,
                                            status: "active",
                                        });
                                    }}
                                    className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium"
                                >
                                    + Add Section
                                </button>
                            )}
                        </div>

                        {/* Add Section Form */}
                        {(showAddSection || editSectionData) && (
                            <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-green-500">
                                <h3 className="text-lg font-semibold mb-4">
                                    {editSectionData
                                        ? "✏️ Edit Section"
                                        : "➕ Add Section"}
                                </h3>
                                <form
                                    onSubmit={
                                        editSectionData
                                            ? submitEditSection
                                            : submitSection
                                    }
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Section Name *
                                            </label>
                                            <select
                                                value={sectionForm.name}
                                                onChange={(e) =>
                                                    setSectionForm((p) => ({
                                                        ...p,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                <option value="">
                                                    Select Section
                                                </option>
                                                {(editSectionData
                                                    ? ["A", "B", "C", "D", "E"]
                                                    : availableSections
                                                ).map((s) => (
                                                    <option key={s} value={s}>
                                                        Section {s}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    ⚠️ {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Capacity
                                            </label>
                                            <select
                                                value={sectionForm.capacity}
                                                onChange={(e) =>
                                                    setSectionForm((p) => ({
                                                        ...p,
                                                        capacity:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                {[
                                                    20, 25, 30, 35, 40, 45, 50,
                                                ].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n} Students
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {editSectionData && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Status
                                                </label>
                                                <select
                                                    value={sectionForm.status}
                                                    onChange={(e) =>
                                                        setSectionForm((p) => ({
                                                            ...p,
                                                            status: e.target
                                                                .value,
                                                        }))
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="active">
                                                        Active
                                                    </option>
                                                    <option value="inactive">
                                                        Inactive
                                                    </option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-green-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : editSectionData
                                                  ? "Update Section"
                                                  : "Save Section"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddSection(false);
                                                setEditSectionData(null);
                                            }}
                                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Sections Table */}
                        <div className="bg-white rounded-xl shadow overflow-x-auto">
                            {selectedClassData?.sections?.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-5xl mb-3">📭</p>
                                    <p className="text-gray-400 mb-4">
                                        No sections found
                                    </p>
                                    <button
                                        onClick={() => {
                                            setShowAddSection(true);
                                            setSectionForm({
                                                name: "",
                                                capacity: 30,
                                                status: "active",
                                            });
                                        }}
                                        className="bg-green-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-600"
                                    >
                                        + Add Section
                                    </button>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-4">#</th>
                                            <th className="p-4">
                                                Section Name
                                            </th>
                                            <th className="p-4">Capacity</th>
                                            <th className="p-4">
                                                Total Students
                                            </th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedClassData?.sections?.map(
                                            (section, i) => {
                                                const sectionStudents =
                                                    selectedClassData?.students?.filter(
                                                        (s) =>
                                                            s.section_id ===
                                                            section.id,
                                                    ).length || 0;

                                                return (
                                                    <tr
                                                        key={section.id}
                                                        className="border-t hover:bg-gray-50"
                                                    >
                                                        <td className="p-4 text-gray-500">
                                                            {i + 1}
                                                        </td>
                                                        <td className="p-4 font-bold text-gray-800">
                                                            Section{" "}
                                                            {section.name}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                                {
                                                                    section.capacity
                                                                }{" "}
                                                                Students
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                                                {
                                                                    sectionStudents
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    section.status ===
                                                                    "active"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {section.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditSectionData(
                                                                            section,
                                                                        );
                                                                        setSectionForm(
                                                                            {
                                                                                name: section.name,
                                                                                capacity:
                                                                                    section.capacity,
                                                                                status: section.status,
                                                                            },
                                                                        );
                                                                        setShowAddSection(
                                                                            false,
                                                                        );
                                                                    }}
                                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteSection(
                                                                            section.id,
                                                                        )
                                                                    }
                                                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
