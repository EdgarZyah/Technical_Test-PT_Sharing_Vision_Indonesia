// Package config menyediakan konfigurasi aplikasi dari environment variables.
package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

// Config menyimpan seluruh konfigurasi aplikasi.
type Config struct {
	DB          *sql.DB // Koneksi database PostgreSQL
	Port        string  // Port server HTTP, default "8080"
	PriceAPIURL string  // Base URL API harga emas eksternal
}

// Load membaca environment variables dan menginisialisasi koneksi database.
// Aplikasi akan fatal exit jika koneksi database gagal.
func Load() *Config {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "haloemas")
	sslMode := getEnv("DB_SSLMODE", "disable")

	// Bangun DSN (Data Source Name) untuk koneksi PostgreSQL
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbName, sslMode)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Verifikasi koneksi database aktif
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Connected to database")

	return &Config{
		DB:          db,
		Port:        getEnv("SERVER_PORT", "8080"),
		PriceAPIURL: getEnv("PRICE_API_URL", "https://hargaemas.logikarya.com"),
	}
}

// getEnv membaca environment variable, mengembalikan fallback jika tidak ada.
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
