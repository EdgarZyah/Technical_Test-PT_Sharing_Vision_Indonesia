// Package domain mendefinisikan model data utama aplikasi HaloEmas.
package domain

import "time"

// User merepresentasikan data pengguna.
type User struct {
	ID    int64  `json:"id"`
	Nama  string `json:"nama"`
	Email string `json:"email"`
}

// Transaction merepresentasikan satu record transaksi emas.
// Type bernilai "BUY" atau "SELL".
// Amount dalam Rupiah (integer), Gram dalam satuan gram (float).
type Transaction struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`    // ID user pemilik transaksi
	Type      string    `json:"type"`       // "BUY" atau "SELL"
	Amount    int64     `json:"amount"`     // Nominal Rupiah (integer)
	Gram      float64   `json:"gram"`       // Berat emas dalam gram
	CreatedAt time.Time `json:"created_at"` // Waktu transaksi dibuat
}
