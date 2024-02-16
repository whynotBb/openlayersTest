import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Map, MapMarker } from "./Map";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MarkerTest from "./MarkerTest";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        <Map>
                            <App />
                        </Map>
                    }
                />
                <Route
                    exact
                    path="/marker"
                    element={
                        // <MarkerTest />
                        <MapMarker>
                            <MarkerTest />
                        </MapMarker>
                    }
                />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
