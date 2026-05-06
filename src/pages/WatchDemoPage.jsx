import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Play, Star, Zap, TrendingUp, Users,
  MessageCircle, X, Send, ChevronDown, Award, Target, Briefcase
} from 'lucide-react';
import { submitLead, firePixelViewContent, firePixelSchedule } from '@/lib/leadSubmit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

import { supabase } from '@/lib/customSupabaseClient';

const CHAT_RESPONSES = [
  {
    keywords: ['fee', 'fees', 'cost', 'price', 'charges', 'how much', 'rupee', '₹'],
    answer: 'Our course fee is structured to be affordable with EMI options. After your registration, our counsellor will share the exact fee breakdown and any active scholarships on WhatsApp within 30 minutes. 😊',
  },
  {
    keywords: ['duration', 'how long', 'months', 'weeks', 'time'],
    answer: 'The full digital marketing course is 3 months (90 days) with live project work. We also have fast-track and weekend batch options depending on your schedule.',
  },
  {
    keywords: ['placement', 'job', 'hiring', 'salary', 'career', 'hired'],
    answer: '95% of our students get placement support. We have dedicated placement partners across Nagpur and help with resume building, mock interviews, and freelance client connections.',
  },
  {
    keywords: ['batch', 'schedule', 'timing', 'morning', 'evening', 'weekend', 'when'],
    answer: 'We run morning (10am), evening (6pm), and weekend batches. The next new batch starts very soon — register above and our team will confirm your preferred slot.',
  },
  {
    keywords: ['online', 'offline', 'mode', 'classroom', 'remote'],
    answer: 'We offer both offline (classroom in Nagpur) and online live batches via Zoom. Students can choose the mode that works best for them.',
  },
  {
    keywords: ['business', 'owner', 'freelance', 'self', 'agency', 'client'],
    answer: 'Perfect choice! Our curriculum covers Meta Ads, Google Ads, SEO and content strategy — exactly what you need to grow your business or start an agency. Many of our batch-mates are business owners. 🚀',
  },
  {
    keywords: ['certificate', 'certification', 'degree'],
    answer: 'Yes, you receive a Telzon Academy course completion certificate. We also help you earn Google and Meta certifications which are recognized by recruiters.',
  },
  {
    keywords: ['seo', 'google ads', 'meta ads', 'facebook', 'instagram', 'social media', 'content'],
    answer: 'We cover the full stack: SEO, Google Ads (Search + Display + YouTube), Meta Ads (Facebook + Instagram), Social Media Marketing, Content Strategy, and Email Marketing — all with live projects.',
  },
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'hii'],
    answer: 'Hello! 👋 Welcome to Telzon Academy. I can answer your questions about the course, fees, batches, placement, or anything else. What would you like to know?',
  },
];

const DEFAULT_RESPONSE = 'Great question! For specific details, our admissions counsellor is the best person to help you. Register above and we\'ll call you within 30 minutes. 📞 Or WhatsApp us at +91 93071 89776.';

function getBotReply(message) {
  const lower = message.toLowerCase();
  for (const entry of CHAT_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.answer;
  }
  return DEFAULT_RESPONSE;
}

const transformations = [
  { icon: Target, before: 'No digital skills', after: 'Running live ad campaigns' },
  { icon: TrendingUp, before: 'Struggling to get clients', after: 'Generating leads on autopilot' },
  { icon: Briefcase, before: 'Stuck in the wrong job', after: 'Hired as a digital marketer' },
  { icon: Award, before: 'Zero online presence', after: 'Managing brands on Meta & Google' },
];

