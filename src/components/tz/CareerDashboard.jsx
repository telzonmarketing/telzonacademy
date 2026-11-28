// Career Intelligence dashboard (homepage hero). Approved standalone design,
// rebuilt as a React component that reads everything from src/data/careers.js
// (DASHBOARD). To add a career, technology or insight, edit DASHBOARD only.
//
// Behaviour (as approved): rotates every 8 s, Prev / Pause / Next, pauses when
// anything inside receives keyboard focus, stops when the tab is hidden and
// never auto-plays for prefers-reduced-motion. The assessment connects to the
// existing demo/counselling form (AdmissionForm → submitLead → CRM).
import React, { useEffect, useRef, useState } from 'react';
import { DASHBOARD, careerBySlug, careerPath, HUB_PATH, CAREERS } from '@/data/careers';
import { AdmissionForm } from '@/components/tz';
import { track } from '@/lib/track';

const D = DASHBOARD;
const pad = (n) => String(n).padStart(2, '0');
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CareerDashboard() {
  const cards = D.careers;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(() => !reducedMotion());
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [assessOpen, setAssessOpen] = useState(false);
  const [interest, setInterest] = useState(0);
  const [match, setMatch] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const root = useRef(null);
  const formWrap = useRef(null);

  const c = cards[i];
  const linkFor = (card) => (card.page && careerBySlug(card.page) ? careerPath(card.page) : null);

  // Rotation
  useEffect(() => {
    if (!playing || !visible) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % cards.length), D.rotateMs);
    return () => clearInterval(t);
  }, [playing, visible, i, cards.length]);

  // Tab visibility + reduced-motion changes
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const onMq = (e) => { if (e.matches) setPlaying(false); };
    mq?.addEventListener?.('change', onMq);
    return () => { document.removeEventListener('visibilitychange', onVis); mq?.removeEventListener?.('change', onMq); };
  }, []);

  // One "view" event when the dashboard is first seen
  useEffect(() => {
    if (!root.current || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { track('career_dashboard_view'); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // Links to #apply elsewhere on the page (header, CTA band) open the form here
  useEffect(() => {
    const open = () => {
      setFormOpen(true);
      setTimeout(() => {
        formWrap.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
        formWrap.current?.querySelector('input[name="name"]')?.focus({ preventScroll: true });
      }, 60);
    };
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href$="#apply"]');
      if (a && (a.getAttribute('href') === '#apply' || a.pathname === window.location.pathname)) { e.preventDefault(); open(); track('career_counselling_open', { via: 'page_link' }); }
    };
    const onHash = () => { if (window.location.hash === '#apply') open(); };
    onHash();
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('hashchange', onHash); };
  }, []);

  const move = (n) => { setI((x) => (x + n + cards.length) % cards.length); track('career_dashboard_nav', { action: n > 0 ? 'next' : 'prev' }); };
  const togglePlay = () => { setPlaying((p) => !p); track('career_dashboard_nav', { action: playing ? 'pause' : 'play' }); };
  // Pause when the user moves into the dashboard with the keyboard (as
  // approved). Mouse clicks are excluded so the Pause/Play button works.
  const onFocusIn = (e) => {
    let keyboard = true;
    try { keyboard = e.target.matches(':focus-visible'); } catch { /* old browsers: treat as keyboard */ }
    if (keyboard && playing) setPlaying(false);
  };

  const findMatch = () => {
    const a = D.assessment[interest];
    setMatch(a.card);
    track('career_assessment_match', { interest: a.label, career: cards[a.card].role });
  };
  const m = match !== null ? cards[match] : null;
  const openForm = (via) => { setFormOpen(true); track('career_counselling_open', { via, career: m ? m.role : undefined }); };

  return (
    <section className={`tzd${playing ? '' : ' paused'}`} id="career-dashboard" ref={root} onFocus={onFocusIn} aria-label="Career Intelligence — 2027 outlook">
      <header><span>{D.label}</span><span>{D.outlook}</span></header>
      <h2 className="tzd-h">{D.headline[0]}<br />{D.headline[1]}</h2>
      <p>{D.intro}</p>
      <div className="tzd-ticker">
        <span className="sr-only">Fields: {D.ticker.join(', ')}</span>
        <div className="tzd-track" aria-hidden="true">
          <span>{D.ticker.join(' / ')} / </span><span>{D.ticker.join(' / ')} / </span>
        </div>
      </div>

      <small>INDUSTRY INTELLIGENCE</small>
      <p className="tzd-insight reveal" key={`ins-${i}`}>{c.insight}</p>

      <div className="tzd-section tzd-sectionhead"><small>EMERGING CAREER SIGNALS</small><small>{pad(i + 1)} / {pad(cards.length)}</small></div>
      {cards.map((card, idx) => {
        const href = linkFor(card);
        return (
          <article className={`tzd-career${idx === i ? ' reveal' : ''}`} key={card.role} hidden={idx !== i}>
            <small>NEW &amp; EVOLVING FIELD</small>
            <h3>{card.field}</h3>
            <strong>{card.role}</strong>
            <p>{card.description}</p>
            <small>SKILLS YOU WILL NEED</small>
            <div className="tzd-skills">{card.skills.map((s) => <span key={s}>{s}</span>)}</div>
            {href && (
              <a className="tzd-more" href={href} onClick={() => track('career_click', { career: card.role, from: 'dashboard_card' })}>
                Explore the {card.role} career
              </a>
            )}
          </article>
        );
      })}

      <div className="tzd-progress"><div className="tzd-bar" key={`bar-${i}-${playing}-${visible}`} style={{ animation: playing && visible ? `tzd-progress ${D.rotateMs}ms linear forwards` : 'none' }} /></div>
      <div className="tzd-controls">
        <button type="button" onClick={() => move(-1)}>Prev</button>
        <button type="button" onClick={togglePlay} aria-pressed={!playing}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={() => move(1)}>Next</button>
      </div>

      <div className="tzd-section">
        <small>CAREER EVOLUTION</small>
        <p>{c.traditional_role}</p>
        <small>EVOLVING TOWARDS</small>
        <p className="tzd-role reveal" key={`role-${i}`}>{c.role}</p>
      </div>

      <div className="tzd-section">
        <small>TECHNOLOGY RADAR</small>
        <div className="tzd-radar">
          <span className="sr-only">Technologies: {D.technologies.join(', ')}</span>
          <div className="tzd-track" aria-hidden="true">
            <span>{D.technologies.join(' / ')} / </span><span>{D.technologies.join(' / ')} / </span>
          </div>
        </div>
      </div>

      <div className="tzd-statement"><small>THE NEXT GENERATION</small><p>{D.statement}</p></div>

      <button type="button" className="tzd-cta" aria-expanded={assessOpen} aria-controls="tzd-assessment"
        onClick={() => { setAssessOpen((o) => !o); if (!assessOpen) track('career_assessment_open'); }}>
        Discover My Future Career
      </button>
      <div id="tzd-assessment" className="tzd-section" hidden={!assessOpen}>
        <label htmlFor="tzd-interest">What interests you most?</label>
        <p>
          <select id="tzd-interest" value={interest} onChange={(e) => { setInterest(Number(e.target.value)); setMatch(null); }}>
            {D.assessment.map((a, k) => <option key={a.label} value={k}>{a.label}</option>)}
          </select>
        </p>
        <button type="button" onClick={findMatch}>Find My Career Match</button>
        <div aria-live="polite">
          {m && (
            <div className="tzd-result">
              <p>Suggested career: <b>{m.role}</b>. Start with: {m.skills.join(', ')}</p>
              <p>
                {linkFor(m) && <a href={linkFor(m)} onClick={() => track('career_click', { career: m.role, from: 'assessment' })}>Read the {m.role} guide</a>}
              </p>
              <button type="button" className="tzd-cta tzd-cta-sm" onClick={() => openForm('assessment')}>Book free career counselling</button>
            </div>
          )}
        </div>
      </div>

      <div id="apply" ref={formWrap} className="tzd-apply">
        {formOpen ? (
          <AdmissionForm
            id="apply-form"
            source="homepage-free-demo"
            headingLevel="h3"
            title={m ? 'Book free career counselling' : 'Book a free demo class'}
            sub={m ? `Talk to a counsellor about the ${m.role} path and book your free demo class.` : "Fill in your details. We'll call you back."}
            context={m ? `Career dashboard: interest "${D.assessment[interest].label}", suggested ${m.role}` : 'Career dashboard: demo request'}
            onSuccess={() => track('career_counselling_submit', { career: m ? m.role : undefined })}
          />
        ) : (
          <p className="tzd-alt">
            <button type="button" className="tzd-link" onClick={() => openForm('direct')}>Prefer to talk? Book a free demo class</button>
          </p>
        )}
      </div>

      <p className="tzd-footer">
        {D.footer}<br />
        <a href={HUB_PATH} onClick={() => track('career_click', { career: 'hub', from: 'dashboard_footer' })}>Explore all {CAREERS.length} careers</a>
      </p>
    </section>
  );
}
