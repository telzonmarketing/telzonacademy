// Shared building blocks for the Telzon Academy site design (black & white).
// Styles: src/styles/tz.css (everything is scoped under the .tz class).
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { submitLead, firePixelSchedule } from '@/lib/leadSubmit';
import { landingPages } from '@/pages/landingPagesConfig';
import { SYLLABUS, COURSE_FORMAT } from '@/data/syllabus';

export const PHONE = '+91 93071 89776';
export const PHONE_TEL = '+919307189776';
export const EMAIL = 'connect@telzonacademy.in';
export const WHATSAPP = 'https://wa.me/919307189776';
export const MAP_URL = 'https://share.google/84JWzWeKpyNvvUnG2';

export const NAGPUR_AREAS = [
  'Dharampeth', 'Sitabuldi', 'Ramdaspeth', 'Sadar', 'Civil Lines',
  'Pratap Nagar', 'Itwari', 'Gandhibagh', 'Wardhaman Nagar', 'Manewada',
  'Hingna', 'Amravati Road', 'Wardha Road', 'Katol Road', 'Kamptee Road',
  'Narendra Nagar', 'Deo Nagar', 'Dhantoli', 'Jaitala', 'Ayodhya Nagar', 'Dighori',
];
const SLUGS = new Set(landingPages.map((p) => p.slug));
export const areaSlug = (area) => {
  const s = `digital-marketing-course-in-${area.toLowerCase().replace(/\s+/g, '-')}-nagpur`;
  return SLUGS.has(s) ? s : null;
};

// ─── Header ────────────────────────────────────────────────────────────────
export function TzHeader() {
  const openMap = () => {
    firePixelSchedule();
    window.open(MAP_URL, '_blank', 'noopener');
  };
  return (
    <header className="tz tz-header">
      <div className="tz-wrap tz-bar">
        <a href="/" aria-label="Telzon Academy — home">
          <img src="/telzon-logo-black-512.png" alt="Telzon Academy" width="112" height="34" loading="eager" />
        </a>
        <nav className="tz-nav" aria-label="Main">
          <a className="tz-link" href="/pages/digital-marketing-course-in-nagpur/">Courses</a>
          <a className="tz-link" href="/pages/digital-marketing-course-fees-in-nagpur/">Fees</a>
          <a className="tz-link" href="/pages/commercial-ads-and-photography-course-in-nagpur/">Photography</a>
          <a className="tz-link" href="/careers/best-career-options-2027/">Career Guide</a>
          <a className="tz-link" href="/pages/digital-marketing-course-nagpur-questions-answered/">FAQ</a>
          <a className="tz-link" href="/blog/">Blog</a>
          <button type="button" className="tz-link" onClick={openMap}>Location</button>
          <a className="tz-btn tz-btn-dark" style={{ minHeight: 44, padding: '0 20px' }} href="/lead-generation-package/">Free demo</a>
        </nav>
      </div>
    </header>
  );
}

// ─── Footer (all course + every locality page linked) ──────────────────────
const FOOTER_COURSES = [
  ['digital-marketing-course-in-nagpur', 'Digital Marketing Course in Nagpur'],
  ['ai-marketing-course-in-nagpur', 'AI Marketing (part of Digital Marketing & AI)'],
  ['commercial-ads-and-photography-course-in-nagpur', 'Commercial Ads & Photography Course'],
  ['photography-course-in-nagpur', 'Photography Course'],
  ['product-photography-course-in-nagpur', 'Product Photography Course'],
  ['videography-and-ad-film-making-course-in-nagpur', 'Videography & Ad Film Making'],
  ['video-editing-course-in-nagpur', 'Video Editing Course'],
  ['content-creator-course-in-nagpur', 'Content Creator Course'],
  ['best-digital-marketing-course-in-nagpur', 'Best Digital Marketing Course in Nagpur'],
  ['digital-marketing-institute-in-nagpur', 'Digital Marketing Institute in Nagpur'],
  ['seo-course-in-nagpur', 'SEO Course in Nagpur'],
  ['google-ads-course-nagpur', 'Google Ads Course in Nagpur'],
  ['performance-marketing-course-nagpur', 'Performance Marketing Course'],
  ['social-media-marketing-course-nagpur', 'Social Media Marketing Course'],
  ['content-marketing-course-nagpur', 'Content Marketing Course'],
  ['whatsapp-marketing-course-in-nagpur', 'WhatsApp Marketing Course'],
];
const FOOTER_INSTITUTE = [
  ['digital-marketing-course-nagpur-questions-answered', '20 Questions Answered'],
  ['local-seo-and-google-business-profile-course-in-nagpur', 'Local SEO & Google Business Profile'],
  ['aeo-geo-ai-search-optimisation-course-in-nagpur', 'AEO & GEO (AI search)'],
  ['branding-and-advertising-course-in-nagpur', 'Branding & Advertising'],
  ['influencer-marketing-course-in-nagpur', 'Influencer Marketing'],
  ['freelancing-digital-marketing-course-in-nagpur', 'Freelancing Skills'],
  ['digital-marketing-course-for-business-owners-in-nagpur', 'For Business Owners'],
  ['digital-marketing-course-fees-in-nagpur', 'Course Fees in Nagpur'],
  ['digital-marketing-course-with-placement-nagpur', 'Course with Placement Assistance'],
  ['digital-marketing-course-for-beginners-nagpur', 'Course for Beginners'],
  ['weekend-digital-marketing-course-in-nagpur', 'Weekend Course'],
  ['online-digital-marketing-course-nagpur', 'Online Course'],
];

