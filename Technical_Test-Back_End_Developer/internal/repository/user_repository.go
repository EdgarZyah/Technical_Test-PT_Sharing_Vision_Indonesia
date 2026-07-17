package repository

import (
	"database/sql"
	"haloemas-api/internal/domain"
)

// UserRepository menangani operasi CRUD user di database.
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository membuat repository baru dengan koneksi database.
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetUserByID mencari user berdasarkan ID.
// Mengembalikan (nil, nil) jika user tidak ditemukan (bukan error).
func (r *UserRepository) GetUserByID(id int64) (*domain.User, error) {
	query := `SELECT id, nama, email FROM users WHERE id = $1`

	user := &domain.User{}
	err := r.db.QueryRow(query, id).Scan(&user.ID, &user.Nama, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// GetUserByEmail mencari user berdasarkan email.
// Mengembalikan (nil, nil) jika user tidak ditemukan (bukan error).
// Fungsi ini masih placeholder untuk fitur login di masa depan.
func (r *UserRepository) GetUserByEmail(email string) (*domain.User, error) {
	query := `SELECT id, nama, email FROM users WHERE email = $1`

	user := &domain.User{}
	err := r.db.QueryRow(query, email).Scan(&user.ID, &user.Nama, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}
