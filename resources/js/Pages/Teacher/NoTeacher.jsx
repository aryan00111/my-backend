import { Head, Link, usePage } from "@inertiajs/react";

export default function NoTeacher() {
    const { props } = usePage();
    const schoolName = props.schoolName || "School Management";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <Head title="No Teacher Account" />
            <div className="bg-white rounded-xl shadow p-8 md:p-12 max-w-md w-full text-center">
                <p className="text-6xl mb-4">👨‍🏫</p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    No Teacher Account Linked
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Your account is not linked to any teacher profile. Please
                    contact the admin.
                </p>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-red-600"
                >
                    Logout
                </Link>
            </div>
        </div>
    );
}
