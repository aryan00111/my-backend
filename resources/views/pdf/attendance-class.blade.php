<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Class Attendance Report</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 15px; color: #333; }
        h1 { color: #1e40af; font-size: 18px; margin-bottom: 3px; }
        .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #1e40af; color: white; padding: 7px 8px; text-align: left; font-size: 11px; }
        td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        tr:nth-child(even) { background: #f9fafb; }
        .present { color: #16a34a; font-weight: bold; }
        .absent { color: #dc2626; font-weight: bold; }
        .late { color: #d97706; font-weight: bold; }
        .good { color: #16a34a; font-weight: bold; }
        .warning { color: #d97706; font-weight: bold; }
        .danger { color: #dc2626; font-weight: bold; }
        .summary { background: #eff6ff; padding: 8px 12px; border-radius: 4px; margin-bottom: 15px; border-left: 4px solid #1e40af; }
    </style>
</head>
<body>

    <h1>📋 Class Attendance Report</h1>
    <div class="subtitle">
        Class: <strong>{{ $class->name }}</strong> &nbsp;|&nbsp;
        Month: <strong>{{ $months[$month] }} {{ $year }}</strong> &nbsp;|&nbsp;
        Total Students: <strong>{{ $students->count() }}</strong>
    </div>

    <!-- Summary -->
    @php
        $totalPresent = $students->sum('present');
        $totalAbsent  = $students->sum('absent');
        $totalLate    = $students->sum('late');
        $avgPct       = $students->count() > 0 ? round($students->avg('percentage')) : 0;
    @endphp

    <div class="summary">
        Total Present: <strong class="present">{{ $totalPresent }}</strong> &nbsp;|&nbsp;
        Total Absent: <strong class="absent">{{ $totalAbsent }}</strong> &nbsp;|&nbsp;
        Total Late: <strong class="late">{{ $totalLate }}</strong> &nbsp;|&nbsp;
        Average Attendance: <strong>{{ $avgPct }}%</strong>
    </div>

    <!-- Students Table -->
    <table>
        <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Section</th>
            <th>Roll No</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Total Days</th>
            <th>Percentage</th>
        </tr>
        @forelse($students as $i => $s)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $s['student_id'] }}</td>
            <td><strong>{{ $s['name'] }}</strong></td>
            <td>{{ $s['section'] }}</td>
            <td>{{ $s['roll_number'] }}</td>
            <td class="present">{{ $s['present'] }}</td>
            <td class="absent">{{ $s['absent'] }}</td>
            <td class="late">{{ $s['late'] }}</td>
            <td>{{ $s['total'] }}</td>
            <td class="{{ $s['percentage'] >= 75 ? 'good' : ($s['percentage'] >= 50 ? 'warning' : 'danger') }}">
                {{ $s['percentage'] }}%
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="10" style="text-align:center; color:#9ca3af; padding:20px;">
                Koi attendance record nahi hai
            </td>
        </tr>
        @endforelse
    </table>

</body>
</html>