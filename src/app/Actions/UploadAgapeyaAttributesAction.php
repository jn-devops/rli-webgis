<?php

namespace RLI\GIS\Actions;

use Lorisleiva\Actions\Concerns\AsAction;
use RLI\GIS\Imports\ProjectsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Console\Command;

class UploadAgapeyaAttributesAction
{
    use AsAction;

    public string $commandSignature = 'upload:products {path}';
    public string $commandDescription = 'Import Agapeya Attributes from an Excel file';
    public string $commandHelp = 'This command will upsert the records in the agapeya attributes table';
    public function handle(string $path): void
    {
        Excel::import(new ProjectsImport, $path);
    }

    public function asCommand(Command $command): void
    {
        $path = $command->argument('path');
        $this->handle($path);

        $command->info('Done!');
    }
}
