import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({ teacher, departments }) {
    const { errors } = usePage().props;
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        department_id: teacher.department_id || "",
        subject_ids: (teacher.subject_ids || []).map((id) => parseInt(id)),
        qualification: teacher.qualification || "",
        gender: teacher.gender || "",
        joining_date: teacher.joining_date?.split("T")[0] || "",
        salary: teacher.salary || "",
        address: teacher.address || "",
        status: teacher.status || "active",
    });

    const [educations, setEducations] = useState(
        teacher.educations?.length > 0
            ? teacher.educations.map((e) => ({
                  degree: e.degree || "",
                  institution: e.institution || "",
                  field_of_study: e.field_of_study || "",
                  passing_year: e.passing_year || "",
                  grade: e.grade || "",
              }))
            : [
                  {
                      degree: "",
                      institution: "",
                      field_of_study: "",
                      passing_year: "",
                      grade: "",
                  },
              ],
    );

    const addEducation = () =>
        setEducations((p) => [
            ...p,
            {
                degree: "",
                institution: "",
                field_of_study: "",
                passing_year: "",
                grade: "",
            },
        ]);
    const removeEducation = (i) =>
        setEducations((p) => p.filter((_, idx) => idx !== i));
    const updateEducation = (i, field, value) =>
        setEducations((p) =>
            p.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)),
        );

    const toggleSubject = (id) => {
        const intId = parseInt(id);
        setForm((p) => ({
            ...p,
            subject_ids: p.subject_ids.includes(intId)
                ? p.subject_ids.filter((s) => s !== intId)
                : [...p.subject_ids, intId],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put(
            `/teachers/${teacher.id}`,
            { ...form, educations },
            {
                onSuccess: () => setSaving(false),
                onError: () => setSaving(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Teacher" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/teachers"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800">
                        ✏️ Edit Teacher
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                            📋 Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            email: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            phone: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <select
                                    value={form.department_id}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            department_id: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        -- Select Department --
                                    </option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    value={form.gender}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            gender: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        -- Select Gender --
                                    </option>
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
                                    Qualification *
                                </label>
                                <input
                                    type="text"
                                    value={form.qualification}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            qualification: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.qualification && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.qualification}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Joining Date
                                </label>
                                <input
                                    type="date"
                                    value={form.joining_date}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            joining_date: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salary
                                </label>
                                <input
                                    type="number"
                                    value={form.salary}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            salary: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            status: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            address: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <h3 className="font-semibold text-gray-800">
                                🎓 Education
                            </h3>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                            >
                                + Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {educations.map((edu, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-2 md:grid-cols-6 gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Degree *
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) =>
                                                updateEducation(
                                                    i,
                                                    "degree",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. B.Sc"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Institution *
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) =>
                                                updateEducation(
                                                    i,
                                                    "institution",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="University Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Field of Study
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.field_of_study}
                                            onChange={(e) =>
                                                updateEducation(
                                                    i,
                                                    "field_of_study",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Physics"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Passing Year
                                        </label>
                                        <input
                                            type="number"
                                            value={edu.passing_year}
                                            onChange={(e) =>
                                                updateEducation(
                                                    i,
                                                    "passing_year",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="2020"
                                            min="1980"
                                            max="2030"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Grade/CGPA
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.grade}
                                            onChange={(e) =>
                                                updateEducation(
                                                    i,
                                                    "grade",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. A / 3.8"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        {educations.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeEducation(i)
                                                }
                                                className="w-full bg-red-500 text-white px-2 py-1.5 rounded text-xs hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 font-bold"
                        >
                            {saving ? "Saving..." : "💾 Update Teacher"}
                        </button>
                        <Link
                            href="/teachers"
                            className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl text-sm hover:bg-gray-200 font-medium"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
