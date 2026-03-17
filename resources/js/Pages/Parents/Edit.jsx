import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({ parent, students }) {
    const { data, setData, put, processing, errors } = useForm({
        name: parent.user?.name || "",
        relation: parent.relation || "father",
        phone: parent.phone || "",
        cnic: parent.cnic || "",
        occupation: parent.occupation || "",
        address: parent.address || "",
    });

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginData, setLoginData] = useState({
        email: parent.user?.email || "",
        password: "",
        password_confirmation: "",
    });
    const [loginSaving, setLoginSaving] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState("");

    const submit = (e) => {
        e.preventDefault();
        put(`/parents/${parent.id}`);
    };

    const handleLoginChange = () => {
        setLoginError("");
        setLoginSuccess("");

        if (!loginData.email) {
            setLoginError("Email is required.");
            return;
        }
        if (loginData.password && loginData.password.length < 6) {
            setLoginError("Password must be at least 6 characters.");
            return;
        }
        if (loginData.password !== loginData.password_confirmation) {
            setLoginError("Passwords do not match.");
            return;
        }

        setLoginSaving(true);
        router.post(`/parents/${parent.id}/change-password`, loginData, {
            onSuccess: () => {
                setLoginSaving(false);
                setLoginSuccess("Login credentials updated successfully!");
                setLoginData((p) => ({
                    ...p,
                    password: "",
                    password_confirmation: "",
                }));
            },
            onError: (err) => {
                setLoginSaving(false);
                setLoginError(
                    err.email || err.password || "Something went wrong.",
                );
            },
        });
    };

    const closeModal = () => {
        setShowLoginModal(false);
        setLoginError("");
        setLoginSuccess("");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Parent" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Edit Parent
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Student: {parent.student?.name} (
                                {parent.student?.student_id})
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
                            >
                                🔑 Change Login
                            </button>
                            <Link
                                href="/parents"
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                ← Back
                            </Link>
                        </div>
                    </div>

                    {/* Login Info */}
                    {parent.user && (
                        <div className="bg-yellow-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-yellow-800">
                                    🔐 Login Account
                                </p>
                                <p className="text-xs text-yellow-700 mt-0.5">
                                    Email: {parent.user.email}
                                </p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                ✅ Active
                            </span>
                        </div>
                    )}

                    {/* Student Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <p className="text-sm font-semibold text-blue-800 mb-1">
                            🎓 Student Info
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-blue-700">
                            <span>Name: {parent.student?.name}</span>
                            <span>ID: {parent.student?.student_id}</span>
                            <span>
                                Class: {parent.student?.school_class?.name}
                            </span>
                            {parent.student?.section && (
                                <span>
                                    Section: {parent.student.section.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Name + Relation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Parent Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Relation *
                                </label>
                                <select
                                    value={data.relation}
                                    onChange={(e) =>
                                        setData("relation", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="father">Father</option>
                                    <option value="mother">Mother</option>
                                    <option value="guardian">Guardian</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone + CNIC */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CNIC
                                </label>
                                <input
                                    type="text"
                                    value={data.cnic}
                                    onChange={(e) =>
                                        setData("cnic", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Occupation + Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Occupation
                                </label>
                                <input
                                    type="text"
                                    value={data.occupation}
                                    onChange={(e) =>
                                        setData("occupation", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? "Updating..." : "Update Parent"}
                            </button>
                            <Link
                                href="/parents"
                                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Change Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                🔑 Change Login Credentials
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-3">
                                ❌ {loginError}
                            </div>
                        )}
                        {loginSuccess && (
                            <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm mb-3">
                                ✅ {loginSuccess}
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Login Email (ID) *
                                </label>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData((p) => ({
                                            ...p,
                                            email: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Email address"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password{" "}
                                    <span className="text-gray-400 font-normal">
                                        (leave blank to keep current)
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData((p) => ({
                                            ...p,
                                            password: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Min 6 characters"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={loginData.password_confirmation}
                                    onChange={(e) =>
                                        setLoginData((p) => ({
                                            ...p,
                                            password_confirmation:
                                                e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Repeat password"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleLoginChange}
                                disabled={loginSaving}
                                className="bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-yellow-600 disabled:opacity-50 font-medium"
                            >
                                {loginSaving ? "Saving..." : "💾 Save Changes"}
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
