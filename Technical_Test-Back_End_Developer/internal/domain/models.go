package domain

import "time"

type User struct {
	ID    int64  `json:"id"`
	Nama  string `json:"nama"`
	Email string `json:"email"`
}

type Transaction struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Type      string    `json:"type"`
	Amount    int64     `json:"amount"`
	Gram      float64   `json:"gram"`
	CreatedAt time.Time `json:"created_at"`
}
