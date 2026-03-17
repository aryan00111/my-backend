import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useCallback } from "react";

export default function Index({ teachers, departments, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [departmentId, setDeptId] = useState(filters.department_id || "");
    const [status, setStatus] = useState(filters.status || "");

    const [showModal, setShowModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const applyFilters = useCallback((f) => {
        router.get(
            "/teachers",
            { ...f },
            { preserveState: true, replace: true },
        );
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters({ search: val, department_id: departmentId, status });
    };

    const handleDept = (e) => {
        setDeptId(e.target.value);
        applyFilters({ search, department_id: e.target.value, status });
    };

    const handleStatus = (e) => {
        setStatus(e.target.value);
        applyFilters({
            search,
            department_id: departmentId,
            status: e.target.value,
        });
    };

    const deleteTeacher = (id) => {
        if (confirm("Delete this teacher?")) {
            router.delete(`/teachers/${id}`);
        }
    };

    const openChangeLoginModal = (teacher) => {
        setSelectedTeacher(teacher);
        setNewEmail(teacher.email || "");
        setNewPassword("");
        setConfirmPassword("");
        setModalError("");
        setModalSuccess("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTeacher(null);
    };

    const handleChangeLogin = () => {
        setModalError("");
        setModalSuccess("");

        if (!newEmail.trim()) {
            setModalError("Email (Login ID) required .");
            return;
        }
        if (newPassword && newPassword.length < 6) {
            setModalError("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setModalError("Password and Confirm Password do not match.");
            return;
        }

        setLoading(true);
        router.post(
            `/teachers/${selectedTeacher.id}/change-login`,
            { email: newEmail, password: newPassword || null },
            {
                preserveState: true,
                onSuccess: () => {
                    setModalSuccess(
                        "✅ Login ID / Password updated successfully!",
                    );
                    setLoading(false);
                    setTimeout(() => closeModal(), 1500);
                },
                onError: (errors) => {
                    setModalError(
                        errors.email ||
                            errors.password ||
                            "Some error occurred, please try again.",
                    );
                    setLoading(false);
                },
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Teachers" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            👨‍🏫 Teachers
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {teachers.total} total teachers
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/teachers-attendance"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                        >
                            ✅ Attendance
                        </Link>
                        <Link
                            href="/teachers/create"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                        >
                            + Add Teacher
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-40">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="🔍 Search by name or email..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={departmentId}
                        onChange={handleDept}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={handleStatus}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {(search || departmentId || status) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setDeptId("");
                                setStatus("");
                                router.get(
                                    "/teachers",
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

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {teachers.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">No teachers found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Qualification</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Login</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.data.map((teacher, i) => (
                                    <tr
                                        key={teacher.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {teachers.from + i}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">
                                                {teacher.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {teacher.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {teacher.department ? (
                                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                                    {teacher.department.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {teacher.phone || "-"}
                                        </td>
                                        <td className="p-4">
                                            {teacher.qualification}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {teacher.user_id ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                        ✅ Active
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            openChangeLoginModal(
                                                                teacher,
                                                            )
                                                        }
                                                        className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 mt-1"
                                                    >
                                                        🔄 Change Login
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        router.post(
                                                            `/teachers/${teacher.id}/create-login`,
                                                        )
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    🔑 Create Login
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/teachers/${teacher.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/teachers/${teacher.id}/edit`}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteTeacher(
                                                            teacher.id,
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

                    {teachers.last_page > 1 && (
                        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing {teachers.from}–{teachers.to} of{" "}
                                {teachers.total} teachers
                            </p>
                            <div className="flex gap-1">
                                {teachers.links.map((link, i) => (
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

            {/* Modal */}
            {showModal && selectedTeacher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center p-5 border-b">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    🔄 Change Login Credentials
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {selectedTeacher.name}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {modalError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                                    ❌ {modalError}
                                </div>
                            )}
                            {modalSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                                    {modalSuccess}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    📧 Login ID (Email)
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) =>
                                        setNewEmail(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="teacher@school.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    🔒 New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Leave blank if you don't want to change it"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    * If you only want to update your email
                                    address, you can leave the password blank.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    🔒 Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="retype password"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 p-5 border-t">
                            <button
                                onClick={closeModal}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangeLogin}
                                disabled={loading}
                                className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "💾 Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
