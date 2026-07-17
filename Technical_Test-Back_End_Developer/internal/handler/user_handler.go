package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"haloemas-api/internal/response"
	"haloemas-api/internal/service"
)

// UserHandler menangani HTTP request terkait user (register, profile).
type UserHandler struct {
	goldService *service.GoldService
	db          *sql.DB // Digunakan langsung untuk query profile (bypass repo layer)
}

// NewUserHandler membuat handler baru.
func NewUserHandler(goldService *service.GoldService, db *sql.DB) *UserHandler {
	return &UserHandler{goldService: goldService, db: db}
}

// GetProfile godoc
// @Summary      Get user profile
// @Description  Menampilkan profil user termasuk saldo emas
// @Tags         User
// @Produce      json
// @Param        X-User-ID  header    string  true  "User ID"
// @Success      200  {object}  ProfileResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Router       /api/profile [get]
func (h *UserHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID, err := extractUserID(r)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "User ID tidak valid")
		return
	}

	// Query langsung ke database untuk data profil
	// (bypass repository layer untuk query sederhana)
	var nama, email string
	err = h.db.QueryRow("SELECT nama, email FROM users WHERE id = $1", userID).
		Scan(&nama, &email)
	if err != nil {
		if err == sql.ErrNoRows {
			response.Error(w, http.StatusNotFound, "User tidak ditemukan")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Gagal mengambil profil")
		return
	}

	// Hitung saldo emas user
	balance, err := h.goldService.GetUserBalance(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal menghitung saldo")
		return
	}

	// Konversi gram ke Rupiah menggunakan harga jual terkini
	p := h.goldService.GetPrice()
	amount := int64(balance * float64(p.Sell))

	response.JSON(w, http.StatusOK, ProfileResponse{
		ID:     userID,
		Nama:   nama,
		Email:  email,
		Gram:   balance,
		Amount: amount,
	})
}

// Register godoc
// @Summary      Register new user
// @Description  Mendaftarkan user baru
// @Tags         User
// @Accept       json
// @Produce      json
// @Param        body  body      RegisterRequest  true  "Data user baru"
// @Success      201  {object}  RegisterResponse
// @Failure      400  {object}  ErrorResponse
// @Router       /api/register [post]
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Nama == "" {
		response.Error(w, http.StatusBadRequest, "Nama tidak boleh kosong")
		return
	}

	if req.Email == "" {
		response.Error(w, http.StatusBadRequest, "Email tidak boleh kosong")
		return
	}

	var id int64
	err := h.db.QueryRow(
		"INSERT INTO users (nama, email) VALUES ($1, $2) RETURNING id",
		req.Nama, req.Email,
	).Scan(&id)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Gagal mendaftarkan user")
		return
	}

	response.JSON(w, http.StatusCreated, RegisterResponse{
		ID:      id,
		Nama:    req.Nama,
		Email:   req.Email,
		Message: "Registrasi berhasil",
	})
}

// RegisterRequest adalah request body untuk registrasi user baru.
type RegisterRequest struct {
	Nama  string `json:"nama" example:"Budi Hartono"`
	Email string `json:"email" example:"budi@example.com"`
}

// RegisterResponse adalah response setelah registrasi user berhasil.
type RegisterResponse struct {
	ID      int64  `json:"id" example:"1"`
	Nama    string `json:"nama" example:"Budi Hartono"`
	Email   string `json:"email" example:"budi@example.com"`
	Message string `json:"message" example:"Registrasi berhasil"`
}

// ProfileResponse adalah response profil user beserta saldo emas.
type ProfileResponse struct {
	ID     int64   `json:"id" example:"1"`
	Nama   string  `json:"nama" example:"Budi Hartono"`
	Email  string  `json:"email" example:"budi@example.com"`
	Gram   float64 `json:"gram" example:"0.571"`
	Amount int64   `json:"amount" example:"1110000"`
}
