<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpatialAgapeyaLot extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'spatial_agapeya_lot';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'property_c',
        'status',
        'floor_area',
        'lot_area',
        'type',
        'orientation',
        'color',
        'sku',
        'lot_price',
        'house_price',
        'premium',
        'vat',
        'tcp_duplex',
        'discount',
        'ntcp',
        'image',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        // You can define casting for specific attributes if needed
    ];
}
