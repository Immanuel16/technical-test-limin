# Technical Test Limin

Technical test ini membangun sistem manajemen pemeliharaan kapal (_Dry Dock Maintenance System_) berbasis web yang mencakup modul **Specification Groups**, **Checklists**, **Work Order Master**, dan **Dry Docks Project Management**. Dibangun dengan arsitektur **OOP** & **MVC**, serta containerized menggunakan Docker dan database MySQL.

---

## 🛠 Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Vite, Tailwind CSS, Axios, Vue Router 4 (OOP & MVC pattern).
- **Backend**: Node.js, Express.js, TypeScript (`tsx`), MySQL2 Driver (OOP, DAO/Repository & MVC pattern).
- **Database**: MySQL (Host machine / native port `3306`).
- **Containerization**: Docker & Docker Compose (Frontend disajikan via Nginx, Backend via Node runtime, DB di host).

---

## 📂 Struktur Monorepo

```text
LIMIN/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection pool
│   │   ├── controllers/        # HTTP Handlers (MVC Controller)
│   │   ├── models/             # Data definitions & interfaces
│   │   ├── repositories/       # Data Access Layer / DAO (OOP)
│   │   ├── routes/             # REST API Routes
│   │   ├── services/           # Business logic & Transactions
│   │   └── server.ts           # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/                # HTTP client wrapper
│   │   ├── controllers/        # Reactive state & logic managers (MVC Controller)
│   │   ├── models/             # API services & DTO (MVC Model)
│   │   ├── views/              # UI Components & Modals (MVC View)
│   │   ├── router/             # Vue Router SPA setup
│   │   ├── App.vue
│   │   └── main.ts
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml          # Orkestrasi Docker multi-container
└── README.md
```

### ===== STEP RUN PROJECT =====

## 1. Buat database baru bernama test_limin_marine

```
CREATE DATABASE test_limin_marine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Run script sql untuk pembuatan table yg terdapat pada folder

```text
/backend/src/db.sql
```

## 3. Run aplikasi dengan build dan nyalakan seluruh container

```
docker compose up --build -d
```

## 4. Aplikasi akan running pada:

```
**Frontend** : http://localhost:5175
**Backend** : http://localhost:5000/api/v1
```

## 5. Jika Tanpa Docker bisa menggunakan cara manual sebagai berikut

**Backend**

1. cd backend
2. npm install
3. buat file .env di dalam folder `backend/`:
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=test_limin_marine
4. Jalankan backend server
   `npm run dev`

**Frontend**

1. cd frontend
2. npm install
3. Jalankan vite development server
   `npm run dev`
4. Akses melalui URL lokal (biasanya http://localhost:5173)
