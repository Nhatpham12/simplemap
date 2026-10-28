import React from "react";

const STEPS = [
  {
    num: "1",
    icon: "📍",
    title: "Xác Định Vị Trí",
    desc: "Bản đồ tự động nhận diện tọa độ của bạn thông qua GPS của trình duyệt, hoặc bạn có thể click chọn bất kỳ điểm xuất phát nào.",
  },
  {
    num: "2",
    icon: "🔍",
    title: "Tìm Kiếm Điểm Đến",
    desc: "Nhập địa chỉ nhà, tên công ty hoặc địa danh nổi tiếng vào ô tìm kiếm thông minh với sự hỗ trợ của bộ máy Nominatim.",
  },
  {
    num: "3",
    icon: "⚡",
    title: "Tính Toán Tuyến Đường",
    desc: "Máy chủ OSRM phân tích đồ thị đường sá, áp dụng thuật toán tối ưu để chọn ra cung đường nhanh nhất và tiết kiệm thời gian nhất.",
  },
  {
    num: "4",
    icon: "🚗",
    title: "Dẫn Đường Từng Bước",
    desc: "Xem lộ trình trực quan vẽ trên bản đồ cùng bảng chỉ dẫn rẽ chi tiết, khoảng cách và thời gian dự kiến đến đích.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-wrapper animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="section-badge">
          <span>🚀</span>
          <span>Đơn Giản & Nhanh Chóng</span>
        </div>
        <h2 className="section-title">
          Quy Trình Hoạt Động <span className="gradient-text">4 Bước</span>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          Trải nghiệm tìm đường liền mạch không gián đoạn, từ lúc mở ứng dụng đến khi đến nơi an toàn.
        </p>
      </div>

      <div className="steps-timeline">
        {STEPS.map((step, idx) => (
          <div key={idx} className="step-card">
            <div className="step-number">{step.num}</div>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;