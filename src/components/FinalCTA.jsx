import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FinalCTA = () => {
  const handleCTAClick = () => {
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20enquire%20about%20the%20digital%20marketing%20course', '_blank');
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/20 blur-[120px] rounded-full -z-10"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight">
            Ready to Transform Your Career?
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Join hundreds of successful students who have kickstarted their digital marketing careers with Telzon Academy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100 font-bold transition-all duration-300 hover:scale-105 text-lg px-8"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={handleCTAClick}
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-lg px-8 bg-transparent"
            >
              Schedule a Call
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mt-8 font-light">
            Limited seats available • Job placement assistance • Industry certification
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;