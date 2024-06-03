<?php

namespace RLI\GIS\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProjectsImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new ProjectAttributesImport()
        ];
    }
}
