# Impact Bot

A micro‑service that fetches Made2Flow’s 2024 Scope‑3 report, extracts four
sustainability KPIs, and exposes them at `/v1/latest` for your Shopify theme.

## End‑points
| Route        | Method | Description                 |
|--------------|--------|-----------------------------|
| /v1/latest   | GET    | Returns the four cleaned metrics as JSON |

## Environment variables

| Name    | Example                          | Purpose                        |
|---------|----------------------------------|--------------------------------|
| M2F_KEY | `ae41bd80-...`                   | **Secret** Made2Flow API key   |
| PORT    | `10000`                          | (Optional) port Render gives   |

## Running locally

```bash
npm install
M2F_KEY=your_key_here node server.js
```

## End-points added

| Route          | Method | Description                                     |
|----------------|--------|-------------------------------------------------|
| /v1/latest     | GET    | Returns cached data. Use `?refresh=true` to force live update. |
| /v1/refresh    | GET    | Always fetches from Made2Flow first, then returns data. |

The cache survives restarts as long as the service stays up; on first request after a restart it self‑refreshes.
