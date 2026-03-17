<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Student;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class FeeController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::withCount('students')
            ->with('sections')
            ->where('status', 'active')
            ->latest()
            ->get();

        // Har class ke liye fee summary
        $classes = $classes->map(function($cls) {
            $studentIds = Student::where('class_id', $cls->id)->pluck('id');
            $cls->total_collected = Fee::whereIn('student_id', $studentIds)->sum('paid_amount');
            $cls->total_pending   = Fee::whereIn('student_id', $studentIds)->sum('remaining');
            $cls->total_fees      = Fee::whereIn('student_id', $studentIds)->count();
            return $cls;
        });

        $grandCollected = Fee::sum('paid_amount');
        $grandPending   = Fee::sum('remaining');

        return Inertia::render('Fees/Index', [
            'classes'        => $classes,
            'grandCollected' => $grandCollected,
            'grandPending'   => $grandPending,
        ]);
    }

    public function classView(Request $request)
    {
        $class = SchoolClass::with('sections')->findOrFail($request->class_id);

        $students = Student::where('class_id', $request->class_id)
            ->where('status', 'active')
            ->with(['section', 'fees' => function($q) {
                $q->latest();
            }])
            ->get()
            ->map(function($student) {
                $totalAmount    = $student->fees->sum('amount');
                $totalPaid      = $student->fees->sum('paid_amount');
                $totalRemaining = $student->fees->sum('remaining');
                $lastFee        = $student->fees->first();

                return [
                    'id'             => $student->id,
                    'name'           => $student->name,
                    'student_id'     => $student->student_id,
                    'roll_number'    => $student->roll_number,
                    'section'        => $student->section?->name ?? '-',
                    'total_amount'   => $totalAmount,
                    'total_paid'     => $totalPaid,
                    'total_remaining'=> $totalRemaining,
                    'total_fees'     => $student->fees->count(),
                    'last_status'    => $lastFee?->status ?? 'unpaid',
                    'last_month'     => $lastFee?->month ?? '-',
                ];
            });

        $totalCollected = $students->sum('total_paid');
        $totalPending   = $students->sum('total_remaining');

        return Inertia::render('Fees/ClassView', [
            'class'          => $class,
            'students'       => $students->values(),
            'totalCollected' => $totalCollected,
            'totalPending'   => $totalPending,
        ]);
    }

    public function studentFees(Request $request)
    {
        $student = Student::with(['schoolClass', 'section'])->findOrFail($request->student_id);
        $fees    = Fee::where('student_id', $request->student_id)->latest()->get();

        $totalAmount    = $fees->sum('amount');
        $totalPaid      = $fees->sum('paid_amount');
        $totalRemaining = $fees->sum('remaining');

        return Inertia::render('Fees/StudentFees', [
            'student'        => $student,
            'fees'           => $fees,
            'totalAmount'    => $totalAmount,
            'totalPaid'      => $totalPaid,
            'totalRemaining' => $totalRemaining,
        ]);
    }

    public function create(Request $request)
{
    $classes  = SchoolClass::where('status', 'active')->with('sections')->get();
    $students = Student::where('status', 'active')
        ->with(['schoolClass', 'section'])
        ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
        ->get();

    $feeTypes = \App\Models\FeeType::where('status', 'active')->get();

    return Inertia::render('Fees/Create', [
        'classes'          => $classes,
        'students'         => $students,
        'feeTypes'         => $feeTypes,
        'selected_class'   => $request->class_id ?? null,
        'selected_student' => $request->student_id ?? null,
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'student_id'  => 'required|exists:students,id',
            'fee_type'    => 'required|string',
            'amount'      => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'due_date'    => 'required|date',
            'month'       => 'required|string',
            'remarks'     => 'nullable|string',
        ]);

        $remaining = $request->amount - $request->paid_amount;
        $status    = 'unpaid';
        if ($request->paid_amount >= $request->amount) {
            $status = 'paid';
        } elseif ($request->paid_amount > 0) {
            $status = 'partial';
        }

        Fee::create([
            'student_id'  => $request->student_id,
            'fee_type'    => $request->fee_type,
            'amount'      => $request->amount,
            'paid_amount' => $request->paid_amount,
            'remaining'   => $remaining,
            'status'      => $status,
            'due_date'    => $request->due_date,
            'paid_date'   => $request->paid_amount > 0 ? now() : null,
            'month'       => $request->month,
            'remarks'     => $request->remarks,
        ]);

        return redirect()->route('fees.index')
            ->with('success', 'Fee record add ho gaya!');
    }

    public function edit(Fee $fee)
    {
        $classes  = SchoolClass::where('status', 'active')->with('sections')->get();
        $students = Student::where('status', 'active')->with(['schoolClass', 'section'])->get();

        return Inertia::render('Fees/Edit', [
            'fee'      => $fee->load('student'),
            'classes'  => $classes,
            'students' => $students,
        ]);
    }

    public function update(Request $request, Fee $fee)
    {
        $request->validate([
            'paid_amount' => 'required|numeric|min:0',
            'remarks'     => 'nullable|string',
        ]);

        $remaining = $fee->amount - $request->paid_amount;
        $status    = 'unpaid';
        if ($request->paid_amount >= $fee->amount) {
            $status = 'paid';
        } elseif ($request->paid_amount > 0) {
            $status = 'partial';
        }

        $fee->update([
            'paid_amount' => $request->paid_amount,
            'remaining'   => $remaining,
            'status'      => $status,
            'paid_date'   => $request->paid_amount > 0 ? now() : null,
            'remarks'     => $request->remarks,
        ]);

        return redirect()->route('fees.index')
            ->with('success', 'Fee update ho gayi!');
    }

    public function destroy(Fee $fee)
    {
        $fee->delete();
        return redirect()->route('fees.index')
            ->with('success', 'Fee record delete ho gaya!');
    }

    public function downloadReceipt(Fee $fee)
    {
        $fee->load(['student.schoolClass', 'student.section']);
        $pdf = Pdf::loadView('pdf.fee-receipt', compact('fee'));
        return $pdf->download("fee_receipt_{$fee->id}.pdf");
    }
}