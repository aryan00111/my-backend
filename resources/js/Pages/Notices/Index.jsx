import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ notices, filters }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [type, setType] = useState(filters?.type || "");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        title: "",
        content: "",
        type: "general",
        audience: "all",
        status: "draft",
        published_at: "",
        expires_at: "",
        attachment: null,
    };
    const [form, setForm] = useState(emptyForm);

    const applyFilter = () => {
        router.get(
            "/notices",
            { search, status, type },
            { preserveState: true, replace: true },
        );
    };

    const openAdd = () => {
        setForm(emptyForm);
        setEditData(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setForm({
            title: item.title,
            content: item.content,
            type: item.type,
            audience: item.audience,
            status: item.status,
            published_at: item.published_at?.split("T")[0] || "",
            expires_at: item.expires_at?.split("T")[0] || "",
            attachment: null,
        });
        setEditData(item);
        setShowModal(true);
    };

    const handleSubmit = () => {
        setSaving(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null && v !== "") fd.append(k, v);
        });

        if (editData) {
            fd.append("_method", "PUT");
            router.post(`/notices/${editData.id}`, fd, {
                onSuccess: () => {
                    setSaving(false);
                    setShowModal(false);
                },
                onError: () => setSaving(false),
            });
        } else {
            router.post("/notices", fd, {
                onSuccess: () => {
                    setSaving(false);
                    setShowModal(false);
                    setForm(emptyForm);
                },
                onError: () => setSaving(false),
            });
        }
    };

    const deleteItem = (id) => {
        if (confirm("Delete this notice?")) router.delete(`/notices/${id}`);
    };

    const typeBadge = (t) => {
        if (t === "urgent") return "bg-red-100 text-red-700";
        if (t === "exam") return "bg-blue-100 text-blue-700";
        if (t === "holiday") return "bg-green-100 text-green-700";
        if (t === "event") return "bg-purple-100 text-purple-700";
        return "bg-gray-100 text-gray-700";
    };

    const statusBadge = (s) =>
        s === "published"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700";

    return (
        <AuthenticatedLayout>
            <Head title="Notices" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">📋 Notices</h2>
                        <p className="text-green-100 text-sm mt-1">
                            Manage school notices
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="bg-white text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50 font-medium"
                    >
                        + Add Notice
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
                            placeholder="🔍 Search notices..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">All Types</option>
                        <option value="general">General</option>
                        <option value="exam">Exam</option>
                        <option value="holiday">Holiday</option>
                        <option value="event">Event</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <button
                        onClick={applyFilter}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                        Filter
                    </button>
                    {(search || status || type) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setType("");
                                router.get("/notices");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {notices.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📋</p>
                            <p className="text-gray-400">No notices found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Audience</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Attachment</th>
                                    <th className="p-4">Expires</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.data.map((item, i) => (
                                    <tr
                                        key={item.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {(notices.current_page - 1) *
                                                notices.per_page +
                                                i +
                                                1}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-gray-800">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {item.content
                                                    ?.replace(/<[^>]*>/g, "")
                                                    .substring(0, 60)}
                                                ...
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeBadge(item.type)}`}
                                            >
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs capitalize">
                                                {item.audience}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {item.attachment ? (
                                                <a
                                                    href={`/storage/${item.attachment}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    📎 View
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {item.expires_at
                                                ? new Date(
                                                      item.expires_at,
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEdit(item)
                                                    }
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteItem(item.id)
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

                    {/* Pagination */}
                    {notices.last_page > 1 && (
                        <div className="p-4 flex gap-2 justify-center border-t">
                            {Array.from(
                                { length: notices.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() =>
                                        router.get("/notices", {
                                            ...filters,
                                            page,
                                        })
                                    }
                                    className={`px-3 py-1 rounded text-sm ${page === notices.current_page ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editData ? "✏️ Edit Notice" : "➕ Add Notice"}
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
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Notice title"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        value={form.type}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                type: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="general">General</option>
                                        <option value="exam">Exam</option>
                                        <option value="holiday">Holiday</option>
                                        <option value="event">Event</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Audience *
                                    </label>
                                    <select
                                        value={form.audience}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                audience: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="students">
                                            Students
                                        </option>
                                        <option value="teachers">
                                            Teachers
                                        </option>
                                        <option value="parents">Parents</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            content: e.target.value,
                                        }))
                                    }
                                    rows={6}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                    placeholder="Write notice content..."
                                />
                            </div>

                            {/* Attachment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attachment{" "}
                                    <span className="text-gray-400 font-normal">
                                        (PDF, DOC, Image — max 5MB)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            attachment:
                                                e.target.files[0] || null,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                                {editData?.attachment && (
                                    <a
                                        href={`/storage/${editData.attachment}`}
                                        target="_blank"
                                        className="text-blue-600 hover:underline text-xs mt-1 block"
                                    >
                                        📎 Current attachment — click to view
                                    </a>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
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
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Publish Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.published_at}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                published_at: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expires At
                                    </label>
                                    <input
                                        type="date"
                                        value={form.expires_at}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                expires_at: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 font-medium"
                            >
                                {saving
                                    ? "Saving..."
                                    : editData
                                      ? "Update Notice"
                                      : "Save Notice"}
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
