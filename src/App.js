import { useContext, useEffect, useState } from "react";
import MapContext from "./Map/MapContext";
import { fromLonLat, transform } from "ol/proj";
import { unByKey } from "ol/Observable";
import Map from "./Map";

function App() {
    // 컨텍스트에 저장되어있는 객체를 가져옴
    const { map } = useContext(MapContext);

    const handleZoomInClick = () => {
        map.getView().setZoom(map.getView().getZoom() + 1);
    };

    const handleZoomOutClick = () => {
        map.getView().setZoom(map.getView().getZoom() - 1);
    };
    // ============== 좌표 확인 ==============
    const [clickCoor, setClickCoor] = useState([0, 0]); // 클릭한 지도 좌표
    // 지도 클릭시 클릭한 위치의 좌표 저장
    useEffect(() => {
        if (map) {
            const mapClickListener = map.on("singleclick", function (evt) {
                evt.preventDefault();

                var coordin = transform(
                    evt.coordinate,
                    "EPSG:4326",
                    "EPSG:4326"
                );
                setClickCoor(coordin);
            });

            return () => {
                // 컴포넌트가 언마운트되기 전에 이벤트 핸들러 제거
                unByKey(mapClickListener);
            };
        }
    }, [map]);
    console.log(clickCoor);
    return (
        <>
            {/* <button onClick={handleZoomInClick}>zoomIn</button>
            <button onClick={handleZoomOutClick}>zoomOut</button> */}
            <div id="map" style={{ width: "100%", height: 400 }}></div>
        </>
    );
}

export default App;
