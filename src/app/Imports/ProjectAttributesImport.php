<?php

namespace RLI\GIS\Imports;

use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Concerns\ToModel;
use RLI\GIS\Models\ProjectAttributes;

class ProductSKUsSheetImport implements ToModel, WithHeadingRow, WithUpserts
{
    public function model(array $row): ProjectAttributes
    {
        return new ProjectAttributes([
            'project_information_id' => $row['project_information_id'],
            'property_code' => $row['property_code'],
            'sku' => $row['sku'] ?: 0 ,
            'lot_area' => $row['lot_area'],
            'floor_area' => $row['floor_area'],
            'unit_type_name' => $row['unit_type_name'],
            'unit_type_interior' => $row['unit_type_interior'] ?: 0 ,
            'house_color' => $row['house_color'],
            'number_of_ac' => $row['number_of_ac'] ?: 0 ,
            'number_of_bedroom' => $row['number_of_bedroom'] ?: 0 ,
            'number_of_bathroom' => $row['number_of_bathroom'],
            'tct_number' => $row['tct_number'],
            'technical_description' => $row['technical_description'],
            'tax_declaration_number' => $row['tax_declaration_number'],
            'base_lot_price' => $row['base_lot_price'],
            'house_model_price' => $row['house_model_price'],
            'total_selling_price' => $row['total_selling_price'],
            'total_contract_price' => $row['total_contract_price'],
            'images' => $row['images'],
        ]);
    }

}
