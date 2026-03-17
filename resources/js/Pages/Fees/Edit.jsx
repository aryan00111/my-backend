import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ fee, students }) {
    const { data, setData, put, processing, errors } = useForm({
        paid_amount: fee.paid_amount || "",
        remarks: fee.remarks || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/fees/${fee.id}`);
    };

    const remaining = fee.amount - data.paid_amount;
    const percent = Math.min((data.paid_amount / fee.amount) * 100, 100);

    return (
        <AuthenticatedLayout>
            <Head title="Edit Fee" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Update Fee Payment
                        </h2>
                        <Link
                            href="/fees"
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            ← Back
                        </Link>
                    </div>

                    {/* Student Info Card */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Student</p>
                                <p className="font-semibold text-gray-800">
                                    {fee.student?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Class</p>
                                <p className="font-semibold text-gray-800">
                                    Class {fee.student?.class} -{" "}
                                    {fee.student?.section}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Fee Type</p>
                                <p className="font-semibold text-gray-800">
                                    {fee.fee_type}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Month</p>
                                <p className="font-semibold text-gray-800">
                                    {fee.month}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Amount Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">
                                Total Amount
                            </p>
                            <p className="text-lg font-bold text-gray-800">
                                Rs. {fee.amount}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Paid</p>
                            <p className="text-lg font-bold text-green-600">
                                Rs. {data.paid_amount || 0}
                            </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Remaining</p>
                            <p className="text-lg font-bold text-red-500">
                                Rs. {remaining > 0 ? remaining : 0}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Payment Progress</span>
                            <span>{Math.round(percent)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
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
                                max={fee.amount}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                            {errors.paid_amount && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.paid_amount}
                                </p>
                            )}
                        </div>

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
                                placeholder="Optional note"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? "Updating..." : "Update Payment"}
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
