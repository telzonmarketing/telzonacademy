import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { TzHeader, TzFooter, AdmissionForm, PHONE, PHONE_TEL } from '@/components/tz';
import NotFoundPage from '@/pages/NotFoundPage';
import { track } from '@/lib/track';
import {
  GUIDE, GUIDE_SLUG, GUIDE_SIX, CAREERS, HUB, HUB_PATH, AUTHOR, CAREERS_UPDATED, STATUS_LABEL,
  careerBySlug, careerPath, careerSchemas, COURSE_URL,
} from '@/data/careers';

const SITE = 'https://telzonacademy.in';
const SHARE = `${SITE}/media/telzon-academy-nagpur-share.jpg`;
const UPDATED_LABEL = new Date(`${CAREERS_UPDATED}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

function Head({ slug, title, description }) {
  const url = `${SITE}${careerPath(slug)}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={SHARE} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="Telzon Academy" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={SHARE} />
      {careerSchemas(slug).map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}

function Crumbs({ label }) {
  return (
    <nav className="tz-crumb" aria-label="Breadcrumb">
      <a href="/">Home</a> / {label ? <a href={HUB_PATH}>Careers</a> : <span>Careers</span>}
      {label && <> / <span>{label}</span></>}
    </nav>
  );
}

const Byline = () => <p className="tz-byline">By {AUTHOR} · Updated {UPDATED_LABEL}</p>;

function Faqs({ faqs }) {
  return (
    <section className="tz-art-sec" id="faq">
      <h2>Frequently asked questions</h2>
      {faqs.map((f, i) => (
        <details key={f.q} open={i < 2}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}

function Demo({ source, text }) {
  return (
    <section className="tz-art-sec tz-art-cta">
      <h2>Learn these skills at Telzon Academy</h2>
      <p>{text}</p>
      <p>The 3-month Digital Marketing &amp; AI course runs at Chhatrapati Square, Nagpur, with weekday, weekend and live online batches. Fee: ₹25,000 + GST.</p>
      <div className="tz-btns">
        <a className="tz-btn tz-btn-dark" href="#apply">Book a Free Demo Class</a>
        <a className="tz-btn" href={COURSE_URL}>See the digital marketing course</a>
      </div>
      <div style={{ marginTop: 32 }}>
        <AdmissionForm source={source} title="Book a Free Demo Class" sub={`Our admissions team calls you back. Or call ${PHONE}.`}
          onSuccess={() => track('career_counselling_submit', { from: source })} />
      </div>
    </section>
  );
}

const CareerLink = ({ c, from, children }) => (
  <a href={careerPath(c.slug)} onClick={() => track('career_click', { career: c.role, from })}>{children || c.role}</a>
);

function Hub() {
  return (
    <>
      <Head slug="" title={HUB.title} description={HUB.metaDescription} />
      <article className="tz-wrap tz-art">
        <Crumbs />
        <span className="tz-badge">Career hub · {CAREERS.length} career paths</span>
        <h1>{HUB.h1}</h1>
        <Byline />
        <p className="tz-lead">{HUB.intro}</p>

        <nav className="tz-art-sec" aria-label="Career families">
          <h2>Explore careers by field</h2>
          <ul className="tz-fit">
            {HUB.groups.map((g) => <li key={g.name}><a href={`#${g.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}><strong>{g.name}</strong></a><span>{g.text}</span></li>)}
          </ul>
        </nav>

        {HUB.groups.map((g) => (
          <section className="tz-art-sec" key={g.name} id={g.name.toLowerCase().replace(/[^a-z]+/g, '-')}>
            <h2>{g.name}</h2>
            <p>{g.text}</p>
            <div className="tz-ctable" role="table" aria-label={g.name}>
              <div className="tz-crow tz-chead" role="row">
                <span role="columnheader">Career</span><span role="columnheader">Evolves from</span>
                <span role="columnheader">Core skill</span><span role="columnheader">Status</span>
              </div>
              {g.slugs.map(careerBySlug).map((c) => (
                <div className="tz-crow" role="row" key={c.slug}>
                  <span role="cell" data-l="Career"><CareerLink c={c} from="hub"><strong>{c.role}</strong></CareerLink></span>
                  <span role="cell" data-l="Evolves from">{c.evolvesFrom || '—'}</span>
                  <span role="cell" data-l="Core skill">{c.coreSkill}</span>
                  <span role="cell" data-l="Status"><em className={`tz-status tz-status-${c.status}`}>{STATUS_LABEL[c.status]}{c.technical ? ' · technical' : ''}</em></span>
                  <span role="cell" className="tz-cmore"><CareerLink c={c} from="hub">Read the {c.role} guide →</CareerLink></span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="tz-art-sec">
          <h2>The future of digital marketing</h2>
          {HUB.future.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          <p className="tz-note">Source: <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener">World Economic Forum, The Future of Jobs Report 2025</a>.</p>
        </section>

        <section className="tz-art-sec">
          <h2>AI skills for freshers: where to start</h2>
          <ol className="tz-steps">{HUB.freshers.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}</ol>
        </section>

        <section className="tz-art-sec">
          <h2>Which AI careers need extra technical training?</h2>
          <p>These roles go beyond a marketing course and usually need additional training in APIs, scripting or web development:</p>
          <ul>{CAREERS.filter((c) => c.technical).map((c) => <li key={c.slug}><CareerLink c={c} from="hub_technical" /> — {c.trainingNote}</li>)}</ul>
        </section>

        <section className="tz-art-sec">
          <h2>Careers more resilient to AI disruption</h2>
          <p>No career is guaranteed to be AI-proof. Roles built on decisions people still need to own are more resilient: choosing what to test, judging whether content is accurate, approving what is published and deciding when a customer needs a person. Read the <a href={careerPath(GUIDE_SLUG)}>best career options in 2027 guide</a> for a comparison of six starting paths.</p>
        </section>

        <Faqs faqs={HUB.faqs} />
        <Demo source="career-hub" text="The Digital Marketing & AI course builds the shared foundation for these careers — marketing, copywriting, landing pages, GA4, SEO, AEO and GEO, AI workflows with ChatGPT and Claude, no-code automation, and Google and Meta Ads — then a live project and interview preparation. Each career page says exactly which parts the course covers." />
      </article>
    </>
  );
}

function Guide() {
  const g = GUIDE;
  const six = GUIDE_SIX.map(careerBySlug);
  return (
    <>
      <Head slug={GUIDE_SLUG} title={g.title} description={g.metaDescription} />
      <article className="tz-wrap tz-art">
        <Crumbs label="Best Career Options in 2027" />
        <span className="tz-badge">Career guide · updated November 2026</span>
        <h1>{g.h1}</h1>
        <Byline />
        <p className="tz-lead">{g.opening}</p>

        <section className="tz-art-sec">
          <h2>Compare six AI and marketing careers</h2>
          <div className="tz-ctable" role="table" aria-label="Six AI and marketing careers compared">
            <div className="tz-crow tz-chead" role="row">
              <span role="columnheader">Career</span><span role="columnheader">Who it suits</span>
              <span role="columnheader">Core skill</span><span role="columnheader">Status</span>
            </div>
            {six.map((c) => (
              <div className="tz-crow" role="row" key={c.slug}>
                <span role="cell" data-l="Career"><CareerLink c={c} from="guide"><strong>{c.role}</strong></CareerLink></span>
                <span role="cell" data-l="Who it suits">{c.suits}</span>
                <span role="cell" data-l="Core skill">{c.coreSkill}</span>
                <span role="cell" data-l="Status"><em className={`tz-status tz-status-${c.status}`}>{STATUS_LABEL[c.status]}</em></span>
                <span role="cell" className="tz-cmore"><CareerLink c={c} from="guide">Read the {c.role} guide →</CareerLink></span>
              </div>
            ))}
          </div>
          <p>Looking for more options? <a href={HUB_PATH}>Explore all {CAREERS.length} emerging AI careers in the career hub</a>.</p>
        </section>

        <section className="tz-art-sec">
          <h2>Which career fits your strengths?</h2>
          <ul className="tz-fit">
            {g.fit.map(([k, why, slug]) => (
              <li key={slug}><strong>{k}</strong> → <CareerLink c={careerBySlug(slug)} from="guide_fit" /><span>{why}</span></li>
            ))}
          </ul>
        </section>

        <section className="tz-art-sec">
          <h2>What should beginners learn first?</h2>
          <p>Every career on this page sits on the same marketing foundation. Learn these five first — AI makes each one faster, but it can’t choose for you.</p>
          <ol className="tz-steps">{g.foundation.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}</ol>
          <p>Then follow a learning path:</p>
          <ul>{six.map((c) => <li key={c.slug}><a href={`${careerPath(c.slug)}#roadmap`}>{c.role} — beginner roadmap</a></li>)}</ul>
        </section>

        <section className="tz-art-sec">
          <h2>Are there any AI-proof careers in 2027?</h2>
          <p>{g.resilientAnswer}</p>
        </section>

        <Faqs faqs={g.faqs} />
        <Demo source="career-guide" text="The first month of the course covers the shared foundation — marketing, branding, copywriting, landing pages and measurement. Month two adds SEO, AEO and GEO, AI workflows with ChatGPT and Claude, no-code automation, and Google and Meta Ads. Month three is a live project and interview preparation." />
      </article>
    </>
  );
}

function Career({ c }) {
  const others = c.related.map(careerBySlug).filter(Boolean);
  return (
    <>
      <Head slug={c.slug} title={c.title} description={c.metaDescription} />
      <article className="tz-wrap tz-art">
        <Crumbs label={c.role} />
        <span className={`tz-badge tz-status-${c.status}`}>{STATUS_LABEL[c.status]}{c.technical ? ' · technical role' : ''}</span>
        <h1>{c.h1}</h1>
        <Byline />
        <p className="tz-lead">{c.answer}</p>
        {c.evolvesFrom && <p className="tz-note">Often evolves from: <strong>{c.evolvesFrom}</strong></p>}

        {c.whyEmerging && (
          <section className="tz-art-sec">
            <h2>Why this role is emerging</h2>
            <p>{c.whyEmerging}</p>
          </section>
        )}

        <section className="tz-art-sec">
          <h2>What you do on the job</h2>
          <ul className="tz-steps">{c.tasks.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}</ul>
        </section>

        {c.prerequisites && (
          <section className="tz-art-sec">
            <h2>Before you start</h2>
            <ul>{c.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        )}

        <section className="tz-art-sec">
          <h2>Skills and tools</h2>
          {c.skills && <ul className="tz-pills-list" aria-label="Key skills">{c.skills.map((s) => <li key={s}>{s}</li>)}</ul>}
          <dl className="tz-pairs">{c.tools.map(([t, task]) => <React.Fragment key={t}><dt>{t}</dt><dd>{task}</dd></React.Fragment>)}</dl>
          {c.googleNote && (
            <p className="tz-note">{c.googleNote} Source: <a href={c.googleSource.url} target="_blank" rel="noopener">{c.googleSource.label}</a>.</p>
          )}
          {c.technical && <p className="tz-callout"><strong>Technical role:</strong> {c.trainingNote}</p>}
        </section>

        {c.industries && (
          <section className="tz-art-sec">
            <h2>Industries that need this skill</h2>
            <ul className="tz-pills-list">{c.industries.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}

        {c.entryRoutes && (
          <section className="tz-art-sec">
            <h2>How freshers can get started</h2>
            <ul>{c.entryRoutes.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}

        <section className="tz-art-sec" id="roadmap">
          <h2>Beginner roadmap</h2>
          <ol className="tz-steps">
            <li><strong>Learn the marketing foundation.</strong> {c.roadmap.foundation}</li>
            <li><strong>Do a guided exercise.</strong> {c.roadmap.guided}</li>
            <li><strong>Build an independent portfolio project.</strong> {c.roadmap.project}</li>
          </ol>
        </section>

        <section className="tz-art-sec">
          <h2>{c.example.title}</h2>
          <dl className="tz-pairs tz-pairs-box">{c.example.rows.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>
          <p className="tz-note">{c.example.note}</p>
        </section>

        <section className="tz-art-sec">
          <h2>Where to look for work</h2>
          <p>{c.status === 'emerging'
            ? `${c.role} is an emerging specialization. Today the work usually sits inside these job titles — search them:`
            : 'Search for these related job titles:'}</p>
          <ul className="tz-pills-list">{c.titles.map((t) => <li key={t}>{t}</li>)}</ul>
          <ul>
            {c.searchLinks.map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noopener nofollow">{l.label}</a></li>)}
            {(c.hiring || []).map((h) => <li key={h.url}><a href={h.url} target="_blank" rel="noopener nofollow">{h.label}</a> <small>(listings close over time)</small></li>)}
          </ul>
        </section>

        <Faqs faqs={c.faqs} />

        {c.references && c.references.length > 0 && (
          <section className="tz-art-sec">
            <h2>References and further reading</h2>
            <ul>{c.references.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noopener">{r.label}</a></li>)}</ul>
          </section>
        )}

        <section className="tz-art-sec">
          <h2>Next step</h2>
          <ul>
            <li><a href={HUB_PATH}>Explore all {CAREERS.length} emerging AI careers</a></li>
            {others.map((o) => <li key={o.slug}><CareerLink c={o} from="related">{o.h1}</CareerLink></li>)}
            <li><a href={COURSE_URL}>Digital marketing course in Nagpur — Telzon Academy</a></li>
          </ul>
        </section>

        <Demo source={`career-${c.slug}`} text={c.telzon} />
      </article>
    </>
  );
}

export default function CareersPage() {
  const { slug } = useParams();
  const c = slug ? careerBySlug(slug) : null;
  if (slug && slug !== GUIDE_SLUG && !c) return <NotFoundPage />;
  return (
    <div className="tz">
      <TzHeader />
      <main>{!slug ? <Hub /> : slug === GUIDE_SLUG ? <Guide /> : <Career c={c} />}</main>
      <p className="tz-wrap" style={{ fontSize: 13, color: '#666', paddingBottom: 24 }}>
        Questions? Call <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>, Mon–Sat, 9 AM – 8 PM.
      </p>
      <TzFooter />
    </div>
  );
}
