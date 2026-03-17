<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Attendance Report</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; color: #333; }
        h1 { color: #1e40af; font-size: 20px; margin-bottom: 5px; }
        h2 { color: #374151; font-size: 14px; margin: 15px 0 8px; border-bottom: 2px solid #1e40af; padding-bottom: 4px; }
        .info-table { width: 100%; margin-bottom: 15px; border-collapse: collapse; }
        .info-table td { padding: 5px 10px; border: 1px solid #e5e7eb; }
        .info-table td:first-child { background: #f3f4f6; font-weight: bold; width: 30%; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #1e40af; color: white; padding: 6px 8px; text-align: left; font-size: 11px; }
        td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        tr:nth-child(even) { background: #f9fafb; }
        .present { color: #16a34a; font-weight: bold; }
        .absent { color: #dc2626; font-weight: bold; }
        .late { color: #d97706; font-weight: bold; }
        .month-summary { background: #eff6ff; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; font-size: 11px; border-left: 3px solid #1e40af; }
        .summary-row td { font-weight: bold; background: #dbeafe; }
    </style>
</head>
<body>

    <h1>Attendance Report</h1>

    <!-- Student Info -->
    <table class="info-table">
        <tr><td>Student Name</td><td>{{ $student->name }}</td></tr>
        <tr><td>Student ID</td><td>{{ $student->student_id }}</td></tr>
        <tr><td>Class</td><td>{{ $student->schoolClass?->name ?? '-' }}</td></tr>
        <tr><td>Section</td><td>{{ $student->section?->name ?? '-' }}</td></tr>
    </table>

    <!-- Overall Summary -->
    <h2>Overall Summary</h2>
    <table>
        <tr>
            <th>Total Days</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Percentage</th>
        </tr>
        <tr class="summary-row">
            <td>{{ $summary['total'] }}</td>
            <td class="present">{{ $summary['present'] }}</td>
            <td class="absent">{{ $summary['absent'] }}</td>
            <td class="late">{{ $summary['late'] }}</td>
            <td><strong>{{ $summary['percentage'] }}%</strong></td>
        </tr>
    </table>

    <!-- Month wise -->
    @forelse($attendances as $month)
    <h2>{{ $month['month'] }}</h2>
    <div class="month-summary">
        Total: {{ $month['total'] }} &nbsp;|&nbsp;
        Present: {{ $month['present'] }} &nbsp;|&nbsp;
        Absent: {{ $month['absent'] }} &nbsp;|&nbsp;
        Late: {{ $month['late'] }} &nbsp;|&nbsp;
        Percentage: {{ $month['percentage'] }}%
    </div>
    <table>
        <tr>
            <th>#</th>
            <th>Date</th>
            <th>Day</th>
            <th>Status</th>
            <th>Remarks</th>
        </tr>
        @foreach($month['records'] as $i => $record)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $record['date'] }}</td>
            <td>{{ \Carbon\Carbon::parse($record['date'])->format('l') }}</td>
            <td class="{{ $record['status'] }}">{{ ucfirst($record['status']) }}</td>
            <td>{{ $record['remarks'] ?: '-' }}</td>
        </tr>
        @endforeach
    </table>
    @empty
    <p style="color: #9ca3af; text-align: center; padding: 20px;">Koi attendance record nahi hai</p>
    @endforelse

</body>
</html>