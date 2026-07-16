# HaloGold - Investasi Emas Digital

Aplikasi web HaloGold adalah platform investasi dan transaksi emas digital yang dibangun dengan Next.js. Aplikasi ini memungkinkan pengguna membeli emas, melihat riwayat transaksi, memantau harga emas, dan mengelola profil.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **Charts**: Chart.js (react-chartjs-2)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Cara Menjalankan

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Install Dependencies

```bash
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

### Lint

```bash
npm run lint
```

## Akun Demo

| Email | Password |
|-------|----------|
| budi@halogold.com | password123 |
| sinta@halogold.com | password123 |

## Fitur

### Wajib

- [x] **Login** - Form email + password dengan validasi menggunakan Zod
- [x] **Dashboard** - Nama pengguna, saldo emas (gram), nilai Rupiah, harga emas hari ini, grafik harga 30 hari, riwayat transaksi terakhir, shortcut menu
- [x] **Beli Emas** - Input nominal Rupiah, konversi otomatis ke gram, ringkasan transaksi, konfirmasi pembelian
- [x] **Riwayat Transaksi** - Tabel transaksi dengan filter, search, dan pagination
- [x] **Profil** - Informasi akun, pengaturan keamanan

### Nilai Tambahan

- [x] **Dark Mode** - Toggle mode terang/gelap dengan persistensi di localStorage
- [x] **Skeleton Loading** - Loading state untuk semua komponen
- [x] **Pagination** - Pagination pada halaman riwayat transaksi
- [x] **Search** - Pencarian transaksi berdasarkan nominal, jenis, atau status
- [x] **Animation** - Transisi halaman dan komponen menggunakan Framer Motion
- [x] **Responsive Design** - Sidebar desktop + mobile navigation

## Struktur Project

```
src/
├── app/
│   ├── (auth)/login/        # Login page
│   ├── (main)/              # Authenticated layout
│   │   ├── dashboard/       # Dashboard page
│   │   ├── beli-emas/       # Beli emas page
│   │   ├── riwayat/         # Riwayat transaksi page
│   │   └── profil/          # Profil page
│   ├── layout.tsx           # Root layout dengan providers
│   └── page.tsx             # Redirect ke login/dashboard
├── components/
│   ├── ui/                  # Reusable UI (Button, Card, Input, Badge, Modal, Skeleton)
│   ├── layout/              # Layout (Sidebar, Header, MobileNav)
│   └── features/            # Feature-specific components
│       ├── dashboard/       # BalanceCard, GoldPriceCard, GoldChart, QuickActions, RecentTransactions
│       ├── beli-emas/       # BuyForm
│       └── riwayat/         # TransactionList
├── contexts/                # AuthContext, ThemeContext
├── data/                    # Mock data (users, goldPrices, transactions)
├── hooks/                   # useGold, useTransactions
├── lib/                     # utils.ts (formatters, helpers)
└── types/                   # TypeScript interfaces
server/
└── db.json                  # Referensi struktur data dummy
```

## Asumsi dan Batasan

- **Data Dummy**: Semua data (harga emas, transaksi, user) di-hardcode langsung di frontend sebagai mock data di `src/data/mock.ts`. Tidak ada backend atau API server yang diakses.
- **Harga Emas**: Menggunakan data dummy statis, bukan harga real-time.
- **Payment Gateway**: Tidak diintegrasikan. Proses pembelian hanya simulasi.
- **Login**: Login hanya memeriksa credential terhadap data dummy, tanpa JWT atau session token.
- **Data Emas**: Saldo emas hanya di-update di client-side (localStorage), bukan di database persisten.
