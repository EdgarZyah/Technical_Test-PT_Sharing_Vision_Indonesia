package repository

import (
	"database/sql"
	"haloemas-api/internal/domain"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

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
