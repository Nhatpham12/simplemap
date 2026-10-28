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

// Fix Leaflet's default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const defaultCenter = [10.762622, 106.660172]; // Ho Chi Minh City

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
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
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [bounds, map]);
  return null;
}

function Map({
  externalDestination = null,
  tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}) {
  const [position, setPosition] = useState(defaultCenter);
  const [located, setLocated] = useState(false);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Get user geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLocated(true);
        },
        (err) => {
          console.warn("Location error/denied:", err);
          setLocated(true);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocated(true);
    }
  }, []);

  // Fetch route using OSRM
  const fetchRoute = useCallback(
    async (dest) => {
      if (!dest) return;
      setLoadingRoute(true);
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${position[1]},${position[0]};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
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
      } finally {
        setLoadingRoute(false);
      }
    },
    [position]
  );

  const handleSearch = useCallback(
    (dest) => {
      setDestination(dest);
      setRoute(null);
      setRouteCoords([]);
      setPanelOpen(true);
      fetchRoute(dest);
    },
    [fetchRoute]
  );

  // React to external destination changes (e.g. from preset chips)
  useEffect(() => {
    if (externalDestination) {
      handleSearch(externalDestination);
    }
  }, [externalDestination, handleSearch]);

  const handleMapClick = useCallback(() => {
    // Optional: do not auto-close panel if user is looking at steps
  }, []);

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setLocated(true);
        if (destination) {
          fetchRoute(destination);
        }
      });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Search Header Floating Bar */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          right: "16px",
          maxWidth: "600px",
          zIndex: 1000,
          background: "var(--bg-card)",
          padding: "12px 16px",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-md)",
          backdropFilter: "blur(16px)",
        }}
      >
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Floating Action Button: Locate Me */}
      <button
        onClick={handleLocateMe}
        title="Định vị vị trí hiện tại của tôi"
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-md)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          backdropFilter: "blur(12px)",
          transition: "transform 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.borderColor = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = "var(--border-color)";
        }}
      >
        🎯
      </button>

      {/* Routing Turn-by-Turn Panel */}
      {route && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            width: "360px",
            maxWidth: "calc(100% - 48px)",
            maxHeight: panelOpen ? "380px" : "56px",
            zIndex: 1000,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "18px",
            boxShadow: "var(--shadow-lg)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Panel Header */}
          <div
            onClick={() => setPanelOpen(!panelOpen)}
            style={{
              padding: "14px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: panelOpen ? "1px solid var(--border-color)" : "none",
              backgroundColor: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>🧭</span>
              <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-main)" }}>
                {panelOpen ? "Chi tiết chỉ đường" : "Xem lộ trình dẫn đường"}
              </span>
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              {panelOpen ? "▼ Thu nhỏ" : "▲ Mở rộng"}
            </span>
          </div>

          {/* Panel Scrollable Content */}
          {panelOpen && (
            <div style={{ padding: "14px 18px", overflowY: "auto", flex: 1 }}>
              <RouteSteps route={route} />
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {loadingRoute && (
        <div
          style={{
            position: "absolute",
            top: "84px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "var(--bg-card)",
            padding: "8px 18px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--primary)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border-glow)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span className="animate-pulse-glow">⚡</span>
          <span>Đang tính toán tuyến đường tối ưu...</span>
        </div>
      )}

      {/* Main Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer attribution={tileAttribution} url={tileLayerUrl} />
        <MapClickHandler onClick={handleMapClick} />
        {located && <FlyToLocation position={position} />}
        {bounds && <FitBounds bounds={bounds} />}

        {/* Start Position Marker */}
        <Marker position={position}>
          <Popup>
            <div style={{ textAlign: "center" }}>
              <strong>📍 Vị trí của bạn</strong>
              <div style={{ fontSize: "12px", color: "#666" }}>Điểm xuất phát</div>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <strong>🏁 {destination.name}</strong>
                <div style={{ fontSize: "12px", color: "#666" }}>Điểm đến đã chọn</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="#2563eb"
            weight={6}
            opacity={0.85}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;