import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ enrollment }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [status, setStatus] = useState(enrollment.status);
    const [remarks, setRemarks] = useState(enrollment.remarks || "");
    const [saving, setSaving] = useState(false);

    const handleStatusUpdate = () => {
        setSaving(true);
        router.post(
            `/enrollments/${enrollment.id}/status`,
            { status, remarks },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        reviewing: "bg-blue-100 text-blue-700 border-blue-300",
        approved: "bg-green-100 text-green-700 border-green-300",
        rejected: "bg-red-100 text-red-700 border-red-300",
    };

    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b last:border-0">
            <span className="text-xs text-gray-500 font-medium w-40 shrink-0">
                {label}
            </span>
            <span className="text-sm text-gray-800 font-medium mt-0.5 sm:mt-0">
                {value || "-"}
            </span>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Enrollment — ${enrollment.student_name}`} />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/enrollments"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold">
                                {enrollment.student_name}
                            </h2>
                            <p className="text-teal-100 text-sm">
                                Applied for Class {enrollment.apply_for_class} •
                                {new Date(
                                    enrollment.created_at,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[enrollment.status]}`}
                    >
                        {enrollment.status.charAt(0).toUpperCase() +
                            enrollment.status.slice(1)}
                    </span>
                </div>

                {/* Flash */}
                {flash.success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left — Details */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Student Info */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-3">
                                🎓 Student Information
                            </h3>
                            <InfoRow
                                label="Full Name"
                                value={enrollment.student_name}
                            />
                            <InfoRow
                                label="Date of Birth"
                                value={
                                    enrollment.date_of_birth
                                        ? new Date(
                                              enrollment.date_of_birth,
                                          ).toLocaleDateString("en-IN", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "-"
                                }
                            />
                            <InfoRow
                                label="Gender"
                                value={
                                    enrollment.gender?.charAt(0).toUpperCase() +
                                    enrollment.gender?.slice(1)
                                }
                            />
                            <InfoRow
                                label="Religion"
                                value={enrollment.religion}
                            />
                            <InfoRow
                                label="Nationality"
                                value={enrollment.nationality}
                            />
                            <InfoRow
                                label="Apply For Class"
                                value={`Class ${enrollment.apply_for_class}`}
                            />
                            <InfoRow
                                label="Previous School"
                                value={enrollment.previous_school}
                            />
                            <InfoRow
                                label="Last Class Passed"
                                value={enrollment.last_class_passed}
                            />
                            <InfoRow
                                label="Aadhaar Card"
                                value={enrollment.aadhaar_card}
                            />
                        </div>

                        {/* Parent Info */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-3">
                                👨‍👩‍👧 Parent Information
                            </h3>
                            <InfoRow
                                label="Father Name"
                                value={enrollment.father_name}
                            />
                            <InfoRow
                                label="Father Occupation"
                                value={enrollment.father_occupation}
                            />
                            <InfoRow
                                label="Father Phone"
                                value={enrollment.father_phone}
                            />
                            <InfoRow
                                label="Mother Name"
                                value={enrollment.mother_name}
                            />
                            <InfoRow
                                label="Mother Phone"
                                value={enrollment.mother_phone}
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-3">
                                📍 Contact Information
                            </h3>
                            <InfoRow label="Email" value={enrollment.email} />
                            <InfoRow
                                label="Address"
                                value={enrollment.address}
                            />
                            <InfoRow label="City" value={enrollment.city} />
                        </div>
                    </div>

                    {/* Right — Status Update */}
                    <div className="space-y-5">
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-4">
                                🔄 Update Status
                            </h3>

                            <div className="space-y-3">
                                {[
                                    "pending",
                                    "reviewing",
                                    "approved",
                                    "rejected",
                                ].map((s) => (
                                    <label
                                        key={s}
                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${status === s ? statusColors[s] + " border-current" : "border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={s}
                                            checked={status === s}
                                            onChange={() => setStatus(s)}
                                            className="hidden"
                                        />
                                        <span className="text-lg">
                                            {s === "pending"
                                                ? "⏳"
                                                : s === "reviewing"
                                                  ? "🔍"
                                                  : s === "approved"
                                                    ? "✅"
                                                    : "❌"}
                                        </span>
                                        <span className="text-sm font-medium capitalize">
                                            {s}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows={3}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                    placeholder="Add remarks or notes..."
                                />
                            </div>

                            <button
                                onClick={handleStatusUpdate}
                                disabled={saving}
                                className="w-full mt-3 bg-teal-600 text-white py-2 rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50 font-medium"
                            >
                                {saving ? "Saving..." : "💾 Update Status"}
                            </button>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <h3 className="font-bold text-gray-800 mb-3">
                                📊 Quick Info
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Application ID
                                    </span>
                                    <span className="font-bold">
                                        #{enrollment.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Applied On
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            enrollment.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Last Updated
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            enrollment.updated_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
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
                                            "Are you sure? This will permanently delete this enrollment.",
                                        )
                                    ) {
                                        router.delete(
                                            `/enrollments/${enrollment.id}`,
                                            {
                                                onSuccess: () =>
                                                    router.visit(
                                                        "/enrollments",
                                                    ),
                                            },
                                        );
                                    }
                                }}
                                className="w-full bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                            >
                                🗑️ Delete Enrollment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
