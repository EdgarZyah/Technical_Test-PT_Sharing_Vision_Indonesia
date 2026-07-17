// Package handler menyediakan HTTP handler untuk endpoint transaksi emas.
package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"haloemas-api/internal/response"
	"haloemas-api/internal/service"
)

// GoldHandler menangani HTTP request terkait transaksi emas.
type GoldHandler struct {
	goldService *service.GoldService
}

// NewGoldHandler membuat handler baru dengan GoldService.
func NewGoldHandler(goldService *service.GoldService) *GoldHandler {
	return &GoldHandler{goldService: goldService}
}

// GetPrice godoc
// @Summary      Get gold price
// @Description  Mengembalikan harga emas Antam terkini (buy/sell) dari API hargaemas.logikarya.com
// @Tags         Gold
// @Produce      json
// @Success      200  {object}  PriceResponse
// @Failure      503  {object}  ErrorResponse
// @Router       /api/price [get]
func (h *GoldHandler) GetPrice(w http.ResponseWriter, r *http.Request) {
	p := h.goldService.GetPrice()
	response.JSON(w, http.StatusOK, PriceResponse{
		Buy:  p.Buy,
		Sell: p.Sell,
		Date: p.Date,
	})
}

// Buy godoc
// @Summary      Buy gold
// @Description  Membeli emas berdasarkan nominal Rupiah menggunakan harga beli Antam terkini
// @Tags         Gold
// @Accept       json
// @Produce      json
// @Param        X-User-ID  header    string      true  "User ID"
// @Param        body       body      BuyRequest  true  "Jumlah pembelian dalam Rupiah"
// @Success      200  {object}  BuyResponse
// @Failure      400  {object}  ErrorResponse
// @Router       /api/buy [post]
func (h *GoldHandler) Buy(w http.ResponseWriter, r *http.Request) {
	var req BuyRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Amount <= 0 {
		response.Error(w, http.StatusBadRequest, "Amount harus lebih dari 0")
		return
	}

	userID, err := extractUserID(r)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "User ID tidak valid")
		return
	}

	tx, err := h.goldService.Buy(userID, req.Amount)
	if err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	// Ambil harga terkini untuk dimasukkan ke response
	p := h.goldService.GetPrice()
	response.JSON(w, http.StatusOK, BuyResponse{
		Gram:  tx.Gram,
		Price: p.Buy,
	})
}

// Sell godoc
// @Summary      Sell gold
// @Description  Menjual emas berdasarkan berat gram menggunakan harga jual (buyback) Antam terkini
// @Tags         Gold
// @Accept       json
// @Produce      json
// @Param        X-User-ID  header    string      true  "User ID"
// @Param        body       body      SellRequest  true  "Jumlah emas yang dijual dalam gram"
// @Success      200  {object}  SellResponse
// @Failure      400  {object}  ErrorResponse
// @Router       /api/sell [post]
func (h *GoldHandler) Sell(w http.ResponseWriter, r *http.Request) {
	var req SellRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Gram <= 0 {
		response.Error(w, http.StatusBadRequest, "Gram harus lebih dari 0")
		return
	}

	userID, err := extractUserID(r)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "User ID tidak valid")
		return
	}

	tx, err := h.goldService.Sell(userID, req.Gram)
	if err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, SellResponse{
		Amount: tx.Amount,
	})
}

// GetTransactions godoc
// @Summary      Get transactions
// @Description  Menampilkan daftar riwayat transaksi user
// @Tags         Transactions
// @Produce      json
// @Param        X-User-ID  header    string  true  "User ID"
// @Success      200  {array}   Transaction
// @Failure      400  {object}  ErrorResponse
// @Router       /api/transactions [get]
func (h *GoldHandler) GetTransactions(w http.ResponseWriter, r *http.Request) {
	userID, err := extractUserID(r)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "User ID tidak valid")
		return
	}

	transactions, err := h.goldService.GetTransactions(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil data transaksi")
		return
	}

	// Return array kosong (bukan null) jika tidak ada transaksi
	if transactions == nil {
		response.JSON(w, http.StatusOK, []map[string]interface{}{})
		return
	}

	response.JSON(w, http.StatusOK, transactions)
}

// GetBalance godoc
// @Summary      Get gold balance
// @Description  Menampilkan saldo emas user dalam gram dan nilai Rupiah berdasarkan harga jual terkini
// @Tags         Balance
// @Produce      json
// @Param        X-User-ID  header    string  true  "User ID"
// @Success      200  {object}  BalanceResponse
// @Failure      400  {object}  ErrorResponse
// @Router       /api/balance [get]
func (h *GoldHandler) GetBalance(w http.ResponseWriter, r *http.Request) {
	userID, err := extractUserID(r)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "User ID tidak valid")
		return
	}

	balance, err := h.goldService.GetUserBalance(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menghitung saldo")
		return
	}

	// Konversi gram ke Rupiah menggunakan harga jual terkini
	p := h.goldService.GetPrice()
	amount := int64(balance * float64(p.Sell))

	response.JSON(w, http.StatusOK, BalanceResponse{
		Gram:   balance,
		Amount: amount,
	})
}

// extractUserID mengekstrak user ID dari header X-User-ID atau query parameter user_id.
// Header X-User-ID diprioritaskan. Mengembalikan error jika tidak valid atau kosong.
func extractUserID(r *http.Request) (int64, error) {
	userIDStr := r.Header.Get("X-User-ID")
	if userIDStr == "" {
		userIDStr = r.URL.Query().Get("user_id")
	}

	return strconv.ParseInt(userIDStr, 10, 64)
}
