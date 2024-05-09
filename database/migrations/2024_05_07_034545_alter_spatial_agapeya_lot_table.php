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
            $table->float('floor_area')->nullable();
            $table->string('type')->nullable();
            $table->string('orientation')->nullable();
            $table->string('color')->nullable();
            $table->string('sku')->nullable();
            $table->float('lot_price')->nullable();
            $table->float('house_price')->nullable();
            $table->float('premium')->nullable();
            $table->float('vat')->nullable();
            $table->float('tcp_duplex')->nullable();
            $table->float('discount')->nullable();
            $table->float('ntcp')->nullable();
            $table->string('image')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();

            $table->unique(['property_c']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spatial_agapeya_lot', function (Blueprint $table) {
            $table->dropColumn('floor_area');
            $table->dropColumn('type');
            $table->dropColumn('orientation');
            $table->dropColumn('color');
            $table->dropColumn('sku');
            $table->dropColumn('lot_price');
            $table->dropColumn('house_price');
            $table->dropColumn('premium');
            $table->dropColumn('vat');
            $table->dropColumn('tcp_duplex');
            $table->dropColumn('discount');
            $table->dropColumn('ntcp');
            $table->dropColumn('image');
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
        });
    }
};
