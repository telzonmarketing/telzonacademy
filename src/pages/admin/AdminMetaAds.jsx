import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Loader2, RefreshCw, TrendingUp, IndianRupee, Users, Eye,
  MousePointerClick, AlertTriangle, Play, Pause, Edit2, Check, X,
  BarChart3, PlusCircle, Zap, Target, ArrowUpRight, ChevronDown,
  ChevronUp, Award, AlertCircle, CheckCircle2, Rocket, Activity,
  Star, ExternalLink, Info, Lightbulb, DollarSign, Flame, Shield,
  ToggleLeft, ToggleRight, Filter, Clock, TrendingDown,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { supabase } from '@/lib/customSupabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lcnfnwivodzjjpykihfn.supabase.co';
const META_STATS_URL   = `${SUPABASE_URL}/functions/v1/meta-stats`;
const META_MANAGER_URL = `${SUPABASE_URL}/functions/v1/meta-ads-manager`;

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtINR = (n) => {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};
const fmtNum = (n) => {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('en-IN').format(Math.round(n));
};
const fmtPct = (n) => n == null ? '—' : `${Number(n).toFixed(2)}%`;
const fmtROAS = (n) => n == null ? '—' : `${Number(n).toFixed(1)}x`;

// ── Color helpers ─────────────────────────────────────────────────────────────
const cplColor = (cpl) => {
  if (!cpl) return 'text-gray-400';
  if (cpl < 200) return 'text-green-400';
  if (cpl < 500) return 'text-yellow-400';
  return 'text-red-400';
};
const roasColor = (roas) => {
  if (!roas) return 'text-gray-400';
  if (roas >= 5) return 'text-green-400';
  if (roas >= 2) return 'text-yellow-400';
  return 'text-red-400';
};
const statusBadge = (s) => {
  if (s === 'ACTIVE')   return 'bg-green-500/20 text-green-300 border-green-500/30';
  if (s === 'PAUSED')   return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const PRESETS = [
  { value:'today', label:'Today' },
  { value:'yesterday', label:'Yesterday' },
  { value:'last_7d', label:'Last 7 days' },
  { value:'last_14d', label:'Last 14 days' },
  { value:'last_30d', label:'Last 30 days' },
  { value:'this_month', label:'This month' },
  { value:'last_month', label:'Last month' },
];

const TABS = [
  { id:'overview',   label:'📊 Overview',          icon: BarChart3 },
  { id:'campaigns',  label:'🎯 Campaigns',          icon: Target },
  { id:'create',     label:'🚀 Create Campaign',    icon: PlusCircle },
  { id:'advisor',    label:'💡 AI Advisor',         icon: Lightbulb },
];

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'violet', trend }) {
  const colors = {
    violet: 'from-violet-600/20 to-violet-500/10 border-violet-500/20',
    orange: 'from-orange-600/20 to-orange-500/10 border-orange-500/20',
    green:  'from-green-600/20 to-green-500/10 border-green-500/20',
    blue:   'from-blue-600/20 to-blue-500/10 border-blue-500/20',
    pink:   'from-pink-600/20 to-pink-500/10 border-pink-500/20',
  };
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-4 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend != null && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Inline Budget Editor ───────────────────────────────────────────────────────
function BudgetEditor({ campaignId, currentBudget, onSave, onCancel }) {
  const [val, setVal] = useState(String(Math.round(currentBudget || 500)));
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-400 text-xs">₹</span>
      <input
        type="number" min="100" step="50"
        className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-violet-500"
        value={val}
        onChange={e => setVal(e.target.value)}
        autoFocus
      />
      <button onClick={() => onSave(campaignId, Number(val))} className="text-green-400 hover:text-green-300"><Check className="w-3.5 h-3.5" /></button>
      <button onClick={onCancel} className="text-red-400 hover:text-red-300"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ stats, campaigns, loading, datePreset, setDatePreset, refresh }) {
  const totals = stats?.totals ?? {};
  const totalLeads = campaigns.reduce((s,c) => s + (c.leads||0), 0);
  const totalSpend = campaigns.reduce((s,c) => s + (c.spend||0), 0);
  const avgCPL    = totalLeads > 0 ? totalSpend / totalLeads : null;
  const estROAS   = totalLeads > 0 && totalSpend > 0 ? (totalLeads * 15000) / totalSpend : null;
  const activeCnt = campaigns.filter(c => c.status === 'ACTIVE').length;
  const pausedCnt = campaigns.filter(c => c.status === 'PAUSED').length;

  return (
    <div className="space-y-6">
      {/* Date selector + refresh */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={datePreset}
          onChange={e => setDatePreset(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
        >
          {PRESETS.map(p => <option key={p.value} value={p.value} className="bg-gray-900">{p.label}</option>)}
        </select>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-sm text-violet-300 hover:bg-violet-600/30 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
        <a
          href={`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${1670463227160429}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-sm text-blue-300 hover:bg-blue-600/30 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Meta Ads Manager
        </a>
      </div>

      {/* KPI Grid */}
      {loading && !campaigns.length ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KpiCard icon={IndianRupee}      label="Total Spend"     value={fmtINR(totalSpend || totals.spend)}    color="orange" />
          <KpiCard icon={Users}            label="Total Leads"     value={fmtNum(totalLeads || totals.leads)}    color="violet" />
          <KpiCard icon={Target}           label="Avg CPL"         value={fmtINR(avgCPL || totals.cpl)}          color={avgCPL < 300 ? 'green' : 'pink'} />
          <KpiCard icon={TrendingUp}       label="Est. ROAS"       value={fmtROAS(estROAS)}                      color="green"  sub="at ₹15K course fee" />
          <KpiCard icon={MousePointerClick} label="Total Clicks"   value={fmtNum(campaigns.reduce((s,c)=>s+(c.clicks||0),0) || totals.clicks)} color="blue" />
        </div>
      )}

      {/* Campaign status summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
          <p className="text-2xl font-black text-green-400">{activeCnt}</p>
          <p className="text-xs text-gray-400 mt-1">Active Campaigns</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-center">
          <p className="text-2xl font-black text-yellow-400">{pausedCnt}</p>
          <p className="text-xs text-gray-400 mt-1">Paused Campaigns</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 text-center">
          <p className="text-2xl font-black text-violet-400">{campaigns.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total Campaigns</p>
        </div>
      </div>

      {/* Benchmark info */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400" /> Industry Benchmarks (EdTech India)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { label:'Good CPL', value:'< ₹200', color:'text-green-400' },
            { label:'Avg CPL',  value:'₹200–₹500', color:'text-yellow-400' },
            { label:'Bad CPL',  value:'> ₹500', color:'text-red-400' },
            { label:'Target ROAS', value:'5x–10x', color:'text-violet-400' },
          ].map(b => (
            <div key={b.label} className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className={`font-bold text-base ${b.color}`}>{b.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Campaigns Tab ─────────────────────────────────────────────────────────────
function CampaignsTab({ campaigns, loading, onToggle, onUpdateBudget, onScale, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [toggling, setToggling] = useState({});
  const [scaling, setScaling] = useState({});

  const handleToggle = async (c) => {
    const newStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setToggling(t => ({ ...t, [c.id]: true }));
    await onToggle(c.id, newStatus);
    setToggling(t => ({ ...t, [c.id]: false }));
  };

  const handleScale = async (c) => {
    setScaling(s => ({ ...s, [c.id]: true }));
    await onScale(c.id, c.daily_budget);
    setScaling(s => ({ ...s, [c.id]: false }));
  };

  if (loading && !campaigns.length)
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>;

  if (!campaigns.length)
    return (
      <div className="text-center py-12 text-gray-400">
        <Target className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="font-semibold">No campaigns found</p>
        <p className="text-sm mt-1">Create your first campaign in the 🚀 Create Campaign tab</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{campaigns.length} campaigns · <span className="text-green-400">{campaigns.filter(c=>c.status==='ACTIVE').length} active</span></p>
        <button onClick={refresh} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {campaigns.map(c => {
        const isEditing = editingId === c.id;
        const isExpanded = expandedId === c.id;
        const isToggling = toggling[c.id];
        const isScaling  = scaling[c.id];
        const scoreGood  = c.cpl && c.cpl < 300;
        const scoreBad   = c.cpl && c.cpl > 500;
        const noLeads    = c.leads === 0 && c.spend > 500;

        return (
          <div key={c.id} className={`rounded-xl border transition-all ${scoreBad||noLeads ? 'border-red-500/20 bg-red-500/5' : scoreGood ? 'border-green-500/20 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
            <div className="p-4">
              <div className="flex flex-wrap items-start gap-3">
                {/* Status toggle */}
                <button
                  onClick={() => handleToggle(c)}
                  disabled={isToggling}
                  className={`mt-0.5 flex-shrink-0 transition-colors ${isToggling ? 'opacity-50' : ''}`}
                  title={c.status === 'ACTIVE' ? 'Click to Pause' : 'Click to Activate'}
                >
                  {isToggling
                    ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    : c.status === 'ACTIVE'
                      ? <ToggleRight className="w-6 h-6 text-green-400" />
                      : <ToggleLeft  className="w-6 h-6 text-gray-500" />
                  }
                </button>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white text-sm truncate">{c.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusBadge(c.status)}`}>{c.status}</span>
                    {scoreGood && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1"><Star className="w-3 h-3" /> Top Performer</span>}
                    {noLeads   && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> No Leads</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{c.objective?.replace('_',' ')} · ID: {c.id}</p>
                </div>

                {/* Key metrics */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-white">{fmtINR(c.spend)}</p>
                    <p className="text-[10px] text-gray-500">Spend</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white">{c.leads ?? '—'}</p>
                    <p className="text-[10px] text-gray-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-bold ${cplColor(c.cpl)}`}>{fmtINR(c.cpl)}</p>
                    <p className="text-[10px] text-gray-500">CPL</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-bold ${roasColor(c.roas)}`}>{fmtROAS(c.roas)}</p>
                    <p className="text-[10px] text-gray-500">Est.ROAS</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Budget */}
                  {isEditing ? (
                    <BudgetEditor
                      campaignId={c.id}
                      currentBudget={c.daily_budget}
                      onSave={async (id, val) => { await onUpdateBudget(id, val); setEditingId(null); }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setEditingId(c.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-white/10 rounded px-2 py-1 hover:border-white/20 transition-colors"
                      title="Edit daily budget"
                    >
                      <Edit2 className="w-3 h-3" />
                      {c.daily_budget ? fmtINR(c.daily_budget)+'/day' : 'Set Budget'}
                    </button>
                  )}

                  {/* Scale */}
                  {c.status === 'ACTIVE' && c.daily_budget && !isEditing && (
                    <button
                      onClick={() => handleScale(c)}
                      disabled={isScaling}
                      className="flex items-center gap-1 text-xs text-green-300 hover:text-green-200 border border-green-500/30 rounded px-2 py-1 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                      title="Scale budget by +20%"
                    >
                      {isScaling ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3 h-3" />}
                      Scale +20%
                    </button>
                  )}

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="text-gray-500 hover:text-white p-1"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {[
                    { label:'Impressions', value: fmtNum(c.impressions) },
                    { label:'Clicks', value: fmtNum(c.clicks) },
                    { label:'CTR', value: fmtPct(c.ctr) },
                    { label:'CPM', value: fmtINR(c.cpm) },
                    { label:'Reach', value: fmtNum(c.reach) },
                    { label:'Daily Budget', value: fmtINR(c.daily_budget) },
                    { label:'Budget Left', value: fmtINR(c.budget_remaining) },
                  ].map(m => (
                    <div key={m.label} className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                      <p className="text-white font-semibold">{m.value}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{m.label}</p>
                    </div>
                  ))}
                  <a
                    href={`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=1670463227160429&selected_campaign_ids=${c.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-blue-500/10 rounded-lg p-2.5 border border-blue-500/20 flex items-center gap-2 text-blue-300 hover:bg-blue-500/20 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Open in Meta</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Create Campaign Tab ────────────────────────────────────────────────────────
function CreateCampaignTab({ onCreated, getHeaders }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    name: '',
    daily_budget_inr: 500,
    age_min: 18,
    age_max: 40,
    country: 'IN',
    template: 'lead_gen',
  });

  const templates = [
    {
      id: 'lead_gen',
      name: 'Lead Generation — Course',
      icon: '🎓',
      desc: 'Best for getting student registrations. Optimized for Lead conversion events.',
      budget: 500,
      roas: '5x–10x',
      cpl: '₹150–₹300',
    },
    {
      id: 'retarget',
      name: 'Retargeting — Website Visitors',
      icon: '🎯',
      desc: 'Re-engage people who visited your site but didn\'t register. Highest ROAS.',
      budget: 300,
      roas: '8x–15x',
      cpl: '₹80–₹200',
    },
    {
      id: 'awareness',
      name: 'Brand Awareness',
      icon: '📢',
      desc: 'Reach new audiences in Maharashtra. Good for building top-of-funnel.',
      budget: 300,
      roas: '2x–4x',
      cpl: '₹400–₹800',
    },
  ];

  const selectedTemplate = templates.find(t => t.id === form.template);

  const handleCreate = async () => {
    if (!form.name.trim()) { alert('Enter a campaign name'); return; }
    setLoading(true);
    setResult(null);
    try {
      const headers = await getHeaders();
      const res = await fetch(META_MANAGER_URL, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_campaign', ...form }),
      });
      const data = await res.json();
      setResult(data);
      if (data.ok) { onCreated(); setStep(1); setForm(f => ({ ...f, name: '' })); }
    } catch (e) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {[1,2,3].map(s => (
          <React.Fragment key={s}>
            <button
              onClick={() => s < step && setStep(s)}
              className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                step === s ? 'bg-violet-600 text-white' :
                step > s  ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-500'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </button>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-green-600' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
        <div className="ml-2 text-sm text-gray-400">
          {step === 1 && 'Choose Template'} {step === 2 && 'Campaign Settings'} {step === 3 && 'Review & Create'}
        </div>
      </div>

      {/* Step 1: Template */}
      {step === 1 && (
        <div className="space-y-3">
          <h3 className="font-bold text-white">Choose a Campaign Template</h3>
          <p className="text-sm text-gray-400">Templates have pre-optimized settings for maximum ROAS.</p>
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => { setForm(f => ({ ...f, template: t.id, daily_budget_inr: t.budget })); setStep(2); }}
              className={`w-full text-left rounded-xl border p-4 transition-all hover:border-violet-500/40 ${
                form.template === t.id ? 'border-violet-500/60 bg-violet-500/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white flex items-center gap-2">{t.icon} {t.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-green-400">Est. ROAS: {t.roas}</span>
                    <span className="text-yellow-400">CPL: {t.cpl}</span>
                    <span className="text-blue-400">Budget: ₹{t.budget}/day</span>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-500 rotate-[-90deg] flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Settings */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-bold text-white">Campaign Settings</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name *</label>
            <input
              type="text"
              placeholder="e.g. Digital Marketing Course — June 2025"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Daily Budget (₹)</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min="100" max="5000" step="100"
                value={form.daily_budget_inr}
                onChange={e => setForm(f => ({ ...f, daily_budget_inr: Number(e.target.value) }))}
                className="flex-1 accent-violet-500"
              />
              <div className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-bold text-center">
                ₹{form.daily_budget_inr}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-0.5">
              <span>₹100 (min)</span>
              <span className="text-violet-400">₹500 recommended</span>
              <span>₹5000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Age</label>
              <select value={form.age_min} onChange={e => setForm(f => ({ ...f, age_min: Number(e.target.value) }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                {[18,21,24,25,28].map(a => <option key={a} value={a} className="bg-gray-900">{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Age</label>
              <select value={form.age_max} onChange={e => setForm(f => ({ ...f, age_max: Number(e.target.value) }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                {[30,35,40,45,50,65].map(a => <option key={a} value={a} className="bg-gray-900">{a}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
              <option value="IN" className="bg-gray-900">🇮🇳 India</option>
            </select>
          </div>

          {/* Smart tips */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Smart Tips for {selectedTemplate?.name}</p>
            <ul className="space-y-1.5 text-xs text-blue-200">
              <li>✅ Campaign will be created <strong>PAUSED</strong> — review before activating</li>
              <li>✅ Pixel {1920151015239658} is linked for conversion tracking</li>
              <li>✅ Optimization goal: LEAD_GENERATION (best for course registrations)</li>
              <li>💡 After creating, add 3–5 ad creatives (images/videos) in Meta Ads Manager</li>
              <li>💡 Use Advantage+ audience for Meta to find the best leads automatically</li>
              <li>💡 Run for 7+ days before judging performance (learning phase)</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg border border-white/20 text-gray-300 text-sm hover:bg-white/5 transition-colors">Back</button>
            <button onClick={() => setStep(3)} disabled={!form.name.trim()}
              className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
              Review Campaign →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-bold text-white">Review & Create</h3>

          <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10">
            {[
              { label: 'Campaign Name', value: form.name },
              { label: 'Template', value: selectedTemplate?.name },
              { label: 'Daily Budget', value: `₹${form.daily_budget_inr}/day` },
              { label: 'Target Age', value: `${form.age_min}–${form.age_max} years` },
              { label: 'Country', value: '🇮🇳 India' },
              { label: 'Objective', value: 'Lead Generation' },
              { label: 'Initial Status', value: 'PAUSED (safe to review)' },
              { label: 'Pixel', value: '1920151015239658 (linked)' },
            ].map(r => (
              <div key={r.label} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-400">{r.label}</span>
                <span className="text-white font-medium">{r.value}</span>
              </div>
            ))}
          </div>

          {/* Est. results */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Estimated Monthly Results</p>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div><p className="font-bold text-white">₹{(form.daily_budget_inr * 30).toLocaleString('en-IN')}</p><p className="text-xs text-gray-400">Monthly spend</p></div>
              <div><p className="font-bold text-white">{Math.round((form.daily_budget_inr * 30) / 250)}–{Math.round((form.daily_budget_inr * 30) / 150)}</p><p className="text-xs text-gray-400">Est. leads</p></div>
              <div><p className="font-bold text-green-400">{fmtROAS(Math.round((form.daily_budget_inr * 30) / 250) * 15000 / (form.daily_budget_inr * 30))}</p><p className="text-xs text-gray-400">Est. ROAS</p></div>
            </div>
          </div>

          {result && (
            <div className={`rounded-xl border p-4 text-sm ${result.ok ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
              {result.ok
                ? `✅ Campaign created! ID: ${result.campaign_id} · Ad Set: ${result.adset_id}. ${result.note}`
                : `❌ Error: ${result.error} ${JSON.stringify(result.detail || '')}`
              }
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-lg border border-white/20 text-gray-300 text-sm hover:bg-white/5 transition-colors">Back</button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Rocket className="w-4 h-4" /> Create Campaign</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI Advisor Tab ─────────────────────────────────────────────────────────────
function AdvisorTab({ campaigns, stats }) {
  const totalSpend  = campaigns.reduce((s,c) => s + (c.spend||0), 0);
  const totalLeads  = campaigns.reduce((s,c) => s + (c.leads||0), 0);
  const avgCPL      = totalLeads > 0 ? totalSpend / totalLeads : null;
  const estROAS     = totalLeads > 0 && totalSpend > 0 ? (totalLeads * 15000) / totalSpend : null;
  const activeCamps = campaigns.filter(c => c.status === 'ACTIVE');
  const highCPL     = campaigns.filter(c => c.cpl && c.cpl > 500 && c.status === 'ACTIVE');
  const noLeads     = campaigns.filter(c => c.leads === 0 && c.spend > 800 && c.status === 'ACTIVE');
  const winners     = campaigns.filter(c => c.cpl && c.cpl < 200 && c.leads >= 3);
  const lowBudget   = campaigns.filter(c => c.status === 'ACTIVE' && c.daily_budget && c.daily_budget < 300);

  const insights = [];

  // Critical issues
  if (highCPL.length > 0) insights.push({
    type: 'critical', icon: AlertCircle, color: 'red',
    title: `🔴 ${highCPL.length} active campaign(s) with CPL > ₹500`,
    detail: `${highCPL.map(c=>c.name).join(', ')} — Pause or fix these immediately. High CPL burns your budget with low ROAS.`,
    action: 'Pause these campaigns and refresh the creatives.',
  });
  if (noLeads.length > 0) insights.push({
    type: 'critical', icon: AlertCircle, color: 'red',
    title: `🔴 ${noLeads.length} active campaign(s) spending without leads`,
    detail: `${noLeads.map(c=>c.name).join(', ')} — Spent ₹${noLeads.reduce((s,c)=>s+(c.spend||0),0).toFixed(0)} with 0 leads.`,
    action: 'Pause immediately. Check ad creative, audience size, and landing page.',
  });

  // Opportunities
  if (winners.length > 0) insights.push({
    type: 'opportunity', icon: Star, color: 'green',
    title: `🟢 ${winners.length} winning campaign(s) — Scale now!`,
    detail: `${winners.map(c=>`${c.name} (CPL ${fmtINR(c.cpl)})`).join(', ')} — These are performing well.`,
    action: 'Click "Scale +20%" on these campaigns to increase leads while ROAS is good.',
  });
  if (lowBudget.length > 0) insights.push({
    type: 'opportunity', icon: ArrowUpRight, color: 'green',
    title: `💰 ${lowBudget.length} active campaign(s) on low budget (< ₹300/day)`,
    detail: 'Low budget = slow learning phase = poor results. Meta needs data to optimize.',
    action: 'Increase budget to ₹500–₹1000/day for faster learning and better CPL.',
  });

  // Strategy tips
  if (activeCamps.length === 0) insights.push({
    type: 'info', icon: Info, color: 'blue',
    title: '⚡ No active campaigns',
    detail: 'You currently have no running campaigns. Create a new campaign to start getting leads.',
    action: 'Go to 🚀 Create Campaign tab and create a Lead Generation campaign.',
  });
  if (avgCPL && avgCPL > 300) insights.push({
    type: 'warning', icon: AlertTriangle, color: 'yellow',
    title: `⚠️ Average CPL is ${fmtINR(avgCPL)} — above ₹300 target`,
    detail: 'Your average cost per lead is higher than industry standard for EdTech in India.',
    action: 'Test new ad creatives. Use video ads (they get 3x more leads than static images). Narrow audience to 18–30 year olds in Maharashtra.',
  });
  if (campaigns.length > 0 && totalLeads === 0) insights.push({
    type: 'critical', icon: AlertCircle, color: 'red',
    title: '🔴 No lead data — pixel may not be firing',
    detail: 'You have campaigns but no lead data. Either your pixel is not tracking leads, or campaigns are paused/in learning.',
    action: 'Test your pixel at: https://www.facebook.com/events_manager2/list/pixel/1920151015239658/test_events',
  });

  // Always-on best practices
  const checklist = [
    { check: campaigns.some(c=>c.leads>0), label: 'Pixel tracking leads correctly' },
    { check: activeCamps.length > 0, label: 'At least 1 active campaign' },
    { check: !noLeads.length, label: 'No budget-wasting campaigns' },
    { check: winners.length > 0, label: 'Have winning campaigns to scale' },
    { check: avgCPL && avgCPL < 300, label: `Average CPL below ₹300 (current: ${fmtINR(avgCPL)})` },
    { check: estROAS && estROAS >= 5, label: `ROAS above 5x (current: ${fmtROAS(estROAS)})` },
  ];

  const score = checklist.filter(c => c.check).length;
  const scoreColor = score >= 5 ? 'text-green-400' : score >= 3 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-violet-600/10 to-orange-500/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-white text-lg">Ad Account Health Score</h3>
            <p className="text-sm text-gray-400">Based on your current campaign data</p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-black ${scoreColor}`}>{score}/6</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {score >= 5 ? 'Excellent' : score >= 3 ? 'Needs work' : 'Critical issues'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {item.check
                ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                : <AlertCircle  className="w-4 h-4 text-red-400 flex-shrink-0" />
              }
              <span className={item.check ? 'text-gray-300' : 'text-red-300'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable insights */}
      <div>
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" /> AI Recommendations ({insights.length})
        </h3>
        {insights.length === 0 ? (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-5 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="font-bold text-green-300">Everything looks great!</p>
            <p className="text-sm text-gray-400 mt-1">No critical issues detected. Keep scaling winners.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((ins, i) => {
              const colors = {
                red:    'border-red-500/30 bg-red-500/10',
                yellow: 'border-yellow-500/30 bg-yellow-500/10',
                green:  'border-green-500/30 bg-green-500/10',
                blue:   'border-blue-500/30 bg-blue-500/10',
              };
              const iconColors = { red:'text-red-400', yellow:'text-yellow-400', green:'text-green-400', blue:'text-blue-400' };
              return (
                <div key={i} className={`rounded-xl border p-4 ${colors[ins.color]}`}>
                  <p className="font-bold text-white text-sm">{ins.title}</p>
                  <p className="text-xs text-gray-300 mt-1">{ins.detail}</p>
                  <div className="mt-2 flex items-start gap-2">
                    <ArrowUpRight className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${iconColors[ins.color]}`} />
                    <p className={`text-xs font-semibold ${iconColors[ins.color]}`}>{ins.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Meta Ads Masterclass */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Max ROAS Playbook for Digital Marketing Courses</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {[
            {
              title: '🎥 Video Ads Get 3x More Leads',
              tips: ['Use 15–30 second Reels-format videos', 'Show student success stories/testimonials', 'First 3 seconds must grab attention', 'Add captions — 85% watch without sound'],
            },
            {
              title: '🎯 Audience Strategy',
              tips: ['Start with Advantage+ Audience', 'Exclude existing leads (upload custom audience)', 'Lookalike from your top 100 leads', 'Target: 18–30, Maharashtra, Job seekers'],
            },
            {
              title: '💰 Budget Strategy',
              tips: ['Start with ₹500/day per campaign', 'Don\'t touch budget for 7 days (learning phase)', 'Scale winners by 20% every 3 days max', 'Never cut budget by >25% at once — resets learning'],
            },
            {
              title: '📐 Creative Best Practices',
              tips: ['Test 3–5 different ad creatives per campaign', 'Use social proof: "500+ students placed"', 'Strong CTA: "Register Free Demo — Limited Seats"', 'Mobile-first: 9:16 vertical format'],
            },
            {
              title: '🔄 Campaign Structure (Best)',
              tips: ['1 campaign = 1 objective', '2–3 ad sets per campaign', '3–5 ads per ad set', 'Duplicate winning ad sets, don\'t edit them'],
            },
            {
              title: '📊 When to Pause a Campaign',
              tips: ['CPL > ₹500 after ₹2000 spend', '0 leads after ₹1000 spend', 'CTR < 0.5% (bad creative)', 'Frequency > 3 (audience fatigued — refresh creative)'],
            },
          ].map((section, i) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="font-bold text-white mb-2">{section.title}</p>
              <ul className="space-y-1">
                {section.tips.map((tip, j) => (
                  <li key={j} className="text-gray-400 text-xs flex items-start gap-1.5">
                    <span className="text-violet-400 mt-0.5">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Token expiry warning */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
        <p className="text-sm font-semibold text-yellow-300 flex items-center gap-2 mb-1"><Clock className="w-4 h-4" /> Token Expiry Reminder</p>
        <p className="text-xs text-yellow-200">Your Meta Marketing API token expires in ~60 days. When the dashboard stops showing data, go to <strong>developers.facebook.com/tools/explorer</strong> and regenerate the token. Update it by telling me the new token.</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminMetaAds = () => {
  const [tab, setTab]             = useState('overview');
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [datePreset, setDatePreset] = useState('last_7d');
  const mountedRef = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const getHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return token ? { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '' } : {};
  }, []);

  const loadData = useCallback(async (preset = datePreset) => {
    setLoading(true);
    try {
      const headers = await getHeaders();

      // Fetch campaigns from manager + stats in parallel
      const [camRes, statsRes] = await Promise.all([
        fetch(META_MANAGER_URL, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list_campaigns', date_preset: preset }),
        }),
        fetch(`${META_STATS_URL}?date_preset=${preset}`, { headers }),
      ]);

      const [camData, statsData] = await Promise.all([camRes.json(), statsRes.json()]);
      if (!mountedRef.current) return;
      if (camData.ok) setCampaigns(camData.campaigns ?? []);
      if (statsData.ok) setStats(statsData);
    } catch (e) {
      console.error('Failed to load Meta data:', e);
    }
    if (mountedRef.current) setLoading(false);
  }, [datePreset, getHeaders]);

  useEffect(() => { loadData(datePreset); }, [datePreset]);

  const handleToggle = async (campaignId, newStatus) => {
    try {
      const headers = await getHeaders();
      await fetch(META_MANAGER_URL, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status', object_id: campaignId, status: newStatus }),
      });
      setCampaigns(cs => cs.map(c => c.id === campaignId ? { ...c, status: newStatus } : c));
    } catch (e) { console.error(e); }
  };

  const handleUpdateBudget = async (campaignId, budgetINR) => {
    try {
      const headers = await getHeaders();
      await fetch(META_MANAGER_URL, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_budget', object_id: campaignId, daily_budget_inr: budgetINR }),
      });
      setCampaigns(cs => cs.map(c => c.id === campaignId ? { ...c, daily_budget: budgetINR } : c));
    } catch (e) { console.error(e); }
  };

  const handleScale = async (campaignId, currentBudget) => {
    const newBudget = Math.round((currentBudget || 500) * 1.2);
    await handleUpdateBudget(campaignId, newBudget);
  };

  return (
    <AdminShell title="Meta Ads Pro">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-gradient-to-r from-violet-600/30 to-orange-500/20 text-white border border-violet-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'  && <OverviewTab  stats={stats} campaigns={campaigns} loading={loading} datePreset={datePreset} setDatePreset={setDatePreset} refresh={() => loadData(datePreset)} />}
      {tab === 'campaigns' && <CampaignsTab campaigns={campaigns} loading={loading} onToggle={handleToggle} onUpdateBudget={handleUpdateBudget} onScale={handleScale} refresh={() => loadData(datePreset)} />}
      {tab === 'create'    && <CreateCampaignTab onCreated={() => { loadData(datePreset); setTab('campaigns'); }} getHeaders={getHeaders} />}
      {tab === 'advisor'   && <AdvisorTab campaigns={campaigns} stats={stats} />}
    </AdminShell>
  );
};

export default AdminMetaAds;
