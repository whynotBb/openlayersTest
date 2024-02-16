import { Feature, Map, View } from "ol";
import { Point } from "ol/geom";
import { Layer, Vector } from "ol/layer";
import { fromLonLat } from "ol/proj";
import { Source } from "ol/source";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import React, { useEffect } from "react";

const MapComponent = () => {
    return (
        <>
            <div id="map2" style={{ width: "100%", height: "400px" }}></div>
        </>
    );
};

export default MapComponent;
