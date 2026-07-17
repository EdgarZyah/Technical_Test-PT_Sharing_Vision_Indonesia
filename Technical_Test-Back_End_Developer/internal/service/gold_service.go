// Package service menyediakan business logic untuk transaksi emas.
// Layer ini mengkoordinasikan antara handler (HTTP) dan repository (database),
// serta mengambil harga emas dari price client.
package service

import (
	"errors"
	"haloemas-api/internal/domain"
	"haloemas-api/internal/price"
	"haloemas-api/internal/repository"
	"time"
)

// GoldService menangani business logic terkait emas: harga, beli, jual, dan saldo.
type GoldService struct {
	transactionRepo *repository.TransactionRepository
	userRepo        *repository.UserRepository
	priceClient     *price.Client
}

// NewGoldService membuat service baru dengan dependency injection.
func NewGoldService(
	transactionRepo *repository.TransactionRepository,
	userRepo *repository.UserRepository,
	priceClient *price.Client,
) *GoldService {
	return &GoldService{
		transactionRepo: transactionRepo,
		userRepo:        userRepo,
		priceClient:     priceClient,
	}
}

// GetPrice mengambil harga emas terkini dari API eksternal atau fallback.
func (s *GoldService) GetPrice() price.GoldPrice {
	return s.priceClient.FetchLatestPrice()
}

// Buy melakukan pembelian emas.
// Rumus: gram = amount / price.Buy
// amount adalah nominal Rupiah yang dibayarkan.
func (s *GoldService) Buy(userID int64, amount int64) (*domain.Transaction, error) {
	if amount <= 0 {
		return nil, errors.New("amount harus lebih dari 0")
	}

	p := s.priceClient.FetchLatestPrice()
	gram := float64(amount) / float64(p.Buy)

	tx := &domain.Transaction{
		UserID:    userID,
		Type:      "BUY",
		Amount:    amount,
		Gram:      gram,
		CreatedAt: time.Now(),
	}

	if err := s.transactionRepo.CreateTransaction(tx); err != nil {
		return nil, errors.New("gagal membuat transaksi")
	}

	return tx, nil
}

// Sell melakukan penjualan emas.
// Rumus: amount = gram * price.Sell
// Memvalidasi saldo user sebelum transaksi.
func (s *GoldService) Sell(userID int64, gram float64) (*domain.Transaction, error) {
	if gram <= 0 {
		return nil, errors.New("gram harus lebih dari 0")
	}

	// Validasi user exists
	user, err := s.userRepo.GetUserByID(userID)
	if err != nil || user == nil {
		return nil, errors.New("user tidak ditemukan")
	}

	// Hitung saldo emas user saat ini
	balance, err := s.GetUserBalance(userID)
	if err != nil {
		return nil, errors.New("gagal menghitung saldo")
	}

	// Pastikan saldo mencukupi
	if balance < gram {
		return nil, errors.New("saldo emas tidak cukup")
	}

	p := s.priceClient.FetchLatestPrice()
	amount := int64(gram * float64(p.Sell))

	tx := &domain.Transaction{
		UserID:    userID,
		Type:      "SELL",
		Amount:    amount,
		Gram:      gram,
		CreatedAt: time.Now(),
	}

	if err := s.transactionRepo.CreateTransaction(tx); err != nil {
		return nil, errors.New("gagal membuat transaksi")
	}

	return tx, nil
}

// GetUserBalance menghitung saldo emas user dalam gram.
// Algoritma: iterasi semua transaksi, tambahkan gram BUY, kurangkan gram SELL.
func (s *GoldService) GetUserBalance(userID int64) (float64, error) {
	transactions, err := s.transactionRepo.GetTransactionsByUserID(userID)
	if err != nil {
		return 0, err
	}

	var balance float64
	for _, tx := range transactions {
		switch tx.Type {
		case "BUY":
			balance += tx.Gram
		case "SELL":
			balance -= tx.Gram
		}
	}

	return balance, nil
}

// GetTransactions mengembalikan daftar transaksi user dari database.
func (s *GoldService) GetTransactions(userID int64) ([]domain.Transaction, error) {
	return s.transactionRepo.GetTransactionsByUserID(userID)
}
