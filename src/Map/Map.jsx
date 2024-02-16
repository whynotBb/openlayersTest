import React, { useState, useEffect } from "react";
import MapContext from "./MapContext";
import "ol/ol.css";
import { Feature, Map as OlMap, View } from "ol";
import { MousePosition, defaults as defaultControls } from "ol/control";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Point } from "ol/geom";

const Map = ({ children }) => {
    const [mapObj, setMapObj] = useState({});

    useEffect(() => {
        // 마우스가 위치해있는 좌표 그리기
        const mousePositionControl = new MousePosition({
            // coordinateFormat: createStringXY(4),
            coordinateFormat: (coordinate) => {
                // toFixed -> 소수점 이하 자릿수 제한 가능
                // + 숫자를 문자열로 반환하므로 문자열로 변환된 좌표를 반환하는 것에 유의해야 함
                const formattedCoordinate = coordinate.map((coord) =>
                    coord.toFixed(8)
                );
                return formattedCoordinate.toString();
            },
            projection: "EPSG:4326",
            className: "custom-mouse-position",
            target: document.getElementById("mouse-position"),
        });
        // Map 객체 생성 및 OSM 배경지도 추가
        const map = new OlMap({
            controls: defaultControls({ zoom: false, rotate: false }).extend([
                mousePositionControl,
            ]),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            target: "map", // 하위 요소 중 id 가 map 인 element가 있어야함.
            view: new View({
                projection: getProjection("EPSG:4326"),
                center: fromLonLat(
                    [127.005091, 37.504553],
                    getProjection("EPSG:4326")
                ),
                zoom: 18,
            }),
        });

        setMapObj({ map });
        return () => map.setTarget(undefined);
    }, []);

    // MapContext.Provider 에 객체 저장
    return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default Map;
