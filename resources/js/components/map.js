import Map from "ol/Map.js";
import View from "ol/View.js";
import {
    Tile as TileLayer
} from 'ol/layer.js';
import OSM from "ol/source/OSM.js";
import Overlay from "ol/Overlay.js";
import TileWMS from 'ol/source/TileWMS.js';
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import {
    Icon,
    Style,
} from "ol/style.js";
import {
    Draw,
} from "ol/interaction.js";

document.addEventListener("alpine:init", () => {
    Alpine.data("map", function () {
        return {
            legendOpened: false,
            map: {},
            activeTab: 'legend',
            monumentsLayer: {},
            draw: {},
            source: new VectorSource({}),
            mode: 'view',
            initComponent() {
                this.$watch('activeTab', (value) => {
                    this.stopDrawMonument()
                })

                this.draw = new Draw({
                    source: this.source,
                    type: 'Point',
                });

                // let monumentsLayer = new TileLayer({
                //     source: new TileWMS({
                //         url: GEOSERVER_URL + '/wms',
                //         params: {
                //             'LAYERS': GEOSERVER_WORKSPACE + ':monuments',
                //             'TILED': true
                //         },
                //         serverType: 'geoserver',
                //     }),
                //     label: 'Monuments',
                // });

                // let worldAdministrativeBoundariesLayer = new TileLayer({
                //     source: new TileWMS({
                //         url: GEOSERVER_URL + '/wms',
                //         params: {
                //             'LAYERS': GEOSERVER_WORKSPACE + ':world-administrative-boundaries',
                //             'TILED': true
                //         },
                //         serverType: 'geoserver',
                //     }),
                //     label: 'World Administrative Boundaries',
                // });

                let worldRiversLayer = new TileLayer({
                    source: new TileWMS({
                        url: GEOSERVER_URL + '/wms',
                        params: {
                            'LAYERS': GEOSERVER_WORKSPACE + ':world-rivers',
                            'TILED': true
                        },
                        serverType: 'geoserver',
                    }),
                    label: 'World Rivers',
                });

                this.projectAgapeyaLayer = new TileLayer({
                    source: new TileWMS({
                        url: GEOSERVER_URL + '/wms',
                        params: {
                            'LAYERS': GEOSERVER_WORKSPACE + ':spatial_agapeya_lot',
                            'TILED': true
                        },
                        serverType: 'geoserver',
                    }),
                    label: 'Project Agapeya',
                });

                let drawLayer = new VectorLayer({
                    source: this.source,
                    style: new Style({
                        image: new Icon({
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: '/img/location-marker.png',
                        }),
                    }),
                })

                this.map = new Map({
                    target: this.$refs.map,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                            label: 'OpenStreetMap',
                        }),
                        // worldAdministrativeBoundariesLayer,
                        // worldRiversLayer,
                        this.projectAgapeyaLayer,
                        // monumentsLayer,
                        drawLayer
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        // center: [-78.2161, -0.7022],
                        // zoom: 8,
                        center: [121.099711, 14.194851],
                        zoom: 17,
                    }),
                    overlays: [
                        new Overlay({
                            id: 'info',
                            element: this.$refs.popup,
                            stopEvent: true,
                        }),
                    ],
                });

                // this.map.on("singleclick", (event) => {
                //     if (event.dragging) {
                //         return;
                //     }

                //     let overlay = this.map.getOverlayById('info')
                //     overlay.setPosition(undefined)
                //     this.$refs.popupContent.innerHTML = ''

                //     const viewResolution = /** @type {number} */ (event.map.getView().getResolution())

                //     const url = this.monumentsLayer.getSource().getFeatureInfoUrl(
                //         event.coordinate,
                //         viewResolution,
                //         'EPSG:4326', {
                //             'INFO_FORMAT': 'application/json'
                //         })

                //     if (url) {
                //         fetch(url)
                //             .then((response) => response.json())
                //             .then((json) => {
                //                 if (json.features.length > 0) {
                //                     this.gotoMonument(json.features[0])
                //                 }
                //             });
                //     }

                // });

                this.map.on("singleclick", (event) => {
                    if (event.dragging) {
                        return;
                    }

                    let overlay = this.map.getOverlayById('info')
                    overlay.setPosition(undefined)
                    this.$refs.popupContent.innerHTML = ''

                    const viewResolution = /** @type {number} */ (event.map.getView().getResolution())

                    const url = this.projectAgapeyaLayer.getSource().getFeatureInfoUrl(
                        event.coordinate,
                        viewResolution,
                        'EPSG:4326', {
                            'INFO_FORMAT': 'application/json'
                        })

                    console.log(url);

                    if (url) {
                        fetch(url)
                            .then((response) => response.json())
                            .then((json) => {
                                if (json.features.length > 0) {
                                    this.gotoAgapeya(json.features[0])
                                }
                            });
                    }

                });

            },
            closePopup() {
                let overlay = this.map.getOverlayById('info')
                overlay.setPosition(undefined)
                this.$refs.popupContent.innerHTML = ''
            },
            gotoMonument(jsonFeature) {
                this.stopDrawMonument()

                this.map.getView().animate({
                    center: jsonFeature.geometry.coordinates,
                    zoom: 15,
                    duration: 500,
                });

                let content =
                    '<h4 class="text-gray-500 font-bold">' +
                    jsonFeature.properties.name +
                    '</h4>'

                let image = jsonFeature.properties.image || '/img/placeholder-image.png'
                content +=
                    '<img src="' +
                    image +
                    '" class="mt-2 w-full max-h-[200px] rounded-md shadow-md object-contain overflow-clip">'

                this.$refs.popupContent.innerHTML = content

                this.monumentsLayer.getSource().updateParams({
                    'TIMESTAMP': Date.now()
                })

                setTimeout(() => {
                    this.map.getOverlayById('info').setPosition(
                        jsonFeature.geometry.coordinates
                    );
                }, 500)
            },
            gotoAgapeya(jsonFeature) {
                // Assuming jsonFeature is an object containing the JSON data
                const coordinates = jsonFeature.geometry.coordinates[0][0][0]; // Accessing the coordinates

                // this.stopDrawMonument()
                this.map.getView().animate({
                    center: coordinates,
                    zoom: 20,
                    duration: 500,
                });

                let content = '';
                // let content = '<h4 class="text-gray-500 font-bold">' + jsonFeature.properties.property_code + '</h4>'

                // let image = jsonFeature.properties.image || '/img/placeholder-image.png'
                // content += '<img src="' + image + '" class="mt-2 w-full max-h-[200px] rounded-md shadow-md object-contain overflow-clip">'

                // content += '<ul>';
                // content += '<li>SKU : ' + jsonFeature.properties.sku + '</li>';
                // content += '<li>Block : ' + jsonFeature.properties.block + '</li>';
                // content += '<li>Lot : ' + jsonFeature.properties.lot + '</li>';
                // content += '<li>Lot Area : ' + jsonFeature.properties.lot_area + '</li>';
                // content += '<li>Floor Area : ' + jsonFeature.properties.floor_area + '</li>';

                // if (jsonFeature.properties.status === '1') {
                //     content += '<li>Status : Available <br> </li>';
                // } else {
                //     content += '<li>Status : Not Available</li>';
                // }

                // content += '<li>Color : ' + jsonFeature.properties.color + '</li>';
                // content += '<li>Selling Price : ' + jsonFeature.properties.ntcp + '</li>';
                // content += '<li><a href="reserve_link">Reserve this property</a></li>';
                // content += '</ul>';

                // Return the availability message
                // return availability_message;

                this.$refs.popupContent.innerHTML = content

                // // this.projectAgapeyaLayer.getSource().updateParams({
                // //     'TIMESTAMP': Date.now()
                // // })

                setTimeout(() => {
                    this.map.getOverlayById('info').setPosition(
                        coordinates
                    );
                }, 500)
            },
            hasLegend(layer) {
                return layer.getSource() instanceof TileWMS
            },
            legendUrl(layer) {
                if (this.hasLegend(layer)) {
                    return layer
                        .getSource()
                        .getLegendUrl(this.map.getView().getResolution(), {
                            LEGEND_OPTIONS: 'forceLabels:on'
                        })
                }
            },
            startDrawMonument() {
                this.mode = "draw"

                this.draw.on("drawend", (e) => {
                    this.source.clear();
                });

                this.source.on("change", (e) => {
                    const features = this.source.getFeatures()

                    if (features.length === 1) {
                        const coordinates = features[0].getGeometry().getCoordinates()

                        this.$wire.set('coordinates', coordinates)

                        this.map.getView().animate({
                            center: coordinates,
                            duration: 500,
                        });
                    }
                });

                this.map.addInteraction(this.draw);
            },
            stopDrawMonument() {
                this.source.clear();

                this.map.removeInteraction(this.draw);

                this.mode = "view";
            }
        };
    });
});