const reviews = [
  { name: 'Priya S.', role: 'Fresher → SEO Executive', text: 'I had zero marketing knowledge. 3 months later I got placed at ₹25,000/month. The live projects made all the difference.', stars: 5 },
  { name: 'Rahul M.', role: 'Business Owner · Retail', text: 'I used to spend ₹50,000 on agencies every month. Now I run my own Meta and Google Ads and my ROI has tripled.', stars: 5 },
  { name: 'Sneha K.', role: 'Housewife → Freelancer', text: 'Started taking freelance clients within 2 months of joining. This course changed my life completely.', stars: 5 },
  { name: 'Amit D.', role: 'BBA Graduate → Digital Marketer', text: 'Got hired at a Pune agency within 45 days of completing the course. The resume and interview prep was excellent.', stars: 5 },
  { name: 'Pooja R.', role: 'Business Owner · Boutique', text: 'My Instagram sales went from ₹20k to ₹1.2L per month after learning Meta Ads here. Worth every rupee.', stars: 5 },
  { name: 'Karan T.', role: 'Working Professional → Freelancer', text: 'I was an accountant. After this course I now earn more freelancing on weekends than my full-time job.', stars: 5 },
  { name: 'Divya N.', role: 'Arts Student → Content Strategist', text: 'The content and SEO module changed how I think. Got placed as a content strategist in Nagpur itself.', stars: 5 },
  { name: 'Sagar B.', role: 'Business Owner · Restaurant', text: 'Learned Google Ads and my restaurant bookings doubled in the first month. No agency needed anymore.', stars: 5 },
  { name: 'Meera J.', role: 'Homemaker → Social Media Manager', text: 'Managing 4 client Instagram pages from home. Earning ₹35,000/month working just 4 hours a day.', stars: 5 },
  { name: 'Rohan P.', role: 'Engineering Graduate → PPC Analyst', text: 'Couldn\'t find a job for 8 months after engineering. 6 weeks into Telzon and I had 2 job offers.', stars: 5 },
  { name: 'Neha A.', role: 'Business Owner · Coaching Center', text: 'Facebook Ads filled my entire next batch in 3 days. I used to struggle for months to get students.', stars: 5 },
  { name: 'Vikas C.', role: 'Sales Executive → Marketing Lead', text: 'Used the Google Ads skills to grow my company\'s revenue 3x. Got promoted to marketing head within a year.', stars: 5 },
  { name: 'Ankita L.', role: 'BA Graduate → SEO Specialist', text: 'Ranking on page 1 of Google for my clients now. The SEO module was incredibly detailed and practical.', stars: 5 },
  { name: 'Suresh G.', role: 'Business Owner · Hardware Store', text: 'Started getting enquiries from Google within the first month of running my own campaigns. Game changer.', stars: 5 },
  { name: 'Tanvi M.', role: 'Fresher → Social Media Executive', text: 'Got a job at a digital agency in Mumbai. The portfolio projects from Telzon impressed them immediately.', stars: 5 },
  { name: 'Deepak S.', role: 'Business Owner · Travel Agency', text: 'My travel bookings increased by 200% using Meta Ads strategies from this course. Best investment ever.', stars: 5 },
  { name: 'Kavya R.', role: 'Commerce Graduate → Email Marketer', text: 'The email marketing module alone helped me land a ₹30k/month remote job. Highly practical curriculum.', stars: 5 },
  { name: 'Nikhil B.', role: 'Dropout → Agency Owner', text: 'Dropped out of college, joined Telzon, and now run my own 3-person digital marketing agency at age 21.', stars: 5 },
  { name: 'Shruti V.', role: 'Teacher → Digital Marketing Trainer', text: 'Used my teaching skills with new digital knowledge. Now conduct my own workshops and earn 4x more.', stars: 5 },
  { name: 'Aakash W.', role: 'Business Owner · Gym', text: 'My gym went from 40 members to 180 members in 4 months — purely through Meta Ads I learned here.', stars: 5 },
  { name: 'Pallavi H.', role: 'MBA → Performance Marketer', text: 'MBA didn\'t teach me what Telzon did in 90 days. Real campaigns, real data, real results.', stars: 5 },
  { name: 'Sanket F.', role: 'Mechanic → Freelancer', text: 'Learned digital marketing in evening batches while working at the garage. Now I earn more from freelancing.', stars: 5 },
  { name: 'Riya G.', role: 'Fresher → YouTube Ads Specialist', text: 'Specialised in YouTube Ads and got a remote job with a Delhi agency. ₹28k/month from home at 22.', stars: 5 },
  { name: 'Abhishek K.', role: 'Business Owner · Real Estate', text: 'Real estate leads were costing me ₹800 each from agencies. After Telzon I generate them at ₹120 each.', stars: 5 },
  { name: 'Simran T.', role: 'PCM Student → Digital Marketer', text: 'Chose digital marketing over engineering after watching this video. Best decision of my life so far.', stars: 5 },
  { name: 'Yash D.', role: 'Retired Teacher → Blogger', text: 'Retired at 58 and started a blog. Learnt SEO from Telzon and now my blog earns ₹15,000/month.', stars: 5 },
  { name: 'Ishaan C.', role: 'E-commerce Owner', text: 'My Shopify store was dying. After Meta and Google Ads training, monthly revenue went from ₹30k to ₹2.4L.', stars: 5 },
  { name: 'Preethi N.', role: 'Nurse → Side-Income Freelancer', text: 'Run social media for 3 clinics as a side income. Earning an extra ₹20k per month working just evenings.', stars: 5 },
];

