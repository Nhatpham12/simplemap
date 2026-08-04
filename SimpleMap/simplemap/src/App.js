import "./App.css";
import Map from "./components/Map";

function App() {
  return (
    <div className="App">
      <header
        style={{
          padding: "12px 20px",
          fontSize: "1.3rem",
          fontWeight: "bold",
          backgroundColor: "#4285f4",
          color: "#fff",
        }}
      >
        SimpleMap - Dijkstra Routing
      </header>
      <div className="map-wrapper">
        <Map />
      </div>
    </div>
  );
}

export default App;
