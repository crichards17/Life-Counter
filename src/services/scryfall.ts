// Service to fetch card data from Scryfall API
// Docs: https://scryfall.com/docs/api
export type ScryfallResult = {
  imageUrl?: string;
  name?: string;
  raw: any;
};

function chooseImageUrl(card: any): string | undefined {
  // For single-faced cards
  if (card.image_uris) {
    return card.image_uris.art_crop || card.image_uris.normal || card.image_uris.png;
  }

  // For double-faced or multi-faced cards
  if (Array.isArray(card.card_faces) && card.card_faces.length > 0) {
    const face = card.card_faces[0];
    if (face.image_uris) {
      return face.image_uris.art_crop || face.image_uris.normal || face.image_uris.png;
    }
  }

  return undefined;
}

// Fetch a card using the "named" endpoint with fuzzy matching.
// Returns image URL (if any), card name and the raw response.
export async function fetchCardByName(name: string, signal?: AbortSignal): Promise<ScryfallResult> {
  const encoded = encodeURIComponent(name.trim());
  const url = `https://api.scryfall.com/cards/named?fuzzy=${encoded}`;

  const res = await fetch(url, { signal });
  const json = await res.json();

  if (!res.ok) {
    // Scryfall returns a helpful JSON error object
    const errMsg = json?.details || json?.object || json?.status || 'Unknown Scryfall error';
    throw new Error(String(errMsg));
  }

  const imageUrl = chooseImageUrl(json);

  return {
    imageUrl: imageUrl,
    name: json?.name,
    raw: json,
  };
}

// Search endpoint for broader queries; returns array of candidate cards
export async function searchCards(query: string, signal?: AbortSignal): Promise<ScryfallResult[]> {
  const encoded = encodeURIComponent(query.trim());
  const url = `https://api.scryfall.com/cards/search?q=${encoded}`;

  const res = await fetch(url, { signal });
  const json = await res.json();

  if (!res.ok) {
    const errMsg = json?.details || json?.object || 'Scryfall search error';
    throw new Error(String(errMsg));
  }

  // map results to ScryfallResult
  return (json.data || []).map((card: any) => ({
    imageUrl: card.image_uris ? (card.image_uris.art_crop || card.image_uris.normal || card.image_uris.png) : (Array.isArray(card.card_faces) && card.card_faces[0]?.image_uris ? (card.card_faces[0].image_uris.art_crop || card.card_faces[0].image_uris.normal) : undefined),
    name: card.name,
    raw: card,
  }));
}
