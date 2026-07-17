# HaloEmas API

REST API untuk aplikasi HaloEmas - platform digital investasi dan transaksi emas.

Harga emas diambil secara real-time dari [hargaemas.logikarya.com](https://hargaemas.logikarya.com) menggunakan brand **Antam**.

## Tech Stack

- **Bahasa**: Go (Golang) 1.22+
- **Database**: PostgreSQL
- **Router**: [chi](https://github.com/go-chi/chi)
- **Driver**: [lib/pq](https://github.com/lib/pq)
- **Env**: [godotenv](https://github.com/joho/godotenv)
- **Swagger**: [swag](https://github.com/swaggo/swag) + [http-swagger](https://github.com/swaggo/http-swagger)
- **Price API**: [hargaemas.logikarya.com](https://hargaemas.logikarya.com)

## Struktur Proyek

```
Technical_Test-Back_End_Developer/
├── cmd/api/main.go                # Entry point aplikasi
├── internal/
│   ├── config/config.go           # Konfigurasi database & aplikasi
│   ├── domain/models.go           # Model domain (User, Transaction)
│   ├── handler/
│   │   ├── gold_handler.go        # Handler untuk transaksi emas
│   │   ├── user_handler.go        # Handler untuk user (register, profile)
│   │   └── types.go               # Tipe data request/response untuk Swagger
│   ├── middleware/middleware.go    # Logger, CORS
│   ├── price/
│   │   └── client.go              # HTTP client + fallback harga emas
│   ├── repository/
│   │   ├── transaction_repository.go
│   │   └── user_repository.go
│   ├── response/response.go       # Standard JSON response helper
│   └── service/gold_service.go    # Business logic emas
├── docs/
│   ├── docs.go                    # Generated swagger docs
│   ├── swagger.json
│   └── swagger.yaml
├── migrations/001_create_tables.sql
├── seeds/seed.sql
├── .env.example
├── .env
└── README.md
```

## Cara Menjalankan

### Prasyarat

1. Go 1.22 atau lebih tinggi
2. PostgreSQL terinstall dan berjalan
3. Database `haloemas` sudah dibuat

### 1. Buat Database

```sql
CREATE DATABASE haloemas;
```

### 2. Jalankan Migrasi

```bash
psql -U postgres -d haloemas -f migrations/001_create_tables.sql
```

### 3. Jalankan Seeder (opsional)

```bash
psql -U postgres -d haloemas -f seeds/seed.sql
```

### 4. Konfigurasi Environment

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=haloemas
DB_SSLMODE=disable
SERVER_PORT=8080
PRICE_API_URL=https://hargaemas.logikarya.com
```

### 5. Jalankan Aplikasi

```bash
go run cmd/api/main.go
```

Server berjalan di `http://localhost:8080`.

### 6. Buka Swagger UI

```
http://localhost:8080/swagger/index.html
```

### Regenerate Swagger Docs

```powershell
$env:PATH += ";$(go env GOPATH)\bin"; swag init -g cmd/api/main.go -o docs
```

## Cara Penggunaan

### Identifikasi User

Semua endpoint transaksi memerlukan header `X-User-ID` atau query parameter `?user_id=1` untuk mengidentifikasi user. Nilainya adalah `id` dari tabel `users`.

### Alur Penggunaan

1. **Register** user baru melalui `POST /api/register`
2. Gunakan `id` yang dikembalikan sebagai `X-User-ID` di header
3. **Cek harga** emas terkini melalui `GET /api/price`
4. **Beli emas** dengan nominal Rupiah melalui `POST /api/buy`
5. **Cek saldo** emas melalui `GET /api/balance`
6. **Jual emas** dalam gram melalui `POST /api/sell`
7. **Lihat riwayat** transaksi melalui `GET /api/transactions`

### Contoh pakai Swagger UI

1. Buka `http://localhost:8080/swagger/index.html`
2. Klik endpoint **POST /api/register** → Try it out → isi body → Execute
3. Catat `id` dari response (misal: `1`)
4. Klik endpoint **GET /api/price** → Execute (tidak perlu header)
5. Klik endpoint **POST /api/buy** → tambah header `X-User-ID: 1` → isi body `{"amount": 500000}` → Execute
6. Klik endpoint **GET /api/balance** → tambah header `X-User-ID: 1` → Execute

## API Endpoints

### GET /api/price

Mengembalikan harga emas Antam terkini dari API hargaemas.logikarya.com.

**Response:**
```json
{
    "buy": 1945200,
    "sell": 1925000,
    "date": "2026-07-16"
}
```

| Field | Deskripsi |
|-------|-----------|
| `buy` | Harga beli emas per gram (yang dibayar pembeli) |
| `sell` | Harga jual/buyback emas per gram (yang diterima saat menjual) |
| `date` | Tanggal harga tercatat |

> Jika API external tidak tersedia, sistem menggunakan data fallback (30 hari harga mock).

### POST /api/buy

Membeli emas berdasarkan nominal Rupiah menggunakan harga beli terkini.

**Headers:** `X-User-ID: 1`

**Request:**
```json
{
    "amount": 500000
}
```

**Response:**
```json
{
    "gram": 0.257,
    "price": 1945200
}
```

> Rumus: `gram = amount / price.buy`

### POST /api/sell

Menjual emas berdasarkan berat gram menggunakan harga jual (buyback) terkini.

**Headers:** `X-User-ID: 1`

**Request:**
```json
{
    "gram": 1
}
```

**Response:**
```json
{
    "amount": 1925000
}
```

> Rumus: `amount = gram * price.sell`

### GET /api/transactions

Menampilkan daftar riwayat transaksi user, diurutkan dari yang terbaru.

**Headers:** `X-User-ID: 1`

**Response:**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "type": "BUY",
        "amount": 500000,
        "gram": 0.257,
        "created_at": "2026-07-10T10:00:00Z"
    }
]
```

### GET /api/balance

Menampilkan saldo emas user dalam gram dan nilai Rupiah berdasarkan harga jual terkini.

**Headers:** `X-User-ID: 1`

**Response:**
```json
{
    "gram": 0.758,
    "amount": 1459100
}
```

### POST /api/register

Mendaftarkan user baru.

**Request:**
```json
{
    "nama": "Budi Hartono",
    "email": "budi@example.com"
}
```

**Response:**
```json
{
    "id": 1,
    "nama": "Budi Hartono",
    "email": "budi@example.com",
    "message": "Registrasi berhasil"
}
```

### GET /api/profile

Menampilkan profil user termasuk saldo emas.

**Headers:** `X-User-ID: 1`

**Response:**
```json
{
    "id": 1,
    "nama": "Budi Hartono",
    "email": "budi@example.com",
    "gram": 0.758,
    "amount": 1459100
}
```

## Error Response

```json
{
    "error": "Pesan error"
}
```

| Status | Deskripsi |
|--------|-----------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request (validasi gagal) |
| `404` | Not Found |
| `500` | Internal Server Error |

## Sumber Harga Emas

Harga emas diambil dari API eksternal `https://hargaemas.logikarya.com/api/prices` dengan parameter:

| Parameter | Nilai | Deskripsi |
|-----------|-------|-----------|
| `source` | `galeri24` | Sumber data |
| `brand` | `ANTAM` | Brand emas |
| `weight` | `1` | Berat per gram |
| `length` | `1` | Jumlah record (terbaru) |

### Mapping Harga

| API Field | Backend | Deskripsi |
|-----------|---------|-----------|
| `sellPrice` | `buy` | Harga beli (user bayar) |
| `buybackPrice` | `sell` | Harga jual/buyback (user terima) |

### Fallback

Jika API external tidak tersedia atau gagal diakses, sistem menggunakan data fallback 30 hari dari `internal/price/client.go` dengan rentang harga Rp 1.873.000 - Rp 1.945.200 per gram.

## Data Dummy

### User (dari seeder)

| ID | Nama | Email |
|----|------|-------|
| 1 | Budi Hartono | budi@example.com |
| 2 | Sinta Dewi | sinta@example.com |
| 3 | Rizki Pratama | rizki@example.com |

### Transaksi Sample (dari seeder)

| User | Type | Amount | Gram |
|------|------|--------|------|
| Budi | BUY | Rp 500.000 | 0.257000 |
| Budi | BUY | Rp 1.000.000 | 0.514000 |
| Budi | SELL | Rp 380.000 | 0.195400 |
| Sinta | BUY | Rp 2.000.000 | 1.028000 |
| Sinta | BUY | Rp 500.000 | 0.257000 |
| Rizki | BUY | Rp 750.000 | 0.385500 |

## Catatan

- Harga emas diambil real-time dari API `hargaemas.logikarya.com` (brand Antam) setiap request
- Jika API down, fallback ke data mock 30 hari terakhir
- Untuk identifikasi user, gunakan header `X-User-ID` atau query parameter `?user_id=1`
- Semua nominal Rupiah disimpan sebagai integer (Rp)
- Berat emas menggunakan tipe `NUMERIC(18,6)` di PostgreSQL dan `float64` di Go
- Aplikasi menggunakan Clean Architecture: handler → service → repository → database
