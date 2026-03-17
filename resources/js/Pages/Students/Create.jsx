import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ classes, selected_class }) {
    const [sections, setSections] = useState(
        selected_class
            ? classes.find((c) => c.id == selected_class)?.sections || []
            : [],
    );

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        father_name: "",
        class_id: selected_class || "",
        section_id: "",
        roll_number: "",
        phone: "",
        address: "",
        gender: "",
        date_of_birth: "",
    });

    const handleClassChange = (classId) => {
        setData("class_id", classId);
        setData("section_id", "");
        const selectedClass = classes.find((c) => c.id == classId);
        setSections(selectedClass ? selectedClass.sections : []);
    };

    const submit = (e) => {
        e.preventDefault();
        post("/students");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Student" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Add New Student
                        </h2>
                        <Link
                            href="/students"
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name + Father Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Student Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Student name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Father Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.father_name}
                                    onChange={(e) =>
                                        setData("father_name", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Father name"
                                />
                                {errors.father_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.father_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Class + Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class *
                                </label>
                                <select
                                    value={data.class_id}
                                    onChange={(e) =>
                                        handleClassChange(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.class_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.class_id}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section
                                </label>
                                <select
                                    value={data.section_id}
                                    onChange={(e) =>
                                        setData("section_id", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={sections.length === 0}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            Section {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Roll Number + Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Roll Number *
                                </label>
                                <input
                                    type="text"
                                    value={data.roll_number}
                                    onChange={(e) =>
                                        setData("roll_number", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Roll number"
                                />
                                {errors.roll_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.roll_number}
                                    </p>
                                )}
                            </div>
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
                                    placeholder="Phone number"
                                />
                            </div>
                        </div>

                        {/* Gender + DOB */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) =>
                                        setData("date_of_birth", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                rows="2"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Address"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Student"}
                            </button>
                            <Link
                                href="/students"
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
