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