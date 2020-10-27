import logo from "./logo.svg";
import "./App.css";
import Players from "./components/Players";
import Timer from "./components/Timer";

function App() {

  return (
    <div className="center">
      <div className="game-area">
        {" "}
        <Players></Players>{" "}
      </div>

      <h3>Timer</h3>
      <Timer></Timer>
    </div>
  );
}

export default App;
