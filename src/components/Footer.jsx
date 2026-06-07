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
    <footer className="relative bg-black/40 text-white py-16 px-4 border-t border-white/[0.06] backdrop-blur-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-10 mb-10">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <a href="/" className="inline-flex items-center mb-5" aria-label="Telzon Academy — home">
              <img
                src="/telzon-logo-white-1024.png"
                alt="Telzon Academy"
                className="h-10 w-auto"
                width="364"
                height="111"
                loading="lazy"
              />
            </a>
            <p className="text-sm text-white/55 mb-5 leading-relaxed max-w-sm">
              Nagpur's leading digital marketing training institute. Practical skills, live projects, and 95% placement assistance.
            </p>
            <div className="flex gap-2">
              <button onClick={handleWhatsAppClick} className="w-10 h-10 rounded-xl border border-emerald-400/20 bg-emerald-400/10 hover:bg-emerald-400/20 hover:border-emerald-400/40 flex items-center justify-center transition-all duration-200" aria-label="WhatsApp Telzon Academy">
                <MessageCircle className="w-4.5 h-4.5 text-emerald-300" />
              </button>
              <button onClick={handleInstagramClick} className="w-10 h-10 rounded-xl border border-pink-400/20 bg-gradient-to-br from-purple-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 hover:border-pink-400/40 flex items-center justify-center transition-all duration-200" aria-label="Telzon Academy on Instagram">
                <Instagram className="w-4.5 h-4.5 text-pink-200" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h3 className="text-[11px] font-semibold mb-5 text-white/45 uppercase tracking-[0.12em]">Courses in Nagpur</h3>
            {/* Q-001 internal link · 2026-06-07: target slug emphasised at the
                top of the list with bold weight to concentrate authority. */}
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><a href="/pages/digital-marketing-course-in-nagpur" className="font-semibold text-white hover:text-indigo-200 transition-colors">Digital Marketing Course in Nagpur</a></li>
              <li><a href="/pages/best-digital-marketing-course-in-nagpur" className="hover:text-white transition-colors">Best Digital Marketing Course in Nagpur</a></li>
              <li><a href="/pages/digital-marketing-institute-in-nagpur" className="hover:text-white transition-colors">Digital Marketing Institute in Nagpur</a></li>
              <li><a href="/pages/digital-marketing-course-with-placement-nagpur" className="hover:text-white transition-colors">Course with Placement Assistance</a></li>
              <li><a href="/pages/digital-marketing-course-fees-in-nagpur" className="hover:text-white transition-colors">Course Fees in Nagpur</a></li>
              <li><a href="/pages/digital-marketing-course-for-beginners-nagpur" className="hover:text-white transition-colors">Course for Beginners</a></li>
              <li><a href="/pages/seo-course-in-nagpur" className="hover:text-white transition-colors">SEO Course in Nagpur</a></li>
              <li><a href="/pages/google-ads-course-nagpur" className="hover:text-white transition-colors">Google Ads Course in Nagpur</a></li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="text-[11px] font-semibold mb-5 text-white/45 uppercase tracking-[0.12em]">Contact</h3>
            <div className="space-y-3.5 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <a href="tel:+919307189776" className="hover:text-white transition-colors">+91 93071 89776</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-300" />
                <a href="mailto:connect@telzonacademy.in" className="hover:text-white transition-colors">connect@telzonacademy.in</a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <address className="not-italic leading-relaxed text-white/60">
                  Telzon Academy<br />
                  Digital Marketing Training Center<br />
                  Nagpur, Maharashtra — 440001
                </address>
              </div>
            </div>
          </motion.div>

        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/45">
          <p>&copy; {new Date().getFullYear()} Telzon Academy. All rights reserved.</p>
          <p className="uppercase tracking-[0.08em]">Nagpur's Best Digital Marketing Institute</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
