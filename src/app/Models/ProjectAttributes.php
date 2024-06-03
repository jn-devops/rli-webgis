<?php

namespace RLI\GIS\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAttributes extends Model
{
    use HasFactory;

    protected $fillable = ['project_information_id', 'property_code', 'sku', 'lot_area', 'floor_area', 'unit_type_name', 'unit_type_interior', 'house_color', 'number_of_ac', 'number_of_bedroom', 'number_of_bathroom', 'tct_number', 'technical_description', 'tax_declaration_number', 'base_lot_price', 'house_model_price', 'total_selling_price', 'total_contract_price', 'images'];

}