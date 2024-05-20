<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $map = null, string $sku = null, string $voucher = null, string $order = null)
    {   
        $request['map'] = $map;
        $request['sku'] = $sku;
        $request['voucher'] = $voucher;
        $request['order'] = $order;


        return view('map.map', compact('request'));
    }
}
