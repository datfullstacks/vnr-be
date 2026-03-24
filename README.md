# VNR Backend

Express backend cho VNR, dùng Payload local API để lấy dữ liệu từ MongoDB.

## Chạy cục bộ

```bash
npm install
npm run dev
```

Khai báo `MONGODB_URI`, `PAYLOAD_SECRET` và `PAYLOAD_PUBLIC_SERVER_URL`.

## Endpoint chính

- Health/info: `/`
- Public snapshot cho frontend: `/api/public/snapshot`
