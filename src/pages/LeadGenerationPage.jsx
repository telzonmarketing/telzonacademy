import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Award, CheckCircle, Clock, GraduationCap, IndianRupee, ShieldCheck, Star, Target, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadGenForm from '@/components/LeadGenForm';

const outcomes = [
  'Personal course roadmap based on your background',
  'Fees, EMI and scholarship guidance before you enrol',
  'Placement path for SEO, Google Ads and social media roles',
  'Free demo class invitation with trainer interaction',
];

const trustSignals = [
  { icon: Users, label: '1,000+', text: 'students trained' },
  { icon: Award, label: '95%', text: 'placement support' },
  { icon: Star, label: '4.9/5', text: 'student rating' },
  { icon: Clock, label: '30 min', text: 'callback target' },
];

const psychologyCards = [
  {
    icon: Target,
    title: 'Clarity First',
    text: 'Know the exact course, batch, tools and placement route that matches your goal.',
  },
  {
    icon: ShieldCheck,
    title: 'No Pressure',
    text: 'Talk to a counsellor, understand the fit, and decide only when you are ready.',
  },
  {
    icon: GraduationCap,
    title: 'Career Proof',
    text: 'See how live projects become portfolio proof for interviews and freelancing.',
  },
  {
    icon: IndianRupee,
    title: 'Fee Confidence',
    text: 'Get transparent fees, EMI options and available discounts in one call.',
  },
];

const faqs = [
  {
    q: 'Is this counselling call free?',
    a: 'Yes. The course roadmap call and free demo registration are completely free.',
  },
  {
    q: 'Will my lead go to the backend?',
    a: 'Yes. Every submission is stored in the existing Supabase leads table with the source lead-generation-package.',
  },
  {
    q: 'Who should fill this form?',
    a: 'Students, working professionals, business owners and freelancers who want digital marketing, SEO, Google Ads or social media training in Nagpur.',
  },
];

const LeadGenerationPage = () => {
  const canonicalUrl = 'https://telzonacademy.in/lead-generation-package';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Free Digital Marketing Career Counselling | Telzon Academy',
    description: 'Book a free digital marketing career counselling call with Telzon Academy Nagpur. Get course guidance, fees, batch details and placement roadmap.',
    url: canonicalUrl,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Telzon Academy',
      url: 'https://telzonacademy.in',
      telephone: '+91-9307189776',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <Helmet>
        <title>Free Digital Marketing Career Call | Telzon Academy Nagpur</title>
        <meta name="description" content="Book a free Telzon Academy counselling call. Get course guidance, fees, batch details, demo class access and a digital marketing placement roadmap." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Free Digital Marketing Career Call | Telzon Academy" />
        <meta property="og:description" content="Get a free roadmap for digital marketing, SEO, Google Ads and social media careers in Nagpur." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1552664730-d307ca884978" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Digital Marketing Career Call | Telzon Academy" />
        <meta name="twitter:description" content="Book a free roadmap call and demo class for digital marketing training in Nagpur." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen text-white overflow-x-hidden font-sans">
        <Header />

        <main>
          <section className="pt-32 pb-14 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="container mx-auto max-w-6xl relative">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 bg-green-500/15 text-green-200 px-4 py-2 rounded-full border border-green-400/20 mb-5">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-semibold">Free roadmap call + demo class access</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
                    Start your digital marketing career with a clear plan
                  </h1>

                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl">
                    Book a free counselling call with Telzon Academy. We will map your goal, explain the right course path, and help you understand fees, batch timings and placement support before you decide.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {outcomes.map((item) => (
                      <div key={item} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-200">{item}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#lead-gen-lead-generation-package"
                    className="inline-flex items-center justify-center gap-2 bg-white text-purple-900 hover:bg-gray-100 font-bold transition-all duration-300 text-base px-7 py-4 rounded-xl"
                  >
                    Book Free Career Call
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978"
                    alt="Digital marketing students discussing career roadmap with mentor"
                    className="w-full aspect-[4/3] object-cover rounded-2xl border border-white/10 shadow-2xl"
                    loading="eager"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/65 backdrop-blur-md border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-gray-200">Next step after enquiry</p>
                    <p className="text-xl font-bold text-white">Counsellor callback + demo slot confirmation</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-8 px-4 border-y border-white/10 bg-black/20">
            <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustSignals.map(({ icon: Icon, label, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-purple-300 flex-shrink-0" />
                  <div>
                    <p className="text-white text-xl font-bold leading-none">{label}</p>
                    <p className="text-gray-400 text-xs mt-1">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Why this call converts confusion into action</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Most students delay because they are unsure about fees, skills, jobs and timing. This call removes those doubts quickly.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {psychologyCards.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <Icon className="w-6 h-6 text-orange-300 mb-4" />
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <LeadGenForm
            heading="Reserve your free roadmap call"
            subheading="Share your details and our admissions team will call you with the right course plan, fee options and next demo slot."
            source="lead-generation-package"
            buttonText="Get My Free Roadmap"
            badge="Limited counselling slots today"
            benefits={[
              'Understand exactly which skills you should learn first',
              'Get honest guidance on online, offline and weekend batches',
              'Know course fees, EMI options and placement support before joining',
              'Receive a callback from Telzon Academy admissions team',
            ]}
            trustNote="Your details go directly to Telzon Academy. No spam, no third-party sharing."
          />

          <section className="py-16 px-4 bg-black/20">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-8">Questions before you submit?</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-2">{faq.q}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LeadGenerationPage;
