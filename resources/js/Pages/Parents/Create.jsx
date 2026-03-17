import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ students, classes, selected_class }) {
    const [selectedClassId, setSelectedClassId] = useState(
        selected_class || "",
    );
    const [filteredStudents, setFilteredStudents] = useState(
        selected_class
            ? students.filter((s) => s.class_id == selected_class)
            : [],
    );

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        student_id: "",
        relation: "father",
        phone: "",
        cnic: "",
        occupation: "",
        address: "",
    });

    const handleClassChange = (classId) => {
        setSelectedClassId(classId);
        setData("student_id", "");
        setFilteredStudents(
            classId ? students.filter((s) => s.class_id == classId) : [],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post("/parents");
    };

    const selectedStudent = filteredStudents.find(
        (s) => s.id == data.student_id,
    );

    return (
        <AuthenticatedLayout>
            <Head title="Add Parent" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Add Parent Account
                        </h2>
                        <Link
                            href="/parents"
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Login Info */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-800 mb-3">
                                🔐 Login Credentials
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Parent name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Login email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Min 6 characters"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Class + Student Select */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-green-800 mb-3">
                                🎓 Select Student
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {selectedStudent && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Selected Student:
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700">
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
                                                Section:{" "}
                                                {selectedStudent.section.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Relation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Relation *
                            </label>
                            <select
                                value={data.relation}
                                onChange={(e) =>
                                    setData("relation", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="father">Father</option>
                                <option value="mother">Mother</option>
                                <option value="guardian">Guardian</option>
                            </select>
                        </div>

                        {/* Phone + CNIC */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CNIC
                                </label>
                                <input
                                    type="text"
                                    value={data.cnic}
                                    onChange={(e) =>
                                        setData("cnic", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="CNIC number"
                                />
                            </div>
                        </div>

                        {/* Occupation + Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Occupation
                                </label>
                                <input
                                    type="text"
                                    value={data.occupation}
                                    onChange={(e) =>
                                        setData("occupation", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Job/Business"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Address"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing
                                    ? "Creating..."
                                    : "Create Parent Account"}
                            </button>
                            <Link
                                href="/parents"
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
