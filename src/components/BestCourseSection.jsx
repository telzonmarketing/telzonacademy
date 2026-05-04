import React from 'react';
import { motion } from 'framer-motion';

const BestCourseSection = () => {
  return (
    <section className="py-20 px-4 bg-gray-900/50 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Best Digital Marketing Course in Nagpur
          </h2>
          <p className="text-lg text-gray-300 mb-6 font-light max-w-4xl mx-auto md:mx-0">
            Telzon Academy offers one of the most practical and job‑oriented digital marketing courses in Nagpur. Our curriculum is designed for students, working professionals, and business owners who want to learn real‑world skills in SEO, social media marketing, Google Ads, content marketing, and analytics.
          </p>
          <p className="text-lg text-gray-300 mb-6 font-light max-w-4xl mx-auto md:mx-0">
            If you are searching for the best digital marketing academy near me, Telzon Academy gives you a classroom‑like learning experience with live projects, assignments, and personal guidance. We focus on hands‑on practice so you can confidently apply digital marketing strategies in real businesses.
          </p>
          <p className="text-lg text-gray-300 font-light max-w-4xl mx-auto md:mx-0">
            This digital marketing course in Nagpur covers everything from basics to advanced strategies, including website optimization, lead generation, and paid advertising. Whether you are a beginner or want to upgrade your skills, our digital marketing course will help you become industry‑ready and improve your career opportunities.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BestCourseSection;