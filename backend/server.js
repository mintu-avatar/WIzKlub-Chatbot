require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const leadsRouter = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Ensure data directory & leads file exist
const dataDir = path.join(__dirname, 'data');
const leadsFile = path.join(dataDir, 'leads.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(leadsFile)) fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/leads', leadsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── Serve built frontend in production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  WizKlub Chatbot API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Leads : http://localhost:${PORT}/api/leads\n`);
});
