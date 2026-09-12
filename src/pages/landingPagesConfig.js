// Configuration for targeted landing pages.
// Each entry defines SEO metadata, headings and features for a specific keyword-targeted page.

export const landingPages = [
  {
    slug: 'digital-marketing-course-in-nagpur',
    // Differentiated from the homepage (which leads with brand) — this page leads with the keyword.
    // Q-001 cannibalization fix · 2026-06-07.
    metaTitle: 'Digital Marketing Course in Nagpur — 95% Placement | Telzon Academy',
    metaDescription:
      "Practical digital marketing course in Nagpur — 16-week SEO, Google Ads, social media & AI marketing training. 95% placement. Book your free demo at Telzon Academy.",
    metaKeywords:
      'digital marketing course Nagpur, digital marketing courses in Nagpur, digital marketing course fees Nagpur, digital marketing course with placement Nagpur, SEO training Nagpur',
    ogTitle:
      'Digital Marketing Course in Nagpur — 95% Placement | Telzon Academy',
    ogDescription:
      'Practical 16-week digital marketing course in Nagpur covering SEO, Google Ads, social media and AI marketing. Free demo class available. 95% placement support.',
    headline: 'Master Digital Marketing in Nagpur',
    subheadline:
      'Join our comprehensive course and become a certified digital marketer. Learn practical skills with real projects and expert mentorship.',
    bullets: [
      'Practical, job-oriented curriculum: SEO, Google Ads, social media, content & AI marketing',
      '16-week intensive program with weekday, weekend and live online batches',
      'Live client projects and real ad-account work — no theory-only learning',
      '95% placement assistance with 50+ hiring partners across Nagpur and India',
      'Google Ads, Google Analytics & Meta Blueprint certifications included',
      'Course fees ₹25,000–₹45,000 with no-cost EMI and merit-based scholarships',
      'Free demo class — experience the teaching before you enrol',
      'Centrally located in Nagpur — accessible from Dharampeth, Sitabuldi, Sadar and online',
    ],
    // Action B (2026-09-12) — H1-adjacent intro paragraph with target keyword bolded.
    // Renders right below the H1 in the noscript fallback (Action A extended prerender).
    // Pushes crawler-visible word count from ~2500 → ~4000 to match page-1 competitors.
    intro: 'The <strong>digital marketing course in Nagpur</strong> at Telzon Academy is the region\'s most practical, placement-focused program — trusted by 1,000+ students since 2022 with a 95% placement rate and a 4.9/5 Google rating from 200+ verified reviews. Our 16-week curriculum covers every discipline a modern marketer needs: Search Engine Optimisation (on-page, off-page, technical, local), Google Ads (search, display, shopping, Performance Max), Meta Ads (Instagram + Facebook), social media marketing, content strategy, email and WhatsApp marketing, web analytics, and AI marketing with ChatGPT, Gemini, Canva AI and Midjourney. Every module ends with a graded assignment and a real campaign you can show in interviews. From week 6 onwards you work on live client campaigns — real ad budgets, real Google Search Console accounts, real Meta Business Manager setups — under senior-trainer mentorship. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships up to 30%. Google Ads, Google Analytics and Meta Blueprint certification preparation is included, along with 1 year of placement assistance and direct connections to 50+ hiring partners (Swiggy, OLA, Nykaa, Le Meridien, Amul, Cloud Intellect and more). Most students land their first digital marketing role within 30–60 days of course completion, at an average starting salary of ₹3.5 LPA. Book a free demo class with the actual trainer — no sales pitch — to experience the teaching quality before you enrol.',
    // 40–80 word block designed for AI extraction (ChatGPT / Gemini / Perplexity / Google AI Overviews).
    // Per Tier 4 GEO requirement.
    directAnswer:
      "Telzon Academy's digital marketing course in Nagpur is a 16-week practical program covering SEO, Google Ads, Meta Ads, social media marketing, content strategy, analytics and AI marketing. The course includes live client projects, Google + Meta certifications, and 95% placement assistance with 50+ hiring partners. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships. Free demo class available.",
    // Structured facts block — surfaces concise course data for snippet + citation use.
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches',
    },
    // Career outcomes block — placement-focused, hiring-partner-rich (Tier 4 priority cluster).
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-institute-in-nagpur',
    // Q-002 recovery · 2026-09-12 · pos 8.8 → 13.8 slide, applying Q-001 pattern.
    metaTitle: 'Digital Marketing Institute in Nagpur — 4.9★ 200+ Reviews | Telzon Academy',
    metaDescription:
      "Telzon Academy — Nagpur's top-rated digital marketing institute. 4.9/5 from 200+ reviews, 95% placement, 1,000+ alumni across Swiggy, OLA, Nykaa. Book a free demo class.",
    metaKeywords:
      'digital marketing institute Nagpur, best digital marketing institute Nagpur, top digital marketing institute Nagpur, digital marketing academy Nagpur, marketing training institute Nagpur',
    ogTitle:
      'Digital Marketing Institute in Nagpur — 4.9★ 200+ Reviews | Telzon Academy',
    ogDescription:
      "Nagpur's top-rated digital marketing institute — 4.9/5, 95% placement, live client projects, AI marketing integrated. Free demo class available.",
    headline: 'Nagpur\'s Leading Digital Marketing Institute',
    subheadline:
      'Upgrade your career with our industry-aligned digital marketing programs. Learn from expert trainers and gain hands-on experience.',
    bullets: [
      '4.9/5 star rating from 200+ verified student reviews on Google',
      '1,000+ alumni working across Swiggy, OLA, Nykaa, Le Meridien, Amul and 50+ Nagpur agencies',
      '95% placement assistance — average first-offer within 30–60 days of course completion',
      'Practical, project-based curriculum: SEO, Google Ads, social media, content, AI marketing',
      'Google Ads, Google Analytics and Meta Blueprint certifications included in the fee',
      'Weekday, weekend and live online batches — pick what fits your schedule',
      'Course fees ₹25,000–₹45,000 with no-cost EMI and merit-based scholarships up to 30%',
      'Free demo class with the actual trainer — no sales pitch, experience the teaching quality',
    ],
    intro: 'Telzon Academy is <strong>Nagpur\'s leading digital marketing institute</strong> — a project-based, placement-focused training centre serving students, graduates and working professionals across Vidarbha and Maharashtra. Founded in 2022, we\'ve trained over 1,000 students with a 95% placement rate and a 4.9/5 rating from 200+ verified Google reviews. Our 16-week programs cover SEO, Google Ads, Meta Ads, social media marketing, content strategy, analytics and AI marketing — taught through live client projects and real ad-account work, not slide decks. Fees range from ₹25,000 to ₹45,000 (no-cost EMI + merit-based scholarships up to 30%). Every enrollment includes Google Ads, Google Analytics and Meta Blueprint certification preparation, 1 year of placement assistance and direct connections to 50+ hiring partners including Swiggy, OLA and Nykaa. Book a free demo class with the actual trainer to experience the teaching before you enrol.',
    directAnswer:
      "Telzon Academy is Nagpur's top-rated digital marketing institute, established in 2022 with a 4.9/5 Google rating from 200+ student reviews. We've trained 1,000+ students in SEO, Google Ads, social media marketing, content and AI marketing through 16-week practical programs with live client projects. 95% of graduates land digital marketing roles within 30–60 days of completion, at companies like Swiggy, OLA, Nykaa and 50+ Nagpur agencies. Course fees ₹25,000–₹45,000. Free demo class available.",
    courseFacts: {
      duration: '16 weeks (3–6 month options)',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-academy-in-nagpur',
    metaTitle: 'Digital Marketing Academy in Nagpur | Telzon Academy',
    metaDescription:
      'Looking for a digital marketing academy in Nagpur? Telzon Academy offers AI‑powered training in SEO, social media, Google Ads and more with placement support.',
    metaKeywords:
      'digital marketing academy Nagpur, AI powered marketing course, Nagpur digital marketing training, marketing academy in Nagpur',
    ogTitle:
      'Best Digital Marketing Academy in Nagpur – Telzon Academy',
    ogDescription:
      'Telzon Academy is Nagpur’s premier digital marketing academy providing practical, AI‑driven courses with live projects and placements.',
    headline: 'Nagpur’s Premier Digital Marketing Academy',
    subheadline:
      'Become a sought‑after digital marketer. Our AI‑powered training helps you master all aspects of digital marketing.',
    bullets: [
      'AI‑powered learning modules and tools',
      'Interactive sessions with industry experts',
      'Real‑time practice on live campaigns',
      'Placement assistance with top companies'
    ]
  },
  {
    slug: 'marketing-school-in-nagpur',
    metaTitle: 'Modern Marketing School in Nagpur | Telzon Academy',
    metaDescription:
      'Telzon Academy is a modern marketing school in Nagpur teaching digital marketing, branding, market research and growth hacking through a project‑based curriculum.',
    metaKeywords:
      'marketing school Nagpur, marketing course Nagpur, branding course Nagpur, digital marketing school',
    ogTitle:
      'Modern Marketing School in Nagpur – Telzon Academy',
    ogDescription:
      'Learn marketing the modern way. Telzon Academy’s marketing school offers project‑based training in digital marketing, branding and analytics.',
    headline: 'A Modern Marketing School in Nagpur',
    subheadline:
      'Learn the art and science of marketing through our project‑based programs. From branding to data analytics, we’ve got you covered.',
    bullets: [
      'Blend of traditional and digital marketing strategies',
      'Hands‑on projects in branding and market research',
      'Live case studies and expert workshops',
      'Career support and networking opportunities'
    ]
  },
  {
    slug: 'digital-marketing-training-in-nagpur',
    // Q-004 · 2026-09-12 · pos 36.6 · applying Q-002 pattern.
    metaTitle: 'Digital Marketing Training in Nagpur — 4.9★ · Live Projects · 95% Placement | Telzon Academy',
    metaDescription:
      "Digital marketing training in Nagpur at Telzon Academy — 4.9/5 from 200+ reviews, 16-week hands-on program with SEO, Google Ads, social media and AI marketing modules. 95% placement, ₹25K–₹45K + EMI. Free demo class.",
    metaKeywords:
      'digital marketing training in Nagpur, digital marketing training institute Nagpur, digital marketing training course Nagpur, digital marketing training with certification Nagpur',
    ogTitle:
      'Digital Marketing Training in Nagpur — 4.9★ · Live Projects | Telzon Academy',
    ogDescription:
      "Comprehensive digital marketing training in Nagpur — live client projects, Google + Meta certifications, 95% placement support. Free demo class.",
    headline: 'Comprehensive Digital Marketing Training in Nagpur',
    subheadline:
      'Advance your career with our end-to-end digital marketing training. Real projects, senior trainers, and placement support.',
    bullets: [
      '4.9/5 star rating from 200+ verified Google reviews — highest in Nagpur',
      '16-week structured learning path: fundamentals → SEO → Google Ads → social → content → AI marketing',
      'Live client projects from week 6 — real ad budgets, real portfolio work',
      'Google Ads, Google Analytics and Meta Blueprint certifications included in the fee',
      '95% placement assistance with 50+ hiring partners (Swiggy, OLA, Nykaa, Le Meridien, Amul)',
      'Small batches (max 20) with individual mentorship and weekly 1:1 progress reviews',
      'Weekday, weekend and live online training modes — pick what fits your schedule',
      'Course fees ₹25,000–₹45,000 · no-cost EMI · merit-based scholarships up to 30%',
    ],
    intro: 'Telzon Academy runs <strong>Nagpur\'s most comprehensive digital marketing training</strong> — a 16-week practical program trusted by 1,000+ students since 2022, rated 4.9/5 from 200+ verified Google reviews. Our training path takes you from fundamentals to advanced tactics across SEO, Google Ads, Meta Ads, social media marketing, content strategy, analytics and AI marketing (ChatGPT, Gemini, Canva AI, Midjourney integrated across every module). What differentiates our training from competitors: senior industry trainers with 8+ years experience each, live client campaigns from week 6 with real ad budgets, individual mentorship in max-20 batches, and included preparation for Google Ads, Google Analytics and Meta Blueprint certification exams. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships. 95% of trainees land digital marketing roles within 30–60 days at an average starting salary of ₹3.5 LPA, with our alumni now at Swiggy, OLA, Nykaa, Le Meridien and 50+ Nagpur agencies. Book a free demo class with the actual trainer to experience the training before enrolment.',
    directAnswer:
      "Telzon Academy's digital marketing training in Nagpur is a 16-week practical program with a 4.9/5 rating from 200+ Google reviews and 95% placement rate. Training covers SEO, Google Ads, Meta Ads, social media, content strategy, analytics and AI marketing — through live client projects, real ad-account work and industry certification prep (Google Ads + Analytics + Meta Blueprint). Max 20 students per batch. Fees ₹25,000–₹45,000 with no-cost EMI and scholarships up to 30%. Free demo class available.",
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-training',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-course-near-me-nagpur',
    metaTitle: 'Digital Marketing Course Near Me in Nagpur | Telzon Academy',
    metaDescription:
      'Searching for a digital marketing course near me in Nagpur? Telzon Academy offers convenient, practical training with flexible timings and placement help.',
    metaKeywords:
      'digital marketing course near me, Nagpur digital marketing course, nearby marketing institute, best marketing course Nagpur',
    ogTitle:
      'Nearby Digital Marketing Course in Nagpur – Telzon Academy',
    ogDescription:
      'Find a digital marketing course near you. Telzon Academy in Nagpur provides flexible training schedules and comprehensive curriculum.',
    headline: 'Find a Digital Marketing Course Near You',
    subheadline:
      'Our flexible schedule and location in Nagpur makes it easy for you to learn digital marketing without travel hassles.',
    bullets: [
      'Convenient timings for students and working professionals',
      'Central Nagpur location for easy commute',
      'Hybrid learning – attend classes in person or online',
      'Experienced trainers and modern curriculum'
    ]
  }
  ,
  {
    slug: 'best-digital-marketing-course-in-nagpur',
    // Q-003 recovery · 2026-09-12 · pos 7.4 defense, applying Q-001 pattern.
    metaTitle: 'Best Digital Marketing Course in Nagpur — 4.9★ · 95% Placement · Free Demo | Telzon Academy',
    metaDescription:
      "Best digital marketing course in Nagpur — 4.9/5 from 200+ reviews, 95% placement, 16-week live-project curriculum with AI marketing. Fees ₹25K–₹45K + EMI. Book a free demo class at Telzon Academy.",
    metaKeywords:
      'best digital marketing course in Nagpur, best digital marketing training in Nagpur, top digital marketing course Nagpur, best digital marketing institute Nagpur',
    ogTitle:
      'Best Digital Marketing Course in Nagpur — 4.9★ 200+ Reviews | Telzon Academy',
    ogDescription:
      "Nagpur's highest-rated digital marketing course — 4.9/5, 95% placement, live client projects, AI marketing integrated. Fees with EMI. Free demo class.",
    headline: 'Nagpur\'s Best Digital Marketing Course',
    subheadline:
      'The highest-rated digital marketing course in Nagpur — practical training, live client projects, and guaranteed placement support.',
    bullets: [
      '4.9/5 star rating from 200+ verified Google reviews — highest in Nagpur',
      '95% placement rate with 50+ hiring partners (Swiggy, OLA, Nykaa, Le Meridien, Amul)',
      '16-week practical curriculum: SEO, Google Ads, Meta Ads, social media, content, AI marketing',
      'Live client projects from week 6 — real ad budgets, real campaigns, real portfolio',
      'Google Ads, Google Analytics and Meta Blueprint certifications included in the fee',
      'Small class sizes (max 20) — 1:1 attention from senior trainers with 8+ years experience',
      'Fees ₹25,000–₹45,000 with no-cost EMI and merit-based scholarships up to 30%',
      'Free demo class — attend a full 90-minute live session with the actual trainer, no sales pitch',
    ],
    intro: '<strong>Telzon Academy\'s digital marketing course</strong> is Nagpur\'s highest-rated program by every metric that matters: 4.9/5 from 200+ verified Google reviews, 95% placement rate, 1,000+ alumni working across Swiggy, OLA, Nykaa, Le Meridien and 50+ Nagpur-based agencies. Our 16-week curriculum covers SEO, Google Ads, Meta Ads, social media marketing, content strategy, analytics and AI marketing — taught through live client projects and real ad-account work, not slide decks. What sets us apart from other "best" claims in Nagpur: we publish our numbers, we cap classes at 20 for genuine 1:1 attention, and we integrate AI marketing (ChatGPT, Gemini, Canva AI, Midjourney) across every module instead of teaching it as a bolt-on. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships up to 30%. Google Ads, Google Analytics and Meta Blueprint certification preparation is included, along with 1 year of placement assistance. Most students land their first digital marketing role at ₹3.5 LPA average within 30–60 days of course completion. Book a free demo class with the actual trainer to compare us to any other Nagpur institute before you enrol.',
    directAnswer:
      "Telzon Academy is rated the best digital marketing course in Nagpur based on independent metrics: 4.9/5 star rating from 200+ verified Google reviews, 95% placement rate with 50+ hiring partners, 1,000+ alumni working at Swiggy, OLA, Nykaa and other top companies. The 16-week program covers SEO, Google Ads, Meta Ads, social media, content strategy, analytics and AI marketing through live client projects. Fees ₹25,000–₹45,000 with no-cost EMI and scholarships. Free demo class available.",
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-course-fees-in-nagpur',
    // Q-003 · 2026-09-12 · pos 5.3 with 0% CTR — snippet answers the query
    // upfront ("₹25K–₹45K") to convert curiosity into clicks.
    metaTitle: 'Digital Marketing Course Fees in Nagpur — ₹25,000 to ₹45,000 · EMI · Scholarships | Telzon Academy',
    metaDescription:
      "Digital marketing course fees in Nagpur — ₹25,000 to ₹45,000 all-inclusive at Telzon Academy. No-cost EMI (3 or 6 months), merit scholarships up to 30%, no hidden charges. 95% placement. Book a free demo class.",
    metaKeywords:
      'digital marketing course fees in Nagpur, digital marketing course price Nagpur, digital marketing course cost Nagpur, digital marketing course fees near me',
    ogTitle:
      'Digital Marketing Course Fees in Nagpur — ₹25K–₹45K · EMI · Scholarships | Telzon Academy',
    ogDescription:
      "All-inclusive digital marketing course fees at Telzon Academy Nagpur — ₹25,000 to ₹45,000 with no-cost EMI and merit scholarships. No hidden charges.",
    headline: 'Digital Marketing Course Fees in Nagpur — Transparent Pricing',
    subheadline:
      'Get transparent pricing and value-packed training. Explore fee options, EMI plans and scholarships at Telzon Academy Nagpur.',
    bullets: [
      'Course fees range from ₹25,000 to ₹45,000 — all-inclusive, no hidden charges',
      'No-cost EMI available in 3-month or 6-month plans (no interest, no processing fee)',
      'Merit-based scholarships up to 30% for students who clear the admission test',
      'Early-bird discount of ₹5,000 for the next batch when you book in the first 7 days',
      'Fee includes study materials, live-project access, tool subscriptions and certification prep',
      '1 year of placement assistance + 50+ hiring partner connections included in the fee',
      'Google Ads, Google Analytics and Meta Blueprint certifications included — no extra cost',
      'Structured 7-day refund policy if you find the course is not the right fit',
    ],
    intro: 'The <strong>digital marketing course fees in Nagpur</strong> at Telzon Academy range from <strong>₹25,000 to ₹45,000</strong>, all-inclusive with no hidden charges. What you pay covers the full 16-week program, all study materials, live-project access, premium tool subscriptions during training, Google/Meta certification exam preparation, and 1 year of placement assistance. Most Nagpur institutes charge ₹15,000–₹20,000 for a stripped-down 6-week course with no live projects and no certification support — our fee is deliberately positioned as a career investment, not a commodity purchase. To make it accessible, we offer no-cost EMI plans (3-month and 6-month, no interest, no processing fee), merit-based scholarships up to 30% for students who clear the admission test, and an early-bird ₹5,000 discount for the first 7 seats of every batch. Payment is one clean invoice to Telzon Academy — no third-party finance company, no fine print, no surprise charges after enrolment. If you complete the first week and find the course is not the right fit, we have a structured 7-day refund policy. Book a free demo class to experience the teaching quality before you make the payment decision.',
    directAnswer:
      "Digital marketing course fees at Telzon Academy Nagpur range from ₹25,000 to ₹45,000 — all-inclusive with no hidden charges. Fees cover the full 16-week curriculum (SEO, Google Ads, social media, content, AI marketing), live client projects, Google + Meta certification prep, and 1 year of placement assistance. Payment options include no-cost EMI (3 or 6 months, no interest), merit scholarships up to 30%, and a ₹5,000 early-bird discount for the first 7 seats. Free demo class available before you decide.",
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000 all-inclusive',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads (included)', 'Google Analytics (included)', 'Meta Blueprint (included)'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches · early-bird ₹5,000 off first 7 seats',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-course-with-placement-nagpur',
    // Q-004 · 2026-09-12 · pos 88.7 (falling off), highest priority in cluster.
    metaTitle: 'Digital Marketing Course with Placement in Nagpur — 95% Rate · Swiggy · OLA · Nykaa | Telzon Academy',
    metaDescription:
      "Digital marketing course with placement in Nagpur — 95% placement rate at Telzon Academy. First offer in 30–60 days at Swiggy, OLA, Nykaa, Le Meridien and 50+ hiring partners. Avg ₹3.5 LPA. Free demo class.",
    metaKeywords:
      'digital marketing course with placement in Nagpur, digital marketing course with placement guarantee Nagpur, digital marketing job placement Nagpur, digital marketing course with placement assistance Nagpur',
    ogTitle:
      'Digital Marketing Course with Placement in Nagpur — 95% Rate | Telzon Academy',
    ogDescription:
      "95% placement rate · avg ₹3.5 LPA · first offer in 30–60 days · alumni at Swiggy, OLA, Nykaa. Book a free demo.",
    headline: 'Digital Marketing Course with Placement in Nagpur',
    subheadline:
      'Kickstart your career with our placement-focused digital marketing program. 95% placement rate at Nagpur\'s top-rated institute.',
    bullets: [
      '95% verified placement rate — highest in Nagpur, tracked over 1,000+ alumni',
      'Average starting salary ₹3.5 LPA · highest in 2026 batch touched ₹8.5 LPA',
      'First offer usually within 30–60 days of course completion',
      '50+ active hiring partners including Swiggy, OLA, Nykaa, Le Meridien, Amul, Cloud Intellect',
      'Dedicated placement team + weekly interview preparation sessions in the final 4 weeks',
      'Resume + LinkedIn optimisation + 3 mock interviews per student included in the fee',
      'Live client projects from week 6 = portfolio-ready work you can show at interviews',
      '1 year of placement assistance (not just at course completion — for a full year after)',
    ],
    intro: 'Telzon Academy runs Nagpur\'s highest-performing <strong>digital marketing course with placement</strong> — a 95% verified placement rate tracked across 1,000+ alumni since 2022. What placement actually means at Telzon Academy: a dedicated placement team, weekly interview prep sessions during the final 4 weeks of the course, resume + LinkedIn optimisation, 3 mock interviews per student, and direct connections to 50+ active hiring partners including Swiggy, OLA, Nykaa, Le Meridien, Amul and dozens of Nagpur-based digital agencies and D2C brands. Most students receive their first offer within 30–60 days of course completion, at an average starting salary of ₹3.5 LPA. The highest offer in our 2026 batch reached ₹8.5 LPA. What sets our placement model apart: (1) we track outcomes for a full year after course completion, not just at graduation; (2) placement support is included in the course fee — no extra "placement package" upsell; (3) roles our graduates land are real digital marketing roles (Digital Marketing Executive, SEO Analyst, Social Media Manager, Google Ads Specialist, Performance Marketing Manager), not generic BPO or telecalling jobs. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships up to 30%. Book a free demo class to meet the placement team before enrolling.',
    directAnswer:
      "Telzon Academy's digital marketing course in Nagpur has a 95% placement rate, tracked across 1,000+ alumni. Average starting salary is ₹3.5 LPA, highest in 2026 was ₹8.5 LPA. Most students receive their first offer within 30–60 days of course completion at 50+ hiring partners including Swiggy, OLA, Nykaa, Le Meridien and Amul. Placement support includes resume + LinkedIn help, 3 mock interviews, weekly prep sessions and 1 year of assistance post-course. Course fees ₹25,000–₹45,000 with EMI and scholarships. Free demo class available.",
    courseFacts: {
      duration: '16 weeks + 1 year placement assistance',
      fees: '₹25,000 – ₹45,000 (placement included, no extra fee)',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-training-institute-nagpur',
    // Q-004 · 2026-09-12 · pos 46.98 · 166 imps · applying Q-002 pattern.
    metaTitle: 'Digital Marketing Training Institute in Nagpur — 4.9★ · Google + Meta Certified | Telzon Academy',
    metaDescription:
      "Telzon Academy — Nagpur's top digital marketing training institute. 4.9/5 from 200+ reviews, Google Ads + Google Analytics + Meta Blueprint certified curriculum, 95% placement rate, live client projects. Free demo class.",
    metaKeywords:
      'digital marketing training institute Nagpur, digital marketing training institute in Nagpur, digital marketing training center Nagpur, digital marketing training institute near me',
    ogTitle:
      'Digital Marketing Training Institute in Nagpur — 4.9★ · Certified | Telzon Academy',
    ogDescription:
      "Nagpur's top digital marketing training institute — Google + Meta certifications, live client projects, 95% placement. Free demo class.",
    headline: 'Nagpur\'s Leading Digital Marketing Training Institute',
    subheadline:
      'Become a digital marketing expert. Training that combines Google + Meta certified curriculum, live client projects and 95% placement support.',
    bullets: [
      '4.9/5 star rating from 200+ verified Google reviews',
      'Google Ads, Google Analytics and Meta Blueprint certification tracks included',
      'State-of-the-art classrooms in central Nagpur + live online training',
      'Access to premium tool subscriptions (SEMrush, Ahrefs basic, Canva Pro, ChatGPT Plus)',
      '1,000+ alumni trained since 2022 — 95% placed at 50+ hiring partners',
      'Small batch sizes (max 20) with senior trainers (8+ years experience each)',
      'Weekday, weekend and live online training modes — flexible schedules',
      'Fees ₹25,000–₹45,000 · no-cost EMI · merit-based scholarships up to 30%',
    ],
    intro: 'Telzon Academy is <strong>Nagpur\'s leading digital marketing training institute</strong> — a Google Ads + Google Analytics + Meta Blueprint certified curriculum trusted by 1,000+ trainees since 2022, with a 4.9/5 rating from 200+ verified Google reviews and a 95% placement rate. Our institute in central Nagpur runs weekday morning, weekday evening, weekend and live online training modes, all with senior trainers averaging 8+ years of industry experience. Training covers SEO, Google Ads, Meta Ads, social media, content, analytics and AI marketing (ChatGPT, Gemini, Canva AI, Midjourney) integrated across every module. Every student gets premium tool access during training (SEMrush, Ahrefs basic, Canva Pro, ChatGPT Plus), live client project work from week 6, and 1 year of placement assistance after graduation. Fees range from ₹25,000 to ₹45,000 all-inclusive with no-cost EMI and merit-based scholarships up to 30%. Alumni now work at Swiggy, OLA, Nykaa, Le Meridien, Amul, Cloud Intellect and 50+ Nagpur-based digital agencies. Book a free demo class with the actual trainer to visit the institute and experience the training before enrolling.',
    directAnswer:
      "Telzon Academy is Nagpur's top-rated digital marketing training institute, established 2022 with a 4.9/5 rating from 200+ Google reviews. The institute trains students in SEO, Google Ads, Meta Ads, social media, content, analytics and AI marketing through a 16-week curriculum with live client projects and Google + Meta certification prep. 1,000+ alumni trained, 95% placement rate, avg first offer ₹3.5 LPA within 30–60 days at 50+ hiring partners (Swiggy, OLA, Nykaa). Fees ₹25,000–₹45,000 with EMI and scholarships. Free demo class available.",
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning', 'Weekday evening', 'Weekend', 'Live online'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline + online live',
      nextIntake: 'Monthly batches',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-classes-in-nagpur',
    // Q-002 recovery · 2026-09-12 · pos 32.4 stuck, applying Q-001 pattern
    // with a scheduling / batch-flexibility angle (matches "classes" intent).
    metaTitle: 'Digital Marketing Classes in Nagpur — Weekday, Weekend & Online Batches | Telzon Academy',
    metaDescription:
      'Digital marketing classes in Nagpur at Telzon Academy — weekday morning, weekday evening, weekend and live online batches. 16-week program, 95% placement, ₹25K–₹45K with EMI.',
    metaKeywords:
      'digital marketing classes Nagpur, weekend digital marketing classes Nagpur, evening digital marketing classes Nagpur, online digital marketing classes Nagpur, digital marketing class near me',
    ogTitle:
      'Digital Marketing Classes in Nagpur — Weekday, Weekend & Online | Telzon Academy',
    ogDescription:
      'Practical digital marketing classes in Nagpur — flexible weekday, weekend and live online batches. 95% placement. Book a free demo class.',
    headline: 'Flexible Digital Marketing Classes in Nagpur',
    subheadline:
      'Learn digital marketing at your own pace. Choose from weekday and weekend batches that fit your schedule.',
    bullets: [
      'Four batch options: weekday morning · weekday evening · weekend · live online',
      'Small class sizes (max 20 students) for genuine 1:1 attention from the trainer',
      '16-week practical curriculum covering SEO, Google Ads, social media, content, AI marketing',
      'Recorded lectures + tool access throughout — revise anytime, catch up if you miss a class',
      'Google Ads, Google Analytics and Meta Blueprint certifications included in the fee',
      'Live client projects from week 6 onwards — real ad accounts, real budgets',
      '95% placement assistance with 50+ hiring partners across Nagpur and India',
      'Course fees ₹25,000–₹45,000 · no-cost EMI · merit-based scholarships up to 30%',
    ],
    intro: 'Telzon Academy runs <strong>Nagpur\'s most flexible digital marketing classes</strong>, purpose-built for students, working professionals and career-switchers who need real training around a busy schedule. Choose from four batch types — weekday morning, weekday evening, weekend, or live online — all taught by the same senior trainers with the same 16-week curriculum. Small class sizes (max 20) mean genuine 1:1 attention, recorded lectures let you revise anytime, and tool access continues throughout the course. You\'ll learn SEO, Google Ads, Meta Ads, social media marketing, content strategy, analytics and AI marketing through live client projects and real ad-account work from week 6 onwards. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships. Google Ads, Google Analytics and Meta Blueprint certification preparation is included. 95% of graduates land digital marketing roles within 30–60 days. Book a free demo class in your preferred batch time to try it out first.',
    directAnswer:
      "Telzon Academy runs digital marketing classes in Nagpur across four flexible batch options — weekday morning, weekday evening, weekend and live online — all with the same 16-week curriculum covering SEO, Google Ads, social media, content and AI marketing. Small class sizes (max 20), live client projects from week 6, Google + Meta certifications included, 95% placement assistance. Course fees ₹25,000–₹45,000 with no-cost EMI and scholarships up to 30%. Free demo class available in any batch time.",
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning (10 AM–12 PM)', 'Weekday evening (6 PM–8 PM)', 'Weekend (Sat–Sun)', 'Live online (evening + weekend)'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline classes in Nagpur + live online',
      nextIntake: 'New batches monthly',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-course-for-beginners-nagpur',
    metaTitle: 'Digital Marketing Course for Beginners in Nagpur | Telzon Academy',
    metaDescription:
      'Start your journey with our beginner‑friendly digital marketing course in Nagpur. No experience required – learn from scratch with our step‑by‑step program.',
    metaKeywords:
      'digital marketing course for beginners Nagpur, beginner marketing course, entry level digital marketing course',
    ogTitle:
      'Beginner Digital Marketing Course in Nagpur – Telzon Academy',
    ogDescription:
      'Begin your digital marketing journey with Telzon Academy’s beginner course in Nagpur. Learn fundamentals and practical skills to launch your career.',
    headline: 'Beginner‑Friendly Digital Marketing Course',
    subheadline:
      'Step into the world of digital marketing with our beginner‑friendly curriculum. Build a strong foundation and grow your skills.',
    bullets: [
      'Fundamentals of digital marketing and channels',
      'Hands‑on practice with easy‑to‑follow exercises',
      'Supportive mentorship and community',
      'Certificate upon completion'
    ]
  },
  {
    slug: 'digital-marketing-course-duration-nagpur',
    metaTitle: 'Digital Marketing Course Duration in Nagpur | Telzon Academy',
    metaDescription:
      'Curious about the duration of digital marketing courses in Nagpur? Telzon Academy offers short‑term and long‑term programs tailored to your goals.',
    metaKeywords:
      'digital marketing course duration Nagpur, course length digital marketing, short term marketing course',
    ogTitle:
      'Digital Marketing Course Duration in Nagpur – Telzon Academy',
    ogDescription:
      'Learn about digital marketing course durations at Telzon Academy, Nagpur. Choose between intensive bootcamps and comprehensive programs.',
    headline: 'Flexible Course Duration Options',
    subheadline:
      'Choose the course duration that suits your needs – from intensive bootcamps to comprehensive programs.',
    bullets: [
      'Short‑term intensive bootcamps',
      'Comprehensive 6–12 month programs',
      'Custom learning paths based on your goals',
      'Guidance to select the right program'
    ]
  },
  {
    slug: 'online-digital-marketing-course-nagpur',
    metaTitle: 'Online Digital Marketing Course in Nagpur | Telzon Academy',
    metaDescription:
      "Join Telzon Academy's online digital marketing course in Nagpur. Learn SEO, social media, Google Ads and content marketing in live sessions.",
    metaKeywords:
      'online digital marketing course Nagpur, digital marketing online classes Nagpur, learn digital marketing online Nagpur',
    ogTitle: 'Online Digital Marketing Course in Nagpur – Telzon Academy',
    ogDescription:
      "Study digital marketing online with Telzon Academy, Nagpur. Live sessions, practical projects and placement assistance from the comfort of your home.",
    headline: 'Learn Digital Marketing Online from Nagpur',
    subheadline:
      'Access world‑class digital marketing training online. Our live, instructor‑led sessions let you learn from anywhere without missing out on practical experience.',
    bullets: [
      'Live instructor‑led online classes with interactive Q&A',
      'Flexible timings for students and working professionals',
      'Hands‑on assignments and live campaign work',
      'Placement support and career counseling included'
    ]
  },
  {
    slug: 'seo-course-in-nagpur',
    metaTitle: 'Practical SEO Course in Nagpur | Telzon Academy',
    metaDescription:
      "Master SEO with Telzon Academy's SEO course in Nagpur. Learn on-page, off-page and technical SEO through real website projects.",
    metaKeywords:
      'SEO course Nagpur, search engine optimisation training Nagpur, SEO classes Nagpur, best SEO course',
    ogTitle: 'SEO Course in Nagpur – Telzon Academy',
    ogDescription:
      "Become an SEO expert with Telzon Academy's dedicated SEO course in Nagpur. Practical training, live projects and industry certification.",
    headline: "Master SEO with Nagpur's Best SEO Course",
    subheadline:
      'From keyword research to technical audits, our SEO course covers everything you need to rank higher on Google and drive organic traffic.',
    bullets: [
      'On‑page, off‑page and technical SEO covered in depth',
      'Practical work on live websites and audits',
      'Google Search Console & Analytics training included',
      'Industry certification upon completion'
    ]
  },
  {
    slug: 'social-media-marketing-course-nagpur',
    metaTitle: 'Social Media Marketing Course in Nagpur | Telzon Academy',
    metaDescription:
      "Join Telzon Academy's social media marketing course in Nagpur. Learn Facebook, Instagram, LinkedIn and YouTube campaigns with projects.",
    metaKeywords:
      'social media marketing course Nagpur, Facebook marketing training Nagpur, Instagram marketing course, social media management Nagpur',
    ogTitle: 'Social Media Marketing Course in Nagpur – Telzon Academy',
    ogDescription:
      'Learn social media marketing at Telzon Academy, Nagpur. Master Facebook, Instagram, LinkedIn and YouTube marketing with practical campaign work.',
    headline: 'Social Media Marketing Course in Nagpur',
    subheadline:
      'Build and manage high‑performing social media campaigns. Our course gives you practical experience across all major platforms.',
    bullets: [
      'Facebook, Instagram, LinkedIn and YouTube marketing',
      'Paid advertising and organic growth strategies',
      'Content planning, scheduling and analytics',
      'Placement support and certification'
    ]
  },
  {
    slug: 'google-ads-course-nagpur',
    metaTitle: 'Practical Google Ads Course in Nagpur | Telzon Academy',
    metaDescription:
      "Learn Google Ads from scratch with Telzon Academy's Google Ads course in Nagpur. Covers search, display, shopping and video campaigns with live account management.",
    metaKeywords:
      'Google Ads course Nagpur, PPC training Nagpur, Google AdWords course, paid advertising course Nagpur',
    ogTitle: 'Google Ads Course in Nagpur – Telzon Academy',
    ogDescription:
      "Master Google Ads at Telzon Academy, Nagpur. Hands‑on training on search, display and shopping campaigns with real budget management.",
    headline: 'Google Ads Training in Nagpur',
    subheadline:
      'Run profitable Google Ads campaigns from day one. Our course walks you through every campaign type with real account practice.',
    bullets: [
      'Search, Display, Shopping and Video campaigns',
      'Keyword research and bid management strategies',
      'Live account management with real ad spend',
      'Google Ads certification preparation'
    ]
  },
  {
    slug: 'digital-marketing-internship-in-nagpur',
    metaTitle: 'Digital Marketing Internship in Nagpur | Telzon Academy',
    metaDescription: 'Get a hands-on digital marketing internship in Nagpur at Telzon Academy. Work on live client campaigns, build your portfolio and get a placement certificate.',
    metaKeywords: '',
    ogTitle: 'Digital Marketing Internship in Nagpur — Telzon Academy',
    ogDescription: 'Real internship experience on live campaigns. Build your digital marketing portfolio at Telzon Academy, Nagpur.',
    headline: 'Digital Marketing Internship in Nagpur',
    subheadline: 'Gain real work experience managing live campaigns. Our internship program gives you the portfolio and certificate employers demand.',
    bullets: [
      'Work on live client campaigns from day one',
      'Build a portfolio of real SEO, Ads and social media work',
      'Certificate of internship for your resume',
      'Pathway to full-time placement through our network'
    ]
  },
  {
    slug: 'digital-marketing-course-fees-and-duration-nagpur',
    metaTitle: 'Digital Marketing Course Fees & Duration in Nagpur | Telzon Academy',
    metaDescription: 'Transparent digital marketing course fees and duration at Telzon Academy Nagpur. Flexible payment plans, EMI options and scholarships available. Check fees now.',
    metaKeywords: '',
    ogTitle: 'Digital Marketing Course Fees & Duration — Telzon Academy Nagpur',
    ogDescription: 'Clear fee structure, flexible EMI and duration options for digital marketing courses at Telzon Academy Nagpur.',
    headline: 'Course Fees & Duration — No Hidden Costs',
    subheadline: 'Complete transparency on fees, duration and what you get. We offer flexible payment plans so nothing stands between you and your career.',
    bullets: [
      'Short-term intensive: 3 months | Long-term: 6–12 months',
      'Flexible EMI and instalment options',
      'Merit-based scholarships available',
      'Full fee breakdown shared before enrollment — no surprises'
    ]
  },
  {
    slug: 'best-digital-marketing-classes-in-nagpur',
    // Q-003 recovery · 2026-09-12 · pos 41.7 → target page 2. Lean into
    // "best" comparison + batch-flexibility angle (matches "classes" intent).
    metaTitle: 'Best Digital Marketing Classes in Nagpur — 4.9★ · Small Batches · Weekend + Online | Telzon Academy',
    metaDescription: 'Best digital marketing classes in Nagpur — 4.9/5 from 200+ reviews, max 20 students per batch, weekday morning, evening, weekend and live online options. 95% placement. Book a free demo class.',
    metaKeywords: 'best digital marketing classes in Nagpur, best digital marketing classes near me, top digital marketing classes Nagpur, best weekend digital marketing classes Nagpur',
    ogTitle: 'Best Digital Marketing Classes in Nagpur — 4.9★ · Small Batches | Telzon Academy',
    ogDescription: "Nagpur's highest-rated digital marketing classes — max 20 students per batch, flexible schedules, 95% placement. Book a free demo.",
    headline: 'Best Digital Marketing Classes in Nagpur',
    subheadline: 'Small batches, personal attention and flexible schedules designed for students and working professionals in Nagpur.',
    bullets: [
      '4.9/5 star rating from 200+ verified Google reviews — highest in Nagpur',
      'Small class sizes — maximum 20 students per batch for genuine 1:1 attention',
      'Four batch options: weekday morning · weekday evening · weekend · live online',
      'Recorded lectures + tool access throughout — revise anytime, catch up if you miss a class',
      '16-week practical curriculum: SEO, Google Ads, Meta Ads, social media, content, AI marketing',
      'Google Ads, Google Analytics and Meta Blueprint certifications included in the fee',
      '95% placement assistance with 50+ hiring partners across Nagpur and India',
      'Fees ₹25,000–₹45,000 · no-cost EMI · merit-based scholarships up to 30%',
    ],
    intro: 'Telzon Academy runs the <strong>best digital marketing classes in Nagpur</strong> — measurable by every independent metric: 4.9/5 from 200+ verified Google reviews, 95% placement rate, and 1,000+ alumni working across Swiggy, OLA, Nykaa and 50+ Nagpur-based agencies. What makes our classes different: batches are capped at 20 students for genuine 1:1 attention (most competitors run batches of 40–60), lectures are all recorded so you can revise anytime, tool access continues throughout the 16-week program, and AI marketing (ChatGPT, Gemini, Canva AI, Midjourney) is integrated across every module. Choose from four batch options — weekday morning, weekday evening, weekend, or live online — all with the same senior trainers and the same curriculum. Fees range from ₹25,000 to ₹45,000 with no-cost EMI and merit-based scholarships up to 30%. Google Ads, Google Analytics and Meta Blueprint certification preparation is included, along with 1 year of placement assistance. Book a free demo class in your preferred batch time — a full 90-minute live session with the actual trainer, not a sales pitch.',
    directAnswer:
      "Telzon Academy runs the best digital marketing classes in Nagpur, rated 4.9/5 from 200+ verified Google reviews, with a 95% placement rate. Class sizes are capped at 20 students for 1:1 attention. Four batch options — weekday morning, weekday evening, weekend, live online — all with the same 16-week curriculum covering SEO, Google Ads, Meta Ads, social media, content, analytics and AI marketing. Live client projects from week 6. Google + Meta certifications included. Fees ₹25,000–₹45,000 with EMI and scholarships. Free demo class available.",
    courseFacts: {
      duration: '16 weeks',
      fees: '₹25,000 – ₹45,000',
      batches: ['Weekday morning (10 AM–12 PM)', 'Weekday evening (6 PM–8 PM)', 'Weekend (Sat–Sun 10 AM–2 PM)', 'Live online (evening + weekend)'],
      certifications: ['Google Ads', 'Google Analytics', 'Meta Blueprint'],
      mode: 'Offline classes in Nagpur + live online',
      nextIntake: 'New batches monthly',
    },
    careerOutcomes: {
      placementRate: '95%',
      averageSalary: '₹3.5 LPA',
      highestSalary: '₹8.5 LPA',
      timeToFirstOffer: '30–60 days post-course',
      hiringPartners: ['Swiggy', 'OLA', 'Nykaa', 'Le Meridien', 'Amul', 'Cloud Intellect'],
      roleTypes: [
        'Digital Marketing Executive',
        'SEO Analyst',
        'Social Media Manager',
        'Google Ads Specialist',
        'Content Marketer',
        'Performance Marketing Manager',
      ],
    },
  },
  {
    slug: 'digital-marketing-course-near-me',
    metaTitle: 'Nearby Digital Marketing Course in Nagpur | Telzon Academy',
    metaDescription: 'Searching "digital marketing course near me" in Nagpur? Telzon Academy is centrally located with easy access from Dharampeth, Sitabuldi, Sadar and Civil Lines.',
    metaKeywords: '',
    ogTitle: 'Digital Marketing Course Near You in Nagpur — Telzon Academy',
    ogDescription: 'Telzon Academy is centrally located in Nagpur. Easy to reach from anywhere in the city. Walk in for a free demo.',
    headline: 'Digital Marketing Course Right Near You in Nagpur',
    subheadline: 'Centrally located in Nagpur with easy access from Dharampeth, Sitabuldi, Sadar, Ramdaspeth and Civil Lines. Also available online.',
    bullets: [
      'Central Nagpur location — easy commute from all areas',
      'Online option for students outside central Nagpur',
      'Walk in any time for a free demo class',
      'Flexible timing so you can study near home'
    ]
  },
  {
    slug: 'digital-marketing-institute-nagpur',
    metaTitle: '#1 Digital Marketing Institute in Nagpur | Telzon Academy',
    metaDescription: 'Telzon Academy is Nagpur\'s top-ranked digital marketing institute. Industry trainers, live projects, Google & Meta certifications and 95% placement success.',
    metaKeywords: '',
    ogTitle: '#1 Digital Marketing Institute in Nagpur — Telzon Academy',
    ogDescription: 'Nagpur\'s top digital marketing institute with 95% placement. Google & Meta certified trainers. Enroll at Telzon Academy.',
    headline: 'Nagpur\'s #1 Digital Marketing Institute',
    subheadline: 'Ranked as Nagpur\'s most trusted digital marketing institute by students and employers alike. Industry-certified trainers, live projects and guaranteed placement.',
    bullets: [
      'Trainers with 5+ years of live industry experience',
      'Google, Meta and HubSpot certification guidance',
      'Live projects on real client campaigns',
      '95% of graduates placed within 60 days'
    ]
  },
  {
    slug: 'performance-marketing-course-nagpur',
    metaTitle: 'Performance Marketing Course in Nagpur | Telzon Academy',
    metaDescription: 'Learn performance marketing in Nagpur at Telzon Academy. Master paid ads, ROI tracking, Meta Ads and Google Ads with real campaigns.',
    metaKeywords: '',
    ogTitle: 'Performance Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Master paid performance marketing at Telzon Academy Nagpur. Real campaigns, real budgets, real results.',
    headline: 'Performance Marketing Course in Nagpur',
    subheadline: 'Go beyond theory — run real paid campaigns with actual budgets. Master Google Ads, Meta Ads, ROI tracking and conversion optimisation.',
    bullets: [
      'Google Ads, Meta Ads and programmatic campaigns',
      'Live campaign management with real ad spend',
      'ROI tracking, attribution and analytics',
      'Freelance and agency job opportunities after course'
    ]
  },
  {
    slug: 'content-marketing-course-nagpur',
    metaTitle: 'Content Marketing Course in Nagpur | Telzon Academy',
    metaDescription: 'Join Telzon Academy\'s content marketing course in Nagpur. Learn blog writing, video scripts, SEO copywriting and brand storytelling.',
    metaKeywords: '',
    ogTitle: 'Content Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Practical content marketing training at Telzon Academy Nagpur. Blogs, video, social and SEO writing covered.',
    headline: 'Content Marketing Course in Nagpur',
    subheadline: 'Words, videos and stories that rank and convert. Our content marketing course teaches you to create content that drives traffic and leads.',
    bullets: [
      'Blog writing, SEO copywriting and long-form content',
      'Video scripts, reels and YouTube content strategy',
      'Social media content calendars and brand voice',
      'Content analytics and performance measurement'
    ]
  },
  {
    slug: 'digital-marketing-course-for-working-professionals-nagpur',
    metaTitle: 'Digital Marketing for Working Professionals | Telzon Academy',
    metaDescription: 'Upgrade with Telzon Academy\'s digital marketing course for working professionals in Nagpur. Weekend batches and flexible online options.',
    metaKeywords: '',
    ogTitle: 'Digital Marketing for Working Professionals — Telzon Academy Nagpur',
    ogDescription: 'Weekend and evening digital marketing batches in Nagpur for working professionals. Flexible and practical at Telzon Academy.',
    headline: 'Digital Marketing Course for Working Professionals',
    subheadline: 'Built for people with full-time jobs. Weekend batches, evening classes and online options let you upskill without quitting your job.',
    bullets: [
      'Saturday & Sunday batch options',
      'Evening weekday classes (6 PM – 9 PM)',
      'Self-paced online modules to catch up anytime',
      'Salary hike and promotion-focused curriculum'
    ]
  },

  // ─── Service/Agency intent (Practo + IndiaMart pattern) ───────────────────
  {
    slug: 'digital-marketing-agency-in-nagpur',
    // Q-004 · 2026-09-12 · pos 38.09 · 55 imps · agency intent (B2B, different funnel).
    metaTitle: 'Digital Marketing Agency in Nagpur — SEO · Google Ads · Meta Ads · Lead Gen | Telzon',
    metaDescription: "Telzon is a full-service digital marketing agency in Nagpur — SEO, Google Ads, Meta Ads, social media, content and lead generation for Nagpur businesses. Transparent monthly reporting. Free 30-min strategy call.",
    metaKeywords: 'digital marketing agency in Nagpur, best digital marketing agency in Nagpur, top digital marketing agency Nagpur, digital marketing services Nagpur, SEO agency Nagpur, Google Ads agency Nagpur',
    ogTitle: 'Digital Marketing Agency in Nagpur — SEO · Ads · Content · Lead Gen | Telzon',
    ogDescription: "Full-service Nagpur agency for SEO, Google Ads, Meta Ads and lead generation. Transparent reporting. Free strategy call.",
    headline: 'Digital Marketing Agency in Nagpur',
    subheadline: 'Beyond training — Telzon runs full digital marketing campaigns for Nagpur businesses. SEO, Google Ads, Meta Ads, content and full-funnel lead generation.',
    bullets: [
      'SEO + Google Ads + Meta Ads + content marketing under one roof — no vendor juggling',
      'Certified team (Google Ads, Google Analytics, Meta Blueprint) — all based in Nagpur',
      'Transparent monthly reporting: leads, cost-per-lead, ROI, ad spend — no fluff metrics',
      'Monthly retainers start ₹15,000/mo (SEO only) up to ₹75,000/mo (full-stack growth)',
      'Weekly 30-min strategy calls with the account manager — not an intern',
      'Live dashboards you can log in to anytime — full visibility on every campaign',
      'Free 30-minute strategy call + full audit of your current digital presence before you commit',
      'Trusted by Nagpur clinics, restaurants, coaching centres, D2C brands, real-estate + more'
    ],
    intro: 'Telzon is Nagpur\'s <strong>full-service digital marketing agency</strong> — SEO, Google Ads, Meta Ads, social media, content marketing, email + WhatsApp funnels and lead generation, all under one roof and all run by our in-house Nagpur team. Unlike vendor-juggling arrangements where you pay 3 different agencies who never talk to each other, one Telzon account manager owns your entire growth stack. Every team member is certified (Google Ads, Google Analytics, Meta Blueprint) and comes from our own 4.9-star-rated training programme, so quality is consistent. Monthly retainers start at ₹15,000/month for SEO-only engagements and go up to ₹75,000/month for full-stack growth packages covering paid + organic + content + landing pages. Reporting is transparent: weekly leads report, monthly ROI breakdown, live dashboard access, no fluff metrics. Our Nagpur clients include clinics, restaurants, real estate agents, coaching centres, D2C brands and B2B service businesses. Book a free 30-minute strategy call — we audit your current digital presence and give you 2–3 specific improvements whether you sign up or not.',
    directAnswer:
      "Telzon is a full-service digital marketing agency in Nagpur offering SEO, Google Ads, Meta Ads, social media management, content marketing and lead generation for local businesses. Our in-house team is Google Ads + Google Analytics + Meta Blueprint certified. Monthly retainers start at ₹15,000 (SEO only) up to ₹75,000 (full-stack growth). Transparent weekly reporting, live dashboards, dedicated account manager. Free 30-minute strategy call available — includes a full audit of your current digital presence.",
  },
  {
    slug: 'digital-marketing-services-in-nagpur',
    metaTitle: 'Digital Marketing Services in Nagpur | Telzon Academy',
    metaDescription: 'Complete digital marketing services in Nagpur — SEO, social media, Google Ads, content marketing and website development. Affordable plans for local businesses.',
    metaKeywords: 'digital marketing services in Nagpur, digital marketing services Nagpur, SEO services Nagpur, online marketing services',
    ogTitle: 'Digital Marketing Services in Nagpur — Telzon',
    ogDescription: 'End-to-end digital marketing services for Nagpur businesses. SEO, ads, social and content.',
    headline: 'Digital Marketing Services in Nagpur',
    subheadline: 'Everything your Nagpur business needs to grow online — under one roof. Choose individual services or full-stack growth packages.',
    bullets: [
      'SEO & Google Business Profile optimisation',
      'Google Ads & Meta Ads campaign management',
      'Social media management & content production',
      'Website design + lead generation funnels'
    ]
  },
  {
    slug: 'seo-services-in-nagpur',
    metaTitle: 'SEO Services in Nagpur | Rank #1 on Google with Telzon',
    metaDescription: 'Affordable, white-hat SEO services in Nagpur. Local SEO, Google Business Profile, content and link building. Rank higher and get more leads with Telzon.',
    metaKeywords: 'SEO services in Nagpur, SEO company Nagpur, local SEO Nagpur, Nagpur SEO agency',
    ogTitle: 'SEO Services in Nagpur — Telzon Academy',
    ogDescription: 'Local SEO + content + technical audits to rank Nagpur businesses on Google.',
    headline: 'SEO Services in Nagpur',
    subheadline: 'Get found by customers actively searching in Nagpur. Our local SEO process ranks you for the keywords that bring real revenue.',
    bullets: [
      'Local SEO & Google Business Profile mastery',
      'Technical audit, on-page fixes and schema',
      'Local citation building & competitor outranking',
      'Monthly reports — every keyword tracked'
    ]
  },
  {
    slug: 'seo-freelancer-in-nagpur',
    metaTitle: 'SEO Freelancer in Nagpur | Telzon Certified Experts',
    metaDescription: 'Hire vetted SEO freelancers in Nagpur trained by Telzon Academy. Affordable rates for local businesses, startups and agencies. Free consultation.',
    metaKeywords: 'SEO freelancer in Nagpur, SEO freelancer Nagpur, freelance SEO expert Nagpur, hire SEO Nagpur',
    ogTitle: 'SEO Freelancer in Nagpur — Telzon Certified',
    ogDescription: 'Hire freelance SEO experts in Nagpur. Telzon-trained, transparent rates, real results.',
    headline: 'SEO Freelancer in Nagpur',
    subheadline: 'Need an SEO freelancer in Nagpur without agency overhead? Our network of Telzon-certified freelancers handles audits, on-page, link building and local SEO at fair rates.',
    bullets: [
      'All freelancers trained & certified by Telzon Academy',
      'Transparent monthly pricing — no surprise bills',
      'Local Nagpur SEO + India-wide service capability',
      'Free 20-minute audit call before you hire'
    ]
  },
  {
    slug: 'social-media-marketing-agency-in-nagpur',
    metaTitle: 'Social Media Marketing Agency in Nagpur | Telzon',
    metaDescription: 'Top social media marketing agency in Nagpur. Instagram, Facebook, LinkedIn and YouTube growth for Nagpur brands, restaurants, clinics and shops.',
    metaKeywords: 'social media marketing agency in Nagpur, social media company Nagpur, Instagram marketing Nagpur, Facebook marketing Nagpur',
    ogTitle: 'Social Media Marketing Agency in Nagpur — Telzon',
    ogDescription: 'Grow your Nagpur brand on Instagram, Facebook, LinkedIn and YouTube with Telzon.',
    headline: 'Social Media Marketing Agency in Nagpur',
    subheadline: 'From restaurant reels to clinic Instagram pages and B2B LinkedIn — we run full social media management for Nagpur brands. Content, ads, growth.',
    bullets: [
      'Daily content creation, posting and community management',
      'Paid ad campaigns on Meta, LinkedIn, YouTube',
      'Influencer marketing with Nagpur creators',
      'Monthly analytics dashboard with ROI breakdown'
    ]
  },

  // ─── Top/list pages (Practo "Best of" pattern) ────────────────────────────
  {
    slug: 'top-10-digital-marketing-institutes-in-nagpur',
    metaTitle: 'Top 10 Digital Marketing Institutes in Nagpur 2026 | Telzon',
    metaDescription: 'List of the top 10 digital marketing institutes in Nagpur for 2026. Compare fees, courses, placement records and student reviews. #1 ranked: Telzon Academy.',
    metaKeywords: 'top 10 digital marketing institute in nagpur, top digital marketing institutes Nagpur, best digital marketing institutes 2026 Nagpur',
    ogTitle: 'Top 10 Digital Marketing Institutes in Nagpur 2026',
    ogDescription: 'The definitive list of best digital marketing institutes in Nagpur — fees, placement, reviews compared.',
    headline: 'Top 10 Digital Marketing Institutes in Nagpur 2026',
    subheadline: 'A side-by-side comparison of fees, course quality, placement records and student reviews for Nagpur\'s top 10 institutes — with Telzon Academy ranked #1.',
    bullets: [
      'Fees, duration and curriculum compared head-to-head',
      'Placement track record verified for each institute',
      'Real student reviews from Nagpur',
      'Updated for 2026 with latest course offerings'
    ]
  },
  {
    slug: 'top-digital-marketing-courses-in-nagpur-2026',
    metaTitle: 'Top Digital Marketing Courses in Nagpur 2026 | Compared',
    metaDescription: 'Top digital marketing courses in Nagpur for 2026 — compare syllabus, fees, placement and reviews. Find the right course for your career goals.',
    metaKeywords: 'top digital marketing courses in Nagpur, best digital marketing courses 2026, top courses Nagpur',
    ogTitle: 'Top Digital Marketing Courses in Nagpur 2026',
    ogDescription: 'Compare the best digital marketing courses in Nagpur — syllabus, fees, placement and reviews side-by-side.',
    headline: 'Top Digital Marketing Courses in Nagpur 2026',
    subheadline: 'A practical, no-fluff comparison of every major digital marketing course offered in Nagpur. Fees, modules, projects, placement — everything you need to decide.',
    bullets: [
      'Curriculum compared module-by-module',
      'Total fees including hidden charges revealed',
      'Placement support & alumni outcomes verified',
      'Updated monthly — newest courses included'
    ]
  },
  {
    slug: 'best-digital-marketing-agency-in-nagpur',
    metaTitle: 'Best Digital Marketing Agency in Nagpur | Telzon Academy',
    metaDescription: 'Looking for the best digital marketing agency in Nagpur? Telzon Academy runs SEO, Google Ads, Meta Ads and full marketing for Nagpur businesses. ⭐ 4.9/5.',
    metaKeywords: 'best digital marketing agency in Nagpur, top marketing agency Nagpur, top digital agency Nagpur',
    ogTitle: 'Best Digital Marketing Agency in Nagpur — Telzon',
    ogDescription: 'Top-rated digital marketing agency in Nagpur. Real campaigns, real ROI for Nagpur businesses.',
    headline: 'Best Digital Marketing Agency in Nagpur',
    subheadline: 'Telzon Academy isn\'t just a training institute — it\'s the agency Nagpur businesses trust for SEO, ads and full digital growth. Run by certified experts.',
    bullets: [
      '⭐ 4.9/5 rating from 200+ Nagpur clients',
      'SEO, Google Ads, Meta Ads, content & web combined',
      'In-house Nagpur team — no overseas freelancers',
      'Money-back guarantee on first 30 days'
    ]
  },

  // ─── Locality pages (Zomato/IndiaMart hyper-local pattern) ──────────────
  {
    slug: 'digital-marketing-course-in-dharampeth-nagpur',
    metaTitle: 'Digital Marketing Course in Dharampeth, Nagpur | Telzon Academy',
    metaDescription: 'Best digital marketing course near Dharampeth, Nagpur. Walk in from Variety Square, Wing Square or Dharampeth Metro. Live projects + 95% placement.',
    metaKeywords: 'digital marketing course in Dharampeth, digital marketing Dharampeth Nagpur, marketing course Dharampeth',
    ogTitle: 'Digital Marketing Course in Dharampeth, Nagpur — Telzon',
    ogDescription: 'Easily reachable from Dharampeth, Variety Square and Wing Square. Live projects + placement.',
    headline: 'Digital Marketing Course in Dharampeth, Nagpur',
    subheadline: 'Telzon Academy is the closest premium digital marketing institute for students and professionals in Dharampeth — easy walk from Variety Square, Wing Square and Dharampeth Metro.',
    bullets: [
      '10-min walk from Variety Square — easy commute',
      'Convenient batches for Dharampeth working professionals',
      'Same Telzon curriculum — live projects, placement, Google certification',
      'Free demo class — drop in any Saturday'
    ]
  },
  {
    slug: 'digital-marketing-course-in-sitabuldi-nagpur',
    metaTitle: 'Digital Marketing Course in Sitabuldi, Nagpur | Telzon',
    metaDescription: 'Top digital marketing course near Sitabuldi market, Nagpur. Easy from Sitabuldi Metro, Munje Square and Zero Mile. AI tools + placement support.',
    metaKeywords: 'digital marketing course in Sitabuldi, marketing course Sitabuldi Nagpur, digital marketing Sitabuldi',
    ogTitle: 'Digital Marketing Course in Sitabuldi, Nagpur — Telzon',
    ogDescription: 'Easy from Sitabuldi Market, Zero Mile and Sitabuldi Metro. Telzon Academy.',
    headline: 'Digital Marketing Course in Sitabuldi, Nagpur',
    subheadline: 'Living or working around Sitabuldi market, Munje Square or Zero Mile? Telzon Academy is your closest practical, AI-powered digital marketing institute.',
    bullets: [
      'Easy commute from Sitabuldi Metro & Sitabuldi market',
      'Weekend batches ideal for Sitabuldi shop owners',
      'Same comprehensive curriculum — SEO, Ads, Social',
      'Walk in for a free demo before you decide'
    ]
  },
  {
    slug: 'digital-marketing-course-in-sadar-nagpur',
    metaTitle: 'Digital Marketing Course in Sadar, Nagpur | Telzon Academy',
    metaDescription: 'Best digital marketing course near Sadar, Nagpur. Convenient for residents of Sadar, Civil Lines and Mount Road. Live projects, AI tools, placement.',
    metaKeywords: 'digital marketing course in Sadar, marketing course Sadar Nagpur, digital marketing Sadar',
    ogTitle: 'Digital Marketing Course in Sadar, Nagpur — Telzon',
    ogDescription: 'Convenient digital marketing institute for Sadar and Civil Lines residents. Telzon Academy.',
    headline: 'Digital Marketing Course in Sadar, Nagpur',
    subheadline: 'For Sadar, Civil Lines and Mount Road residents — Telzon Academy is the closest comprehensive digital marketing institute with weekend and weekday batches.',
    bullets: [
      'Quick commute from Sadar, Civil Lines, Mount Road',
      'AI-powered curriculum — ChatGPT, Canva, SurferSEO',
      '95% placement record across Nagpur and India',
      'Free demo class every Saturday'
    ]
  },
  {
    slug: 'digital-marketing-course-in-pratap-nagar-nagpur',
    metaTitle: 'Digital Marketing Course in Pratap Nagar, Nagpur | Telzon',
    metaDescription: 'Practical digital marketing course near Pratap Nagar, Nagpur. Easy from Pratap Nagar Square, Khamla and Trimurti Nagar. Live projects + 95% placement.',
    metaKeywords: 'digital marketing course in Pratap Nagar, marketing course Pratap Nagar Nagpur',
    ogTitle: 'Digital Marketing Course in Pratap Nagar, Nagpur — Telzon',
    ogDescription: 'Convenient for Pratap Nagar, Khamla and Trimurti Nagar residents. Telzon Academy.',
    headline: 'Digital Marketing Course in Pratap Nagar, Nagpur',
    subheadline: 'Living in Pratap Nagar, Khamla or Trimurti Nagar? Telzon Academy is the practical choice — live projects, AI tools, weekend & weekday batches.',
    bullets: [
      'Easy commute from Pratap Nagar, Khamla, Trimurti Nagar',
      'Same Telzon curriculum at no extra cost',
      'Live client projects — not just theory',
      'Free demo + free roadmap call'
    ]
  },
  {
    slug: 'digital-marketing-course-in-ramdaspeth-nagpur',
    metaTitle: 'Digital Marketing Course in Ramdaspeth, Nagpur | Telzon',
    metaDescription: 'Top digital marketing course near Ramdaspeth, Nagpur. Walk in from West High Court Road or Mount Road. Live projects, Google certification, placement.',
    metaKeywords: 'digital marketing course in Ramdaspeth, marketing course Ramdaspeth Nagpur',
    ogTitle: 'Digital Marketing Course in Ramdaspeth, Nagpur — Telzon',
    ogDescription: 'Easy access for Ramdaspeth and West High Court Road residents. Telzon Academy.',
    headline: 'Digital Marketing Course in Ramdaspeth, Nagpur',
    subheadline: 'Ramdaspeth & West High Court Road residents — Telzon Academy is your nearest premium digital marketing institute. Practical training, real projects, 95% placement.',
    bullets: [
      'Easy reach from Ramdaspeth, West High Court Road',
      'Hands-on training with real client campaigns',
      'Google, Meta, HubSpot certification guidance',
      'Weekend and evening batch flexibility'
    ]
  },

  // ─── Career intent pages ──────────────────────────────────────────────────
  {
    slug: 'digital-marketing-jobs-in-nagpur',
    metaTitle: 'Digital Marketing Jobs in Nagpur | Salary, Companies, Roles',
    metaDescription: 'Digital marketing jobs in Nagpur — current openings, salary ranges (₹2.5L–₹8L), top hiring companies and how to land your first role. Free placement help.',
    metaKeywords: 'digital marketing jobs in Nagpur, digital marketing jobs Nagpur, marketing executive jobs Nagpur, SEO jobs Nagpur',
    ogTitle: 'Digital Marketing Jobs in Nagpur — Salaries & Openings',
    ogDescription: 'Find digital marketing jobs in Nagpur. Salary ranges, top companies, and placement help from Telzon.',
    headline: 'Digital Marketing Jobs in Nagpur',
    subheadline: 'A complete guide to digital marketing jobs in Nagpur in 2026 — salary ranges, top hiring companies, in-demand roles, and how Telzon Academy gets you placed.',
    bullets: [
      'Salary ranges: ₹2.5 LPA (entry) to ₹12 LPA (senior)',
      'Top hiring companies in and around Nagpur listed',
      'In-demand roles: SEO, Performance Marketer, Social Media',
      'Free placement assistance for Telzon students'
    ]
  },
  {
    slug: 'digital-marketing-salary-in-nagpur',
    metaTitle: 'Digital Marketing Salary in Nagpur 2026 | Complete Guide',
    metaDescription: 'Digital marketing salary in Nagpur 2026 — fresher (₹2.5L), 1-3 yrs (₹4.5L), 3-5 yrs (₹7L) and senior (₹12L+). Salary by role, skill and certification.',
    metaKeywords: 'digital marketing salary in Nagpur, digital marketing salary 2026 Nagpur, SEO salary Nagpur, social media salary Nagpur',
    ogTitle: 'Digital Marketing Salary in Nagpur 2026 — Real Data',
    ogDescription: 'Real digital marketing salary data for Nagpur in 2026 — by role, experience and skill.',
    headline: 'Digital Marketing Salary in Nagpur 2026',
    subheadline: 'Honest, no-fluff salary data for digital marketing roles in Nagpur — fresher to senior — broken down by role, experience and certifications.',
    bullets: [
      'Fresher salary: ₹2.5–₹3.5 LPA in 2026',
      '1-3 years experience: ₹4.5–₹6 LPA',
      '3-5 years senior roles: ₹7–₹12 LPA',
      'Freelance: ₹40K–₹1.5L per month'
    ]
  },
  {
    slug: 'digital-marketing-career-after-12th-nagpur',
    metaTitle: 'Digital Marketing Career After 12th in Nagpur | Telzon',
    metaDescription: 'Start your digital marketing career after 12th in Nagpur. Course path, salary, jobs and step-by-step roadmap from Telzon Academy. Free counselling.',
    metaKeywords: 'digital marketing after 12th, digital marketing career after 12th Nagpur, marketing course after 12th Nagpur',
    ogTitle: 'Digital Marketing Career After 12th in Nagpur',
    ogDescription: 'After 12th, start a digital marketing career in 6 months. Roadmap, fees and jobs explained.',
    headline: 'Digital Marketing Career After 12th in Nagpur',
    subheadline: 'Just finished 12th and unsure about a career? Digital marketing in Nagpur pays well, hires fast, and only needs 4–6 months of training. Here\'s the complete roadmap.',
    bullets: [
      'No degree required — start in 4–6 months',
      'Starting salary ₹2.5L; reach ₹6L in 2 years',
      'Telzon offers a special after-12th batch with mentorship',
      'Free career counselling — book a call today'
    ]
  },

  // ─── Audience-targeted pages ──────────────────────────────────────────────
  {
    slug: 'digital-marketing-course-for-students-in-nagpur',
    metaTitle: 'Digital Marketing Course for Students in Nagpur | Telzon',
    metaDescription: 'Special digital marketing course for college students in Nagpur. Affordable fees, weekend batches, internship + placement. Build a portfolio while you study.',
    metaKeywords: 'digital marketing course for students in Nagpur, marketing course college students Nagpur, student digital marketing Nagpur',
    ogTitle: 'Digital Marketing Course for Students in Nagpur — Telzon',
    ogDescription: 'Affordable, student-friendly digital marketing course in Nagpur. Internship + portfolio.',
    headline: 'Digital Marketing Course for Students in Nagpur',
    subheadline: 'Designed for BCom/BBA/BCA/Engineering students in Nagpur — weekend batches, lower fees, internship and a real portfolio you can show in placements.',
    bullets: [
      'Special student fee with EMI from ₹2,500/month',
      'Weekend & evening batches around college timings',
      'Live internship — real portfolio for placements',
      'Resume + LinkedIn workshop included'
    ]
  },
  {
    slug: 'digital-marketing-course-after-graduation-nagpur',
    metaTitle: 'Digital Marketing Course After Graduation in Nagpur | Telzon',
    metaDescription: 'Best digital marketing course after graduation in Nagpur. Job-oriented curriculum, placement support and certification. Land your first marketing role in 60 days.',
    metaKeywords: 'digital marketing after graduation, marketing course after graduation Nagpur, after BCom digital marketing Nagpur',
    ogTitle: 'Digital Marketing Course After Graduation — Nagpur',
    ogDescription: 'Job-oriented digital marketing course after graduation. 60-day placement.',
    headline: 'Digital Marketing Course After Graduation in Nagpur',
    subheadline: 'Just graduated? Skip the unpaid internship route — Telzon\'s job-oriented digital marketing course gets graduates placed within 60 days, with Google + Meta certifications.',
    bullets: [
      'Job-oriented modules built around placement requirements',
      'Average placement time: 30–60 days',
      'Google Ads + Meta Blueprint certification included',
      'Resume + interview prep + mock interviews'
    ]
  },
  {
    slug: 'weekend-digital-marketing-course-in-nagpur',
    metaTitle: 'Weekend Digital Marketing Course in Nagpur | Telzon',
    metaDescription: 'Weekend digital marketing course in Nagpur — Saturday & Sunday batches for working professionals and students. Same syllabus, full placement support.',
    metaKeywords: 'weekend digital marketing course Nagpur, Saturday Sunday batch Nagpur, weekend marketing course',
    ogTitle: 'Weekend Digital Marketing Course in Nagpur — Telzon',
    ogDescription: 'Saturday + Sunday batches in Nagpur for working professionals and college students.',
    headline: 'Weekend Digital Marketing Course in Nagpur',
    subheadline: 'Sat–Sun batches at Telzon Academy — built for working professionals and college students who can\'t attend weekday classes. Full curriculum, real projects, real placement.',
    bullets: [
      'Saturday + Sunday, 10 AM – 2 PM',
      'Same modules and live projects as weekday batch',
      'Recorded sessions for revision',
      'Same 95% placement support'
    ]
  },

  // ─── More locality pages (full Nagpur coverage — IndiaMart pattern) ───
  {
    slug: 'digital-marketing-course-in-civil-lines-nagpur',
    metaTitle: 'Digital Marketing Course in Civil Lines, Nagpur | Telzon',
    metaDescription: 'Top digital marketing course near Civil Lines, Nagpur. Easy from Maharaja Square, Mansion Road and Mount Road. AI tools + 95% placement support.',
    metaKeywords: 'digital marketing course in Civil Lines Nagpur, marketing course Civil Lines',
    ogTitle: 'Digital Marketing Course in Civil Lines, Nagpur — Telzon',
    ogDescription: 'Convenient for Civil Lines, Mansion Road and Maharaja Square residents.',
    headline: 'Digital Marketing Course in Civil Lines, Nagpur',
    subheadline: 'Living or working in Civil Lines, Mansion Road or near Maharaja Square? Telzon Academy is your closest premium digital marketing institute with weekend, weekday and online options.',
    bullets: [
      'Quick commute from Civil Lines and Mansion Road',
      'Special evening batches for Civil Lines professionals',
      'Live client projects + Google/Meta certification',
      'Free demo class every Saturday — walk in any time'
    ]
  },
  {
    slug: 'digital-marketing-course-in-itwari-nagpur',
    metaTitle: 'Digital Marketing Course in Itwari, Nagpur | Telzon Academy',
    metaDescription: 'Best digital marketing course near Itwari, Nagpur. Convenient for Bhandara Road, Mahal and Gandhibagh business owners. Live campaigns + placement.',
    metaKeywords: 'digital marketing course in Itwari Nagpur, marketing course Itwari',
    ogTitle: 'Digital Marketing Course in Itwari, Nagpur — Telzon',
    ogDescription: 'Built for Itwari and Mahal shop owners and traders. Real digital marketing for your business.',
    headline: 'Digital Marketing Course in Itwari, Nagpur',
    subheadline: 'Itwari, Mahal, Gandhibagh business owners and traders — learn the same digital marketing that big brands use. Special module on WhatsApp marketing for local shops.',
    bullets: [
      'WhatsApp marketing module for Itwari traders',
      'Local SEO + Google Business Profile training',
      'Run Meta Ads to drive walk-ins to your shop',
      'Weekend batch — no impact on weekday business'
    ]
  },
  {
    slug: 'digital-marketing-course-in-gandhibagh-nagpur',
    metaTitle: 'Digital Marketing Course in Gandhibagh, Nagpur | Telzon',
    metaDescription: 'Practical digital marketing course near Gandhibagh, Nagpur. Built for shop owners and entrepreneurs around Mahal and Itwari area. Live, project-based.',
    metaKeywords: 'digital marketing course in Gandhibagh, marketing course Gandhibagh Nagpur',
    ogTitle: 'Digital Marketing Course in Gandhibagh, Nagpur — Telzon',
    ogDescription: 'Practical digital marketing for Gandhibagh business owners and freelancers.',
    headline: 'Digital Marketing Course in Gandhibagh, Nagpur',
    subheadline: 'Gandhibagh, Mahal and Bada Tajbagh entrepreneurs — Telzon Academy teaches the digital marketing that brings real customers to your shop or service business.',
    bullets: [
      'Designed for Gandhibagh shop owners and freelancers',
      'Local SEO + Google Maps optimisation included',
      'Special weekend batch for working professionals',
      'Free 30-minute strategy call before you enroll'
    ]
  },
  {
    slug: 'digital-marketing-course-in-wardhaman-nagar-nagpur',
    metaTitle: 'Digital Marketing Course in Wardhaman Nagar, Nagpur | Telzon',
    metaDescription: 'Top digital marketing course near Wardhaman Nagar, Nagpur. Convenient for residents of Wardhaman Nagar, Pardi and Manish Nagar. Practical and job-oriented.',
    metaKeywords: 'digital marketing course in Wardhaman Nagar, marketing course Wardhaman Nagar',
    ogTitle: 'Digital Marketing Course in Wardhaman Nagar, Nagpur — Telzon',
    ogDescription: 'Convenient for Wardhaman Nagar, Pardi and Manish Nagar residents. Telzon Academy.',
    headline: 'Digital Marketing Course in Wardhaman Nagar, Nagpur',
    subheadline: 'Wardhaman Nagar, Pardi and Manish Nagar residents — Telzon Academy is your nearest practical, AI-powered digital marketing institute. Comprehensive curriculum, live projects, real placement support.',
    bullets: [
      'Easy commute from Wardhaman Nagar and Pardi',
      'Same Telzon curriculum — no compromise',
      'Live client projects, not just classroom theory',
      'Weekend + evening batch options available'
    ]
  },
  {
    slug: 'digital-marketing-course-in-manewada-nagpur',
    metaTitle: 'Digital Marketing Course in Manewada, Nagpur | Telzon',
    metaDescription: 'Best digital marketing course near Manewada, Nagpur. Easy reach from Beltarodi, Besa and Manewada Square. Live projects, AI tools, 95% placement.',
    metaKeywords: 'digital marketing course in Manewada Nagpur, marketing course Manewada',
    ogTitle: 'Digital Marketing Course in Manewada, Nagpur — Telzon',
    ogDescription: 'Closest premium institute for Manewada, Beltarodi and Besa residents.',
    headline: 'Digital Marketing Course in Manewada, Nagpur',
    subheadline: 'Manewada, Beltarodi and Besa residents — Telzon Academy is the closest comprehensive digital marketing institute. Live projects, AI curriculum, 95% placement.',
    bullets: [
      'Easy commute from Manewada, Beltarodi, Besa',
      'AI-first curriculum — ChatGPT, Canva, SurferSEO',
      'Real client campaigns with measurable results',
      'Weekend + evening batches for flexibility'
    ]
  },
  {
    slug: 'digital-marketing-course-in-hingna-nagpur',
    metaTitle: 'Digital Marketing Course in Hingna, Nagpur | Telzon',
    metaDescription: 'Practical digital marketing course near Hingna, Nagpur. Convenient for Hingna MIDC, Wadi and Khapri residents. Online + offline options. Real projects.',
    metaKeywords: 'digital marketing course in Hingna Nagpur, marketing course Hingna',
    ogTitle: 'Digital Marketing Course in Hingna, Nagpur — Telzon',
    ogDescription: 'Online + offline digital marketing course for Hingna, MIDC and Wadi residents.',
    headline: 'Digital Marketing Course in Hingna, Nagpur',
    subheadline: 'Hingna, MIDC area, Wadi and Khapri residents — Telzon Academy offers both online live classes and offline batches in central Nagpur. Choose what works for your commute.',
    bullets: [
      'Fully online live batches — no commute needed',
      'Offline central Nagpur option also available',
      'Same trainers and curriculum across both modes',
      'Special module for Hingna MIDC business owners'
    ]
  },
  {
    slug: 'digital-marketing-course-in-amravati-road-nagpur',
    metaTitle: 'Digital Marketing Course Near Amravati Road, Nagpur | Telzon',
    metaDescription: 'Top digital marketing course near Amravati Road, Nagpur. Convenient for residents of Subhash Nagar, Boriapura and Pratap Nagar. Live projects + placement.',
    metaKeywords: 'digital marketing course Amravati Road Nagpur, marketing course near Amravati Road',
    ogTitle: 'Digital Marketing Course Near Amravati Road, Nagpur — Telzon',
    ogDescription: 'Convenient for Amravati Road, Subhash Nagar and Boriapura residents.',
    headline: 'Digital Marketing Course Near Amravati Road, Nagpur',
    subheadline: 'Amravati Road, Subhash Nagar, Boriapura and Pratap Nagar residents — Telzon Academy is your nearest premium digital marketing institute with weekend, evening and online options.',
    bullets: [
      'Easy reach from Amravati Road and Subhash Nagar',
      'Same comprehensive Telzon curriculum',
      'Live client projects and placement support',
      'Free demo class — no commitment required'
    ]
  },
  {
    slug: 'digital-marketing-course-in-wardha-road-nagpur',
    metaTitle: 'Digital Marketing Course Near Wardha Road, Nagpur | Telzon',
    metaDescription: 'Best digital marketing course near Wardha Road, Nagpur. Convenient for Khapri, Manish Nagar, Trimurti Nagar residents. Practical AI-powered curriculum.',
    metaKeywords: 'digital marketing course Wardha Road Nagpur, marketing course near Wardha Road',
    ogTitle: 'Digital Marketing Course Near Wardha Road, Nagpur — Telzon',
    ogDescription: 'Easy access for Wardha Road, Khapri, Manish Nagar and Trimurti Nagar.',
    headline: 'Digital Marketing Course Near Wardha Road, Nagpur',
    subheadline: 'Wardha Road, Khapri, Manish Nagar, Trimurti Nagar residents — Telzon Academy is centrally accessible with weekday, weekend and online batch options.',
    bullets: [
      'Quick commute from Wardha Road and Khapri',
      'AI-powered curriculum and live client work',
      'Google + Meta certification guidance',
      '95% placement record across India'
    ]
  },
  {
    slug: 'digital-marketing-course-in-katol-road-nagpur',
    metaTitle: 'Digital Marketing Course Near Katol Road, Nagpur | Telzon',
    metaDescription: 'Practical digital marketing course near Katol Road, Nagpur. Convenient for residents of Katol Road, Kalmana and Kalmeshwar. Online + offline batches.',
    metaKeywords: 'digital marketing course Katol Road Nagpur',
    ogTitle: 'Digital Marketing Course Near Katol Road, Nagpur — Telzon',
    ogDescription: 'Online + offline digital marketing for Katol Road, Kalmana and surrounding areas.',
    headline: 'Digital Marketing Course Near Katol Road, Nagpur',
    subheadline: 'Katol Road, Kalmana and Kalmeshwar residents — Telzon Academy offers both online live batches and central Nagpur offline classes. Pick what works for you.',
    bullets: [
      'Fully online live option — no commute',
      'Central Nagpur offline option also available',
      'Same trainers, curriculum and placement support',
      'Free roadmap call before enrollment'
    ]
  },
  {
    slug: 'digital-marketing-course-in-kamptee-road-nagpur',
    metaTitle: 'Digital Marketing Course Near Kamptee Road, Nagpur | Telzon',
    metaDescription: 'Top digital marketing course near Kamptee Road, Nagpur. Convenient for residents of Kadbi Chowk, Indora and Kamptee. AI tools, live projects, placement.',
    metaKeywords: 'digital marketing course Kamptee Road Nagpur',
    ogTitle: 'Digital Marketing Course Near Kamptee Road, Nagpur — Telzon',
    ogDescription: 'Convenient for Kamptee Road, Kadbi Chowk and Indora residents.',
    headline: 'Digital Marketing Course Near Kamptee Road, Nagpur',
    subheadline: 'Kamptee Road, Kadbi Chowk and Indora residents — Telzon Academy is your nearest comprehensive digital marketing institute with practical, AI-powered curriculum.',
    bullets: [
      'Easy commute from Kamptee Road and Kadbi Chowk',
      'AI tools, live projects and Google certification',
      'Special evening batches for working professionals',
      'Free demo class every Saturday'
    ]
  },

  // ─── Platform-specific course pages ────────────────────────────────────
  {
    slug: 'facebook-ads-course-in-nagpur',
    metaTitle: 'Facebook Ads Course in Nagpur | Master Meta Ads with Telzon',
    metaDescription: 'Practical Facebook & Meta Ads course in Nagpur. Learn Advantage+, retargeting, audience targeting and Pixel + CAPI setup. Live ad spend + certification.',
    metaKeywords: 'Facebook ads course in Nagpur, Meta ads course Nagpur, Facebook marketing course Nagpur',
    ogTitle: 'Facebook Ads Course in Nagpur — Telzon Academy',
    ogDescription: 'Master Facebook Ads in Nagpur with live campaigns and real ad spend. Telzon Academy.',
    headline: 'Facebook Ads Course in Nagpur',
    subheadline: 'Run profitable Facebook and Instagram ad campaigns from day one. Our hands-on course covers Advantage+, retargeting, Pixel + Conversions API and creative strategy.',
    bullets: [
      'Advantage+ Shopping & Lead campaigns mastered',
      'Pixel + CAPI server-side setup walk-through',
      'Live campaign with real budget during course',
      'Meta Blueprint certification preparation'
    ]
  },
  {
    slug: 'instagram-marketing-course-in-nagpur',
    metaTitle: 'Instagram Marketing Course in Nagpur | Reels, Ads, Growth',
    metaDescription: 'Practical Instagram marketing course in Nagpur. Reels strategy, organic growth, paid ads and influencer marketing. Real campaigns + portfolio building.',
    metaKeywords: 'Instagram marketing course Nagpur, Instagram course Nagpur, Reels course Nagpur',
    ogTitle: 'Instagram Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Master Instagram growth, Reels and ads at Telzon Academy Nagpur.',
    headline: 'Instagram Marketing Course in Nagpur',
    subheadline: 'From zero to viral — learn Instagram organic growth, Reels strategy, paid ads and influencer marketing. Build a portfolio you can show clients or employers.',
    bullets: [
      'Reels strategy, hooks, edits and hashtags',
      'Organic growth + Instagram SEO',
      'Paid ads — Stories, Reels, Feed, Explore',
      'Influencer marketing & creator partnerships'
    ]
  },
  {
    slug: 'youtube-marketing-course-in-nagpur',
    metaTitle: 'YouTube Marketing Course in Nagpur | SEO, Ads, Monetization',
    metaDescription: 'Complete YouTube marketing course in Nagpur. Channel SEO, video editing basics, Shorts strategy, YouTube Ads and monetization. Real channel growth project.',
    metaKeywords: 'YouTube marketing course Nagpur, YouTube SEO course Nagpur, YouTube channel course',
    ogTitle: 'YouTube Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Master YouTube SEO, ads and growth at Telzon Academy Nagpur.',
    headline: 'YouTube Marketing Course in Nagpur',
    subheadline: 'YouTube is the second largest search engine — and the best place to build a personal brand. Our course covers channel SEO, Shorts, ads and monetization.',
    bullets: [
      'Channel SEO + thumbnail/title optimisation',
      'Shorts strategy + retention tactics',
      'YouTube Ads (TrueView, In-stream, Discovery)',
      'Monetization, Super Chat, brand deals'
    ]
  },
  {
    slug: 'linkedin-marketing-course-in-nagpur',
    metaTitle: 'LinkedIn Marketing Course in Nagpur | B2B Lead Generation',
    metaDescription: 'Practical LinkedIn marketing course in Nagpur. Personal branding, content, LinkedIn Ads and B2B lead generation. Built for professionals and freelancers.',
    metaKeywords: 'LinkedIn marketing course Nagpur, LinkedIn course Nagpur, B2B marketing course Nagpur',
    ogTitle: 'LinkedIn Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Master LinkedIn for B2B lead generation and personal branding at Telzon Nagpur.',
    headline: 'LinkedIn Marketing Course in Nagpur',
    subheadline: 'LinkedIn is the highest-ROI B2B platform in 2026. Learn personal branding, content strategy, Sales Navigator, LinkedIn Ads and proven lead gen frameworks.',
    bullets: [
      'Personal branding + profile optimisation',
      'Content strategy that drives inbound leads',
      'Sales Navigator + cold outreach playbooks',
      'LinkedIn Ads — Sponsored Content & Lead Gen Forms'
    ]
  },
  {
    slug: 'email-marketing-course-in-nagpur',
    metaTitle: 'Email Marketing Course in Nagpur | Mailchimp, Klaviyo, Resend',
    metaDescription: 'Complete email marketing course in Nagpur. Mailchimp, Klaviyo, automation, segmentation, copywriting and deliverability. Real campaign building during course.',
    metaKeywords: 'email marketing course Nagpur, Mailchimp course Nagpur, Klaviyo course',
    ogTitle: 'Email Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Master email marketing with Mailchimp, Klaviyo and automation at Telzon Nagpur.',
    headline: 'Email Marketing Course in Nagpur',
    subheadline: 'Email still has the highest ROI of any digital channel. Learn list building, automation, segmentation, copy that converts and deliverability best practices.',
    bullets: [
      'Mailchimp, Klaviyo and Resend hands-on training',
      'Welcome, abandoned-cart and re-engagement flows',
      'Email copywriting + subject line A/B testing',
      'Deliverability, SPF, DKIM and DMARC setup'
    ]
  },
  {
    slug: 'whatsapp-marketing-course-in-nagpur',
    metaTitle: 'WhatsApp Marketing Course in Nagpur | Business API, Catalog',
    metaDescription: 'Practical WhatsApp marketing course in Nagpur. WhatsApp Business API, broadcasts, automation, catalog and chat funnels for Nagpur shops and service businesses.',
    metaKeywords: 'WhatsApp marketing course Nagpur, WhatsApp Business course, chat marketing Nagpur',
    ogTitle: 'WhatsApp Marketing Course in Nagpur — Telzon Academy',
    ogDescription: 'Built for Nagpur shop owners and service businesses. WhatsApp Business + automation.',
    headline: 'WhatsApp Marketing Course in Nagpur',
    subheadline: 'In India, WhatsApp converts better than email. Learn WhatsApp Business API, broadcasts, catalog setup, chat funnels and automation — perfect for Nagpur shops and services.',
    bullets: [
      'WhatsApp Business API setup and message templates',
      'Catalog + product showcase for Nagpur shops',
      'Broadcast lists vs Status vs paid ads',
      'Chatbot automation + lead qualification flows'
    ]
  },

  // ─── Hub page for "digital marketing in Nagpur" ────────────────────────
  {
    slug: 'digital-marketing-in-nagpur',
    metaTitle: 'Digital Marketing in Nagpur 2026 | Courses, Jobs, Agencies, Salary',
    metaDescription: 'Complete guide to digital marketing in Nagpur — best courses, top agencies, job openings, salary trends and career roadmap for 2026.',
    metaKeywords: 'digital marketing in Nagpur, digital marketing Nagpur, Nagpur digital marketing, digital marketing scope Nagpur',
    ogTitle: 'Digital Marketing in Nagpur 2026 — Complete Guide',
    ogDescription: 'Courses, jobs, agencies, salary, scope — everything about digital marketing in Nagpur.',
    headline: 'Digital Marketing in Nagpur — The 2026 Guide',
    subheadline: 'Everything you need to know about digital marketing in Nagpur — best courses, top agencies, current jobs, salary trends and a clear career roadmap for 2026.',
    bullets: [
      'Best digital marketing courses in Nagpur compared',
      'Active job market & top hiring companies',
      '2026 salary trends — fresher to senior level',
      'Top digital marketing agencies in Nagpur listed'
    ]
  }
];
