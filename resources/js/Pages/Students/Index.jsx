import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useCallback } from "react";

export default function Index({ students, classes, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [classId, setClassId] = useState(filters.class_id || "");
    const [status, setStatus] = useState(filters.status || "");

    const applyFilters = useCallback((newFilters) => {
        router.get(
            "/students",
            { ...newFilters },
            { preserveState: true, replace: true },
        );
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters({ search: val, class_id: classId, status });
    };

    const handleClass = (e) => {
        setClassId(e.target.value);
        applyFilters({ search, class_id: e.target.value, status });
    };

    const handleStatus = (e) => {
        setStatus(e.target.value);
        applyFilters({ search, class_id: classId, status: e.target.value });
    };

    const deleteStudent = (id) => {
        if (confirm("Delete this student?")) {
            router.delete(`/students/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Students" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            🎓 Students
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {students.total} total students
                        </p>
                    </div>
                    <Link
                        href="/students/create"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 font-medium"
                    >
                        + Add Student
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="🔍 Search by name, ID, email..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={classId}
                        onChange={handleClass}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Classes</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
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
                    {(search || classId || status) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setClassId("");
                                setStatus("");
                                router.get(
                                    "/students",
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
                    {students.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">No students found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Student ID</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Class</th>
                                    <th className="p-4">Section</th>
                                    <th className="p-4">Roll No</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.map((student, i) => (
                                    <tr
                                        key={student.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {students.from + i}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-blue-600 font-bold">
                                            {student.student_id}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">
                                                {student.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {student.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {student.school_class?.name || "-"}
                                        </td>
                                        <td className="p-4">
                                            {student.section?.name || "-"}
                                        </td>

                                        <td className="p-4">
                                            {student.roll_number || "-"}
                                        </td>

                                        <td className="p-4">
                                            {student.phone || "-"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/students/${student.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/students/${student.id}/edit`}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteStudent(
                                                            student.id,
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

                    {/* Pagination */}
                    {students.last_page > 1 && (
                        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing {students.from}–{students.to} of{" "}
                                {students.total} students
                            </p>
                            <div className="flex gap-1">
                                {students.links.map((link, i) => (
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
