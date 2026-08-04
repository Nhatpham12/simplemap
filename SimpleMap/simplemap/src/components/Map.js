import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "./SearchBar";
import RouteSteps from "./RouteSteps";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const defaultCenter = [10.762622, 106.660172];

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15);
  }, [position, map]);
  return null;
}

function MapClickHandler({ onClick }) {
  const map = useMap();
  useEffect(() => {
    map.on("click", onClick);
    return () => map.off("click", onClick);
  }, [map, onClick]);
  return null;
}

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

function Map() {
  const [position, setPosition] = useState(defaultCenter);
  const [located, setLocated] = useState(false);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocated(true);
      },
      (err) => {
        console.error("Location error:", err);
        setLocated(true);
      }
    );
  }, []);

  const fetchRoute = useCallback(
    async (dest) => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${position[1]},${position[0]};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok" && data.routes.length > 0) {
          const r = data.routes[0];
          setRoute({
            distance: r.distance,
            duration: r.duration,
            steps: r.legs[0].steps,
          });

          const coords = r.geometry.coordinates.map((c) => [c[1], c[0]]);
          setRouteCoords(coords);

          setBounds(
            L.latLngBounds(
              [position[0], position[1]],
              [dest.lat, dest.lng]
            )
          );
        }
      } catch (err) {
        console.error("Routing error:", err);
      }
    },
    [position]
  );

  const handleSearch = (dest) => {
    setDestination(dest);
    setRoute(null);
    setRouteCoords([]);
    setPanelOpen(true);
    fetchRoute(dest);
  };

  const handleMapClick = useCallback(() => {
    setPanelOpen(false);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px", backgroundColor: "#fff", zIndex: 1000 }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {route && panelOpen && (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderTop: "1px solid #eee",
            padding: "10px",
          }}
        >
          <RouteSteps route={route} />
        </div>
      )}

      {route && !panelOpen && (
        <div
          onClick={() => setPanelOpen(true)}
          style={{
            padding: "8px 14px",
            backgroundColor: "#fff",
            borderTop: "1px solid #eee",
            cursor: "pointer",
            fontSize: "13px",
            color: "#4285f4",
            fontWeight: "bold",
          }}
        >
          Xem chi tiết hướng đi
        </div>
      )}

      <div style={{ flex: 1 }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          {located && <FlyToLocation position={position} />}
          {bounds && <FitBounds bounds={bounds} />}

          <Marker position={position}>
            <Popup>Vị trí hiện tại</Popup>
          </Marker>

          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>{destination.name}</Popup>
            </Marker>
          )}

          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              color="#4285f4"
              weight={5}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
