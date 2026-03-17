<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->decimal('marks_obtained', 5, 2)->default(0);
            $table->decimal('total_marks', 5, 2)->default(100);
            $table->decimal('percentage', 5, 2)->default(0);
            $table->string('grade')->nullable();
            $table->enum('status', ['pass', 'fail'])->default('fail');
            $table->text('remarks')->nullable();
            $table->timestamps();

            // Duplicate entry block
            $table->unique(['exam_id', 'student_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};