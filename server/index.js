const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_DIST_PATH = path.join(__dirname, '..', 'client', 'dist', 'client');

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true
  })
);
app.use(express.json());

const users = [];
const sessions = new Map();
const entries = [];

function calculateRisk(data) {
  let score = 0;

  if (data.skippedMeal) score += 2;
  if (data.nightEating) score += 2;
  if (data.bingeEating) score += 3;
  if (data.emotionalEating) score += 2;
  if (Number(data.stressLevel) >= 4) score += 2;
  if (data.mood === 'bad') score += 2;

  let level = 'LOW';
  if (score >= 4) level = 'MEDIUM';
  if (score >= 8) level = 'HIGH';

  return { score, level };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ message: 'Yetkisiz istek.' });
  }

  req.userId = sessions.get(token);
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Gecerli email ve en az 6 karakterli sifre girin.' });
  }

  const exists = users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Bu email zaten kayitli.' });
  }

  const user = {
    id: crypto.randomUUID(),
    email: String(email).toLowerCase(),
    password
  };

  users.push(user);

  return res.status(201).json({ message: 'Kayit basarili.' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === String(email).toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Email veya sifre hatali.' });
  }

  const token = crypto.randomUUID();
  sessions.set(token, user.id);

  return res.json({
    token,
    user: { id: user.id, email: user.email }
  });
});

app.post('/api/entries', authMiddleware, (req, res) => {
  const data = req.body;

  const risk = calculateRisk(data);

  const entry = {
    id: crypto.randomUUID(),
    userId: req.userId,
    date: new Date().toISOString(),
    mealCount: Number(data.mealCount) || 0,
    skippedMeal: Boolean(data.skippedMeal),
    nightEating: Boolean(data.nightEating),
    bingeEating: Boolean(data.bingeEating),
    emotionalEating: Boolean(data.emotionalEating),
    stressLevel: Number(data.stressLevel) || 1,
    mood: data.mood || 'normal',
    riskScore: risk.score,
    riskLevel: risk.level
  };

  entries.push(entry);

  return res.status(201).json(entry);
});

app.get('/api/entries', authMiddleware, (req, res) => {
  const userEntries = entries
    .filter((entry) => entry.userId === req.userId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return res.json(userEntries);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(CLIENT_DIST_PATH));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(path.join(CLIENT_DIST_PATH, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server calisiyor: http://localhost:${PORT}`);
});
