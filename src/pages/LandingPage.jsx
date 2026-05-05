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

// ─── Zomato/Swiggy style: unique FAQs per slug ───────────────────────────────
const PAGE_FAQS = {
  default: [
    { q: 'What is the duration of the digital marketing course in Nagpur?', a: 'The course runs from 3 to 6 months depending on the batch you choose. We offer a 3-month intensive and a 6-month comprehensive program with weekend and weekday options.' },
    { q: 'What are the fees for the digital marketing course at Telzon Academy?', a: 'Course fees range from ₹25,000 to ₹45,000 depending on the program. We offer flexible EMI options and merit-based scholarships. Contact us for the latest pricing.' },
    { q: 'Do I need prior experience to join the digital marketing course in Nagpur?', a: 'No prior experience is needed. Our course starts from absolute basics and moves to advanced topics. Students from any background — science, commerce, arts — have successfully completed this course.' },
    { q: 'Is there placement assistance after the digital marketing course?', a: 'Yes. Telzon Academy has a 95% placement success rate. We help with resume building, LinkedIn optimisation, mock interviews and direct connections with hiring partners in Nagpur and across India.' },
    { q: 'Which areas in Nagpur is Telzon Academy accessible from?', a: 'Our institute is centrally located in Nagpur and easily reachable from Dharampeth, Sitabuldi, Sadar, Ramdaspeth, Civil Lines, Pratap Nagar and all other major areas. We also offer fully online classes.' },
    { q: 'Will I get Google and Meta certification?', a: 'Yes. Our trainers guide you through the Google Ads, Google Analytics, and Meta Blueprint certification exams. These industry certifications are included in the course.' },
  ],
  'digital-marketing-course-fees-in-nagpur': [
    { q: 'How much does a digital marketing course cost in Nagpur?', a: 'At Telzon Academy, fees range from ₹25,000 to ₹45,000. This is an all-inclusive fee — no hidden charges for study materials, tools or certification guidance.' },
    { q: 'Is EMI available for the digital marketing course fees?', a: 'Yes. We offer 3-month and 6-month no-cost EMI options. You can start the course with a small registration amount and pay the rest in easy instalments.' },
    { q: 'Are there any scholarships or discounts available?', a: 'We offer merit-based scholarships of up to 30% for students who perform well in our admission test. Early-bird discounts are also available for the next batch.' },
    { q: 'What is included in the course fee?', a: 'The fee includes all study materials, live project access, tool subscriptions during training, certification exam prep, and 1 year of placement assistance. No extra charges.' },
    { q: 'How does Telzon Academy\'s fee compare to other institutes in Nagpur?', a: 'Most institutes in Nagpur charge ₹15,000–₹20,000 for basic courses with no live projects. Telzon Academy charges a premium because we include live projects, Google/Meta certification and 95% placement support.' },
    { q: 'Can I get a refund if I am not satisfied?', a: 'We offer a free demo class before you enroll so you can experience the quality first. After enrollment, we have a structured refund policy within the first 7 days.' },
  ],
  'digital-marketing-course-with-placement-nagpur': [
    { q: 'What is Telzon Academy\'s placement record?', a: 'We have a 95% placement success rate. Our graduates work at companies like Swiggy, OLA, Nykaa, and dozens of Nagpur-based agencies and startups.' },
    { q: 'How long does placement take after course completion?', a: 'Most students receive their first job offer within 30–60 days of course completion. Our placement team actively connects you with hiring partners throughout the course.' },
    { q: 'What kind of jobs do digital marketing course graduates get in Nagpur?', a: 'Common roles include Digital Marketing Executive, SEO Analyst, Social Media Manager, Google Ads Specialist, Content Marketer and Performance Marketing Manager. Salaries range from ₹2.5 LPA to ₹8.5 LPA.' },
    { q: 'Does Telzon Academy have a job guarantee?', a: 'We provide 100% placement assistance, not a guaranteed job. However, our 95% placement rate means almost every student who completes the course and projects gets placed within 60 days.' },
    { q: 'Can I get a freelancing career after the digital marketing course?', a: 'Absolutely. Many of our graduates work as freelancers earning ₹30,000–₹1,00,000 per month. We teach you how to find clients and set up your own digital marketing consultancy.' },
    { q: 'What companies hire from Telzon Academy?', a: 'Our graduates have been hired by Swiggy, OLA, Le Meridien, Amul, Nykaa, and many Nagpur-based digital agencies. We also partner with startups looking for freshers.' },
  ],
  'seo-course-in-nagpur': [
    { q: 'What will I learn in the SEO course in Nagpur?', a: 'You will learn keyword research, on-page optimisation, technical SEO audits, link building, local SEO, Google Search Console, and how to rank websites on Google — all with live practice.' },
    { q: 'Is SEO still worth learning in 2026?', a: 'Absolutely. SEO generates the highest ROI of any digital marketing channel. Every business in Nagpur needs SEO and good SEO professionals are in very high demand, earning ₹3–8 LPA.' },
    { q: 'How long does it take to learn SEO?', a: 'Our SEO module takes 3–4 weeks of intensive training. To get good at it professionally, plan 3–6 months of consistent practice, which is why we include live projects.' },
    { q: 'Will I work on a real website in the SEO course?', a: 'Yes. You will work on live websites — including your own practice site — and do real audits of existing websites during the course. No theoretical-only learning.' },
    { q: 'Does the SEO course include local SEO for Nagpur businesses?', a: 'Yes. We have a dedicated local SEO module covering Google Business Profile, Nagpur-specific citation building, local keyword targeting and map pack optimisation.' },
    { q: 'What tools are covered in the SEO course?', a: 'Google Search Console, Google Analytics, Semrush, Ahrefs (basic), Screaming Frog, Moz, Ubersuggest and Google PageSpeed Insights. All tools are available during training.' },
  ],
  'digital-marketing-agency-in-nagpur': [
    { q: 'What does Telzon Academy as a digital marketing agency in Nagpur do?', a: 'We run end-to-end digital marketing for Nagpur businesses — SEO, Google Ads, Meta Ads, social media management, content creation, and lead generation. We also offer website design and conversion-rate optimisation.' },
    { q: 'How much do digital marketing agency services in Nagpur cost?', a: 'Monthly retainers start at ₹15,000/month for SEO-only and go up to ₹75,000/month for full-stack growth packages. Pricing is transparent and based on scope, never on guesswork.' },
    { q: 'Is Telzon Academy actually based in Nagpur?', a: 'Yes — our team, trainers and account managers are all based in Nagpur. You can walk in for a meeting any time. We work with both local Nagpur businesses and clients across India.' },
    { q: 'Do you handle Google Ads and Meta Ads for Nagpur businesses?', a: 'Yes. Our certified team manages Google Search, Display, Performance Max, and Meta (Facebook + Instagram) ad campaigns with full transparency, weekly reporting and ROI tracking.' },
    { q: 'How long until I see results from your digital marketing services?', a: 'Paid ads usually start delivering leads within the first week. SEO results kick in around 2–3 months, with major ranking gains by month 4–6. We share progress every 2 weeks.' },
    { q: 'Can I get a free consultation before signing up?', a: 'Yes. Book a free 30-minute strategy call. We\'ll audit your current digital presence and give you 2–3 specific recommendations whether you sign up or not.' },
  ],
  'top-10-digital-marketing-institutes-in-nagpur': [
    { q: 'Who ranks #1 among digital marketing institutes in Nagpur?', a: 'Based on student reviews (4.9/5 from 200+), placement rate (95%), course quality and AI-powered curriculum, Telzon Academy ranks #1 on most independent rankings of digital marketing institutes in Nagpur.' },
    { q: 'How is this top 10 list determined?', a: 'We score each institute on: placement record, curriculum depth, trainer expertise, student reviews on Google, fee transparency and live project work. The full methodology is shared on this page.' },
    { q: 'Are these rankings updated for 2026?', a: 'Yes. This list is reviewed and updated quarterly to reflect latest course offerings, placement records and student reviews from Nagpur.' },
    { q: 'How do I choose the right institute from this list?', a: 'Take a free demo class at the top 2–3 institutes that match your budget and timing. Compare the trainer quality, curriculum and student energy before deciding.' },
    { q: 'Are online digital marketing institutes also included?', a: 'We include institutes that offer online + offline hybrid options for Nagpur students. Pure online-only national platforms are listed separately.' },
    { q: 'What\'s the average fee across the top 10?', a: 'Course fees in the top 10 range from ₹15,000 (basic) to ₹70,000 (premium with placement). Telzon Academy is in the mid-range at ₹25,000–₹45,000 with full placement support.' },
  ],
  'digital-marketing-course-in-dharampeth-nagpur': [
    { q: 'Where exactly is Telzon Academy located relative to Dharampeth?', a: 'Telzon Academy is centrally located in Nagpur, easy to reach from Dharampeth. The commute from Variety Square or Wing Square is roughly 10–15 minutes by auto or your own vehicle.' },
    { q: 'Are there any digital marketing institutes inside Dharampeth itself?', a: 'There are a few smaller coaching centres inside Dharampeth, but most lack live projects and placement support. Most serious students from Dharampeth join Telzon Academy for the full curriculum and placement track record.' },
    { q: 'Can I attend the course online if I\'m based in Dharampeth?', a: 'Yes. We offer fully online live batches with the same syllabus and trainers. Many Dharampeth working professionals choose the online option to save commute time.' },
    { q: 'What batch timings work best for Dharampeth working professionals?', a: 'Most Dharampeth working professionals prefer the evening (6–8 PM) or weekend batch (Sat–Sun 10 AM–2 PM). Both batches have the same content and trainers.' },
    { q: 'Is parking available at the institute?', a: 'Yes. We have parking for two-wheelers and cars at the institute, so coming from Dharampeth by your own vehicle is no problem.' },
    { q: 'Can I take a free demo class first?', a: 'Absolutely. We run free demo classes every Saturday. WhatsApp us your name to confirm a slot — no commitment required.' },
  ],
  'digital-marketing-jobs-in-nagpur': [
    { q: 'What digital marketing jobs are available in Nagpur right now?', a: 'Common openings in Nagpur include Digital Marketing Executive, SEO Analyst, Social Media Manager, Performance Marketing Manager, Content Writer and Google Ads Specialist. Salaries range from ₹2.5L to ₹12L+ depending on experience.' },
    { q: 'What is the entry-level digital marketing salary in Nagpur?', a: 'Fresher digital marketing salaries in Nagpur range from ₹2.5–₹3.5 LPA in 2026. With Google + Meta certifications and a portfolio, freshers can negotiate ₹4 LPA.' },
    { q: 'Which companies hire digital marketers in Nagpur?', a: 'Major hirers include Persistent Systems, Tata Consultancy Services, dozens of Nagpur-based agencies, ed-tech companies, real estate firms and D2C brands. Telzon also has a hiring partner network of 50+ companies.' },
    { q: 'How fast can I get a digital marketing job after the course?', a: 'On average, our students get placed within 30–60 days of course completion. 95% are placed within 90 days, provided they complete the course and project work.' },
    { q: 'Can I work as a freelancer instead of taking a job?', a: 'Yes. Many Telzon graduates freelance for ₹40,000–₹1,00,000+ per month. We teach freelancing, client acquisition and pricing in a dedicated module.' },
    { q: 'Are there remote digital marketing jobs available from Nagpur?', a: 'Yes. Remote roles are increasingly common — many Nagpur-based marketers work for Mumbai, Bangalore and overseas clients while staying in Nagpur. We help you craft a remote-friendly portfolio.' },
  ],
  'online-digital-marketing-course-nagpur': [
    { q: 'Is the online digital marketing course at Telzon Academy live or recorded?', a: 'It is live instructor-led training over Zoom/Google Meet. You attend real-time classes, ask questions, and get assignments. Recorded sessions are also available if you miss a class.' },
    { q: 'Is the online course as good as the offline one?', a: 'Yes — same curriculum, same trainers, same live projects. The only difference is you attend from home. Many of our top-placed students completed the course fully online.' },
    { q: 'What equipment do I need for the online digital marketing course?', a: 'A laptop or desktop with a good internet connection is all you need. A smartphone is useful for social media modules. No special equipment required.' },
    { q: 'Are there any batch timings for the online course?', a: 'We offer morning batches (10 AM–12 PM), evening batches (6 PM–8 PM), and weekend batches (Sat–Sun 10 AM–2 PM). You can choose based on your schedule.' },
    { q: 'Will I get a certificate for completing the online course?', a: 'Yes, the same Telzon Academy certificate is awarded for online completion as for offline. It includes your name, the course details and is signed by our directors.' },
    { q: 'Can I switch from online to offline during the course?', a: 'Yes. If you want to attend some sessions offline, you are welcome to come to our Nagpur centre. We are flexible — online, offline, or hybrid.' },
  ],
};

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
function LocalAreasSection({ keyword }) {
  return (
    <section className="py-14 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {keyword} Near You in Nagpur
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Easily accessible from every part of Nagpur — online and offline options available
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {NAGPUR_AREAS.map(area => (
            <span key={area}
              className="text-sm text-gray-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-white transition-all cursor-default">
              {keyword} — {area}
            </span>
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

          {/* ── LOCAL AREAS (IndiaMart-style) ── */}
          <LocalAreasSection keyword={keywordShort} />

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
