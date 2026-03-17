import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ classes }) {
    const [search, setSearch] = useState("");

    const filtered = classes.filter((cls) =>
        cls.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AuthenticatedLayout>
            <Head title="Exams" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            📝 Exams
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Select a class to view exams
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔍 Search class..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">No classes found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Class Name</th>
                                    <th className="p-4">Grade</th>
                                    <th className="p-4">Sections</th>
                                    <th className="p-4">Total Exams</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((cls, i) => (
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
                                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                                                    Grade {cls.grade_level}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {cls.sections?.length > 0 ? (
                                                    cls.sections.map((s) => (
                                                        <span
                                                            key={s.id}
                                                            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                                                        >
                                                            Sec {s.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-xs">
                                                        No sections
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                                                {cls.exams_count || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/exams/class?class_id=${cls.id}`}
                                                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-blue-600 font-medium"
                                            >
                                                View Exams →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
