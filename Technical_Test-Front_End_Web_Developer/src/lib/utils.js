export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatGram(gram) {
  return `${gram.toFixed(4)} gr`;
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export function calculateGram(rupiah, pricePerGram) {
  if (pricePerGram <= 0) return 0;
  return rupiah / pricePerGram;
}

export function calculateRupiah(gram, pricePerGram) {
  return gram * pricePerGram;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
