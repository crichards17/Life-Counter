import { useState } from "react";
import Counter from "./components/Counter";
import ControlBar from "./components/ControlBar";
import "./App.css";

function App() {
  const [startingLife, setStartingLife] = useState([40, 40, 40, 40]);
  const [counts, setCounts] = useState(startingLife); // State for 4 counters

  // Function to reset all counts to zero
  const resetCounts = () => {
    setCounts(startingLife);
  };

  

  return (
    <div className="App">
      <ControlBar onReset={resetCounts} />

      <div className="top-row">
        {counts.slice(0, 2).map((count, index) => (
          <div className="top-counter" key={index}>
            <Counter
              count={count}
              setCount={(newCount) => {
                const newCounts = [...counts];
                newCounts[index] = newCount;
                setCounts(newCounts);
              }}
            />
          </div>
        ))}
      </div>

      <div className="bottom-row">
        {counts.slice(2, 4).map((count, i) => (
          <div className="bottom-counter" key={i + 2}>
            <Counter
              count={count}
              setCount={(newCount) => {
                const newCounts = [...counts];
                newCounts[i + 2] = newCount;
                setCounts(newCounts);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
