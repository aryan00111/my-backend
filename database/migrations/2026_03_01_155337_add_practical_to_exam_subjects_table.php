<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exam_subjects', function (Blueprint $table) {
            $table->date('practical_date')->nullable()->after('room');
            $table->time('practical_start_time')->nullable()->after('practical_date');
            $table->time('practical_end_time')->nullable()->after('practical_start_time');
            $table->string('practical_room')->nullable()->after('practical_end_time');
        });
    }

    public function down(): void
    {
        Schema::table('exam_subjects', function (Blueprint $table) {
            $table->dropColumn(['practical_date', 'practical_start_time', 'practical_end_time', 'practical_room']);
        });
    }
};