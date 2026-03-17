import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ enrollments, filters, counts }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [cls, setCls] = useState(filters?.class || "");

    const applyFilter = () => {
        router.get(
            "/enrollments",
            { search, status, class: cls },
            { preserveState: true, replace: true },
        );
    };

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-700",
        reviewing: "bg-blue-100 text-blue-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    const statusIcons = {
        pending: "⏳",
        reviewing: "🔍",
        approved: "✅",
        rejected: "❌",
    };

    // Download Single Enrollment
    const downloadSingle = (item) => {
        const content = `
Students Information
Enrollment Application
========================

STUDENT INFORMATION
-------------------
Name: ${item.student_name}
Date of Birth: ${item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString("en-IN") : ""}
Gender: ${item.gender}
Religion: ${item.religion || ""}
Nationality: ${item.nationality || ""}
Apply For Class: ${item.apply_for_class}
Previous School: ${item.previous_school || ""}
Last Class Passed: ${item.last_class_passed || ""}
Aadhaar Card: ${item.aadhaar_card || ""}

PARENT INFORMATION
------------------
Father Name: ${item.father_name}
Father Occupation: ${item.father_occupation || ""}
Father Phone: ${item.father_phone}
Mother Name: ${item.mother_name || ""}
Mother Phone: ${item.mother_phone || ""}

CONTACT INFORMATION
-------------------
Email: ${item.email || ""}
Address: ${item.address || ""}
City: ${item.city || ""}

APPLICATION DETAILS
-------------------
Application ID: #${item.id}
Status: ${item.status.toUpperCase()}
Applied On: ${new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
Remarks: ${item.remarks || "None"}

========================
Generated on: ${new Date().toLocaleDateString("en-IN")}
        `.trim();

        const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `enrollment_${item.student_name.replace(/\s+/g, "_")}_#${item.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Download All CSV
    const downloadCSV = () => {
        const headers = [
            "#",
            "Student Name",
            "Gender",
            "DOB",
            "Apply For Class",
            "Father Name",
            "Father Phone",
            "Mother Name",
            "Mother Phone",
            "Email",
            "City",
            "Status",
            "Applied On",
        ];

        const rows = enrollments.data.map((item, i) => [
            (enrollments.current_page - 1) * enrollments.per_page + i + 1,
            item.student_name,
            item.gender,
            item.date_of_birth
                ? new Date(item.date_of_birth).toLocaleDateString("en-IN")
                : "",
            `Class ${item.apply_for_class}`,
            item.father_name,
            item.father_phone,
            item.mother_name,
            item.mother_phone,
            item.email,
            item.city,
            item.status,
            new Date(item.created_at).toLocaleDateString("en-IN"),
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((val) => `"${val || ""}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `enrollments_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Enrollments" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-5 mb-6 text-white flex justify-between items-center flex-wrap gap-3">
                    <div>
                        <h2 className="text-2xl font-bold">📋 Enrollments</h2>
                        <p className="text-teal-100 text-sm mt-1">
                            Manage student enrollment applications
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-teal-100">
                                Total Applications
                            </p>
                            <p className="text-3xl font-bold">{counts.total}</p>
                        </div>
                        <button
                            onClick={downloadCSV}
                            className="bg-white text-teal-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-50 transition flex items-center gap-2 shadow"
                        >
                            ⬇️ Download CSV
                        </button>
                    </div>
                </div>

                {/* Flash */}
                {flash.success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
                    {[
                        {
                            label: "Total",
                            count: counts.total,
                            color: "border-teal-500",
                            text: "text-teal-600",
                        },
                        {
                            label: "Pending",
                            count: counts.pending,
                            color: "border-yellow-500",
                            text: "text-yellow-600",
                        },
                        {
                            label: "Reviewing",
                            count: counts.reviewing,
                            color: "border-blue-500",
                            text: "text-blue-600",
                        },
                        {
                            label: "Approved",
                            count: counts.approved,
                            color: "border-green-500",
                            text: "text-green-600",
                        },
                        {
                            label: "Rejected",
                            count: counts.rejected,
                            color: "border-red-500",
                            text: "text-red-600",
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
                            placeholder="🔍 Search by name, email..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <input
                        type="text"
                        value={cls}
                        onChange={(e) => setCls(e.target.value)}
                        placeholder="Class (e.g. 5)"
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-32"
                    />
                    <button
                        onClick={applyFilter}
                        className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-700"
                    >
                        Filter
                    </button>
                    {(search || status || cls) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setCls("");
                                router.get("/enrollments");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {enrollments.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📋</p>
                            <p className="text-gray-400">
                                No enrollment applications found
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Apply For</th>
                                    <th className="p-4">Father</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.data.map((item, i) => (
                                    <tr
                                        key={item.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {(enrollments.current_page - 1) *
                                                enrollments.per_page +
                                                i +
                                                1}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {item.passport_photo ? (
                                                    <img
                                                        src={`/storage/${item.passport_photo}`}
                                                        alt=""
                                                        className="w-9 h-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
                                                        {item.student_name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800">
                                                        {item.student_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {item.gender} •{" "}
                                                        {new Date(
                                                            item.date_of_birth,
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                Class {item.apply_for_class}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {item.father_name}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {item.father_phone}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}
                                            >
                                                {statusIcons[item.status]}{" "}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {new Date(
                                                item.created_at,
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 flex-wrap">
                                                <Link
                                                    href={`/enrollments/${item.id}`}
                                                    className="bg-teal-500 text-white px-3 py-1 rounded text-xs hover:bg-teal-600"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        downloadSingle(item)
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                                >
                                                    ⬇️ Download
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "Delete this enrollment?",
                                                            )
                                                        )
                                                            router.delete(
                                                                `/enrollments/${item.id}`,
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
                    {enrollments.last_page > 1 && (
                        <div className="p-4 flex gap-2 justify-center border-t">
                            {Array.from(
                                { length: enrollments.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() =>
                                        router.get("/enrollments", {
                                            ...filters,
                                            page,
                                        })
                                    }
                                    className={`px-3 py-1 rounded text-sm ${page === enrollments.current_page ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
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
