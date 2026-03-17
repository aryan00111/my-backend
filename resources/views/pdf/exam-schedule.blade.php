<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Exam Schedule</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 25px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #1e40af; padding-bottom: 15px; }
        .header h1 { color: #1e40af; font-size: 22px; margin: 0 0 5px; }
        .header h2 { color: #374151; font-size: 16px; margin: 0 0 5px; }
        .header p { color: #6b7280; margin: 3px 0; font-size: 11px; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 15px; margin-bottom: 20px; }
        .info-box table { width: 100%; border-collapse: collapse; }
        .info-box td { padding: 4px 10px; font-size: 11px; }
        .info-box td:first-child { font-weight: bold; color: #1e40af; width: 30%; }
        table.schedule { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.schedule th { background: #1e40af; color: white; padding: 8px 10px; text-align: left; font-size: 11px; }
        table.schedule td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        table.schedule tr:nth-child(even) { background: #f9fafb; }
        table.schedule tr:hover { background: #eff6ff; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .footer { text-align: center; color: #9ca3af; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 20px; }
        .no-data { text-align: center; padding: 30px; color: #9ca3af; }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <h1>{{ $exam->name }}</h1>
<h2>{{ $exam->schoolClass->name }} — {{ ucfirst(str_replace('_', ' ', $exam->type)) }}</h2>
        <p>Class: <strong>{{ $exam->schoolClass->name }}</strong> &nbsp;|&nbsp; Type: <strong>{{ ucfirst(str_replace('_', ' ', $exam->type)) }}</strong></p>
    </div>

    <!-- Exam Info -->
    <div class="info-box">
        <table>
            <tr>
                <td>Exam Name:</td>
                <td>{{ $exam->name }}</td>
                <td>Class:</td>
                <td>{{ $exam->schoolClass->name }}</td>
            </tr>
            <tr>
                <td>Start Date:</td>
                <td>{{ \Carbon\Carbon::parse($exam->start_date)->format('d M Y') }}</td>
                <td>End Date:</td>
                <td>{{ \Carbon\Carbon::parse($exam->end_date)->format('d M Y') }}</td>
            </tr>
            <tr>
                <td>Exam Type:</td>
                <td>{{ ucfirst(str_replace('_', ' ', $exam->type)) }}</td>
                <td>Status:</td>
                <td>{{ ucfirst($exam->status) }}</td>
            </tr>
            <tr>
                <td>Total Subjects:</td>
                <td>{{ $examSubjects->count() }}</td>
                <td>Generated:</td>
                <td>{{ now()->format('d M Y, h:i A') }}</td>
            </tr>
        </table>
    </div>

    <!-- Schedule Table -->
    @if($examSubjects->count() > 0)
    <table class="schedule">
        <thead>
            <tr>
                <th>#</th>
<th>Subject</th>
<th>Code</th>
<th>Type</th>
<th>Exam Date</th>
<th>Day</th>
<th>Start Time</th>
<th>End Time</th>
<th>Room</th>
            </tr>
        </thead>
        <tbody>
           @foreach($examSubjects as $i => $es)
<tr>
    <td>{{ $i + 1 }}</td>
    <td><strong>{{ $es->subject->name }}</strong></td>
    <td>
        @if($es->subject->code)
            <span class="badge badge-blue">{{ $es->subject->code }}</span>
        @else -
        @endif
    </td>
    <td><span class="badge badge-blue">Theory</span></td>
    <td>{{ \Carbon\Carbon::parse($es->exam_date)->format('d M Y') }}</td>
    <td>{{ \Carbon\Carbon::parse($es->exam_date)->format('l') }}</td>
    <td>{{ $es->start_time ? \Carbon\Carbon::parse($es->start_time)->format('h:i A') : '-' }}</td>
    <td>{{ $es->end_time ? \Carbon\Carbon::parse($es->end_time)->format('h:i A') : '-' }}</td>
    <td>{{ $es->room ?? '-' }}</td>
</tr>
@if($es->subject->has_practical && $es->practical_date)
<tr style="background: #f5f3ff;">
    <td></td>
    <td><strong>{{ $es->subject->name }}</strong></td>
    <td>
        @if($es->subject->code)
            <span class="badge badge-blue">{{ $es->subject->code }}</span>
        @else -
        @endif
    </td>
    <td><span style="background:#ede9fe; color:#7c3aed; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold;">Practical</span></td>
    <td>{{ \Carbon\Carbon::parse($es->practical_date)->format('d M Y') }}</td>
    <td>{{ \Carbon\Carbon::parse($es->practical_date)->format('l') }}</td>
    <td>{{ $es->practical_start_time ? \Carbon\Carbon::parse($es->practical_start_time)->format('h:i A') : '-' }}</td>
    <td>{{ $es->practical_end_time ? \Carbon\Carbon::parse($es->practical_end_time)->format('h:i A') : '-' }}</td>
    <td>{{ $es->practical_room ?? '-' }}</td>
</tr>
@endif
@endforeach
        </tbody>
    </table>
    @else
    <div class="no-data">Koi subject schedule nahi hai</div>
    @endif

    <div class="footer">
        This is a computer generated document. &nbsp;|&nbsp; Printed on: {{ now()->format('d M Y, h:i A') }}
    </div>

</body>
</html>