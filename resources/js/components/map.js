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
                var blockLayerName = "";

                if (mapData.map == "agapeya") {
                    var centerCoordinates = [121.099711, 14.194851];
                    var projectLayerName = "spatial_agapeya_lot";
                    var blockLayerName = "spatial_agapeya_block";
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
                    var centerCoordinates = [120.8089878, 14.3298647];
                    var projectLayerName = "spatial_phh1_lot";
                    var projectRasterName = "rli_raster_phhilaga";
                } else if (mapData.map == "ppsn") {
                    var centerCoordinates = [120.7426265, 14.2990959];
                    var projectLayerName = "spatial_ppsn_lot";
                    var projectRasterName = "";
                } else if (mapData.map == "phmp") {
                    var centerCoordinates = [120.6572879, 15.2451355];
                    var projectLayerName = "spatial_phmp_lot";
                    var projectRasterName = "rli_raster_ppmp_phmp";
                }  else if (mapData.map == "phem") {
                    var centerCoordinates = [121.0027518, 14.8227769];
                    var projectLayerName = "spatial_phem_lot";
                    var projectRasterName = "";
                } 
                
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
                    label: 'Project Layer',
                });


                // this.blockLayer = "";
                // if (blockLayerName) {
                    this.blockLayer = new VectorLayer({
                        source: new VectorSource({
                            format: new GeoJSON(),
                            url: (extent) => {
                                paramsObj.typeName = GEOSERVER_WORKSPACE + ':' + blockLayerName;
                                paramsObj.bbox = extent.join(",") + ",EPSG:4326";
                                let urlParams = new URLSearchParams(paramsObj);
                                return GEOSERVER_URL + '/wfs?' + urlParams.toString();
                            },
                            strategy: bboxStrategy,
                        }),
                        style: this.defaultStyleBlock,
                        label: 'Block Layer',
                    });
                // }

                // this.projectRaster = "";

                // if (projectRasterName) {
                    this.projectRaster = new TileLayer({
                        source: new TileWMS({
                            url: GEOSERVER_URL + '/wms',
                            params: {
                                'LAYERS': GEOSERVER_WORKSPACE + ':' + projectRasterName,
                                'TILED': true
                            },
                            serverType: 'geoserver',
                        }),
                        label: 'Raster Layer',
                    });
                // }

                this.map = new Map({
                    target: this.$refs.map,
                    layers: [
                         new TileLayer({
                            source: new OSM(),
                            label: 'OpenStreetMap',
                        }),
                        this.projectLayer,
                        this.blockLayer,
                        this.projectRaster,
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

                let previousFeature = null;

                // Assuming `topLayer` is defined and references the topmost layer
                const topLayer = this.map.getLayers().getArray()[1]; // Adjust the index if necessary

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

                            // Reset the style of the previously selected feature
                            if (previousFeature) {
                                previousFeature.setStyle(this.defaultStyleProject);
                            }

                            feature.setStyle(this.createSelectedStyle);

                            // Update the reference to the currently selected feature
                            previousFeature = feature;

                            return true;  // Stop iteration after the first feature is found

                        },
                        {
                            hitTolerance: 5,
                            layerFilter: function (layer) {
                                return layer === topLayer;
                            }
                        }
                    );
                });

            },
            closePopup() {
                let overlay = this.map.getOverlayById('info')
                overlay.setPosition(undefined)
                this.$refs.popupContent.innerHTML = ''
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
                content += '<img src="' + image + '" class="mt-2 w-1/2 max-h-[200px] rounded-md shadow-md  overflow-clip">'

                content += '<table border="1" style="border-collapse: collapse; width: 100%;" class="text-sm">';
                content += '<tr><td>SKU: ' + feature.get('sku') + '</td></tr>';
                content += '<tr><td>Block: ' + feature.get('block') + ' Lot:  ' + feature.get('lot') + '</td></tr>';
                content += '<tr><td>Lot & Floor Area: ' + feature.get('lot_area') +' sqm & '+ feature.get('floor_area') + ' sqm </td></tr>';

                if (feature.get('status') == '1') {
                    content += '<tr><td>Status: Available</td></tr>';
                } else {
                    content += '<tr><td>Status: Not Available</td></tr>';
                }

                // Assuming the selling price needs to be formatted to USD
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(feature.get('ntcp'));

                content += '<tr><td>Selling Price: ' + formattedPrice + '</td></tr>';

                if ( ( feature.get('status') == '1') &&  ( feature.get('sku') == mapData.sku ) ) {
                    content += '<tr><td><a class="cool-button" target="_self" href="' + BOOKING_URL + '/edit-order/' + mapData.voucher + '/' + mapData.order + '/' + feature.get('property_c') + '">SELECT THIS PROPERTY</a></td></tr>';
                }

               
                content += '</table>';


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
                var lotValue = String(feature.get('lot'));
                
                // alert(resolution);
                // 0.000005364418029785156
                // if(resolution < 0.002){
                    // text = new Text({
                    //     font: "20px serif",
                    //     text: lotValue,
                    //     fill: new Fill({
                    //         color: "rgba(0, 0, 255, 1)",
                    //     }),
                    // });

                    // width = 4;
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

                    if ((mapData.sku == skuValue) && ( feature.get('status') == '1')){
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(0, 128, 0)',
                            }),
                            stroke: new Stroke({
                                color: '#FF0000', 
                                width: 1
                            }),
                             text: new Text({
                                font: "10px serif bold",
                                text: lotValue,
                                fill: new Fill({
                                    color: "rgba(32, 32, 32, 1)",
                                }),
                            }),
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
                            text: new Text({
                                font: "10px serif bold",
                                text: lotValue,
                                fill: new Fill({
                                    color: "rgba(32, 32, 32, 1)",
                                }),
                            }),
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
                             text: new Text({
                                font: "10px serif bold",
                                text: lotValue,
                                fill: new Fill({
                                    color: "rgba(32, 32, 32, 1)",
                                }),
                            }),
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
                             text: new Text({
                                font: "10px serif bold",
                                text: lotValue,
                                fill: new Fill({
                                    color: "rgba(32, 32, 32, 1)",
                                }),
                            }),
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
            defaultStyleBlock(feature, resolution) {
                let text;
                let width = 2;
                var blockValue = String(feature.get('block'));
                
                // Get the value of the "color" field from the feature's properties
                var colorValue = feature.get('color');
                // Define default style
                var defaultStyle = new Style({
                    stroke: new Stroke({
                        color: '#FF0000', // Default stroke color
                        width: 1
                    }),
                    text: new Text({
                        font: "32px serif bold",
                        text: blockValue,
                        fill: new Fill({
                            color: "blue",
                        }),
                        backgroundFill: new Fill({
                            color: "rgba(255, 255, 255, 0.5)",
                        }),
                        padding: [2, 2, 2, 2]
                    }),
                });

                // Return default style if no specific color matches
                return defaultStyle;
            },
            createSelectedStyle(feature, resolution) {
                var lotValue = String(feature.get('lot'));

                return new Style({
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.6)'  // Red color with some transparency
                    }),
                    stroke: new Stroke({
                        color: '#ff0000',
                        width: 2
                    }),
                    text: new Text({
                        font: "10px serif bold",
                        text: lotValue,
                        fill: new Fill({
                            color: "blue",
                        }),
                    }),
                });
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