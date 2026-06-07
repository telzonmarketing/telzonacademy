import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, CheckCircle, Plus } from 'lucide-react';

const PlacementsAndCareers = () => {
  const stats = [
    {
      icon: CheckCircle,
      title: "100% Placement",
      subtitle: "Assistance",
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    },
    {
      icon: TrendingUp,
      title: "3.5 LPA",
      subtitle: "Average Package",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      icon: Trophy,
      title: "8.5 LPA",
      subtitle: "Highest Package",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    }
  ];

  // The partners array is no longer used for the alumni section, but keeping it
  // here in case it's needed for other parts or future additions.
  const partners = [
    { name: "Swiggy", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/0c66f01c84746c8da45b4c533e6a23d1.png" },
    { name: "OLA", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/809ea5a1c90997bdb7445e2b6d7466ad.png" },
    { name: "Amul", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/6db7b1f5e5e4843ac131b0cc61f264aa.jpg" },
    { name: "Le Meridien", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/cfbb35a71c4bf0daa1366b76c8d8347d.png" },
    { name: "Cloud Intellect", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/7b63853a9a47e3c4697ed5ca066af984.png" },
    { name: "Gemini", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/6abf59fa42ab53b391cf782f399895dc.png" },
    { name: "Nykaa", url: "https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/6cf31fb4f3f371062c3496cbc625308e.jpg" }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
       {/* Section Background */}
       <div className="absolute inset-0 bg-black/10 -z-10"></div>

      <div className="container mx-auto max-w-6xl">
        
        {/* Part 1: Placement Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-6 rounded-2xl border ${stat.border} flex items-center gap-4 hover:scale-105 transition-transform duration-300`}
            >
              <div className={`w-14 h-14 ${stat.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white leading-tight">{stat.title}</h3>
                <p className="text-gray-400 font-medium">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Part 2: Tools Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Learn 100+ Essential Digital Marketing Tools
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">
              Master industry-standard software including <span className="text-purple-300 font-semibold">ChatGPT, Semrush, Google Ads</span> and 100+ other tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-80">
            {/* Tool Logos */}
            <motion.div 
               whileHover={{ scale: 1.1, opacity: 1 }}
               className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center p-4 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
            >
               <img alt="ChatGPT Logo" className="w-full h-full object-contain filter brightness-0 invert" src="/tool-logos/chatgpt.png" loading="lazy" width="200" height="200" />
            </motion.div>
             <motion.div 
               whileHover={{ scale: 1.1, opacity: 1 }}
               className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center p-4 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer"
            >
               <img alt="Semrush Logo" className="w-full h-full object-contain filter brightness-0 invert" src="/tool-logos/semrush.svg" loading="lazy" width="200" height="200" />
            </motion.div>
             <motion.div 
               whileHover={{ scale: 1.1, opacity: 1 }}
               className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center p-4 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
            >
               <img alt="Google Ads Logo" className="w-full h-full object-contain filter brightness-0 invert" src="/tool-logos/google-ads.png" loading="lazy" width="200" height="200" />
            </motion.div>
             <motion.div 
               whileHover={{ scale: 1.1, opacity: 1 }}
               className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center p-4 border border-white/10 hover:border-blue-300/50 transition-all cursor-pointer"
            >
               <img alt="Canva Logo" className="w-full h-full object-contain filter brightness-0 invert" src="/tool-logos/canva.png" loading="lazy" width="200" height="200" />
            </motion.div>
             <motion.div 
               whileHover={{ scale: 1.1, opacity: 1 }}
               className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center p-4 border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer"
            >
               <img alt="Google Analytics Logo" className="w-full h-full object-contain filter brightness-0 invert" src="/tool-logos/google-analytics.svg" loading="lazy" width="200" height="200" />
            </motion.div>
            
            {/* "+100 More" Badge */}
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex flex-col items-center justify-center p-2 text-white font-bold border border-purple-400/30 shadow-lg shadow-purple-900/20"
            >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-xl">100+</span>
                <span className="text-[10px] uppercase tracking-wider font-medium opacity-80">Tools</span>
            </motion.div>
          </div>
        </div>

        {/* The Alumni/Partners section has been removed as per the request. */}

      </div>
    </section>
  );
};

export default PlacementsAndCareers;