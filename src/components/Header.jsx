import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    window.open('https://share.google/84JWzWeKpyNvvUnG2', '_blank');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky ? 'bg-[#120B2E]/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Updated logo with new URL and adjusted styling */}
            <div className="h-16 w-auto overflow-hidden rounded-lg">
                <img 
                    src="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg" 
                    alt="Telzon Academy official logo with white and blue circular design" 
                    className="h-full w-auto object-contain rounded-md"
                    loading="lazy"
                />
            </div>
            <span className="text-xl font-bold text-white sr-only">Telzon Academy</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="/lead-generation-package"
              className="hidden md:inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:scale-105"
            >
              Free Demo
            </a>

            <Button
              onClick={handleLocationClick}
              variant="ghost"
              className="hidden md:flex text-gray-200 hover:text-white hover:bg-white/10"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Button>
            
            <Button
              onClick={handleWhatsAppClick}
              className="bg-white text-purple-900 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
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
