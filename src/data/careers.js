// Career guide + six career pages (/careers/<slug>/).
// One source of truth for the React page (src/pages/CareersPage.jsx), the
// static prerender (tools/prerender.js) and sitemap-careers.xml (tools/sitemap.js).
// URLs are evergreen: update the copy each year, keep the slugs.
// Plain text only — no HTML in strings.

export const CAREERS_UPDATED = '2026-11-27';
export const GUIDE_SLUG = 'best-career-options-2027';
export const careerPath = (slug) => `/careers/${slug}/`;
export const COURSE_URL = '/pages/digital-marketing-course-in-nagpur/';

const li = (title) => `https://in.linkedin.com/jobs/search?keywords=${encodeURIComponent(title)}&location=India`;

export const GUIDE = {
  slug: GUIDE_SLUG,
  h1: 'Best Career Options in 2027 for Digital Marketing and AI',
  title: 'Best Career Options in 2027: AI & Digital Marketing',
  metaDescription: 'Explore six AI and digital marketing career options for 2027. Compare skills, tools and beginner projects to find a path that fits your strengths.',
  opening: 'Looking for the best career options in 2027? If you enjoy creating content, analysing campaigns or building workflows, AI is opening new ways to specialise in digital marketing. You could turn ad performance into better creative tests, help businesses track their visibility in AI search, or build a system that sends qualified leads to the right salesperson. This guide shows what each role involves, which skills to learn and what you can build for your first portfolio.',
  fit: [
    ['Creative and analytical', 'You like ideas and numbers in equal measure.', 'ai-creative-strategist'],
    ['Research and writing', 'You enjoy finding the real question behind a search and answering it clearly.', 'ai-search-visibility-specialist'],
    ['Systems and problem-solving', 'You like mapping steps, spotting where things break and fixing them.', 'ai-marketing-automation-specialist'],
    ['Video and languages', 'You care how a line sounds in Marathi, Hindi or English, not just what it says.', 'ai-video-localization-producer'],
    ['Conversations and service', 'You notice what customers ask before they buy, and how they like to be answered.', 'whatsapp-conversation-designer'],
    ['Organising and quality', 'You like checklists, approvals and getting the details right every time.', 'ai-content-operations-specialist'],
  ],
  foundation: [
    ['Customer research', 'Who buys, what they worry about and the words they use. Every role on this page starts here.'],
    ['Positioning', 'Why a customer should pick this business over the alternatives, said in one sentence.'],
    ['Copywriting', 'Headlines, hooks, offers and calls to action that are clear before they are clever.'],
    ['Funnels', 'How a stranger becomes an enquiry and an enquiry becomes a customer — ads, pages, forms and follow-up.'],
    ['Measurement', 'UTM links, conversion events and reports, so you can show what changed and why.'],
  ],
  resilientAnswer: 'No career is guaranteed to be AI-proof. In marketing, a more resilient skill set combines AI fluency with decisions employers and clients still need people to own. That includes choosing what an ad should test, judging whether content is accurate, and deciding when a lead should go to a human salesperson. AI can draft ten ad hooks in seconds, summarise reviews and build a workflow, but someone still has to decide which idea is worth money, check that a price or claim is true, and take responsibility when a customer complaint needs a human answer. The roles in this guide are built around those decisions.',
  faqs: [
    { q: 'What are the best career options in 2027 in digital marketing?', a: 'Six specialisations stand out: AI Creative Strategist, AI Search Visibility (GEO) Specialist and AI Marketing Automation Specialist, which already appear in job listings, plus three emerging ones — AI Video Localization Producer, WhatsApp Conversation Designer and AI Content Operations Specialist. Pick the one that matches the work you enjoy.' },
    { q: 'Are there any AI-proof careers in 2027?', a: 'No career is guaranteed to be AI-proof. In marketing, a more resilient skill set combines AI fluency with decisions employers and clients still need people to own. That includes choosing what an ad should test, judging whether content is accurate, and deciding when a lead should go to a human salesperson.' },
    { q: 'Which jobs are automation-proof in marketing?', a: 'None are fully automation-proof, but jobs built on judgement are more resilient: deciding what to test, approving what gets published, checking facts and prices, and handling customers who need a person. AI makes these people faster; it does not remove the need for them.' },
    { q: 'Which AI marketing career is best for beginners?', a: 'Start with the work you enjoy doing. If you like writing and researching, try an AI search visibility audit. If you like ads and numbers, build a creative testing portfolio. If you enjoy mapping processes, build a simple lead automation.' },
    { q: 'Do I need coding for an AI marketing career?', a: 'You can start creative strategy, search visibility and basic automation projects without coding. More technical marketing automation roles may ask for APIs, SQL or scripting.' },
    { q: 'What should I learn first?', a: 'The common foundation: customer research, positioning, copywriting, funnels and measurement. Every career on this page is built on top of it, and it is what the first month of the Telzon Academy course covers.' },
  ],
};

