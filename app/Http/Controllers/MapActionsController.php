<?php

namespace App\Http\Controllers;

use App\Models\SpatialAgapeyaLot;
use Illuminate\Http\Request;


class MapActionsController extends Controller
{
   public function updateStatus($property_code)
    {
        // Find the record by property_code
        $lot = SpatialAgapeyaLot::where('property_c', $property_code)->first();

        if (!$lot) {
            return response()->json(['message' => 'Lot not found'], 404);
        }

        // Update the status to 0
        $lot->status = 0;
        $lot->save();

        return response()->json(['message' => 'Lot status updated successfully'], 200);
    }
}