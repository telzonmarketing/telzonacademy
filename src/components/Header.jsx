import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { firePixelSchedule } from '@/lib/leadSubmit';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20enquire%20about%20the%20digital%20marketing%20course', '_blank');
  };

  const handleLocationClick = () => {
    firePixelSchedule();
    window.open('https://share.google/84JWzWeKpyNvvUnG2', '_blank');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky
          ? 'bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center" aria-label="Telzon Academy — home">
            <img
              src="/telzon-logo-white-1024.png"
              alt="Telzon Academy"
              className="h-9 md:h-10 w-auto"
              width="364"
              height="111"
              loading="eager"
            />
          </a>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="/lead-generation-package"
              className="hidden md:inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(71,96,235,0.6)] transition-all duration-200 hover:from-indigo-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            >
              Free Demo
            </a>

            <Button
              onClick={handleLocationClick}
              variant="ghost"
              className="hidden md:inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-white/20"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Button>

            <Button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