export const CAREERS = [
  {
    slug: 'ai-creative-strategist',
    status: 'listed',
    role: 'AI Creative Strategist',
    h1: 'How to Become an AI Creative Strategist',
    title: 'AI Creative Strategist Career: Skills & Roadmap',
    metaDescription: 'What an AI Creative Strategist does, the skills and tools to learn, and a beginner portfolio project: turn customer reviews into tested ad concepts.',
    suits: 'Creative and analytical people',
    coreSkill: 'Turning ad results into better creative tests',
    answer: 'An AI Creative Strategist decides what an ad should say and show, uses AI to produce and vary ideas quickly, and reads campaign results to decide what to test next. For example, they might notice that café reviewers keep mentioning slow weekday service, write three ad hooks that answer that worry, and run them as a test with one clear metric for each.',
    tasks: [
      ['Mine customer objections', 'Read reviews, comments and sales calls to find the doubt that stops people buying — price, trust, time or quality.'],
      ['Write hooks and concepts', 'Turn one objection into several angles, then use Claude or ChatGPT to draft variations, checking each for tone and accuracy.'],
      ['Design creative tests', 'Change one variable at a time — the hook, the visual or the offer — with a hypothesis and a budget for each test.'],
      ['Read the results', 'Compare cost per qualified lead, click-through rate and creative fatigue, then decide what to keep, change or stop.'],
      ['Brief designers and editors', 'Hand over a clear brief so the winning idea is produced well, not just quickly.'],
    ],
    tools: [
      ['Claude or ChatGPT', 'Summarise reviews into objections and draft hook variations to review'],
      ['Meta Ads Manager', 'Run the creative test and read results by ad'],
      ['Google Sheets', 'Log each hypothesis, variable, metric and decision'],
      ['Canva', 'Build quick test creatives before a full production'],
    ],
    roadmap: {
      foundation: 'Customer research, positioning and copywriting: learn to say why someone should buy in one sentence.',
      guided: 'Take one product page and its reviews. With Claude or ChatGPT, list the top five objections, then rewrite the headline three ways — one per objection — and explain your choice.',
      project: 'Take real café reviews, identify one buying objection and create three ad concepts. Show the hypothesis and the metric you would use to judge each concept.',
    },
    example: {
      title: 'Sample creative test brief (Telzon format)',
      rows: [
        ['Business', 'A café near Chhatrapati Square, Nagpur'],
        ['Objection found in reviews', '“Service is slow at lunch”'],
        ['Hypothesis', 'Showing a ready-in-10-minutes lunch menu will raise weekday lunch enquiries'],
        ['Concept A', 'Hook: “Lunch in 10 minutes, or the coffee’s on us” — offer-led'],
        ['Concept B', 'Hook: a 10-second clip of the counter, timer on screen — proof-led'],
        ['Concept C', 'Hook: a regular’s quote about the quick lunch — social proof'],
        ['One metric to judge', 'Cost per lunch table booking, after 7 days and an equal budget'],
      ],
      note: 'A sample brief students write — not a live campaign result.',
    },
    titles: ['AI Creative Strategist', 'Creative Strategist', 'Performance Creative Strategist', 'Performance Marketing Executive', 'Ad Creative Specialist'],
    hiring: [
      { label: 'Example listing: AI Creative Strategist — Performance Marketing, PlanetSpark (LinkedIn)', url: 'https://in.linkedin.com/jobs/view/ai-creative-strategist-%E2%80%94-performance-marketing-individual-contributor-at-planetspark-4491120478' },
    ],
    faqs: [
      { q: 'Do I need design skills to be an AI Creative Strategist?', a: 'Basic layout sense helps, but the core skill is deciding what to test and why. Designers and editors produce the final ads; you write the brief and read the results.' },
      { q: 'Do I need coding?', a: 'No. The work happens in Ads Manager, spreadsheets and AI assistants.' },
      { q: 'What qualifications do employers look for?', a: 'Listings usually ask for hands-on ad experience and a portfolio more than a specific degree. A documented creative test — hypothesis, concepts, metric and decision — is strong evidence.' },
      { q: 'How do I build a portfolio without a client?', a: 'Use public reviews of a local business and write a full test plan. Label it as a sample. If you can run a small budget, add the real results.' },
    ],
    telzon: 'Telzon Academy covers this path in the Digital Marketing & AI course: buyer psychology (week 2), copywriting and page tests (week 3), ChatGPT creative variations checked for facts and brand fit (week 6), Meta ad variations with one variable per test (week 8) and a creative-fatigue and cost-per-qualified-lead lab (week 9).',
    related: ['ai-content-operations-specialist', 'ai-video-localization-producer'],
  },
  {
    slug: 'ai-search-visibility-specialist',
    status: 'listed',
    role: 'AI Search Visibility Specialist',
    h1: 'How to Become an AI Search Visibility Specialist',
    title: 'GEO Specialist Career: AI Search, AEO & SEO Skills',
    metaDescription: 'How to become a GEO / AI search visibility specialist: track how brands appear in ChatGPT, Perplexity and Google AI features, and fix content gaps.',
    suits: 'Researchers and writers',
    coreSkill: 'Finding buying questions and answering them better than anyone else',
    answer: 'An AI Search Visibility Specialist — often called a GEO (Generative Engine Optimisation) specialist — finds the questions customers ask, records which brands and sources AI assistants and search engines show for them, and improves a website so it gives the most helpful answer. For example, they might ask ChatGPT and Perplexity “Where can I learn digital marketing in Nagpur?”, note which institutes and websites are mentioned, and write the page that fills the gap.',
    tasks: [
      ['Build a list of buying questions', 'From Search Console queries, sales calls and “People also ask”, collect the questions people ask before they buy.'],
      ['Record AI answers', 'For each question, note the date, the tool, which brands are mentioned and which sources are linked.'],
      ['Find content gaps', 'Compare what is cited with what the website says, and list missing facts, evidence or pages.'],
      ['Improve the pages', 'Add direct answers, original evidence and clear facts, and keep structured data matching what the page shows.'],
      ['Keep classic SEO healthy', 'Crawling, indexing, internal links and page experience still decide whether a page can be shown at all.'],
    ],
    tools: [
      ['ChatGPT', 'Check how an assistant answers a buying question and which sources it names'],
      ['Perplexity', 'See linked sources for each answer'],
      ['Google Search Console', 'Find the real queries a site appears for and track clicks'],
      ['Semrush', 'Research keywords and competitors'],
      ['Google Sheets', 'Keep the audit log: date, tool, query, mentions, sources'],
    ],
    googleNote: 'Google says its existing SEO fundamentals still apply to AI Overviews and AI Mode: a page needs to be indexed and eligible to show a snippet, and no special AI files or markup are required. An audit can document whether a brand appears for selected queries on a given date. It cannot promise future placement.',
    googleSource: { label: 'Google Search Central: AI features and your website', url: 'https://developers.google.com/search/docs/appearance/ai-features' },
    roadmap: {
      foundation: 'SEO basics — search intent, keyword research, on-page and technical SEO — plus clear writing.',
      guided: 'Pick five questions a local business’s customers ask. Search each in Google and note which pages answer it best, and why.',
      project: 'Audit how Telzon Academy appears for questions such as “Where can I learn digital marketing in Nagpur?” Record the date, tool, mentions and linked sources.',
    },
    example: {
      title: 'Audit log columns (Telzon format)',
      rows: [
        ['Date checked', 'The day you ran the question — answers change over time'],
        ['Tool', 'ChatGPT, Perplexity, Gemini or Google AI Mode'],
        ['Question', 'e.g. “Where can I learn digital marketing in Nagpur?”'],
        ['Brands mentioned', 'Every business named, in order'],
        ['Sources linked', 'Each URL the answer cites'],
        ['Gap found', 'What a good answer needed that the website did not say'],
        ['Fix', 'The page or fact you will add, and when you will re-check'],
      ],
      note: 'A template students fill in — record only what you actually observe.',
    },
    titles: ['GEO Specialist', 'AI Search Specialist', 'SEO Executive', 'SEO and AEO Specialist', 'Content SEO Strategist'],
    hiring: [],
    faqs: [
      { q: 'What is the difference between SEO and GEO?', a: 'SEO helps pages rank in search results. GEO focuses on how AI assistants and AI search features find, mention and cite sources. GEO builds on SEO; it does not replace it.' },
      { q: 'Can a GEO specialist guarantee a brand appears in ChatGPT?', a: 'No. An audit can document whether a brand appears for selected questions on a given date. It cannot promise future placement.' },
      { q: 'Do I need coding?', a: 'No for most of the work. Basic HTML and structured data knowledge helps when checking pages.' },
      { q: 'How do I show this skill to an employer?', a: 'Share a dated audit log, the gaps you found and the page changes you would make. Real observations beat claims.' },
    ],
    telzon: 'Telzon Academy covers this path in the Digital Marketing & AI course: SEO, technical SEO and local SEO with Semrush and Google Search Console (week 5), AEO and GEO — comparing AI answers, checking cited sources and adding original evidence (week 6), and SEO, AEO and GEO interview questions (week 11).',
    related: ['ai-content-operations-specialist', 'ai-creative-strategist'],
  },
  {
    slug: 'ai-marketing-automation-specialist',
    status: 'listed',
    role: 'AI Marketing Automation Specialist',
    h1: 'How to Become an AI Marketing Automation Specialist',
    title: 'AI Marketing Automation Career: Skills & Roadmap',
    metaDescription: 'What an AI marketing automation specialist does: map lead journeys, qualify enquiries, update a CRM and alert sales. Skills, tools and a beginner project.',
    suits: 'Systems thinkers and problem-solvers',
    coreSkill: 'Building lead workflows that work every time, and catching them when they fail',
    answer: 'An AI Marketing Automation Specialist builds the systems that move a lead from a form to the right person — capturing the enquiry, qualifying it, updating the CRM and alerting sales — and makes sure those systems keep working. For example, they might connect a demo-class form to a CRM so every new enquiry is checked for duplicates, tagged by course interest and sent to a counsellor within minutes.',
    tasks: [
      ['Map the lead journey', 'Draw every step from ad click to sale, and mark where leads get lost or delayed.'],
      ['Qualify enquiries', 'Use form answers — and AI where it helps — to tag leads by interest, location and urgency.'],
      ['Update the CRM', 'Create or update one clean record per person, with source and campaign attached.'],
      ['Alert the sales team', 'Send the right lead to the right person by WhatsApp, email or CRM task.'],
      ['Check duplicates and failed runs', 'Test repeat submissions, watch error logs and fix runs that fail silently.'],
    ],
    tools: [
      ['n8n or Make', 'Connect the form, CRM and alerts without heavy coding'],
      ['Google Sheets', 'A simple lead log while you learn, or a backup of every enquiry'],
      ['HubSpot or Zoho CRM', 'Store lead records, stages and follow-up tasks'],
      ['Claude or ChatGPT', 'Draft qualification rules and follow-up messages to review'],
    ],
    roadmap: {
      foundation: 'Funnels and measurement: know what a qualified lead is for the business, and how it is tracked.',
      guided: 'Build a form that writes each submission to a Google Sheet and sends you an email alert. Submit it twice and see what happens.',
      project: 'Build a demo-class enquiry flow using test leads. Show the form submission, CRM record, sales alert and a duplicate submission test.',
    },
    example: {
      title: 'Demo-class enquiry flow (Telzon format, test data only)',
      rows: [
        ['1. Trigger', 'A test lead submits the “Book a free demo class” form'],
        ['2. Check', 'Is this phone number already in the CRM? If yes, update the record instead of creating a new one'],
        ['3. Qualify', 'Tag by course (Digital Marketing & AI or Photography) and by area in Nagpur'],
        ['4. Record', 'Create the CRM contact with source, campaign and timestamp'],
        ['5. Alert', 'Send the counsellor a message with the lead’s name, course and preferred time'],
        ['6. Failure check', 'If any step fails, log it and alert the owner instead of failing silently'],
      ],
      note: 'Built and tested with fake leads — never real customer data.',
    },
    titles: ['Marketing Automation Specialist', 'Marketing Technology Executive', 'CRM Executive', 'Marketing Operations Associate', 'Lead Management Executive'],
    hiring: [
      { label: 'Example listing: Asst. Manager — Performance Marketing (AI & Marketing Technology), GUS Global Services India (LinkedIn)', url: 'https://in.linkedin.com/jobs/view/asst-manager-performance-marketing-ai-marketing-technology-at-gus-global-services-india-pvt-ltd-4493810577' },
    ],
    faqs: [
      { q: 'Do I need coding for marketing automation?', a: 'You can start with no-code tools. More technical marketing automation roles may ask for APIs, SQL or scripting, so learn the basics once your first flows work.' },
      { q: 'Is marketing automation the same as a chatbot?', a: 'No. Chatbots are one piece. Automation covers the whole lead journey — forms, CRM, alerts, follow-ups and reporting.' },
      { q: 'What should my first project be?', a: 'One enquiry flow, built end to end with test leads, including a duplicate test and a deliberate failure so you can show how you catch it.' },
      { q: 'Can I use real customer data for practice?', a: 'No. Practise with test leads, and follow consent rules for any real data you handle at work.' },
    ],
    telzon: 'Telzon Academy covers this path in the Digital Marketing & AI course: landing pages and an enquiry tested from click to form submission (week 3), email, WhatsApp and CRM consent and follow-up (week 6), and a no-code automation lab — enquiry to CRM or Sheet, follow-up trigger, duplicate and failure checks — ending with a tested automation you submit (week 7).',
    related: ['whatsapp-conversation-designer', 'ai-content-operations-specialist'],
  },
  {
    slug: 'ai-video-localization-producer',
    status: 'emerging',
    role: 'AI Video Localization Producer',
    h1: 'How to Become an AI Video Localization Producer',
    title: 'AI Video Localization Career: Tools & Portfolio',
    metaDescription: 'AI video localization explained: adapt ads into Marathi, Hindi and English with AI voices and avatars, then check pronunciation, captions and pacing.',
    suits: 'Video lovers who speak more than one language',
    coreSkill: 'Adapting a video so it feels written for each audience',
    answer: 'An AI Video Localization Producer adapts one video into several languages using AI voice and avatar tools, then checks that every version sounds natural, is pronounced correctly and fits the screen. For example, they might turn one café ad into Marathi, Hindi and English versions — rewriting the lines that don’t translate well, not just swapping the words.',
    tasks: [
      ['Adapt the script', 'Rewrite lines for each audience: jokes, idioms, prices and calls to action often need new wording.'],
      ['Produce voice and video', 'Generate voice-overs and avatar versions, then choose the takes that sound most natural.'],
      ['Review pronunciation', 'Check names, places and brand words — the details AI voices most often get wrong.'],
      ['Check captions and pacing', 'Make sure captions match the audio and the longer Hindi or Marathi lines still fit the timing.'],
    ],
    tools: [
      ['HeyGen', 'Create avatar and translated video versions'],
      ['ElevenLabs', 'Generate and fine-tune voice-overs per language'],
      ['A video editor (Premiere Pro, DaVinci Resolve or CapCut)', 'Fix timing, captions and final exports'],
      ['ChatGPT or Claude', 'Draft script adaptations for a native speaker to review'],
    ],
    roadmap: {
      foundation: 'Scripting, storyboarding and basic editing — you can’t fix a translated video you can’t edit.',
      guided: 'Take a 15-second English Reel. Write a Hindi version yourself, then compare it with an AI translation and list every line you would change.',
      project: 'Produce Marathi, Hindi and English versions of one café ad. Annotate which lines you rewrote for the audience and why.',
    },
    example: {
      title: 'Localization review sheet (Telzon format)',
      rows: [
        ['Line', 'The original English line and timestamp'],
        ['Marathi / Hindi version', 'Your adapted line, not a word-for-word translation'],
        ['Why it changed', 'e.g. local phrase sounds friendlier; price said the way customers say it'],
        ['Pronunciation check', 'Brand names and place names checked by ear'],
        ['Caption check', 'Captions match audio; line fits on screen'],
        ['Pacing check', 'Version still fits the 15- or 30-second slot'],
      ],
      note: 'A template students fill in for each version.',
    },
    titles: ['Video Localization Specialist', 'Video Editor (Regional Languages)', 'AI Video Producer', 'Content Localization Executive', 'Dubbing Coordinator'],
    hiring: [],
    faqs: [
      { q: 'Is AI video localization a real job yet?', a: 'It is an emerging specialisation. Today you will find it inside roles such as video editor, localization specialist or AI video producer — search those titles.' },
      { q: 'Do I need to be fluent in every language?', a: 'You need to be confident in at least one target language, and know when to ask a native speaker to review a version.' },
      { q: 'Do I need coding?', a: 'No. The work happens in AI video and voice tools and a video editor.' },
      { q: 'What should my portfolio show?', a: 'Before-and-after versions of the same ad, with notes on what you rewrote and why. That shows judgement, not just tool use.' },
    ],
    telzon: 'Telzon Academy covers the building blocks in the Digital Marketing & AI course: scripting, storyboarding, smartphone shooting and editing (week 4), a video workflow with ChatGPT scripts, ElevenLabs voice-overs and HeyGen templates with a review step (week 6), and caption accuracy checks (week 7). For deeper production skills, see the Commercial Ads & Photography course.',
    related: ['ai-creative-strategist', 'ai-content-operations-specialist'],
  },
  {
    slug: 'whatsapp-conversation-designer',
    status: 'emerging',
    role: 'WhatsApp Conversation Designer',
    h1: 'What Does a WhatsApp Conversation Designer Do?',
    title: 'WhatsApp Conversation Design: Skills & Career Guide',
    metaDescription: 'WhatsApp conversation design explained: opening messages, qualifying questions, booking steps and handoff to staff — plus skills, tools and a project.',
    suits: 'People who understand how customers like to be answered',
    coreSkill: 'Designing chats that help customers book and know when to bring in a person',
    answer: 'A WhatsApp Conversation Designer plans what a business says on WhatsApp — the first message after an ad click, the questions that qualify a customer, the steps to book, and the moment the chat hands over to a staff member. For example, they might map a hotel brunch enquiry so a customer can check timings, request a table and reach staff without waiting for a reply to every message.',
    tasks: [
      ['Write opening messages', 'The first reply after a click-to-WhatsApp ad: clear, friendly and short.'],
      ['Design qualification questions', 'Ask only what the business needs — date, number of people, budget — in the fewest messages.'],
      ['Map booking steps', 'Plan each step from enquiry to confirmed booking, including what happens if the customer stops replying.'],
      ['Plan the handoff to staff', 'Decide which questions always go to a person: complaints, special requests, anything uncertain.'],
      ['Test edge cases', 'Try odd questions, wrong inputs and “talk to a person” requests before going live.'],
    ],
    tools: [
      ['WhatsApp Business', 'Quick replies, labels, catalogues and greeting messages'],
      ['Meta Ads Manager', 'Click-to-WhatsApp ads that start the conversation'],
      ['A chat-flow mapping tool (Miro, FigJam or Whimsical)', 'Draw every path a conversation can take'],
      ['Claude or ChatGPT', 'Draft message variations to review for tone and accuracy'],
    ],
    roadmap: {
      foundation: 'Customer research and copywriting: know what customers ask and how to answer briefly.',
      guided: 'Message three local businesses on WhatsApp with the same question. Compare the replies and rewrite the weakest one.',
      project: 'Map a hotel brunch enquiry from ad click to booking. Test a table request, a pricing question and a request to speak to staff.',
    },
    example: {
      title: 'Brunch enquiry flow (Telzon format)',
      rows: [
        ['Ad click', 'Customer taps a click-to-WhatsApp brunch ad'],
        ['Opening message', 'Greets, shares brunch timings and offers three quick choices'],
        ['Choice 1: Book a table', 'Asks date and number of guests, then confirms or offers another slot'],
        ['Choice 2: Price and menu', 'Sends the current menu — prices verified by staff before going live'],
        ['Choice 3: Talk to staff', 'Hands over immediately, with the chat so far, during staffed hours'],
        ['No reply', 'One polite follow-up, then stop'],
      ],
      note: 'A sample flow students design and test.',
    },
    titles: ['WhatsApp Marketing Executive', 'Conversational Marketing Specialist', 'Chatbot Content Writer', 'CRM and WhatsApp Executive', 'Customer Journey Designer'],
    hiring: [],
    faqs: [
      { q: 'Is WhatsApp conversation design a separate job?', a: 'It is an emerging specialisation. Today it usually sits inside WhatsApp marketing, CRM or conversational marketing roles — search those titles.' },
      { q: 'Do I need coding?', a: 'Not to design conversations. Building advanced bots on the WhatsApp Business Platform may involve developers or a no-code bot builder.' },
      { q: 'What makes a good WhatsApp flow?', a: 'Short messages, few questions, accurate prices and timings, and a fast route to a person when the customer needs one.' },
      { q: 'What about consent?', a: 'Message people who have contacted you or agreed to hear from you, and make it easy to opt out.' },
    ],
    telzon: 'Telzon Academy covers this path in the Digital Marketing & AI course: copywriting (week 3), email, WhatsApp and CRM — consent, lead follow-up, segmentation and nurture sequences (week 6), and Meta lead forms and lead quality (week 9). See also the WhatsApp marketing course page.',
    related: ['ai-marketing-automation-specialist', 'ai-creative-strategist'],
  },
  {
    slug: 'ai-content-operations-specialist',
    status: 'emerging',
    role: 'AI Content Operations Specialist',
    h1: 'What Does an AI Content Operations Specialist Do?',
    title: 'AI Content Operations Career: Skills & Workflows',
    metaDescription: 'AI content operations explained: turn one client brief into a repeatable content workflow with fact checks, approvals and revision records.',
    suits: 'Organisers who care about getting details right',
    coreSkill: 'Running a content workflow where AI drafts and people verify',
    answer: 'An AI Content Operations Specialist turns a client brief into a repeatable workflow: AI helps draft the content, and every piece passes defined fact checks and approvals before it is published. For example, they might plan a week of hotel social posts from one brief, with a named person checking every offer price and timing before anything goes out.',
    tasks: [
      ['Turn briefs into workflows', 'Break one brief into a calendar, production steps and owners.'],
      ['Set up AI drafting', 'Write prompts and examples so drafts match the brand voice from the start.'],
      ['Run fact checks', 'Verify prices, dates, timings and claims against the client’s own source.'],
      ['Manage approvals', 'Track who approves each draft, and nothing publishes without that approval.'],
      ['Record revisions', 'Log every change request so the next week’s content is better.'],
    ],
    tools: [
      ['Claude or ChatGPT', 'Draft posts, captions and scripts from the brief'],
      ['Google Sheets or Notion', 'The content calendar, approval queue and revision log'],
      ['Make (or a similar automation tool)', 'Move drafts between stages and notify approvers'],
      ['Canva', 'Produce visuals from approved copy'],
    ],
    roadmap: {
      foundation: 'Content strategy, copywriting and a basic content calendar.',
      guided: 'Write a three-post plan for a local business with Claude or ChatGPT, then list every fact in it that someone must verify.',
      project: 'Build a week of hotel content from one brief. Show who verifies offer prices and timings, who approves each draft and where revisions are recorded.',
    },
    example: {
      title: 'Weekly content workflow (Telzon format)',
      rows: [
        ['Brief', 'Hotel brunch campaign: audience, offer, tone, dates'],
        ['Draft', 'AI drafts 7 posts from the brief and approved examples'],
        ['Fact check', 'Outlet manager confirms every price and timing against the menu'],
        ['Edit', 'Content specialist fixes tone and brand fit'],
        ['Approval', 'Client marketing lead approves each post in the queue'],
        ['Revision log', 'Every change request recorded with date and reason'],
        ['Publish', 'Only approved posts are scheduled'],
      ],
      note: 'A sample workflow students build.',
    },
    titles: ['Content Operations Executive', 'Content Manager', 'Social Media Executive', 'Content Coordinator', 'AI Content Specialist'],
    hiring: [],
    faqs: [
      { q: 'Is content operations a real job?', a: 'Content operations roles exist in larger teams; the AI-focused version is an emerging specialisation. Search content operations, content manager and content coordinator titles today.' },
      { q: 'Will AI replace content writers?', a: 'AI speeds up drafting, but someone still has to check facts, keep the brand voice and approve what gets published. Content operations is built around that responsibility.' },
      { q: 'Do I need coding?', a: 'No. Spreadsheets, Notion and no-code automation tools are enough to start.' },
      { q: 'What should my portfolio show?', a: 'The workflow itself: brief, drafts, the fact-check list, the approval trail and the revision log — not just the final posts.' },
    ],
    telzon: 'Telzon Academy covers this path in the Digital Marketing & AI course: content pillars and calendars (week 4), ChatGPT for scripts and captions checked for facts, tone and brand fit (week 6), and “content on autopilot” — brief, content calendar, production steps and an approval queue (week 7).',
    related: ['ai-search-visibility-specialist', 'ai-creative-strategist'],
  },
].map((c) => ({
  ...c,
  searchLinks: c.titles.slice(0, 3).map((t) => ({ label: `${t} jobs in India`, url: li(t) })),
}));

