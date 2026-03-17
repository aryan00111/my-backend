import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const roles = [
        {
            key: "admin",
            label: "Admin",
            icon: "👨‍💼",
            color: "from-blue-500 to-blue-700",
            light: "bg-blue-50",
            border: "border-blue-400",
            text: "text-blue-600",
            desc: "School Administration",
        },
        {
            key: "teacher",
            label: "Teacher",
            icon: "👨‍🏫",
            color: "from-green-500 to-green-700",
            light: "bg-green-50",
            border: "border-green-400",
            text: "text-green-600",
            desc: "Classes & Attendance",
        },
        {
            key: "parent",
            label: "Parent",
            icon: "👨‍👩‍👧",
            color: "from-pink-500 to-pink-700",
            light: "bg-pink-50",
            border: "border-pink-400",
            text: "text-pink-600",
            desc: "Child Progress",
        },
    ];

    const [activeRole, setActiveRole] = React.useState("admin");
    const [showPassword, setShowPassword] = React.useState(false);
    const current = roles.find((r) => r.key === activeRole);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 flex items-center justify-center px-4 py-10">
            <Head title="Login" />

            <div className="w-full max-w-lg">
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
                        Sign in to your account
                    </p>
                </div>

                {/* Role Tabs */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {roles.map((r) => (
                        <button
                            key={r.key}
                            type="button"
                            onClick={() => setActiveRole(r.key)}
                            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-300 ${
                                activeRole === r.key
                                    ? `${r.border} ${r.light} scale-105 shadow-md`
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                            <span className="text-3xl">{r.icon}</span>
                            <span
                                className={`text-sm font-bold ${activeRole === r.key ? r.text : "text-gray-500"}`}
                            >
                                {r.label}
                            </span>
                            <span
                                className={`text-xs text-center leading-tight ${activeRole === r.key ? r.text : "text-gray-400"}`}
                            >
                                {r.desc}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Card Header */}
                    <div
                        className={`bg-gradient-to-r ${current.color} p-6 text-white`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                                {current.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {current.label} Login
                                </h2>
                                <p className="text-white/80 text-sm">
                                    {current.desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {/* Status */}
                        {status && (
                            <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">
                                ✅ {status}
                            </div>
                        )}

                        {/* Global Error */}
                        {errors.email && (
                            <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                                ❌ {errors.email}
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
                                        autoComplete="username"
                                        autoFocus
                                        placeholder="Enter your email"
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
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
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-sm"
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
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    Remember me
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className={`text-sm font-medium ${current.text} hover:underline`}
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full bg-gradient-to-r ${current.color} text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
                            >
                                {processing ? (
                                    <>⏳ Logging in...</>
                                ) : (
                                    <>
                                        {current.icon} Login as {current.label}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                        <p className="text-blue-600 font-bold text-xs">
                            👨‍💼 Admin
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Full access
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
                        <p className="text-green-600 font-bold text-xs">
                            👨‍🏫 Teacher
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Classes & results
                        </p>
                    </div>
                    <div className="bg-pink-50 rounded-2xl p-3 text-center border border-pink-100">
                        <p className="text-pink-600 font-bold text-xs">
                            👨‍👩‍👧 Parent
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Child progress
                        </p>
                    </div>
                </div>

                <div className="text-center mt-4">
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
