<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Result Card</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 25px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 12px; margin-bottom: 15px; }
        .header h1 { color: #1e40af; font-size: 22px; margin: 0 0 4px; }
        .header h2 { color: #374151; font-size: 14px; margin: 0 0 4px; }
        .header p { color: #6b7280; font-size: 10px; margin: 2px 0; }
        .student-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 10px 15px; margin-bottom: 15px; }
        .student-box table { width: 100%; border-collapse: collapse; }
        .student-box td { padding: 3px 8px; font-size: 11px; }
        .student-box td:first-child { font-weight: bold; color: #1e40af; width: 25%; }
        table.result { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.result th { background: #1e40af; color: white; padding: 7px 8px; text-align: center; font-size: 10px; }
        table.result th.left { text-align: left; }
        table.result td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 10px; text-align: center; }
        table.result td.left { text-align: left; }
        table.result tr:nth-child(even) { background: #f9fafb; }
        .fail-row { background: #fee2e2 !important; }
        .pass { color: #16a34a; font-weight: bold; }
        .fail { color: #dc2626; font-weight: bold; }
        .grade { display: inline-block; padding: 1px 7px; border-radius: 8px; font-weight: bold; font-size: 10px; background: #dbeafe; color: #1e40af; }
        .practical-badge { background: #ede9fe; color: #7c3aed; padding: 1px 5px; border-radius: 5px; font-size: 9px; }
        .summary-box { border: 2px solid #1e40af; border-radius: 6px; padding: 12px; margin-bottom: 15px; }
        .summary-box table { width: 100%; border-collapse: collapse; }
        .summary-box td { padding: 5px 10px; font-size: 11px; border: none; }
        .summary-box td:first-child { font-weight: bold; color: #374151; }
        .final-box { text-align: center; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
        .final-pass { background: #dcfce7; border: 2px solid #16a34a; }
        .final-fail { background: #fee2e2; border: 2px solid #dc2626; }
        .final-box h2 { font-size: 26px; margin: 0; }
        .final-box p { margin: 4px 0 0; font-size: 12px; }
        .footer { text-align: center; color: #9ca3af; font-size: 9px; border-top: 1px solid #e5e7eb; padding-top: 8px; }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <h1>Result Card</h1>
        <h2>{{ $exam->name }}</h2>
        <p>{{ $exam->schoolClass->name }} &nbsp;|&nbsp; {{ ucfirst(str_replace('_', ' ', $exam->type)) }}</p>
    </div>

    <!-- Student Info -->
    <div class="student-box">
        <table>
            <tr>
                <td>Student Name:</td>
                <td><strong>{{ $student->name }}</strong></td>
                <td>Student ID:</td>
                <td><strong>{{ $student->student_id }}</strong></td>
            </tr>
            <tr>
                <td>Class:</td>
                <td>{{ $student->schoolClass?->name ?? '-' }}</td>
                <td>Section:</td>
                <td>{{ $student->section?->name ?? '-' }}</td>
            </tr>
            <tr>
                <td>Roll No:</td>
                <td>{{ $student->roll_number ?? '-' }}</td>
                <td>Date:</td>
                <td>{{ now()->format('d M Y') }}</td>
            </tr>
        </table>
    </div>

    <!-- Subject Results -->
    <table class="result">
        <thead>
            <tr>
                <th class="left">#</th>
                <th class="left">Subject</th>
                <th>Total Marks</th>
                <th>Passing Marks</th>
                <th>Theory</th>
                <th>Practical</th>
                <th>Total Obtained</th>
                @if($showGrade) <th>Grade</th> @endif
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($results as $i => $result)
            <tr class="{{ $result->status === 'fail' ? 'fail-row' : '' }}">
                <td class="left">{{ $i + 1 }}</td>
                <td class="left">
                    <strong>{{ $result->subject->name }}</strong>
                    @if($result->subject->has_practical)
                        <span class="practical-badge">+Practical</span>
                    @endif
                </td>
                <td>
                    @if($result->subject->has_practical)
                        T:{{ $result->subject->theory_marks }} P:{{ $result->subject->practical_marks }}<br>
                        <strong>= {{ $result->total_marks }}</strong>
                    @else
                        {{ $result->total_marks }}
                    @endif
                </td>
                <td>
                    @if($result->subject->has_practical)
                        T:{{ $result->subject->theory_passing }} P:{{ $result->subject->practical_passing }}<br>
                        <strong>= {{ $result->subject->passing_marks }}</strong>
                    @else
                        {{ $result->subject->passing_marks }}
                    @endif
                </td>
                <td>{{ $result->theory_marks_obtained ?? ($result->subject->has_practical ? '-' : $result->marks_obtained) }}</td>
                <td>{{ $result->subject->has_practical ? ($result->practical_marks_obtained ?? '-') : '-' }}</td>
                <td><strong>{{ $result->marks_obtained }}</strong></td>
                @if($showGrade)
                    <td><span class="grade">{{ $result->grade ?? '-' }}</span></td>
                @endif
                <td class="{{ $result->status === 'pass' ? 'pass' : 'fail' }}">
                    {{ strtoupper($result->status) }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Summary -->
    <div class="summary-box">
        <table>
            <tr>
                <td>Total Marks:</td>
                <td><strong>{{ $summary['total_marks'] }}</strong></td>
                <td>Marks Obtained:</td>
                <td><strong>{{ $summary['marks_obtained'] }}</strong></td>
                <td>Percentage:</td>
                <td><strong>{{ $summary['percentage'] }}%</strong></td>
                @if($showGrade)
                <td>Grade:</td>
                <td><span class="grade" style="font-size:12px;">{{ $summary['grade'] ?? '-' }}</span></td>
                @endif
            </tr>
        </table>
    </div>

    <!-- Final Result -->
    @php
        $finalClass = $summary['status'] === 'pass' ? 'final-pass' : 'final-fail';
        $finalText  = $summary['status'] === 'pass' ? 'PASS' : 'FAIL';
        $finalColor = $summary['status'] === 'pass' ? 'pass' : 'fail';
    @endphp
    <div class="final-box {{ $finalClass }}">
        <h2 class="{{ $finalColor }}">{{ $finalText }}</h2>
        <p>{{ $summary['percentage'] }}%@if($showGrade) — Grade {{ $summary['grade'] }}@endif</p>
    </div>

    <div class="footer">
        Computer generated result card &nbsp;|&nbsp; {{ now()->format('d M Y, h:i A') }}
    </div>

</body>
</html>