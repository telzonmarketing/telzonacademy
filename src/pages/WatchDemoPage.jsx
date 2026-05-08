import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Star, Zap, TrendingUp, Users, MessageCircle,
  X, Send, Award, Target, Briefcase, Shield, Clock,
  Flame, ChevronDown, Play, Loader2, BadgeCheck,
} from 'lucide-react';
import { submitLead, firePixelViewContent, firePixelSchedule } from '@/lib/leadSubmit';
import { supabase } from '@/lib/customSupabaseClient';

/* ─── keyframes injected once ───────────────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('nb-styles')) {
  const s = document.createElement('style');
  s.id = 'nb-styles';
  s.textContent = `
    @keyframes marquee-left  { from{transform:translateX(0)}   to{transform:translateX(-50%)} }
    @keyframes marquee-right { from{transform:translateX(-50%)} to{transform:translateX(0)}   }
    @keyframes pulse-ring    { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.6);opacity:0} }
    @keyframes count-up      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .nb-sticky-cta { position:fixed; bottom:0; left:0; right:0; z-index:40; padding:12px 16px 20px;
      background:linear-gradient(to top,#0d0720 60%,transparent);
      display:none; }
    @media(max-width:767px){ .nb-sticky-cta{ display:block; } }
    .line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}
  `;
  document.head.appendChild(s);
}

/* ─── data ───────────────────────────────────────────────────────────────── */
const WHAT_YOU_GET = [
  { emoji: '🎯', title: 'SEO & Google Ads', desc: 'Rank on Google + run search campaigns from day 1' },
  { emoji: '📱', title: 'Meta Ads Mastery', desc: 'Facebook & Instagram ads that actually convert' },
  { emoji: '🎬', title: 'Content Strategy', desc: 'Reels, posts & copy that builds brand & sales' },
  { emoji: '📊', title: 'Analytics & Reports', desc: 'Read data, optimise campaigns, prove ROI' },
  { emoji: '💼', title: 'Live Projects', desc: 'Real brand campaigns — your portfolio is built here' },
  { emoji: '🏆', title: 'Google & Meta Cert', desc: 'Industry certificates recruiters & clients respect' },
  { emoji: '🤝', title: 'Placement Support', desc: '95% hiring rate via our partner network' },
  { emoji: '⚡', title: 'WhatsApp Mentorship', desc: 'Mentor on call for 90 days — never get stuck' },
];

const REVIEWS = [
  { name: 'Priya S.',    role: 'Fresher → SEO Executive',        text: 'Zero knowledge to placed at ₹25k/month in 90 days. The live projects made all the difference.' },
  { name: 'Rahul M.',   role: 'Business Owner · Retail',         text: 'Was paying ₹50k/month to agencies. Now I run my own Meta & Google Ads and ROI tripled.' },
  { name: 'Sneha K.',   role: 'Housewife → Freelancer',          text: 'Started taking freelance clients within 2 months. Earning ₹35k/month from home.' },
  { name: 'Amit D.',    role: 'BBA Graduate → Digital Marketer', text: 'Hired at a Pune agency within 45 days. Portfolio from Telzon impressed them immediately.' },
  { name: 'Pooja R.',   role: 'Business Owner · Boutique',       text: 'Instagram sales went from ₹20k to ₹1.2L/month after Meta Ads training here.' },
  { name: 'Karan T.',   role: 'Accountant → Freelancer',         text: 'Now earn more freelancing on weekends than my full-time job. Course paid back in 3 weeks.' },
  { name: 'Divya N.',   role: 'Arts Student → Content Lead',     text: 'Got placed as content strategist in Nagpur. The SEO module is incredibly detailed.' },
  { name: 'Sagar B.',   role: 'Restaurant Owner',                text: 'Bookings doubled in month 1 after Google Ads. No agency needed anymore.' },
  { name: 'Meera J.',   role: 'Homemaker → Social Manager',      text: 'Managing 4 client pages from home, ₹35k/month, just 4 hours a day.' },
  { name: 'Rohan P.',   role: 'Engineer → PPC Analyst',          text: 'Couldn\'t find work for 8 months. 6 weeks at Telzon and I had 2 job offers.' },
  { name: 'Neha A.',    role: 'Coaching Center Owner',           text: 'Facebook Ads filled my next batch in 3 days. Used to struggle for months.' },
  { name: 'Nikhil B.',  role: 'Dropout → Agency Owner',          text: 'Run my own 3-person agency at 21. Dropped out of college, joined Telzon.' },
  { name: 'Pallavi H.', role: 'MBA → Performance Marketer',      text: 'MBA didn\'t teach what Telzon did in 90 days. Real campaigns, real data, real results.' },
  { name: 'Abhishek K.', role: 'Real Estate Owner',             text: 'Leads cost ₹800 from agencies. I generate them at ₹120 now after Telzon.' },
  { name: 'Ishaan C.',  role: 'E-commerce Owner',               text: 'Shopify store was dying. Meta Ads training — revenue ₹30k to ₹2.4L/month.' },
  { name: 'Riya G.',    role: 'Fresher → YouTube Ads Specialist',text: 'Remote job with Delhi agency. ₹28k/month from home at age 22.' },
  { name: 'Aakash W.',  role: 'Gym Owner',                       text: 'Gym went from 40 to 180 members in 4 months — purely Meta Ads from Telzon.' },
  { name: 'Tanvi M.',   role: 'Fresher → Social Media Exec',    text: 'Job at Mumbai agency. Portfolio projects from Telzon wowed them.' },
  { name: 'Deepak S.',  role: 'Travel Agency Owner',            text: 'Bookings up 200% using Meta Ads. Best investment I\'ve ever made.' },
  { name: 'Preethi N.', role: 'Nurse → Freelancer',             text: 'Managing 3 clinic pages as side income. Extra ₹20k/month, evenings only.' },
  { name: 'Sanket F.',  role: 'Mechanic → Freelancer',          text: 'Evening batches while at the garage. Now earn more freelancing than my job.' },
  { name: 'Yash D.',    role: 'Retired Teacher → Blogger',      text: 'Started a blog at 58. SEO from Telzon earns ₹15k/month now.' },
  { name: 'Simran T.',  role: 'Student → Digital Marketer',     text: 'Chose digital marketing over engineering. Best decision of my life.' },
  { name: 'Shruti V.',  role: 'Teacher → DM Trainer',           text: 'Combined teaching skill + digital knowledge. Now conduct workshops, earn 4x.' },
  { name: 'Kavya R.',   role: 'Graduate → Email Marketer',      text: 'Email module alone landed me a ₹30k/month remote job.' },
  { name: 'Vikas C.',   role: 'Sales → Marketing Head',         text: 'Grew company revenue 3x, got promoted to marketing head within a year.' },
  { name: 'Ankita L.',  role: 'BA Grad → SEO Specialist',       text: 'Page 1 rankings for my clients. The SEO training is incredibly deep.' },
  { name: 'Suresh G.',  role: 'Hardware Store Owner',           text: 'Google enquiries started flowing in month 1. Complete game changer.' },
];

/* ─── Marquee ───────────────────────────────────────────────────────────── */
const MarqueeRow = ({ items, dir = 'left', speed = 32 }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3" style={{ animation: `marquee-${dir} ${items.length * speed}s linear infinite`, width: 'max-content' }}>
        {doubled.map((r, i) => (
          <div key={i} className="w-64 sm:w-72 flex-shrink-0 rounded-2xl p-4 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, si) => <Star key={si} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-3">"{r.text}"</p>
            <p className="text-white font-semibold text-xs">{r.name}</p>
            <p className="text-orange-400 text-xs mt-0.5">{r.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Live viewers counter (FOMO) ───────────────────────────────────────── */
const LiveViewers = () => {
  const [count, setCount] = useState(() => 18 + Math.floor(Math.random() * 24));
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.min(52, Math.max(11, c + delta));
      });
    }, 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      {count} people viewing this page
    </div>
  );
};

/* ─── Countdown (session-based urgency) ─────────────────────────────────── */
const useCountdown = (minutes = 12) => {
  const [secs, setSecs] = useState(() => {
    const stored = sessionStorage.getItem('nb_countdown');
    if (stored) return Math.max(0, parseInt(stored, 10) - Math.floor((Date.now() - parseInt(sessionStorage.getItem('nb_countdown_start') || Date.now(), 10)) / 1000));
    sessionStorage.setItem('nb_countdown', String(minutes * 60));
    sessionStorage.setItem('nb_countdown_start', String(Date.now()));
    return minutes * 60;
  });
  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secs]);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return { m, s, expired: secs === 0 };
};

/* ─── Chat widget ───────────────────────────────────────────────────────── */
const CHAT_RESPONSES = [
  { kw: ['fee','cost','price','how much','rupee','₹','charge'], ans: 'Fees are very affordable with EMI options 😊 Our counsellor will share the exact breakdown on WhatsApp within 30 min after you register.' },
  { kw: ['duration','how long','months','weeks','days'], ans: 'The full course is 3 months (90 days) with live projects. Fast-track and weekend options are also available.' },
  { kw: ['placement','job','hired','salary','career'], ans: '95% of students get placed. We do resume prep, mock interviews + connect you with hiring partners across Nagpur.' },
  { kw: ['batch','timing','schedule','morning','evening','weekend','when'], ans: 'Morning 10am, Evening 6pm & Weekend batches. Register and we\'ll confirm your preferred slot in 30 min.' },
  { kw: ['online','offline','mode','classroom','zoom'], ans: 'Both offline (Nagpur classroom) and online live batches via Zoom. You pick the mode that suits you.' },
  { kw: ['business','owner','agency','freelance','client'], ans: 'Perfect! Meta Ads, Google Ads, SEO — everything you need to grow your business or start an agency 🚀' },
  { kw: ['certificate','certification'], ans: 'You get a Telzon Academy certificate + guidance for Google & Meta certifications.' },
  { kw: ['hi','hello','hey','namaste'], ans: 'Hello! 👋 Ask me anything — fees, batch timing, placement, or anything else!' },
];
const getBotReply = (msg) => {
  const l = msg.toLowerCase();
  for (const { kw, ans } of CHAT_RESPONSES) if (kw.some(k => l.includes(k))) return ans;
  return 'Great question! Register above and our counsellor will answer everything on WhatsApp within 30 min 📞';
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: '👋 Hi! Ask me anything about the course, fees, batches, or placements!' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);
  const send = () => {
    const t = input.trim(); if (!t) return;
    setMsgs(p => [...p, { from: 'user', text: t }]); setInput(''); setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs(p => [...p, { from: 'bot', text: getBotReply(t) }]); }, 800);
  };
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.95 }} transition={{ duration: 0.18 }}
            className="w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: '#12082a' }}>
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-orange-600">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5 text-white" /></div>
                <div><p className="text-white text-sm font-bold leading-none">Telzon Assistant</p><p className="text-white/60 text-xs">Online now</p></div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="h-52 overflow-y-auto p-3 space-y-2">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${m.from === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-white/10 text-gray-200 rounded-bl-sm'}`}>{m.text}</div>
                </div>
              ))}
              {typing && <div className="flex justify-start"><div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">{[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div></div>}
              <div ref={endRef} />
            </div>
            <div className="px-3 py-2 border-t border-white/10 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about fees, batches…"
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder:text-gray-500 outline-none focus:border-purple-500" />
              <button onClick={send} className="w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0"><Send className="w-3.5 h-3.5 text-white" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileTap={{ scale: 0.93 }} onClick={() => setOpen(v => !v)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center shadow-2xl relative">
        {!open && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#12082a]" />}
        {open ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
      </motion.button>
    </div>
  );
};

/* ─── Registration form ─────────────────────────────────────────────────── */
const RegForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [busy, setBusy] = useState(false);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = async e => {
    e.preventDefault(); setBusy(true);
    const { ok } = await submitLead({ full_name: form.name, phone: form.phone, email: form.email, source: 'new-batch' });
    if (ok) onSuccess();
    setBusy(false);
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {[
        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name', required: true },
        { label: 'WhatsApp Number', name: 'phone', type: 'tel', placeholder: '+91 98765 43210', required: true },
        { label: 'Email (optional)', name: 'email', type: 'email', placeholder: 'you@example.com', required: false },
      ].map(({ label, ...rest }) => (
        <div key={rest.name}>
          <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">{label}</label>
          <input {...rest} value={form[rest.name]} onChange={onChange}
            className="w-full rounded-xl px-4 h-12 text-sm text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }} />
        </div>
      ))}
      <button type="submit" disabled={busy}
        className="w-full h-14 rounded-xl font-black text-base text-white flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 8px 32px rgba(249,115,22,0.35)' }}>
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-4 h-4 fill-white" /> Reserve My Free Seat →</>}
      </button>
      <p className="text-xs text-center text-gray-600">No fees. No spam. Confirmation on WhatsApp in 30 min.</p>
    </form>
  );
};

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function WatchDemoPage() {
  const videoRefs = useRef([null, null, null]);
  const formRef   = useRef(null);
  const [success,       setSuccess]       = useState(false);
  const [settingsLoaded,setSettingsLoaded]= useState(false);
  const [autoplay,      setAutoplay]      = useState(true);
  // Each slot: { url, show }
  const [slots, setSlots] = useState([
    { url: '', show: true },
    { url: '', show: true },
    { url: '', show: true },
  ]);
  // Muted state per video
  const [mutedStates, setMutedStates] = useState([true, true, true]);
  // Which video index is currently playing (-1 = none)
  const [playingIdx, setPlayingIdx] = useState(-1);
  // Has pixel fired for each slot
  const pixelFired = useRef([false, false, false]);
  const { m, s } = useCountdown(13);

  /* load settings */
  useEffect(() => {
    firePixelViewContent({ content_name: 'New Batch Registration', content_category: 'Education' });

    supabase.from('seoSettings')
      .select('video1_url,video1_show,video2_url,video2_show,video3_url,video3_show,nb_autoplay')
      .eq('page_key','new-batch-video')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSlots([
            { url: data.video1_url || '', show: data.video1_show !== 'false' },
            { url: data.video2_url || '', show: data.video2_show !== 'false' },
            { url: data.video3_url || '', show: data.video3_show !== 'false' },
          ]);
          setAutoplay(data.nb_autoplay !== 'false');
        }
        setSettingsLoaded(true);
      });
  }, []);

  /* Mutual exclusion — pause all other videos when one starts */
  const handleVideoPlay = useCallback((idx) => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== idx && !v.paused) v.pause();
    });
    setPlayingIdx(idx);
    if (!pixelFired.current[idx]) {
      pixelFired.current[idx] = true;
      firePixelSchedule();
    }
  }, []);

  const handleVideoPause = useCallback((idx) => {
    setPlayingIdx(p => p === idx ? -1 : p);
  }, []);

  const toggleMute = useCallback((idx) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    const next = !mutedStates[idx];
    v.muted = next;
    if (v.paused) v.play().catch(() => {});
    setMutedStates(p => p.map((m, i) => i === idx ? next : m));
  }, [mutedStates]);

  const tapVideo = useCallback((idx) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  /* Visible slots */
  const visibleSlots = settingsLoaded
    ? slots.map((s, i) => ({ ...s, idx: i })).filter(s => s.show && s.url)
    : [];

  return (
    <>
      <Helmet>
        <title>Upto 50% Off · New Batch Starting Soon | Telzon Academy Nagpur</title>
        <meta name="description" content="Limited seats — upto 50% off on digital marketing course. Live projects, 95% placement, expert mentors. Reserve your free seat now." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph — for WhatsApp / Facebook link previews */}
        <meta property="og:title"       content="Upto 50% Off — New Batch | Telzon Academy Nagpur" />
        <meta property="og:description" content="Only 6 seats left. Learn SEO, Google Ads & Meta Ads with live projects. 95% placement rate. Reserve your free seat now." />
        <meta property="og:image"       content="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://telzonacademy.in/new-batch" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content="Upto 50% Off — New Batch | Telzon Academy" />
        <meta name="twitter:description" content="Only 6 seats left. Reserve your free seat before the batch fills up." />
        <meta name="twitter:image"      content="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg" />

        {/* Google tag (GA4) — GT-5DHFK99D / G-R1JR4H02F1 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GT-5DHFK99D" />
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GT-5DHFK99D');
          gtag('config', 'G-R1JR4H02F1');
        `}</script>

        {/* Meta Pixel — 1920151015239658 */}
        <script>{`
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','1920151015239658');
          fbq('track','PageView');
        `}</script>
        <noscript>{`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1920151015239658&ev=PageView&noscript=1"/>`}</noscript>
      </Helmet>

      <div className="min-h-screen text-white overflow-x-hidden" style={{ background: 'linear-gradient(160deg,#0c0620 0%,#120930 45%,#0d0820 75%,#160905 100%)', fontFamily: '-apple-system,"SF Pro Text",Roboto,sans-serif' }}>

        {/* ── Top bar ── */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40 backdrop-blur-md">
          <img src="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg" alt="Telzon Academy" className="h-9 w-auto rounded-md" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            <span className="text-white/70 text-xs ml-1 font-medium hidden sm:inline">4.9 / 5 · 1,000+ students</span>
            <span className="text-white/70 text-xs ml-1 font-medium sm:hidden">4.9★</span>
          </div>
        </div>

        {/* ── Urgency banner ── */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold text-center py-2.5 px-4 flex items-center justify-center gap-2 flex-wrap">
          <Flame className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
          <span className="bg-white/20 px-2 py-0.5 rounded font-black tracking-wide">UPTO 50% OFF</span>
          <span>· Only <strong>6 seats</strong> left · Offer expires in</span>
          <span className="font-black tabular-nums bg-black/30 px-2 py-0.5 rounded tracking-widest">{m}:{s}</span>
        </div>

        <main className="max-w-2xl mx-auto px-4 pt-7 pb-28 sm:pb-16">

          {/* ── Live viewers ── */}
          <div className="flex justify-center mb-5">
            <LiveViewers />
          </div>

          {/* ── Hero ── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              New Batch · Free Trial Session
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-[1.15] mb-3 tracking-tight">
              The one skill that earns you money<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                whether you're a student or a business owner
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-5">
              In 90 days, go from zero to running real SEO, Google Ads & Meta Ads campaigns — with live projects, expert mentors, and 95% placement support.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={scrollToForm}
                className="inline-flex items-center gap-2 font-black text-white text-sm px-6 py-3.5 rounded-xl transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 6px 24px rgba(249,115,22,0.4)' }}>
                <Play className="w-4 h-4 fill-white" /> Reserve My Free Seat
              </button>
              <a
                href="https://wa.me/919307189776?text=Hi%20Telzon%20Academy%2C%20I%20want%20course%20details%20for%20the%20new%20batch."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get course details on WhatsApp"
                className="inline-flex items-center gap-2 font-black text-white text-sm px-5 py-3.5 rounded-xl transition-transform active:scale-95 hover:scale-105"
                style={{ background: '#25D366', boxShadow: '0 6px 24px rgba(37,211,102,0.4)' }}
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white" aria-hidden="true">
                  <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.673.244-1.045 0-.115 0-.244-.043-.345-.103-.215-1.165-.685-1.394-.788-.158-.072-.358-.215-.531-.215zM16.063 0c-8.857 0-16.063 7.205-16.063 16.063 0 2.83.733 5.585 2.137 8.027L0 32l8.135-2.137c2.353 1.32 5.014 2.014 7.928 2.014 8.857 0 16.063-7.206 16.063-16.063C32.125 7.18 24.92 0 16.063 0zm0 28.953c-2.6 0-5.18-.71-7.42-2.054l-.524-.343-5.522 1.45 1.466-5.366-.343-.564a13.16 13.16 0 0 1-2.05-7.026c0-7.288 5.93-13.218 13.218-13.218S29.28 7.762 29.28 15.05 23.35 28.953 16.063 28.953z"/>
                </svg>
                Get Course Details
              </a>
            </div>
          </motion.div>

          {/* ── Videos (up to 3, horizontal scroll on mobile) ── */}
          {visibleSlots.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-8">
              {/* Horizontal scroll container — snaps on mobile, flex on desktop */}
              <div
                className="flex gap-3 overflow-x-auto pb-2"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                }}
              >
                {visibleSlots.map(({ url, idx }) => {
                  const isMuted   = mutedStates[idx];
                  const isPlaying = playingIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="flex-shrink-0 relative rounded-2xl overflow-hidden border border-white/10"
                      style={{
                        /* On mobile: each card ~78vw so you can peek the next one */
                        width: visibleSlots.length === 1 ? '100%' : 'calc(78vw)',
                        maxWidth: 300,
                        aspectRatio: '9/16',
                        scrollSnapAlign: 'start',
                        boxShadow: isPlaying ? '0 0 40px rgba(139,92,246,0.4)' : '0 0 20px rgba(0,0,0,0.3)',
                        transition: 'box-shadow 0.3s',
                      }}
                    >
                      <video
                        ref={el => videoRefs.current[idx] = el}
                        src={url}
                        className="w-full h-full object-cover"
                        playsInline
                        muted={isMuted}
                        loop
                        autoPlay={autoplay && idx === slots.findIndex(s => s.show && s.url)}
                        onPlay={()  => handleVideoPlay(idx)}
                        onPause={()  => handleVideoPause(idx)}
                      />

                      {/* Tap to play/pause overlay */}
                      <div className="absolute inset-0" style={{ cursor: 'pointer' }}
                        onClick={() => tapVideo(idx)} />

                      {/* Mute button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(idx); }}
                        className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-bold text-white rounded-full px-2.5 py-1.5 transition-all active:scale-95 z-10"
                        style={{
                          background: isMuted ? 'rgba(0,0,0,0.65)' : 'rgba(124,58,237,0.85)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <span className="text-sm leading-none">{isMuted ? '🔇' : '🔊'}</span>
                        <span className="hidden sm:inline">{isMuted ? 'Sound' : 'On'}</span>
                      </button>

                      {/* Video number badge */}
                      {visibleSlots.length > 1 && (
                        <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white text-xs font-black backdrop-blur-sm border border-white/10">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Swipe hint (only when multiple videos) */}
              {visibleSlots.length > 1 && (
                <p className="text-center text-xs text-gray-600 mt-2">← Swipe to see more →</p>
              )}
            </motion.div>
          )}

          {/* ── What you GET ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">What you learn</span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Everything in one course 🔥</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {WHAT_YOU_GET.map(({ emoji, title, desc }) => (
                <div key={title} className="rounded-xl p-3.5 border border-white/[0.07] flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-xl">{emoji}</span>
                  <p className="text-white font-bold text-xs">{title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {[
              { num: '1,000+', label: 'Students Trained' },
              { num: '95%',    label: 'Placement Rate' },
              { num: '90',     label: 'Days to Job-Ready' },
            ].map(({ num, label }) => (
              <div key={label} className="rounded-xl p-3 text-center border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xl sm:text-2xl font-black text-white">{num}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Transformation before/after ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Their journey. Your turn next.</p>
            <div className="space-y-2.5">
              {[
                { icon: Target,    before: 'No digital skills',          after: 'Running live ad campaigns' },
                { icon: TrendingUp,before: 'Paying ₹50k/month to agencies', after: 'Running own ads, 3x ROI' },
                { icon: Briefcase, before: 'Stuck in the wrong job',     after: 'Hired as digital marketer' },
                { icon: Award,     before: 'Zero freelance clients',     after: '₹35k/month from home' },
              ].map(({ icon: Icon, before, after }) => (
                <div key={before} className="flex items-center gap-3 rounded-xl p-3.5 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-purple-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs line-through">{before}</p>
                    <p className="text-white font-semibold text-sm">{after}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Registration form ── */}
          <motion.div ref={formRef} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl p-5 sm:p-6 border border-white/10 mb-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', boxShadow: '0 0 60px rgba(249,115,22,0.08)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />

            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 relative z-10">
                <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-1">Seat Reserved! 🎉</h3>
                <p className="text-gray-300 text-sm mb-5">We'll confirm your batch slot on WhatsApp in 30 minutes.</p>
                <a href="https://wa.me/919307189776?text=Hi%20Telzon%20Academy%2C%20I%20just%20registered%20for%20the%20new%20batch"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </motion.div>
            ) : (
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-orange-500/15 border border-orange-500/20 text-orange-300 text-xs font-black px-3 py-1 rounded-full">FREE · No commitment</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-0.5">Reserve Your Free Trial Seat</h3>
                <p className="text-gray-400 text-sm mb-4">Our counsellor calls you within 30 min to confirm your slot.</p>
                <RegForm onSuccess={() => setSuccess(true)} />
              </div>
            )}
          </motion.div>

          {/* ── Trust signals ── */}
          <div className="grid grid-cols-3 gap-2 mb-10 text-center">
            {[
              { icon: Shield,    label: 'No hidden fees' },
              { icon: BadgeCheck,label: 'Google certified' },
              { icon: Clock,     label: 'Flexible batches' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <Icon className="w-4 h-4 text-purple-300" />
                <p className="text-gray-400 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Testimonials marquee ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-1">Real students. Real results.</p>
            <h2 className="text-xl font-black text-white text-center mb-6">Join 1,000+ who already changed their life</h2>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right,#0c0620,transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left,#0c0620,transparent)' }} />
              <div className="mb-3"><MarqueeRow items={REVIEWS.slice(0, 14)} dir="left"  speed={28} /></div>
              <MarqueeRow items={REVIEWS.slice(14)} dir="right" speed={26} />
            </div>
          </motion.div>

        </main>

        {/* ── Sticky mobile CTA ── */}
        <div className="nb-sticky-cta">
          <button onClick={scrollToForm}
            className="w-full h-14 rounded-xl font-black text-white text-base flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 -4px 32px rgba(249,115,22,0.3)' }}>
            <Play className="w-4 h-4 fill-white" /> Reserve My Free Seat →
          </button>
        </div>
      </div>
    </>
  );
}
