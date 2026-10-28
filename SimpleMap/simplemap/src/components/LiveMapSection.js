import React, { useState } from "react";
import Map from "./Map";

const PRESET_LOCATIONS = [
  { name: "Chợ Bến Thành", icon: "🏙️", lat: 10.7720, lng: 106.6983 },
  { name: "Landmark 81", icon: "🗼", lat: 10.7950, lng: 106.7219 },
  { name: "Nhà thờ Đức Bà", icon: "⛪", lat: 10.7797, lng: 106.6990 },
  { name: "Hồ Con Rùa", icon: "🐢", lat: 10.7828, lng: 106.6958 },
  { name: "Sân bay Tân Sơn Nhất", icon: "✈️", lat: 10.8184, lng: 106.6588 },
  { name: "Phố đi bộ Nguyễn Huệ", icon: "🚶", lat: 10.7744, lng: 106.7032 },
];

const TILE_SERVERS = [
  {
    id: "osm",
    label: "🗺️ Chuẩn (OSM)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: "carto-light",
    label: "☀️ Sáng (CartoDB)",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    id: "carto-dark",
    label: "🌙 Tối (Dark Matter)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
];

function LiveMapSection({ theme }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedTileId, setSelectedTileId] = useState("osm");

  // Choose tile based on state or theme
  const currentTile =
    TILE_SERVERS.find((t) => t.id === selectedTileId) || TILE_SERVERS[0];

  const handleSelectPreset = (loc) => {
    setSelectedPreset(loc);
  };

  return (
    <section id="live-map" className="section-wrapper animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div className="section-badge">
          <span>🛰️</span>
          <span>Hệ Thống Dẫn Đường Tương Tác</span>
        </div>
        <h2 className="section-title">
          Trải Nghiệm Bản Đồ <span className="gradient-text">Thời Gian Thực</span>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          Tìm kiếm bất kỳ địa điểm nào hoặc chọn nhanh các danh lam nổi tiếng bên dưới để kiểm tra tốc độ phản hồi và độ chính xác của lộ trình.
        </p>
      </div>

      <div className="map-showcase-container">
        {/* Controls Toolbar */}
        <div className="map-control-header">
          {/* Quick Location Chips */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Điểm đến nhanh:
              </span>
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  className={`preset-chip ${selectedPreset?.name === loc.name ? "active" : ""}`}
                  onClick={() => handleSelectPreset(loc)}
                >
                  <span>{loc.icon}</span>
                  <span>{loc.name}</span>
                </button>
              ))}
            </div>

            {/* Map Style Selector */}
            <div className="map-tile-selector">
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Giao diện:
              </span>
              {TILE_SERVERS.map((tile) => (
                <button
                  key={tile.id}
                  className={`tile-btn ${selectedTileId === tile.id ? "active" : ""}`}
                  onClick={() => setSelectedTileId(tile.id)}
                >
                  {tile.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Frame */}
        <div className="map-frame-box">
          <Map
            externalDestination={selectedPreset}
            tileLayerUrl={currentTile.url}
            tileAttribution={currentTile.attribution}
          />
        </div>
      </div>
    </section>
  );
}

export default LiveMapSection;