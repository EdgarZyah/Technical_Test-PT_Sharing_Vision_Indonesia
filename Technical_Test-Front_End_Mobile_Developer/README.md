# HaloEmas - Aplikasi Mobile Investasi Emas Digital

Aplikasi mobile investasi emas digital

## Fitur

- **Login**
- **Dashboard**
- **Beli Emas**
- **Dark Mode**: Toggle dark/light mode
- **Real-time Harga**: Menggunakan API `hargaemas.logikarya.com`

## Tech Stack

- React Native (Expo SDK 57)

## Cara Menjalankan

### Prasyarat

- Node.js 18+ terinstall
- Expo Go app di smartphone (SDK 57)

### Installasi

```bash
cd Technical_Test-Front_End_Mobile_Developer/HaloEmas
npm install
```

### Jalankan Aplikasi

```bash
npm start
```

Lalu scan QR code dengan Expo Go.

### Build APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## Akun Demo
mock data untuk akun demo 
- **Email**: demo@haloemas.com
- **Password**: password123

## Struktur Project

```
HaloEmas/
├── App.js                          # Entry point (GestureHandler + ThemeProvider + Auth + Gold)
├── src/
│   ├── components/
│   │   ├── Sidebar.js              # Drawer sidebar (logo, nav items, logout)
│   │   └── Header.js               # App header (hamburger menu, title, dark mode toggle)
│   ├── constants/
│   │   └── theme.js                # Color palette (amber/emerald/red/gray), light/dark tokens
│   ├── navigation/
│   │   └── AppNavigator.js         # Drawer (main) + Stack (login) routing
│   ├── screens/
│   │   ├── LoginScreen.js          # Gradient bg, card form, demo account buttons
│   │   ├── DashboardScreen.js      # BalanceCard, PriceCard, QuickActions, RecentTx
│   │   └── BuyGoldScreen.js        # Tab beli/jual, input toggle, summary, modals
│   ├── services/
│   │   └── api.js                  # Fetch harga emas dari API (brand ANTAM)
│   ├── store/
│   │   ├── AuthContext.js          # Login/logout/session management
│   │   ├── GoldContext.js          # Harga emas, kalkulasi, transaksi
│   │   └── ThemeContext.js         # Dark mode toggle + color tokens
│   └── utils/
│       └── formatter.js            # formatRupiah, formatGram, formatDate
└── package.json
```

## Integrasi API

Harga emas diambil dari `https://hargaemas.logikarya.com/api/prices` dengan parameter:
- `brand=ANTAM`
- `source=galeri24`
- `weight=1`
- `length=30`
