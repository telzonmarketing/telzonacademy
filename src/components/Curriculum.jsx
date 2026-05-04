import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Curriculum = () => {
  const modules = [
    {
      title: "Digital Marketing Fundamentals",
      topics: [
        "Introduction to Digital Marketing",
        "Consumer Behavior & Online Psychology",
        "Marketing Strategy Development",
        "Brand Building Online"
      ]
    },
    {
      title: "Search Engine Optimization (SEO)",
      topics: [
        "On-page & Off-page SEO",
        "Keyword Research & Analysis",
        "Technical SEO Fundamentals",
        "Local SEO Strategies"
      ]
    },
    {
      title: "Social Media Marketing",
      topics: [
        "Facebook & Instagram Marketing",
        "LinkedIn for B2B Marketing",
        "Twitter & Pinterest Strategies",
        "Social Media Analytics"
      ]
    },
    {
      title: "Content Marketing",
      topics: [
        "Content Strategy & Planning",
        "Copywriting for Digital Platforms",
        "Video Marketing & YouTube",
        "Blog & Article Writing"
      ]
    },
    {
      title: "Paid Advertising",
      topics: [
        "Google Ads (Search & Display)",
        "Facebook & Instagram Ads",
        "PPC Campaign Management",
        "Retargeting Strategies"
      ]
    },
    {
      title: "Email Marketing & Automation",
      topics: [
        "Email Campaign Design",
        "List Building & Segmentation",
        "Marketing Automation Tools",
        "Drip Campaigns & Workflows"
      ]
    },
    {
      title: "Analytics & Reporting",
      topics: [
        "Google Analytics Mastery",
        "Conversion Rate Optimization",
        "A/B Testing & Experiments",
        "Data-Driven Decision Making"
      ]
    },
    {
      title: "AI & Advanced Tools",
      topics: [
        "ChatGPT for Marketing",
        "AI Content Generation",
        "Marketing Automation Platforms",
        "Growth Hacking Techniques"
      ]
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
            Curriculum at the Best Digital Marketing Academy Near Me
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
            A complete roadmap covering everything from basics to advanced AI-powered marketing strategies.
          </p>
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
              <h3 className="text-xl font-semibold text-white mb-4 flex items-start gap-2">
                <span className="text-purple-400 font-bold">{String(index + 1).padStart(2, '0')}.</span>
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