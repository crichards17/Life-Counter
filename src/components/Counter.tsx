import "./Counter.css";

interface CounterProps {
  count: number;
  setCount: (newCount: number) => void;
}

function Counter({ count, setCount }: CounterProps) {
  return (
    <div className="counter">
      <div
        className="button-section left"
        onClick={() => setCount(count - 1)}
      ></div>
      <div className="button-section center">
        <span className="center-count">{count}</span>
      </div>
      <div
        className="button-section right"
        onClick={() => setCount(count + 1)}
      ></div>
    </div>
  );
}

export default Counter;
