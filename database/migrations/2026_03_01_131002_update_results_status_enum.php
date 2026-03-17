<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE results MODIFY COLUMN status ENUM('pass', 'partial', 'fail') NOT NULL DEFAULT 'fail'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE results MODIFY COLUMN status ENUM('pass', 'fail') NOT NULL DEFAULT 'fail'");
    }
};