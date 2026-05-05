import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const rows = [
  {
    label: 'Real-Time Learning',
    telzon: 'Learn through real-time industry scenarios, tools, and market trends',
    others: 'Primarily theory-based with limited exposure to current practices',
  },
  {
    label: 'Content Creation Mastery',
    telzon: 'Hands-on training in reels, ad creatives, copywriting, and brand storytelling',
    others: 'Focus on concepts without practical content development',
  },
  {
    label: 'Live Campaign Execution',
    telzon: 'Plan, launch, manage, and optimize live campaigns across platforms',
    others: 'Minimal or no exposure to actual campaign execution',
  },
  {
    label: 'Practical Exposure',
    telzon: 'Work on real brand case studies and execution-driven projects',
    others: 'Assignments are mostly theoretical or simulated',
  },
  {
    label: 'Tool-Based Learning',
    telzon: 'Direct training on industry tools like Meta Ads, Google Ads, analytics platforms',
    others: 'Limited tool exposure or only basic demonstrations',
  },
  {
    label: 'Portfolio Development',
    telzon: 'Build a strong, real-work portfolio with campaigns, creatives, and results',
    others: 'Lack of tangible portfolio or real project proof',
  },
  {
    label: 'Career Outcomes',
    telzon: 'Job-ready skillset with execution experience and practical confidence',
    others: 'Knowledge-focused learning without industry readiness',
  },
  {
    label: 'Industry-Relevant Curriculum',
    telzon: 'Continuously updated with latest marketing trends, AI tools, and strategies',
    others: 'Static curriculum that may lag behind industry changes',
  },
  {
    label: 'Mentorship & Guidance',
    telzon: 'Learn directly from practitioners actively working in the industry',
    others: 'Often taught by academic trainers with limited real-world exposure',
  },
  {
    label: 'Performance Marketing',
    telzon: 'Deep focus on ROI-driven marketing, scaling campaigns, and data decisions',
    others: 'Surface-level understanding without performance depth',
  },
  {
    label: 'Specialisation',
    telzon: 'Focused tracks in performance marketing, content, and growth strategy',
    others: 'Generic curriculum with limited specialization options',
  },
  {
    label: 'Learning Approach',
    telzon: 'Execution-first learning model focused on doing, not just understanding',
    others: 'Lecture-based model focused on theory and notes',
  },
];

const ComparisonTable = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">
            Telzon Academy vs other institutes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            What sets this <span className="text-purple-400">program apart?</span>
          </h2>
        </motion.div>

        {/* Header row */}
        <div className="grid grid-cols-[160px_1fr_1fr] md:grid-cols-[220px_1fr_1fr] gap-0 mb-3 px-2">
          <div />
          <div className="text-center font-bold text-purple-400 text-lg pb-2">Telzon Academy</div>
          <div className="text-center font-bold text-white/60 text-lg pb-2">Other Institutes</div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="grid grid-cols-[160px_1fr_1fr] md:grid-cols-[220px_1fr_1fr] gap-0 items-stretch"
            >
              {/* Label */}
              <div className="flex items-center bg-white/10 rounded-l-xl px-4 py-3 border border-white/10 border-r-0">
                <span className="text-sm font-semibold text-white">{row.label}</span>
              </div>

              {/* Telzon column */}
              <div className="flex items-start gap-3 border-2 border-purple-500 border-l-0 border-r-0 bg-purple-500/10 px-4 py-3">
                <ThumbsUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white">{row.telzon}</span>
              </div>

              {/* Others column */}
              <div className="flex items-start gap-3 bg-white/5 rounded-r-xl px-4 py-3 border border-white/10 border-l-0">
                <ThumbsDown className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/50">{row.others}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
