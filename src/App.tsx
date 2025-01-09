import { useState } from "react";
import Counter from "./components/Counter";
import "./App.css";

function App() {
  const [counts, setCounts] = useState([0, 0, 0, 0]); // State for 4 counters

  // Function to reset all counts to zero
  const resetCounts = () => {
    setCounts([0, 0, 0, 0]);
  };

  return (
    <div className="App">
      <div className="reset-button-container">
        <button className="reset-button" onClick={resetCounts}>
          Reset
        </button>
      </div>
      <div className="counter-grid">
        {counts.map((count, index) => (
          <Counter
            key={index}
            count={count}
            setCount={(newCount) => {
              const newCounts = [...counts];
              newCounts[index] = newCount;
              setCounts(newCounts);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
