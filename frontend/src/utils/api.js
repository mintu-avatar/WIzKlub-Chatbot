const BASE = '/api';

export const saveLead = async (data) => {
  const res = await fetch(`${BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchLeads = async () => {
  const res = await fetch(`${BASE}/leads`);
  return res.json();
};

export const deleteLead = async (id) => {
  const res = await fetch(`${BASE}/leads/${id}`, { method: 'DELETE' });
  return res.json();
};

export const exportLeadsCSV = () => {
  window.open(`${BASE}/leads/export`, '_blank');
};