export function TzFooter() {
  return (
    <footer className="tz tz-footer">
      <div className="tz-wrap">
        <div className="tz-fgrid">
          <div>
            <img src="/telzon-logo-black-512.png" alt="Telzon Academy" width="125" height="38" loading="lazy" />
            <div>Chhatrapati Square, Nagpur, Maharashtra</div>
            <a href={`tel:${PHONE_TEL}`} style={{ marginTop: 8 }}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div style={{ marginTop: 8 }}>Mon–Sat, 9 AM – 8 PM</div>
          </div>
          <nav aria-label="Courses">
            <h4>Courses</h4>
            {FOOTER_COURSES.filter(([s]) => SLUGS.has(s)).map(([s, label]) => (
              <a key={s} href={`/pages/${s}/`}>{label}</a>
            ))}
          </nav>
          <nav aria-label="Areas in Nagpur">
            <h4>Classes near you in Nagpur</h4>
            {NAGPUR_AREAS.map((a) => {
              const s = areaSlug(a);
              return s ? <a key={a} href={`/pages/${s}/`}>{a}</a> : null;
            })}
          </nav>
          <nav aria-label="Institute">
            <h4>Institute</h4>
            {FOOTER_INSTITUTE.filter(([s]) => SLUGS.has(s)).map(([s, label]) => (
              <a key={s} href={`/pages/${s}/`}>{label}</a>
            ))}
            <a href="/blog/">Blog</a>
            <a href="/careers/best-career-options-2027/">Career Guide 2027</a>
            <a href="/careers/ai-creative-strategist/">AI Creative Strategist career</a>
            <a href="/careers/ai-search-visibility-specialist/">GEO / AI search career</a>
            <a href="/careers/ai-marketing-automation-specialist/">Marketing automation career</a>
            <a href="/lead-generation-package/">Book a free demo</a>
            <a href="https://www.telzonmarketing.in/telzon-best-digital-marketing-agency-nagpur.html" target="_blank" rel="noopener">Telzon Marketing — agency</a>
          </nav>
        </div>
        <div className="tz-copy">
          <span>© {new Date().getFullYear()} Telzon Academy, Nagpur. All rights reserved.</span>
          <span>Digital marketing, AI and commercial photography courses in Nagpur</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Admission form → existing submit-lead backend ─────────────────────────
export function AdmissionForm({ source = 'website', title = 'Apply for admission', sub = "Book a free demo class. We'll call you back.", headingLevel = 'h2', id = 'apply' }) {
  const { toast } = useToast();
  const [f, setF] = useState({ name: '', email: '', phone: '', area: '', website: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const H = headingLevel;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return; // honeypot
    const phone = f.phone.replace(/\D/g, '').slice(-10);
    if (!f.name.trim()) return setErr('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setErr('Please enter a valid email address.');
    if (phone.length !== 10) return setErr('Please enter a 10-digit mobile number.');
    setErr('');
    setBusy(true);
    const { ok, error } = await submitLead({
      full_name: f.name.trim(),
      email: f.email.trim(),
      phone,
      message: f.area.trim() ? `Area: ${f.area.trim()}, Nagpur` : undefined,
      source,
      website: f.website,
    });
    setBusy(false);
    if (!ok) {
      toast({ title: 'Could not send your details', description: error || `Please call ${PHONE}.`, variant: 'destructive', duration: 6000 });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="tz-form tz-done" id={id}>
        <H>Thank you!</H>
        <p>Our admissions team will call you shortly to book your free demo class.</p>
        <a className="tz-btn tz-btn-dark" href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Telzon Academy, I just applied on the website. My name is ${f.name}.`)}`} target="_blank" rel="noopener">Chat on WhatsApp</a>
      </div>
    );
  }

  return (
    <form className="tz-form" id={id} onSubmit={submit} noValidate>
      <H>{title}</H>
      <p className="tz-sub">{sub}</p>
      <label className="tz-field">Full name
        <input name="name" type="text" autoComplete="name" placeholder="Your name" value={f.name} onChange={set('name')} required />
      </label>
      <label className="tz-field">Email
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set('email')} required />
      </label>
      <label className="tz-field">Mobile number
        <input name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" maxLength={14} value={f.phone} onChange={set('phone')} required />
      </label>
      <label className="tz-field">Your area in Nagpur (optional)
        <input name="area" type="text" placeholder="e.g. Dharampeth, Pratap Nagar" value={f.area} onChange={set('area')} />
      </label>
      <div className="tz-hp" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label>
      </div>
      {err && <p className="tz-err" role="alert">{err}</p>}
      <button className="tz-btn tz-btn-dark" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Book free demo class'}</button>
      <p className="tz-note">Or call / WhatsApp <a href={`tel:${PHONE_TEL}`}><b>{PHONE}</b></a></p>
    </form>
  );
}

// ─── Ask about the course ──────────────────────────────────────────────────
const KB = [
  { k: ['fee', 'price', 'cost', 'kitni', 'emi', 'gst', 'pay'], t: 'Course fees', a: 'The Digital Marketing & AI course is ₹25,000 + GST for 3 months, with no-cost EMI. The Commercial Ads & Photography course is ₹48,000 + GST for 90 days.' },
  { k: ['demo', 'trial', 'visit'], t: 'Free demo class', a: `Book a free demo with the trainer before you enrol — use the admission form or call ${PHONE}.` },
  { k: ['ai', 'chatgpt', 'claude', 'heygen', 'elevenlabs', 'tool', 'automation', 'gemini'], t: 'AI skills', a: 'You use ChatGPT, Claude, ElevenLabs and HeyGen for content, video, ads, SEO and automation — 50+ tools in guided practice, on live projects.' },
  { k: ['duration', 'long', 'month', 'week', 'time', 'batch', 'weekend', 'timing', 'session', 'schedule'], t: 'Duration and batches', a: `3 months: ${COURSE_FORMAT.summary}. Weekday and weekend batches, in the Nagpur classroom or live online.` },
  { k: ['where', 'address', 'location', 'near', 'centre', 'center', 'square', 'phone', 'number', 'contact'], t: 'Location and contact', a: `Chhatrapati Square, Nagpur. Call or WhatsApp ${PHONE}. Open Mon–Sat, 9 AM – 8 PM.` },
  { k: ['placement', 'job', 'career', 'salary', 'interview', 'resume', 'package'], t: 'Placements and careers', a: 'Placement assistance with 50+ hiring partners, an average package of ₹3.5 LPA, and 3 weeks of interview and career preparation inside the course.' },
  { k: ['photo', 'photography', 'camera', 'video', 'film', 'shoot', 'commercial'], t: 'Commercial Ads & Photography', a: '90 days, ₹48,000 + GST: camera and lighting, product, fashion and food shoots, ad films, editing and AI tools, ending with a live brand shoot.' },
  { k: ['seo', 'google', 'meta', 'ads', 'syllabus', 'curriculum', 'learn', 'module', 'topic', 'aeo', 'geo'], t: 'What you learn', a: 'Marketing and branding, content, SEO, AEO and GEO, AI workflows, automation, Google Ads, Meta Ads, a live project and interview preparation.' },
  { k: ['mentor', 'trainer', 'teacher', 'faculty'], t: 'Your mentor', a: 'Learn from a practitioner with 10+ years in marketing who has worked with 150+ brands.' },
  { k: ['online', 'offline', 'classroom'], t: 'Classroom or online', a: 'Attend in the Chhatrapati Square classroom or join the live online batch.' },
];

export function AskBox() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState(null);
  const answer = (text) => {
    const t = text.toLowerCase().trim();
    if (!t) return;
    const words = t.split(/[^a-z0-9]+/);
    const hit = KB.find((e) => e.k.some((w) => words.some((x) => x.startsWith(w))));
    const wa = `${WHATSAPP}?text=${encodeURIComponent(`Hi Telzon Academy, ${text}`)}`;
    setAns(hit ? { t: hit.t, a: hit.a, wa } : { t: 'Ask our team', a: `We'll answer this personally. Call ${PHONE}, or send it on WhatsApp.`, wa });
  };
  return (
    <form className="tz-ask" role="search" aria-label="Ask about the course" onSubmit={(e) => { e.preventDefault(); answer(q); }}>
      <div className="tz-askbox">
        <label htmlFor="tz-q" className="tz-hp">Ask about the course</label>
        <input id="tz-q" type="text" placeholder="Ask about the course…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit">Ask</button>
      </div>
      <div className="tz-quick">
        {['AI skills', 'Course fees', 'Free demo'].map((x, i) => (
          <React.Fragment key={x}>
            {i > 0 && <span aria-hidden="true">·</span>}
            <button type="button" onClick={() => { setQ(x); answer(x); }}>{x}</button>
          </React.Fragment>
        ))}
      </div>
      {ans && (
        <div className="tz-answer" aria-live="polite">
          <b>{ans.t}</b>{ans.a} <a href={ans.wa} target="_blank" rel="noopener">Ask more on WhatsApp</a>
        </div>
      )}
    </form>
  );
}

// ─── Curriculum (weeks grouped by month) ───────────────────────────────────
export function CurriculumList({ modules = SYLLABUS }) {
  let lastMonth = null;
  return (
    <div>
      {modules.map((m, i) => {
        const showMonth = m.month && m.month !== lastMonth;
        lastMonth = m.month || lastMonth;
        return (
          <React.Fragment key={i}>
            {showMonth && <p className="tz-month">{m.month}</p>}
            <div className="tz-weeks" style={showMonth || i === 0 ? undefined : { borderTop: 0 }}>
              <details className="tz-week" open={i === 0}>
                <summary>{m.week && <b>{m.week}</b>}<span>{m.topic}</span></summary>
                <ul>{m.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </details>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
export function FaqBlock({ faqs, title = 'Questions, answered', id = 'faq' }) {
  return (
    <section className="tz-band" id={id}>
      <div className="tz-wrap tz-faq">
        <div>
          <h2 className="tz-h2">{title}</h2>
          <p className="tz-intro" style={{ marginBottom: 0 }}>Anything else? Call {PHONE}, Mon–Sat, 9 AM – 8 PM.</p>
          <p style={{ marginTop: 16 }}><a href="/pages/digital-marketing-course-nagpur-questions-answered/" style={{ fontWeight: 600 }}>20 more questions answered →</a></p>
        </div>
        <div>
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Nagpur areas ──────────────────────────────────────────────────────────
export function AreasBlock({ keyword = 'Digital marketing course' }) {
  return (
    <section className="tz-band-sm" style={{ borderTop: '1.5px solid #000' }}>
      <div className="tz-wrap">
        <h2 className="tz-h2" style={{ fontSize: 'clamp(26px,3.4vw,36px)' }}>{keyword} near you in Nagpur</h2>
        <p className="tz-intro">Searching for a digital marketing course near me in Nagpur? Classes run at Chhatrapati Square, easy to reach from every part of the city, with weekday, weekend and live online batches. Pick your area for local details.</p>
        <div className="tz-pills">
          {NAGPUR_AREAS.map((a) => {
            const s = areaSlug(a);
            return s ? <a key={a} href={`/pages/${s}/`}>{a}</a> : null;
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Closing call to action ────────────────────────────────────────────────
export function CtaBand({ title = 'Seats for the next batch are limited.', text = 'Apply in under a minute and our team will call you back to plan your start.', link = true }) {
  return (
    <section className="tz-band tz-black tz-cta">
      <div className="tz-wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="tz-btns">
          <a className="tz-btn tz-btn-light" href="#apply">Apply now</a>
          <a className="tz-btn tz-btn-ghost" href={`${WHATSAPP}?text=${encodeURIComponent('Hello Telzon Academy, I want to enquire about the course')}`} target="_blank" rel="noopener">WhatsApp us</a>
        </div>
        <small>Limited seats · Placement assistance · Industry certification</small>
        {link && <small><Link to="/pages/digital-marketing-course-in-nagpur/" style={{ color: '#fff' }}>View the digital marketing course in Nagpur — full curriculum, fees and batches →</Link></small>}
      </div>
    </section>
  );
}

// ─── Real photos + video from Telzon Academy ───────────────────────────────
// Video is muted, loops, and only loads/plays when it scrolls into view so it
// never slows down the first screen.
export const MEDIA = {
  video: '/media/telzon-live-shoot.mp4',
  poster: '/media/telzon-live-shoot-poster.webp',
  photos: [
    { src: '/media/telzon-students-camera-setup.webp', alt: 'Telzon Academy students setting up a camera and studio light for a shoot in Nagpur' },
    { src: '/media/telzon-students-studio-lighting.webp', alt: 'Students at Telzon Academy Nagpur working with a camera slider, softboxes and a boom stand' },
  ],
};

function LazyVideo() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) { v.src = MEDIA.video; }
        v.loop = true;
        v.muted = true;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    }, { rootMargin: '200px' });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      onEnded={(e) => { e.currentTarget.currentTime = 0; e.currentTarget.play().catch(() => {}); }}
      className="tz-media-video"
      poster={MEDIA.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label="Telzon Academy students on a live commercial shoot at a café in Nagpur"
    />
  );
}

export function MediaBlock({ title = 'Inside Telzon Academy', text = 'Real classes, real shoots. Students plan, light and shoot a live commercial for a local café — the kind of hands-on work you do from week one.' }) {
  return (
    <section className="tz-band" aria-labelledby="tz-media-title">
      <div className="tz-wrap">
        <h2 id="tz-media-title" className="tz-h2">{title}</h2>
        <p className="tz-intro">{text}</p>
        <div className="tz-media">
          <figure>
            <LazyVideo />
            <figcaption>Live commercial shoot</figcaption>
          </figure>
          {MEDIA.photos.map((p) => (
            <figure key={p.src}>
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" width="900" height="1164" />
              <figcaption>{p.alt.replace(/^Telzon Academy students |^Students at Telzon Academy Nagpur /, '').replace(/^./, (c) => c.toUpperCase())}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// VideoObject structured data for the shoot video (video rich results).
export const VIDEO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Telzon Academy students on a live commercial shoot in Nagpur',
  description: 'Behind the scenes: Telzon Academy students light, set up and shoot a live commercial for a local café in Nagpur.',
  thumbnailUrl: ['https://telzonacademy.in/media/telzon-live-shoot-poster.webp'],
  uploadDate: '2026-11-27',
  duration: 'PT29S',
  contentUrl: 'https://telzonacademy.in/media/telzon-live-shoot.mp4',
  publisher: { '@type': 'Organization', name: 'Telzon Academy', url: 'https://telzonacademy.in' },
};
