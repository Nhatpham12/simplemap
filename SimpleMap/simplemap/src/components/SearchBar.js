import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        { headers: { "User-Agent": "SimpleMapApp/2.0" } }
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    setLoading(false);
  };

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setResults([]);
    onSearch({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      name: item.display_name,
    });
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Nhập địa chỉ, tên đường hoặc địa danh cần đến..."
            className="form-input"
            style={{
              paddingLeft: "42px",
              width: "100%",
              fontSize: "14px",
              height: "44px",
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary"
          style={{ height: "44px", padding: "0 20px" }}
        >
          {loading ? "Đang tìm..." : "Tìm Đường"}
        </button>
      </div>

      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            listStyle: "none",
            margin: 0,
            padding: "6px",
            zIndex: 1500,
            maxHeight: "240px",
            overflowY: "auto",
            boxShadow: "var(--shadow-lg)",
            backdropFilter: "blur(16px)",
          }}
        >
          {results.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderRadius: "8px",
                fontSize: "13px",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-main)";
              }}
            >
              <span>📍</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;