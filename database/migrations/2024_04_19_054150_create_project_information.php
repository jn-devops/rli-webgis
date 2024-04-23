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
        Schema::create('project_informations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('project_code');
            $table->string('full_address');
            $table->float('project_size_meter_square');
            $table->string('company_code');
            $table->string('developer_name');
            $table->string('management_company');
            $table->string('project_study_reference_number');
            $table->dateTime('project_study_approval_date');
            $table->string('license_to_sell_number');
            $table->string('certificate_registration_number');
            $table->dateTime('certificate_registration_number_issued_date');
            $table->string('boi_registration_number');
            $table->dateTime('boi_registration_number_issued_date');
            $table->string('number_saleable_units');
            $table->string('orientation'); // condominium|subdivision
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_information');
    }
};
