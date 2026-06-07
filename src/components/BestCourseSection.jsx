import React from 'react';
import { motion } from 'framer-motion';

const BestCourseSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-card-elevated p-10 md:p-16"
        >
          <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-3">About the program</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.1] tracking-tight max-w-3xl">
            Best Digital Marketing<br />
            <span className="font-serif-display italic text-white/90">Course in Nagpur</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-[15px] leading-relaxed">
            <p className="text-white/70">
              Telzon Academy offers one of the most practical and job‑oriented digital marketing courses in Nagpur. Our curriculum is designed for students, working professionals, and business owners who want to learn real‑world skills in SEO, social media marketing, Google Ads, content marketing, and analytics.
            </p>
            <p className="text-white/70">
              If you are searching for the best digital marketing academy near me, Telzon Academy gives you a classroom‑like learning experience with live projects, assignments, and personal guidance. We focus on hands‑on practice so you can confidently apply digital marketing strategies in real businesses.
            </p>
            <p className="text-white/70">
              This digital marketing course in Nagpur covers everything from basics to advanced strategies, including website optimization, lead generation, and paid advertising. Whether you are a beginner or want to upgrade your skills, our digital marketing course will help you become industry‑ready and improve your career opportunities.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BestCourseSection;
