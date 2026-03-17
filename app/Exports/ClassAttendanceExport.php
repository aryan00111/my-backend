<?php

namespace App\Exports;

use App\Models\Attendance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ClassAttendanceExport implements FromCollection, WithHeadings, WithTitle, WithStyles, WithColumnWidths
{
    protected $class;
    protected $students;
    protected $month;
    protected $year;

    public function __construct($class, $students, $month, $year)
    {
        $this->class    = $class;
        $this->students = $students;
        $this->month    = $month;
        $this->year     = $year;
    }

    public function collection()
    {
        $months = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

        $rows = collect();
        $rows->push(["Class Attendance Report - {$this->class->name} - {$months[$this->month]} {$this->year}", '', '', '', '', '', '', '', '', '']);
        $rows->push(['', '', '', '', '', '', '', '', '', '']);

        foreach ($this->students as $i => $student) {
            $atts    = Attendance::where('student_id', $student->id)
                ->whereMonth('date', $this->month)
                ->whereYear('date', $this->year)
                ->get();

            $total   = $atts->count();
            $present = $atts->where('status', 'present')->count();
            $absent  = $atts->where('status', 'absent')->count();
            $late    = $atts->where('status', 'late')->count();
            $pct     = $total > 0 ? round(($present / $total) * 100) : 0;

            $rows->push([
                $i + 1,
                $student->student_id,
                $student->name,
                $student->section?->name ?? '-',
                $student->roll_number,
                $present,
                $absent,
                $late,
                $total,
                $pct . '%',
            ]);
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            '#',
            'Student ID',
            'Name',
            'Section',
            'Roll No',
            'Present',
            'Absent',
            'Late',
            'Total Days',
            'Percentage',
        ];
    }

    public function title(): string
    {
        return 'Attendance Report';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 13]],
            3 => ['font' => ['bold' => true], 'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1e40af'],
            ]],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 15,
            'C' => 25,
            'D' => 10,
            'E' => 10,
            'F' => 10,
            'G' => 10,
            'H' => 10,
            'I' => 12,
            'J' => 12,
        ];
    }
}