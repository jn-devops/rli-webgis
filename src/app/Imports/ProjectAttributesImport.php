<?php

namespace RLI\GIS\Imports;

use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Collection;
use App\Models\SpatialAgapeyaLot;
use Illuminate\Validation\Rule;

class ProjectAttributesImport implements ToModel, WithHeadingRow, WithUpserts
{
    public function model(array $row)
    {   
        return new SpatialAgapeyaLot([
            'status' => $row['status'],
            'code' => $row['property_c'],
            'floor_area' => $row['floor_area'],
            'lot_area' => $row['lot_area'],
            'type' => $row['type'],
            'orientation' => $row['orientatio'],
            'color' => $row['color'],
            'lot_price' => $row['lot_price'],
            'house_price' => $row['house_pric'],
            'premium' => $row['premium'],
            'vat' => $row['vat'],
            'tcp_duplex' => $row['tcp_duplex'],
            'discount' => $row['discount'],
            'ntcp' => $row['ntcp'],
            'image' => $row['image'],
            'sku' => $row['sku'],
        ]);
    }

    public function uniqueBy()
    {
        return 'code';
    }

}
