import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Fees({
    student,
    fees,
    totalFees,
    paidFees,
    pendingFees,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Fees" />

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
                        <p className="text-xs text-gray-500">Parent Portal</p>
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
            <nav className="bg-green-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link href="/parent/dashboard" className="hover:text-green-200">
                    📊 Dashboard
                </Link>
                <Link
                    href="/parent/attendance"
                    className="hover:text-green-200"
                >
                    📋 Attendance
                </Link>
                <Link
                    href="/parent/fees"
                    className="hover:text-green-200 font-medium"
                >
                    💰 Fees
                </Link>
                <Link href="/parent/results" className="hover:text-green-200">
                    🏆 Results
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-green-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">💰 Fees</span>
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="text-white text-xl"
                >
                    ☰
                </button>
            </div>
            {mobileNavOpen && (
                <div className="bg-green-800 text-white md:hidden flex flex-col text-sm">
                    <Link
                        href="/parent/dashboard"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700 border-b border-green-700"
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        href="/parent/attendance"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700 border-b border-green-700"
                    >
                        📋 Attendance
                    </Link>
                    <Link
                        href="/parent/fees"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700 border-b border-green-700"
                    >
                        💰 Fees
                    </Link>
                    <Link
                        href="/parent/results"
                        onClick={() => setMobileNavOpen(false)}
                        className="px-4 py-3 hover:bg-green-700"
                    >
                        🏆 Results
                    </Link>
                </div>
            )}

            <div className="px-4 md:px-6 py-6 md:py-8">
                {/* Student Info */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        🎓
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800">
                            {student.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {student.school_class?.name} | Roll:{" "}
                            {student.roll_number}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-5 text-center border-l-4 border-blue-500">
                        <p className="text-xs text-gray-500">Total Fees</p>
                        <h2 className="text-2xl font-bold text-gray-800 mt-1">
                            Rs. {totalFees.toLocaleString()}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 text-center border-l-4 border-green-500">
                        <p className="text-xs text-gray-500">Paid</p>
                        <h2 className="text-2xl font-bold text-green-600 mt-1">
                            Rs. {paidFees.toLocaleString()}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 text-center border-l-4 border-red-500">
                        <p className="text-xs text-gray-500">Pending</p>
                        <h2 className="text-2xl font-bold text-red-500 mt-1">
                            Rs. {pendingFees.toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Fees Table */}
                <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        Fee History
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="p-3">#</th>
                                <th className="p-3">Fee Type</th>
                                <th className="p-3">Month</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Paid</th>
                                <th className="p-3">Remaining</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center p-6 text-gray-400"
                                    >
                                        No fee records found
                                    </td>
                                </tr>
                            ) : (
                                fees.map((fee, i) => (
                                    <tr
                                        key={fee.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-3">{i + 1}</td>
                                        <td className="p-3 font-medium">
                                            {fee.fee_type}
                                        </td>
                                        <td className="p-3">{fee.month}</td>
                                        <td className="p-3">
                                            Rs. {fee.amount}
                                        </td>
                                        <td className="p-3 text-green-600 font-medium">
                                            Rs. {fee.paid_amount}
                                        </td>
                                        <td className="p-3 text-red-500">
                                            Rs. {fee.remaining}
                                        </td>
                                        <td className="p-3">{fee.due_date}</td>
                                        <td className="p-3">
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
