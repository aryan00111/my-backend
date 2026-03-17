import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ClassResults({ class: cls, exams }) {
    const statusColors = {
        scheduled: "bg-blue-100 text-blue-700",
        ongoing: "bg-yellow-100 text-yellow-700",
        completed: "bg-green-100 text-green-700",
    };

    return (
        <AuthenticatedLayout>
            <Head title="Class Results" />

            <div className="py-8 px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/results"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h3 className="text-xl font-bold">
                                {cls.name} — Results
                            </h3>
                            <p className="text-blue-100 text-sm">
                                {exams.length} Exams
                            </p>
                        </div>
                    </div>
                </div>

                {/* Exams Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {exams.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">Koi exam nahi hai</p>
                            <Link
                                href="/exams"
                                className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600"
                            >
                                Exams me jao
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Exam Name</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Results</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam, i) => (
                                    <tr
                                        key={exam.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {exam.name}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs capitalize">
                                                {exam.type?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {exam.start_date?.split("T")[0]} →{" "}
                                            {exam.end_date?.split("T")[0]}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[exam.status] || "bg-gray-100"}`}
                                            >
                                                {exam.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    exam.results_count > 0
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {exam.results_count > 0
                                                    ? `${exam.results_count} records`
                                                    : "No results"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/results/${exam.id}/entry`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    ✏️ Entry
                                                </Link>
                                                {exam.results_count > 0 && (
                                                    <>
                                                        <Link
                                                            href={`/results/${exam.id}/show`}
                                                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                                                        >
                                                            👁️ View
                                                        </Link>
                                                        <a
                                                            href={`/results/${exam.id}/pdf`}
                                                            target="_blank"
                                                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                                        >
                                                            📄 PDF
                                                        </a>
                                                    </>
                                                )}
                                            </div>
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
