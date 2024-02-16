## OpenLayers

https://openlayers.org/
npm i ol

## 중심좌표

고투몰 : [127.0047079, 37.5065717]
잠실역 : [127.10270176, 37.51006675]

//
const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
const utmk =
"+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";

function UTM2WGS(x, y) {
const proj = proj4(utmk, wgs84, [x, y]);
return { x: proj.y, y: proj.x };
}

function drawLink(subPathLinkInfoList, coordType) {
const vector_line = new Layer.Vector({
id: "vector_line",
source: new Source.Vector(),
style: new Style.Style({
fill: new Style.Fill({
color: "rgba(255, 255, 255, 0.2)",
}),
stroke: new Style.Stroke({
color: "rgba(255, 0, 0, 0.8)",
width: 4,
}),
image: new Style.Circle({
radius: 7,
fill: new Style.Fill({
color: "#ffcc33",
}),
}),
}),
});

    let sequence = 0; // initialize sequence counter
    for (let j = 0; j < subPathLinkInfoList.length; j++) {
        const locations = [];
        let index = 0;
        for (let i = 0; i < subPathLinkInfoList[j].pts.length; i++) {
            let point = [];
            if (coordType === true) {
                let utm2WGS = UTM2WGS(
                    subPathLinkInfoList[j].pts[i].x / 100,
                    subPathLinkInfoList[j].pts[i].y / 100
                );
                point.push(utm2WGS.y, utm2WGS.x);
            } else {
                point.push(
                    subPathLinkInfoList[j].pts[i].x,
                    subPathLinkInfoList[j].pts[i].y
                );
            }
            locations.push(point);
            index = i;
        }

        const lineFeature = new Feature({
            geometry: new Geometry.LineString(locations),
            sequence: sequence++,
        });

        const passcode = subPathLinkInfoList[j].passCode & 0xff;
        // lineFeature.set('description', String(subPathLinkInfoList[j].passCode));
        lineFeature.set("description", String(passcode));
        lineFeature.setStyle(createStyleFunction);
        vector_line.getSource().addFeature(lineFeature);
    }
    mapMarker.addLayer(vector_line);

}
