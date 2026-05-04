import React, { useEffect, useState } from 'react';
import {
  Loader2,
  RefreshCw,
  TrendingUp,
  IndianRupee,
  Users,
  Eye,
  MousePointerClick,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminShell from '@/components/admin/AdminShell';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://lcnfnwivodzjjpykihfn.supabase.co';
const META_STATS_URL = `${SUPABASE_URL}/functions/v1/meta-stats`;

const PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7d', label: 'Last 7 days' },
  { value: 'last_14d', label: 'Last 14 days' },
  { value: 'last_30d', label: 'Last 30 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
];

function fmtINR(n) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmt(n) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-IN').format(n);
}

const AdminMetaAds = () => {
  const [datePreset, setDatePreset] = useState('last_30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    setHint(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) {
        setError('Not signed in');
        setLoading(false);
        return;
      }
      const res = await fetch(`${META_STATS_URL}?date_preset=${datePreset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || `Error ${res.status}`);
        if (json?.hint) setHint(json.hint);
        setData(null);
      } else {
        setData(json);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePreset]);

  const totals = data?.totals || {};
  const campaigns = data?.campaigns || [];

  return (
    <AdminShell title="Meta Ads">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <select
          value={datePreset}
          onChange={(e) => setDatePreset(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff' }}
        >
          {PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border border-white/10 hover:bg-white/5 text-gray-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Couldn't load Meta stats</p>
              <p className="opacity-80 mt-1">{error}</p>
              {hint && <p className="opacity-80 mt-2 text-xs">{hint}</p>}
              <p className="opacity-80 mt-3 text-xs">
                Set <code className="bg-black/40 px-1.5 py-0.5 rounded">META_AD_ACCOUNT_ID</code> and{' '}
                <code className="bg-black/40 px-1.5 py-0.5 rounded">META_MARKETING_TOKEN</code> as Edge Function
                secrets in Supabase.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Spend', value: fmtINR(totals.spend), icon: IndianRupee },
          { label: 'Leads', value: fmt(totals.leads), icon: Users },
          { label: 'CPL', value: totals.cpl != null ? fmtINR(totals.cpl) : '—', icon: TrendingUp },
          { label: 'Clicks', value: fmt(totals.clicks), icon: MousePointerClick },
          { label: 'Impressions', value: fmt(totals.impressions), icon: Eye },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="px-4 py-4 rounded-2xl border border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-2">
              <Icon className="w-3.5 h-3.5" /> {label}
            </div>
            <p className="text-2xl font-black leading-none">{value}</p>
          </div>
        ))}
      </div>

      {/* Campaigns table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <p className="text-sm font-bold">Campaigns</p>
          {data?.date_preset && (
            <p className="text-xs text-gray-500">{data.date_preset.replace(/_/g, ' ')}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 text-gray-600 text-sm">
            No campaign data{error ? '' : ' for this period.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Campaign</th>
                  <th className="text-right px-4 py-3">Spend</th>
                  <th className="text-right px-4 py-3">Leads</th>
                  <th className="text-right px-4 py-3">CPL</th>
                  <th className="text-right px-4 py-3">Clicks</th>
                  <th className="text-right px-4 py-3">CTR</th>
                  <th className="text-right px-4 py-3">CPC</th>
                  <th className="text-right px-4 py-3">Impr.</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.campaign_id} className="border-t border-white/[0.05] hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold max-w-[260px] truncate" title={c.campaign_name}>
                      {c.campaign_name}
                    </td>
                    <td className="px-4 py-3 text-right">{fmtINR(c.spend)}</td>
                    <td className="px-4 py-3 text-right">{fmt(c.leads)}</td>
                    <td className="px-4 py-3 text-right text-violet-300">{c.cpl != null ? fmtINR(c.cpl) : '—'}</td>
                    <td className="px-4 py-3 text-right">{fmt(c.clicks)}</td>
                    <td className="px-4 py-3 text-right">{c.ctr ? `${Number(c.ctr).toFixed(2)}%` : '—'}</td>
                    <td className="px-4 py-3 text-right">{c.cpc ? fmtINR(c.cpc) : '—'}</td>
                    <td className="px-4 py-3 text-right text-gray-400">{fmt(c.impressions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-4 leading-relaxed">
        Pulled live from Meta Marketing API via your Supabase Edge Function. Lead counts include Pixel + CAPI events
        attributed to your ad account.
      </p>
    </AdminShell>
  );
};

export default AdminMetaAds;
