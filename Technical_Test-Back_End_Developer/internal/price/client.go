// Package price menyediakan HTTP client untuk mengambil harga emas dari API eksternal
// dan fallback ke data mock 30 hari jika API tidak tersedia.
package price

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// GoldPrice merepresentasikan harga emas terkini.
type GoldPrice struct {
	Buy  int64  // Harga beli emas per gram (yang dibayar pembeli)
	Sell int64  // Harga jual/buyback per gram (yang diterima saat menjual)
	Date string // Tanggal pencatatan harga (format: "2006-01-02")
}

// apiResponse adalah struktur response dari API hargaemas.logikarya.com.
type apiResponse struct {
	Success bool        `json:"success"`
	Data    []apiRecord `json:"data"`
}

// apiRecord merepresentasikan satu record harga dari API.
// SellPrice dari API = harga beli untuk user (GoldPrice.Buy).
// BuybackPrice dari API = harga jual untuk user (GoldPrice.Sell).
type apiRecord struct {
	SellPrice    int64  `json:"sellPrice"`    // Harga jual dari perspective API = harga beli user
	BuybackPrice int64  `json:"buybackPrice"` // Harga buyback dari perspective API = harga jual user
	RecordedDate string `json:"recordedDate"` // Tanggal pencatatan
}

// Client adalah HTTP client untuk mengambil harga emas dari API eksternal.
type Client struct {
	baseURL    string     // Base URL API harga emas
	httpClient *http.Client // HTTP client dengan timeout 10 detik
}

// NewClient membuat price client baru dengan base URL yang diberikan.
func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// FetchLatestPrice mengambil harga emas terkini dari API.
// Jika API gagal diakses, mengembalikan data fallback dari mockPrices.
func (c *Client) FetchLatestPrice() GoldPrice {
	price, err := c.fetchFromAPI()
	if err != nil {
		log.Printf("Gagal fetch harga dari API: %v, menggunakan fallback", err)
		return getLatestFallback()
	}
	return price
}

// fetchFromAPI melakukan HTTP GET ke API harga emas dan parse response.
// Parameter: source=galeri24, brand=ANTAM, weight=1, length=1 (terbaru saja).
func (c *Client) fetchFromAPI() (GoldPrice, error) {
	url := fmt.Sprintf("%s/api/prices?source=galeri24&brand=ANTAM&weight=1&length=1", c.baseURL)

	resp, err := c.httpClient.Get(url)
	if err != nil {
		return GoldPrice{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return GoldPrice{}, fmt.Errorf("API returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return GoldPrice{}, err
	}

	var apiResp apiResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		return GoldPrice{}, err
	}

	if !apiResp.Success || len(apiResp.Data) == 0 {
		return GoldPrice{}, fmt.Errorf("API returned no data")
	}

	// Mapping: sellPrice API → Buy (harga yang user bayar)
	//          buybackPrice API → Sell (harga yang user terima saat jual)
	latest := apiResp.Data[0]
	return GoldPrice{
		Buy:  latest.SellPrice,
		Sell: latest.BuybackPrice,
		Date: latest.RecordedDate,
	}, nil
}

// mockPriceRecord adalah struktur data mock untuk fallback harga.
type mockPriceRecord struct {
	Buy  int64
	Sell int64
	Date string
}

// mockPrices berisi data harga emas dummy selama 30 hari terakhir.
// Digunakan sebagai fallback jika API eksternal tidak tersedia.
// Rentang harga: Rp 1.873.000 - Rp 1.945.200 per gram.
var mockPrices = []mockPriceRecord{
	{Buy: 1945200, Sell: 1925000, Date: "2026-07-16"},
	{Buy: 1943800, Sell: 1923500, Date: "2026-07-15"},
	{Buy: 1940500, Sell: 1920100, Date: "2026-07-14"},
	{Buy: 1938200, Sell: 1918000, Date: "2026-07-13"},
	{Buy: 1935000, Sell: 1915200, Date: "2026-07-12"},
	{Buy: 1932100, Sell: 1912000, Date: "2026-07-11"},
	{Buy: 1930500, Sell: 1910800, Date: "2026-07-10"},
	{Buy: 1928000, Sell: 1908500, Date: "2026-07-09"},
	{Buy: 1925800, Sell: 1906000, Date: "2026-07-08"},
	{Buy: 1923000, Sell: 1903200, Date: "2026-07-07"},
	{Buy: 1920500, Sell: 1900800, Date: "2026-07-06"},
	{Buy: 1918000, Sell: 1898500, Date: "2026-07-05"},
	{Buy: 1915200, Sell: 1895800, Date: "2026-07-04"},
	{Buy: 1912800, Sell: 1893200, Date: "2026-07-03"},
	{Buy: 1910000, Sell: 1890500, Date: "2026-07-02"},
	{Buy: 1908200, Sell: 1888800, Date: "2026-07-01"},
	{Buy: 1905500, Sell: 1886200, Date: "2026-06-30"},
	{Buy: 1903000, Sell: 1883800, Date: "2026-06-29"},
	{Buy: 1900800, Sell: 1881500, Date: "2026-06-28"},
	{Buy: 1898000, Sell: 1879000, Date: "2026-06-27"},
	{Buy: 1895500, Sell: 1876800, Date: "2026-06-26"},
	{Buy: 1893000, Sell: 1874200, Date: "2026-06-25"},
	{Buy: 1890200, Sell: 1871800, Date: "2026-06-24"},
	{Buy: 1888000, Sell: 1869500, Date: "2026-06-23"},
	{Buy: 1885500, Sell: 1867000, Date: "2026-06-22"},
	{Buy: 1883000, Sell: 1864800, Date: "2026-06-21"},
	{Buy: 1880200, Sell: 1862200, Date: "2026-06-20"},
	{Buy: 1878000, Sell: 1860000, Date: "2026-06-19"},
	{Buy: 1875500, Sell: 1857500, Date: "2026-06-18"},
	{Buy: 1873000, Sell: 1855200, Date: "2026-06-17"},
}

// getLatestFallback mengembalikan harga terbaru dari data mock.
func getLatestFallback() GoldPrice {
	latest := mockPrices[0]
	return GoldPrice{
		Buy:  latest.Buy,
		Sell: latest.Sell,
		Date: latest.Date,
	}
}

// GetAllFallbackPrices mengembalikan seluruh data harga mock (30 hari).
func GetAllFallbackPrices() []GoldPrice {
	prices := make([]GoldPrice, len(mockPrices))
	for i, p := range mockPrices {
		prices[i] = GoldPrice{Buy: p.Buy, Sell: p.Sell, Date: p.Date}
	}
	return prices
}
