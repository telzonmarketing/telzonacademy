// FAQs per landing page slug — shared between React's LandingPage.jsx (runtime
// FAQPage schema + visible accordion) and tools/prerender.js (static HTML emitted
// per route for crawlers that don't execute JS). Keep both in sync by editing
// this single source.

export const PAGE_FAQS = {
  default: [
    { q: 'What is the duration of the digital marketing course in Nagpur?', a: 'The course runs from 3 to 6 months depending on the batch you choose. We offer a 3-month intensive and a 6-month comprehensive program with weekend and weekday options.' },
    { q: 'What are the fees for the digital marketing course at Telzon Academy?', a: 'Course fees range from ₹25,000 to ₹45,000 depending on the program. We offer flexible EMI options and merit-based scholarships. Contact us for the latest pricing.' },
    { q: 'Do I need prior experience to join the digital marketing course in Nagpur?', a: 'No prior experience is needed. Our course starts from absolute basics and moves to advanced topics. Students from any background — science, commerce, arts — have successfully completed this course.' },
    { q: 'Is there placement assistance after the digital marketing course?', a: 'Yes. Telzon Academy has a 95% placement success rate. We help with resume building, LinkedIn optimisation, mock interviews and direct connections with hiring partners in Nagpur and across India.' },
    { q: 'Which areas in Nagpur is Telzon Academy accessible from?', a: 'Our institute is centrally located in Nagpur and easily reachable from Dharampeth, Sitabuldi, Sadar, Ramdaspeth, Civil Lines, Pratap Nagar and all other major areas. We also offer fully online classes.' },
    { q: 'Will I get Google and Meta certification?', a: 'Yes. Our trainers guide you through the Google Ads, Google Analytics, and Meta Blueprint certification exams. These industry certifications are included in the course.' },
  ],
  // ── Q-001 cannibalization fix · 2026-06-07 ──
  // Slug-specific FAQs for the primary keyword target. Distinct from the
  // default array; designed for the "digital marketing course in nagpur"
  // commercial-investigation intent + AI-citation extraction.
  'digital-marketing-course-in-nagpur': [
    { q: 'What does the digital marketing course in Nagpur at Telzon Academy actually cover?', a: 'The 16-week curriculum covers six modules: digital marketing fundamentals, SEO (on-page, off-page, technical and local), Google Ads (search, display, shopping, Performance Max), social media marketing (Meta + LinkedIn + YouTube), content & email marketing, and live projects with placement preparation. Every module ends with a graded assignment and a real campaign you can show in interviews.' },
    { q: 'How is Telzon Academy\'s digital marketing course different from others in Nagpur?', a: 'Three differences: (1) all training is project-based with live client campaigns — not slide-only theory; (2) Google Ads, Google Analytics and Meta Blueprint certification preparation is included in the fee; (3) we publish our 95% placement rate openly and connect every student to 50+ hiring partners across Nagpur and India.' },
    { q: 'What can I earn after completing the digital marketing course in Nagpur?', a: 'Entry-level digital marketing roles in Nagpur start at ₹2.5–₹4 LPA. Our average placed-student salary is ₹3.5 LPA and the highest in our 2026 batch reached ₹8.5 LPA. Freelancers earn ₹30,000–₹1,00,000 per month managing client accounts. Salaries grow 30–50% within 2 years for marketers who specialise.' },
    { q: 'Is the Telzon Academy digital marketing course suitable for complete beginners?', a: 'Yes. The course is designed for absolute beginners — no prior marketing or technical experience is needed. Roughly 70% of our students join straight after their 12th or graduation. The first two weeks cover fundamentals so everyone starts on the same page before moving into specialised modules.' },
    { q: 'Does the digital marketing course cover AI tools and AI marketing?', a: 'Yes — the 2026 curriculum includes hands-on training in AI marketing tools like ChatGPT, Gemini, Canva AI, Adobe Firefly, Jasper and Midjourney for content, ad creative and campaign optimisation. AI marketing is integrated across every module, not taught as a separate elective.' },
    { q: 'What is a typical week in the Telzon Academy digital marketing course like?', a: 'Each week has 3 live classroom sessions of 2 hours each, 1 live project review session, and self-paced practical assignments. Weekday-evening and weekend students attend 4 hours per session, twice a week. Recorded lectures and tool access are available throughout so you can revise any time.' },
    { q: 'Will I work on real client campaigns during the digital marketing course?', a: 'Yes. From week 6 onwards every student works on at least 2 live client campaigns — typically Nagpur-based businesses including clinics, restaurants, real-estate agents and startups. You handle real ad budgets (under mentor supervision), real Google Search Console accounts and real Meta Business Manager setups.' },
    { q: 'Which companies hire Telzon Academy digital marketing course graduates in Nagpur?', a: 'Our graduates have joined Swiggy, OLA, Nykaa, Le Meridien, Amul, Cloud Intellect, and 40+ Nagpur-based digital agencies, startups and SMEs. We share the active hiring partner list with enrolled students every month. Most placements happen within 30–60 days of course completion.' },
    { q: 'How do I book a free demo class for the digital marketing course in Nagpur?', a: 'Submit the enquiry form on this page, call +91-9307189776, or message us on WhatsApp. We confirm a demo slot within 30 minutes during business hours (9 AM – 8 PM, Monday–Saturday). The demo is a full 90-minute live session with the actual trainer — not a sales pitch.' },
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
