package service

import (
	"errors"
	"haloemas-api/internal/domain"
	"haloemas-api/internal/price"
	"haloemas-api/internal/repository"
	"time"
)

type GoldService struct {
	transactionRepo *repository.TransactionRepository
	userRepo        *repository.UserRepository
	priceClient     *price.Client
}

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

func (s *GoldService) GetPrice() price.GoldPrice {
	return s.priceClient.FetchLatestPrice()
}

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

func (s *GoldService) Sell(userID int64, gram float64) (*domain.Transaction, error) {
	if gram <= 0 {
		return nil, errors.New("gram harus lebih dari 0")
	}

	user, err := s.userRepo.GetUserByID(userID)
	if err != nil || user == nil {
		return nil, errors.New("user tidak ditemukan")
	}

	balance, err := s.GetUserBalance(userID)
	if err != nil {
		return nil, errors.New("gagal menghitung saldo")
	}

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

func (s *GoldService) GetTransactions(userID int64) ([]domain.Transaction, error) {
	return s.transactionRepo.GetTransactionsByUserID(userID)
}
