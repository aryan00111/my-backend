import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ messages, filters, counts }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");

    const applyFilter = () => {
        router.get(
            "/contact",
            { search, status },
            { preserveState: true, replace: true },
        );
    };

    const statusColors = {
        unread: "bg-red-100 text-red-700",
        read: "bg-blue-100 text-blue-700",
        replied: "bg-green-100 text-green-700",
    };

    const statusIcons = {
        unread: "🔴",
        read: "👁️",
        replied: "✅",
    };

    return (
        <AuthenticatedLayout>
            <Head title="Contact Messages" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">
                            ✉️ Contact Messages
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">
                            Manage contact form submissions
                        </p>
                    </div>
                    <div className="text-right">
                        {counts.unread > 0 && (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                🔴 {counts.unread} Unread
                            </div>
                        )}
                    </div>
                </div>

                {/* Flash */}
                {flash.success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                    {[
                        {
                            label: "Total",
                            count: counts.total,
                            color: "border-indigo-500",
                            text: "text-indigo-600",
                        },
                        {
                            label: "Unread",
                            count: counts.unread,
                            color: "border-red-500",
                            text: "text-red-600",
                        },
                        {
                            label: "Read",
                            count: counts.read,
                            color: "border-blue-500",
                            text: "text-blue-600",
                        },
                        {
                            label: "Replied",
                            count: counts.replied,
                            color: "border-green-500",
                            text: "text-green-600",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`bg-white rounded-xl shadow p-4 text-center border-l-4 ${s.color}`}
                        >
                            <p className={`text-3xl font-bold ${s.text}`}>
                                {s.count}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-40">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && applyFilter()
                            }
                            placeholder="🔍 Search by name, email, subject..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                    <button
                        onClick={applyFilter}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700"
                    >
                        Filter
                    </button>
                    {(search || status) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                router.get("/contact");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {messages.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">✉️</p>
                            <p className="text-gray-400">No messages found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">From</th>
                                    <th className="p-4">Subject</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.data.map((msg, i) => (
                                    <tr
                                        key={msg.id}
                                        className={`border-t hover:bg-gray-50 ${msg.status === "unread" ? "bg-red-50" : ""}`}
                                    >
                                        <td className="p-4 text-gray-400">
                                            {(messages.current_page - 1) *
                                                messages.per_page +
                                                i +
                                                1}
                                        </td>
                                        <td className="p-4">
                                            <p
                                                className={`font-bold ${msg.status === "unread" ? "text-gray-900" : "text-gray-700"}`}
                                            >
                                                {msg.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {msg.email}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <p
                                                className={`${msg.status === "unread" ? "font-semibold text-gray-800" : "text-gray-600"} max-w-xs truncate`}
                                            >
                                                {msg.subject}
                                            </p>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {msg.phone || "-"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[msg.status]}`}
                                            >
                                                {statusIcons[msg.status]}{" "}
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {new Date(
                                                msg.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/contact/${msg.id}`}
                                                    className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "Delete this message?",
                                                            )
                                                        )
                                                            router.delete(
                                                                `/contact/${msg.id}`,
                                                            );
                                                    }}
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

                    {/* Pagination */}
                    {messages.last_page > 1 && (
                        <div className="p-4 flex gap-2 justify-center border-t">
                            {Array.from(
                                { length: messages.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() =>
                                        router.get("/contact", {
                                            ...filters,
                                            page,
                                        })
                                    }
                                    className={`px-3 py-1 rounded text-sm ${page === messages.current_page ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
