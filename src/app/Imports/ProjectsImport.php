<?php

namespace RLI\GIS\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductsImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new ProjectAttributesImport()
        ];
    }
}
