import "./ControlBar.css";

interface ControlBarProps {
  onReset?: () => void;
}

export default function ControlBar({ onReset }: ControlBarProps) {
  return (
    <div className="reset-bar">
      <div className="reset-bar-inner">
        <button className="reset-button" onClick={onReset}>
          Reset
        </button>
        {/* placeholder for future buttons */}
      </div>
    </div>
  );
}
