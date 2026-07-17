package price

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

type GoldPrice struct {
	Buy  int64
	Sell int64
	Date string
}

type apiResponse struct {
	Success bool        `json:"success"`
	Data    []apiRecord `json:"data"`
}

type apiRecord struct {
	SellPrice    int64  `json:"sellPrice"`
	BuybackPrice int64  `json:"buybackPrice"`
	RecordedDate string `json:"recordedDate"`
}

type Client struct {
	baseURL    string
	httpClient *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *Client) FetchLatestPrice() GoldPrice {
	price, err := c.fetchFromAPI()
	if err != nil {
		log.Printf("Gagal fetch harga dari API: %v, menggunakan fallback", err)
		return getLatestFallback()
	}
	return price
}

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

	latest := apiResp.Data[0]
	return GoldPrice{
		Buy:  latest.SellPrice,
		Sell: latest.BuybackPrice,
		Date: latest.RecordedDate,
	}, nil
}

type mockPriceRecord struct {
	Buy  int64
	Sell int64
	Date string
}

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

func getLatestFallback() GoldPrice {
	latest := mockPrices[0]
	return GoldPrice{
		Buy:  latest.Buy,
		Sell: latest.Sell,
		Date: latest.Date,
	}
}

func GetAllFallbackPrices() []GoldPrice {
	prices := make([]GoldPrice, len(mockPrices))
	for i, p := range mockPrices {
		prices[i] = GoldPrice{Buy: p.Buy, Sell: p.Sell, Date: p.Date}
	}
	return prices
}
