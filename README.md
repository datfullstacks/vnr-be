# VNR Backend

Payload CMS + public API for frontend `VNR`.

## Run locally

```bash
npm install
npm run dev
```

Backend defaults to port `3001`.
Tren Railway, backend se tu dong bind vao `PORT` duoc cap.

## Local env

Tao `.env.local` tu [`.env.example`](/d:/vnr-be/.env.example) va dien:

- `PAYLOAD_SECRET`
- `MONGODB_URI`
- `PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001`

## Public API

- `/api/public/health`
- `/api/public/explorer`
- `/api/public/snapshot`
