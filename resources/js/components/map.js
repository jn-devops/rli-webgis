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
                var lotLayerName = "spatial_agm_lot";
                var projectRasterName = "";
                var blockLayerName = "spatial_agm_block";
                var phaseLayerName = "spatial_agm_phase";
                var projectLayerName = "spatial_agm_project";
                var cfLayerName = "spatial_agm_cf";

                if (mapData.map == "agapeya") {
                    var centerCoordinates = [121.099711, 14.194851];
                    var lotLayerName = "spatial_agm_lot";
                    var blockLayerName = "spatial_agm_block";
                    var phaseLayerName = "spatial_agm_phase";
                    var projectLayerName = "spatial_agm_project";
                    var cfLayerName = "";
                    var projectRasterName = "";
                } else if (mapData.map == "pvmp") {
                    var centerCoordinates = [120.645900, 15.239243];
                    var lotLayerName = "spatial_pvmp_lot";
                    var blockLayerName = "spatial_pvmp_block";
                    var phaseLayerName = "spatial_pvmp_phase";
                    var projectLayerName = "spatial_pvmp_project";
                    var cfLayerName = "spatial_pvmp_cf";
                    var projectRasterName = "rli_raster_pvmp";
                } else if (mapData.map == "pvmp2") {
                    var centerCoordinates = [120.645900, 15.239243];
                    var lotLayerName = "spatial_pvmp2_lot";
                    var blockLayerName = "spatial_pvmp2_block";
                    var phaseLayerName = "spatial_pvmp2_phase";
                    var projectLayerName = "spatial_pvmp2_project";
                    var cfLayerName = "spatial_pvmp2_cf";
                    var projectRasterName = "rli_raster_pvmp";
                } else if (mapData.map == "phhilaga") {
                    var centerCoordinates = [120.8089878, 14.3298647];
                    var lotLayerName = "spatial_phh1_lot";
                    var blockLayerName = "spatial_phh1_block";
                    var phaseLayerName = "spatial_phh1_phase";
                    var projectLayerName = "spatial_phh1_project";
                    var cfLayerName = "spatial_phh1_cf";
                    var projectRasterName = "rli_raster_phhilaga";
                } else if (mapData.map == "ppsn") {
                    var centerCoordinates = [120.7426265, 14.2990959];
                    var lotLayerName = "spatial_ppsn_lot";
                    var blockLayerName = "spatial_ppsn_block";
                    var phaseLayerName = "spatial_ppsn_phase";
                    var projectLayerName = "spatial_ppsn_project";
                    var cfLayerName = "spatial_ppsn_cf";
                    var projectRasterName = "";
                } else if (mapData.map == "phmp") {
                    var centerCoordinates = [120.6572879, 15.2451355];
                    var lotLayerName = "spatial_phmp_lot";
                    var blockLayerName = "spatial_phmp_block";
                    var phaseLayerName = "spatial_phmp_phase";
                    var projectLayerName = "spatial_phmp_project";
                    var cfLayerName = "spatial_phmp_cf";
                    var projectRasterName = "rli_raster_ppmp_phmp";
                } else if (mapData.map == "phem") {
                    var centerCoordinates = [121.0027518, 14.8227769];
                    var lotLayerName = "spatial_phem_lot";
                    var blockLayerName = "spatial_phem_block";
                    var phaseLayerName = "spatial_phem_phase";
                    var projectLayerName = "spatial_phem_project";
                    var cfLayerName = "spatial_phem_cf";
                    var projectRasterName = "";
                } else if (mapData.map == "ppmp") {
                    var centerCoordinates = [120.6587756, 15.2478576];
                    var lotLayerName = "spatial_ppmp_lot";
                    var blockLayerName = "spatial_ppmp_block";
                    var phaseLayerName = "spatial_ppmp_phase";
                    var projectLayerName = "spatial_ppmp_project";
                    var cfLayerName = "spatial_ppmp_cf";
                    var projectRasterName = "";
                } 
                
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

                this.cfLayer = new VectorLayer({
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: (extent) => {
                            paramsObj.typeName = GEOSERVER_WORKSPACE + ':' + cfLayerName;
                            paramsObj.bbox = extent.join(",") + ",EPSG:4326";
                            let urlParams = new URLSearchParams(paramsObj);
                            return GEOSERVER_URL + '/wfs?' + urlParams.toString();
                        },
                        strategy: bboxStrategy,
                    }),
                    style: this.defaultStyleCF,
                    label: 'CF Layer',
                });

                this.phaseLayer = new VectorLayer({
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: (extent) => {
                            paramsObj.typeName = GEOSERVER_WORKSPACE + ':' + phaseLayerName;
                            paramsObj.bbox = extent.join(",") + ",EPSG:4326";
                            let urlParams = new URLSearchParams(paramsObj);
                            return GEOSERVER_URL + '/wfs?' + urlParams.toString();
                        },
                        strategy: bboxStrategy,
                    }),
                    style: this.defaultStylePhase,
                    label: 'Phase Layer',
                });

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

                this.lotLayer = new VectorLayer({
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: (extent) => {
                            paramsObj.typeName = GEOSERVER_WORKSPACE + ':' + lotLayerName;
                            paramsObj.bbox = extent.join(",") + ",EPSG:4326";
                            let urlParams = new URLSearchParams(paramsObj);
                            return GEOSERVER_URL + '/wfs?' + urlParams.toString();
                        },
                        strategy: bboxStrategy,
                    }),
                    style: this.defaultStyleLot,
                    label: 'Lot Layer',
                });
                
                this.map = new Map({
                    target: this.$refs.map,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                            label: 'OpenStreetMap',
                        }),
                        this.projectRaster,
                        this.lotLayer,
                        this.cfLayer,
                        this.blockLayer,
                        this.phaseLayer,
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

                let previousFeature = null;

                // Assuming `topLayer` is defined and references the topmost layer
                const topLayer = this.map.getLayers().getArray()[2]; // Adjust the index if necessary

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

                            // console.log(layer.getProperties());

                            this.gotoFeature(feature)

                            // Reset the style of the previously selected feature
                            if (previousFeature) {
                                previousFeature.setStyle(this.defaultStyleLot);
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

                // Fetch the block attribute from the project feature
                var blockAttribute = feature.get('block');
                var phaseAttribute = String(feature.get('phase'));
                var projectAttribute = feature.get('project_co');

                console.log('project: ' + projectAttribute + ' phase: ' + phaseAttribute + ' block: '  + blockAttribute  );

                // Filter the block layer based on the block attribute
                const blockFeatures = this.blockLayer.getSource().getFeatures();
                const matchingBlockFeatures = blockFeatures.filter(feature => feature.get('block') === blockAttribute);
                const blockFeature = '';

                const phaseFeatures = this.phaseLayer.getSource().getFeatures();
                const matchingPhaseFeatures = phaseFeatures.filter(feature => feature.get('phase') === phaseAttribute);
                const phaseFeature = '';

                const projectFeatures = this.projectLayer.getSource().getFeatures();
                const matchingProjectFeatures = projectFeatures.filter(feature => feature.get('project_co') === projectAttribute);
                const projectFeature = '';

                var blockStatus = 0;
                var lotStatus = 0;
                var projectStatus = 0;

                if (matchingBlockFeatures.length > 0) {
                    const blockFeature = matchingBlockFeatures[0];
                    var blockStatus = blockFeature.get('status');
                    console.log('Matching block feature:', blockStatus);
                }

                if (matchingPhaseFeatures.length > 0) {
                    const phaseFeature = matchingPhaseFeatures[0];
                    var phaseStatus = phaseFeature.get('status');
                    console.log('Matching phase feature:', phaseStatus);
                }

                 if (matchingProjectFeatures.length > 0) {
                    const projectFeature = matchingProjectFeatures[0];
                    var projectStatus = projectFeature.get('status');
                    console.log('Matching project feature:', projectStatus);
                }
                

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

                this.map.getView().animate({
                    center: centroid,
                    zoom: 20,
                    duration: 500,
                });

                let content = '<h4 class="text-gray-500 font-bold">' +  feature.get('code') + '</h4>'

                // var imageUrl = feature.get('image') || '/img/placeholder-image.png';

                // this.checkImage(imageUrl, function(isValid) {
                //     if (isValid) {
                //         // Image is not broken, you can use it
                //         content += '<img src="' + imageUrl + '" class="mt-2 w-1/2 max-h-[200px] rounded-md shadow-md  overflow-clip">';
                //     } else {
                //         // Image is broken, use placeholder instead
                //         var placeholderUrl = '/img/placeholder-image.png';
                //         content += '<img src="' + placeholderUrl + '" class="mt-2 w-1/2 max-h-[200px] rounded-md shadow-md  overflow-clip">';
                //     }
                // });
                let image = feature.get('image') || '/img/placeholder-image.png'
                content += '<img src="' + image + '" class="mt-2 w-1/2 max-h-[200px] rounded-md shadow-md  overflow-clip">'

                content += '<table border="1" style="border-collapse: collapse; width: 100%;" class="text-sm">';
                content += '<tr><td>Block: ' + feature.get('block') + ' Lot: ' + feature.get('lot') + '</td></tr>';
                content += '<tr><td>Lot Area: ' + feature.get('lot_area') + ' sqm</td></tr>';
                content += '<tr><td>Floor Area: ' + feature.get('floor_area') + ' sqm</td></tr>';

                if ((feature.get('status') == '1') && (feature.get('sku') == mapData.sku) && (blockStatus == 1)  && (phaseStatus == 1)  && (projectStatus == 1) ) {
                    content += '<tr><td>Status: Available</td></tr>';
                } else {
                    content += '<tr><td>Status: Not Available</td></tr>';
                }

                // Assuming the selling price needs to be formatted to USD
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(feature.get('ntcp'));
                content += '<tr><td>Selling Price: ' + formattedPrice + '</td></tr>';
                
                // Document checklist section
                // let documentChecklist = feature.get('document_checklist');

                // if (documentChecklist) {
                //     try {
                //         documentChecklist = JSON.parse(documentChecklist);
                //     } catch (e) {
                //         console.error('Failed to parse document checklist JSON:', e);
                //         documentChecklist = null;
                //     }
                // }

                // if (documentChecklist && Array.isArray(documentChecklist) && documentChecklist.length > 0) {
                //     content += '<tr><td colspan="2">Document Checklist:</td></tr>';
                //     documentChecklist.forEach(document => {
                //         content += '<tr><td><a href="' + document.url + '" target="_blank">' + document.document_name + '</a></td></tr>';
                //     });
                // } else if (documentChecklist && typeof documentChecklist === 'object') {
                //     content += '<tr><td colspan="2">Document Checklist:</td></tr>';
                //     for (const key in documentChecklist) {
                //         if (documentChecklist.hasOwnProperty(key)) {
                //             const document = documentChecklist[key];
                //             content += '<tr><td><a href="' + document.url + '" target="_blank">' + document.document_name + '</a></td></tr>';
                //         }
                //     }
                // }

                console.log('project: ' + projectStatus + ' phase: ' + phaseStatus + ' block: '  + blockStatus  );

                if ((feature.get('status') == '1') && (feature.get('sku') == mapData.sku) && (blockStatus == 1)  && (phaseStatus == 1)  && (projectStatus == 1) ) {
                    content += '<tr><td><a class="cool-button" target="_self" href="' + BOOKING_URL + '/edit-order/' + mapData.voucher + '/' + mapData.order + '/' + feature.get('code') + '">SELECT THIS PROPERTY</a></td></tr>';
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
            defaultStyleLot(feature, resolution) {
                let text;
                let width = 2;
                var lotValue = String(feature.get('lot'));
            
                // Get the value of the "color" field from the feature's properties
                var colorValue = feature.get('color');
                // Define default style
                var defaultStyle = new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.4)' // Default fill color
                    }),
                    stroke: new Stroke({
                        color: 'pink', // Default stroke color
                        width: 1
                    })
                });

                // Define style based on the color value
                if (mapData.sku) {
                    var skuValue = feature.get('sku');

                    // if ((mapData.sku == skuValue) && ( feature.get('status') == '1') && (blockFeature.get('status') == '1') && (phaseFeature.get('status') == '1') ){

                    if ((mapData.sku == skuValue) && ( feature.get('status') == '1') ){
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(0, 128, 0)',
                            }),
                            stroke: new Stroke({
                                color: 'pink', 
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
                                color: 'pink', 
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
                // Return default style if no specific color matches
                return defaultStyle;
            },
            defaultStyleBlock(feature, resolution) {
                let text;
                let width = 2;
                var blockValue = String(feature.get('block'));
                
                if ( ( feature.get('status') == '1') ){
                    // Define default style
                    var defaultStyle = new Style({
                        stroke: new Stroke({
                            color: 'pink', // Default stroke color
                            width: 1
                        }),
                        text: new Text({
                            font: "32px serif bold",
                            text: blockValue,
                            fill: new Fill({
                                color: "red",
                            }),
                            backgroundFill: new Fill({
                                color: "rgba(255, 255, 255, 0)",
                            }),
                            padding: [2, 2, 2, 2]
                        }),
                    });
                } else {
                    // Define default style
                    var defaultStyle = new Style({
                        fill: new Fill({
                            color: 'rgba(128, 128, 128)',
                        }),
                        stroke: new Stroke({
                            color: 'pink', 
                            width: 1
                        }),
                        text: new Text({
                            font: "32px serif bold",
                            text: blockValue,
                            fill: new Fill({
                                color: "rgba(32, 32, 32, 1)",
                            }),
                        }),
                    });
                }

                // Return default style if no specific color matches
                return defaultStyle;
            },
            defaultStyleCF(feature, resolution) {
                let text;
                let width = 2;
                var blockValue = String(feature.get('remarks'));
                
                // Define default style
                var defaultStyle = new Style({
                    fill: new Fill({
                        color: 'skyblue',
                    }),
                    stroke: new Stroke({
                        color: 'pink', // Default stroke color
                        width: 1
                    }),
                    text: new Text({
                        font: "32px serif bold",
                        text: blockValue,
                        fill: new Fill({
                            color: "red",
                        }),
                        backgroundFill: new Fill({
                            color: "rgba(255, 255, 255, 0)",
                        }),
                        padding: [2, 2, 2, 2]
                    }),
                });
               

                // Return default style if no specific color matches
                return defaultStyle;
            },
            defaultStylePhase(feature, resolution) {
                
                if ( ( feature.get('status') == '1') ){

                    // Define default style
                    var defaultStyle = new Style({
                        stroke: new Stroke({
                            color: 'pink', // Default stroke color
                            width: 1
                        }),
                    });

                } else {

                    // Define default style
                    var defaultStyle = new Style({
                        fill: new Fill({
                            color: 'rgba(128, 128, 128)',
                        }),
                        stroke: new Stroke({
                            color: 'pink', 
                            width: 1
                        }),
                    });

                }

                // Return default style if no specific color matches
                return defaultStyle;
            },
            defaultStyleProject(feature, resolution) {
               
                 if ( ( feature.get('status') == '1') ){

                    // Define default style
                    var defaultStyle = new Style({
                        stroke: new Stroke({
                            color: 'pink', // Default stroke color
                            width: 2
                        }),
                    });

                } else {

                    // Define default style
                    var defaultStyle = new Style({
                        fill: new Fill({
                            color: 'rgba(128, 128, 128)',
                        }),
                        stroke: new Stroke({
                            color: 'pink', 
                            width: 2
                        }),
                    });
                    
                }

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
            checkImage(url, callback) {
                var img = new Image();
                img.onload = function() {
                    callback(true);
                };
                img.onerror = function() {
                    callback(false);
                };
                img.src = url;
            }

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

// Event listener for dropdown changes
document.getElementById('layer-select').addEventListener('change', function () {
    const selectedLayer = this.value;
    const newUrl = `${window.location.origin}/view-map/${selectedLayer}`;
    window.location.href = newUrl;  // Change the URL and reload the page
});