import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  RefreshCw,
  Search,
  Download,
  Filter,
  Phone,
  Mail,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminShell from '@/components/admin/AdminShell';

const STATUSES = [
  { value: 'new', label: 'New', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'enrolled', label: 'Enrolled', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'rejected', label: 'Rejected', color: 'bg-gray-600/30 text-gray-400 border-gray-600/30' },
];

const statusMeta = (s) => STATUSES.find((x) => x.value === s) || STATUSES[0];

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(rows) {
  if (!rows.length) return;
  const headers = [
    'created_at', 'full_name', 'email', 'phone', 'source', 'status',
    'utm_source', 'utm_medium', 'utm_campaign', 'message', 'page_url', 'capi_status',
  ];
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `telzon-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (err) setError(err.message);
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const sources = useMemo(() => {
    const s = new Set(leads.map((l) => l.source || 'unknown'));
    return ['all', ...Array.from(s)];
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== 'all' && (l.status || 'new') !== statusFilter) return false;
      if (sourceFilter !== 'all' && (l.source || 'unknown') !== sourceFilter) return false;
      if (!q) return true;
      return (
        l.full_name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.message?.toLowerCase().includes(q) ||
        l.utm_campaign?.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const t = today.getTime();
    return {
      total: leads.length,
      today: leads.filter((l) => new Date(l.created_at).getTime() >= t).length,
      new: leads.filter((l) => (l.status || 'new') === 'new').length,
      enrolled: leads.filter((l) => l.status === 'enrolled').length,
    };
  }, [leads]);

  const updateLead = async (id, patch) => {
    const optimistic = leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
    setLeads(optimistic);
    if (selected?.id === id) setSelected({ ...selected, ...patch });
    const { error: err } = await supabase.from('leads').update(patch).eq('id', id);
    if (err) {
      setError(err.message);
      fetchLeads();
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    const prev = leads;
    setLeads(leads.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
    const { error: err } = await supabase.from('leads').delete().eq('id', id);
    if (err) {
      setError(err.message);
      setLeads(prev);
    }
  };

  return (
    <AdminShell title="Leads">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Today', value: stats.today },
          { label: 'New', value: stats.new },
          { label: 'Enrolled', value: stats.enrolled },
        ].map((s) => (
          <div
            key={s.label}
            className="px-4 py-3.5 rounded-2xl border border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-2xl font-black leading-none">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1.5 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, campaign…"
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}
        >
          {sources.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All sources' : s}
            </option>
          ))}
        </select>

        <button
          onClick={() => downloadCsv(filtered)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border border-white/10 hover:bg-white/5 text-gray-300"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>

        <button
          onClick={fetchLeads}
          className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      {error && (
        <div className="mb-4 p-3 rounded-xl text-red-300 text-sm border border-red-500/30 bg-red-500/10">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Filter className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No leads match your filters.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Contact</th>
                  <th className="text-left px-4 py-3">Source / Campaign</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const sm = statusMeta(l.status || 'new');
                  return (
                    <tr key={l.id} className="border-t border-white/[0.05] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-semibold">
                        <button onClick={() => setSelected(l)} className="hover:text-violet-300 text-left">
                          {l.full_name || '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <div className="flex flex-col gap-0.5 text-xs">
                          {l.email && (
                            <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 hover:text-white">
                              <Mail className="w-3 h-3" /> {l.email}
                            </a>
                          )}
                          {l.phone && (
                            <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 hover:text-white">
                              <Phone className="w-3 h-3" /> {l.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        <div className="font-semibold text-gray-300">{l.source || '—'}</div>
                        {l.utm_campaign && <div className="text-violet-400">{l.utm_campaign}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status || 'new'}
                          onChange={(e) => updateLead(l.id, { status: e.target.value })}
                          className={`text-xs px-2 py-1 rounded-full border ${sm.color} bg-transparent`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value} className="bg-[#060612]">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(l.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          {l.phone && (
                            <a
                              href={`https://wa.me/${l.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10"
                              title="WhatsApp"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => deleteLead(l.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-y-auto"
              style={{ background: '#0a0a14', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lead</p>
                    <h2 className="text-xl font-black">{selected.full_name}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/5 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm mb-6">
                  {selected.email && (
                    <p>
                      <span className="text-gray-500">Email:</span>{' '}
                      <a className="text-violet-300" href={`mailto:${selected.email}`}>{selected.email}</a>
                    </p>
                  )}
                  {selected.phone && (
                    <p>
                      <span className="text-gray-500">Phone:</span>{' '}
                      <a className="text-violet-300" href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </p>
                  )}
                  <p><span className="text-gray-500">Source:</span> {selected.source || '—'}</p>
                  <p><span className="text-gray-500">Created:</span> {new Date(selected.created_at).toLocaleString('en-IN')}</p>
                  {selected.page_url && (
                    <p className="break-all"><span className="text-gray-500">Page:</span> {selected.page_url}</p>
                  )}
                  {(selected.utm_source || selected.utm_campaign) && (
                    <p>
                      <span className="text-gray-500">UTM:</span>{' '}
                      {selected.utm_source || '—'} / {selected.utm_medium || '—'} / {selected.utm_campaign || '—'}
                    </p>
                  )}
                  {selected.fbclid && <p className="text-xs text-gray-500">fbclid: {selected.fbclid}</p>}
                  {selected.capi_status && (
                    <p>
                      <span className="text-gray-500">Meta CAPI:</span>{' '}
                      <span className={selected.capi_status === 'ok' ? 'text-green-400' : 'text-amber-400'}>
                        {selected.capi_status}
                      </span>
                    </p>
                  )}
                </div>

                {selected.message && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Message</p>
                    <div className="rounded-xl border border-white/10 p-3 text-sm text-gray-200 whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Internal notes</p>
                  <textarea
                    rows={4}
                    defaultValue={selected.notes || ''}
                    onBlur={(e) => updateLead(selected.id, { notes: e.target.value })}
                    placeholder="Add follow-up notes…"
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                  />
                </div>

                <div className="flex gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateLead(selected.id, { status: s.value })}
                      className={`flex-1 text-xs px-2 py-2 rounded-lg border ${
                        (selected.status || 'new') === s.value ? s.color : 'border-white/10 text-gray-500'
                      }`}
                    >
                      {s.value === 'enrolled' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {s.value === 'contacted' && <Clock className="w-3 h-3 inline mr-1" />}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminShell>
  );
};

export default AdminLeads;
