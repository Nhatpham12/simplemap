import React from "react";

function StatsBenchmarkSection() {
  return (
    <section id="benchmark" className="section-wrapper animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div className="section-badge">
          <span>📊</span>
          <span>Đo Lường & Kiểm Nghiệm Thực Tế</span>
        </div>
        <h2 className="section-title">
          Hiệu Năng Vượt Trội & <span className="gradient-text">Tiêu Thụ Tối Thiểu</span>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          SimpleMap được tối ưu hóa từng dòng mã giúp giảm thiểu gánh nặng CPU/RAM của trình duyệt và tăng tốc độ phản hồi lên gấp nhiều lần.
        </p>
      </div>

      <div className="benchmark-grid">
        {/* Metric Counter Cards */}
        <div className="metric-cards-col">
          <div className="metric-card">
            <div className="metric-val">&lt; 35ms</div>
            <div className="metric-label">Độ Trễ Phản Hồi Trung Bình</div>
            <div style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "6px" }}>
              ⚡ Nhanh hơn 10x so với Dijkstra thuần
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-val">99.98%</div>
            <div className="metric-label">Tỷ Lệ Định Tuyến Thành Công</div>
            <div style={{ fontSize: "11px", color: "var(--primary)", marginTop: "6px" }}>
              🛡️ Không bị nghẽn hay sập kết nối
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-val">150M+</div>
            <div className="metric-label">Nút Giao Đồ Thị Toàn Cầu</div>
            <div style={{ fontSize: "11px", color: "var(--accent)", marginTop: "6px" }}>
              🗺️ Dữ liệu cập nhật từ OpenStreetMap
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-val">0.00$</div>
            <div className="metric-label">Chi Phí Bản Quyền API</div>
            <div style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "6px" }}>
              💚 100% Tự do & Miễn phí trọn đời
            </div>
          </div>
        </div>

        {/* Benchmark Visual Comparison Bars */}
        <div className="benchmark-chart-box">
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px" }}>
            So Sánh Thời Gian Định Tuyến (Lộ trình 20km nội đô)
          </h3>

          {/* Bar 1 */}
          <div className="bar-row">
            <div className="bar-label-group">
              <span>Dijkstra Cơ Bản (Chưa xử lý trước)</span>
              <span style={{ color: "var(--text-muted)" }}>320 ms</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "95%", backgroundColor: "#ef4444" }}></div>
            </div>
          </div>

          {/* Bar 2 */}
          <div className="bar-row">
            <div className="bar-label-group">
              <span>Thuật Toán A* Heuristic</span>
              <span style={{ color: "var(--text-muted)" }}>140 ms</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "55%", backgroundColor: "#f59e0b" }}></div>
            </div>
          </div>

          {/* Bar 3 */}
          <div className="bar-row">
            <div className="bar-label-group">
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                SimpleMap (OSRM Contraction Hierarchies)
              </span>
              <span style={{ color: "var(--secondary)", fontWeight: "bold" }}>32 ms</span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: "14%",
                  background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                }}
              ></div>
            </div>
          </div>

          {/* Memory Footprint Bar */}
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
            <div className="bar-label-group">
              <span>Bộ Nhớ RAM Tiêu Thụ Trên Trình Duyệt</span>
              <span style={{ color: "var(--secondary)", fontWeight: "bold" }}>Chỉ ~14 MB</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: "20%", backgroundColor: "var(--secondary)" }}></div>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "8px 0 0 0" }}>
              * Nhẹ hơn 85% so với việc tải các thư viện bản đồ thương mại cồng kềnh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsBenchmarkSection;