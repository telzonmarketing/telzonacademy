import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FinalCTA = () => {
  const handleCTAClick = () => {
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20enquire%20about%20the%20digital%20marketing%20course', '_blank');
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/15 blur-[140px] rounded-full -z-10" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-card-elevated grid-bg relative overflow-hidden p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-6 h-6 text-indigo-300" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-white tracking-tight leading-[1.05]">
              Ready to transform<br />
              <span className="font-serif-display italic text-white/95">your career?</span>
            </h2>

            <p className="text-lg text-white/65 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of successful students who have kickstarted their digital marketing careers with Telzon Academy.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button onClick={handleCTAClick} className="btn-primary text-base px-7 py-6">
                Enroll Now
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button onClick={handleCTAClick} variant="outline" className="btn-secondary text-base px-7 py-6">
                Schedule a Call
              </Button>
            </div>

            <p className="text-xs text-white/45 mt-8 uppercase tracking-[0.08em]">
              Limited seats <span className="mx-2 text-white/20">•</span> Placement assistance <span className="mx-2 text-white/20">•</span> Industry certification
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
