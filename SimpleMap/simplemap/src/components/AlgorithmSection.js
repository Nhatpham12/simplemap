import React, { useState, useEffect } from "react";

// Pre-defined graph nodes and edges for visualization
const NODES = [
  { id: "A", label: "A (Bắt đầu)", x: 80, y: 150, role: "start" },
  { id: "B", label: "B (Ngã 4)", x: 220, y: 70, role: "intermediate" },
  { id: "C", label: "C (Cầu lớn)", x: 220, y: 230, role: "intermediate" },
  { id: "D", label: "D (Đại lộ)", x: 420, y: 100, role: "intermediate" },
  { id: "E", label: "E (Đường vòng)", x: 400, y: 250, role: "intermediate" },
  { id: "F", label: "F (Đích đến)", x: 580, y: 160, role: "target" },
];

const EDGES = [
  { from: "A", to: "B", weight: 4, path: "A-B" },
  { from: "A", to: "C", weight: 2, path: "A-C" },
  { from: "B", to: "C", weight: 1, path: "B-C" },
  { from: "B", to: "D", weight: 5, path: "B-D" },
  { from: "C", to: "D", weight: 8, path: "C-D" },
  { from: "C", to: "E", weight: 6, path: "C-E" },
  { from: "D", to: "E", weight: 2, path: "D-E" },
  { from: "D", to: "F", weight: 3, path: "D-F" },
  { from: "E", to: "F", weight: 4, path: "E-F" },
];

const SIMULATION_STEPS = [
  {
    step: 0,
    currentNode: null,
    visitedNodes: [],
    highlightEdges: [],
    shortestPath: [],
    status: 'Nhấn "Chạy mô phỏng" để bắt đầu quan sát thuật toán Dijkstra tìm đường từ A đến F.',
  },
  {
    step: 1,
    currentNode: "A",
    visitedNodes: ["A"],
    highlightEdges: ["A-B", "A-C"],
    shortestPath: [],
    status: "Bước 1: Khởi tạo khoảng cách. Đỉnh A (0 km). Xét các lân cận B (4 km) và C (2 km). C là đỉnh gần nhất chưa thăm.",
  },
  {
    step: 2,
    currentNode: "C",
    visitedNodes: ["A", "C"],
    highlightEdges: ["A-C", "B-C", "C-D", "C-E"],
    shortestPath: [],
    status: "Bước 2: Ghé thăm C (2 km). Cập nhật khoảng cách tới B qua C là 2+1 = 3 km (nhỏ hơn 4 km). Cập nhật E (8 km), D (10 km).",
  },
  {
    step: 3,
    currentNode: "B",
    visitedNodes: ["A", "C", "B"],
    highlightEdges: ["A-C", "B-C", "B-D"],
    shortestPath: [],
    status: "Bước 3: Ghé thăm B (3 km). Cập nhật khoảng cách tới D qua B: 3 + 5 = 8 km (tối ưu hơn nhánh C->D là 10 km).",
  },
  {
    step: 4,
    currentNode: "D",
    visitedNodes: ["A", "C", "B", "D"],
    highlightEdges: ["A-C", "B-C", "B-D", "D-F"],
    shortestPath: [],
    status: "Bước 4: Ghé thăm D (8 km). Xét lân cận đến F: 8 + 3 = 11 km. Xét lân cận E: 8 + 2 = 10 km.",
  },
  {
    step: 5,
    currentNode: "F",
    visitedNodes: ["A", "C", "B", "D", "F"],
    highlightEdges: ["A-C", "B-C", "B-D", "D-F"],
    shortestPath: ["A-C", "B-C", "B-D", "D-F"],
    status: "Hoàn tất! Đã đến đích F với tổng khoảng cách ngắn nhất là 11 km (Lộ trình tối ưu: A → C → B → D → F).",
  },
];

