import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ settings }) {
    const [logoPreview, setLogoPreview] = useState(
        settings.school_logo ? `/storage/${settings.school_logo}` : null,
    );
    const [logoFile, setLogoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [data, setData] = useState({
        school_name: settings.school_name ?? "",
        school_tagline: settings.school_tagline ?? "",
        school_email: settings.school_email ?? "",
        school_phone: settings.school_phone ?? "",
        school_address: settings.school_address ?? "",
        academic_year: settings.academic_year ?? "2024-2025",
        working_days: settings.working_days ?? "6",
        school_city: settings.school_city ?? "",
        school_country: settings.school_country ?? "India",
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const handleChange = (key, value) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post("/settings", data, { onFinish: () => setSaving(false) });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const uploadLogo = () => {
        if (!logoFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("logo", logoFile);
        router.post("/settings/logo", formData, {
            forceFormData: true,
            onFinish: () => {
                setUploading(false);
                setLogoFile(null);
            },
        });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError("New password and confirm password do not match!");
            return;
        }
        if (passwordData.new_password.length < 6) {
            setPasswordError("Password must be at least 6 characters!");
            return;
        }

        setChangingPassword(true);
        router.post(
            "/settings/change-password",
            {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
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
                        errors.current_password ||
                            errors.new_password ||
                            "Something went wrong!",
                    );
                    setChangingPassword(false);
                },
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        ⚙️ System Settings
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage school settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Logo Card */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                🖼️ School Logo
                            </h3>
                            <div className="flex justify-center mb-4">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="School Logo"
                                        className="w-32 h-32 object-contain rounded-lg border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <span className="text-4xl">🏫</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3"
                            />
                            <button
                                type="button"
                                onClick={uploadLogo}
                                disabled={!logoFile || uploading}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "⬆️ Upload Logo"}
                            </button>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                JPG, PNG — Max 2MB
                            </p>
                        </div>

                        {/* Academic Info Card */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                📅 Academic Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Academic Year *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.academic_year}
                                        onChange={(e) =>
                                            handleChange(
                                                "academic_year",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="2024-2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Working Days (per week)
                                    </label>
                                    <select
                                        value={data.working_days}
                                        onChange={(e) =>
                                            handleChange(
                                                "working_days",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="5">5 Days</option>
                                        <option value="6">6 Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Change Password Card */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                🔐 Change Password
                            </h3>
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
                                                current_password:
                                                    e.target.value,
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
                                                confirm_password:
                                                    e.target.value,
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
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="w-full bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50 font-medium"
                                >
                                    {changingPassword
                                        ? "Changing..."
                                        : "🔐 Change Password"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit}>
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    🏫 School Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            School Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.school_name}
                                            onChange={(e) =>
                                                handleChange(
                                                    "school_name",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="School name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tagline / Motto
                                        </label>
                                        <input
                                            type="text"
                                            value={data.school_tagline}
                                            onChange={(e) =>
                                                handleChange(
                                                    "school_tagline",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Education is the key"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.school_email}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "school_email",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="school@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                value={data.school_phone}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "school_phone",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={data.school_city}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "school_city",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                value={data.school_country}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "school_country",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            value={data.school_address}
                                            onChange={(e) =>
                                                handleChange(
                                                    "school_address",
                                                    e.target.value,
                                                )
                                            }
                                            rows="3"
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="School full address"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "💾 Save All Settings"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
