import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20enquire%20about%20the%20digital%20marketing%20course', '_blank');
  };
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/telzonacademy/', '_blank');
  };

  return (
    <footer className="bg-black/40 text-white py-12 px-4 border-t border-white/10 backdrop-blur-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-20 w-auto overflow-hidden rounded-lg">
                <img src="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg" alt="Telzon Academy official logo" className="h-full w-auto object-contain rounded-md" />
              </div>
              <span className="text-xl font-bold sr-only">Telzon Academy</span>
            </div>
            <p className="text-gray-400 mb-4 font-light text-sm leading-relaxed">
              Nagpur's leading digital marketing training institute. Practical skills, live projects, and 95% placement assistance.
            </p>
            <div className="flex gap-4">
              <button onClick={handleWhatsAppClick} className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="WhatsApp Telzon Academy">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <button onClick={handleInstagramClick} className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="Telzon Academy on Instagram">
                <Instagram className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Courses — real internal links, keyword-rich anchor text */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h3 className="text-base font-semibold mb-4 text-white">Digital Marketing Courses in Nagpur</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-light">
              <li><a href="/pages/digital-marketing-course-in-nagpur" className="hover:text-purple-300 transition-colors duration-200">Digital Marketing Course in Nagpur</a></li>
              <li><a href="/pages/best-digital-marketing-course-in-nagpur" className="hover:text-purple-300 transition-colors duration-200">Best Digital Marketing Course</a></li>
              <li><a href="/pages/digital-marketing-institute-in-nagpur" className="hover:text-purple-300 transition-colors duration-200">Digital Marketing Institute in Nagpur</a></li>
              <li><a href="/pages/digital-marketing-course-with-placement-nagpur" className="hover:text-purple-300 transition-colors duration-200">Course with Placement Assistance</a></li>
              <li><a href="/pages/digital-marketing-course-fees-in-nagpur" className="hover:text-purple-300 transition-colors duration-200">Course Fees in Nagpur</a></li>
              <li><a href="/pages/digital-marketing-course-for-beginners-nagpur" className="hover:text-purple-300 transition-colors duration-200">Course for Beginners</a></li>
              <li><a href="/pages/seo-course-in-nagpur" className="hover:text-purple-300 transition-colors duration-200">SEO Course in Nagpur</a></li>
              <li><a href="/pages/google-ads-course-nagpur" className="hover:text-purple-300 transition-colors duration-200">Google Ads Course in Nagpur</a></li>
            </ul>
          </motion.div>

          {/* Contact — full NAP for local SEO */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="text-base font-semibold mb-4 text-white">Contact Information</h3>
            <div className="space-y-3 text-sm text-gray-400 font-light">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" />
                <div>
                  <a href="tel:+919307189776" className="hover:text-white transition-colors">+91 93071 89776</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-400" />
                <a href="mailto:connect@telzonacademy.in" className="hover:text-white transition-colors">connect@telzonacademy.in</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                <address className="not-italic leading-relaxed">
                  Telzon Academy<br />
                  Digital Marketing Training Center<br />
                  Nagpur, Maharashtra — 440001
                </address>
              </div>
            </div>
          </motion.div>

        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="border-t border-white/10 pt-8 text-center text-gray-500 font-light text-sm">
          <p>&copy; {new Date().getFullYear()} Telzon Academy. All rights reserved. | Nagpur's Best Digital Marketing Institute</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
