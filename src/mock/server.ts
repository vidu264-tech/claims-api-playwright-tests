import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;


const claims = new Map();
// Create a sample claim c001 — used in tests
const nowISO = new Date().toISOString();
claims.set('c001', {
  id: 'c001',
  policyNumber: 'P-10001',
  claimantName: 'Jane Doe',
  damageDate: '2025-11-10',
  lossDescription: 'Water damage in kitchen',
  images: [],
  status: 'OPEN',
  createdAt: nowISO,
  updatedAt: nowISO
});

// Simple token
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

// Auth
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'user' && password === 'pass') {
    return res.json({ accessToken: VALID_TOKEN, refreshToken: 'refresh', expiresIn: 3600 });
  }
  return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid username or password' });
});

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Middleware to check bearer token for protected routes
function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing or invalid Bearer token.' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== VALID_TOKEN) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing or invalid Bearer token.' });
  }
  next();
}

// POST /claims
app.post('/claims', requireAuth, (req, res) => {
  const body = req.body || {};
  const { policyNumber, claimantName, damageDate, lossDescription, status } = body;
  // Missing required field
  if (!policyNumber) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Missing required field: policyNumber', details: null });
  }
  // date format YYYY-MM-DD
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(damageDate)) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid date format for damageDate. Expected YYYY-MM-DD', details: null });
  }
  // duplicate policyNumber
  for (const c of claims.values()) {
    if (c.policyNumber === policyNumber) {
      return res.status(409).json({ code: 'CONFLICT', message: `Claim with policyNumber '${policyNumber}' already exists.`, details: null });
    }
  }
  const id = 'c' + Math.floor(Math.random() * 9000 + 100).toString();
  const createdAt = new Date().toISOString();
  const created = {
    id,
    policyNumber,
    claimantName,
    damageDate,
    lossDescription,
    images: body.images || [],
    status: status || 'OPEN',
    createdAt,
    updatedAt: createdAt
  };
  claims.set(id, created);
  return res.status(201).json(created);
});

// GET /claims (list & filter & pagination)
app.get('/claims', requireAuth, (req, res) => {
  let items = Array.from(claims.values());
  const { status, page = '1', pageSize = '20' } = req.query;

  // status filter
  if (status) {
    if (!['OPEN','IN_REVIEW','APPROVED','PAID'].includes(status)) {
      return res.status(400).json({ code: 'BAD_REQUEST', message: 'Unknown status value', details: null });
    }
    items = items.filter(c => c.status === status);
  }

  // pagination validation
  const p = parseInt(String(page), 10);
  const ps = parseInt(String(pageSize), 10);
  if (isNaN(p) || p < 1) return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid page parameter', details: null });
  if (isNaN(ps) || ps < 1 || ps > 100) return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid pageSize parameter', details: null });

  // simple pagination
  const offset = (p - 1) * ps;
  const pageItems = items.slice(offset, offset + ps);
  res.setHeader('X-Total-Count', String(items.length));
  return res.json(pageItems);
});

// GET /claims/:id
app.get('/claims/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  if (!/^c\d+$/.test(id)) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid claim ID format. Expected string pattern: c[0-9]+', details: null });
  }
  const claim = claims.get(id);
  if (!claim) return res.status(404).json({ code: 'NOT_FOUND', message: `Claim with ID '${id}' not found.`, details: null });
  return res.json(claim);
});

// PATCH /claims/:id -> only supports status updates per allowed transitions
const allowedTransitions = {
  OPEN: ['IN_REVIEW'],
  IN_REVIEW: ['APPROVED'],
  APPROVED: ['PAID'],
  PAID: []
};

app.patch('/claims/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  if (!/^c\d+$/.test(id)) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'Invalid claim ID format. Expected string pattern: c[0-9]+', details: null });
  }
  const claim = claims.get(id);
  if (!claim) return res.status(404).json({ code: 'NOT_FOUND', message: `Claim with ID '${id}' not found.`, details: null });
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ code: 'BAD_REQUEST', message: 'Missing field: status', details: null });
  const allowed = allowedTransitions[claim.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: `Invalid status transition from ${claim.status} to ${status}.`, details: null });
  }
  claim.status = status;
  claim.updatedAt = new Date().toISOString();
  claims.set(id, claim);
  return res.json(claim);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock Claims API listening at http://localhost:${PORT}`);
});
