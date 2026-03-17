import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ student }) {
    return (
        <AuthenticatedLayout>
            <Head title={student.name} />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/students"
                                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                            >
                                ← Back
                            </Link>
                            <div>
                                <h3 className="text-xl font-bold">
                                    {student.name}
                                </h3>
                                <p className="text-blue-100 text-sm font-mono">
                                    {student.student_id}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/students/${student.id}/edit`}
                            className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium w-fit"
                        >
                            ✏️ Edit
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                            👤 Personal Information
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Full Name</span>
                                <span className="font-medium">
                                    {student.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Father Name
                                </span>
                                <span className="font-medium">
                                    {student.father_name || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Gender</span>
                                <span className="font-medium capitalize">
                                    {student.gender || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Date of Birth
                                </span>
                                <span className="font-medium">
                                    {student.date_of_birth || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium">
                                    {student.phone || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Address</span>
                                <span className="font-medium text-right max-w-48">
                                    {student.address || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                >
                                    {student.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h4 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                            🎓 Academic Information
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Student ID
                                </span>
                                <span className="font-mono text-blue-600 font-bold">
                                    {student.student_id}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Class</span>
                                <span className="font-medium">
                                    {student.school_class?.name || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Section</span>
                                <span className="font-medium">
                                    {student.section
                                        ? `Section ${student.section.name}`
                                        : "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Roll Number
                                </span>
                                <span className="font-medium">
                                    {student.roll_number || "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-5 mt-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                        ⚡ Quick Actions
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/fees/student-fees?student_id=${student.id}`}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600"
                        >
                            💰 View Fees
                        </Link>
                        <Link
                            href={`/attendance/student-report?student_id=${student.id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                        >
                            📋 Attendance Report
                        </Link>
                        <Link
                            href={`/fees/create?student_id=${student.id}`}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600"
                        >
                            ➕ Add Fee
                        </Link>
                        <Link
                            href={`/students/${student.id}/edit`}
                            className="bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500"
                        >
                            ✏️ Edit Student
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
