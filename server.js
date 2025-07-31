import express from 'express';
import fetch from 'node-fetch';

const app   = express();
const PORT  = process.env.PORT || 10000;
const KEY   = process.env.M2F_KEY;
const API   = 'https://api.made2flow.com/v1/scope3/reports/2024';

app.get('/v1/latest', async (req, res) => {
  try {
    const raw  = await fetch(API, { headers: { 'X-API-KEY': KEY } });
    const data = await raw.json();
    const last = Array.isArray(data) ? data.at(-1) : data;
    const imp  = last?.dpp?.impact;

    if (!imp) throw new Error('Impact metrics missing');

    res.json({
      water_use:              +imp.water_use.toFixed(3),
      ecotoxicity_freshwater: +imp.ecotoxicity_freshwater.toFixed(2),
      ozone_depletion:        +imp.ozone_depletion.toFixed(3),
      particulate_matter:     imp.particulate_matter
    });
  } catch (e) {
    console.error(e);
    res.status(503).json({ error: 'Data unavailable' });
  }
});

app.listen(PORT, () => console.log('Impact bot listening on', PORT));