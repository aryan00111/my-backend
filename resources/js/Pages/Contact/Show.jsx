import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ contact }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [reply, setReply] = useState(contact.reply || "");
    const [saving, setSaving] = useState(false);

    const handleReply = () => {
        setSaving(true);
        router.post(
            `/contact/${contact.id}/reply`,
            { reply },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const statusColors = {
        unread: "bg-red-100 text-red-700",
        read: "bg-blue-100 text-blue-700",
        replied: "bg-green-100 text-green-700",
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Message — ${contact.name}`} />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/contact"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold">
                                {contact.name}
                            </h2>
                            <p className="text-indigo-100 text-sm">
                                {contact.email} •{" "}
                                {new Date(
                                    contact.created_at,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[contact.status]}`}
                    >
                        {contact.status.charAt(0).toUpperCase() +
                            contact.status.slice(1)}
                    </span>
                </div>

                {/* Flash */}
                {flash.success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left — Message */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Message */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-1">
                                📩 Message
                            </h3>
                            <p className="text-sm text-indigo-600 font-medium mb-3">
                                Subject: {contact.subject}
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {contact.message}
                            </div>
                        </div>

                        {/* Reply Box */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-3">
                                💬{" "}
                                {contact.status === "replied"
                                    ? "Edit Reply"
                                    : "Write Reply"}
                            </h3>

                            {contact.status === "replied" &&
                                contact.replied_at && (
                                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs mb-3">
                                        ✅ Replied on{" "}
                                        {new Date(
                                            contact.replied_at,
                                        ).toLocaleDateString()}
                                    </div>
                                )}

                            <textarea
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                rows={6}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                placeholder="Write your reply here..."
                            />

                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleReply}
                                    disabled={saving || !reply}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 font-medium"
                                >
                                    {saving ? "Saving..." : "💾 Save Reply"}
                                </button>
                                <p className="text-xs text-gray-400 self-center">
                                    Note: Reply is saved internally — email
                                    sending not included
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Sender Info */}
                    <div className="space-y-5">
                        {/* Sender Info */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-4">
                                👤 Sender Info
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">
                                            {contact.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Sender
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-xs w-16">
                                            Email
                                        </span>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-indigo-600 hover:underline text-xs truncate"
                                        >
                                            {contact.email}
                                        </a>
                                    </div>
                                    {contact.phone && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs w-16">
                                                Phone
                                            </span>
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="text-indigo-600 hover:underline text-xs"
                                            >
                                                {contact.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-3">
                                📊 Info
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Message ID
                                    </span>
                                    <span className="font-bold">
                                        #{contact.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Received
                                    </span>
                                    <span className="font-medium text-xs">
                                        {new Date(
                                            contact.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Status
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contact.status]}`}
                                    >
                                        {contact.status}
                                    </span>
                                </div>
                                {contact.replied_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Replied
                                        </span>
                                        <span className="font-medium text-xs">
                                            {new Date(
                                                contact.replied_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delete */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-red-600 mb-3">
                                ⚠️ Danger Zone
                            </h3>
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Delete this message permanently?",
                                        )
                                    ) {
                                        router.delete(
                                            `/contact/${contact.id}`,
                                            {
                                                onSuccess: () =>
                                                    router.visit("/contact"),
                                            },
                                        );
                                    }
                                }}
                                className="w-full bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                            >
                                🗑️ Delete Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
