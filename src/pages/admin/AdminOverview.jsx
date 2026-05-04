import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Users, FileText, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminShell from '@/components/admin/AdminShell';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [leadsRes, blogsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('blogs').select('id, title, slug, is_published, created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      setLeads(leadsRes.data || []);
      setBlogs(blogsRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const t = todayStart.getTime();
    const weekAgo = t - 7 * 24 * 60 * 60 * 1000;
    return {
      totalLeads: leads.length,
      todayLeads: leads.filter((l) => new Date(l.created_at).getTime() >= t).length,
      weekLeads: leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length,
      totalBlogs: blogs.length,
      publishedBlogs: blogs.filter((b) => b.is_published).length,
    };
  }, [leads, blogs]);

  return (
    <AdminShell title="Overview">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Today', value: stats.todayLeads, sub: 'leads' },
              { label: 'Last 7 days', value: stats.weekLeads, sub: 'leads' },
              { label: 'Recent leads', value: stats.totalLeads, sub: 'in last 20' },
              { label: 'Recent posts', value: stats.publishedBlogs, sub: 'published' },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-xs text-gray-600 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Users className="w-4 h-4 text-violet-400" /> Recent leads
                </div>
                <Link to="/admin/leads" className="text-xs text-violet-300 hover:text-violet-200 inline-flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {leads.slice(0, 8).length === 0 ? (
                  <p className="text-xs text-gray-600 py-6 text-center">No leads yet — submit a test from your contact form to verify.</p>
                ) : (
                  leads.slice(0, 8).map((l) => (
                    <Link
                      key={l.id}
                      to="/admin/leads"
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/5 border border-white/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{l.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {l.source || 'website'} · {l.email || l.phone || '—'}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 flex-shrink-0">
                        {new Date(l.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <FileText className="w-4 h-4 text-orange-400" /> Recent blog posts
                </div>
                <Link to="/admin/blogs" className="text-xs text-violet-300 hover:text-violet-200 inline-flex items-center gap-1">
                  Manage <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {blogs.length === 0 ? (
                  <p className="text-xs text-gray-600 py-6 text-center">No blog posts yet.</p>
                ) : (
                  blogs.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-white/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{b.title || 'Untitled'}</p>
                        <p className="text-xs text-gray-600 truncate">/blog/{b.slug}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          b.is_published ? 'bg-green-500/15 text-green-300 border border-green-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {b.is_published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-violet-500/20 p-5" style={{ background: 'rgba(139,92,246,0.05)' }}>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-300 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-white mb-1">Quick checks</p>
                <ul className="text-xs text-gray-400 space-y-1.5 leading-relaxed">
                  <li>• Drop a test submission on the homepage form to confirm leads land here.</li>
                  <li>• Paste your full Meta Pixel code under SEO Settings → Tracking to enable client-side events.</li>
                  <li>• Set <code className="bg-black/40 px-1 rounded">META_PIXEL_ID</code>, <code className="bg-black/40 px-1 rounded">META_CAPI_TOKEN</code>, and <code className="bg-black/40 px-1 rounded">RESEND_API_KEY</code> as Edge Function secrets.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
};

export default AdminOverview;