function AlgorithmSection() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);

  const currentStep = SIMULATION_STEPS[currentStepIndex];

  // Auto-run simulation
  useEffect(() => {
    let timer;
    if (autoPlaying) {
      if (currentStepIndex < SIMULATION_STEPS.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 1600);
      } else {
        setAutoPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [autoPlaying, currentStepIndex]);

  const handleNextStep = () => {
    if (currentStepIndex < SIMULATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setAutoPlaying(false);
    setCurrentStepIndex(0);
  };

  const isEdgeHighlighted = (from, to) => {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    return (
      currentStep.highlightEdges.includes(key1) ||
      currentStep.highlightEdges.includes(key2)
    );
  };

  const isEdgeShortest = (from, to) => {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    return (
      currentStep.shortestPath.includes(key1) ||
      currentStep.shortestPath.includes(key2)
    );
  };

  return (
    <section id="algorithm" className="section-wrapper animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="section-badge">
          <span>🧠</span>
          <span>Khoa Học Định Tuyến & Đồ Thị</span>
        </div>
        <h2 className="section-title">
          Mô Phỏng Trực Quan <span className="gradient-text">Thuật Toán Dijkstra</span>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          Tìm hiểu cách thuật toán tìm đường duyệt qua các đỉnh và cung của đồ thị giao thông để xác định lộ trình ngắn nhất với độ trễ tính bằng mili-giây.
        </p>
      </div>

      <div className="algorithm-container">
        {/* Controls Bar */}
        <div className="algo-controls">
          <div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)" }}>
              Tiến trình: Bước {currentStepIndex} / {SIMULATION_STEPS.length - 1}
            </span>
          </div>

          <div className="algo-btn-group">
            <button
              className="btn-secondary"
              onClick={handleNextStep}
              disabled={currentStepIndex >= SIMULATION_STEPS.length - 1 || autoPlaying}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              ⏭️ Bước kế tiếp
            </button>
            <button
              className="btn-primary"
              onClick={() => setAutoPlaying(!autoPlaying)}
              style={{ padding: "8px 18px", fontSize: "13px" }}
            >
              {autoPlaying ? "⏸️ Tạm dừng" : "▶️ Tự động chạy"}
            </button>
            <button
              className="btn-secondary"
              onClick={handleReset}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              🔄 Đặt lại
            </button>
          </div>
        </div>

        {/* SVG Interactive Canvas Box */}
        <div className="graph-canvas-box">
          <svg
            viewBox="0 0 660 320"
            style={{ width: "100%", height: "100%", maxWidth: "700px" }}
          >
            {/* Draw Edges */}
            {EDGES.map((e, idx) => {
              const fromNode = NODES.find((n) => n.id === e.from);
              const toNode = NODES.find((n) => n.id === e.to);
              const isShortest = isEdgeShortest(e.from, e.to);
              const isHighlight = isEdgeHighlighted(e.from, e.to);

              let strokeColor = "var(--border-color)";
              let strokeWidth = 2;

              if (isShortest) {
                strokeColor = "#10b981";
                strokeWidth = 4;
              } else if (isHighlight) {
                strokeColor = "#3b82f6";
                strokeWidth = 3;
              }

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2 - 6;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isShortest ? "none" : isHighlight ? "4 2" : "none"}
                    style={{ transition: "all 0.4s ease" }}
                  />
                  {/* Weight Badge */}
                  <rect
                    x={midX - 12}
                    y={midY - 10}
                    width={24}
                    height={18}
                    rx={4}
                    fill="var(--bg-card)"
                    stroke="var(--border-color)"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="var(--text-muted)"
                  >
                    {e.weight}k
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {NODES.map((node) => {
              const isCurrent = currentStep.currentNode === node.id;
              const isVisited = currentStep.visitedNodes.includes(node.id);
              const isShortestNode =
                currentStep.shortestPath.length > 0 &&
                ["A", "C", "B", "D", "F"].includes(node.id);

              let fillColor = "var(--bg-card)";
              let strokeColor = "var(--border-color)";

              if (isShortestNode) {
                fillColor = "#10b981";
                strokeColor = "#059669";
              } else if (isCurrent) {
                fillColor = "#f59e0b";
                strokeColor = "#d97706";
              } else if (isVisited) {
                fillColor = "#3b82f6";
                strokeColor = "#2563eb";
              }

              return (
                <g key={node.id} style={{ cursor: "pointer" }}>
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={28}
                      fill="rgba(245, 158, 11, 0.2)"
                      className="animate-pulse-glow"
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={3}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={isVisited || isShortestNode || isCurrent ? "#fff" : "var(--text-main)"}
                  >
                    {node.id}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="var(--text-muted)"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Status Message */}
        <div className="algo-status-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>📌</span>
            <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
              {currentStep.status}
            </span>
          </div>
        </div>

        {/* Theoretical Comparisons */}
        <div className="algo-explanation-grid">
          <div className="algo-card">
            <h4>1. Thuật Toán Dijkstra Cổ Điển</h4>
            <p>
              Duyệt qua các đỉnh có khoảng cách tạm thời nhỏ nhất, mở rộng láng giềng theo phương pháp tham lam (Greedy). Luôn đảm bảo tìm ra đường ngắn nhất với trọng số không âm.
            </p>
          </div>
          <div className="algo-card">
            <h4>2. Mở Rộng A* (Heuristic Search)</h4>
            <p>
              Kết hợp hàm chi phí thực tế g(n) và ước lượng khoảng cách chim bay h(n), giúp thu hẹp không gian tìm kiếm trực tiếp hướng thẳng về điểm đích thay vì mở rộng hình cầu.
            </p>
          </div>
          <div className="algo-card">
            <h4>3. OSRM Contraction Hierarchies</h4>
            <p>
              Kỹ thuật đỉnh cao dùng trong sản phẩm: Tiền tính toán trước cấu trúc đường phố, tạo ra các đường tắt (shortcuts) giảm đồ thị hàng triệu điểm xuống vài chục bước truy vấn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AlgorithmSection;