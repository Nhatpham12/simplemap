import React, { useState } from "react";

const CODE_SNIPPETS = {
  javascript: `// Tích hợp SimpleMap Routing API bằng JavaScript / Node.js
async function getOptimalRoute(startLng, startLat, endLng, endLat) {
  const endpoint = \`https://router.project-osrm.org/route/v1/driving/\${startLng},\${startLat};\${endLng},\${endLat}?overview=full&geometries=geojson&steps=true\`;
  
  const response = await fetch(endpoint);
  const data = await response.json();
  
  if (data.code === 'Ok') {
    const route = data.routes[0];
    console.log("Khoảng cách (mét):", route.distance);
    console.log("Thời gian (giây):", route.duration);
    console.log("Tọa độ lộ trình GeoJSON:", route.geometry.coordinates);
    return route;
  }
  throw new Error("Không tìm thấy đường đi");
}`,

  curl: `# Gọi trực tiếp SimpleMap OSRM Endpoint qua cURL
curl -X GET "https://router.project-osrm.org/route/v1/driving/106.6601,10.7626;106.6983,10.7720?overview=full&geometries=geojson&steps=true" \\
     -H "Accept: application/json" \\
     -H "User-Agent: SimpleMapClient/2.0"`,

  python: `# Tích hợp SimpleMap bằng Python requests
import requests

def get_route(start_lng, start_lat, dest_lng, dest_lat):
    url = f"https://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{dest_lng},{dest_lat}"
    params = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "true"
    }
    res = requests.get(url, params=params)
    data = res.json()
    if data.get("code") == "Ok":
        route = data["routes"][0]
        print(f"Quãng đường: {route['distance'] / 1000:.2f} km")
        print(f"Thời gian: {route['duration'] / 60:.1f} phút")
        return route
    return None

get_route(106.6601, 10.7626, 106.6983, 10.7720)`,
};

function PricingApiSection({ onContactClick }) {
  const [activeCodeTab, setActiveCodeTab] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="pricing-api" className="section-wrapper animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div className="section-badge">
          <span>💎</span>
          <span>Bảng Giá & Nhà Phát Triển</span>
        </div>
        <h2 className="section-title">
          Giải Pháp Cho Mọi <span className="gradient-text">Quy Mô Ứng Dụng</span>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          Khởi đầu hoàn toàn miễn phí hoặc nâng cấp lên hạ tầng máy chủ định tuyến chuyên dụng với hiệu năng không giới hạn.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {/* Tier 1 */}
        <div className="pricing-card">
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>Cộng Đồng (Starter)</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            Dành cho sinh viên, học tập & dự án cá nhân
          </p>
          <div className="pricing-price">
            0đ <span className="pricing-period">/ vĩnh viễn</span>
          </div>
          <ul className="pricing-features-list">
            <li className="pricing-feature-item">
              <span>✅</span> 10,000 yêu cầu định tuyến / ngày
            </li>
            <li className="pricing-feature-item">
              <span>✅</span> Bản đồ nền OpenStreetMap chuẩn
            </li>
            <li className="pricing-feature-item">
              <span>✅</span> Chỉ dẫn Turn-by-Turn cơ bản
            </li>
            <li className="pricing-feature-item">
              <span>✅</span> Hỗ trợ tài liệu mã nguồn mở GitHub
            </li>
          </ul>
          <button className="btn-secondary" onClick={onContactClick} style={{ width: "100%", justifyContent: "center" }}>
            Bắt Đầu Miễn Phí
          </button>
        </div>

        {/* Tier 2 */}
        <div className="pricing-card featured">
          <div className="popular-badge">Phổ biến nhất</div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0, color: "var(--primary)" }}>
            Chuyên Nghiệp (Pro)
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            Dành cho startup, ứng dụng giao vận & e-commerce
          </p>
          <div className="pricing-price">
            299k <span className="pricing-period">/ tháng</span>
          </div>
          <ul className="pricing-features-list">
            <li className="pricing-feature-item">
              <span>⚡</span> 500,000 yêu cầu định tuyến / ngày
            </li>
            <li className="pricing-feature-item">
              <span>⚡</span> Máy chủ OSRM Routing cụm riêng biệt
            </li>
            <li className="pricing-feature-item">
              <span>⚡</span> Tùy chọn nền bản đồ Sáng / Tối cao cấp
            </li>
            <li className="pricing-feature-item">
              <span>⚡</span> Độ trễ cam kết SLA 99.9%
            </li>
            <li className="pricing-feature-item">
              <span>⚡</span> Hỗ trợ kỹ thuật ưu tiên 24/7
            </li>
          </ul>
          <button className="btn-primary" onClick={onContactClick} style={{ width: "100%", justifyContent: "center" }}>
            Đăng Ký Gói Pro
          </button>
        </div>

        {/* Tier 3 */}
        <div className="pricing-card">
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>Doanh Nghiệp (Enterprise)</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            Dành cho tập đoàn logistic, taxi & fleet lớn
          </p>
          <div className="pricing-price">
            Thỏa thuận <span className="pricing-period">/ dự án</span>
          </div>
          <ul className="pricing-features-list">
            <li className="pricing-feature-item">
              <span>🚀</span> Triển khai On-Premise (Docker/K8s) riêng
            </li>
            <li className="pricing-feature-item">
              <span>🚀</span> Không giới hạn số lượng request
            </li>
            <li className="pricing-feature-item">
              <span>🚀</span> Tùy biến trọng số giao thông thời gian thực
            </li>
            <li className="pricing-feature-item">
              <span>🚀</span> Ký kết bảo mật dữ liệu doanh nghiệp (NDA)
            </li>
          </ul>
          <button className="btn-secondary" onClick={onContactClick} style={{ width: "100%", justifyContent: "center" }}>
            Liên Hệ Tư Vấn
          </button>
        </div>
      </div>

      {/* Developer API Playground */}
      <div className="code-box-container">
        <div className="code-tabs-header">
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`code-tab-btn ${activeCodeTab === "javascript" ? "active" : ""}`}
              onClick={() => setActiveCodeTab("javascript")}
            >
              JavaScript / React
            </button>
            <button
              className={`code-tab-btn ${activeCodeTab === "curl" ? "active" : ""}`}
              onClick={() => setActiveCodeTab("curl")}
            >
              cURL (Terminal)
            </button>
            <button
              className={`code-tab-btn ${activeCodeTab === "python" ? "active" : ""}`}
              onClick={() => setActiveCodeTab("python")}
            >
              Python
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            style={{
              background: copied ? "#10b981" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? "✓ Đã sao chép!" : "📋 Sao chép mã"}
          </button>
        </div>

        <pre className="code-pre">
          <code>{CODE_SNIPPETS[activeCodeTab]}</code>
        </pre>
      </div>
    </section>
  );
}

export default PricingApiSection;