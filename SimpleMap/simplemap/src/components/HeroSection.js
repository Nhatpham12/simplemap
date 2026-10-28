import React from "react";

function HeroSection({ onExploreMap, onExploreAlgo, onExploreApi }) {
  return (
    <section id="home" className="section-wrapper animate-fade-in">
      <div className="hero-grid">
        {/* Left Column: Copywriting & CTAs */}
        <div className="hero-content">
          <div className="section-badge animate-pulse-glow">
            <span>✨</span>
            <span>Định Tuyến Bản Đồ Thông Minh Thế Hệ Mới</span>
          </div>

          <h1>
            Dẫn Đường Chuẩn Xác, <br />
            <span className="gradient-text">Tối Ưu Lộ Trình</span> Thời Gian Thực
          </h1>

          <p>
            SimpleMap kết hợp nguồn dữ liệu mở toàn cầu từ OpenStreetMap, OSRM Routing Engine siêu tốc và nền tảng thuật toán Dijkstra tối tân. Tìm đường thông minh, chỉ đường chi tiết từng ngã rẽ mà không cần chi trả chi phí API đắt đỏ.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary" onClick={onExploreMap}>
              <span>🗺️ Trải Nghiệm Bản Đồ Ngay</span>
            </button>
            <button className="btn-secondary" onClick={onExploreAlgo}>
              <span>⚙️ Xem Mô Phỏng Thuật Toán</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <h3>&lt; 45ms</h3>
              <p>Thời gian phản hồi</p>
            </div>
            <div className="stat-item">
              <h3>100M+</h3>
              <p>Tọa độ OpenStreetMap</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Dữ liệu mở & Miễn phí</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Animated Showcase */}
        <div className="hero-visual-card animate-float">
          <div className="radar-simulation">
            <div className="radar-grid"></div>
            <div className="radar-beam"></div>

            {/* Simulated Animated SVG Route */}
            <svg
              className="radar-route-svg"
              viewBox="0 0 300 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Path */}
              <path
                d="M 40 220 Q 90 140 140 160 T 250 60"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Animated Start & End Markers */}
            <div
              className="radar-marker"
              style={{ left: "40px", top: "220px", background: "#3b82f6", boxShadow: "0 0 15px #3b82f6" }}
              title="Điểm xuất phát (GPS)"
            ></div>
            <div
              className="radar-marker animate-pulse-glow"
              style={{ left: "250px", top: "60px", background: "#10b981", boxShadow: "0 0 18px #10b981" }}
              title="Điểm đến tối ưu"
            ></div>
          </div>

          {/* Floating Pill Badges */}
          <div className="floating-pill pill-1 animate-float-rev">
            <span style={{ fontSize: "16px" }}>📍</span>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Vị trí phát hiện</div>
              <div style={{ color: "var(--text-main)" }}>TP. Hồ Chí Minh (GPS Active)</div>
            </div>
          </div>

          <div className="floating-pill pill-2 animate-float">
            <span style={{ fontSize: "16px" }}>⚡</span>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Thuật toán Dijkstra</div>
              <div style={{ color: "var(--secondary)" }}>Lộ trình ngắn nhất: 4.2 km (8 min)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;