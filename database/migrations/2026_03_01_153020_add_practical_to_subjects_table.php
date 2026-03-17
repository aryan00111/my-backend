<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->boolean('has_practical')->default(false)->after('passing_marks');
            $table->integer('theory_marks')->nullable()->after('has_practical');
            $table->integer('practical_marks')->nullable()->after('theory_marks');
            $table->integer('theory_passing')->nullable()->after('practical_marks');
            $table->integer('practical_passing')->nullable()->after('theory_passing');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn(['has_practical', 'theory_marks', 'practical_marks', 'theory_passing', 'practical_passing']);
        });
    }
};