import { useState, useRef, useEffect } from 'react';
import './CardPicker.css';
import { searchCards, type ScryfallResult } from '../services/scryfall';

interface CardPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (card: ScryfallResult) => void;
}

export default function CardPicker({ open, onClose, onSelect }: CardPickerProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScryfallResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [open]);

  async function doSearch() {
    const term = query.trim();
    if (!term) return;

    abortRef.current?.abort();
    const c = new AbortController();
    abortRef.current = c;

    setLoading(true);
    setError(null);

    try {
      const res = await searchCards(term, c.signal);
      setResults(res);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="card-picker">
      <div className="card-picker-inner">
        <div className="card-picker-header">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
            placeholder="Search Scryfall (name, oracle text, set...)"
            autoFocus
          />
          <div className="header-buttons">
            <button onClick={() => doSearch()} disabled={loading}>{loading ? '...' : 'Search'}</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="card-picker-results">
          {error && <div className="picker-error">{error}</div>}
          {results.length === 0 && !loading && <div className="picker-empty">No results</div>}
          {results.map((c, i) => (
            <button key={i} className="picker-card" onClick={() => onSelect(c)}>
              {c.imageUrl ? <img src={c.imageUrl} alt={c.name} /> : <div className="no-image">{c.name}</div>}
              <div className="card-name">{c.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
