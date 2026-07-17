package handler

// BuyRequest represents the request body for buying gold.
type BuyRequest struct {
	Amount int64 `json:"amount" example:"500000"`
}

// BuyResponse represents the response after buying gold.
type BuyResponse struct {
	Gram  float64 `json:"gram" example:"0.257"`
	Price int64   `json:"price" example:"1945200"`
}

// SellRequest represents the request body for selling gold.
type SellRequest struct {
	Gram float64 `json:"gram" example:"1"`
}

// SellResponse represents the response after selling gold.
type SellResponse struct {
	Amount int64 `json:"amount" example:"1925000"`
}

// BalanceResponse represents the gold balance of a user.
type BalanceResponse struct {
	Gram   float64 `json:"gram" example:"0.571"`
	Amount int64   `json:"amount" example:"1110000"`
}

// Transaction represents a single transaction record.
type Transaction struct {
	ID        int64   `json:"id" example:"1"`
	UserID    int64   `json:"user_id" example:"1"`
	Type      string  `json:"type" example:"BUY"`
	Amount    int64   `json:"amount" example:"500000"`
	Gram      float64 `json:"gram" example:"0.257"`
	CreatedAt string  `json:"created_at" example:"2026-07-10T10:00:00Z"`
}

// ErrorResponse represents a standard error response.
type ErrorResponse struct {
	Error string `json:"error" example:"Amount harus lebih dari 0"`
}

// PriceResponse represents the current gold price (Antam).
type PriceResponse struct {
	Buy  int64  `json:"buy" example:"1945200"`
	Sell int64  `json:"sell" example:"1925000"`
	Date string `json:"date" example:"2026-07-16"`
}
