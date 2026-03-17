import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Profile({ teacher }) {
    const { props } = usePage();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const schoolName = props.schoolName || "School Management";
    const schoolLogo = props.schoolLogo || "";

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    const handlePasswordChange = () => {
        setPasswordError("");
        setPasswordSuccess("");
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError("New passwords do not match!");
            return;
        }
        if (passwordData.new_password.length < 6) {
            setPasswordError("Password must be at least 6 characters!");
            return;
        }
        setChangingPassword(true);
        router.post("/teacher/change-password", passwordData, {
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
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="My Profile" />

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
                <Link href="/teacher/results" className="hover:text-blue-200">
                    🏆 Results
                </Link>
                <Link
                    href="/teacher/profile"
                    className="hover:text-blue-200 font-medium"
                >
                    👤 Profile
                </Link>
            </nav>

            {/* Nav — Mobile */}
            <div className="bg-blue-700 text-white px-4 py-2 md:hidden flex justify-between items-center">
                <span className="text-sm font-medium">👤 Profile</span>
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
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 md:p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                            {teacher.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl md:text-2xl font-bold">
                                {teacher.name}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-1 text-blue-100 text-sm">
                                <span>📧 {teacher.email}</span>
                                {teacher.department && (
                                    <span>🏢 {teacher.department.name}</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            🔐 Change Password
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                            📋 Basic Information
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Phone", value: teacher.phone || "-" },
                                {
                                    label: "Gender",
                                    value: teacher.gender || "-",
                                },
                                {
                                    label: "Qualification",
                                    value: teacher.qualification || "-",
                                },
                                {
                                    label: "Joining Date",
                                    value:
                                        teacher.joining_date?.split("T")[0] ||
                                        "-",
                                },
                                {
                                    label: "Address",
                                    value: teacher.address || "-",
                                },
                                { label: "Status", value: teacher.status },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex justify-between items-center py-2 border-b last:border-0"
                                >
                                    <span className="text-sm text-gray-500">
                                        {item.label}
                                    </span>
                                    {item.label === "Status" ? (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {item.value}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-800 capitalize">
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                            🎓 Education
                        </h3>
                        {teacher.educations?.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">
                                No education records
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {teacher.educations?.map((edu, i) => (
                                    <div
                                        key={i}
                                        className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500"
                                    >
                                        <p className="font-bold text-blue-800">
                                            {edu.degree}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {edu.institution}
                                        </p>
                                        {edu.field_of_study && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                📖 {edu.field_of_study}
                                            </p>
                                        )}
                                        <div className="flex gap-3 mt-2">
                                            {edu.passing_year && (
                                                <span className="text-xs bg-white px-2 py-0.5 rounded border">
                                                    📅 {edu.passing_year}
                                                </span>
                                            )}
                                            {edu.grade && (
                                                <span className="text-xs bg-white px-2 py-0.5 rounded border">
                                                    ⭐ {edu.grade}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
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

                        {passwordSuccess && (
                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm mb-4">
                                {passwordSuccess}
                            </div>
                        )}
                        {passwordError && (
                            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
                                {passwordError}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
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
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
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
                                    Confirm Password
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
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handlePasswordChange}
                                disabled={changingPassword}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {changingPassword
                                    ? "Changing..."
                                    : "Change Password"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordError("");
                                    setPasswordSuccess("");
                                }}
                                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
