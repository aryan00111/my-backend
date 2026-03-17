import { Link } from "@inertiajs/react";

export default function NoStudent() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow p-8 md:p-12 text-center max-w-md w-full">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    No Student Linked
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Your account is not linked to any student. Please contact
                    the admin.
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
