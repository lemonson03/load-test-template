import express from 'express';
import { runK6, stopAll, list } from './k6-run.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// POST /load/start
// body: { scenario: "load.js", vus: 50, duration: "2m", targetUrl?: "http://..." }
app.post('/load/start', async (req, res) => {
  try {
    const {
      scenario = 'load.js',
      vus = 50,
      duration = '2m',
      targetUrl
    } = req.body || {};

    const TARGET_URL = targetUrl || process.env.TARGET_URL;
    if (!TARGET_URL) return res.status(400).json({ error: 'TARGET_URL is required' });

    const job = await runK6({
      scenarioPath: `/app/scenarios/${scenario}`,
      vus,
      duration,
      targetUrl: TARGET_URL,
      influxUrl: process.env.INFLUX_URL || 'http://influxdb:8086',
      influxDb: process.env.INFLUX_DB || 'k6'
    });

    res.json({ started: true, pid: job.pid, scenario, vus, duration, targetUrl: TARGET_URL });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

// POST /load/stop
app.post('/load/stop', async (_req, res) => {
  const killed = await stopAll();
  res.json({ killed });
});

// GET /load/status
app.get('/load/status', (_req, res) => {
  res.json(list());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[load-api] listening on ${PORT}`));
