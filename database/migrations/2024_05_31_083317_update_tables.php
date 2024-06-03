<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     public function up()
    {
        // Drop tables
        Schema::dropIfExists('projects');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('phases');
        Schema::dropIfExists('blocks');
        Schema::dropIfExists('project_attributes');

        // Rename tables
        Schema::rename('project_informations', 'projects');
        // Schema::rename('spatial_agapeya_lot', 'spatial_agm_lot');
        // Schema::rename('spatial_agapeya_block', 'spatial_agm_block');
        // Schema::rename('spatial_agapeya_phase', 'spatial_agm_phase');
        // Schema::rename('spatial_agapeya_project', 'spatial_agm_project');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Recreate dropped tables (empty structure for simplicity)
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('phases', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('project_attributes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        // Reverse table renames
        Schema::rename('projects', 'project_informations');
        // Schema::rename('spatial_agm_lot', 'spatial_agapeya_lot');
        // Schema::rename('spatial_agm_block', 'spatial_agapeya_block');
        // Schema::rename('spatial_agm_phase', 'spatial_agapeya_phase');
        // Schema::rename('spatial_agm_project', 'spatial_agapeya_project');
    }
};


