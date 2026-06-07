import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Star, MapPin, Clock, IndianRupee, Users, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BestCourseSection from '@/components/BestCourseSection';
import PracticalLearning from '@/components/PracticalLearning';
import PlacementsAndCareers from '@/components/PlacementsAndCareers';
import Mentorship from '@/components/Mentorship';
import LeadGenForm from '@/components/LeadGenForm';
import FinalCTA from '@/components/FinalCTA';
import { landingPages } from './landingPagesConfig';
import { PAGE_FAQS } from './landingPagesFaqs';

// ─── Nagpur localities for IndiaMart-style hyper-local targeting ─────────────
const NAGPUR_AREAS = [
  'Dharampeth','Sitabuldi','Ramdaspeth','Sadar','Civil Lines',
  'Pratap Nagar','Itwari','Gandhibagh','Wardhaman Nagar','Manewada',
  'Hingna','Amravati Road','Wardha Road','Katol Road','Kamptee Road'
];

// ─── Upgrad-style syllabus modules ───────────────────────────────────────────
const SYLLABUS = [
  { week: 'Week 1–2', topic: 'Digital Marketing Fundamentals', items: ['What is digital marketing', 'Search engine basics', 'Buyer journey & funnel', 'Setting up Google Analytics'] },
  { week: 'Week 3–5', topic: 'Search Engine Optimisation (SEO)', items: ['On-page SEO', 'Off-page & link building', 'Technical SEO audit', 'Local SEO for Nagpur businesses'] },
  { week: 'Week 6–8', topic: 'Google Ads (PPC)', items: ['Search campaigns', 'Display & remarketing', 'Shopping ads', 'Conversion tracking'] },
  { week: 'Week 9–11', topic: 'Social Media Marketing', items: ['Facebook & Instagram Ads', 'LinkedIn marketing', 'YouTube SEO & Ads', 'Organic growth strategies'] },
  { week: 'Week 12–14', topic: 'Content & Email Marketing', items: ['Blog writing & SEO content', 'Email automation', 'WhatsApp marketing', 'Video content scripts'] },
  { week: 'Week 15–16', topic: 'Live Projects & Placement', items: ['2 live client campaigns', 'Portfolio building', 'Resume & LinkedIn', 'Mock interviews'] },
];

// ─── FAQs per slug now live in landingPagesFaqs.js (shared with tools/prerender.js) ─

// ─── Star rating component ───────────────────────────────────────────────────
function Stars({ count = 5, filled = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

// ─── Breadcrumb component (Zomato-style visual + schema) ─────────────────────
function Breadcrumb({ slug, headline }) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/pages/digital-marketing-course-in-nagpur' },
    { label: headline, href: null },
  ];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-400 flex flex-wrap items-center gap-1 mb-6">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-600">/</span>}
          {c.href ? (
            <Link to={c.href} className="hover:text-purple-300 transition-colors">{c.label}</Link>
          ) : (
            <span className="text-gray-300">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── GEO blocks (Q-001 cannibalization fix · 2026-06-07) ─────────────────────
// Three additive blocks rendered ONLY when the landing-page config provides the
// corresponding field. Designed for AI citation extraction (40–80 word answer
// blocks, structured facts, named entities) per Tier 4 GEO requirements.

function DirectAnswerBlock({ answer }) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="surface-card-elevated p-7 md:p-9">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-4">Quick Answer</p>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">{answer}</p>
        </div>
      </div>
    </section>
  );
}

