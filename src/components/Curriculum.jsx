import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SYLLABUS, COURSE_FORMAT } from '@/data/syllabus';

const Curriculum = () => {
  // Detailed 12-week syllabus shared with the course pages (src/data/syllabus.js).
  const modules = SYLLABUS.map((m) => ({ title: `${m.week} · ${m.topic}`, month: m.month, topics: m.items }));

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Curriculum at the Best Digital Marketing Academy Near Me
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            A complete roadmap covering everything from basics to advanced AI-powered marketing strategies.
          </p>
          <p className="text-sm text-gray-400 mt-3">3 months · {COURSE_FORMAT.summary} · live project + interview preparation</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="glass-card glass-card-hover p-6 rounded-2xl border border-white/10"
            >
              {(index === 0 || modules[index - 1].month !== module.month) && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-300 mb-2">{module.month}</p>
              )}
              <h3 className="text-xl font-semibold text-white mb-4 flex items-start gap-2">
                {module.title}
              </h3>
              <ul className="space-y-2">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-start gap-2 text-gray-300 font-light text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;