// ── Marquee ────────────────────────────────────────────────────────────────
const MarqueeRow = ({ items, direction = 'left', speed = 35 }) => {
  const doubled = [...items, ...items];
  const duration = items.length * speed;
  return (
    <div className="overflow-hidden relative">
      <div
        className="flex gap-4"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((r, i) => (
          <div
            key={i}
            className="w-72 flex-shrink-0 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:border-white/20 transition-colors duration-300"
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(r.stars)].map((_, si) => (
                <Star key={si} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">"{r.text}"</p>
            <div>
              <p className="text-white font-semibold text-sm">{r.name}</p>
              <p className="text-orange-400 text-xs mt-0.5">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('marquee-styles')) {
  const s = document.createElement('style');
  s.id = 'marquee-styles';
  s.textContent = `
    @keyframes marquee-left  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    @keyframes marquee-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
  `;
  document.head.appendChild(s);
}

// ── Chat Widget ────────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I\'m the Telzon Academy assistant. Ask me anything about the course, fees, batch timings, or placements!' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: getBotReply(text) }]);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: '#12082a' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-orange-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">Telzon Assistant</p>
                  <p className="text-white/70 text-xs">Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-purple-600 text-white rounded-br-sm'
                        : 'bg-white/10 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-2 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about fees, batches, jobs..."
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 outline-none focus:border-purple-500"
              />
              <button
                onClick={send}
                className="w-9 h-9 bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-purple-900/50 relative"
      >
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#12082a]" />
        )}
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const WatchDemoPage = () => {
  const videoRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [formData, setFormData]   = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Video settings fetched from admin
  const [videoUrl,  setVideoUrl]  = useState('');
  const [autoplay,  setAutoplay]  = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Hide external chatbot, fire ViewContent, load settings
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-ext-chat';
    style.textContent = '#tidio-chat, #crisp-chatbox, .crisp-client, [id*="tidio"], [class*="tidio"], [id*="tawk"], [class*="tawk"], [id*="intercom"], .intercom-lightweight-app { display: none !important; }';
    document.head.appendChild(style);
    firePixelViewContent({ content_name: 'New Batch Registration', content_category: 'Education' });

    supabase.from('seoSettings')
      .select('google_code, pixel_code, retargeting_code')
      .eq('page_key', 'new-batch-video')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setShowVideo(data.google_code !== 'false');
          setAutoplay(data.pixel_code !== 'false');
          setVideoUrl(data.retargeting_code || '');
        }
        setSettingsLoaded(true);
      });

    return () => document.getElementById('hide-ext-chat')?.remove();
  }, []);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { ok } = await submitLead({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'new-batch',
    });
    if (ok) setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>New Batch Starting Soon | Telzon Academy Nagpur</title>
        <meta name="description" content="Join Telzon Academy's new digital marketing batch. Live projects, placement support and expert mentors. Register your seat now." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d0720 0%, #130a2e 40%, #0e0a20 70%, #180b08 100%)',
          fontFamily: '-apple-system, "SF Pro Text", "Proxima Nova", Roboto, sans-serif',
        }}
      >
        {/* Top bar */}
        <div className="w-full py-3 px-6 flex items-center justify-between border-b border-white/8 bg-black/20 backdrop-blur-sm">
          <img
            src="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg"
            alt="Telzon Academy"
            className="h-10 w-auto rounded-md"
          />
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
            <span className="text-white/80 text-sm ml-1 font-medium">4.9 / 5 · 1,000+ students</span>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 pt-10 pb-20">

          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              New Batch · Limited Seats Available
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.15] mb-4 tracking-tight">
              The skill that pays you back —<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                whether you're a student or a business owner
              </span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Watch how Telzon Academy students go from zero to running real campaigns, getting hired, and growing businesses — then reserve your seat in the next batch.
            </p>
          </motion.div>

          {/* ── Video (shown only if enabled in admin) ── */}
          {settingsLoaded && showVideo && videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center mb-10"
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.25)] w-full max-w-sm"
                style={{ aspectRatio: '9/16' }}
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  autoPlay={autoplay}
                  controls
                  onPlay={() => {
                    if (!videoStarted) { setVideoStarted(true); firePixelSchedule(); }
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* ── Transformation strip ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {transformations.map(({ icon: Icon, before, after }) => (
              <motion.div
                key={before}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/4 border border-white/8 rounded-xl p-4 text-center"
              >
                <div className="w-9 h-9 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-gray-500 text-xs line-through mb-1">{before}</p>
                <p className="text-white font-semibold text-xs leading-snug">{after}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Form + Benefits ── */}
          <div className="grid md:grid-cols-2 gap-8 items-start mb-14">

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                Reserve your seat in the<br />
                <span className="text-orange-400">new batch today</span>
              </h2>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Our counsellor confirms your slot on WhatsApp within 30 minutes of registration.
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  'SEO, Google Ads, Meta Ads, Social Media — full stack',
                  'Live projects from day one — not just theory',
                  'Placement assistance with hiring partner network',
                  'Weekend + evening batches for working professionals',
                  'Google & Meta certification guidance included',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 p-4 bg-white/4 border border-white/8 rounded-xl">
                <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-white font-semibold">Next batch seats filling fast.</span> We accept only 20 students per batch to keep quality high.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 relative z-10"
                >
                  <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Seat Reserved!</h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Our team will confirm your batch slot on WhatsApp within 30 minutes.
                  </p>
                  <a
                    href="https://wa.me/919307189776?text=Hi%20Telzon%20Academy%2C%20I%20just%20registered%20for%20the%20new%20batch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message us on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <div className="relative z-10">
                  <div className="mb-5">
                    <span className="bg-orange-500/15 border border-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full">
                      Limited Trial Session — Free
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Register Your Free Seat</h3>
                  <p className="text-gray-400 text-sm mb-5">No fees. No commitment. Just your journey starting here.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <Input
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white/8 border-white/15 text-white placeholder:text-gray-600 focus:border-purple-500 h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">WhatsApp Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-white/8 border-white/15 text-white placeholder:text-gray-600 focus:border-purple-500 h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                        Email <span className="text-gray-600 normal-case font-normal">(optional)</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-white/8 border-white/15 text-white placeholder:text-gray-600 focus:border-purple-500 h-11 rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-6 text-base rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reserving...</>
                      ) : (
                        <><Play className="mr-2 h-4 w-4 fill-white" /> Reserve My Free Seat →</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-gray-600">
                      Your details go only to Telzon Academy. No spam, ever.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Testimonials Marquee ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="text-center mb-8">
              <span className="inline-block bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
                Real students. Real results.
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Join 1,000+ students &amp; business owners
              </h2>
              <p className="text-gray-400 text-sm mt-2">who transformed their career and business with Telzon Academy</p>
            </div>

            {/* Marquee rows with fade edges */}
            <div className="relative">
              {/* Left fade */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
                style={{ background: 'linear-gradient(to right, #0d0720, transparent)' }} />
              {/* Right fade */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
                style={{ background: 'linear-gradient(to left, #0d0720, transparent)' }} />

              {/* Row 1 — scrolls left */}
              <div className="mb-4">
                <MarqueeRow items={reviews.slice(0, 14)} direction="left" speed={30} />
              </div>
              {/* Row 2 — scrolls right */}
              <MarqueeRow items={reviews.slice(14)} direction="right" speed={28} />
            </div>
          </motion.div>

        </main>

        {/* ── Custom Chat Widget ── */}
        <ChatWidget />
      </div>
    </>
  );
};

export default WatchDemoPage;
