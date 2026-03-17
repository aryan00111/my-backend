import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ teacher, subjects, allClasses }) {
    const [assignedClasses, setAssignedClasses] = useState(
        teacher.classes?.map((c) => c.id) || [],
    );
    const [savingClasses, setSavingClasses] = useState(false);

    const deleteTeacher = () => {
        if (confirm("Delete this teacher?")) {
            router.delete(`/teachers/${teacher.id}`);
        }
    };

    const toggleClass = (classId) => {
        setAssignedClasses((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId],
        );
    };

    const saveClasses = () => {
        setSavingClasses(true);
        router.post(
            `/teachers/${teacher.id}/assign-classes`,
            {
                class_ids: assignedClasses,
            },
            {
                onSuccess: () => setSavingClasses(false),
                onError: () => setSavingClasses(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={teacher.name} />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/teachers"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-sm"
                        >
                            ← Back
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {teacher.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">
                                    {teacher.name}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {teacher.email}
                                </p>
                                {teacher.user_id && (
                                    <span className="bg-green-400 bg-opacity-30 text-white text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                                        ✅ Login Active
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/teachers/${teacher.id}/edit`}
                            className="bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 font-medium"
                        >
                            ✏️ Edit
                        </Link>
                        <button
                            onClick={deleteTeacher}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 font-medium"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left — Basic Info + Subjects + Assign Classes */}
                    <div className="col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                                📋 Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Department
                                    </p>
                                    <p className="font-medium mt-1">
                                        {teacher.department ? (
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                                                {teacher.department.name}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Phone
                                    </p>
                                    <p className="font-medium mt-1">
                                        {teacher.phone || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Gender
                                    </p>
                                    <p className="font-medium mt-1 capitalize">
                                        {teacher.gender}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Qualification
                                    </p>
                                    <p className="font-medium mt-1">
                                        {teacher.qualification}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Joining Date
                                    </p>
                                    <p className="font-medium mt-1">
                                        {teacher.joining_date?.split("T")[0] ||
                                            "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Salary
                                    </p>
                                    <p className="font-medium mt-1">
                                        Rs. {teacher.salary}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Address
                                    </p>
                                    <p className="font-medium mt-1">
                                        {teacher.address || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Status
                                    </p>
                                    <p className="mt-1">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${teacher.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {teacher.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                                📚 Subjects
                            </h3>
                            {subjects.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                    No subjects assigned
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {subjects.map((sub) => (
                                        <span
                                            key={sub.id}
                                            className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                                        >
                                            {sub.name}
                                            {sub.has_practical && (
                                                <span className="ml-1 text-xs opacity-75">
                                                    +P
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Assign Classes */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                                <h3 className="font-semibold text-gray-800">
                                    🏫 Assign Classes
                                </h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    {assignedClasses.length} selected
                                </span>
                            </div>
                            {allClasses?.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                    No classes found
                                </p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                        {allClasses?.map((cls) => (
                                            <button
                                                key={cls.id}
                                                onClick={() =>
                                                    toggleClass(cls.id)
                                                }
                                                className={`p-3 rounded-lg border-2 text-sm font-medium text-left transition-all ${
                                                    assignedClasses.includes(
                                                        cls.id,
                                                    )
                                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>
                                                        {assignedClasses.includes(
                                                            cls.id,
                                                        )
                                                            ? "✅"
                                                            : "⬜"}
                                                    </span>
                                                    <span>{cls.name}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 ml-6">
                                                    {cls.students_count || 0}{" "}
                                                    students
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={saveClasses}
                                        disabled={savingClasses}
                                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                                    >
                                        {savingClasses
                                            ? "Saving..."
                                            : "💾 Save Classes"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right — Education */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                                🎓 Education
                            </h3>
                            {teacher.educations?.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                    No education records found
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {teacher.educations?.map((edu, i) => (
                                        <div
                                            key={i}
                                            className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500"
                                        >
                                            <p className="font-bold text-blue-800">
                                                {edu.degree}
                                            </p>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {edu.institution}
                                            </p>
                                            {edu.field_of_study && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    📖 {edu.field_of_study}
                                                </p>
                                            )}
                                            <div className="flex gap-3 mt-2">
                                                {edu.passing_year && (
                                                    <span className="text-xs bg-white px-2 py-0.5 rounded border">
                                                        📅 {edu.passing_year}
                                                    </span>
                                                )}
                                                {edu.grade && (
                                                    <span className="text-xs bg-white px-2 py-0.5 rounded border">
                                                        ⭐ {edu.grade}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
