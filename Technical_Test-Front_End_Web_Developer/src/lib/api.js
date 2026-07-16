const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Fetch gold prices from microservice API.
 * Maps API response to frontend format: { buy, sell, date }.
 * Returns null if API is unreachable.
 */
export async function fetchGoldPrices({ source = "galeri24", brand = "ANTAM", weight = 1, length = 500 } = {}) {
  try {
    const params = new URLSearchParams({
      source,
      brand,
      weight: String(weight),
      length: String(length),
    });

    const res = await fetch(`${API_BASE}/api/prices?${params}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return null;

    return json.data
      .map((item) => ({
        buy: item.sellPrice,
        sell: item.buybackPrice,
        date: item.recordedDate,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return null;
  }
}

/**
 * Check if microservice API is reachable.
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
