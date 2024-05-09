<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use App\Imports\YourExcelImport;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {   
        // Example to get the path to your Excel file
        $filePath = storage_path('app/excel/Agapeya.xlsx');

        // Load Excel data
        $data = Excel::import(new YourExcelImport, $filePath);
        
        // var_dump($data);

        // Loop through each row
        // foreach ($data[0] as $row) {
        //     $propertyCode = $row['PROPERTY_C'];

        //     // Update the existing table based on property_code
        //     DB::table('spatial_agapeya_lot')
        //         ->where('property_code', $propertyCode)
        //         ->update([
        //             'status' => $row['STATUS'],
        //             'floor_area' => $row['FLOOR AREA'],
        //             'lot_area' => $row['LOT_AREA'],
        //             'type' => $row['TYPE'],
        //             'orientation' => $row['ORIENTATIO'],
        //             'color' => $row['COLOR'],
        //             'sku' => $row['SKU'],
        //             'lot_price' => $row['LOT_PRICE'],
        //             'house_price' => $row['HOUSE_PRIC'],
        //             'premium' => $row['PREMIUM'],
        //             'vat' => $row['VAT'],
        //             'tcp_duplex' => $row['TCP_DUPLEX'],
        //             'discount' => $row['DISCOUNT'],
        //             'ntcp' => $row['NTCP'],
        //             'image' => $row['IMAGE'],
        //             // Map other columns as needed
        //         ]);
        // }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
