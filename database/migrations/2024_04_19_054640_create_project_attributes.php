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
        Schema::create('project_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_information_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('property_code');
            $table->string('sku');
            $table->float('lot_area');
            $table->float('floor_area');
            $table->string('unit_type_name');
            $table->string('unit_type_interior');
            $table->string('house_color');
            $table->integer('number_of_ac');
            $table->integer('number_of_bedroom');
            $table->integer('number_of_bathroom');
            $table->string('tct_number');
            $table->string('technical_description');
            $table->string('tax_declaration_number');
            $table->float('base_lot_price');
            $table->float('house_model_price');
            $table->float('total_selling_price');
            $table->float('total_contract_price');
            $table->string('images');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_attributes');
    }
};
