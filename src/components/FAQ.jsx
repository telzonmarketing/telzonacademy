import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is the duration of the course?",
      answer: "The complete digital marketing course is designed to be completed in 3-4 months with dedicated learning. We offer flexible timings with both weekday and weekend batches to suit your schedule."
    },
    {
      question: "Do I need any prior experience?",
      answer: "No prior experience is required! Our course is designed for complete beginners. We start with the fundamentals and gradually progress to advanced topics, ensuring everyone can follow along."
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes, upon successful completion of the course and projects, you'll receive an industry-recognized certificate from Telzon Academy that you can showcase to employers and on LinkedIn."
    },
    {
      question: "What tools and software will I learn?",
      answer: "You'll learn industry-standard tools including Google Ads, Google Analytics, Facebook Ads Manager, SEO tools, email marketing platforms, AI tools like ChatGPT, and various automation platforms."
    },
    {
      question: "Is job placement assistance provided?",
      answer: "Yes! We provide comprehensive job placement assistance including resume building, interview preparation, portfolio development, and connections with our hiring partners."
    }
  ];

  // FAQPage schema built from the SAME questions shown above, so the structured
  // data always matches the visible content (Google requirement). This is the
  // ONLY FAQPage on the homepage — the global one was removed from index.html to
  // avoid duplicate/conflicting FAQPage blocks that Google flags as invalid.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://telzonacademy.in/#faq',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section className="py-24 px-4 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">FAQs</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-[1.1]">
            Frequently asked{' '}
            <span className="font-serif-display italic text-white/90">questions</span>
          </h2>
          <p className="text-base text-white/60">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="surface-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/[0.03] transition-colors duration-200"
              >
                <span className="text-base md:text-lg font-semibold text-white pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-indigo-300 flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-5 text-[15px] text-white/70 leading-relaxed border-t border-white/[0.06] pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;