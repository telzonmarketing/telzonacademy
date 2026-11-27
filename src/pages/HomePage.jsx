// Telzon Academy homepage — approved black & white design (Nov 2026).
// Content carries over everything from the previous homepage (hero, about,
// placements, practical learning, comparison, AI, curriculum, blog, mentorship,
// FAQ, contact, CTA) plus the updated fees, 3-month format and new courses.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalSeo from '@/components/GlobalSeo';
import { supabase } from '@/lib/customSupabaseClient';
import { COURSE_FORMAT } from '@/data/syllabus';
import {
  TzHeader, TzFooter, AdmissionForm, AskBox, CurriculumList, FaqBlock, AreasBlock, CtaBand, MediaBlock, VIDEO_SCHEMA, PHONE,
} from '@/components/tz';

const HOME_FAQS = [
  { q: 'What is the duration of the course?', a: `The Digital Marketing & AI course runs for 3 months: ${COURSE_FORMAT.summary}. Days 1–54 cover the course and a live project, and days 55–72 are interview and career preparation. Weekday and weekend batches are available.` },
  { q: 'What is the fee for the digital marketing course in Nagpur?', a: 'The fee is ₹25,000 + GST for the complete 3-month program, with no-cost EMI available. The Commercial Ads & Photography course is ₹48,000 + GST for 90 days.' },
  { q: 'Do I need any prior experience?', a: 'No prior experience is required. The course is designed for complete beginners: it starts with marketing and branding fundamentals and builds up to SEO, AI workflows, Google Ads, Meta Ads and a live project.' },
  { q: 'Will I get a certificate?', a: "Yes. On completing the course and projects you receive an industry-recognised certificate from Telzon Academy that you can show employers and add to LinkedIn, plus preparation for Google Ads, Google Analytics and Meta certifications." },
  { q: 'What tools and software will I learn?', a: 'More than 50 tools in guided practice, including Google Ads, Meta Ads Manager, GA4, Search Console, Semrush, Canva, DaVinci Resolve, ChatGPT, Claude, ElevenLabs, HeyGen, HubSpot and Make, plus a 100+ tool reference library.' },
  { q: 'Is job placement assistance provided?', a: 'Yes. Placement assistance includes résumé building, LinkedIn and portfolio work, mock interviews, Google Ads and Meta Ads tests, and introductions to our hiring partners.' },
  { q: 'Where is Telzon Academy and how do I contact you?', a: `Telzon Academy is at Chhatrapati Square, Nagpur, Maharashtra. Call or WhatsApp ${PHONE}, or email connect@telzonacademy.in. Open Monday to Saturday, 9 AM to 8 PM.` },
];

const COMPARE = [
  ['Real-time learning', 'Real industry scenarios, tools and market trends', 'Mostly theory with limited exposure to current practice'],
  ['Content creation', 'Hands-on reels, ad creatives, copywriting and brand storytelling', 'Concepts without practical content work'],
  ['Live campaigns', 'Plan, launch, manage and optimise live campaigns', 'Little or no real campaign execution'],
  ['Practical exposure', 'Real brand case studies and execution-driven projects', 'Mostly theoretical or simulated assignments'],
  ['Tool-based learning', 'Direct training on Meta Ads, Google Ads and analytics platforms', 'Limited tool exposure or basic demos'],
  ['Portfolio', 'A real-work portfolio with campaigns, creatives and results', 'No tangible portfolio or project proof'],
  ['Career outcomes', 'Job-ready skills with execution experience', 'Knowledge without industry readiness'],
  ['Curriculum', 'Continuously updated with AI tools and the latest strategies', 'Static curriculum that lags behind the industry'],
  ['Mentorship', 'Taught by practitioners working in the industry', 'Academic trainers with limited real-world exposure'],
  ['Performance marketing', 'ROI-driven marketing, scaling campaigns and data decisions', 'Surface-level understanding'],
  ['Specialisation', 'Focused tracks in performance marketing, content and growth', 'Generic curriculum'],
  ['Learning approach', 'Execution-first: doing, not just understanding', 'Lecture- and notes-based'],
];

function LatestPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    supabase.from('blogs').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => setPosts(data || []))
      .catch(() => {});
  }, []);
  if (!posts.length) return null;
  return (
    <section className="tz-band">
      <div className="tz-wrap">
        <h2 className="tz-h2">Latest from the blog</h2>
        <p className="tz-intro">Guides on digital marketing, AI tools and careers in Nagpur.</p>
        <div className="tz-posts">
          {posts.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}/`} className="tz-post">
              {p.cover_image && <img src={p.cover_image} alt="" loading="lazy" />}
              <div>
                <h3>{p.title}</h3>
                {p.excerpt && <p>{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 20 }}><Link to="/blog/" className="tz-btn tz-btn-light">All articles</Link></p>
      </div>
    </section>
  );
}

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <GlobalSeo />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_SCHEMA) }} />
      <div className="tz">
        <TzHeader />
        <main>
          {/* Hero */}
          <section className="tz-wrap tz-hero">
            <div>
              <span className="tz-badge">No. 1 digital marketing institute in Nagpur</span>
              <h1>Best Digital Marketing Course in Nagpur</h1>
              <p className="tz-lead">
                Nagpur's most practical <strong>digital marketing course in Nagpur</strong>. Learn SEO, Google Ads, Meta Ads,
                social media and content — with AI built into every module, live projects, expert mentors and placement support.
              </p>
              <p className="tz-rating"><span aria-hidden="true">★★★★★</span>5.0 on Google · 90+ reviews</p>
              <div className="tz-chips">
                <span>3 months</span><span>₹25,000 + GST</span><span>Free demo class</span><span>Classroom + live online</span>
              </div>
              <AskBox />
              <p className="tz-areas">Serving students across Nagpur — Dharampeth, Sitabuldi, Ramdaspeth, Sadar, Civil Lines, Pratap Nagar and online.</p>
            </div>
            <AdmissionForm source="homepage-free-demo" />
          </section>

          {/* Highlights */}
          <section className="tz-wrap" style={{ paddingBottom: 'clamp(48px,6vw,80px)' }} aria-labelledby="hl">
            <h2 id="hl" className="tz-h2" style={{ fontSize: 'clamp(28px,3.6vw,40px)', marginBottom: 22 }}>Course highlights</h2>
            <div className="tz-hl">
              <div><b>3 months</b><span>72 sessions, from basics to live campaigns</span></div>
              <div><b>Classroom + online</b><span>Chhatrapati Square or live online</span></div>
              <div><b>Live client projects</b><span>Build real work for your portfolio</span></div>
              <div><b>Career support</b><span>3 weeks of interview preparation</span></div>
            </div>
          </section>

          <MediaBlock />

          {/* Placement facts */}
          <section className="tz-facts" aria-label="Placements at a glance">
            <div className="tz-wrap tz-grid">
              <div><b>100%</b><small>Placement assistance</small></div>
              <div><b>₹3.5 LPA</b><small>Average package</small></div>
              <div><b>₹8.5 LPA</b><small>Highest package</small></div>
              <div><b>100+</b><small>Marketing and AI tools</small></div>
            </div>
          </section>

          {/* About the program */}
          <section className="tz-band" id="about">
            <div className="tz-wrap">
              <p className="tz-kicker">About the program</p>
              <h2 className="tz-h2" style={{ marginBottom: 24 }}>A practical, job-oriented digital marketing course in Nagpur</h2>
              <div className="tz-prose">
                <p>Telzon Academy offers one of the most practical and job‑oriented digital marketing courses in Nagpur. The curriculum is designed for students, working professionals and business owners who want real‑world skills in SEO, social media marketing, Google Ads, Meta Ads, content marketing, analytics and AI.</p>
                <p>If you are searching for the best digital marketing academy near me, Telzon Academy gives you a classroom learning experience at Chhatrapati Square with live projects, assignments and personal guidance. We focus on hands‑on practice so you can confidently apply digital marketing strategies in real businesses.</p>
                <p>The course covers everything from marketing and branding basics to advanced strategies, including landing pages and conversion optimisation, lead generation, paid advertising, AEO and GEO for AI search, and automation. Whether you are a beginner or upgrading your skills, it prepares you to be industry‑ready.</p>
              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="tz-band tz-soft" id="courses">
            <div className="tz-wrap">
              <h2 className="tz-h2">Our courses</h2>
              <p className="tz-intro">Two programs, both with a free demo class. AI marketing is part of the Digital Marketing & AI course.</p>
              <div className="tz-cards tz-cards-2">
                <a className="tz-card" href="/pages/digital-marketing-course-in-nagpur/">
                  <h3>Digital Marketing & AI</h3>
                  <p>Marketing, branding, content, SEO, AEO/GEO, Google Ads, Meta Ads, a live project and interview preparation — with AI marketing built in: ChatGPT, Claude, ElevenLabs, HeyGen, AI search and automation.</p>
                  <div className="tz-meta"><span>3 months</span><span>₹25,000 + GST</span></div>
                </a>
                <a className="tz-card" href="/pages/commercial-ads-and-photography-course-in-nagpur/">
                  <h3>Commercial Ads & Photography</h3>
                  <p>Product, fashion and food shoots, ad film production, editing in Lightroom, Photoshop, Premiere and DaVinci, and AI tools.</p>
                  <div className="tz-meta"><span>90 days</span><span>₹48,000 + GST</span><span>New</span></div>
                </a>
              </div>
            </div>
          </section>

          {/* Curriculum */}
          <section className="tz-band" id="curriculum">
            <div className="tz-wrap">
              <h2 className="tz-h2">Curriculum at the best digital marketing academy near me</h2>
              <p className="tz-intro">3 months · {COURSE_FORMAT.summary}. Each session: {COURSE_FORMAT.session}. Interview and career preparation is included in the 3 months.</p>
              <CurriculumList />
            </div>
          </section>

          {/* AI skills */}
          <section className="tz-band" id="skills" style={{ paddingTop: 0 }}>
            <div className="tz-wrap">
              <h2 className="tz-h2">AI-powered digital marketing: the latest skills</h2>
              <p className="tz-intro">Hands-on with the AI tools marketers are adopting in 2026 and 2027.</p>
              <div className="tz-skills">
                <article><h3>Video editing with Claude</h3><p>Create a cut list, captions and B-roll plan from a transcript, then apply the edits and export a reel in your editor.</p></article>
                <article><h3>Content automation with ChatGPT, ElevenLabs and HeyGen</h3><p>Turn one brief into multiple scripted, voiced video drafts. Check accuracy and production quality before scheduling.</p></article>
                <article><h3>Meta Ads with Claude in Chrome</h3><p>Review Ads Manager settings, diagnose results and plan an ad test. A person approves the campaign and spend.</p></article>
                <article><h3>AEO and GEO for AI search</h3><p>Write direct answers and original evidence so your pages are found in Google AI Overviews, ChatGPT and Perplexity.</p></article>
                <article><h3>Marketing automation</h3><p>Send enquiries to a CRM or Sheet, trigger WhatsApp and email follow-ups, and check for duplicates and failed steps.</p></article>
              </div>
            </div>
          </section>

          {/* Practical learning */}
          <section className="tz-band tz-soft" id="practical">
            <div className="tz-wrap">
              <h2 className="tz-h2">Practical digital marketing courses in Nagpur</h2>
              <p className="tz-intro">We believe in learning by doing. You get hands-on experience from day one.</p>
              <div className="tz-mods">
                <article><h3>Hands-on projects</h3><p>Work on real-world campaigns and build a portfolio that shows employers what you can do.</p></article>
                <article><h3>Live sessions</h3><p>Interactive classes with industry practitioners who share their practical experience.</p></article>
                <article><h3>Certification</h3><p>An industry-recognised certificate plus Google Ads, Analytics and Meta certification prep.</p></article>
                <article><h3>Job-ready skills</h3><p>The exact skills companies look for in digital marketing professionals.</p></article>
                <article><h3>Tool-based learning</h3><p>Master ChatGPT, Semrush, Google Ads, Meta Ads Manager and 100+ other tools.</p></article>
                <article><h3>Live project</h3><p>A real business brief, tracking, launch and a client-ready report for your portfolio.</p></article>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="tz-band" id="why-telzon">
            <div className="tz-wrap">
              <h2 className="tz-h2">Telzon Academy vs other institutes</h2>
              <p className="tz-intro">What sets this program apart.</p>
              <div className="tz-compare">
                <div className="tz-row tz-head"><span /><span>Telzon Academy</span><span>Other institutes</span></div>
                {COMPARE.map(([k, us, them]) => (
                  <div className="tz-row" key={k}><b>{k}</b><span className="tz-us">{us}</span><span className="tz-them">{them}</span></div>
                ))}
              </div>
            </div>
          </section>

          {/* Mentorship */}
          <section className="tz-band tz-black" id="mentor">
            <div className="tz-wrap">
              <div className="tz-two">
                <div>
                  <h2 className="tz-h2">Mentorship from someone who does this every day</h2>
                  <p className="tz-body">Your mentor comes from a marketing background with more than 10 years in the industry and has worked with over 150 brands. You learn the methods used with real clients, now powered by AI — and you're never alone in your learning journey.</p>
                </div>
                <div className="tz-stats">
                  <div><b>10+</b><small>Years in marketing</small></div>
                  <div><b>150+</b><small>Brands worked with</small></div>
                </div>
              </div>
              <div className="tz-list3">
                <div><h3>Expert mentors</h3><p>Professionals with 10+ years in digital marketing and brand building.</p></div>
                <div><h3>1-on-1 guidance</h3><p>Personal feedback and support to overcome challenges and learn faster.</p></div>
                <div><h3>Career support</h3><p>Résumé building, interview preparation and job placement assistance.</p></div>
              </div>
            </div>
          </section>

          <LatestPosts />

          <FaqBlock faqs={HOME_FAQS} title="Frequently asked questions" />

          <AreasBlock />

          <CtaBand title="Ready to transform your career?" text="Join hundreds of students who have kickstarted their digital marketing careers with Telzon Academy. Apply in under a minute and we'll call you back." />
        </main>
        <TzFooter />
      </div>
    </>
  );
}