export const careerBySlug = (slug) => CAREERS.find((c) => c.slug === slug);

export const STATUS_LABEL = {
  listed: 'Already appearing in job listings',
  emerging: 'Emerging specialization',
};

// ── Structured data (used by React and by the static prerender) ──────────
const SITE = 'https://telzonacademy.in';
export function careerSchemas(slug) {
  const isGuide = slug === GUIDE_SLUG;
  const c = isGuide ? null : careerBySlug(slug);
  if (!isGuide && !c) return [];
  const url = `${SITE}${careerPath(slug)}`;
  const h1 = isGuide ? GUIDE.h1 : c.h1;
  const faqs = isGuide ? GUIDE.faqs : c.faqs;
  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Career Guide', item: `${SITE}${careerPath(GUIDE_SLUG)}` },
  ];
  if (!isGuide) crumbs.push({ '@type': 'ListItem', position: 3, name: c.role, item: url });
  const org = { '@type': 'Organization', name: 'Telzon Academy', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/telzon-logo-black-512.png` } };
  const out = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: h1,
      description: isGuide ? GUIDE.metaDescription : c.metaDescription,
      image: [`${SITE}/media/telzon-academy-nagpur-share.jpg`],
      datePublished: CAREERS_UPDATED, dateModified: CAREERS_UPDATED,
      author: org, publisher: org, mainEntityOfPage: url, inLanguage: 'en-IN',
      ...(isGuide ? {} : { about: { '@type': 'Occupation', name: c.role, occupationLocation: { '@type': 'Country', name: 'India' }, skills: c.tools.map(([t]) => t).join(', ') } }),
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  if (isGuide) out.push({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'AI and digital marketing careers for 2027',
    itemListElement: CAREERS.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.role, url: `${SITE}${careerPath(x.slug)}` })) });
  return out;
}
