import React from 'react';
import { motion } from 'framer-motion';
import { Users2, MessageSquare, Briefcase } from 'lucide-react';

const Mentorship = () => {
  const benefits = [
    {
      icon: Users2,
      title: "Expert Mentors",
      description: "Learn from professionals with 10+ years of experience in digital marketing and brand building."
    },
    {
      icon: MessageSquare,
      title: "1-on-1 Guidance",
      description: "Get personalized feedback and support to overcome challenges and accelerate your learning."
    },
    {
      icon: Briefcase,
      title: "Career Support",
      description: "Resume building, interview preparation, and job placement assistance to kickstart your career."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Mentorship at the Best Digital Marketing Academy in Nagpur
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
              Our mentorship program ensures you're never alone in your learning journey. Get the guidance you need to succeed.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm font-light">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-white/5">
                <div className="rounded-xl overflow-hidden">
                   <img alt="Digital marketing mentor teaching students" src="https://images.unsplash.com/photo-1612772992614-bc2c2a2c3362" className="w-full h-full object-cover"/>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Mentorship;