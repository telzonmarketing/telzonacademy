import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Target, RefreshCw, TrendingUp, Users, Zap, BarChart3,
  CheckCircle, ChevronDown, Star, Clock, Award, ArrowRight,
  Layers, Eye, MousePointer, ShoppingCart, Play, Globe
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadGenForm from '@/components/LeadGenForm';
import FinalCTA from '@/components/FinalCTA';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } }),
};

// ── Modules ──────────────────────────────────────────────────────────────────
const MODULES = [
  {
    platform: 'Meta',
    color: 'from-blue-600 to-purple-600',
    border: 'border-blue-500/40',
    icon: Layers,
    weeks: 'Week 1–2',
    title: 'Meta Pixel & Conversions API (CAPI)',
    items: [
      'Installing & verifying Meta Pixel correctly',
      'Setting up Conversions API (server-side) for iOS 14+ accuracy',
      'Event deduplication — pixel + CAPI together',
      'Standard events vs custom events vs custom conversions',
      'Testing with Meta Events Manager & Test Events tool',
    ],
  },
  {
    platform: 'Meta',
    color: 'from-blue-600 to-purple-600',
    border: 'border-blue-500/40',
    icon: Users,
    weeks: 'Week 3–4',
    title: 'Custom Audiences & Lookalike Audiences',
    items: [
      'Website Custom Audiences — by page, time spent, events',
      'Video engagement audiences (25%, 50%, 75%, 95% viewers)',
      'Instagram & Facebook page engagement retargeting',
      'Lead form openers vs lead form submitters',
      'Building Lookalike Audiences at 1%, 2–5%, 5–10% for scale',
      'Stacking Lookalikes on top of retargeting for full-funnel',
    ],
  },
  {
    platform: 'Meta',
    color: 'from-blue-600 to-purple-600',
    border: 'border-blue-500/40',
    icon: Target,
    weeks: 'Week 5–6',
    title: 'Meta Retargeting Campaign Strategy',
    items: [
      'Full-funnel retargeting: Awareness → Consideration → Conversion',
      'Dynamic Product Ads (DPA) — catalog retargeting for e-commerce',
      'Ad sequencing & sequential retargeting across placements',
      'Frequency capping & audience exclusions to avoid ad fatigue',
      'Advantage+ Shopping campaigns with retargeting layers',
      'Attribution window strategy (1-day click vs 7-day click)',
    ],
  },
  {
    platform: 'Google',
    color: 'from-orange-500 to-red-600',
    border: 'border-orange-500/40',
    icon: Globe,
    weeks: 'Week 7–8',
    title: 'Google Tag & Audience Setup',
    items: [
      'Setting up Google Tag (gtag.js) via Google Tag Manager',
      'Configuring conversion tracking for leads, purchases & calls',
      'Google Ads remarketing tag vs GA4 audiences — when to use which',
      'Building remarketing lists: all visitors, product viewers, cart abandoners',
      'Customer Match — upload email/phone list for retargeting',
      'Combined audience segments (in-market + remarketing)',
    ],
  },
  {
    platform: 'Google',
    color: 'from-orange-500 to-red-600',
    border: 'border-orange-500/40',
    icon: MousePointer,
    weeks: 'Week 9–10',
    title: 'RLSA — Search Retargeting',
    items: [
      'RLSA (Remarketing Lists for Search Ads) — what & why',
      'Bid adjustments on RLSA vs observation vs targeting only',
      'Cross-sell & upsell with RLSA: target past buyers for new searches',
      'RLSA + broad match: the Google-recommended power combo',
      'Customer Match in Search campaigns for CRM retargeting',
      'Similar audiences in search (expanded reach)',
    ],
  },
  {
    platform: 'Google',
    color: 'from-orange-500 to-red-600',
    border: 'border-orange-500/40',
    icon: Eye,
    weeks: 'Week 11–12',
    title: 'GDN Display & YouTube Retargeting',
    items: [
      'Display retargeting: standard vs responsive display ads',
      'Dynamic Remarketing with Google Merchant Center feed',
      'YouTube retargeting: TrueView in-stream, bumper, discovery',
      'YouTube audience: channel viewers, video watchers, subscribers',
      'Gmail Sponsored Promotions targeting past site visitors',
      'Performance Max — retargeting signals & asset groups',
    ],
  },
];

// ── Tools ─────────────────────────────────────────────────────────────────────
const TOOLS = [
  { name: 'Meta Ads Manager', desc: 'Campaign creation, audience builder, reporting' },
  { name: 'Meta Events Manager', desc: 'Pixel setup, CAPI, event testing' },
  { name: 'Google Tag Manager', desc: 'Tag deployment without code changes' },
  { name: 'Google Ads', desc: 'RLSA, Display, YouTube, PMax campaigns' },
  { name: 'GA4', desc: 'Audience building, conversion paths, attribution' },
  { name: 'Google Merchant Center', desc: 'Product feed for dynamic remarketing' },
];

