// Package repository menyediakan akses data (data access layer) untuk manipulasi database.
package repository

import (
	"database/sql"
	"haloemas-api/internal/domain"
)

// TransactionRepository menangani operasi CRUD transaksi emas di database.
type TransactionRepository struct {
	db *sql.DB
}

// NewTransactionRepository membuat repository baru dengan koneksi database.
func NewTransactionRepository(db *sql.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

// CreateTransaction menyimpan transaksi baru ke database.
// Menggunakan RETURNING id untuk mengembalikan ID yang di-generate oleh database.
func (r *TransactionRepository) CreateTransaction(tx *domain.Transaction) error {
	query := `INSERT INTO transactions (user_id, type, amount, gram, created_at)
		VALUES ($1, $2, $3, $4, $5) RETURNING id`

	return r.db.QueryRow(query,
		tx.UserID, tx.Type, tx.Amount, tx.Gram, tx.CreatedAt).Scan(&tx.ID)
}

// GetTransactionsByUserID mengambil semua transaksi berdasarkan user ID.
// Hasil diurutkan dari yang terbaru (created_at DESC).
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

	// Cek error yang terjadi selama iterasi rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}
