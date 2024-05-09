<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class AppLayout extends Component
{
    /**
     * Get the view / contents that represents the component.
     */
    public function render(): View
    {   
        return view('layouts.app', ['GEOSERVER_URL'=>env('GEOSERVER_URL'),'GEOSERVER_WORKSPACE'=>env('GEOSERVER_WORKSPACE'),'BOOKING_URL'=>env('BOOKING_URL')] );
    }
}
