import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 flex items-center justify-center px-4 py-10">
            <Head title="Forgot Password" />

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
                    <p className="text-gray-500 mt-1 text-sm">Password Reset</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                                🔑
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Forgot Password?
                                </h2>
                                <p className="text-white/80 text-sm">
                                    We'll send you a reset link
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-blue-700 text-sm leading-relaxed">
                                📧 Enter your registered email address and we
                                will send you a password reset link.
                            </p>
                        </div>

                        {/* Success Status */}
                        {status && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-5 flex items-center gap-2">
                                ✅ {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
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
                                        required
                                        autoFocus
                                        placeholder="Enter your registered email"
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-sm"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        ❌ {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>⏳ Sending...</>
                                ) : (
                                    <>📧 Send Reset Link</>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-gray-100"></div>
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        {/* Back to Login */}
                        <Link
                            href={route("login")}
                            className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-500 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
                        >
                            ← Back to Login
                        </Link>
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