function CourseFactsBlock({ facts }) {
  const rows = [
    { label: 'Duration', value: facts.duration, icon: Clock },
    { label: 'Course fees', value: facts.fees, icon: IndianRupee },
    { label: 'Mode', value: facts.mode, icon: Users },
    { label: 'Next intake', value: facts.nextIntake, icon: Award },
  ];
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">Course facts</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Everything you need to <span className="font-serif-display italic text-white/90">know</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {rows.map((r) => (
            <div key={r.label} className="surface-card p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
                <r.icon className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em] mb-1">{r.label}</p>
                <p className="text-base font-semibold text-white">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="surface-card p-5">
            <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em] mb-3">Batches available</p>
            <div className="flex flex-wrap gap-2">
              {facts.batches.map((b) => (
                <span key={b} className="text-[12px] font-medium text-white/80 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">{b}</span>
              ))}
            </div>
          </div>
          <div className="surface-card p-5">
            <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em] mb-3">Certifications included</p>
            <div className="flex flex-wrap gap-2">
              {facts.certifications.map((c) => (
                <span key={c} className="text-[12px] font-medium text-emerald-100 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerOutcomesBlock({ outcomes }) {
  const stats = [
    { label: 'Placement rate', value: outcomes.placementRate },
    { label: 'Average salary', value: outcomes.averageSalary },
    { label: 'Highest salary', value: outcomes.highestSalary },
    { label: 'Time to first offer', value: outcomes.timeToFirstOffer },
  ];
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">Career outcomes</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Where our students <span className="font-serif-display italic text-white/90">go next</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="surface-card p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em]">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="surface-card p-5">
            <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em] mb-3">Hiring partners</p>
            <div className="flex flex-wrap gap-2">
              {outcomes.hiringPartners.map((c) => (
                <span key={c} className="text-[12px] font-medium text-white/85 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
          <div className="surface-card p-5">
            <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.12em] mb-3">Common roles</p>
            <div className="flex flex-wrap gap-2">
              {outcomes.roleTypes.map((r) => (
                <span key={r} className="text-[12px] font-medium text-indigo-100 bg-indigo-400/10 border border-indigo-400/20 px-3 py-1.5 rounded-full">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ accordion ───────────────────────────────────────────────────────────
function FAQSection({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">FAQs</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-[1.1]">
            Frequently asked{' '}
            <span className="font-serif-display italic text-white/90">questions</span>
          </h2>
          <p className="text-base text-white/60">Everything you need to know before joining</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="surface-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                <span className="text-base font-semibold text-white pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="w-5 h-5 text-indigo-300 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <p className="px-6 pb-5 text-[15px] text-white/70 leading-relaxed border-t border-white/[0.06] pt-4">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Upgrad-style syllabus ───────────────────────────────────────────────────
function SyllabusSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">Curriculum</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-[1.1]">
            Course{' '}
            <span className="font-serif-display italic text-white/90">curriculum</span>
          </h2>
          <p className="text-base text-white/60">16 weeks · 10+ live projects · Google &amp; Meta certification</p>
        </div>
        <div className="space-y-2">
          {SYLLABUS.map((mod, i) => (
            <div key={i} className="surface-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-indigo-300 font-semibold bg-indigo-400/10 border border-indigo-400/20 px-2.5 py-1 rounded-full uppercase tracking-[0.06em]">{mod.week}</span>
                  <span className="font-semibold text-white">{mod.topic}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-indigo-300 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }}>
                    <ul className="px-6 pb-5 grid md:grid-cols-2 gap-2.5 border-t border-white/[0.06] pt-4">
                      {mod.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2.5 text-[15px] text-white/75">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Upgrad-style review cards ─────────────────────────────────────────────
const REVIEWS = [
  { name: 'Priya Sharma', area: 'Dharampeth, Nagpur', role: 'Now: SEO Executive at Agency', text: 'I joined with zero knowledge of digital marketing. After 4 months at Telzon Academy, I got placed as an SEO Executive with a ₹3.2 LPA package. The live project work made all the difference.', rating: 5 },
  { name: 'Rohan Deshmukh', area: 'Sitabuldi, Nagpur', role: 'Now: Freelance Digital Marketer', text: 'The Google Ads and Meta Ads modules were excellent. I now manage campaigns for 5 clients and earn more than my previous job. Best investment I made in Nagpur.', rating: 5 },
  { name: 'Sneha Patel', area: 'Ramdaspeth, Nagpur', role: 'Now: Social Media Manager', text: 'Flexible timings helped me complete the course while working. The placement team was very active and helped me land a job within 3 weeks of completing the course.', rating: 5 },
  { name: 'Amit Thakre', area: 'Sadar, Nagpur', role: 'Now: Performance Marketing Lead', text: 'I compared 5 institutes in Nagpur before choosing Telzon Academy. The fee is justified — you get live projects, real client work, and actual placement support. Highly recommend.', rating: 5 },
];

function ReviewSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">Reviews</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
            Student{' '}
            <span className="font-serif-display italic text-white/90">stories</span>
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2">
            <Stars filled={5} />
            <span className="text-white font-semibold text-sm">4.9</span>
            <span className="text-white/55 text-sm">/ 5 · 200+ reviews from Nagpur</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="surface-card p-6 hover:border-white/15 transition-colors">
              <Stars filled={r.rating} />
              <p className="text-white/75 mt-4 mb-5 text-[15px] leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/40 to-violet-500/40 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  <p className="text-indigo-300 text-xs mt-0.5">{r.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-white/40" />
                    <span className="text-white/40 text-[11px]">{r.area}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── IndiaMart-style local area targeting section ─────────────────────────────
// Maps each Nagpur area to its dedicated landing page slug if one exists.
const AREA_SLUG_MAP = {
  'Dharampeth': 'digital-marketing-course-in-dharampeth-nagpur',
  'Sitabuldi': 'digital-marketing-course-in-sitabuldi-nagpur',
  'Ramdaspeth': 'digital-marketing-course-in-ramdaspeth-nagpur',
  'Sadar': 'digital-marketing-course-in-sadar-nagpur',
  'Civil Lines': 'digital-marketing-course-in-civil-lines-nagpur',
  'Pratap Nagar': 'digital-marketing-course-in-pratap-nagar-nagpur',
  'Itwari': 'digital-marketing-course-in-itwari-nagpur',
  'Gandhibagh': 'digital-marketing-course-in-gandhibagh-nagpur',
  'Wardhaman Nagar': 'digital-marketing-course-in-wardhaman-nagar-nagpur',
  'Manewada': 'digital-marketing-course-in-manewada-nagpur',
  'Hingna': 'digital-marketing-course-in-hingna-nagpur',
  'Amravati Road': 'digital-marketing-course-in-amravati-road-nagpur',
  'Wardha Road': 'digital-marketing-course-in-wardha-road-nagpur',
  'Katol Road': 'digital-marketing-course-in-katol-road-nagpur',
  'Kamptee Road': 'digital-marketing-course-in-kamptee-road-nagpur',
};

function LocalAreasSection({ keyword }) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">Local areas</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
          {keyword} near you in Nagpur
        </h2>
        <p className="text-white/55 mb-9 text-sm">
          Easily accessible from every part of Nagpur — click your area for local details
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {NAGPUR_AREAS.map(area => {
            const slug = AREA_SLUG_MAP[area];
            const className = "text-sm text-white/70 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full hover:bg-indigo-500/15 hover:border-indigo-400/30 hover:text-white transition-all";
            return slug ? (
              <Link key={area} to={`/pages/${slug}`} className={className}>
                {keyword} — {area}
              </Link>
            ) : (
              <span key={area} className={`${className} cursor-default`}>
                {keyword} — {area}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Related courses section (Practo/Zomato pattern: dense internal linking) ─
function RelatedPagesSection({ currentSlug }) {
  // Q-001 internal linking · 2026-06-07
  // The cluster canonical page MUST appear in the related grid on every
  // other landing page. Deterministic order (not random) so authority flows
  // consistently and the SSR/prerender HTML matches the React render.
  const CLUSTER_CANONICAL = 'digital-marketing-course-in-nagpur';
  const isOnCanonical = currentSlug === CLUSTER_CANONICAL;

  const canonicalEntry = landingPages.find(p => p.slug === CLUSTER_CANONICAL);
  const others = landingPages.filter(
    p => p.slug !== currentSlug && p.slug !== CLUSTER_CANONICAL
  );

  const related = isOnCanonical
    ? others.slice(0, 9)
    : [canonicalEntry, ...others].filter(Boolean).slice(0, 9);
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">Related</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Related courses &amp; services</h2>
          <p className="text-white/55 text-sm">
            Explore other digital marketing courses, locality pages and services from Telzon Academy
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {related.map(p => (
            <Link key={p.slug} to={`/pages/${p.slug}`}
              className="group surface-card px-4 py-3.5 hover:border-indigo-400/30 transition-all">
              <p className="text-sm font-semibold text-white group-hover:text-indigo-200 line-clamp-2 leading-snug">{p.headline}</p>
              <p className="text-[11px] text-white/40 mt-1.5 line-clamp-1 font-mono">/pages/{p.slug}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick stats bar (Upgrad-style) ──────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: Users, label: '1,000+', sub: 'Students Trained' },
    { icon: Award, label: '95%', sub: 'Placement Rate' },
    { icon: Clock, label: '3–6 Months', sub: 'Course Duration' },
    { icon: IndianRupee, label: '3.5 LPA', sub: 'Avg. Salary' },
    { icon: Star, label: '4.9 / 5', sub: 'Student Rating' },
  ];
  return (
    <div className="bg-black/40 border-y border-white/[0.06] py-8 px-4 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl flex flex-wrap justify-center gap-x-12 gap-y-6">
        {stats.map(({ icon: Icon, label, sub }) => (
          <div key={sub} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-indigo-400/20 bg-indigo-400/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-none tracking-tight">{label}</p>
              <p className="text-white/45 text-[11px] mt-1 uppercase tracking-[0.08em] font-medium">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main LandingPage ────────────────────────────────────────────────────────
const LandingPage = () => {
  const { slug } = useParams();
  const page = landingPages.find(p => p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white p-10">
        <Helmet>
          <title>Page Not Found | Telzon Academy</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
          <p className="text-gray-400 mb-6">The page you're looking for does not exist.</p>
          <Link to="/" className="text-purple-300 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://telzonacademy.in/pages/${page.slug}`;
  const faqs = PAGE_FAQS[page.slug] || PAGE_FAQS.default;
  const keywordShort = page.headline.replace(' in Nagpur', '').replace(' — Telzon Academy', '');

  // ── Schema stack (Zomato/Upgrad/IndiaMart approach: multiple schemas per page) ──
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: page.metaTitle,
    description: page.metaDescription,
    url: canonicalUrl,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Telzon Academy',
      url: 'https://telzonacademy.in',
      telephone: '+91-9307189776',
      email: 'connect@telzonacademy.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Nagpur',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        postalCode: '440001',
        addressCountry: 'IN',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '200',
        reviewCount: '200',
      },
    },
    courseMode: ['onsite', 'online'],
    educationalLevel: 'beginner',
    inLanguage: 'en',
    availableLanguage: ['English', 'Hindi', 'Marathi'],
    timeRequired: 'P3M',
    offers: {
      '@type': 'Offer',
      price: '25000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '25000',
        maxPrice: '45000',
        priceCurrency: 'INR',
      },
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'blended',
      location: {
        '@type': 'Place',
        name: 'Telzon Academy',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Nagpur',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      },
      startDate: '2026-06-01',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://telzonacademy.in' },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://telzonacademy.in/pages/digital-marketing-course-in-nagpur' },
      { '@type': 'ListItem', position: 3, name: page.headline, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: 'Telzon Academy',
    description: page.metaDescription,
    url: 'https://telzonacademy.in',
    telephone: '+91-9307189776',
    email: 'connect@telzonacademy.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nagpur, Maharashtra',
      addressLocality: 'Nagpur',
      addressRegion: 'Maharashtra',
      postalCode: '440001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 21.1458, longitude: 79.0882 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '18:00' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', ratingCount: '200' },
    sameAs: ['https://www.instagram.com/telzonacademy/'],
    areaServed: NAGPUR_AREAS.map(area => ({ '@type': 'Place', name: `${area}, Nagpur` })),
    hasMap: 'https://maps.google.com/?q=Telzon+Academy+Nagpur',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Online Transfer, EMI',
  };

  return (
    <>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={page.ogTitle} />
        <meta property="og:description" content={page.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Telzon Academy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.ogTitle} />
        <meta name="twitter:description" content={page.ogDescription} />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da" />
        {/* 4 separate JSON-LD schemas per page — the Upgrad approach */}
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      <div className="min-h-screen text-white overflow-x-hidden font-sans">
        <Header />
        <main>

          {/* ── HERO ── */}
          <section className="pt-32 pb-20 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px] -z-10" />
            <div className="container mx-auto max-w-6xl">
              <Breadcrumb slug={slug} headline={page.headline} />
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Stars filled={5} />
                    <span className="text-yellow-400 font-semibold text-sm">4.9</span>
                    <span className="text-white/50 text-sm">/ 5 · 200+ reviews</span>
                  </div>
                  <div className="badge-tag mb-5">
                    <span>#1 Digital Marketing Institute in Nagpur</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-[1.05] tracking-tight">{page.headline}</h1>
                  <p className="text-lg text-white/65 mb-6 leading-relaxed max-w-xl">{page.subheadline}</p>
                  <ul className="space-y-2.5 mb-7">
                    {page.bullets.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {[['Clock','3–6 months'],['IndianRupee','₹25K–₹45K'],['Users','1000+ alumni'],['Award','95% placed']].map(([, label]) => (
                      <span key={label} className="text-[11px] font-semibold text-white/70 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full uppercase tracking-[0.06em]">{label}</span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={`#lead-gen-${page.slug}`} className="btn-primary text-base px-7 py-4">
                      Book Free Demo Class <ArrowRight className="w-4 h-4" />
                    </a>
                    <a href={`#lead-gen-${page.slug}`} className="btn-secondary text-base px-7 py-4">
                      Get Course Details
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="surface-card-elevated relative overflow-hidden p-2">
                    <img alt={`${page.headline} — Telzon Academy Nagpur`}
                      src="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da"
                      className="w-full h-full object-cover rounded-[1rem]" loading="lazy" width="600" height="400" />
                    <div className="absolute inset-2 rounded-[1rem] bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/15 backdrop-blur-md px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-[0.06em]">Free Demo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── GEO BLOCKS · Q-001 cannibalization fix · 2026-06-07 ──
              Renders only when the slug has these fields in landingPagesConfig.js.
              All other slugs render unchanged.                                    */}
          {page.directAnswer && <DirectAnswerBlock answer={page.directAnswer} />}
          {page.courseFacts && <CourseFactsBlock facts={page.courseFacts} />}
          {page.careerOutcomes && <CareerOutcomesBlock outcomes={page.careerOutcomes} />}

          {/* ── STATS BAR (Upgrad-style) ── */}
          <StatsBar />

          {/* ── SYLLABUS (Upgrad-style) ── */}
          <SyllabusSection />

          {/* ── REUSED CORE SECTIONS ── */}
          <BestCourseSection />
          <PracticalLearning />
          <PlacementsAndCareers />

          {/* ── REVIEWS (Zomato-style with local area) ── */}
          <ReviewSection />

          {/* ── MENTORSHIP ── */}
          <Mentorship />

          {/* ── FAQ with FAQPage schema (Zomato/Swiggy: unique per page) ── */}
          <FAQSection faqs={faqs} />

          {/* ── LOCAL AREAS (IndiaMart-style, now real internal links) ── */}
          <LocalAreasSection keyword={keywordShort} />

          {/* ── RELATED PAGES (Practo/Zomato dense internal linking) ── */}
          <RelatedPagesSection currentSlug={page.slug} />

          {/* ── LEAD FORM ── */}
          <LeadGenForm
            heading="Enquire Now — Free Demo Class"
            subheading="Fill in your details. Our admissions team calls you back within 30 minutes."
            source={page.slug}
          />

          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
