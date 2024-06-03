<?php

namespace Database\Seeders;

use RLI\GIS\Actions\UploadAgapeyaAttributesAction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AgapeyaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        tap(documents_path('Agapeya.xlsx'), function ($path) {
            if (file_exists($path)) UploadAgapeyaAttributesAction::run($path);
        });
    }
}