import React from "react";

function getManeuverIcon(type) {
  const icons = {
    depart: "\u2B06",
    arrive: "\uD83C\uDFC1",
    turn: "\u27A1",
    "new name": "\u2192",
    continue: "\u2B06",
    merge: "\u2B06",
    "on ramp": "\u2B06",
    "off ramp": "\u2B07",
    fork: "\u27A1",
    "end of road": "\u27A1",
    "round about": "\uD83D\uDD04",
    rotary: "\uD83D\uDD04",
    roundabout: "\uD83D\uDD04",
  };
  return icons[type] || "\u27A1";
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
    return `${h}h ${m}m`;
  }
  return Math.round(seconds / 60) + " min";
}

function RouteSteps({ route }) {
  if (!route) return null;

  return (
    <div style={{ padding: "0", marginTop: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 14px",
          backgroundColor: "#e8f5e9",
          borderRadius: "6px",
          marginBottom: "10px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        <span>{formatDistance(route.distance)}</span>
        <span>{formatDuration(route.duration)}</span>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {route.steps.map((step, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
              fontSize: "13px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "18px", minWidth: "24px" }}>
              {getManeuverIcon(step.maneuver.type)}
            </span>
            <div>
              <div>{step.name || "Đường vô danh"}</div>
              <div style={{ color: "#666", fontSize: "12px" }}>
                {formatDistance(step.distance)}
                {step.maneuver.type === "arrive" && " - Đã đến nơi"}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RouteSteps;
