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
import { PAGE_FAQS, NAGPUR_AREAS, buildLandingSeo } from './landingSeo';


// ─── Upgrad-style syllabus modules ───────────────────────────────────────────
const SYLLABUS = [
  { week: 'Week 1–2', topic: 'Digital Marketing Fundamentals', items: ['What is digital marketing', 'Search engine basics', 'Buyer journey & funnel', 'Setting up Google Analytics'] },
  { week: 'Week 3–5', topic: 'Search Engine Optimisation (SEO)', items: ['On-page SEO', 'Off-page & link building', 'Technical SEO audit', 'Local SEO for Nagpur businesses'] },
  { week: 'Week 6–8', topic: 'Google Ads (PPC)', items: ['Search campaigns', 'Display & remarketing', 'Shopping ads', 'Conversion tracking'] },
  { week: 'Week 9–11', topic: 'Social Media Marketing', items: ['Facebook & Instagram Ads', 'LinkedIn marketing', 'YouTube SEO & Ads', 'Organic growth strategies'] },
  { week: 'Week 12–14', topic: 'Content & Email Marketing', items: ['Blog writing & SEO content', 'Email automation', 'WhatsApp marketing', 'Video content scripts'] },
  { week: 'Week 15–16', topic: 'Live Projects & Placement', items: ['2 live client campaigns', 'Portfolio building', 'Resume & LinkedIn', 'Mock interviews'] },
];


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

// ─── FAQ accordion ───────────────────────────────────────────────────────────
function FAQSection({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-center mb-10">Everything you need to know before joining</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                <span className="text-base font-semibold text-white pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="w-5 h-5 text-purple-300 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <p className="px-6 pb-5 text-gray-300 leading-relaxed font-light border-t border-white/5">{faq.a}</p>
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
    <section className="py-16 px-4 bg-black/20">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Course Curriculum</h2>
        <p className="text-gray-400 text-center mb-10">16 weeks · 10+ live projects · Google & Meta certification</p>
        <div className="space-y-2">
          {SYLLABUS.map((mod, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-purple-300 font-mono bg-purple-500/20 px-2 py-1 rounded">{mod.week}</span>
                  <span className="font-semibold text-white">{mod.topic}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-purple-300 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }}>
                    <ul className="px-6 pb-4 grid md:grid-cols-2 gap-2 border-t border-white/5">
                      {mod.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
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
    <section className="py-16 px-4 bg-black/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Student Reviews</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Stars filled={5} />
            <span className="text-white font-bold text-lg">4.9</span>
            <span className="text-gray-400 text-sm">/ 5 · 200+ reviews</span>
          </div>
          <p className="text-gray-400 text-sm">From students across Nagpur</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Stars filled={r.rating} />
              <p className="text-gray-300 mt-3 mb-4 text-sm leading-relaxed italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/40 flex items-center justify-center text-white font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  <p className="text-purple-300 text-xs">{r.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">{r.area}</span>
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
    <section className="py-14 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {keyword} Near You in Nagpur
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Easily accessible from every part of Nagpur — click your area for local details
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {NAGPUR_AREAS.map(area => {
            const slug = AREA_SLUG_MAP[area];
            const className = "text-sm text-gray-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-white transition-all";
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
  const related = landingPages
    .filter(p => p.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 9);
  return (
    <section className="py-14 px-4 bg-black/20">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Related Courses & Services</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Explore other digital marketing courses, locality pages and services from Telzon Academy
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {related.map(p => (
            <Link key={p.slug} to={`/pages/${p.slug}`}
              className="group bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 hover:border-purple-500/30 transition-all">
              <p className="text-sm font-semibold text-white group-hover:text-purple-300 line-clamp-2">{p.headline}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">/pages/{p.slug}</p>
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
    <div className="bg-black/30 border-y border-white/10 py-6 px-4">
      <div className="container mx-auto max-w-6xl flex flex-wrap justify-center gap-8">
        {stats.map(({ icon: Icon, label, sub }) => (
          <div key={sub} className="flex items-center gap-3 text-center">
            <Icon className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-white font-bold text-lg leading-none">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
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

  // ── Schema stack: built in shared module (single source of truth) ──
  const { schemas } = buildLandingSeo(page);
  const { courseSchema, breadcrumbSchema, faqSchema, localBusinessSchema } = schemas;

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

      <div className="min-h-screen text-white overflow-x-hidden"
        style={{ background: 'radial-gradient(circle at 50% 0%, #4c1d95 0%, #1e1b4b 40%, #312e81 60%, #c2410c 100%)', backgroundAttachment: 'fixed' }}>
        <Header />
        <main>

          {/* ── HERO ── */}
          <section className="pt-32 pb-16 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] -z-10" />
            <div className="container mx-auto max-w-6xl">
              <Breadcrumb slug={slug} headline={page.headline} />
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  {/* AggregateRating visible stars — Upgrad does this */}
                  <div className="flex items-center gap-2 mb-4">
                    <Stars filled={5} />
                    <span className="text-yellow-400 font-bold text-sm">4.9</span>
                    <span className="text-gray-400 text-sm">/ 5 · 200+ reviews</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
                    <span className="text-sm font-semibold">#1 Digital Marketing Institute in Nagpur</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{page.headline}</h1>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed font-light">{page.subheadline}</p>
                  <ul className="space-y-2 mb-6">
                    {page.bullets.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/* Upgrad-style quick-info pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[['Clock','3–6 months'],['IndianRupee','₹25K–₹45K'],['Users','1000+ alumni'],['Award','95% placed']].map(([, label]) => (
                      <span key={label} className="text-xs text-gray-300 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">{label}</span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href={`#lead-gen-${page.slug}`}
                      className="bg-white text-purple-900 hover:bg-gray-100 font-bold transition-all duration-300 hover:scale-105 text-base px-8 py-4 rounded-xl text-center flex items-center justify-center gap-2">
                      Book Free Demo Class <ArrowRight className="w-4 h-4" />
                    </a>
                    <a href={`#lead-gen-${page.slug}`}
                      className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-base px-8 py-4 rounded-xl text-center">
                      Get Course Details
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2">
                    <img alt={`${page.headline} — Telzon Academy Nagpur`}
                      src="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da"
                      className="w-full h-full object-cover rounded-xl" loading="lazy" width="600" height="400" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/60 to-transparent pointer-events-none rounded-2xl" />
                    <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      Free Demo Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
