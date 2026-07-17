const API_BASE = 'https://hargaemas.logikarya.com';

export async function fetchGoldPrices({ source = 'galeri24', brand = 'ANTAM', weight = 1, length = 30 } = {}) {
  try {
    const params = new URLSearchParams({
      source,
      brand,
      weight: String(weight),
      length: String(length),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/api/prices?${params}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

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

export async function fetchLatestPrice(brand = 'ANTAM') {
  const data = await fetchGoldPrices({ brand, length: 2 });
  if (!data || data.length === 0) return null;
  return data[data.length - 1];
}
