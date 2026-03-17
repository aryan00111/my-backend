<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fee Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 30px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { color: #1e40af; font-size: 22px; margin: 0; }
        .header p { color: #6b7280; margin: 3px 0; }
        .receipt-no { text-align: right; margin-bottom: 15px; color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        td { padding: 8px 10px; border: 1px solid #e5e7eb; }
        td:first-child { background: #f3f4f6; font-weight: bold; width: 35%; }
        .amount-table th { background: #1e40af; color: white; padding: 8px; }
        .amount-table td:first-child { background: #f3f4f6; }
        .total-row td { background: #dbeafe !important; font-weight: bold; font-size: 14px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: bold; }
        .paid { background: #dcfce7; color: #16a34a; }
        .partial { background: #fef9c3; color: #ca8a04; }
        .unpaid { background: #fee2e2; color: #dc2626; }
        .footer { text-align: center; margin-top: 30px; color: #9ca3af; font-size: 11px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    </style>
</head>
<body>

    <div class="header">
        <h1>Fee Receipt</h1>
        <p>School Management System</p>
    </div>

    <div class="receipt-no">
        Receipt #: <strong>{{ str_pad($fee->id, 6, '0', STR_PAD_LEFT) }}</strong> &nbsp;|&nbsp;
        Date: <strong>{{ now()->format('d M Y') }}</strong>
    </div>

    <!-- Student Info -->
    <table>
        <tr><td>Student Name</td><td>{{ $fee->student->name }}</td></tr>
        <tr><td>Student ID</td><td>{{ $fee->student->student_id }}</td></tr>
        <tr><td>Class</td><td>{{ $fee->student->schoolClass?->name ?? '-' }}</td></tr>
        <tr><td>Section</td><td>{{ $fee->student->section?->name ?? '-' }}</td></tr>
        <tr><td>Month</td><td>{{ $fee->month }}</td></tr>
        <tr><td>Fee Type</td><td>{{ $fee->fee_type }}</td></tr>
        <tr><td>Due Date</td><td>{{ $fee->due_date }}</td></tr>
    </table>

    <!-- Amount Details -->
    <table class="amount-table">
        <tr>
            <th>Description</th>
            <th>Amount</th>
        </tr>
        <tr>
            <td>Total Fee Amount</td>
            <td>Rs. {{ number_format($fee->amount) }}</td>
        </tr>
        <tr>
            <td>Paid Amount</td>
            <td style="color: #16a34a; font-weight: bold;">Rs. {{ number_format($fee->paid_amount) }}</td>
        </tr>
        <tr class="total-row">
            <td>Remaining Amount</td>
            <td style="color: {{ $fee->remaining > 0 ? '#dc2626' : '#16a34a' }};">
                Rs. {{ number_format($fee->remaining) }}
            </td>
        </tr>
    </table>

    <!-- Status -->
    <p>
        Payment Status:
        <span class="status {{ $fee->status }}">{{ strtoupper($fee->status) }}</span>
    </p>

    @if($fee->remarks)
    <p>Remarks: {{ $fee->remarks }}</p>
    @endif

    <div class="footer">
        This is a computer generated receipt. No signature required.
    </div>

</body>
</html>