import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Users, UserCheck, School, RefreshCw } from 'lucide-react';
import { fetchLeads, deleteLead, exportLeadsCSV } from '../utils/api.js';

const Badge = ({ label, color }) => (
  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>{label}</span>
);

const StatCard = ({ icon, label, value, gradient }) => (
  <div className={`card p-5 flex items-center gap-4 ${gradient}`}>
    <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-white">
      {icon}
    </div>
    <div>
      <p className="text-white/80 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchLeads();
      if (data.success) setLeads(data.leads);
      else setError('Failed to load leads.');
    } catch {
      setError('Cannot connect to API. Is the backend running?');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this lead?')) return;
    setDeleting(id);
    await deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setDeleting(null);
  };

  const parents = leads.filter((l) => l.userType === 'parent');
  const schools = leads.filter((l) => l.userType === 'school');
  const demoRequests = leads.filter((l) => l.wantsDemo === true);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-wiz-purple to-wiz-blue flex items-center justify-center text-white font-bold text-sm shadow">
                W
              </div>
              <h1 className="text-2xl font-bold text-gray-900">WizKlub — Leads Dashboard</h1>
            </div>
            <p className="text-gray-500 text-sm ml-12">{leads.length} total leads captured</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="btn-ghost" title="Refresh">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button onClick={exportLeadsCSV} className="btn-primary">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Leads" value={leads.length} gradient="bg-gradient-to-r from-wiz-purple to-wiz-purple-dark" />
          <StatCard icon={<UserCheck className="w-5 h-5" />} label="Demo Requests" value={demoRequests.length} gradient="bg-gradient-to-r from-wiz-blue to-wiz-teal" />
          <StatCard icon={<School className="w-5 h-5" />} label="School Inquiries" value={schools.length} gradient="bg-gradient-to-r from-violet-500 to-purple-600" />
        </div>

        {/* Error */}
        {error && (
          <div className="card p-4 border-red-100 bg-red-50 text-red-700 text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Type', 'Phone', 'Email', 'Key Info', 'Demo / Program', 'Captured At', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
                )}
                {!loading && leads.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No leads yet. Start chatting! 🚀</td></tr>
                )}
                <AnimatePresence>
                  {leads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-50 hover:bg-gray-50/80 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{lead.name}</td>
                      <td className="px-4 py-3">
                        {lead.userType === 'parent'
                          ? <Badge label="👨‍👩‍👧 Parent" color="bg-purple-100 text-purple-700" />
                          : <Badge label="🏫 School" color="bg-blue-100 text-blue-700" />}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.phone}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.email || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs max-w-[160px] truncate">
                        {lead.userType === 'parent'
                          ? `Age: ${lead.childAge} · ${lead.stemInterest}`
                          : `${lead.schoolName} · ${lead.schoolType}`}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {lead.userType === 'parent'
                          ? lead.wantsDemo
                            ? <Badge label="✅ Demo Booked" color="bg-green-100 text-green-700" />
                            : <Badge label="📩 Info Only" color="bg-gray-100 text-gray-500" />
                          : <Badge label={lead.schoolProgram ?? '—'} color="bg-indigo-100 text-indigo-700" />}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          disabled={deleting === lead.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          WizKlub Chatbot Dashboard · Data stored locally on the server
        </p>
      </div>
    </div>
  );
}
