// Telzon Academy — 3-month Digital Marketing & AI syllabus (12 weeks, 72 sessions).
// Single source for the course pages (LandingPage.jsx), the homepage curriculum
// (Curriculum.jsx) and the static/no-JS HTML + HowTo schema (tools/prerender.js).

export const COURSE_FORMAT = {
  summary: '12 weeks · 6 days a week · 72 sessions of 2½ hours',
  session: '45 minutes of concepts, 75 minutes of guided practice and 30 minutes of review',
  phases: 'Course and live project in days 1–54; interview and career preparation in days 55–72, included in the 3 months',
  tools: '50+ tools used in guided practice, plus a 100+ tool reference library',
};

export const SYLLABUS = [
  // ── Month 1 · Marketing, branding and content ──
  {
    month: 'Month 1 · Marketing, branding and content',
    week: 'Week 1',
    topic: 'Marketing foundations',
    items: [
      'Course introduction, career paths, learning outcomes and portfolio expectations',
      'What is marketing? Customer needs, value, demand and how marketing supports sales',
      'Segmentation, targeting, positioning, the marketing mix and the customer journey',
      'Branding: identity, positioning, brand promise, voice and consistency',
      'Branding vs. marketing: how each works and how they support each other',
      'Promotion and advertising: why they matter, how they differ and when to use each',
    ],
  },
  {
    month: 'Month 1 · Marketing, branding and content',
    week: 'Week 2',
    topic: 'Total marketing, traditional channels and buyer psychology',
    items: [
      'Total marketing: product, pricing, distribution, communication and customer experience working together',
      'Traditional marketing: print, outdoor, radio, TV, events, direct mail and in-store promotion',
      'Message, medium, reach, frequency, timing, budget and response tracking',
      'Marketing psychology used ethically: motivation, trust, social proof, urgency and price anchoring',
      'Market research, competitor analysis, buyer personas and offer design',
      'Practical: an integrated traditional + digital campaign brief for a local business',
    ],
  },
  {
    month: 'Month 1 · Marketing, branding and content',
    week: 'Week 3',
    topic: 'Internet and digital marketing fundamentals',
    items: [
      'How the internet works: browsers, websites, domains, hosting and search engines',
      'Owned, earned and paid channels; funnels, traffic, leads and conversions',
      'Website and landing-page basics: WordPress or no-code, mobile usability, forms and calls to action',
      'Copywriting and conversion rate optimisation (CRO): headlines, offers, trust signals and page tests',
      'Measurement basics: GA4, UTM links, conversion events, reporting and data privacy',
      'Practical: build a landing page and test an enquiry from click to form submission',
    ],
  },
  {
    month: 'Month 1 · Marketing, branding and content',
    week: 'Week 4',
    topic: 'Social media and content production',
    items: [
      'Social media marketing: platform selection, organic strategy, audience research and content pillars',
      'Content creation: research, formats, hooks, captions and a content calendar',
      'Scripting and storyboarding a Reel, an educational post and a promotional script',
      'Smartphone shooting: framing, lighting, audio, shot lists and B-roll',
      'Editing basics: cuts, pacing, captions, audio and export — with a Claude-assisted cut list',
      'Graphic design in Canva: typography, hierarchy and spacing; submit one Reel and one branded creative',
    ],
  },
  // ── Month 2 · Search, AI workflows and paid media ──
  {
    month: 'Month 2 · Search, AI workflows and paid media',
    week: 'Week 5',
    topic: 'SEO and local search',
    items: [
      'What is SEO? Crawling, indexing, search intent and keyword research',
      'On-page SEO: titles, headings, internal links and content briefs',
      'Technical SEO: sitemaps, indexing issues, site speed and mobile checks',
      'Off-page SEO: backlinks, citations and digital PR',
      'Local SEO: Google Business Profile, Maps visibility, reviews and local landing pages',
      'Practical: SEO and competitor audit with Semrush, Google Search Console and a site crawler',
    ],
  },
  {
    month: 'Month 2 · Search, AI workflows and paid media',
    week: 'Week 6',
    topic: 'AEO, GEO and new-age marketing',
    items: [
      'AEO (Answer Engine Optimisation): real questions, direct answers and how search surfaces them',
      'GEO (Generative Engine Optimisation): compare AI answers, check cited sources and add original evidence',
      'New-age marketing: creator collaborations, user-generated content, social search and first-party data',
      'Email, WhatsApp and CRM: consent, lead follow-up, segmentation and nurture sequences',
      'ChatGPT for scripts, captions and creative variations — checked for facts, tone and brand fit',
      'Practical: video workflow with ChatGPT scripts, ElevenLabs voice-overs and HeyGen templates, with a review step',
    ],
  },
  {
    month: 'Month 2 · Search, AI workflows and paid media',
    week: 'Week 7',
    topic: 'Claude optimisation and supervised automation',
    items: [
      'Claude workflows: research to briefs, landing-page audits and campaign export analysis',
      'Claude-assisted video editing lab: timecodes, cut selection and caption accuracy checks',
      'Content on autopilot: brief, content calendar, production steps and an approval queue',
      'No-code automation lab: enquiry to CRM or Sheet, follow-up trigger, duplicate and failure checks',
      'Claude in Chrome: audit page or campaign settings and draft changes — no publishing or spend without approval',
      'Tool lab and assessment: compare outputs, access, cost and manual alternatives; submit a tested automation',
    ],
  },
  {
    month: 'Month 2 · Search, AI workflows and paid media',
    week: 'Week 8',
    topic: 'Google Ads, then Meta Ads foundations',
    items: [
      'Google Ads strategy: objectives, Search vs. other campaign types, budgets and bidding',
      'Build a Search campaign: structure, keywords, match types, negatives, ad copy and assets',
      'Conversion tracking, landing-page alignment and pre-launch checks',
      'Optimise with search terms, conversion data and cost per acquisition; submit a reviewed draft',
      'Meta Ads Manager: Facebook and Instagram objectives, account structure, audiences and placements',
      'Meta ad variations and a test plan: creative angles, budgets and one variable per test',
    ],
  },
  // ── Month 3 · Campaign execution and career preparation ──
  {
    month: 'Month 3 · Campaign execution and career preparation',
    week: 'Week 9',
    topic: 'Meta paid ads and live project',
    items: [
      'Meta tracking and lead quality: Pixel, Conversions API, lead forms, retargeting and consent',
      'Meta optimisation lab: creative fatigue and cost per qualified lead, with a Claude in Chrome review',
      'Live project kickoff: real business brief, baseline, audience, offer and one measurable goal',
      'Build the landing page or lead form, campaign assets, tracking and test plan',
      'Quality checks and launch of the approved scope (or a launch-ready draft with sample data)',
      'Client-ready report and portfolio case study: strategy, creative, measurement and next steps',
    ],
  },
  {
    month: 'Month 3 · Campaign execution and career preparation',
    week: 'Week 10',
    topic: 'Interview preparation: foundations',
    items: [
      'Role mapping',
      'Résumé',
      'LinkedIn profile',
      'Portfolio case study',
      'Marketing and branding interview questions',
      'First mock interview with feedback',
    ],
  },
  {
    month: 'Month 3 · Campaign execution and career preparation',
    week: 'Week 11',
    topic: 'Interview preparation: technical and practical rounds',
    items: [
      'SEO, AEO and GEO interview questions',
      'Google Ads test',
      'Meta Ads test',
      'Analytics and reporting exercise',
      'Content and AI workflow assignment',
      'Timed campaign case study',
    ],
  },
  {
    month: 'Month 3 · Campaign execution and career preparation',
    week: 'Week 12',
    topic: 'Interview preparation: final rounds',
    items: [
      'Behavioural answers with the STAR method',
      'Client or campaign presentation',
      'Role-specific mock interview',
      'Feedback and corrections',
      'Targeted job applications and recruiter outreach practice',
      'Final mock interview and readiness review',
    ],
  },
];
