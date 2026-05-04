import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Users, Trophy, Target } from 'lucide-react';

const PracticalLearning = () => {
  const cards = [
    {
      icon: Laptop,
      title: "Hands-On Projects",
      description: "Work on real-world campaigns and build a portfolio that showcases your skills to potential employers."
    },
    {
      icon: Users,
      title: "Live Sessions",
      description: "Interactive classes with industry experts who share their practical experience and insights."
    },
    {
      icon: Trophy,
      title: "Certification",
      description: "Earn an industry-recognized certificate upon completion to boost your career prospects."
    },
    {
      icon: Target,
      title: "Job-Ready Skills",
      description: "Learn the exact skills that companies are looking for in digital marketing professionals."
    }
  ];

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
            Practical Digital Marketing Courses in Nagpur
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            We believe in learning by doing. Our course is designed to give you hands-on experience from day one.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card glass-card-hover p-6 rounded-2xl group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600/80 transition-colors border border-white/10">
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">{card.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm font-light">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticalLearning;