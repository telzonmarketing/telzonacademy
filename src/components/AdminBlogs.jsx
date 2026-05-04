import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, PlusCircle, Trash2, Edit2, Save, X, Eye, EyeOff,
  FileText, Search, Globe, CheckCircle, AlertCircle, Lock,
  ArrowLeft, RefreshCw, BookOpen, Zap, ChevronRight, Clock,
  TrendingUp, Hash, ExternalLink, Sparkles, AlignLeft,
  Tag, BarChart2, Calendar, Copy, Check, Bold, Italic,
  List, Link2, Heading2, Heading3, Minus, CornerDownLeft, Image,
} from 'lucide-react';

const EMPTY_BLOG = {
  id: null, title: '', slug: '', category: '', excerpt: '', content: '',
  meta_title: '', meta_description: '', og_title: '', og_description: '',
  cover_image: '', author: 'Telzon Academy', read_time: '', tags: '',
  is_published: false,
};

const CATEGORIES = [
  'SEO', 'Social Media', 'Google Ads', 'Content Marketing',
  'Email Marketing', 'Analytics', 'E-commerce', 'Career Tips',
  'Digital Marketing', 'Local SEO', 'General',
];

const KEYWORD_SUGGESTIONS = [
  'digital marketing course in Nagpur',
  'SEO training Nagpur',
  'social media marketing Nagpur',
  'Google Ads course Nagpur',
  'digital marketing institute Nagpur',
  'content marketing strategy India',
  'email marketing tips 2025',
  'local SEO for small business Nagpur',
  'digital marketing salary India 2025',
];

function slugify(str) {
  return str.toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

function wordCount(html) {
  return (html || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
}

function readTime(content) {
  return Math.max(1, Math.ceil(wordCount(content) / 200));
}

function calcSeo(form) {
  const wc = wordCount(form.content);
  const titleHasKw = /nagpur|digital marketing|seo|marketing/i.test(form.title);
  const descHasKw  = /nagpur|digital marketing|seo|marketing/i.test(form.meta_description);
  const checks = [
    { label: 'Title 50–70 characters',         pass: form.title.length >= 50 && form.title.length <= 70 },
    { label: 'Keyword in title',                pass: titleHasKw },
    { label: 'Meta description 150–160 chars',  pass: form.meta_description.length >= 150 && form.meta_description.length <= 165 },
    { label: 'Keyword in meta description',     pass: descHasKw },
    { label: 'Clean slug (≤60 chars)',           pass: form.slug.length > 0 && form.slug.length <= 60 },
    { label: 'Content ≥ 800 words',             pass: wc >= 800 },
    { label: 'Excerpt 80+ characters',          pass: form.excerpt.length >= 80 },
    { label: 'Cover image set',                 pass: form.cover_image.length > 0 },
    { label: 'OG Title filled',                 pass: form.og_title.length > 0 },
    { label: 'OG Description filled',           pass: form.og_description.length > 0 },
    { label: 'Category selected',               pass: form.category.length > 0 },
    { label: 'Tags added',                      pass: form.tags.length > 0 },
  ];
  return { score: Math.round(checks.filter(c => c.pass).length / checks.length * 100), checks };
}

// ─── SEO Score Ring ───────────────────────────────────────────────────────────
function SeoRing({ score }) {
  const r = 26, c = 2 * Math.PI * r;
  const col = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="64" height="64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }} transition={{ duration: 0.8 }} />
      </svg>
      <span className="text-base font-black z-10" style={{ color: col }}>{score}</span>
    </div>
  );
}

// ─── SEO Panel ────────────────────────────────────────────────────────────────
function SeoPanel({ form }) {
  const { score, checks } = calcSeo(form);
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Score</span>
        </div>
        <SeoRing score={score} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/[0.06] pt-3 space-y-1.5">
              {checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  {c.pass ? <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    : <div className="w-3 h-3 rounded-full border border-gray-800 flex-shrink-0" />}
                  <span className={`text-xs ${c.pass ? 'text-gray-400' : 'text-gray-700'}`}>{c.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function TB({ title, onClick, children }) {
  return (
    <button type="button" title={title} onClick={onClick}
      className="p-1.5 rounded text-gray-600 hover:text-white hover:bg-white/10 transition-colors">
      {children}
    </button>
  );
}

// ─── Blog Row ─────────────────────────────────────────────────────────────────
function BlogRow({ blog, onEdit, onDelete, onToggle }) {
  const [copied, setCopied] = useState(false);
  const copyUrl = () => {
    navigator.clipboard.writeText(`https://telzonacademy.in/blog/${blog.slug}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/[0.06] hover:border-white/15 transition-all"
      style={{ background: 'rgba(255,255,255,0.025)' }}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${blog.is_published ? 'bg-green-500 shadow-[0_0_6px_#22c55e80]' : 'bg-gray-800'}`} />
      {blog.cover_image && <img src={blog.cover_image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 opacity-70" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">{blog.title || 'Untitled'}</p>
        <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
          <span className="text-xs text-gray-700">/blog/{blog.slug}</span>
          {blog.category && <span className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/15">{blog.category}</span>}
          <span className="text-xs text-gray-700 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.created_at).toLocaleDateString('en-IN')}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={copyUrl} className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={() => onToggle(blog)} className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${blog.is_published ? 'text-green-400' : 'text-gray-700 hover:text-gray-400'}`}>
          {blog.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => onEdit(blog)} className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(blog.id)} className="p-1.5 text-red-600 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminBlogs = () => {
  const [blogs, setBlogs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [view, setView]               = useState('list');
  const [form, setForm]               = useState({ ...EMPTY_BLOG });
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [error, setError]             = useState(null);
  const [toast, setToast]             = useState(null);
  const [tab, setTab]                 = useState('content');
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiPrompt, setAiPrompt]       = useState('');
  const [showAi, setShowAi]           = useState(false);
  const contentRef = useRef(null);

  const notify = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const openNew  = ()  => { setForm({ ...EMPTY_BLOG }); setView('editor'); setTab('content'); setError(null); };
  const openEdit = (b) => {
    setForm({ id: b.id, title: b.title||'', slug: b.slug||'', category: b.category||'',
      excerpt: b.excerpt||'', content: b.content||'', meta_title: b.meta_title||'',
      meta_description: b.meta_description||'', og_title: b.og_title||'',
      og_description: b.og_description||'', cover_image: b.cover_image||'',
      author: b.author||'Telzon Academy', read_time: b.read_time||'',
      tags: b.tags||'', is_published: b.is_published||false });
    setView('editor'); setTab('content'); setError(null);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      setBlogs(p => p.filter(b => b.id !== id)); notify('Post deleted');
    } catch (e) { notify(e.message, 'error'); } finally { setSaving(false); }
  };

  const togglePublish = async (blog) => {
    try {
      const { error } = await supabase.from('blogs')
        .update({ is_published: !blog.is_published, updated_at: new Date().toISOString() }).eq('id', blog.id);
      if (error) throw error;
      setBlogs(p => p.map(b => b.id === blog.id ? { ...b, is_published: !b.is_published } : b));
      notify(blog.is_published ? 'Post unpublished' : 'Published! 🚀');
    } catch (e) { notify(e.message, 'error'); }
  };

  const onChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title') {
        if (!prev.id) next.slug = slugify(value);
        if (!prev.meta_title || prev.meta_title === prev.title) next.meta_title = value;
        if (!prev.og_title || prev.og_title === prev.title) next.og_title = value;
      }
      if (name === 'excerpt') {
        if (!prev.meta_description || prev.meta_description === prev.excerpt.slice(0,160)) next.meta_description = value.slice(0,160);
        if (!prev.og_description || prev.og_description === prev.excerpt.slice(0,200)) next.og_description = value.slice(0,200);
      }
      if (name === 'content') next.read_time = String(readTime(value));
      return next;
    });
  }, []);

  const insertTag = (before, after = '') => {
    const el = contentRef.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd, sel = el.value.slice(s, e);
    const nv = el.value.slice(0, s) + before + sel + after + el.value.slice(e);
    setForm(p => ({ ...p, content: nv }));
    setTimeout(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + sel.length); }, 0);
  };

  // AI Blog Generation
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) { notify('Enter a topic or keyword first', 'error'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: `You are an expert SEO content writer for Telzon Academy, a digital marketing training institute in Nagpur, India.

Write a complete, high-quality blog post for the keyword/topic: "${aiPrompt}"

Requirements:
- title: 50-70 chars, include "Nagpur" if relevant, keyword-rich
- excerpt: 100-150 chars, engaging hook
- content: 950-1200 words in HTML. Use <h2>, <h3>, <p>, <ul><li>. Include naturally: "digital marketing course in Nagpur" as anchor text with href="/pages/digital-marketing-course-in-nagpur". Mention Nagpur 3-4 times. Provide real, actionable value.
- meta_title: 55-65 chars with keyword
- meta_description: 150-158 chars with keyword + soft CTA
- og_title: compelling social share title
- og_description: 120-180 chars
- tags: 6-8 comma-separated tags
- category: one of [SEO, Social Media, Google Ads, Content Marketing, Email Marketing, Analytics, E-commerce, Career Tips, Digital Marketing, Local SEO, General]

Respond ONLY with raw JSON (no markdown, no explanation):
{"title":"","excerpt":"","content":"","meta_title":"","meta_description":"","og_title":"","og_description":"","tags":"","category":""}`
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean);
      setForm(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        slug: slugify(parsed.title || prev.title),
        excerpt: parsed.excerpt || prev.excerpt,
        content: parsed.content || prev.content,
        meta_title: parsed.meta_title || prev.meta_title,
        meta_description: parsed.meta_description || prev.meta_description,
        og_title: parsed.og_title || prev.og_title,
        og_description: parsed.og_description || prev.og_description,
        tags: parsed.tags || prev.tags,
        category: parsed.category || prev.category,
        read_time: String(readTime(parsed.content || '')),
      }));
      setShowAi(false); setAiPrompt('');
      notify('Blog generated! Review before publishing ✨');
    } catch (e) {
      notify('AI generation failed — try again', 'error');
    } finally { setAiLoading(false); }
  };

  const save = async (publish = null) => {
    setSaving(true); setError(null);
    try {
      const payload = { ...form, is_published: publish !== null ? publish : form.is_published,
        read_time: form.read_time || String(readTime(form.content)), updated_at: new Date().toISOString() };
      if (!payload.id) delete payload.id;
      const { error } = await supabase.from('blogs').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      await fetchBlogs(); setView('list');
      notify(publish ? 'Published! Google will index this shortly 🚀' : 'Draft saved ✓');
    } catch (e) { setError(e.message); notify(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const filtered = blogs.filter(b => {
    const ms = !search || [b.title, b.slug, b.tags, b.category].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const mf = filter === 'all' || (filter === 'published' ? b.is_published : !b.is_published);
    return ms && mf;
  });

  const stats = { total: blogs.length, published: blogs.filter(b => b.is_published).length,
    drafts: blogs.filter(b => !b.is_published).length,
    avgWords: blogs.length ? Math.round(blogs.reduce((a, b) => a + wordCount(b.content||''), 0) / blogs.length) : 0 };

  const inp = { className: "w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all", style: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' } };

  return (
    <div className="min-h-screen text-white" style={{ background: '#060612' }}>
      <Helmet><title>Blog Admin | Telzon Academy</title><meta name="robots" content="noindex, nofollow" /></Helmet>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl flex items-center gap-2 max-w-xs ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'} text-white`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(6,6,18,0.96)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== 'list' && (
              <button onClick={() => { setView('list'); setError(null); }} className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-orange-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-sm">Telzon Blog Admin</span>
            {view === 'editor' && <><ChevronRight className="w-3 h-3 text-gray-700" /><span className="text-sm text-gray-600">{form.id ? 'Edit Post' : 'New Post'}</span></>}
          </div>
          <div className="flex items-center gap-2">
            {view === 'list' && <button onClick={fetchBlogs} className="p-1.5 text-gray-600 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><RefreshCw className="w-4 h-4" /></button>}
            {view === 'editor' && <>
              <button onClick={() => setView('preview')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button onClick={() => save(false)} disabled={saving} className="flex items-center gap-1.5 text-xs text-gray-300 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-40 transition-all">
                <Save className="w-3.5 h-3.5" /> Draft
              </button>
              <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 shadow-lg disabled:opacity-40 transition-all">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Publish
              </button>
            </>}
            {view === 'preview' && <button onClick={() => setView('editor')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
              <Edit2 className="w-3.5 h-3.5" /> Back to Editor
            </button>}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── LIST ── */}
        {view === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total', value: stats.total, icon: FileText, g: 'from-violet-600 to-purple-700' },
                { label: 'Published', value: stats.published, icon: Globe, g: 'from-green-600 to-emerald-600' },
                { label: 'Drafts', value: stats.drafts, icon: Clock, g: 'from-orange-500 to-amber-500' },
                { label: 'Avg Words', value: stats.avgWords, icon: BarChart2, g: 'from-blue-600 to-cyan-500' },
              ].map(({ label, value, icon: I, g }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g} flex items-center justify-center flex-shrink-0 shadow-lg`}><I className="w-4 h-4 text-white" /></div>
                  <div><p className="text-xl font-black text-white leading-none">{value}</p><p className="text-xs text-gray-700 mt-0.5">{label}</p></div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <input type="text" placeholder="Search posts, slugs, tags…" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} />
              </div>
              <div className="flex rounded-xl p-1 gap-1 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['all', 'published', 'draft'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-gray-700 hover:text-gray-400'}`}>{f}
                  </button>
                ))}
              </div>
              <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-orange-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 shadow-lg whitespace-nowrap">
                <PlusCircle className="w-4 h-4" /> New Post
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <FileText className="w-10 h-10 text-gray-800 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No posts found</p>
                <button onClick={openNew} className="mt-3 text-xs text-violet-500 hover:text-violet-400 underline underline-offset-2">Create new post →</button>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>{filtered.map(b => <BlogRow key={b.id} blog={b} onEdit={openEdit} onDelete={deleteBlog} onToggle={togglePublish} />)}</AnimatePresence>
              </div>
            )}

            <div className="mt-6 p-4 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-xs text-gray-700 font-bold uppercase tracking-wider mb-3">📍 High-value keywords — click to auto-generate</p>
              <div className="flex flex-wrap gap-2">
                {KEYWORD_SUGGESTIONS.map(kw => (
                  <button key={kw} onClick={() => { setAiPrompt(kw); openNew(); setShowAi(true); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-violet-500/20 text-violet-500 hover:bg-violet-500/10 hover:text-violet-300 transition-colors">
                    + {kw}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EDITOR ── */}
        {view === 'editor' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-4">

              {/* AI Generator */}
              <div className="rounded-2xl overflow-hidden border border-violet-500/20" style={{ background: 'rgba(139,92,246,0.05)' }}>
                <button onClick={() => setShowAi(o => !o)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-500/10 transition-colors text-left">
                  <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-violet-300">AI Blog Generator</span>
                  <span className="text-xs text-violet-600 ml-auto">Generate full SEO post</span>
                </button>
                <AnimatePresence>
                  {showAi && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 border-t border-violet-500/15 pt-3 space-y-3">
                        <p className="text-xs text-violet-500/80">Enter a keyword — AI writes a full 950+ word SEO post with meta tags, OG data, schema, and internal links.</p>
                        <div className="flex gap-2">
                          <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && generateWithAI()}
                            placeholder="e.g. best digital marketing course in Nagpur 2025"
                            className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }} />
                          <button onClick={generateWithAI} disabled={aiLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold disabled:opacity-50 whitespace-nowrap transition-all">
                            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {aiLoading ? 'Generating…' : 'Generate'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {KEYWORD_SUGGESTIONS.map(kw => (
                            <button key={kw} onClick={() => setAiPrompt(kw)}
                              className="text-xs px-2.5 py-1 rounded-full border border-violet-500/20 text-violet-600 hover:text-violet-300 transition-colors">{kw}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title */}
              <div className="rounded-2xl border border-white/[0.07] px-5 py-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <input name="title" value={form.title} onChange={onChange} placeholder="Post title…"
                  className="w-full bg-transparent text-2xl md:text-3xl font-black text-white placeholder-gray-800 focus:outline-none" />
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.05]">
                  <span className="text-xs text-gray-700">slug:</span>
                  <input name="slug" value={form.slug} onChange={onChange}
                    className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none focus:text-gray-400 font-mono" />
                  <span className={`text-xs ${form.title.length > 70 ? 'text-red-400' : 'text-gray-700'}`}>{form.title.length}/70</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl w-fit border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {[{ id: 'content', label: 'Content', icon: AlignLeft }, { id: 'seo', label: 'SEO & Meta', icon: TrendingUp }, { id: 'settings', label: 'Settings', icon: Hash }].map(({ id, label, icon: I }) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === id ? 'bg-white/10 text-white' : 'text-gray-700 hover:text-gray-400'}`}>
                    <I className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>

              {/* CONTENT */}
              {tab === 'content' && <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.07] p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Excerpt</label>
                    <span className={`text-xs ${form.excerpt.length > 200 ? 'text-red-400' : 'text-gray-700'}`}>{form.excerpt.length}/200</span>
                  </div>
                  <textarea name="excerpt" value={form.excerpt} onChange={onChange} rows={2}
                    placeholder="Compelling summary shown in blog card listings…"
                    className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-700 focus:outline-none resize-none leading-relaxed" />
                </div>

                <div className="rounded-2xl border border-white/[0.07] p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Image className="w-3.5 h-3.5" /> Cover Image URL</label>
                  <input name="cover_image" value={form.cover_image} onChange={onChange}
                    placeholder="https://images.unsplash.com/photo-…"
                    className="w-full bg-transparent text-sm text-gray-500 placeholder-gray-700 focus:outline-none font-mono" />
                  {form.cover_image && <img src={form.cover_image} alt="" className="mt-3 h-36 w-full object-cover rounded-xl border border-white/10" />}
                </div>

                <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] flex-wrap">
                    <TB title="H2" onClick={() => insertTag('<h2>', '</h2>')}><Heading2 className="w-4 h-4" /></TB>
                    <TB title="H3" onClick={() => insertTag('<h3>', '</h3>')}><Heading3 className="w-4 h-4" /></TB>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <TB title="Bold" onClick={() => insertTag('<strong>', '</strong>')}><Bold className="w-4 h-4" /></TB>
                    <TB title="Italic" onClick={() => insertTag('<em>', '</em>')}><Italic className="w-4 h-4" /></TB>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <TB title="Paragraph" onClick={() => insertTag('<p>', '</p>')}><CornerDownLeft className="w-4 h-4" /></TB>
                    <TB title="UL" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}><List className="w-4 h-4" /></TB>
                    <TB title="LI" onClick={() => insertTag('<li>', '</li>')}><Minus className="w-4 h-4" /></TB>
                    <TB title="Link" onClick={() => insertTag('<a href="">', '</a>')}><Link2 className="w-4 h-4" /></TB>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button type="button" onClick={() => insertTag('<a href="/pages/digital-marketing-course-in-nagpur">', '</a>')}
                      className="text-xs px-2 py-1 rounded bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-colors font-semibold">
                      + Internal Link
                    </button>
                    <span className="ml-auto text-xs text-gray-700">{wordCount(form.content)} words</span>
                    <span className={`text-xs ml-1.5 ${wordCount(form.content) >= 800 ? 'text-green-500' : 'text-gray-700'}`}>
                      {wordCount(form.content) >= 800 ? '✓ 800+' : `need ${800 - wordCount(form.content)} more`}
                    </span>
                  </div>
                  <textarea ref={contentRef} name="content" value={form.content} onChange={onChange} rows={22}
                    placeholder={"Write your blog content in HTML.\n\n<h2>Section Title</h2>\n<p>Your paragraph here...</p>\n<ul>\n  <li>Key point</li>\n  <li>Key point</li>\n</ul>\n\n<h2>Conclusion</h2>\n<p>Wrap up with a CTA: <a href=\"/pages/digital-marketing-course-in-nagpur\">digital marketing course in Nagpur</a></p>"}
                    className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-700 focus:outline-none resize-none p-4 font-mono leading-relaxed"
                    style={{ minHeight: '420px' }} />
                </div>
              </div>}

              {/* SEO */}
              {tab === 'seo' && <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.07] p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Google Search Preview</p>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-xs text-green-700">telzonacademy.in › blog › {form.slug || 'your-post-slug'}</p>
                    <p className="text-base text-blue-700 font-medium hover:underline cursor-pointer mt-0.5 leading-tight">
                      {form.meta_title || form.title || 'Your Post Title | Telzon Academy'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {form.meta_description || form.excerpt || 'Write a meta description to preview it here…'}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Meta Title</label>
                      <span className={`text-xs ${form.meta_title.length > 70 ? 'text-red-400' : form.meta_title.length >= 50 ? 'text-green-500' : 'text-gray-700'}`}>{form.meta_title.length}/70</span></div>
                    <input name="meta_title" value={form.meta_title} onChange={onChange} placeholder="Keyword-rich title (50–70 chars)" {...inp} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Meta Description</label>
                      <span className={`text-xs ${form.meta_description.length > 165 ? 'text-red-400' : form.meta_description.length >= 150 ? 'text-green-500' : 'text-gray-700'}`}>{form.meta_description.length}/160</span></div>
                    <textarea name="meta_description" value={form.meta_description} onChange={onChange} rows={3}
                      placeholder="Compelling description with keyword + CTA (150–160 chars)" {...inp} style={{ ...inp.style, resize: 'none' }} />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Open Graph — Social Sharing</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><label className="text-xs font-bold text-gray-600 uppercase tracking-wider">OG Title</label>
                      <span className={`text-xs ${form.og_title.length > 95 ? 'text-red-400' : 'text-gray-700'}`}>{form.og_title.length}/95</span></div>
                    <input name="og_title" value={form.og_title} onChange={onChange} placeholder="Title when shared on WhatsApp, LinkedIn…" {...inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">OG Description</label>
                    <textarea name="og_description" value={form.og_description} onChange={onChange} rows={2}
                      placeholder="Social share description" {...inp} style={{ ...inp.style, resize: 'none' }} />
                  </div>
                </div>
                <SeoPanel form={form} />
              </div>}

              {/* SETTINGS */}
              {tab === 'settings' && <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.07] p-5 space-y-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-3">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat} type="button" onClick={() => setForm(p => ({ ...p, category: cat }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${form.category === cat ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-gray-600 border border-white/10 hover:border-white/20 hover:text-white'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Author</label>
                    <input name="author" value={form.author} onChange={onChange} placeholder="Telzon Academy" {...inp} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Tags (comma-separated)</label>
                    <input name="tags" value={form.tags} onChange={onChange} placeholder="SEO, Nagpur, Digital Marketing, Google Ads" {...inp} />
                    {form.tags && <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-gray-600 border border-white/10">#{t}</span>
                      ))}
                    </div>}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div><p className="text-sm font-bold text-white">Publish Post</p><p className="text-xs text-gray-700 mt-0.5">Make live on website</p></div>
                    <button type="button" onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.is_published ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.35)]' : 'bg-white/10'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.is_published ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
                {error && <div className="p-3 rounded-xl text-red-400 text-xs border border-red-500/25" style={{ background: 'rgba(239,68,68,0.08)' }}>{error}</div>}
              </div>}
            </div>

            {/* Sidebar */}
            <div className="w-56 flex-shrink-0 space-y-3 sticky top-20">
              <SeoPanel form={form} />
              <div className="rounded-2xl border border-white/[0.07] p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1 mb-1">Actions</p>
                <button onClick={() => save(false)} disabled={saving} className="w-full flex items-center gap-2 text-xs text-gray-500 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/8 disabled:opacity-40 transition-all">
                  <Save className="w-3.5 h-3.5" /> Save Draft
                </button>
                <button onClick={() => save(true)} disabled={saving} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 shadow-lg disabled:opacity-40 transition-all">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Publish Now
                </button>
                <button onClick={() => { setView('list'); setForm({ ...EMPTY_BLOG }); setError(null); }} className="w-full flex items-center gap-2 text-xs text-gray-700 hover:text-gray-500 px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                  <X className="w-3.5 h-3.5" /> Discard
                </button>
              </div>
              <div className="rounded-2xl border border-white/[0.06] p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">SEO Tips</p>
                <div className="space-y-1.5 text-xs text-gray-700">
                  <p>✦ One keyword focus per post</p>
                  <p>✦ Keyword in first &lt;h2&gt;</p>
                  <p>✦ Include "Nagpur" 3–4×</p>
                  <p>✦ Add internal link to course page</p>
                  <p>✦ Target 800–1200 words</p>
                  <p>✦ Use Unsplash cover image</p>
                  <p>✦ Add 6–8 tags</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PREVIEW ── */}
        {view === 'preview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {form.cover_image && <img src={form.cover_image} alt={form.title} className="w-full h-56 object-cover" />}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  {form.category && <span className="text-xs bg-violet-500/15 text-violet-400 px-2.5 py-1 rounded-full border border-violet-500/20">{form.category}</span>}
                  <span className="text-xs text-gray-600">{readTime(form.content)} min read · {wordCount(form.content)} words</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{form.title || 'Post Title'}</h1>
                {form.excerpt && <p className="text-gray-400 border-l-4 border-violet-500 pl-4 mb-6 italic">{form.excerpt}</p>}
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: (form.content || '<p style="color:#374151">No content yet…</p>').replace(/\n/g, '<br/>') }} />
                {form.tags && <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
                  {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-600 border border-white/10">#{t}</span>
                  ))}
                </div>}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;
