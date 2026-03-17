import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ClassView({
    class: cls,
    students,
    totalCollected,
    totalPending,
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Class Fees" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-5 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/fees"
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                            >
                                ← Back
                            </Link>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold">
                                    {cls.name} — Fee Management
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {students.length} Students
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/fees/create?class_id=${cls.id}`}
                            className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium w-fit"
                        >
                            + Add Fee
                        </Link>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {students.length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500">Total Collected</p>
                        <p className="text-3xl font-bold text-green-600">
                            Rs. {totalCollected?.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
                        <p className="text-sm text-gray-500">Total Pending</p>
                        <p className="text-3xl font-bold text-red-500">
                            Rs. {totalPending?.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {students.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400">No students found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Section</th>
                                    <th className="p-4">Roll No</th>
                                    <th className="p-4">Total Fees</th>
                                    <th className="p-4">Paid</th>
                                    <th className="p-4">Remaining</th>
                                    <th className="p-4">Last Month</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, i) => (
                                    <tr
                                        key={s.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold">
                                                {s.name}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono">
                                                {s.student_id}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {s.section !== "-" ? (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                                    Sec {s.section}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4">{s.roll_number}</td>
                                        <td className="p-4 font-medium">
                                            Rs.{" "}
                                            {s.total_amount?.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-green-600 font-bold">
                                                Rs.{" "}
                                                {s.total_paid?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`font-bold ${s.total_remaining > 0 ? "text-red-500" : "text-green-600"}`}
                                            >
                                                Rs.{" "}
                                                {s.total_remaining?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {s.last_month}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    s.last_status === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : s.last_status ===
                                                            "partial"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {s.last_status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/fees/student-fees?student_id=${s.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/fees/create?class_id=${cls.id}&student_id=${s.id}`}
                                                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                                                >
                                                    + Fee
                                                </Link>
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
