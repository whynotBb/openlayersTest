import React, { useState, useEffect, useRef } from "react";
import MapContext from "./MapContext";
import "ol/ol.css";
import { Feature, Map as OlMap, Overlay, View } from "ol";
import { MousePosition, defaults as defaultControls } from "ol/control";
import { fromLonLat, get as getProjection, toLonLat } from "ol/proj";
import { Layer, Tile as TileLayer, Vector } from "ol/layer";
import { OGCMapTile, OSM, Source, XYZ } from "ol/source";
import { Geometry, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { toStringHDMS } from "ol/coordinate";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import CircleStyle from "ol/style/Circle";
import proj4 from "proj4";
import { createStyleFunction } from "ol/Feature";
import Polyline from "ol/format/Polyline.js";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { getVectorContext } from "ol/render";
import MapMarkerContext from "./MapMarkerContext";

const MapMarker = ({ children }) => {
    const [mapObj, setMapObj] = useState({});

    const key = "Get your own API key at https://www.maptiler.com/cloud/";
    const attributions =
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    const center = [-5639523.95, -3501274.52];
    useEffect(() => {
        const map2 = new OlMap({
            target: "map2",
            view: new View({
                center: center,
                zoom: 10,
                minZoom: 2,
                maxZoom: 19,
            }),
            layers: [
                new TileLayer({
                    source: new XYZ({
                        attributions: attributions,
                        url:
                            "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=" +
                            key,
                        tileSize: 512,
                    }),
                }),
            ],
        });

        // The polyline string is read from a JSON similar to those returned
        // by directions APIs such as Openrouteservice and Mapbox.
        fetch("../data/polyline/route.json").then(function (response) {
            response.json().then(function (result) {
                const polyline = result.routes[0].geometry;

                const route = new Polyline({
                    factor: 1e6,
                }).readGeometry(polyline, {
                    dataProjection: "EPSG:4326",
                    featureProjection: "EPSG:3857",
                });

                const routeFeature = new Feature({
                    type: "route",
                    geometry: route,
                });
                const startMarker = new Feature({
                    type: "icon",
                    geometry: new Point(route.getFirstCoordinate()),
                });
                const endMarker = new Feature({
                    type: "icon",
                    geometry: new Point(route.getLastCoordinate()),
                });
                const position = startMarker.getGeometry().clone();
                const geoMarker = new Feature({
                    type: "geoMarker",
                    geometry: position,
                });

                const styles = {
                    route: new Style({
                        stroke: new Stroke({
                            width: 6,
                            color: [237, 212, 0, 0.8],
                        }),
                    }),
                    icon: new Style({
                        image: new Icon({
                            anchor: [0.5, 1],
                            src: "data/icon.png",
                        }),
                    }),
                    geoMarker: new Style({
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({ color: "black" }),
                            stroke: new Stroke({
                                color: "white",
                                width: 2,
                            }),
                        }),
                    }),
                };

                const vectorLayer = new VectorLayer({
                    source: new VectorSource({
                        features: [
                            routeFeature,
                            geoMarker,
                            startMarker,
                            endMarker,
                        ],
                    }),
                    style: function (feature) {
                        return styles[feature.get("type")];
                    },
                });

                map2.addLayer(vectorLayer);
            });
        });
        setMapObj({ map2 });
        return () => map2.setTarget(undefined);
    });

    // MapContext.Provider 에 객체 저장
    return (
        <MapMarkerContext.Provider value={mapObj}>
            {children}
        </MapMarkerContext.Provider>
    );
};

export default MapMarker;
