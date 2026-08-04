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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        { headers: { "User-Agent": "SimpleMapApp/1.0" } }
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
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Nhập địa điểm cần đến..."
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "10px 18px",
            fontSize: "14px",
            backgroundColor: "#4285f4",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Tìm"}
        </button>
      </div>
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "0 0 6px 6px",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {results.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                fontSize: "13px",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
