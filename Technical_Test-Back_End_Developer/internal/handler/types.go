// Package handler menyediakan tipe data request/response untuk Swagger documentation.
// Tipe-tipe ini digunakan oleh swaggo untuk generate OpenAPI spec.
package handler

// BuyRequest adalah request body untuk pembelian emas.
type BuyRequest struct {
	Amount int64 `json:"amount" example:"500000"` // Nominal Rupiah yang dibayarkan
}

// BuyResponse adalah response setelah pembelian emas berhasil.
type BuyResponse struct {
	Gram  float64 `json:"gram" example:"0.257"`  // Berat emas yang diperoleh
	Price int64   `json:"price" example:"1945200"` // Harga beli per gram
}

// SellRequest adalah request body untuk penjualan emas.
type SellRequest struct {
	Gram float64 `json:"gram" example:"1"` // Berat emas yang dijual
}

// SellResponse adalah response setelah penjualan emas berhasil.
type SellResponse struct {
	Amount int64 `json:"amount" example:"1925000"` // Nominal Rupiah yang diterima
}

// BalanceResponse adalah response saldo emas user.
type BalanceResponse struct {
	Gram   float64 `json:"gram" example:"0.571"`   // Saldo emas dalam gram
	Amount int64   `json:"amount" example:"1110000"` // Nilai Rupiah dari saldo
}

// Transaction merepresentasikan satu record transaksi untuk response API.
type Transaction struct {
	ID        int64   `json:"id" example:"1"`
	UserID    int64   `json:"user_id" example:"1"`
	Type      string  `json:"type" example:"BUY"`        // "BUY" atau "SELL"
	Amount    int64   `json:"amount" example:"500000"`   // Nominal Rupiah
	Gram      float64 `json:"gram" example:"0.257"`      // Berat emas
	CreatedAt string  `json:"created_at" example:"2026-07-10T10:00:00Z"` // Waktu transaksi
}

// ErrorResponse adalah format error response standar.
type ErrorResponse struct {
	Error string `json:"error" example:"Amount harus lebih dari 0"`
}

// PriceResponse adalah response harga emas Antam terkini.
type PriceResponse struct {
	Buy  int64  `json:"buy" example:"1945200"`  // Harga beli per gram (yang dibayar pembeli)
	Sell int64  `json:"sell" example:"1925000"` // Harga jual/buyback per gram (yang diterima saat menjual)
	Date string `json:"date" example:"2026-07-16"` // Tanggal harga tercatat
}
