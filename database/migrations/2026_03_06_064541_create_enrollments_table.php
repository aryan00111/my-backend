<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();

            // Student Info
            $table->string('student_name');
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('religion')->nullable();
            $table->string('nationality')->default('Pakistani');
            $table->string('previous_school')->nullable();
            $table->string('last_class_passed')->nullable();
            $table->string('apply_for_class');

            // Parent Info
            $table->string('father_name');
            $table->string('father_cnic')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('father_phone');
            $table->string('mother_name')->nullable();
            $table->string('mother_phone')->nullable();

            // Contact Info
            $table->string('email')->nullable();
            $table->text('address');
            $table->string('city')->nullable();

            // Documents
            $table->string('birth_certificate')->nullable();
            $table->string('previous_marksheet')->nullable();
            $table->string('passport_photo')->nullable();

            // Status
            $table->enum('status', ['pending', 'reviewing', 'approved', 'rejected'])->default('pending');
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};