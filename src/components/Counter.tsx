import "./Counter.css";
import { useState, useRef } from "react";
import { fetchCardByName } from "../services/scryfall";
import CardPicker from "./CardPicker";

interface CounterProps {
  count: number;
  setCount: (newCount: number) => void;
}

function Counter({ count, setCount }: CounterProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  async function doSearch(name?: string) {
    const term = (name ?? query).trim();
    if (!term) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchCardByName(term, controller.signal);
      setImageUrl(result.imageUrl || null);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="counter" style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
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

      <div className="scry-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          placeholder="Search card art"
        />
        <button onClick={() => doSearch()} disabled={loading}>{loading ? '...' : 'Find'}</button>
        <button onClick={() => { setImageUrl(null); setError(null); }}>Clear</button>
        <button onClick={() => setPickerOpen(true)}>Open picker</button>
        {error && <div className="scry-error">{error}</div>}
      </div>

      <CardPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(card) => {
          setImageUrl(card.imageUrl || null);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

export default Counter;
