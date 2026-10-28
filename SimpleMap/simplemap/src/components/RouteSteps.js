import React from "react";

function getManeuverIcon(type) {
  const icons = {
    depart: "🚀",
    arrive: "🏁",
    turn: "↪️",
    "new name": "⬆️",
    continue: "⬆️",
    merge: "🔀",
    "on ramp": "↗️",
    "off ramp": "↘️",
    fork: "🔀",
    "end of road": "🛑",
    "round about": "🔄",
    rotary: "🔄",
    roundabout: "🔄",
  };
  return icons[type] || "➡️";
}

function formatDistance(meters) {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(1) + " km";
  }
  return Math.round(meters) + " m";
}

function formatDuration(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return `${h} giờ ${m} phút`;
  }
  return Math.round(seconds / 60) + " phút";
}

function RouteSteps({ route }) {
  if (!route) return null;

  return (
    <div style={{ marginTop: "8px" }}>
      {/* Route Summary Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))",
          borderRadius: "14px",
          border: "1px solid var(--border-glow)",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🚗</span>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Khoảng cách
            </div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--secondary)" }}>
              {formatDistance(route.distance)}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Thời gian dự kiến
          </div>
          <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--primary)" }}>
            {formatDuration(route.duration)}
          </div>
        </div>
      </div>

      {/* Step List */}
      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--text-muted)" }}>
        CHI TIẾT LỘ TRÌNH TỪNG BƯỚC:
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {route.steps.map((step, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "var(--bg-main)",
              border: "1px solid var(--border-color)",
              transition: "transform 0.15s ease",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(59, 130, 246, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {getManeuverIcon(step.maneuver.type)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "13px" }}>
                {step.name ? step.name : "Tiếp tục di chuyển"}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
                {formatDistance(step.distance)}
                {step.maneuver.type === "arrive" && " • Đã đến đích thành công"}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RouteSteps;