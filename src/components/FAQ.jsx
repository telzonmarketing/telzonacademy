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
    <section className="py-20 px-4 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-300 font-light">
            Got questions? We've got answers!
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl overflow-hidden border border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-purple-300 flex-shrink-0" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-300 leading-relaxed font-light border-t border-white/5">
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