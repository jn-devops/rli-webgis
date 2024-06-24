<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $sku = null)
    {   
        $request['sku'] = $sku;

        return view('video.video', compact('request'));
    }
}
