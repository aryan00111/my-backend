<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['unit_test', 'half_yearly', 'annual', 'other']);
            $table->foreignId('school_class_id')->constrained()->onDelete('cascade');
            $table->date('exam_date');
            $table->enum('status', ['scheduled', 'ongoing', 'completed'])->default('scheduled');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};