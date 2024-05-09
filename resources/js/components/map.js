import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import TileWMS from 'ol/source/TileWMS.js';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM.js";
import { Style, Fill, Stroke, Circle, Text } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from "ol/Overlay.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";

document.addEventListener("alpine:init", () => {
    Alpine.data("map", function () {
        return {
            legendOpened: false,
            map: {},
            // activeTab: 'legend',
            // monumentsLayer: {},
            // draw: {},
            // source: new VectorSource({}),
            // mode: 'view',
            initComponent() {

                let paramsObj = {
                    servive: "WFS",
                    version: "2.0.0",
                    request: "GetFeature",
                    outputFormat: "application/json",
                    crs: "EPSG:4326",
                    srsName: "EPSG:4326",
                };

                var centerCoordinates = [121.099711, 14.194851];
                var projectLayerName = "spatial_agapeya_lot";
                var projectRasterName = "";

                if (mapData.map == "agapeya") {
                    var centerCoordinates = [121.099711, 14.194851];
                    var projectLayerName = "spatial_agapeya_lot";
                    var projectRasterName = "";
                } else if (mapData.map == "pvmp") {
                    var centerCoordinates = [120.645900, 15.239243];
                    var projectLayerName = "spatial_pvmp_lot";
                    var projectRasterName = "rli_raster_pvmp";

                } else if (mapData.map == "pvmp2") {
                    var centerCoordinates = [120.645900, 15.239243];
                    var projectLayerName = "spatial_pvmp2_lot";
                    var projectRasterName = "rli_raster_pvmp";
                    
                } else if (mapData.map == "phhilaga") {
                    var centerCoordinates = [120.809000, 14.330000];
                    var projectLayerName = "spatial_pvmp2_lot";
                    var projectRasterName = "rli_raster_phhilaga";
                } else if (mapData.map == "ppsn") {
                    var centerCoordinates = [120.7426265, 14.2990959];
                    var projectLayerName = "spatial_ppsn_lot";
                    var projectRasterName = "";
                } else if (mapData.map == "phmp") {
                    var centerCoordinates = [120.6572879, 15.2451355];
                    var projectLayerName = "spatial_phmp_lot";
                    var projectRasterName = "";
                }  else if (mapData.map == "phem") {
                    var centerCoordinates = [121.0027518, 14.8227769];
                    var projectLayerName = "spatial_phem_lot";
                    var projectRasterName = "";
                } 

                // 14.328204270996462, 120.80735613394836

                // this.$watch('activeTab', (value) => {
                //     this.stopDrawMonument()
                // })

                // this.draw = new Draw({
                //     source: this.source,
                //     type: 'Point',
                // });

                this.projectRaster = new TileLayer({
                    source: new TileWMS({
                        url: GEOSERVER_URL + '/wms',
                        params: {
                            'LAYERS': GEOSERVER_WORKSPACE + ':' + projectRasterName,
                            'TILED': true
                        },
                        serverType: 'geoserver',
                    }),
                    label: 'Raster File',
                });

                // this.projectLayer = new TileLayer({
                //     source: new TileWMS({
                //         url: GEOSERVER_URL + '/wms',
                //         params: {
                //             'LAYERS': GEOSERVER_WORKSPACE + ':' + projectLayerName,
                //             'TILED': true
                //         },
                //         serverType: 'geoserver',
                //     }),
                //     label: 'Raster File'
                // });

                this.projectLayer = new VectorLayer({
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: (extent) => {
                            paramsObj.typeName = GEOSERVER_WORKSPACE + ':' + projectLayerName;
                            paramsObj.bbox = extent.join(",") + ",EPSG:4326";
                            let urlParams = new URLSearchParams(paramsObj);
                            return GEOSERVER_URL + '/wfs?' + urlParams.toString();
                        },
                        strategy: bboxStrategy,
                    }),
                    style: this.defaultStyleProject,
                    label: 'World Rivers',
                });

                this.map = new Map({
                    target: this.$refs.map,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                            label: 'OpenStreetMap',
                        }),
                        this.projectRaster,
                        this.projectLayer,
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: centerCoordinates,
                        zoom: 18,
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

                //     const url = this.projectLayer.getSource().getFeatureInfoUrl(
                //         event.coordinate,
                //         viewResolution,
                //         'EPSG:4326', {
                //             'INFO_FORMAT': 'application/json'
                //         })

                //     console.log(url);

                //     if (url) {
                //         fetch(url)
                //             .then((response) => response.json())
                //             .then((json) => {
                //                 if (json.features.length > 0) {
                //                     this.gotoPolygon(json.features[0])
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

                    this.map.forEachFeatureAtPixel(
                        event.pixel,
                        (feature, layer) => {
                            this.gotoFeature(feature)
                            return
                        },
                        {
                            hitTolerance: 5,
                        }
                    );
                });

            },
            closePopup() {
                let overlay = this.map.getOverlayById('info')
                overlay.setPosition(undefined)
                this.$refs.popupContent.innerHTML = ''
            },
            gotoPolygon(jsonFeature) {
                // Assuming jsonFeature is an object containing the JSON data
                const coordinates = jsonFeature.geometry.coordinates[0][0][0]; // Accessing the coordinates

                this.map.getView().animate({
                    center: coordinates,
                    zoom: 20,
                    duration: 500,
                });


                let content = '<h4 class="text-gray-500 font-bold">' + jsonFeature.properties.property_c + '</h4>'

                let image = jsonFeature.properties.image || '/img/placeholder-image.png'
                content += '<img src="' + image + '" class="mt-2 w-full max-h-[200px] rounded-md shadow-md  overflow-clip">'

                content += '<ul>';
                content += '<li>SKU : ' + jsonFeature.properties.sku + '</li>';
                content += '<li>Block : ' + jsonFeature.properties.block + '</li>';
                content += '<li>Lot : ' + jsonFeature.properties.lot + '</li>';
                content += '<li>Lot Area : ' + jsonFeature.properties.lot_area + '</li>';
                content += '<li>Floor Area : ' + jsonFeature.properties.floor_area + '</li>';

                if (jsonFeature.properties.status === '1') {
                    content += '<li>Status : Available <br> </li>';
                } else {
                    content += '<li>Status : Not Available</li>';
                }

                content += '<li>Selling Price : ' + jsonFeature.properties.ntcp + '</li>';
                content += '<li><a href="reserve_link">Reserve this property</a></li>';
                content += '</ul>';


                this.$refs.popupContent.innerHTML = content

                setTimeout(() => {
                    this.map.getOverlayById('info').setPosition(
                        coordinates
                    );
                }, 500)
            },
            gotoFeature(feature) {

                let overlay = this.map.getOverlayById('info')
                overlay.setPosition(undefined)

                // Get the geometry of the feature
                var multiPolygonGeometry = feature.getGeometry();

                // Check if it's a MultiPolygon
                if (multiPolygonGeometry.getType() === 'MultiPolygon') {

                    // Get the coordinates of the MultiPolygon
                    var coordinates = multiPolygonGeometry.getCoordinates();

                    // Calculate the centroid
                    var centroid = calculateCentroid(coordinates);

                }

                // Function to calculate centroid of a MultiPolygon
                function calculateCentroid(coordinates) {
                    var totalX = 0;
                    var totalY = 0;
                    var totalPoints = 0;

                    // Iterate through each polygon
                    for (var i = 0; i < coordinates.length; i++) {
                        var polygonCoords = coordinates[i][0]; // Assuming the exterior ring is the first one
                        // Iterate through each coordinate in the polygon
                        for (var j = 0; j < polygonCoords.length; j++) {
                            var point = polygonCoords[j];
                            totalX += point[0];
                            totalY += point[1];
                            totalPoints++;
                        }
                    }

                    // Calculate the average of X and Y coordinates
                    var centroidX = totalX / totalPoints;
                    var centroidY = totalY / totalPoints;

                    return [centroidX, centroidY];
                }

                // const coordinates = feature.geometry.coordinates[0][0][0]; // Accessing the coordinates
                this.map.getView().animate({
                    center: centroid,
                    zoom: 20,
                    duration: 500,
                });

                // let content =
                //     '<h4 class="text-gray-500 font-bold">' +
                //     feature.get('property_c') +
                //     '</h4>'

                // content +=
                //     '<img src="' +
                //     feature.get('image') +
                //     '" class="mt-2 w-full max-h-[200px] rounded-md shadow-md object-contain overflow-clip">'

                let content = '<h4 class="text-gray-500 font-bold">' +  feature.get('property_c') + '</h4>'

                let image = feature.get('image') || '/img/placeholder-image.png'
                content += '<img src="' + image + '" class="mt-2 w-full max-h-[200px] rounded-md shadow-md  overflow-clip">'

                content += '<ul>';
                content += '<li>SKU : ' + feature.get('sku') + '</li>';
                content += '<li>Block : ' + feature.get('block')  + '</li>';
                content += '<li>Lot : ' + feature.get('lot')  + '</li>';
                content += '<li>Lot Area : ' + feature.get('lot_area')  + '</li>';
                content += '<li>Floor Area : ' + feature.get('floor_area')  + '</li>';

                if (feature.get('status') === '1') {
                    content += '<li>Status : Available <br> </li>';
                } else {
                    content += '<li>Status : Not Available</li>';
                }

                content += '<li>Selling Price : ' + feature.get('ntcp') + '</li>';
                content += '<li><a target="_self" href="' + BOOKING_URL + '/edit-order/' + mapData.sku + '/' + feature.get('property_c') +' /'+ feature.get('property_c') +'">SELECT THIS PROPERTY</a></b></li>';
                content += '</ul>';


                this.$refs.popupContent.innerHTML = content

                // var mapSize = this.map.getSize();
                // var pixelCoordinates = [mapSize[0] - 20, 20];
                // alert(pixelCoordinates)

                setTimeout(() => {
                    overlay.setPosition(
                        centroid
                    );
                }, 500)
            },
            defaultStyleProject(feature, resolution) {
                let text;
                let width = 2;
                
                // if(resolution < 0.002){
                    text = new Text({
                        font: "20px serif",
                        text: feature.get("property_c"),
                        fill: new Fill({
                            color: "rgba(0, 0, 255, 1)",
                        }),
                    });

                    width = 4;
                // }

                // Get the value of the "color" field from the feature's properties
                var colorValue = feature.get('color');
                // Define default style
                var defaultStyle = new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.4)' // Default fill color
                    }),
                    stroke: new Stroke({
                        color: '#3399CC', // Default stroke color
                        width: 1
                    })
                });

                // Define style based on the color value
                if (mapData.sku) {
                    var skuValue = feature.get('sku');
                    if (mapData.sku == skuValue) {
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(0, 128, 0)',
                            }),
                            stroke: new Stroke({
                                color: '#FF0000', 
                                width: 1
                            }),
                            text: text,
                        });
                    } else {
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(128, 128, 128)',
                            }),
                            stroke: new Stroke({
                                color: '#FF0000', 
                                width: 1
                            }),
                            text: text,
                        });
                    }

                } else {
                    if (colorValue) {
                        return new Style({
                            fill: new Fill({
                                color: colorValue,
                                opacity : '0.4' 
                            }),
                            stroke: new Stroke({
                                color: '#FF0000', 
                                width: 1
                            }),
                            text: text,
                        });
                    } else  {
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(255, 0, 0, 0.4)'
                            }),
                            stroke: new Stroke({
                                color: '#0000FF', 
                                width: 1
                            }),
                            text: text,
                        });
                    }
                }
                
                
                // 'red': 'rgba(255, 0, 0, 0.4)',
                // 'blue': 'rgba(0, 0, 255, 0.4)',
                // 'yellow': 'rgba(255, 255, 0, 0.4)',
                // 'pink': 'rgba(255, 192, 203, 0.4)',
                // 'green': 'rgba(0, 128, 0, 0.4)',
                // 'purple': 'rgba(128, 0, 128, 0.4)'

                // Return default style if no specific color matches
                return defaultStyle;
            },
            goToDefaultExtent() {
                // Get the default extent coordinates based on the map data
                let defaultExtentCoordinates;
                if (mapData.map == "agapeya") {
                    defaultExtentCoordinates = [121.099711, 14.194851];
                } else if (mapData.map == "pvmp" || mapData.map == "pvmp2") {
                    defaultExtentCoordinates = [120.645900, 15.239243];
                } else if (mapData.map == "phhilaga") {
                    defaultExtentCoordinates = [120.809000, 14.330000];
                }

                // Set the map view to the default extent coordinates
                this.map.getView().animate({
                    center: defaultExtentCoordinates,
                    zoom: 17,
                    duration: 500,
                });
                closePopup()
            },

            // hasLegend(layer) {
            //     return layer.getSource() instanceof TileWMS
            // },
            // legendUrl(layer) {
            //     if (this.hasLegend(layer)) {
            //         return layer
            //             .getSource()
            //             .getLegendUrl(this.map.getView().getResolution(), {
            //                 LEGEND_OPTIONS: 'forceLabels:on'
            //             })
            //     }
            // }
        };
    });
});