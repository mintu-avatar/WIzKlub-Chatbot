const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const leadsFile = path.join(__dirname, '..', 'data', 'leads.json');

const readLeads = () => JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
const writeLeads = (data) => fs.writeFileSync(leadsFile, JSON.stringify(data, null, 2));

// GET  /api/leads  — return all leads (newest first)
router.get('/', (_req, res) => {
  try {
    const leads = readLeads();
    res.json({ success: true, count: leads.length, leads: leads.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/leads  — save a new lead
router.post('/', (req, res) => {
  try {
    const {
      name, email, phone, userType,
      // parent-specific
      childAge, stemInterest, parentGoal, wantsDemo,
      // school-specific
      schoolType, schoolSize, schoolProgram, schoolName,
    } = req.body;

    if (!name || !phone || !userType) {
      return res.status(400).json({ success: false, error: 'name, phone, and userType are required.' });
    }

    const lead = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      userType,
      name,
      email: email || '',
      phone,
      // parent fields
      ...(userType === 'parent' && { childAge, stemInterest, parentGoal, wantsDemo }),
      // school fields
      ...(userType === 'school' && { schoolName, schoolType, schoolSize, schoolProgram }),
    };

    const leads = readLeads();
    leads.push(lead);
    writeLeads(leads);

    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/leads/:id  — remove a single lead
router.delete('/:id', (req, res) => {
  try {
    let leads = readLeads();
    const before = leads.length;
    leads = leads.filter((l) => l.id !== req.params.id);
    if (leads.length === before) return res.status(404).json({ success: false, error: 'Lead not found.' });
    writeLeads(leads);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/leads/export  — CSV export
router.get('/export', (_req, res) => {
  try {
    const leads = readLeads();
    const headers = ['id', 'createdAt', 'userType', 'name', 'email', 'phone',
      'childAge', 'stemInterest', 'parentGoal', 'wantsDemo',
      'schoolName', 'schoolType', 'schoolSize', 'schoolProgram'];
    const rows = leads.map((l) => headers.map((h) => `"${(l[h] ?? '').toString().replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="wizklab_leads.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
