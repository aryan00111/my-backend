import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Attendance({
    student,
    attendances,
    totalPresent,
    totalAbsent,
    totalLate,
    percentage,
    filters,
}) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";

    const [month, setMonth] = useState(
        filters?.month || new Date().getMonth() + 1,
    );
    const [year, setYear] = useState(filters?.year || new Date().getFullYear());

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    const applyFilter = () => {
        router.get(
            "/parent/attendance",
            { month, year },
            { preserveState: true },
        );
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError("Passwords do not match!");
            return;
        }
        if (passwordData.new_password.length < 6) {
            setPasswordError("Password must be at least 6 characters!");
            return;
        }

        setChangingPassword(true);
        router.post(
            "/parent/change-password",
            {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password,
            },
            {
                onSuccess: () => {
                    setPasswordSuccess("Password changed successfully!");
                    setPasswordData({
                        current_password: "",
                        new_password: "",
                        confirm_password: "",
                    });
                    setChangingPassword(false);
                },
                onError: (errors) => {
                    setPasswordError(
                        errors.current_password || "Something went wrong!",
                    );
                    setChangingPassword(false);
                },
            },
        );
    };

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    const years = [];
    for (let y = 2020; y <= 2040; y++) years.push(y);

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Attendance" />

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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                        🔐 Password
                    </button>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                        Logout
                    </Link>
                </div>
            </header>

            {/* Nav — Desktop */}
            <nav className="bg-green-700 text-white px-4 md:px-6 py-2 hidden md:flex gap-6 text-sm">
                <Link href="/parent/dashboard" className="hover:text-green-200">
                    📊 Dashboard
                </Link>
                <Link
                    href="/parent/attendance"
                    className="hover:text-green-200 font-medium"
                >
                    📋 Attendance
                </Link>
                <Link href="/parent/fees" className="hover:text-green-200">
                    💰 Fees
                </Link>
                <Link href="/parent/results" className="hover:text-green-200">
                    🏆 Results
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-green-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">📋 Attendance</span>
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

                {/* Month/Year Filter */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Month
                        </label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Year
                        </label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={applyFilter}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                        🔍 View
                    </button>
                    <button
                        onClick={() => router.get("/parent/attendance")}
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                    >
                        All Records
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-green-500">
                        <p className="text-xs text-gray-500">Present</p>
                        <h2 className="text-3xl font-bold text-green-600">
                            {totalPresent}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-red-500">
                        <p className="text-xs text-gray-500">Absent</p>
                        <h2 className="text-3xl font-bold text-red-500">
                            {totalAbsent}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-yellow-500">
                        <p className="text-xs text-gray-500">Late</p>
                        <h2 className="text-3xl font-bold text-yellow-500">
                            {totalLate}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center border-l-4 border-blue-500">
                        <p className="text-xs text-gray-500">Percentage</p>
                        <h2
                            className={`text-3xl font-bold ${percentage >= 75 ? "text-green-600" : percentage >= 50 ? "text-yellow-500" : "text-red-500"}`}
                        >
                            {percentage}%
                        </h2>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Attendance Progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${percentage >= 75 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                    <h3 className="font-semibold text-gray-800 mb-4">
                        Attendance History
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="p-3">#</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center p-6 text-gray-400"
                                    >
                                        No attendance records found
                                    </td>
                                </tr>
                            ) : (
                                attendances.map((att, i) => (
                                    <tr
                                        key={att.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-3">{i + 1}</td>
                                        <td className="p-3">{att.date}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    att.status === "present"
                                                        ? "bg-green-100 text-green-700"
                                                        : att.status === "late"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {att.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {att.remarks || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">
                                🔐 Change Password
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordError("");
                                    setPasswordSuccess("");
                                }}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <form
                            onSubmit={handlePasswordChange}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password *
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e) =>
                                        setPasswordData((p) => ({
                                            ...p,
                                            current_password: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) =>
                                        setPasswordData((p) => ({
                                            ...p,
                                            new_password: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Min 6 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={(e) =>
                                        setPasswordData((p) => ({
                                            ...p,
                                            confirm_password: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Repeat new password"
                                />
                            </div>
                            {passwordError && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                    ❌ {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
                                    ✅ {passwordSuccess}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {changingPassword
                                        ? "Changing..."
                                        : "Change Password"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
