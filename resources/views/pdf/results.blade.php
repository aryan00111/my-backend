<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Exam Results</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 12px; margin-bottom: 15px; }
        .header h1 { color: #1e40af; font-size: 20px; margin: 0 0 4px; }
        .header p { color: #6b7280; margin: 2px 0; font-size: 10px; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .info-box span { font-size: 10px; }
        .info-box strong { color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th { background: #1e40af; color: white; padding: 6px 8px; text-align: left; font-size: 10px; }
        td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 10px; }
        tr:nth-child(even) { background: #f9fafb; }
        .pass { color: #16a34a; font-weight: bold; }
        .fail { color: #dc2626; font-weight: bold; }
        .grade { display: inline-block; padding: 1px 6px; border-radius: 8px; font-weight: bold; font-size: 9px; background: #dbeafe; color: #1e40af; }
        .footer { text-align: center; color: #9ca3af; font-size: 9px; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 15px; }
        .rank { font-weight: bold; color: #1e40af; }
    </style>
</head>
<body>

    <div class="header">
        <h1>{{ $exam->name }} — Results</h1>
        <p>Class: <strong>{{ $exam->schoolClass->name }}</strong> &nbsp;|&nbsp; Type: <strong>{{ ucfirst(str_replace('_', ' ', $exam->type)) }}</strong> &nbsp;|&nbsp; Generated: {{ now()->format('d M Y') }}</p>
    </div>

    <div class="info-box">
        <span>Total Students: <strong>{{ $studentSummary->count() }}</strong></span>
        <span>Pass: <strong class="pass">{{ $studentSummary->where('status', 'pass')->count() }}</strong></span>
        <span>Fail: <strong class="fail">{{ $studentSummary->where('status', 'fail')->count() }}</strong></span>
        <span>Class Average: <strong>{{ $studentSummary->count() > 0 ? round($studentSummary->avg('percentage'), 1) : 0 }}%</strong></span>
        <span>Subjects: <strong>{{ $subjects->count() }}</strong></span>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>ID</th>
                @foreach($subjects as $sub)
                    <th>
                        {{ $sub->name }}
                        @if($sub->has_practical)
                            (T/P)
                        @endif
                    </th>
                @endforeach
                <th>Total</th>
                <th>Obtained</th>
                <th>%</th>
                @if($showGrade) <th>Grade</th> @endif
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
            @foreach($studentSummary as $i => $item)
            <tr>
                <td class="rank">{{ $i + 1 }}</td>
                <td><strong>{{ $item['student']->name }}</strong></td>
                <td>{{ $item['student']->student_id }}</td>
                @foreach($subjects as $sub)
                    @php
                        $result = $item['results']->firstWhere('subject_id', $sub->id);
                    @endphp
                    <td>
                        @if($result)
                            @if($sub->has_practical)
                                T:{{ $result->theory_marks_obtained ?? '-' }}<br>
                                P:{{ $result->practical_marks_obtained ?? '-' }}<br>
                                <strong>= {{ $result->marks_obtained }}</strong>
                            @else
                                {{ $result->marks_obtained }}/{{ $result->total_marks }}
                            @endif
                        @else
                            -
                        @endif
                    </td>
                @endforeach
                <td><strong>{{ $item['total_marks'] }}</strong></td>
                <td><strong>{{ $item['marks_obtained'] }}</strong></td>
                <td><strong>{{ $item['percentage'] }}%</strong></td>
                @if($showGrade)
                    <td><span class="grade">{{ $item['grade'] ?? '-' }}</span></td>
                @endif
                <td class="{{ $item['status'] === 'pass' ? 'pass' : 'fail' }}">
                    {{ strtoupper($item['status']) }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Computer generated result sheet &nbsp;|&nbsp; {{ now()->format('d M Y, h:i A') }}
    </div>

</body>
</html>