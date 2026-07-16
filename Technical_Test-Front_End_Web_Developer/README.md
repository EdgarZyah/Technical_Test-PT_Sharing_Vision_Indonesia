# HaloGold - Investasi Emas Digital

Aplikasi web HaloGold adalah platform investasi dan transaksi emas digital yang dibangun dengan Next.js. Aplikasi ini memungkinkan pengguna membeli emas, melihat riwayat transaksi, memantau harga emas, dan mengelola profil.

## Tech Stack

- **Framework**: Next.js 16.2.10 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **Charts**: Chart.js (react-chartjs-2)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Fetch API dengan `AbortSignal.timeout()`

## Cara Menjalankan

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Install Dependencies

```bash
cd Technical_Test-Front_End_Web_Developer
npm install
```

### Menjalankan Aplikasi

```bash
npm run dev
```

Buka http://localhost:3000

### Build

```bash
npm run build
npm start
```

## Akun Demo

| Email           | Password    | Nama         | Saldo Emas | Saldo Rupiah |
| --------------- | ----------- | ------------ | ---------- | ------------ |
| budi@gmail.com  | password123 | Budi Hartono | 12.5432 gr | Rp 5.000.000 |
| sinta@gmail.com | password123 | Sinta Dewi   | 5.2100 gr  | Rp 2.500.000 |

Klik langsung pada akun demo di bawah form login untuk auto-login.

## Fitur

- [x] **Login** 
- [x] **Dashboard** 
- [x] **Beli Emas** 
- [x] **Riwayat Transaksi** 
- [x] **Profil** 
- [x] **Dark Mode** 

## Struktur Project

```
src/
├── app/
│   ├── (auth)/login/            # Login page (akun demo clickable)
│   ├── (main)/                  # Authenticated layout
│   │   ├── dashboard/           # Dashboard page
│   │   ├── beli-emas/           # Trading emas (grafik live + panel beli/jual)
│   │   ├── riwayat/             # Riwayat transaksi page
│   │   └── profil/              # Profil page
│   ├── layout.jsx               # Root layout dengan providers (Auth, Theme, Toast)
│   └── page.jsx                 # Root redirect ke login/dashboard
├── components/
│   ├── ui/                      # Komponen reusable
│   │   ├── Button.jsx           # Tombol (primary, secondary, outline, ghost, danger, buy, sell)
│   │   ├── Input.jsx            # Input dengan label, error, ikon
│   │   ├── Card.jsx             # Kontainer kartu
│   │   ├── Badge.jsx            # Badge status dan jenis transaksi
│   │   ├── Modal.jsx            # Modal animasi dengan backdrop (z-[100])
│   │   ├── Skeleton.jsx         # Placeholder loading
│   │   └── Toast.jsx            # Toast notification (createPortal, mounted guard)
│   ├── layout/
│   │   ├── Header.jsx           # Bar atas (hamburger, notifikasi, avatar)
│   │   ├── Sidebar.jsx          # Sidebar desktop (navigasi, toggle tema, logout modal)
│   │   └── MobileNav.jsx        # Navigasi mobile slide-in dengan logout modal
│   └── features/
│       ├── dashboard/
│       │   ├── BalanceCard.jsx   # Kartu saldo emas + saldo Rupiah + buyback
│       │   ├── GoldPriceCard.jsx # Kartu harga emas hari ini
│       │   ├── GoldPricePanel.jsx # Panel info harga buy/sell
│       │   ├── GoldChart.jsx     # Grafik harga 30 hari (emerald buy, amber sell)
│       │   ├── QuickActions.jsx  # Shortcut menu
│       │   └── RecentTransactions.jsx # 5 transaksi terakhir
│       ├── beli-emas/
│       │   └── BuyForm.jsx       # Form beli emas (tidak aktif, halaman utama di beli-emas/page.jsx)
│       ├── trading/
│       │   ├── MarketHeader.jsx  # Header trading (harga live, perubahan %, saldo)
│       │   ├── TradingChart.jsx  # Grafik dual-line (buy emerald solid, sell amber dashed)
│       │   └── TradePanel.jsx    # Panel beli/jual dengan validasi saldo
│       └── riwayat/
│           └── TransactionList.jsx # Daftar transaksi (tabel + kartu mobile)
├── contexts/
│   ├── AuthContext.jsx           # Autentikasi (login/logout, localStorage)
│   └── ThemeContext.jsx          # Dark mode (sistem preference, localStorage)
├── hooks/
│   ├── useGold.js                # Data harga emas (API-first + mock fallback)
│   └── useTransactions.js        # Data transaksi per user (mock)
├── data/
│   └── mock.js                   # Data dummy (users, goldPrices, transactions)
├── lib/
│   ├── api.js                    # API client (microservice + external API)
│   └── utils.js                  # Fungsi utilitas (formatRupiah, formatGram, calculateGram, dll)
```
