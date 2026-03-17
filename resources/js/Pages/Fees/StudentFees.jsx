import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function StudentFees({
    student,
    fees,
    totalAmount,
    totalPaid,
    totalRemaining,
}) {
    const deleteFee = (id) => {
        if (confirm(" Are You deleted Fee record ?")) {
            router.delete(`/fees/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Fees" />

            <div className="py-8 px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            💰 Student Fee Detail
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {student.name} — {student.student_id}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/fees/create?class_id=${student.class_id}&student_id=${student.id}`}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                        >
                            + Add Fee
                        </Link>
                        <Link
                            href={`/fees/class-view?class_id=${student.class_id}`}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Student Info */}
                <div className="bg-white rounded-xl shadow p-5 mb-6">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Name</p>
                            <p className="font-bold">{student.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Student ID</p>
                            <p className="font-bold font-mono text-blue-600">
                                {student.student_id}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Class</p>
                            <p className="font-bold">
                                {student.school_class?.name || "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Section</p>
                            <p className="font-bold">
                                {student.section?.name || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-3xl font-bold text-blue-600">
                            Rs. {totalAmount?.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500">Total Paid</p>
                        <p className="text-3xl font-bold text-green-600">
                            Rs. {totalPaid?.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="text-3xl font-bold text-red-500">
                            Rs. {totalRemaining?.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Fees Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {fees.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-400 mb-4">
                                Koi fee record nahi hai
                            </p>
                            <Link
                                href={`/fees/create?class_id=${student.class_id}&student_id=${student.id}`}
                                className="bg-green-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-600"
                            >
                                + Add Fee
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Month</th>
                                    <th className="p-4">Fee Type</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Paid</th>
                                    <th className="p-4">Remaining</th>
                                    <th className="p-4">Due Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.map((fee, i) => (
                                    <tr
                                        key={fee.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-500">
                                            {i + 1}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {fee.month}
                                        </td>
                                        <td className="p-4">{fee.fee_type}</td>
                                        <td className="p-4">
                                            Rs. {fee.amount?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-green-600 font-bold">
                                            Rs.{" "}
                                            {fee.paid_amount?.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`font-bold ${fee.remaining > 0 ? "text-red-500" : "text-green-600"}`}
                                            >
                                                Rs.{" "}
                                                {fee.remaining?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {fee.due_date}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    fee.status === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : fee.status ===
                                                            "partial"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/fees/${fee.id}/edit`}
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </Link>
                                                <a
                                                    href={`/fees/receipt/${fee.id}`}
                                                    target="_blank"
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    Receipt
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        deleteFee(fee.id)
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
        </AuthenticatedLayout>
    );
}
