import React, { useState } from "react";

const FAQS = [
  {
    q: "SimpleMap sử dụng nguồn dữ liệu bản đồ từ đâu?",
    a: "SimpleMap sử dụng dữ liệu địa lý mở từ OpenStreetMap (OSM) - dự án bản đồ cộng đồng lớn nhất thế giới với hàng triệu cộng tác viên cập nhật liên tục mỗi ngày.",
  },
  {
    q: "Thuật toán định tuyến có xét đến đường một chiều và loại phương tiện không?",
    a: "Có! Động cơ OSRM mặc định phân tích các thuộc tính đường bộ của OpenStreetMap bao gồm: hướng một chiều (oneway), phân loại đường (cao tốc, đường nội đô, ngõ hẻm), giới hạn tốc độ và biển cấm xe.",
  },
  {
    q: "Tôi có thể nhúng SimpleMap vào ứng dụng di động (React Native, Flutter) không?",
    a: "Hoàn toàn được! Bạn có thể sử dụng trực tiếp API endpoint chuẩn GeoJSON của OSRM trong bất kỳ nền tảng di động nào hoặc dùng WebView để nhúng toàn bộ giao diện web này.",
  },
  {
    q: "Làm thế nào để tự host máy chủ OSRM riêng trên Docker / VPS?",
    a: "OSRM cung cấp Docker image chính thức (`osrm/osrm-backend`). Bạn chỉ cần tải file `.osm.pbf` khu vực Việt Nam từ Geofabrik, sau đó chạy lệnh `osrm-extract` và `osrm-routed` để có máy chủ định tuyến riêng với quyền kiểm soát 100%.",
  },
  {
    q: "SimpleMap có đảm bảo quyền riêng tư vị trí của tôi không?",
    a: "Chắc chắn rồi! SimpleMap không lưu trữ lịch sử vị trí GPS của người dùng vào bất kỳ cơ sở dữ liệu nào. Tọa độ chỉ được dùng trực tiếp trên trình duyệt để gửi truy vấn tìm tuyến đường.",
  },
];

function FaqContactSection({ onNavigate }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", topic: "api", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", topic: "api", message: "" });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div>
      <section id="faq-contact" className="section-wrapper animate-fade-in">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="section-badge">
            <span>💬</span>
            <span>Hỗ Trợ & Kết Nối</span>
          </div>
          <h2 className="section-title">
            Câu Hỏi Thường Gặp & <span className="gradient-text">Liên Hệ Hỗ Trợ</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Mọi thắc mắc về kỹ thuật thuật toán, tích hợp API hoặc phản hồi đóng góp đều được lắng nghe và hỗ trợ chu đáo.
          </p>
        </div>

        <div className="faq-contact-grid">
          {/* FAQ Accordion Column */}
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "20px" }}>
              ❓ Câu Hỏi Phổ Biến
            </h3>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="faq-item">
                  <div
                    className="faq-header"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: "12px", color: "var(--primary)" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                  {isOpen && <div className="faq-body">{faq.a}</div>}
                </div>
              );
            })}
          </div>

          {/* Contact Form Column */}
          <div>
            <div className="contact-card">
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: "0 0 8px 0" }}>
                📬 Gửi Lời Nhắn Đến Nhóm Phát Triển
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "24px" }}>
                Điền thông tin bên dưới để được phản hồi trong vòng 24 giờ làm việc.
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: "24px",
                    borderRadius: "14px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid var(--secondary)",
                    textAlign: "center",
                    color: "var(--secondary)",
                    fontWeight: "700",
                  }}
                >
                  🎉 Cảm ơn bạn! Lời nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Chủ đề quan tâm</label>
                    <select
                      className="form-input"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option value="api">Tích hợp API định tuyến</option>
                      <option value="enterprise">Giải pháp máy chủ riêng cho Doanh nghiệp</option>
                      <option value="feedback">Đóng góp ý kiến & Báo lỗi</option>
                      <option value="other">Hợp tác phát triển khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nội dung lời nhắn</label>
                    <textarea
                      rows="4"
                      placeholder="Mô tả nhu cầu hoặc câu hỏi cụ thể của bạn..."
                      className="form-textarea"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    🚀 Gửi Tin Nhắn Ngay
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="main-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div className="brand-icon">🗺️</div>
              <span style={{ fontSize: "1.3rem", fontWeight: "800" }}>SimpleMap</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.6" }}>
              Nền tảng định vị và dẫn đường trực tuyến thông minh, tối ưu hóa bằng thuật toán Dijkstra và hạ tầng OSRM mã nguồn mở.
            </p>
          </div>

          <div className="footer-col">
            <h4>Khám Phá</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate("home")}>Trang Chủ</button></li>
              <li><button onClick={() => onNavigate("live-map")}>Bản Đồ Trực Tiếp</button></li>
              <li><button onClick={() => onNavigate("features")}>Tính Năng Nổi Bật</button></li>
              <li><button onClick={() => onNavigate("algorithm")}>Mô Phỏng Thuật Toán</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Công Nghệ</h4>
            <ul className="footer-links">
              <li><a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">OpenStreetMap</a></li>
              <li><a href="http://project-osrm.org/" target="_blank" rel="noreferrer">OSRM Engine</a></li>
              <li><a href="https://leafletjs.com/" target="_blank" rel="noreferrer">Leaflet JS</a></li>
              <li><a href="https://react.dev/" target="_blank" rel="noreferrer">React 19</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ Trợ</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate("pricing-api")}>Tài Liệu API</button></li>
              <li><button onClick={() => onNavigate("benchmark")}>Số Liệu Hiệu Năng</button></li>
              <li><button onClick={() => onNavigate("faq-contact")}>Câu Hỏi Thường Gặp</button></li>
              <li><button onClick={() => onNavigate("faq-contact")}>Liên Hệ Trực Tiếp</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 SimpleMap - All rights reserved. Phát triển vì cộng đồng dữ liệu mở.</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Độ trễ máy chủ: &lt; 35ms</span>
            <span>•</span>
            <span>Phiên bản v2.0.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FaqContactSection;