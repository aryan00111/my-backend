import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ feeTypes, filters }) {
    const { errors } = usePage().props;
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({
        name: "",
        default_amount: "",
        description: "",
    });
    const [editForm, setEditForm] = useState({
        name: "",
        default_amount: "",
        description: "",
        status: "active",
    });
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState(filters?.search || "");

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(
            "/fee-types",
            { search: val },
            { preserveState: true, replace: true },
        );
    };

    const submitAdd = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post("/fee-types", form, {
            onSuccess: () => {
                setShowAdd(false);
                setForm({ name: "", default_amount: "", description: "" });
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/fee-types/${editData.id}`, editForm, {
            onSuccess: () => {
                setEditData(null);
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const deleteType = (id) => {
        if (confirm("Delete this fee type?")) router.delete(`/fee-types/${id}`);
    };

    const filteredTypes = feeTypes.data || feeTypes;
    const isPaginated = feeTypes.last_page > 1;

    return (
        <AuthenticatedLayout>
            <Head title="Fee Types" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            💳 Fee Types
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {feeTypes.total ?? feeTypes.length} total fee types
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowAdd(true);
                            setEditData(null);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                    >
                        + Add Fee Type
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="🔍 Search fee types..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {search && (
                        <button
                            onClick={() => {
                                setSearch("");
                                router.get(
                                    "/fee-types",
                                    {},
                                    { preserveState: true },
                                );
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Add Form */}
                {showAdd && (
                    <div className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold mb-4">
                            ➕ Add Fee Type
                        </h3>
                        <form onSubmit={submitAdd}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fee Type Name *
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
                                        placeholder="e.g. Monthly Fee, Exam Fee"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Default Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={form.default_amount}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                default_amount: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                description: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save"}
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
                            ✏️ Edit Fee Type
                        </h3>
                        <form onSubmit={submitEdit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fee Type Name *
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
                                        Default Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.default_amount}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                default_amount: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                                                description: e.target.value,
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
                                        <option value="active">Active</option>
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

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {filteredTypes.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400 mb-4">
                                No fee types found
                            </p>
                            <button
                                onClick={() => setShowAdd(true)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                            >
                                + Add Fee Type
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Fee Type Name</th>
                                    <th className="p-4">Default Amount</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTypes.map((ft, i) => (
                                    <tr
                                        key={ft.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {isPaginated
                                                ? feeTypes.from + i
                                                : i + 1}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {ft.name}
                                        </td>
                                        <td className="p-4 text-green-600 font-bold">
                                            Rs.{" "}
                                            {ft.default_amount?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {ft.description || "-"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${ft.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {ft.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(ft);
                                                        setEditForm({
                                                            name: ft.name,
                                                            default_amount:
                                                                ft.default_amount,
                                                            description:
                                                                ft.description ||
                                                                "",
                                                            status: ft.status,
                                                        });
                                                        setShowAdd(false);
                                                    }}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteType(ft.id)
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
                    {isPaginated && (
                        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing {feeTypes.from}–{feeTypes.to} of{" "}
                                {feeTypes.total} fee types
                            </p>
                            <div className="flex gap-1">
                                {feeTypes.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        disabled={!link.url}
                                        className={`px-3 py-1.5 rounded text-xs font-medium ${
                                            link.active
                                                ? "bg-blue-500 text-white"
                                                : link.url
                                                  ? "bg-white border text-gray-600 hover:bg-gray-100"
                                                  : "bg-white border text-gray-300 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
