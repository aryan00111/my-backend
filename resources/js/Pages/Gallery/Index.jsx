import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ galleries, filters }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [category, setCategory] = useState(filters?.category || "");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [editPreview, setEditPreview] = useState(null);

    const categories = [
        "general",
        "events",
        "sports",
        "academic",
        "cultural",
        "infrastructure",
    ];

    const emptyForm = {
        title: "",
        description: "",
        category: "general",
        status: "active",
        sort_order: 0,
        images: [],
    };
    const [form, setForm] = useState(emptyForm);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        category: "general",
        status: "active",
        sort_order: 0,
        image: null,
    });

    const applyFilter = () => {
        router.get(
            "/gallery",
            { search, status, category },
            { preserveState: true, replace: true },
        );
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setForm((p) => ({ ...p, images: files }));
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const handleUpload = () => {
        if (!form.images.length) return;
        setSaving(true);
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("category", form.category);
        fd.append("status", form.status);
        fd.append("sort_order", form.sort_order);
        form.images.forEach((img) => fd.append("images[]", img));

        router.post("/gallery", fd, {
            onSuccess: () => {
                setSaving(false);
                setShowUploadModal(false);
                setForm(emptyForm);
                setPreviews([]);
            },
            onError: () => setSaving(false),
        });
    };

    const openEdit = (item) => {
        setEditData(item);
        setEditForm({
            title: item.title,
            description: item.description || "",
            category: item.category,
            status: item.status,
            sort_order: item.sort_order,
            image: null,
        });
        setEditPreview(`/storage/${item.image}`);
        setShowEditModal(true);
    };

    const handleEdit = () => {
        setSaving(true);
        const fd = new FormData();
        Object.entries(editForm).forEach(([k, v]) => {
            if (v !== null && v !== "") fd.append(k, v);
        });
        fd.append("_method", "PUT");

        router.post(`/gallery/${editData.id}`, fd, {
            onSuccess: () => {
                setSaving(false);
                setShowEditModal(false);
            },
            onError: () => setSaving(false),
        });
    };

    const deleteItem = (id) => {
        if (confirm("Delete this image?")) router.delete(`/gallery/${id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gallery" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">🖼️ Gallery</h2>
                        <p className="text-pink-100 text-sm mt-1">
                            Manage school photo gallery
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowUploadModal(true);
                            setForm(emptyForm);
                            setPreviews([]);
                        }}
                        className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-50 font-medium"
                    >
                        📤 Upload Images
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
                            placeholder="🔍 Search gallery..."
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
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c} className="capitalize">
                                {c}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={applyFilter}
                        className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-purple-700"
                    >
                        Filter
                    </button>
                    {(search || status || category) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setCategory("");
                                router.get("/gallery");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-purple-500">
                        <p className="text-3xl font-bold text-purple-600">
                            {galleries.total}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Images
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                        <p className="text-3xl font-bold text-green-600">
                            {
                                galleries.data.filter(
                                    (g) => g.status === "active",
                                ).length
                            }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Active (This Page)
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                        <p className="text-3xl font-bold text-blue-600">
                            {galleries.current_page}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Current Page
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-pink-500">
                        <p className="text-3xl font-bold text-pink-600">
                            {galleries.last_page}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Pages
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {galleries.data.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-16 text-center">
                        <p className="text-5xl mb-3">🖼️</p>
                        <p className="text-gray-400 mb-4">No images found</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-purple-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-purple-600"
                        >
                            📤 Upload First Image
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleries.data.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow overflow-hidden group"
                            >
                                <div className="relative">
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    {item.status === "inactive" && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white text-xs bg-red-500 px-2 py-1 rounded">
                                                Inactive
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="bg-yellow-400 text-white p-1.5 rounded-lg text-xs hover:bg-yellow-500"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="bg-red-500 text-white p-1.5 rounded-lg text-xs hover:bg-red-600"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="font-bold text-gray-800 text-sm truncate">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs capitalize">
                                            {item.category}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-xs text-gray-400 mt-1 truncate">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galleries.last_page > 1 && (
                    <div className="mt-5 flex gap-2 justify-center">
                        {Array.from(
                            { length: galleries.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() =>
                                    router.get("/gallery", { ...filters, page })
                                }
                                className={`px-3 py-1 rounded text-sm ${page === galleries.current_page ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 shadow"}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                📤 Upload Images
                            </h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
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
                                    placeholder="e.g. Annual Sports Day 2025"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {categories.map((c) => (
                                            <option
                                                key={c}
                                                value={c}
                                                className="capitalize"
                                            >
                                                {c}
                                            </option>
                                        ))}
                                    </select>
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
                                    rows={2}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Images *{" "}
                                    <span className="text-gray-400 font-normal">
                                        (Multiple allowed — max 4MB each)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImages}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {previews.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt=""
                                            className="w-full h-24 object-cover rounded-lg border"
                                        />
                                    ))}
                                </div>
                            )}

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
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleUpload}
                                disabled={
                                    saving || !form.images.length || !form.title
                                }
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Uploading..." : "📤 Upload"}
                            </button>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                ✏️ Edit Image
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {editPreview && (
                                <img
                                    src={editPreview}
                                    alt="Current"
                                    className="w-full h-40 object-cover rounded-lg border"
                                />
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {categories.map((c) => (
                                            <option
                                                key={c}
                                                value={c}
                                                className="capitalize"
                                            >
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
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
                                    Description
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={2}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Replace Image{" "}
                                    <span className="text-gray-400 font-normal">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setEditForm((p) => ({
                                                ...p,
                                                image: file,
                                            }));
                                            setEditPreview(
                                                URL.createObjectURL(file),
                                            );
                                        }
                                    }}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={editForm.sort_order}
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            sort_order: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleEdit}
                                disabled={saving}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Saving..." : "💾 Save Changes"}
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
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
