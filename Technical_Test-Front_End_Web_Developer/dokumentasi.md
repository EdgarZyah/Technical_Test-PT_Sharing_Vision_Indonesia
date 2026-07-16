# Dokumentasi Repository — HaloGold Frontend

Aplikasi web frontend untuk platform jual beli emas digital **HaloGold** (HaloEmas), dibangun dengan Next.js 16, TypeScript, dan Tailwind CSS v4.

---

## Daftar Isi

- [Ringkasan Proyek](#ringkasan-proyek)
- [Tech Stack](#tech-stack)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Repository](#struktur-repository)
- [Halaman dan Routing](#halaman-dan-routing)
- [Arsitektur Komponen](#arsitektur-komponen)
- [Alur Data](#alur-data)
- [Fitur Utama](#fitur-utama)
- [Dark Mode](#dark-mode)
- [Data Dummy](#data-dummy)
- [Asumsi dan Keterbatasan](#asumsi-dan-keterbatasan)

---

## Ringkasan Proyek

HaloGold adalah aplikasi web frontend untuk simulasi investasi dan transaksi emas digital. Aplikasi ini merupakan hasil Technical Test untuk posisi Front-End Web Developer di PT Sharing Vision Indonesia.

**Halaman yang diimplementasikan:**

| Halaman | Route | Fungsi |
|---------|-------|--------|
| Login | `/login` | Autentikasi dengan validasi form |
| Dashboard | `/dashboard` | Ringkasan saldo emas, harga, grafik, riwayat |
| Trading Emas | `/halogold_emas` | Tampilan ala Binance dengan grafik live dan panel beli/jual |
| Riwayat | `/riwayat` | Daftar transaksi dengan pencarian, filter, paginasi |
| Profil | `/profil` | Informasi akun dan pengaturan keamanan |

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Next.js | 16.2.10 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Utility-first CSS (konfigurasi via CSS, bukan config file) |
| Chart.js | ^4.5.1 | Grafik harga emas |
| react-chartjs-2 | ^5.3.1 | React wrapper untuk Chart.js |
| React Hook Form | ^7.81.0 | Form state management |
| Zod | ^4.4.3 | Schema validation |
| Framer Motion | ^12.42.2 | Animasi dan transisi |
| Lucide React | ^1.24.0 | Ikon |

---

## Cara Menjalankan

### Prasyarat

- Node.js >= 18
- npm

### Instalasi

```bash
cd technical-front_end_web_developer
npm install
```

### Development Server

```bash
npm run dev
```

Buka http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Akun Demo

| Email | Password | Nama | Saldo Emas |
|-------|----------|------|------------|
| budi@halogold.com | password123 | Budi Hartono | 12.5432 gr |
| sinta@halogold.com | password123 | Sinta Dewi | 5.2100 gr |

---

## Struktur Repository

```
technical-front_end_web_developer/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (Inter font, providers)
│   │   ├── globals.css               # Tailwind v4 config, dark mode, scrollbar
│   │   ├── page.tsx                  # Root redirect (/dashboard atau /login)
│   │   ├── (auth)/
│   │   │   └── login/page.tsx        # Halaman login
│   │   └── (main)/
│   │       ├── layout.tsx            # Layout terauth (sidebar, header, nav)
│   │       ├── dashboard/page.tsx    # Dashboard utama
│   │       ├── halogold_emas/page.tsx # Halaman trading emas
│   │       ├── beli-emas/page.tsx    # Redirect ke /halogold_emas
│   │       ├── riwayat/page.tsx      # Riwayat transaksi
│   │       └── profil/page.tsx       # Halaman profil
│   │
│   ├── components/
│   │   ├── ui/                       # Komponen reusable
│   │   │   ├── Button.tsx            # Tombol (5 varian, 3 ukuran, loading state)
│   │   │   ├── Input.tsx             # Input dengan label, error, ikon
│   │   │   ├── Card.tsx              # Kontainer kartu
│   │   │   ├── Badge.tsx             # Badge status dan jenis transaksi
│   │   │   ├── Modal.tsx             # Modal animasi dengan backdrop
│   │   │   └── Skeleton.tsx          # Placeholder loading
│   │   │
│   │   ├── layout/                   # Komponen layout
│   │   │   ├── Header.tsx            # Bar atas (hamburger, notifikasi, avatar)
│   │   │   ├── Sidebar.tsx           # Sidebar desktop (navigasi, toggle tema)
│   │   │   └── MobileNav.tsx         # Navigasi mobile slide-in
│   │   │
│   │   └── features/                 # Komponen fitur
│   │       ├── dashboard/
│   │       │   ├── BalanceCard.tsx    # Kartu saldo emas (gradient amber)
│   │       │   ├── GoldPriceCard.tsx  # Kartu harga emas hari ini
│   │       │   ├── GoldChart.tsx      # Grafik harga 30 hari
│   │       │   ├── QuickActions.tsx   # Shortcut menu (4 tombol)
│   │       │   └── RecentTransactions.tsx # 5 transaksi terakhir
│   │       ├── beli-emas/
│   │       │   └── BuyForm.tsx        # Form beli emas (tidak aktif)
│   │       ├── halogold_emas/
│   │       │   ├── MarketHeader.tsx   # Header trading (pasangan, harga, perubahan)
│   │       │   ├── TradingChart.tsx   # Grafik live (update tiap 2 detik)
│   │       │   └── TradePanel.tsx     # Panel beli/jual dengan tab
│   │       └── riwayat/
│   │           └── TransactionList.tsx # Daftar transaksi (tabel + kartu mobile)
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx            # Autentikasi (login/logout, localStorage)
│   │   └── ThemeContext.tsx           # Dark mode (sistem preference, localStorage)
│   │
│   ├── hooks/
│   │   ├── useGold.ts                # Data harga emas (mock, delay 400ms)
│   │   └── useTransactions.ts        # Data transaksi per user (mock, delay 400ms)
│   │
│   ├── data/
│   │   └── mock.ts                   # Data dummy (user, harga, transaksi)
│   │
│   ├── lib/
│   │   └── utils.ts                  # Fungsi utilitas (format, kalkulasi)
│   │
│   └── types/
│       └── index.ts                  # Tipe TypeScript
│
├── server/
│   └── db.json                       # Struktur data JSON Server (referensi saja)
│
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── next.config.ts
```

---

## Halaman dan Routing

### Layout Hierarchy

```
RootLayout (layout.tsx)
  └── AuthProvider > ThemeProvider
      ├── (auth)/login        → Tanpa sidebar, standalone
      └── (main)/layout.tsx   → Auth guard, Sidebar, Header, MobileNav
          ├── /dashboard
          ├── /halogold_emas
          ├── /beli-emas      → Redirect ke /halogold_emas
          ├── /riwayat
          └── /profil
```

### Detail Setiap Halaman

#### `/login`
- Form email + password dengan validasi Zod
- Toggle show/hide password
- Tombol login dengan loading spinner
- Tampilkan akun demo di bawah form
- Redirect ke `/dashboard` setelah login berhasil

#### `/dashboard`
- **BalanceCard**: Saldo emas dalam gram dan Rupiah, gradient amber
- **GoldPriceCard**: Harga beli/jual hari ini, persentase perubahan
- **QuickActions**: 4 shortcut (Trading Emas, Riwayat, Target, Profil)
- **GoldChart**: Grafik garis harga 30 hari (beli amber, jual hijau)
- **RecentTransactions**: 5 transaksi terakhir dengan badge status

#### `/halogold_emas`
- **MarketHeader**: GOLD/IDR, harga live animasi, % perubahan, harga beli/jual, saldo
- **TradingChart**: Grafik live Chart.js (update tiap 2 detik), volume bar, label 1D, indikator LIVE
- **TradePanel**: Tab Beli/Jual, toggle input Rupiah/Gram, tombol quick amount, ringkasan harga, modal konfirmasi, modal sukses

#### `/riwayat`
- Input pencarian (filter berdasarkan jenis, status, nominal, berat)
- Tombol filter (Semua, Beli, Jual)
- Tabel desktop dengan kolom: Tanggal, Jenis, Nominal, Berat, Harga/gram, Status
- Kartu mobile dengan layout yang sama
- Paginasi 8 item per halaman
- Empty state ketika tidak ada data

#### `/profil`
- Avatar dengan inisial nama
- Nama, email, status KYC (Terverifikasi)
- Rekening bank, notifikasi
- Pengaturan keamanan: Ubah PIN, Biometrik, Kelola Perangkat (placeholder)

---

## Arsitektur Komponen

### Komponen UI (`components/ui/`)

| Komponen | Props Utama | Keterangan |
|----------|------------|------------|
| `Button` | `variant`, `size`, `isLoading`, `fullWidth` | 5 varian: primary, secondary, outline, ghost, danger |
| `Input` | `label`, `error`, `helperText`, `leftIcon`, `rightIcon` | Menggunakan `forwardRef` untuk integrasi React Hook Form |
| `Card` | `padding` | Kontainer putih dengan border dan shadow |
| `Badge` | `variant`, `size` | StatusBadge (SUCCESS/PENDING/FAILED) dan TypeBadge (BUY/SELL) |
| `Modal` | `isOpen`, `onClose`, `title`, `size` | ESC untuk menutup, backdrop blur, body scroll lock |
| `Skeleton` | `className` | `Skeleton`, `SkeletonCard`, `SkeletonTable` |

### Komponen Layout (`components/layout/`)

- **Header**: Sticky top bar. Tombol hamburger untuk mobile navigation, ikon lonceng notifikasi dengan titik merah, avatar user dengan inisial.
- **Sidebar**: Fixed kiri (desktop only, `lg:` breakpoint). Logo HaloGold, 4 link navigasi, toggle dark mode, tombol keluar. Active state berdasarkan `usePathname()`.
- **MobileNav**: Slide-in drawer dari kiri (mobile only). Framer Motion animation, backdrop overlay, navigasi sama dengan sidebar.

### Komponen Fitur (`components/features/`)

Setiap fitur memiliki direktori tersendiri. Komponen menerima data sebagai props dari page, bukan mengambil data sendiri. Hal ini memudahkan testing dan reusability.

---

## Alur Data

### Contexts

#### AuthContext
```
login(email, password)
  → validasi terhadap mockUsers (delay 600ms)
  → simpan SafeUser ke localStorage (key: halogold_user)
  → update state user

logout()
  → hapus dari localStorage
  → set user null

Initial load
  → baca dari localStorage
  → restore session
```

#### ThemeContext
```
Initial load
  → baca localStorage (key: halogold_theme)
  → fallback ke prefers-color-scheme: dark
  → toggle class .dark pada <html>

toggle()
  → update state isDark
  → simpan ke localStorage
  → listen ke perubahan system preference
```

### Hooks

#### useGold()
```
Input: (tidak ada, data dari mock)
Output: { currentPrice, priceHistory, isLoading, error, refetch }
Behavior: Load data dengan delay 400ms, sort by date ascending
```

#### useTransactions(userId)
```
Input: userId
Output: { transactions, isLoading, error, refetch }
Behavior: Filter by userId, sort by date descending, delay 400ms
```

### Alur Data Visual

```
src/data/mock.ts (static)
  ├──→ useGold() ──→ Dashboard (BalanceCard, GoldPriceCard, GoldChart)
  │                 └──→ HalogoldEmas (MarketHeader, TradingChart)
  │
  ├──→ useTransactions(userId) ──→ Dashboard (RecentTransactions)
  │                              └──→ Riwayat (TransactionList)
  │
  └──→ AuthContext ──→ Login (validasi credential)
                     └──→ Semua halaman (user data, auth guard)

ThemeContext ──→ Sidebar (toggle), GoldChart (warna), TradingChart (warna)
lib/utils.ts ──→ Semua komponen (formatRupiah, formatGram, formatDate, dll)
```

---

## Fitur Utama

### 1. Autentikasi
- Login dengan email dan password
- Validasi form (email format, password minimal 6 karakter)
- Session persist via localStorage
- Auth guard pada route terproteksi
- Redirect otomatis berdasarkan status login

### 2. Dashboard
- Ringkasan saldo emas dalam gram dan Rupiah
- Harga emas hari ini dengan perubahan persentase
- Grafik harga 30 hari terakhir (garis beli dan jual)
- Shortcut menu ke halaman lain
- 5 transaksi terakhir

### 3. Trading Emas (`/halogold_emas`)
- Tampilan gelap ala Binance
- Grafik live yang update tiap 2 detik (simulasi)
- Panel beli/jual dengan:
  - Tab switch Beli/Jual
  - Toggle input Rupiah/Gram
  - Quick amount buttons (100rb, 500rb, 1jt, 5jt)
  - Perhitungan otomatis
  - Modal konfirmasi
  - Modal sukses dengan animasi

### 4. Riwayat Transaksi
- Pencarian real-time
- Filter berdasarkan jenis transaksi
- Tampilan tabel (desktop) dan kartu (mobile)
- Paginasi 8 item per halaman
- Empty state

### 5. Profil
- Informasi akun dan avatar
- Status KYC
- Pengaturan keamanan (placeholder)

### 6. Dark Mode
- Toggle di sidebar
- Persist via localStorage
- Deteksi preferensi sistem
- Semua komponen mendukung light/dark mode

---

## Dark Mode

Konfigurasi Tailwind CSS v4 untuk class-based dark mode:

```css
/* globals.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

ThemeContext mengontrol class `.dark` pada element `<html>`. Seluruh komponen menggunakan prefix `dark:` untuk styling mode gelap.

**Pola warna:**

| Elemen | Light Mode | Dark Mode |
|--------|-----------|-----------|
| Background body | `bg-gray-50` | `dark:bg-gray-900` |
| Background card | `bg-white` | `dark:bg-gray-800` |
| Teks utama | `text-gray-900` | `dark:text-white` |
| Teks sekunder | `text-gray-600` | `dark:text-gray-400` |
| Border | `border-gray-200` | `dark:border-gray-700` |
| Input bg | `bg-white` | `dark:bg-gray-800` |
| Skeleton | `bg-gray-200` | `dark:bg-gray-600` |

---

## Data Dummy

### Pengguna

| ID | Nama | Email | Password | Saldo Emas |
|----|------|-------|----------|------------|
| 1 | Budi Hartono | budi@halogold.com | password123 | 12.5432 gr |
| 2 | Sinta Dewi | sinta@halogold.com | password123 | 5.2100 gr |

### Harga Emas (30 hari terakhir)

- Rentang tanggal: 17 Juni 2026 - 16 Juli 2026
- Harga beli: Rp 1.873.000 - Rp 1.945.200/gram
- Harga jual: Rp 1.855.200 - Rp 1.925.000/gram

### Transaksi

| ID | User | Jenis | Nominal | Gram | Status |
|----|------|-------|---------|------|--------|
| 1 | Budi | BELI | Rp 500.000 | 0.2571 | Berhasil |
| 2 | Budi | BELI | Rp 1.000.000 | 0.5141 | Berhasil |
| 3 | Budi | JUAL | Rp 3.850.400 | 2.0000 | Berhasil |
| 4 | Budi | BELI | Rp 2.000.000 | 1.0282 | Pending |
| 5 | Budi | BELI | Rp 750.000 | 0.3856 | Berhasil |
| 6 | Budi | JUAL | Rp 1.925.000 | 1.0000 | Gagal |
| 7 | Budi | BELI | Rp 3.000.000 | 1.5423 | Berhasil |
| 8 | Budi | JUAL | Rp 962.600 | 0.5000 | Berhasil |
| 9 | Sinta | BELI | Rp 1.500.000 | 0.7712 | Berhasil |
| 10 | Sinta | JUAL | Rp 5.000.000 | 2.5000 | Pending |

### Simulasi Live

Grafik pada halaman `/halogold_emas` menggunakan seeded pseudo-random number generator untuk mensimulasikan pergerakan harga real-time setiap 2 detik. Data bersifat deterministik (bukan `Math.random()`) untuk memenuhi aturan pure function React Compiler.

---

## Asumsi dan Keterbatasan

### Yang Sudah Diimplementasikan

- [x] Login dengan validasi form
- [x] Dashboard dengan saldo, harga, grafik, riwayat
- [x] Halaman trading dengan grafik live dan panel beli/jual
- [x] Riwayat transaksi dengan pencarian, filter, paginasi
- [x] Halaman profil
- [x] Dark mode dengan persist dan deteksi sistem
- [x] Responsive design (mobile + desktop)
- [x] Loading skeleton, empty state, error handling
- [x] Animasi transisi halaman dan komponen
- [x] Konsistensi warna dan tipografi

### Yang Belum Diimplementasikan

- [ ] Backend/API nyata (semua data dari mock)
- [ ] Autentikasi nyata (JWT, session management)
- [ ] Payment gateway / QRIS
- [ ] e-KYC / verifikasi identitas
- [ ] Notifikasi push
- [ ] Pencetakan emas fisik
- [ ] Tokenisasi / blockchain
- [ ] Unit testing
- [ ] E2E testing
- [ ] Docker / CI/CD
- [ ] Swagger / API documentation

### Teknis

- Tidak ada `tailwind.config.ts` — Tailwind CSS v4 menggunakan konfigurasi CSS-first di `globals.css`
- `server/db.json` hanya referensi struktur data, tidak digunakan oleh aplikasi
- `BuyForm.tsx` ada tetapi tidak digunakan (redirect ke `/halogold_emas`)
- Build: 0 errors, Lint: 0 errors (1 warning dari React Hook Form yang tidak bisa dihindari)
- Semua data emas adalah dummy, bukan harga real-time

---

## Utility Functions (`lib/utils.ts`)

| Fungsi | Parameter | Return | Keterangan |
|--------|-----------|--------|------------|
| `formatRupiah(amount)` | `number` | `string` | Format: `Rp 1.945.200` |
| `formatGram(gram)` | `number` | `string` | Format: `12.5432 gr` |
| `formatDate(dateStr)` | `string` | `string` | Format: `16 Juli 2026` |
| `formatDateTime(dateStr)` | `string` | `string` | Format: `16 Jul 2026, 10:30` |
| `calculateGram(rupiah, price)` | `number, number` | `number` | `rupiah / price` |
| `calculateRupiah(gram, price)` | `number, number` | `number` | `gram * price` |
| `classNames(...classes)` | `(...args)` | `string` | Gabungkan class, filter falsy |
