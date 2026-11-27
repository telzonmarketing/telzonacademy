import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { TzHeader, TzFooter, AdmissionForm, PHONE, PHONE_TEL } from '@/components/tz';
import NotFoundPage from '@/pages/NotFoundPage';
import {
  GUIDE, GUIDE_SLUG, CAREERS, STATUS_LABEL, careerBySlug, careerPath, careerSchemas, COURSE_URL,
} from '@/data/careers';

const SITE = 'https://telzonacademy.in';
const SHARE = `${SITE}/media/telzon-academy-nagpur-share.jpg`;

function Head({ slug, title, description }) {
  const url = `${SITE}${careerPath(slug)}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
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

function Crumbs({ role }) {
  return (
    <nav className="tz-crumb" aria-label="Breadcrumb">
      <a href="/">Home</a> / {role ? <a href={careerPath(GUIDE_SLUG)}>Career Guide</a> : <span>Career Guide</span>}
      {role && <> / <span>{role}</span></>}
    </nav>
  );
}

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
      <p>The 3-month Digital Marketing &amp; AI course runs at Chhatrapati Square, Nagpur, with weekday, weekend and live online batches. Fee: ₹25,000 + GST, with no-cost EMI.</p>
      <div className="tz-btns">
        <a className="tz-btn tz-btn-dark" href="#apply">Book a Free Demo Class</a>
        <a className="tz-btn" href={COURSE_URL}>See the digital marketing course</a>
      </div>
      <div style={{ marginTop: 32 }}>
        <AdmissionForm source={source} title="Book a Free Demo Class" sub={`Our admissions team calls you back. Or call ${PHONE}.`} />
      </div>
    </section>
  );
}

function Guide() {
  const g = GUIDE;
  return (
    <>
      <Head slug={GUIDE_SLUG} title={g.title} description={g.metaDescription} />
      <article className="tz-wrap tz-art">
        <Crumbs />
        <span className="tz-badge">Career guide · updated November 2026</span>
        <h1>{g.h1}</h1>
        <p className="tz-lead">{g.opening}</p>

        <section className="tz-art-sec">
          <h2>Compare six AI and marketing careers</h2>
          <div className="tz-ctable" role="table" aria-label="Six AI and marketing careers compared">
            <div className="tz-crow tz-chead" role="row">
              <span role="columnheader">Career</span><span role="columnheader">Who it suits</span>
              <span role="columnheader">Core skill</span><span role="columnheader">Status</span>
            </div>
            {CAREERS.map((c) => (
              <div className="tz-crow" role="row" key={c.slug}>
                <span role="cell" data-l="Career"><a href={careerPath(c.slug)}><strong>{c.role}</strong></a></span>
                <span role="cell" data-l="Who it suits">{c.suits}</span>
                <span role="cell" data-l="Core skill">{c.coreSkill}</span>
                <span role="cell" data-l="Status"><em className={`tz-status tz-status-${c.status}`}>{STATUS_LABEL[c.status]}</em></span>
                <span role="cell" className="tz-cmore"><a href={careerPath(c.slug)}>Read the {c.role} guide →</a></span>
              </div>
            ))}
          </div>
        </section>

        <section className="tz-art-sec">
          <h2>Which career fits your strengths?</h2>
          <ul className="tz-fit">
            {g.fit.map(([k, why, slug]) => {
              const c = careerBySlug(slug);
              return (
                <li key={slug}>
                  <strong>{k}</strong> → <a href={careerPath(slug)}>{c.role}</a>
                  <span>{why}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="tz-art-sec">
          <h2>What should beginners learn first?</h2>
          <p>Every career on this page sits on the same marketing foundation. Learn these five first — AI makes each one faster, but it can’t choose for you.</p>
          <ol className="tz-steps">
            {g.foundation.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}
          </ol>
          <p>Then follow a learning path:</p>
          <ul>
            {CAREERS.map((c) => <li key={c.slug}><a href={`${careerPath(c.slug)}#roadmap`}>{c.role} — beginner roadmap</a></li>)}
          </ul>
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
        <Crumbs role={c.role} />
        <span className={`tz-badge tz-status-${c.status}`}>{STATUS_LABEL[c.status]}</span>
        <h1>{c.h1}</h1>
        <p className="tz-lead">{c.answer}</p>

        <section className="tz-art-sec">
          <h2>What you do on the job</h2>
          <ul className="tz-steps">
            {c.tasks.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}
          </ul>
        </section>

        <section className="tz-art-sec">
          <h2>Skills and tools</h2>
          <dl className="tz-pairs">
            {c.tools.map(([t, task]) => <React.Fragment key={t}><dt>{t}</dt><dd>{task}</dd></React.Fragment>)}
          </dl>
          {c.googleNote && (
            <p className="tz-note">{c.googleNote} Source: <a href={c.googleSource.url} target="_blank" rel="noopener">{c.googleSource.label}</a>.</p>
          )}
        </section>

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
          <dl className="tz-pairs tz-pairs-box">
            {c.example.rows.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}
          </dl>
          <p className="tz-note">{c.example.note}</p>
        </section>

        <section className="tz-art-sec">
          <h2>Where to look for work</h2>
          <p>{c.status === 'emerging'
            ? `${c.role} is an emerging specialization. Today the work usually sits inside these job titles — search them:`
            : `Search for these related job titles:`}</p>
          <ul className="tz-pills-list">{c.titles.map((t) => <li key={t}>{t}</li>)}</ul>
          <ul>
            {c.searchLinks.map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noopener nofollow">{l.label}</a></li>)}
            {c.hiring.map((h) => <li key={h.url}><a href={h.url} target="_blank" rel="noopener nofollow">{h.label}</a> <small>(listings close over time)</small></li>)}
          </ul>
        </section>

        <Faqs faqs={c.faqs} />

        <section className="tz-art-sec">
          <h2>Next step</h2>
          <ul>
            <li><a href={careerPath(GUIDE_SLUG)}>Compare all six careers in the 2027 career guide</a></li>
            {others.map((o) => <li key={o.slug}><a href={careerPath(o.slug)}>{o.h1}</a></li>)}
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
  const c = careerBySlug(slug);
  if (slug !== GUIDE_SLUG && !c) return <NotFoundPage />;
  return (
    <div className="tz">
      <TzHeader />
      <main>{slug === GUIDE_SLUG ? <Guide /> : <Career c={c} />}</main>
      <p className="tz-wrap" style={{ fontSize: 13, color: '#666', paddingBottom: 24 }}>
        Questions? Call <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>, Mon–Sat, 9 AM – 8 PM.
      </p>
      <TzFooter />
    </div>
  );
}