// ── Who should join ───────────────────────────────────────────────────────────
const WHO = [
  { icon: TrendingUp, title: 'Performance Marketers', desc: 'Already running ads and want to cut CPA by retargeting warm audiences.' },
  { icon: ShoppingCart, title: 'E-commerce Owners', desc: 'Recover cart abandoners and cross-sell to existing customers at scale.' },
  { icon: Zap, title: 'Freelancers & Agencies', desc: 'Add retargeting as a premium service and charge 2–3× your current rate.' },
  { icon: BarChart3, title: 'Marketing Managers', desc: 'Own full-funnel attribution and justify ROI to leadership.' },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is the difference between retargeting and remarketing?',
    a: 'Retargeting typically refers to pixel-based ads shown to past website visitors on other platforms (Meta, GDN). Remarketing is often used for Google\'s email-list-based or search-based audience targeting (Customer Match, RLSA). In practice, both terms are used interchangeably — this course covers both in full.',
  },
  {
    q: 'Do I need an active ad account to join?',
    a: 'Not mandatory, but highly recommended. You\'ll get the most from this course if you have a live Meta Business Manager and Google Ads account to practice on. We help you set them up in Week 1 if you don\'t have them.',
  },
  {
    q: 'Is this course suitable for beginners?',
    a: 'This is an advanced course. You should have a basic understanding of how Meta Ads and Google Ads work before joining. If you\'re new to ads, we recommend completing our foundation digital marketing course first.',
  },
  {
    q: 'What results can I expect after the course?',
    a: 'Students typically reduce their cost per lead/purchase by 30–60% by replacing broad cold traffic with precise retargeting. Freelancers consistently report earning back the course fee within the first client retargeting campaign.',
  },
  {
    q: 'Does the course cover the impact of iOS 14+ and cookie deprecation?',
    a: 'Absolutely — this is a core part of the curriculum. You\'ll learn Conversions API (CAPI) for Meta, enhanced conversions for Google, first-party data strategies, and how to build audiences that don\'t rely entirely on third-party cookies.',
  },
  {
    q: 'How long is the course and what is the format?',
    a: 'The course is 12 weeks, conducted as live online sessions twice a week (2 hours each) plus weekly practical assignments. All sessions are recorded and available for 6 months after completion.',
  },
  {
    q: 'Will I receive a certificate?',
    a: 'Yes — a Telzon Academy Advanced Retargeting Specialist certificate upon successful completion. We also guide you through Meta Blueprint and Google Ads certifications as part of the program.',
  },
  {
    q: 'What is the fee for the Advanced Retargeting course?',
    a: 'Contact us for current batch pricing. We offer early-bird discounts and 3-month no-cost EMI. Fill the form on this page and our counsellor will share the latest fee structure.',
  },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-white font-medium hover:bg-white/5 transition-colors"
      >
        <span>{q}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 text-purple-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
          {a}
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const AdvancedRetargetingPage = () => {
  return (
    <>
      <Helmet>
        <title>Advanced Retargeting Ads on Meta & Google | Telzon Academy Nagpur</title>
        <meta name="description" content="Master advanced retargeting on Meta (Facebook, Instagram) and Google (RLSA, GDN, YouTube, PMax). Learn Pixel, CAPI, Custom Audiences and Dynamic Ads. Live training in Nagpur." />
        <meta name="keywords" content="retargeting ads course Nagpur, Meta retargeting training, Google remarketing course, RLSA training, Facebook pixel course, advanced ads Nagpur" />
        <link rel="canonical" href="https://telzonacademy.in/advanced-retargeting-ads" />
      </Helmet>

      <div
        className="min-h-screen"
        style={{
          background: 'radial-gradient(circle at 50% 0%, #4c1d95 0%, #1e1b4b 40%, #312e81 60%, #c2410c 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <Header />

        {/* ── Hero ── */}
        <section className="pt-28 pb-16 px-4 relative overflow-hidden">
          {/* glow blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
                <Target className="w-3.5 h-3.5" /> Advanced Course
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                Advanced Retargeting Ads<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">
                  on Meta & Google
                </span>
              </h1>

              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Stop burning budget on cold traffic. Learn how to build precision retargeting systems on Facebook, Instagram, Google Search, Display and YouTube — and convert warm audiences at a fraction of the cost.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-10">
                {[
                  { icon: Clock, label: '12 Weeks', sub: 'Live Training' },
                  { icon: Play, label: '24 Sessions', sub: '2 hrs each' },
                  { icon: Award, label: 'Certificate', sub: 'On Completion' },
                  { icon: Star, label: '4.9 / 5', sub: '200+ Reviews' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{label}</div>
                      <div className="text-white/50 text-xs">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bullet proof points */}
              <ul className="space-y-3">
                {[
                  'Meta Pixel + CAPI setup — survive iOS 14+ & cookie deprecation',
                  'Custom Audiences, Lookalikes, Dynamic Product Ads',
                  'RLSA, Google Display, YouTube & Performance Max retargeting',
                  'Live campaign practicals — work on real ad accounts',
                  'Reduce cost-per-lead by 30–60% within weeks of applying',
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-white/80 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right — Lead form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-28"
            >
              <div className="bg-white/5 border border-white/15 rounded-2xl backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4">
                  <p className="text-white font-bold text-lg">Book a Free Strategy Call</p>
                  <p className="text-white/80 text-sm">Talk to an expert. No pressure. Get a clear roadmap.</p>
                </div>
                <div className="p-6">
                  <LeadGenForm
                    heading=""
                    subheading=""
                    source="advanced-retargeting-ads"
                    buttonText="Book Free Call →"
                    badge=""
                    benefits={[
                      'Full course breakdown & fee structure',
                      'Know if this course is right for your current level',
                      'Next batch date & timing options',
                    ]}
                    trustNote="Our expert calls within 24 hours. No spam."
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Platform badges ── */}
        <section className="py-8 px-4 border-y border-white/10">
          <div className="container mx-auto max-w-6xl flex flex-wrap justify-center gap-8">
            {[
              { label: 'Meta Ads Manager', color: 'text-blue-400' },
              { label: 'Facebook & Instagram', color: 'text-blue-300' },
              { label: 'Google Ads', color: 'text-orange-400' },
              { label: 'Google Display Network', color: 'text-yellow-400' },
              { label: 'YouTube Ads', color: 'text-red-400' },
              { label: 'Performance Max', color: 'text-green-400' },
            ].map(({ label, color }) => (
              <span key={label} className={`text-sm font-semibold ${color} bg-white/5 rounded-full px-4 py-1.5 border border-white/10`}>
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Who should join ── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-12"
            >
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">Is this for you?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Who Should Join This Course</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHO.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Curriculum ── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="mb-12"
            >
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">Full Curriculum</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                12 Weeks. <span className="text-purple-400">Zero Fluff.</span>
              </h2>
              <p className="text-white/60 mt-3 max-w-xl">
                Every module is built around live campaign practicals. You learn by doing — not by watching slides.
              </p>
            </motion.div>

            {/* Platform sections */}
            {['Meta', 'Google'].map((platform) => (
              <div key={platform} className="mb-10">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${platform === 'Meta' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'bg-orange-600/20 text-orange-300 border border-orange-500/30'}`}>
                  {platform === 'Meta' ? '🔵' : '🟠'} {platform} Retargeting
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {MODULES.filter(m => m.platform === platform).map((mod, i) => (
                    <motion.div
                      key={mod.title}
                      custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                      className={`bg-white/5 border ${mod.border} rounded-2xl p-6 hover:bg-white/8 transition-colors`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{mod.weeks}</span>
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center`}>
                          <mod.icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold mb-3 leading-snug">{mod.title}</h3>
                      <ul className="space-y-2">
                        {mod.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-white/60 text-xs leading-relaxed">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tools ── */}
        <section className="py-20 px-4 border-t border-white/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-12"
            >
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">Hands-On Practice</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Tools You'll Master</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOOLS.map(({ name, desc }, i) => (
                <motion.div
                  key={name}
                  custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{name}</div>
                    <div className="text-white/50 text-xs mt-0.5">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mid CTA banner ── */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="bg-gradient-to-r from-purple-600/30 to-orange-600/20 border border-purple-500/30 rounded-2xl p-10 text-center"
            >
              <RefreshCw className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stop Losing Warm Leads to Competitors
              </h2>
              <p className="text-white/70 mb-6 max-w-xl mx-auto">
                Every day without a proper retargeting system, you're paying to get visitors and then letting them walk away forever. Fix that now.
              </p>
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Book Free Strategy Call <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-4 border-t border-white/10" id="faq">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-12"
            >
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">Got Questions?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom lead form ── */}
        <section className="py-20 px-4 border-t border-white/10" id="lead-form">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">Enroll Now</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Ready to Build Your Retargeting System?
              </h2>
              <p className="text-white/60 mb-10">
                Spots are limited per batch. Book your free call today and secure your seat.
              </p>
              <div className="bg-white/5 border border-white/15 rounded-2xl p-8">
                <LeadGenForm
                  heading="Book Your Free Strategy Call"
                  subheading="Our expert will call you within 24 hours."
                  source="advanced-retargeting-ads-bottom"
                  buttonText="Book Free Call →"
                  badge="Limited Seats Per Batch"
                  benefits={[
                    'Full retargeting course breakdown',
                    'Know fees, batch schedule & format',
                    'Get 2–3 free retargeting tips on the call',
                  ]}
                  trustNote="No spam. No hard selling. Just guidance."
                />
              </div>
            </motion.div>
          </div>
        </section>

        <FinalCTA />
        <Footer />
      </div>
    </>
  );
};

export default AdvancedRetargetingPage;
