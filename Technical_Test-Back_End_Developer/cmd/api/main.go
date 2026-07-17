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

	_ "haloemas-api/docs"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
)

// @title           HaloEmas API
// @version         1.0
// @description     REST API untuk aplikasi HaloEmas - platform digital investasi dan transaksi emas.
// @description     Harga emas diambil dari https://hargaemas.logikarya.com (Antam).
// @host            localhost:8080
// @BasePath        /
func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := config.Load()
	defer cfg.DB.Close()

	priceClient := price.NewClient(cfg.PriceAPIURL)

	userRepo := repository.NewUserRepository(cfg.DB)
	txRepo := repository.NewTransactionRepository(cfg.DB)
	goldService := service.NewGoldService(txRepo, userRepo, priceClient)

	goldHandler := handler.NewGoldHandler(goldService)
	userHandler := handler.NewUserHandler(goldService, cfg.DB)

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.CORS)

	r.Route("/api", func(r chi.Router) {
		r.Get("/price", goldHandler.GetPrice)
		r.Post("/buy", goldHandler.Buy)
		r.Post("/sell", goldHandler.Sell)
		r.Get("/transactions", goldHandler.GetTransactions)
		r.Get("/balance", goldHandler.GetBalance)

		r.Post("/register", userHandler.Register)
		r.Get("/profile", userHandler.GetProfile)
	})

	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:"+getPort()+"/swagger/doc.json"),
	))

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

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func getPort() string {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}
	return port
}
