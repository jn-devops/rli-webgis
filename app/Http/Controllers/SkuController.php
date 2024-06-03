<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SkuController extends Controller
{
    public function getSkuDetails(Request $request)
    {
        $sku = $request->input('sku');

        // Validate the SKU parameter
        if (empty($sku)) {
            return response()->json(['message' => 'SKU is required'], 400);
        }

        // Query to get the property_code of the matched SKU
        $record = DB::table('spatial_agapeya_lot')
                    ->where('sku', $sku)
                    ->where('status', 1)
                    ->select('property_c')
                    ->first();

        // If no record found, return a 404 response
        if (!$record) {
            return response()->json(['message' => 'SKU not found'], 404);
        }

        // Query to get the total count of records with the same SKU
        $totalCount = DB::table('spatial_agapeya_lot')
                        ->where('sku', $sku)
                        ->count();

        // Prepare the response data
        $response = [
            'property_code' => $record->property_c,
            'total_count' => $totalCount
        ];

        // Return the response as JSON
        return response()->json($response);
    }
}