import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ classes, parents }) {
    const [selectedClass, setSelectedClass] = useState(null);
    const [classSearch, setClassSearch] = useState("");
    const [parentSearch, setParentSearch] = useState("");

    const selectedClassData = classes.find((c) => c.id === selectedClass);

    const filteredClasses = classes.filter((c) =>
        c.name.toLowerCase().includes(classSearch.toLowerCase()),
    );

    const classParents = parents.filter(
        (p) => p.student?.class_id === selectedClass,
    );

    const filteredParents = classParents.filter(
        (p) =>
            (p.user?.name || "")
                .toLowerCase()
                .includes(parentSearch.toLowerCase()) ||
            (p.student?.name || "")
                .toLowerCase()
                .includes(parentSearch.toLowerCase()) ||
            (p.user?.email || "")
                .toLowerCase()
                .includes(parentSearch.toLowerCase()),
    );

    const deleteParent = (id) => {
        if (
            confirm(
                "Delete this parent? Their login account will also be deleted!",
            )
        ) {
            router.delete(`/parents/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Parents" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {!selectedClass ? (
                    /* ── CLASSES VIEW ── */
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    👨‍👩‍👧 Parents
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Select a class to view parents
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={classSearch}
                                    onChange={(e) =>
                                        setClassSearch(e.target.value)
                                    }
                                    placeholder="🔍 Search class..."
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {classSearch && (
                                <button
                                    onClick={() => setClassSearch("")}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {filteredClasses.length === 0 ? (
                            <div className="bg-white rounded-xl shadow p-16 text-center">
                                <p className="text-6xl mb-4">📭</p>
                                <p className="text-gray-400 text-lg mb-4">
                                    No classes found
                                </p>
                                <Link
                                    href="/classes"
                                    className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                                >
                                    Add Classes →
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow overflow-x-auto">
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
                                            <th className="p-4">
                                                Total Parents
                                            </th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClasses.map((cls, i) => {
                                            const totalParents = parents.filter(
                                                (p) =>
                                                    p.student?.class_id ===
                                                    cls.id,
                                            ).length;
                                            return (
                                                <tr
                                                    key={cls.id}
                                                    className="border-t hover:bg-blue-50"
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
                                                                {
                                                                    cls.grade_level
                                                                }
                                                            </span>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {cls.sections
                                                                ?.length > 0 ? (
                                                                cls.sections.map(
                                                                    (s) => (
                                                                        <span
                                                                            key={
                                                                                s.id
                                                                            }
                                                                            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                                                                        >
                                                                            Sec{" "}
                                                                            {
                                                                                s.name
                                                                            }
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
                                                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                                            {totalParents}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedClass(
                                                                    cls.id,
                                                                )
                                                            }
                                                            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-blue-600 font-medium"
                                                        >
                                                            View Parents →
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── PARENTS VIEW ── */
                    <div>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex flex-wrap justify-between items-center gap-3">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setSelectedClass(null);
                                        setParentSearch("");
                                    }}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                                >
                                    ← Back
                                </button>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {selectedClassData?.name} — Parents
                                    </h3>
                                    <p className="text-blue-100 text-sm">
                                        {classParents.length} Parents |{" "}
                                        {selectedClassData?.students_count}{" "}
                                        Students
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/parents/create?class_id=${selectedClass}`}
                                className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium"
                            >
                                + Add Parent
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={parentSearch}
                                    onChange={(e) =>
                                        setParentSearch(e.target.value)
                                    }
                                    placeholder="🔍 Search parent or student name..."
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {parentSearch && (
                                <button
                                    onClick={() => setParentSearch("")}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Parents Table */}
                        <div className="bg-white rounded-xl shadow overflow-x-auto">
                            {filteredParents.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-5xl mb-3">📭</p>
                                    <p className="text-gray-400 mb-4">
                                        No parents found
                                    </p>
                                    <Link
                                        href={`/parents/create?class_id=${selectedClass}`}
                                        className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                                    >
                                        + Add Parent
                                    </Link>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-4">#</th>
                                            <th className="p-4">Parent Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Relation</th>
                                            <th className="p-4">
                                                Student Name
                                            </th>
                                            <th className="p-4">Class</th>
                                            <th className="p-4">Section</th>
                                            <th className="p-4">Phone</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredParents.map((parent, i) => (
                                            <tr
                                                key={parent.id}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="p-4 text-gray-500">
                                                    {i + 1}
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {parent.user?.name}
                                                </td>
                                                <td className="p-4 text-gray-500 text-xs">
                                                    {parent.user?.email}
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                                                        {parent.relation}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium">
                                                        {parent.student?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-mono">
                                                        {
                                                            parent.student
                                                                ?.student_id
                                                        }
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        {
                                                            parent.student
                                                                ?.school_class
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {parent.student?.section ? (
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                                            Sec{" "}
                                                            {
                                                                parent.student
                                                                    .section
                                                                    .name
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {parent.phone || "-"}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/parents/${parent.id}/edit`}
                                                            className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                deleteParent(
                                                                    parent.id,
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
                )}
            </div>
        </AuthenticatedLayout>
    );
}
