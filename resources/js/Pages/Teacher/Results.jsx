import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Results({ teacher, exams, classes, filters }) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";
    const [classId, setClassId] = useState(filters?.class_id || "");

    const isPaginated = exams.last_page > 1;

    const applyFilter = (cId) => {
        router.get(
            "/teacher/results",
            { class_id: cId },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Results" />

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
                <Link href="/teacher/students" className="hover:text-blue-200">
                    🎓 Students
                </Link>
                <Link
                    href="/teacher/attendance"
                    className="hover:text-blue-200"
                >
                    📋 Attendance
                </Link>
                <Link
                    href="/teacher/results"
                    className="hover:text-blue-200 font-medium"
                >
                    🏆 Results
                </Link>
                <Link href="/teacher/profile" className="hover:text-blue-200">
                    👤 Profile
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-blue-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">🏆 Results</span>
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
                        🏆 Results
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage exam results
                    </p>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3">
                    <select
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value);
                            applyFilter(e.target.value);
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
                    {classId && (
                        <button
                            onClick={() => {
                                setClassId("");
                                router.get("/teacher/results");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Exams Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {exams.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">No exams found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Exam Name</th>
                                    <th className="p-4">Class</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Published</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.data.map((exam, i) => (
                                    <tr
                                        key={exam.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {isPaginated
                                                ? exams.from + i
                                                : i + 1}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {exam.name}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                                                {exam.school_class?.name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs capitalize">
                                                {exam.type?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {exam.start_date?.split("T")[0]}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    exam.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : exam.status ===
                                                            "ongoing"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {exam.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    exam.is_published
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {exam.is_published
                                                    ? "✅ Published"
                                                    : "⬜ Draft"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/teacher/results/${exam.id}/show`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    👁️ View
                                                </Link>
                                                <Link
                                                    href={`/teacher/results/${exam.id}/entry`}
                                                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                                                >
                                                    ✏️ Entry
                                                </Link>
                                            </div>
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
                                Showing {exams.from}–{exams.to} of {exams.total}{" "}
                                exams
                            </p>
                            <div className="flex gap-1 flex-wrap">
                                {exams.links.map((link, i) => (
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
