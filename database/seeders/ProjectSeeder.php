<?php

namespace Database\Seeders;

use RLI\GIS\Actions\UploadProjectAttributesAction;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        tap(documents_path('project_seeder.xlsx'), function ($path) {
            if (file_exists($path)) UploadProjectAttributesAction::run($path);
        });
    }
}
