export const formatRupiah = (amount) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('id-ID');
  return isNegative ? `-Rp${formatted}` : `Rp${formatted}`;
};

export const formatGram = (gram) => {
  return `${gram.toFixed(4)} gr`;
};

export const calculateGramFromRupiah = (amount, pricePerGram) => {
  if (amount <= 0 || pricePerGram <= 0) return 0;
  return amount / pricePerGram;
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatShortDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};
