import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Students({ teacher, students, classes, filters }) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";
    const [search, setSearch] = useState(filters?.search || "");
    const [classId, setClassId] = useState(filters?.class_id || "");

    const applyFilter = (newSearch, newClassId) => {
        router.get(
            "/teacher/students",
            { search: newSearch, class_id: newClassId },
            { preserveState: true, replace: true },
        );
    };

    const isPaginated = students.last_page > 1;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Students" />

            {/* Header */}
            <header className="bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {schoolLogo ? (
                        <img
                            src={`/storage/${schoolLogo}`}
                            alt="Logo"
                            className="w-9 h-9 object-contain rounded"
                        />
                    ) : (
                        <span className="text-2xl">🏫</span>
                    )}
                    <div>
                        <h1 className="text-base md:text-lg font-bold text-gray-800">
                            {schoolName}
                        </h1>
                        <p className="text-xs text-gray-500">Teacher Portal</p>
                    </div>
                </div>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                    Logout
                </Link>
            </header>

            {/* Nav — Desktop */}
            <nav className="bg-blue-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link href="/teacher/dashboard" className="hover:text-blue-200">
                    📊 Dashboard
                </Link>
                <Link
                    href="/teacher/students"
                    className="hover:text-blue-200 font-medium"
                >
                    🎓 Students
                </Link>
                <Link
                    href="/teacher/attendance"
                    className="hover:text-blue-200"
                >
                    📋 Attendance
                </Link>
                <Link href="/teacher/results" className="hover:text-blue-200">
                    🏆 Results
                </Link>
                <Link href="/teacher/profile" className="hover:text-blue-200">
                    👤 Profile
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-blue-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">🎓 Students</span>
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="text-white text-xl"
                >
                    ☰
                </button>
            </div>
            {mobileNavOpen && (
                <div className="bg-blue-800 text-white md:hidden flex flex-col text-sm">
                    <Link
                        href="/teacher/dashboard"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        href="/teacher/students"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        🎓 Students
                    </Link>
                    <Link
                        href="/teacher/attendance"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        📋 Attendance
                    </Link>
                    <Link
                        href="/teacher/results"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700 border-b border-blue-700"
                    >
                        🏆 Results
                    </Link>
                    <Link
                        href="/teacher/profile"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-blue-700"
                    >
                        👤 Profile
                    </Link>
                </div>
            )}

            <div className="px-4 md:px-6 py-6 md:py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        🎓 Students
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {students.total} total students
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3">
                    <div className="flex-1 min-w-48">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                applyFilter(e.target.value, classId);
                            }}
                            placeholder="🔍 Search student..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value);
                            applyFilter(search, e.target.value);
                        }}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Classes</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                    {(search || classId) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setClassId("");
                                router.get("/teacher/students");
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
                                    <th className="p-4">Gender</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.map((student, i) => (
                                    <tr
                                        key={student.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {isPaginated
                                                ? students.from + i
                                                : i + 1}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-gray-600">
                                            {student.student_id}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {student.name}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                                                {student.school_class?.name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {student.section ? (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                                    {student.section.name}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {student.roll_number || "-"}
                                        </td>
                                        <td className="p-4 capitalize">
                                            {student.gender}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {isPaginated && (
                        <div className="flex flex-wrap justify-between items-center p-4 border-t bg-gray-50 gap-3">
                            <p className="text-sm text-gray-500">
                                Showing {students.from}–{students.to} of{" "}
                                {students.total} students
                            </p>
                            <div className="flex gap-1 flex-wrap">
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
        </div>
    );
}
