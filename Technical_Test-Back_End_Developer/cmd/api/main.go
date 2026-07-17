// HaloEmas API - Entry point aplikasi.
// REST API untuk platform digital investasi emas.
// Harga emas diambil dari https://hargaemas.logikarya.com (brand Antam).
//
// @title           HaloEmas API
// @version         1.0
// @description     REST API untuk aplikasi HaloEmas - platform digital investasi dan transaksi emas.
// @description     Harga emas diambil dari https://hargaemas.logikarya.com (Antam).
// @host            localhost:8080
// @BasePath        /
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"haloemas-api/internal/config"
	"haloemas-api/internal/handler"
	"haloemas-api/internal/middleware"
	"haloemas-api/internal/price"
	"haloemas-api/internal/repository"
	"haloemas-api/internal/service"

	_ "haloemas-api/docs" // Register swagger docs

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
)

func main() {
	// Load environment variables dari .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Inisialisasi konfigurasi dan koneksi database
	cfg := config.Load()
	defer cfg.DB.Close()

	// Inisialisasi price client untuk mengambil harga emas dari API eksternal
	priceClient := price.NewClient(cfg.PriceAPIURL)

	// Inisialisasi repository layer (data access)
	userRepo := repository.NewUserRepository(cfg.DB)
	txRepo := repository.NewTransactionRepository(cfg.DB)

	// Inisialisasi service layer (business logic)
	goldService := service.NewGoldService(txRepo, userRepo, priceClient)

	// Inisialisasi handler layer (HTTP handlers)
	goldHandler := handler.NewGoldHandler(goldService)
	userHandler := handler.NewUserHandler(goldService, cfg.DB)

	// Setup router dengan chi
	r := chi.NewRouter()

	// Register middleware
	r.Use(middleware.Logger)  // Logging setiap request
	r.Use(middleware.CORS)    // CORS headers

	// Route group untuk API endpoints
	r.Route("/api", func(r chi.Router) {
		r.Get("/price", goldHandler.GetPrice)          // GET /api/price
		r.Post("/buy", goldHandler.Buy)                // POST /api/buy
		r.Post("/sell", goldHandler.Sell)              // POST /api/sell
		r.Get("/transactions", goldHandler.GetTransactions) // GET /api/transactions
		r.Get("/balance", goldHandler.GetBalance)      // GET /api/balance

		r.Post("/register", userHandler.Register)      // POST /api/register
		r.Get("/profile", userHandler.GetProfile)      // GET /api/profile
	})

	// Swagger UI endpoint
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:"+getPort()+"/swagger/doc.json"),
	))

	// Log informasi server
	port := getPort()
	addr := fmt.Sprintf(":%s", port)
	log.Printf("Server starting on port %s", port)
	log.Printf("Price API: %s", cfg.PriceAPIURL)
	log.Printf("Swagger UI: http://localhost:%s/swagger/index.html", port)
	log.Printf("Endpoints:")
	log.Printf("  GET  http://localhost:%s/api/price", port)
	log.Printf("  POST http://localhost:%s/api/buy", port)
	log.Printf("  POST http://localhost:%s/api/sell", port)
	log.Printf("  GET  http://localhost:%s/api/transactions", port)
	log.Printf("  GET  http://localhost:%s/api/balance", port)
	log.Printf("  POST http://localhost:%s/api/register", port)
	log.Printf("  GET  http://localhost:%s/api/profile", port)

	// Start HTTP server
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// getPort mengembalikan port server dari environment variable SERVER_PORT,
// atau "8080" sebagai default.
func getPort() string {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}
	return port
}
