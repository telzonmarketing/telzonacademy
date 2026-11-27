import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NotFoundPage from '@/pages/NotFoundPage';
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
import { SYLLABUS, COURSE_FORMAT } from '@/data/syllabus';
import { TzHeader, TzFooter, AdmissionForm, AskBox, CurriculumList, FaqBlock, AreasBlock, CtaBand, MediaBlock, VIDEO_SCHEMA } from '@/components/tz';

// ─── Nagpur localities for IndiaMart-style hyper-local targeting ─────────────
const NAGPUR_AREAS = [
  'Dharampeth','Sitabuldi','Ramdaspeth','Sadar','Civil Lines',
  'Pratap Nagar','Itwari','Gandhibagh','Wardhaman Nagar','Manewada',
  'Hingna','Amravati Road','Wardha Road','Katol Road','Kamptee Road',
  'Narendra Nagar','Deo Nagar','Dhantoli','Jaitala','Ayodhya Nagar','Dighori'
];

// ─── Upgrad-style syllabus modules ───────────────────────────────────────────

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
    { label: 'Courses', href: '/pages/digital-marketing-course-in-nagpur/' },
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
function SyllabusSection({ modules = SYLLABUS, subtitle = `3 months · ${COURSE_FORMAT.summary} · live project + interview prep` }) {
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
          <p className="text-base text-white/60">{subtitle}</p>
        </div>
        <div className="space-y-2">
          {modules.map((mod, i) => (
            <React.Fragment key={i}>
            {mod.month && (i === 0 || modules[i - 1].month !== mod.month) && (
              <p className="pt-6 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-300">{mod.month}</p>
            )}
            <div className="surface-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  {mod.week && <span className="text-[11px] text-indigo-300 font-semibold bg-indigo-400/10 border border-indigo-400/20 px-2.5 py-1 rounded-full uppercase tracking-[0.06em]">{mod.week}</span>}
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
            </React.Fragment>
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
              <Link key={area} to={`/pages/${slug}/`} className={className}>
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
            <Link key={p.slug} to={`/pages/${p.slug}/`}
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

// Related pages: the cluster canonical first, then a deterministic slice
// (same order as the prerendered HTML) — dense internal linking.
function relatedPages(currentSlug) {
  const current = landingPages.find((p) => p.slug === currentSlug) || {};
  // Photography-cluster pages (own syllabus) link to each other first.
  if (current.syllabus) {
    const cluster = landingPages.filter((p) => p.syllabus && p.slug !== currentSlug);
    const rest = landingPages.filter((p) => !p.syllabus && p.slug !== currentSlug);
    return [...cluster, ...rest].slice(0, 9);
  }
  const CANON = 'digital-marketing-course-in-nagpur';
  const canonicalEntry = landingPages.find((p) => p.slug === CANON);
  const others = landingPages.filter((p) => p.slug !== currentSlug && p.slug !== CANON && !p.syllabus);
  return currentSlug === CANON ? others.slice(0, 9) : [canonicalEntry, ...others].filter(Boolean).slice(0, 9);
}

// ─── Quick stats bar (Upgrad-style) ──────────────────────────────────────────
function StatsBar({ duration = '3 Months', fee = null }) {
  const stats = [
    { icon: Users, label: '1,000+', sub: 'Students Trained' },
    ...(fee ? [] : [{ icon: Award, label: '95%', sub: 'Placement Rate' }]),
    { icon: Clock, label: duration, sub: 'Course Duration' },
    fee ? { icon: IndianRupee, label: fee, sub: 'Course Fee' } : { icon: IndianRupee, label: '3.5 LPA', sub: 'Avg. Salary' },
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

  if (!page) return <NotFoundPage />;

  const canonicalUrl = `https://telzonacademy.in/pages/${page.slug}/`;
  const faqs = PAGE_FAQS[page.slug] || PAGE_FAQS.default;
  const keywordShort = page.headline.replace(' in Nagpur', '').replace(' — Telzon Academy', '');

  // ── Schema stack (Zomato/Upgrad/IndiaMart approach: multiple schemas per page) ──
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: page.headline,
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
        streetAddress: 'Chhatrapati Square',
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
    timeRequired: page.timeRequired || 'P3M',
    offers: {
      '@type': 'Offer',
      price: page.price || '25000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: page.price || '25000',
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
    // Q-003 · 2026-09-12 · aggregateRating at Course level triggers ★ rating
    // snippets in Google SERPs. Google policy requires accompanying Review
    // objects with real reviewer names + review body — 5 pinned below.
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '212',
      reviewCount: '212',
    },
    // Q-003a rollback (2026-09-12): removed synthetic review[] objects to
    // comply with Google's Review-snippet policy (reviews must be real, not
    // fabricated). aggregateRating retained — Telzon Academy has 200+ real
    // Google Business Profile reviews, so the aggregate is claimed real data.
    // Individual Review objects can be re-added when the real reviews are
    // pulled from Google Business Profile.
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://telzonacademy.in' },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://telzonacademy.in/pages/digital-marketing-course-in-nagpur/' },
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
      streetAddress: 'Chhatrapati Square',
      addressLocality: 'Nagpur',
      addressRegion: 'Maharashtra',
      postalCode: '440001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 21.1107, longitude: 79.0704 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '18:00' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', ratingCount: '200' },
    sameAs: ['https://www.instagram.com/telzonacademy/'],
    areaServed: NAGPUR_AREAS.map(area => ({ '@type': 'Place', name: `${area}, Nagpur` })),
    hasMap: 'https://maps.google.com/?cid=14189364389887923920',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Online Transfer, EMI',
  };

  return (
    <>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={page.ogTitle} />
        <meta property="og:description" content={page.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://telzonacademy.in/media/telzon-academy-nagpur-share.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Telzon Academy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.ogTitle} />
        <meta name="twitter:description" content={page.ogDescription} />
        <meta name="twitter:image" content="https://telzonacademy.in/media/telzon-academy-nagpur-share.jpg" />
        {/* 4 separate JSON-LD schemas per page — the Upgrad approach */}
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(VIDEO_SCHEMA)}</script>
      </Helmet>

      <div className="tz">
        <TzHeader />
        <main>
          {/* ── HERO + admission form ── */}
          <section className="tz-wrap tz-hero">
            <div>
              <nav className="tz-crumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link> / <Link to="/pages/digital-marketing-course-in-nagpur/">Courses</Link> / <span>{page.headline}</span>
              </nav>
              <span className="tz-badge">{page.badge || 'No. 1 digital marketing institute in Nagpur'}</span>
              <h1>{page.headline}</h1>
              <p className="tz-lead">{page.subheadline}</p>
              <p className="tz-rating"><span aria-hidden="true">★★★★★</span>4.9 on Google · 200+ reviews</p>
              <ul className="tz-bullets">
                {page.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="tz-chips">
                {(page.chips || [['', '3 months'], ['', '₹25,000 + GST'], ['', '1,000+ alumni'], ['', 'Free demo class']]).map(([, label]) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <AskBox />
            </div>
            <AdmissionForm
              id={`lead-gen-${page.slug}`}
              source={page.slug}
              title="Book a free demo class"
              sub="Fill in your details. Our admissions team calls you back within 30 minutes."
            />
          </section>

          {/* ── Quick answer + about ── */}
          {(page.directAnswer || page.intro) && (
            <section className="tz-band-sm tz-soft">
              <div className="tz-wrap">
                {page.directAnswer && (
                  <>
                    <p className="tz-kicker">Quick answer</p>
                    <p style={{ fontSize: 'clamp(18px,2vw,22px)', lineHeight: 1.5, maxWidth: '46em', color: '#111' }}>{page.directAnswer}</p>
                  </>
                )}
                {page.intro && (
                  <div className="tz-prose" style={{ marginTop: page.directAnswer ? 28 : 0 }}>
                    <p dangerouslySetInnerHTML={{ __html: page.intro }} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Course facts ── */}
          <section className="tz-facts" aria-label="Course at a glance">
            <div className="tz-wrap tz-grid">
              <div><b>{page.courseFacts?.duration || '3 months'}</b><small>Course duration</small></div>
              <div><b>{(page.courseFacts?.fees || '₹25,000 + GST').replace(' + GST', '')}</b><small>Course fee + GST</small></div>
              <div><b>4.9 / 5</b><small>200+ Google reviews</small></div>
              <div><b>{page.syllabus ? 'Live shoot' : '1,000+'}</b><small>{page.syllabus ? 'Real brand project' : 'Students trained'}</small></div>
            </div>
          </section>

          <MediaBlock
            title={page.syllabus ? 'See a live commercial shoot' : 'Inside Telzon Academy'}
            text={page.syllabus
              ? 'Students light the set, frame the product and shoot a commercial for a local café in Nagpur — exactly what you do in this course.'
              : 'Real classes, real shoots. Students plan, light and shoot a live commercial for a local café — the hands-on work you do on every project.'}
          />

          {page.courseFacts && (
            <section className="tz-band tz-black">
              <div className="tz-wrap">
                <h2 className="tz-h2">Everything you need to know</h2>
                <p className="tz-intro">Key facts about this course at Telzon Academy, Chhatrapati Square, Nagpur.</p>
                <div className="tz-stats tz-stats-3">
                  {[
                    ['Duration', page.courseFacts.duration],
                    ['Course fees', page.courseFacts.fees],
                    ['Mode', page.courseFacts.mode],
                    ['Next intake', page.courseFacts.nextIntake],
                    ['Batches', (page.courseFacts.batches || []).join(' · ')],
                    ['Certifications', (page.courseFacts.certifications || []).join(' · ')],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k}><small style={{ marginTop: 0, marginBottom: 8 }}>{k}</small><span style={{ fontSize: 19, fontWeight: 600 }}>{v}</span></div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Career outcomes ── */}
          {page.careerOutcomes && (
            <section className="tz-band">
              <div className="tz-wrap">
                <h2 className="tz-h2">Where our students go next</h2>
                <p className="tz-intro">Placement results from the digital marketing course at Telzon Academy.</p>
                <div className="tz-facts" style={{ marginBottom: 24 }}>
                  <div className="tz-grid">
                    <div><b>{page.careerOutcomes.placementRate}</b><small>Placement rate</small></div>
                    <div><b>{page.careerOutcomes.averageSalary}</b><small>Average salary</small></div>
                    <div><b>{page.careerOutcomes.highestSalary}</b><small>Highest salary</small></div>
                    <div><b style={{ fontSize: 'clamp(20px,2.4vw,26px)', whiteSpace: 'normal' }}>{page.careerOutcomes.timeToFirstOffer}</b><small>Time to first offer</small></div>
                  </div>
                </div>
                <p style={{ color: '#333' }}><b>Hiring partners:</b> {page.careerOutcomes.hiringPartners.join(' · ')}</p>
                {page.careerOutcomes.roleTypes && <p style={{ color: '#333', marginTop: 8 }}><b>Common roles:</b> {page.careerOutcomes.roleTypes.join(' · ')}</p>}
              </div>
            </section>
          )}

          {/* ── Curriculum ── */}
          <section className="tz-band" id="curriculum" style={page.careerOutcomes ? { paddingTop: 0 } : undefined}>
            <div className="tz-wrap">
              <h2 className="tz-h2">Course curriculum</h2>
              <p className="tz-intro">{page.syllabus ? page.curriculumSubtitle : `3 months · ${COURSE_FORMAT.summary} · live project + interview preparation`}</p>
              <CurriculumList modules={page.syllabus || SYLLABUS} />
            </div>
          </section>

          {/* ── Why Telzon (digital marketing courses) ── */}
          {!page.syllabus && (
            <section className="tz-band tz-soft">
              <div className="tz-wrap">
                <h2 className="tz-h2">Practical, AI-first and job-ready</h2>
                <p className="tz-intro">Learning by doing, from day one.</p>
                <div className="tz-mods">
                  <article><h3>Hands-on projects</h3><p>Real campaigns and a portfolio that shows employers what you can do.</p></article>
                  <article><h3>AI in every module</h3><p>ChatGPT, Claude, ElevenLabs and HeyGen for content, video, ads, SEO and automation.</p></article>
                  <article><h3>100+ tools</h3><p>Google Ads, Meta Ads Manager, GA4, Search Console, Semrush, Canva and more.</p></article>
                  <article><h3>Certification</h3><p>Telzon Academy certificate plus Google Ads, Analytics and Meta certification prep.</p></article>
                  <article><h3>Placement assistance</h3><p>Average package ₹3.5 LPA, highest ₹8.5 LPA, with 3 weeks of interview preparation.</p></article>
                  <article><h3>Expert mentor</h3><p>10+ years in marketing and 150+ brands — learn the methods used with real clients.</p></article>
                </div>
              </div>
            </section>
          )}

          {/* ── Reviews (digital marketing courses) ── */}
          {!page.syllabus && (
            <section className="tz-band">
              <div className="tz-wrap">
                <h2 className="tz-h2">Student stories</h2>
                <p className="tz-intro">4.9 / 5 from 200+ reviews in Nagpur.</p>
                <div className="tz-reviews">
                  {REVIEWS.map((r) => (
                    <article className="tz-review" key={r.name}>
                      <span aria-label="5 out of 5 stars">★★★★★</span>
                      <p>"{r.text}"</p>
                      <b>{r.name}</b><br /><small>{r.area} · {r.role}</small>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Career guide links (digital marketing pages only) ── */}
          {!page.syllabus && (
            <section className="tz-band-sm" style={{ borderTop: '1.5px solid #000' }}>
              <div className="tz-wrap">
                <h2 className="tz-h2" style={{ fontSize: 'clamp(26px,3.4vw,36px)' }}>Where this course can take you in 2027</h2>
                <p className="tz-intro">AI is creating new specialisations inside digital marketing. Compare six career options, the skills each needs and a first portfolio project.</p>
                <div className="tz-pills">
                  <a href="/careers/best-career-options-2027/">Best career options in 2027</a>
                  <a href="/careers/ai-creative-strategist/">AI Creative Strategist</a>
                  <a href="/careers/ai-search-visibility-specialist/">AI Search Visibility (GEO) Specialist</a>
                  <a href="/careers/ai-marketing-automation-specialist/">AI Marketing Automation Specialist</a>
                </div>
              </div>
            </section>
          )}

          {/* ── FAQ (FAQPage schema is in the head above) ── */}
          <FaqBlock faqs={faqs} title="Frequently asked questions" />

          {/* ── Local areas ── */}
          <AreasBlock keyword={keywordShort} />

          {/* ── Related pages (internal linking) ── */}
          <section className="tz-band-sm">
            <div className="tz-wrap">
              <h2 className="tz-h2" style={{ fontSize: 'clamp(26px,3.4vw,36px)' }}>Related courses &amp; services</h2>
              <p className="tz-intro">Explore other courses, locality pages and services from Telzon Academy.</p>
              <div className="tz-related">
                {relatedPages(page.slug).map((p) => (
                  <Link key={p.slug} to={`/pages/${p.slug}/`}>{p.headline}</Link>
                ))}
              </div>
            </div>
          </section>

          <CtaBand />
        </main>
        <TzFooter />
      </div>
    </>
  );
};

export default LandingPage;
