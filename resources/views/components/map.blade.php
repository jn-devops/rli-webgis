<div x-data="map()" x-init="initComponent()">
    <div x-ref="map" class="relative h-[675px] overflow-clip rounded-md border border-slate-300 shadow-lg">
        <div class="absolute top-2 right-8 z-10 rounded-md bg-white bg-opacity-75">
            <div class="ol-unselectable ol-control">
                <button @click="goToDefaultExtent" title="Open/Close details"
                    class="absolute inset-0 flex items-center justify-center">
                    <!-- Heroicon name: outline/globe -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pl-0.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
        
         <!-- Dropdown for selecting map layers -->
        <div class="absolute top-1 left-9 z-10 rounded-md bg-white bg-opacity-75 p-2">
            <select id="layer-select" class="form-select">
                <option value="agapeya">AGAPEYA</option>
                <option value="pvmp">PVMP</option>
                <option value="pvmp2">PVMP2</option>
                <option value="phhilaga">PHHILAGA</option>
                <option value="ppsn">PPSN</option>
                <option value="phmp">PHMP</option>
                <option value="phem">PHEM</option>
                <option value="ppmp">PPMP</option>
                <option value="pvsn">PVSN</option>
                <option value="phsn">PSHN</option>
                <option value="ppem">PPEM</option>
            </select>
        </div>
        
        <div x-cloak x-ref="popup" class="ol-popup ol-control transition">
            <div class="m-0.5 rounded-md bg-white p-2">
                <div class="flex justify-between">
                    <h4 class="font-bold">PROPERTY DETAILS</h4>
                    <a href="#" title="Close" x-on:click.prevent="closePopup"
                        class="-mt-1 font-black text-slate-400 transition hover:text-slate-600 focus:text-slate-600 focus:outline-none">&times;</a>
                </div>
                <div x-ref="popupContent" class="mt-2 min-h-[200px] overflow-y-auto"></div>
            </div>
        </div>
    </div>
</div>

@once
    @push('styles')
        @vite(['resources/css/components/map.css'])
    @endpush
    @push('scripts')
        @vite(['resources/js/components/map.js'])
    @endpush
@endonce