import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/LandingPage.css";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LiveMapSection from "./components/LiveMapSection";
import FeaturesSection from "./components/FeaturesSection";
import AlgorithmSection from "./components/AlgorithmSection";
import HowItWorksSection from "./components/HowItWorksSection";
import StatsBenchmarkSection from "./components/StatsBenchmarkSection";
import PricingApiSection from "./components/PricingApiSection";
import FaqContactSection from "./components/FaqContactSection";

const PAGES = [
  { id: "home", label: "Trang Chủ", icon: "🏠" },
  { id: "live-map", label: "Bản Đồ Live", icon: "🗺️" },
  { id: "features", label: "Tính Năng", icon: "⚡" },
  { id: "algorithm", label: "Thuật Toán", icon: "🧠" },
  { id: "how-it-works", label: "Quy Trình", icon: "🔄" },
  { id: "benchmark", label: "Hiệu Năng", icon: "📊" },
  { id: "pricing-api", label: "Bảng Giá & API", icon: "💎" },
  { id: "faq-contact", label: "FAQ & Liên Hệ", icon: "💬" },
];

function App() {
  const [activePage, setActivePage] = useState("home");
  const [viewMode, setViewMode] = useState("scroll"); // 'scroll' or 'tabs'
  const [theme, setTheme] = useState("light");

  // Apply data-theme to HTML tag for global theme variables
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    if (viewMode === "scroll") {
      const el = document.getElementById(pageId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="landing-container" data-theme={theme}>
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-ambient-orb orb-primary"></div>
      <div className="bg-ambient-orb orb-accent"></div>
      <div className="bg-ambient-orb orb-secondary"></div>

      {/* Main Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        setTheme={setTheme}
        pages={PAGES}
      />

      {/* Quick Tab Bar Switcher (Useful in Tab Mode or as secondary quick bar) */}
      <div className="page-tab-strip">
        <span style={{ fontSize: "12px", color: "var(--text-muted)", marginRight: "8px", fontWeight: "600" }}>
          {viewMode === "tabs" ? "📑 Chọn trang xem (8 trang):" : "📜 Danh mục cuộn nhanh:"}
        </span>
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`page-tab-item ${activePage === p.id ? "active" : ""}`}
            onClick={() => handleNavigate(p.id)}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Content Rendering based on ViewMode */}
      {viewMode === "tabs" ? (
        // Dedicated Tab / Page View: Shows selected page only
        <main style={{ minHeight: "75vh", display: "flex", flexDirection: "column" }}>
          {activePage === "home" && (
            <HeroSection
              onExploreMap={() => handleNavigate("live-map")}
              onExploreAlgo={() => handleNavigate("algorithm")}
              onExploreApi={() => handleNavigate("pricing-api")}
            />
          )}
          {activePage === "live-map" && <LiveMapSection theme={theme} />}
          {activePage === "features" && <FeaturesSection />}
          {activePage === "algorithm" && <AlgorithmSection />}
          {activePage === "how-it-works" && <HowItWorksSection />}
          {activePage === "benchmark" && <StatsBenchmarkSection />}
          {activePage === "pricing-api" && (
            <PricingApiSection onContactClick={() => handleNavigate("faq-contact")} />
          )}
          {activePage === "faq-contact" && (
            <FaqContactSection onNavigate={handleNavigate} />
          )}
        </main>
      ) : (
        // Continuous Scroll Mode: Displays all 8 pages sequentially
        <main>
          <HeroSection
            onExploreMap={() => handleNavigate("live-map")}
            onExploreAlgo={() => handleNavigate("algorithm")}
            onExploreApi={() => handleNavigate("pricing-api")}
          />
          <LiveMapSection theme={theme} />
          <FeaturesSection />
          <AlgorithmSection />
          <HowItWorksSection />
          <StatsBenchmarkSection />
          <PricingApiSection onContactClick={() => handleNavigate("faq-contact")} />
          <FaqContactSection onNavigate={handleNavigate} />
        </main>
      )}
    </div>
  );
}

export default App;