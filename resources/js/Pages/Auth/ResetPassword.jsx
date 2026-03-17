import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 flex items-center justify-center px-4 py-10">
            <Head title="Reset Password" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center text-4xl">
                        🏫
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        <span className="text-pink-500">Sanskar</span>{" "}
                        <span className="text-blue-500">Public</span>{" "}
                        <span className="text-red-500">School</span>
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Set New Password
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                                🔐
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Reset Password
                                </h2>
                                <p className="text-white/80 text-sm">
                                    Create a new secure password
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {/* Info */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
                            <p className="text-indigo-700 text-sm">
                                🔒 Choose a strong password with at least 8
                                characters.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email (readonly) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        ✉️
                                    </span>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        autoComplete="username"
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm bg-gray-50"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        ❌ {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        🔒
                                    </span>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                        autoFocus
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                        className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        ❌ {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        🔒
                                    </span>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="Confirm your new password"
                                        className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirm(!showConfirm)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirm ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">
                                        ❌ {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Password Match Indicator */}
                            {data.password && data.password_confirmation && (
                                <div
                                    className={`text-xs font-medium px-3 py-2 rounded-lg ${
                                        data.password ===
                                        data.password_confirmation
                                            ? "bg-green-50 text-green-600"
                                            : "bg-red-50 text-red-500"
                                    }`}
                                >
                                    {data.password ===
                                    data.password_confirmation
                                        ? "✅ Passwords match!"
                                        : "❌ Passwords do not match"}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>⏳ Resetting...</>
                                ) : (
                                    <>🔐 Reset Password</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Help */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-400">
                        Need help?{" "}
                        <a
                            href="mailto:info@sanskarschool.com"
                            className="text-blue-400 hover:underline"
                        >
                            info@sanskarschool.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
