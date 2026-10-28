import React from "react";

const FEATURES = [
  {
    icon: "📍",
    badge: "GPS Core",
    color: "#3b82f6",
    title: "Định Vị Tức Thời & Chính Xác",
    description:
      "Tận dụng Geolocation API với thuật toán làm mượt tọa độ, tự động nhận diện vị trí người dùng tức thì với sai số dưới 5m trong điều kiện lý tưởng.",
  },
  {
    icon: "🔍",
    badge: "Nominatim",
    color: "#8b5cf6",
    title: "Tìm Kiếm Thông Minh Toàn Cầu",
    description:
      "Giải mã địa chỉ (Geocoding) chuẩn xác từ tên đường, tòa nhà đến quán xá, hỗ trợ tiếng Việt có dấu lẫn không dấu cùng danh sách gợi ý autocomplete.",
  },
  {
    icon: "⚡",
    badge: "OSRM Engine",
    color: "#10b981",
    title: "Định Tuyến Cực Nhanh < 50ms",
    description:
      "Dựa trên kiến trúc Contraction Hierarchies kết hợp đồ thị Dijkstra, xử lý tính toán lộ trình hàng trăm kilomet chỉ trong vài chục mili-giây.",
  },
  {
    icon: "🧭",
    badge: "Navigation",
    color: "#f59e0b",
    title: "Chỉ Dẫn Turn-by-Turn Rõ Ràng",
    description:
      "Hiển thị bảng hướng dẫn rẽ trực quan với biểu tượng điều hướng riêng cho từng thao tác (rẽ trái, rẽ phải, đi thẳng, bùng binh, nhập làn).",
  },
  {
    icon: "📐",
    badge: "Viewport",
    color: "#ec4899",
    title: "Tự Động Căn Khung Bao Quát",
    description:
      "Công nghệ FitBounds thông minh tự động tính toán khoảng cách và góc nhìn, đảm bảo người dùng luôn thấy trọn vẹn lộ trình ngay khi vừa tìm kiếm.",
  },
  {
    icon: "🛡️",
    badge: "Open Source",
    color: "#06b6d4",
    title: "Mã Nguồn Mở & Tôn Trọng Quyền Riêng Tư",
    description:
      "Xây dựng trên nền tảng dữ liệu mở OpenStreetMap, không theo dõi danh tính người dùng và không yêu cầu đăng ký API Key trả phí.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="section-wrapper animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div className="section-badge">
          <span>⚡</span>
          <span>Công Nghệ & Tính Năng Vượt Trội</span>
        </div>
        <h2 className="section-title">
          Tối Ưu Hóa Mọi Trải Nghiệm <span className="gradient-text">Điều Hướng</span>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          SimpleMap được kiến trúc đồng bộ từ tầng dữ liệu bản đồ đến giao diện tương tác, mang lại hiệu suất vượt trội cho cả người dùng cuối lẫn lập trình viên.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((feat, idx) => (
          <div key={idx} className="feature-card">
            <span className="feature-badge">{feat.badge}</span>
            <div
              className="feature-icon-wrapper"
              style={{ backgroundColor: `${feat.color}15`, color: feat.color }}
            >
              <span>{feat.icon}</span>
            </div>
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;