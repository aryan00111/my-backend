import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useCallback } from "react";

export default function Index({ departments, filters }) {
    const { errors } = usePage().props;
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState(null);
    const [form, setForm] = useState({ name: "", code: "", description: "" });
    const [editForm, setEditForm] = useState({
        name: "",
        code: "",
        description: "",
        status: "active",
    });
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState(filters?.search || "");

    const applySearch = useCallback((val) => {
        router.get(
            "/departments",
            { search: val },
            { preserveState: true, replace: true },
        );
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applySearch(val);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post("/departments", form, {
            onSuccess: () => {
                setShowAdd(false);
                setForm({ name: "", code: "", description: "" });
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(`/departments/${editData.id}`, editForm, {
            onSuccess: () => {
                setEditData(null);
                setSaving(false);
            },
            onError: () => setSaving(false),
        });
    };

    const deleteDept = (id) => {
        if (confirm("Delete this department?"))
            router.delete(`/departments/${id}`);
    };

    const filteredDepts = departments.data || departments;
    const isPaginated = departments.last_page > 1;

    return (
        <AuthenticatedLayout>
            <Head title="Departments" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            🏢 Departments
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {departments.total ?? departments.length} total
                            departments
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowAdd(true);
                            setEditData(null);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                    >
                        + Add Department
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="🔍 Search departments..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {search && (
                        <button
                            onClick={() => {
                                setSearch("");
                                router.get(
                                    "/departments",
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
                        <h3 className="font-semibold mb-4">
                            ➕ Add Department
                        </h3>
                        <form onSubmit={submitAdd}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
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
                                        placeholder="e.g. Science"
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
                                        placeholder="e.g. SCI"
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
                        <h3 className="font-semibold mb-4">
                            ✏️ Edit Department
                        </h3>
                        <form onSubmit={submitEdit}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    {filteredDepts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">🏢</p>
                            <p className="text-gray-400 mb-4">
                                No departments found
                            </p>
                            <button
                                onClick={() => setShowAdd(true)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                            >
                                + Add Department
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Teachers</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepts.map((dept, i) => (
                                    <tr
                                        key={dept.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {isPaginated
                                                ? departments.from + i
                                                : i + 1}
                                        </td>
                                        <td className="p-4 font-bold">
                                            {dept.name}
                                        </td>
                                        <td className="p-4">
                                            {dept.code ? (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">
                                                    {dept.code}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {dept.description || "-"}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                                {dept.teachers_count}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${dept.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {dept.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditData(dept);
                                                        setEditForm({
                                                            name: dept.name,
                                                            code:
                                                                dept.code || "",
                                                            description:
                                                                dept.description ||
                                                                "",
                                                            status: dept.status,
                                                        });
                                                        setShowAdd(false);
                                                    }}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteDept(dept.id)
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
                                Showing {departments.from}–{departments.to} of{" "}
                                {departments.total} departments
                            </p>
                            <div className="flex gap-1">
                                {departments.links.map((link, i) => (
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
