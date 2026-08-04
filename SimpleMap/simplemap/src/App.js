import "./App.css";
import Map from "./components/Map";

function App() {
  const key = "AIzaSyCeichgpulXh76_HEF6xasNLLiXrVO5BT8";

  return (
    <div className="App">
      <header style={{ padding: "10px", fontSize: "1.5rem" }}>Map Demo</header>
      <div
        style={{
          height: "90vh",
          margin: "auto",
          border: "2px solid black",
        }}
      >
        <Map apiKey={key} />
      </div>
    </div>
  );
}

export default App;
