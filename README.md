# Password Vault (MVP) — React + Vite (JS) + Express + MongoDB

## What
Minimal password vault MVP:
- Frontend: React + Vite (JavaScript)
- Backend: Express + Node.js (JavaScript)
- DB: MongoDB (Mongoose)
- Client-side encryption: Web Crypto (PBKDF2 -> AES-GCM). Server stores only ciphertext.

## Run locally (development)

### Prerequisites
- Node 18+ / npm
- MongoDB URI (local or Atlas)

### Backend
```bash
cd backend
npm install
# set env vars in .env (see .env.example)
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```


## Notes (crypto)
Client uses Web Crypto Subtle API with PBKDF2 (200k iterations, SHA-256) to derive an AES-GCM 256-bit key from the user's password. Each vault item is encrypted locally; the server only stores ciphertext + iv + salt metadata.
# Password_vault

# Deployed Backend url
VITE_BACKEND_BASE_URL = "https://password-vault-fki3.onrender.com/"


# Deployed Frontend url
https://passwordvault-woad.vercel.app/
