import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { firePixelSchedule } from '@/lib/leadSubmit';

const Hero = () => {
  const handleCTAClick = () => {
    firePixelSchedule();
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20the%20digital%20marketing%20course', '_blank');
  };

  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-semibold tracking-wide">No. 1 Digital Marketing Institute in Nagpur</span>
            </div>

            {/* H1 — primary keyword targeted, CTR hook added */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              Best Digital Marketing Course in Nagpur
            </h1>

            {/* H2-level sub — secondary keywords naturally included */}
            <p className="text-lg text-gray-300 mb-4 leading-relaxed font-light">
              Nagpur's most practical <strong className="text-white font-semibold">digital marketing training institute</strong>. Learn SEO, Google Ads, social media marketing, and content strategy — with live projects, expert mentors, and guaranteed placement support.
            </p>

            {/* Trust signals — data from your actual GSC */}
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-bold text-green-100 text-sm">95% Placement Success</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-lg">
                <Star className="w-4 h-4 text-purple-300" />
                <span className="font-semibold text-purple-100 text-sm">Free Demo Class Available</span>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleCTAClick} size="lg"
                className="bg-white text-purple-900 hover:bg-gray-100 font-bold transition-all duration-300 hover:scale-105 text-lg px-8 border-none">
                Book Free Demo Class
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={handleCTAClick} size="lg" variant="outline"
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-lg px-8">
                Enquire Now
              </Button>
            </div>

            {/* Local signals */}
            <p className="text-xs text-gray-500 mt-4">
              Serving students across Nagpur — Dharampeth, Sitabuldi, Ramdaspeth, Sadar, Civil Lines &amp; online
            </p>

          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2">
              <div className="rounded-xl overflow-hidden">
                <img
                  alt="Students learning digital marketing at Telzon Academy Nagpur — best digital marketing institute in Nagpur"
                  src="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da"
                  className="w-full h-full object-cover"
                  loading="eager"
                  width="600"
                  height="400"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/60 to-transparent pointer-events-none"></div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }}
                className="absolute top-6 right-6 glass-card p-4 rounded-xl hidden md:block">
                <p className="text-3xl font-bold text-white text-center drop-shadow-sm">95%</p>
                <p className="text-xs text-gray-200 font-medium uppercase tracking-wider text-center">Hired</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
