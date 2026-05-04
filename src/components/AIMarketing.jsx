import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIMarketing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Content Creation",
      description: "Learn to leverage AI tools like ChatGPT for creating compelling marketing content at scale."
    },
    {
      icon: Zap,
      title: "Automation Tools",
      description: "Master marketing automation platforms to streamline campaigns and maximize efficiency."
    },
    {
      icon: TrendingUp,
      title: "Data Analytics",
      description: "Use AI-powered analytics to make data-driven decisions and optimize your marketing ROI."
    }
  ];

  const handleCTAClick = () => {
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20enquire%20about%20the%20digital%20marketing%20course', '_blank');
  };

  return (
    <section className="py-20 px-4 relative">
       {/* Darker section background to differentiate */}
      <div className="absolute inset-0 bg-black/20 -z-10"></div>
      
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-200">Future of Marketing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
            AI-Powered Digital Marketing Course
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            Stay ahead of the curve with cutting-edge AI tools and techniques that are transforming digital marketing.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-900/20">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed font-light">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="bg-white text-purple-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-lg px-8 font-bold"
          >
            Start Learning AI Marketing
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AIMarketing;