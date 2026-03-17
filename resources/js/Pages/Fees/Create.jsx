import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create({
    students,
    classes,
    feeTypes,
    selected_class,
    selected_student,
}) {
    const [selectedClassId, setSelectedClassId] = useState(
        selected_class || "",
    );
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const [filteredStudents, setFilteredStudents] = useState(
        selected_class
            ? students.filter((s) => s.class_id == selected_class)
            : [],
    );
    const [availableSections, setAvailableSections] = useState(
        selected_class
            ? classes.find((c) => c.id == selected_class)?.sections || []
            : [],
    );

    const { data, setData, post, processing, errors } = useForm({
        student_id: selected_student || "",
        fee_type: "",
        amount: "",
        paid_amount: "",
        due_date: "",
        month: "",
        remarks: "",
    });

    const handleClassChange = (classId) => {
        setSelectedClassId(classId);
        setSelectedSectionId("");
        setData("student_id", "");
        if (classId) {
            const cls = classes.find((c) => c.id == classId);
            setAvailableSections(cls?.sections || []);
            setFilteredStudents(students.filter((s) => s.class_id == classId));
        } else {
            setAvailableSections([]);
            setFilteredStudents([]);
        }
    };

    const handleSectionChange = (sectionId) => {
        setSelectedSectionId(sectionId);
        setData("student_id", "");
        if (sectionId) {
            setFilteredStudents(
                students.filter(
                    (s) =>
                        s.class_id == selectedClassId &&
                        s.section_id == sectionId,
                ),
            );
        } else {
            setFilteredStudents(
                students.filter((s) => s.class_id == selectedClassId),
            );
        }
    };

    const handleFeeTypeChange = (feeTypeName) => {
        const selected = feeTypes.find((ft) => ft.name === feeTypeName);
        setData((prev) => ({
            ...prev,
            fee_type: feeTypeName,
            amount: selected ? selected.default_amount : prev.amount,
        }));
    };

    const selectedStudent = filteredStudents.find(
        (s) => s.id == data.student_id,
    );
    const remaining =
        data.amount && data.paid_amount ? data.amount - data.paid_amount : 0;

    const submit = (e) => {
        e.preventDefault();
        post("/fees");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Fee" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            💰 Add Fee Record
                        </h2>
                        <Link
                            href="/fees"
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Class + Section + Student */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-green-800 mb-3">
                                🎓 Select Student
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class *
                                    </label>
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) =>
                                            handleClassChange(e.target.value)
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section
                                    </label>
                                    <select
                                        value={selectedSectionId}
                                        onChange={(e) =>
                                            handleSectionChange(e.target.value)
                                        }
                                        disabled={!selectedClassId}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                    >
                                        <option value="">All Sections</option>
                                        {availableSections.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                Section {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Student *
                                    </label>
                                    <select
                                        value={data.student_id}
                                        onChange={(e) =>
                                            setData(
                                                "student_id",
                                                e.target.value,
                                            )
                                        }
                                        disabled={!selectedClassId}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            {selectedClassId
                                                ? "Select Student"
                                                : "Select Class First"}
                                        </option>
                                        {filteredStudents.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} — Roll: {s.roll_number}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.student_id && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.student_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Selected Student Info */}
                            {selectedStudent && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200 text-sm">
                                    <p className="text-xs text-gray-400 mb-1">
                                        ✅ Selected Student:
                                    </p>
                                    <div className="flex flex-wrap gap-4 font-medium text-gray-700">
                                        <span>👦 {selectedStudent.name}</span>
                                        <span>
                                            ID: {selectedStudent.student_id}
                                        </span>
                                        <span>
                                            Class:{" "}
                                            {selectedStudent.school_class?.name}
                                        </span>
                                        {selectedStudent.section && (
                                            <span>
                                                Sec:{" "}
                                                {selectedStudent.section.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fee Type + Month */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fee Type *
                                </label>
                                <select
                                    value={data.fee_type}
                                    onChange={(e) =>
                                        handleFeeTypeChange(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Fee Type</option>
                                    {feeTypes.length > 0 ? (
                                        feeTypes.map((ft) => (
                                            <option key={ft.id} value={ft.name}>
                                                {ft.name} — Rs.{" "}
                                                {ft.default_amount?.toLocaleString()}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>
                                            Add fee types first
                                        </option>
                                    )}
                                </select>
                                {errors.fee_type && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.fee_type}
                                    </p>
                                )}
                                {feeTypes.length === 0 && (
                                    <p className="text-xs text-orange-500 mt-1">
                                        ⚠️{" "}
                                        <Link
                                            href="/fee-types"
                                            className="underline"
                                        >
                                            Add fee types
                                        </Link>{" "}
                                        first
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Month *
                                </label>
                                <select
                                    value={data.month}
                                    onChange={(e) =>
                                        setData("month", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Month</option>
                                    {[
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December",
                                    ].map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                                {errors.month && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.month}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Amount + Paid Amount */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Amount (Rs.) *
                                </label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData("amount", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                                {errors.amount && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Paid Amount (Rs.) *
                                </label>
                                <input
                                    type="number"
                                    value={data.paid_amount}
                                    onChange={(e) =>
                                        setData("paid_amount", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                                {errors.paid_amount && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.paid_amount}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Remaining Preview */}
                        {data.amount && data.paid_amount && (
                            <div
                                className={`p-3 rounded-lg text-sm font-medium ${remaining <= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                            >
                                {remaining <= 0
                                    ? "✅ Fully Paid!"
                                    : `⚠️ Remaining: Rs. ${remaining.toLocaleString()}`}
                            </div>
                        )}

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.due_date && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.due_date}
                                </p>
                            )}
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>
                            <textarea
                                value={data.remarks}
                                onChange={(e) =>
                                    setData("remarks", e.target.value)
                                }
                                rows="2"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Optional"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Fee Record"}
                            </button>
                            <Link
                                href="/fees"
                                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
