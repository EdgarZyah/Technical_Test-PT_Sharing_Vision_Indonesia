package repository

import (
	"database/sql"
	"haloemas-api/internal/domain"
)

type TransactionRepository struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) CreateTransaction(tx *domain.Transaction) error {
	query := `INSERT INTO transactions (user_id, type, amount, gram, created_at)
		VALUES ($1, $2, $3, $4, $5) RETURNING id`

	return r.db.QueryRow(query,
		tx.UserID, tx.Type, tx.Amount, tx.Gram, tx.CreatedAt).Scan(&tx.ID)
}

func (r *TransactionRepository) GetTransactionsByUserID(userID int64) ([]domain.Transaction, error) {
	query := `SELECT id, user_id, type, amount, gram, created_at
		FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []domain.Transaction
	for rows.Next() {
		var tx domain.Transaction
		if err := rows.Scan(&tx.ID, &tx.UserID, &tx.Type, &tx.Amount, &tx.Gram, &tx.CreatedAt); err != nil {
			return nil, err
		}
		transactions = append(transactions, tx)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}
