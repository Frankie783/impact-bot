import express from 'express';
import fetch from 'node-fetch';

const app  = express();
const PORT = process.env.PORT || 10000;
const KEY  = process.env.M2F_KEY;
const API  = 'https://api.made2flow.com/v1/scope3/reports/2024';

// Simple in‑memory cache
let impactCache = null;   // { data:{…}, updated:Date }

async function fetchImpact() {
  const raw  = await fetch(API, { headers: { 'X-API-KEY': KEY } });
  const data = await raw.json();
  const last = Array.isArray(data) ? data.at(-1) : data;
  const imp  = last?.dpp?.impact;
  if (!imp) throw new Error('Impact metrics missing');

  return {
    water_use:              +imp.water_use.toFixed(3),
    ecotoxicity_freshwater: +imp.ecotoxicity_freshwater.toFixed(2),
    ozone_depletion:        +imp.ozone_depletion.toFixed(3),
    particulate_matter:     imp.particulate_matter
  };
}

async function refreshCache() {
  try {
    const fresh = await fetchImpact();
    impactCache = { data: fresh, updated: new Date() };
    console.log('[OK] Cache updated', impactCache.updated.toISOString());
  } catch (err) {
    console.error('[ERR] Refresh failed:', err.message);
    // Keep old cache if fetch fails
  }
}

// Prime cache on startup
refreshCache();

/**
 * GET /v1/latest
 * Returns cached numbers. Pass ?refresh=true to force a live refresh first.
 */
app.get('/v1/latest', async (req, res) => {
  if (req.query.refresh === 'true') await refreshCache();
  if (!impactCache) await refreshCache();          // first ever call / failover
  res.json({ updated: impactCache.updated, ...impactCache.data });
});

/**
 * GET /v1/refresh
 * Manual trigger that always refreshes before responding.
 */
app.get('/v1/refresh', async (req, res) => {
  await refreshCache();
  res.json({ updated: impactCache.updated, ...impactCache.data });
});

app.listen(PORT, () => console.log('Impact bot listening on', PORT));