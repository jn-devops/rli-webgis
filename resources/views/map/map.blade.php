<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight capitalize">
            Project {{ $request['map'] }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-12xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                <x-map :map="$request['map']" :sku="$request['sku']" />
            </div>
        </div>
    </div>
</x-app-layout>

 <script>
        var request = @json($request);
       
        const mapParam = request.map;
        const skuParam = request.sku;
        const voucherParam = request.voucher;
        const orderParam = request.order;

        const mapData = {
            map: mapParam,
            sku: skuParam,
            voucher: voucherParam,
            order: orderParam,
        };
        
        console.log(mapData); // Output the received data to the console
</script>

