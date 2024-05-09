<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $map = null, string $sku = null)
    {   
        $request['map'] = $map;
        $request['sku'] = $sku;

        return view('map.map', compact('request'));
    }
}
