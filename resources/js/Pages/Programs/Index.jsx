import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ programs, filters }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);

    const emptyForm = {
        title: "",
        age_range: "",
        description: "",
        sort_order: 0,
        status: "active",
        image: null,
    };
    const [form, setForm] = useState(emptyForm);

    const applyFilter = () => {
        router.get(
            "/programs",
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    const openAdd = () => {
        setForm(emptyForm);
        setEditData(null);
        setPreview(null);
        setShowModal(true);
    };

    const openEdit = (program) => {
        setForm({
            title: program.title,
            age_range: program.age_range || "",
            description: program.description || "",
            sort_order: program.sort_order || 0,
            status: program.status,
            image: null,
        });
        setPreview(program.image ? `/storage/${program.image}` : null);
        setEditData(program);
        setShowModal(true);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((p) => ({ ...p, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        setSaving(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null && v !== "") fd.append(k, v);
        });

        if (editData) {
            fd.append("_method", "PUT");
            router.post(`/programs/${editData.id}`, fd, {
                onSuccess: () => {
                    setSaving(false);
                    setShowModal(false);
                },
                onError: () => setSaving(false),
            });
        } else {
            router.post("/programs", fd, {
                onSuccess: () => {
                    setSaving(false);
                    setShowModal(false);
                    setForm(emptyForm);
                },
                onError: () => setSaving(false),
            });
        }
    };

    const deleteProgram = (id) => {
        if (confirm("Delete this program?")) router.delete(`/programs/${id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Programs" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">🎓 Programs</h2>
                        <p className="text-purple-100 text-sm mt-1">
                            Manage school programs & courses
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-purple-50 font-medium"
                    >
                        + Add Program
                    </button>
                </div>

                {/* Flash */}
                {flash.success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-40">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && applyFilter()
                            }
                            placeholder="🔍 Search programs..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button
                        onClick={applyFilter}
                        className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-purple-700"
                    >
                        Filter
                    </button>
                    {(search || status) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                router.get("/programs");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {programs.data.length === 0 ? (
                        <div className="col-span-4 bg-white rounded-xl shadow text-center py-16">
                            <p className="text-5xl mb-3">🎓</p>
                            <p className="text-gray-400">No programs found</p>
                        </div>
                    ) : (
                        programs.data.map((program) => (
                            <div
                                key={program.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                            >
                                {/* Image */}
                                <div className="w-full overflow-hidden bg-purple-50">
                                    {program.image ? (
                                        <img
                                            src={`/storage/${program.image}`}
                                            alt={program.title}
                                            className="w-full h-auto object-contain"
                                        />
                                    ) : (
                                        <div className="h-40 flex items-center justify-center text-5xl">
                                            🎓
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg">
                                            {program.title}
                                        </h3>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${program.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                        >
                                            {program.status}
                                        </span>
                                    </div>
                                    {program.age_range && (
                                        <p className="text-purple-500 text-sm font-medium mb-1">
                                            👶 Age: {program.age_range}
                                        </p>
                                    )}
                                    {program.description && (
                                        <p className="text-gray-500 text-xs line-clamp-2">
                                            {program.description}
                                        </p>
                                    )}
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => openEdit(program)}
                                            className="flex-1 bg-yellow-400 text-white py-1.5 rounded-lg text-xs hover:bg-yellow-500 font-medium"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteProgram(program.id)
                                            }
                                            className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs hover:bg-red-600 font-medium"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {programs.last_page > 1 && (
                    <div className="mt-6 flex gap-2 justify-center">
                        {Array.from(
                            { length: programs.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() =>
                                    router.get("/programs", {
                                        ...filters,
                                        page,
                                    })
                                }
                                className={`px-3 py-1 rounded text-sm ${page === programs.current_page ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editData
                                    ? "✏️ Edit Program"
                                    : "➕ Add Program"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. Play Group"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Age Range
                                </label>
                                <input
                                    type="text"
                                    value={form.age_range}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            age_range: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g. 2 - 3 Years"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Program description..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                sort_order: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-2 h-32 object-contain rounded-lg border"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 font-medium"
                            >
                                {saving
                                    ? "Saving..."
                                    : editData
                                      ? "Update Program"
                                      : "Save Program"}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
