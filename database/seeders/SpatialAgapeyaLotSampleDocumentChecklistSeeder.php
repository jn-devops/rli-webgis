<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpatialAgapeyaLotSampleDocumentChecklistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Define the JSON value
        $jsonValue = json_encode([
            [
                'document_name' => 'Document 1',
                'url' => 'http://example.com/document1.pdf'
            ],
            [
                'document_name' => 'Document 2',
                'url' => 'http://example.com/document2.pdf'
            ]
        ]);

        // Insert the sample JSON value into the `new_json_field` for a specific record
        // Assume the record with ID 1 exists
        DB::table('spatial_agapeya_lot')->update(['document_checklist' => $jsonValue]);
    }
}
