import React, { useState } from "react";

function Navbar({
  activePage,
  setActivePage,
  viewMode,
  setViewMode,
  theme,
  setTheme,
  pages,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);

    if (viewMode === "scroll") {
      const element = document.getElementById(pageId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="main-navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => handleNavClick("home")}>
          <div className="brand-icon">
            <span>🗺️</span>
          </div>
          <div>
            <span className="brand-title">SimpleMap</span>
            <span className="brand-tag">Dijkstra 2.0</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav>
          <ul className="nav-menu">
            {pages.map((p) => (
              <li key={p.id}>
                <button
                  className={`nav-link-btn ${activePage === p.id ? "active" : ""}`}
                  onClick={() => handleNavClick(p.id)}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {/* View Mode Toggle Button */}
          <button
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: "12px" }}
            onClick={() => setViewMode(viewMode === "scroll" ? "tabs" : "scroll")}
            title="Chuyển chế độ cuộn trang hoặc từng tab"
          >
            {viewMode === "scroll" ? "📑 Chế độ trang" : "📜 Chế độ cuộn"}
          </button>

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            title="Đổi giao diện sáng/tối"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* CTA to Live Map */}
          <button
            className="btn-primary"
            onClick={() => handleNavClick("live-map")}
            style={{ padding: "8px 16px" }}
          >
            <span>🚀 Thử Ngay</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border-color)",
            backgroundColor: "var(--nav-bg)",
            backdropFilter: "blur(16px)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {pages.map((p) => (
              <li key={p.id}>
                <button
                  className={`nav-link-btn ${activePage === p.id ? "active" : ""}`}
                  style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px" }}
                  onClick={() => handleNavClick(p.id)}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;