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
├── App.js                        
├── src/
│   ├── components/
│   │   ├── Sidebar.js              
│   │   └── Header.js               
│   ├── constants/
│   │   └── theme.js                
│   ├── navigation/
│   │   └── AppNavigator.js         
│   ├── screens/
│   │   ├── LoginScreen.js          
│   │   ├── DashboardScreen.js      
│   │   └── BuyGoldScreen.js        
│   ├── services/
│   │   └── api.js                  
│   ├── store/
│   │   ├── AuthContext.js          
│   │   ├── GoldContext.js          
│   │   └── ThemeContext.js         
│   └── utils/
│       └── formatter.js            
└── package.json
```

## Integrasi API

Harga emas diambil dari `https://hargaemas.logikarya.com/api/prices` dengan parameter:
- `brand=ANTAM`
- `source=galeri24`
- `weight=1`
- `length=30`
