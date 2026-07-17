# Technical Test - PT Sharing Vision Indonesia

Platform digital investasi emas **HaloEmas** — terdiri dari 3 technical test: Back End, Front-End Web, dan Front-End Mobile.

---

## Technical Test - Front End Web Developer

**Path:** `Technical_Test-Front_End_Web_Developer/`

Aplikasi web untuk investasi emas digital.

| Tech | Detail |
|------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Charts | Chart.js |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |

- 5 halaman: Login, Dashboard, Beli/Jual Emas, Riwayat Transaksi, Profil
- Harga emas real-time dengan chart 30 hari (buy/sell)
- Dark mode, responsive (desktop sidebar + mobile nav)
- Demo accounts untuk testing instan
- Live: https://halo-emas.vercel.app/dashboard
- Lihat `Technical_Test-Front_End_Web_Developer/README.md` untuk cara menjalankan

---

## Technical Test - Front End Mobile Developer

**Path:** `Technical_Test-Front_End_Mobile_Developer/`

Aplikasi mobile untuk investasi emas digital.

| Tech | Detail |
|------|--------|
| Framework | React Native (Expo SDK 57) |
| Navigation | React Navigation + custom animated drawer |
| Storage | AsyncStorage |
| Theme | Dark/Light mode |

- 3 layar: Login, Dashboard, Beli Emas
- Harga emas real-time dari API hargaemas.logikarya.com
- Custom animated drawer navigation
- Auto-login dengan AsyncStorage persistence
- Build Android APK via EAS Build
- Lihat `Technical_Test-Front_End_Mobile_Developer/HaloEmas/README.md` untuk cara menjalankan

---

## Technical Test - Back End Developer

**Path:** `Technical_Test-Back_End_Developer/`

REST API untuk aplikasi HaloEmas.

| Tech | Detail |
|------|--------|
| Bahasa | Go (Golang) |
| Database | PostgreSQL |
| Router | chi |
| Docs | Swagger (swaggo) |
| Price API | hargaemas.logikarya.com (Antam) |

- 7 endpoint: register, profile, price, buy, sell, balance, transactions
- Harga emas real-time dari API eksternal dengan fallback mock 30 hari
- Clean Architecture: handler → service → repository → database
- Swagger UI di `/swagger/index.html`
- Lihat `Technical_Test-Back_End_Developer/README.md` untuk cara menjalankan

---