<?php

namespace RLI\GIS\Actions;

use Lorisleiva\Actions\Concerns\AsAction;
use RLI\GIS\Imports\ProductsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Console\Command;

class UploadProjectAttributesAction
{
    use AsAction;

    public string $commandSignature = 'upload:products {path}';
    public string $commandDescription = 'Import Project Attributes from an Excel file';
    public string $commandHelp = 'This command will upsert the records in the project attributes table';
    public function handle(string $path): void
    {
        Excel::import(new ProductsImport, $path);
    }

    public function asCommand(Command $command): void
    {
        $path = $command->argument('path');
        $this->handle($path);

        $command->info('Done!');
    }
}
