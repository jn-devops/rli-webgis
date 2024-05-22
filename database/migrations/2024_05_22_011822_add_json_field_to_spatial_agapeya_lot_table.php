<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('spatial_agapeya_lot', function (Blueprint $table) {
            $table->json('document_checklist')->nullable(); // Add the new JSON field
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spatial_agapeya_lot', function (Blueprint $table) {
            $table->dropColumn('document_checklist'); // Remove the JSON field
        });
    }
};
