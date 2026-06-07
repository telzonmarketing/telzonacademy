import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { firePixelSchedule } from '@/lib/leadSubmit';

const Hero = () => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Peak brightness when hero is fully in view, fades to 0 as the section scrolls past the top.
  // Spring smooths the value so the glow eases rather than jitters with raw scroll.
  const intensityRaw = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const intensity = useSpring(intensityRaw, { stiffness: 120, damping: 30, mass: 0.4 });

  const bgGlowOpacity = useTransform(intensity, [0, 1], [0, 1]);
  const beamOpacity = useTransform(intensity, [0, 1], [0, 0.75]);
  const beamScale = useTransform(intensity, [0, 1], [0.7, 1]);
  const borderGlowOpacity = useTransform(intensity, [0, 1], [0, 0.9]);

  const textShadowBlur = useTransform(intensity, [0, 1], [0, 38]);
  const textShadowAlpha = useTransform(intensity, [0, 1], [0, 0.45]);
  const textShadow = useMotionTemplate`0 0 ${textShadowBlur}px rgba(123, 97, 255, ${textShadowAlpha})`;

  const handleCTAClick = () => {
    firePixelSchedule();
    window.open('https://wa.me/919307189776?text=Hello%20Telzon%20Academy%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20the%20digital%20marketing%20course', '_blank');
  };

  return (
    <section ref={sectionRef} className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Static ambient glows — fallback for reduced-motion users and base lighting layer. */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px] -z-10" />

      {!prefersReducedMotion && (
        <>
          {/* Layer 1 — background radial spotlight (LED dome). */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: bgGlowOpacity, willChange: 'opacity' }}
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div
              className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[min(1200px,140vw)] h-[760px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse 60% 55% at center, rgba(79,125,255,0.45) 0%, rgba(123,97,255,0.32) 35%, rgba(79,125,255,0.10) 60%, transparent 80%)',
                filter: 'blur(80px)',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>

          {/* Layer 2 — light beam shaft falling behind the hero content. */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: beamOpacity, scaleY: beamScale, willChange: 'opacity, transform' }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-16 -z-10 origin-top"
          >
            <div
              className="w-[280px] md:w-[460px] h-[640px] md:h-[820px]"
              style={{
                background:
                  'radial-gradient(ellipse 55% 100% at top, rgba(79,125,255,0.42) 0%, rgba(123,97,255,0.22) 45%, transparent 75%)',
                filter: 'blur(48px)',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>
        </>
      )}

      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

            <div className="badge-tag mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>No. 1 Digital Marketing Institute in Nagpur</span>
            </div>

            <motion.h1
              style={prefersReducedMotion ? undefined : { textShadow, willChange: 'filter' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.05] tracking-tight"
            >
              Best Digital Marketing<br />
              <span className="font-serif-display italic text-white/95">Course in Nagpur</span>
            </motion.h1>

            <p className="text-lg text-white/70 mb-6 leading-relaxed max-w-xl">
              Nagpur's most practical <strong className="text-white font-semibold">digital marketing training institute</strong>. Learn SEO, Google Ads, social media marketing, and content strategy — with live projects, expert mentors, and guaranteed placement support.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-7">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-100">95% Placement Success</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3.5 py-1.5">
                <Star className="w-4 h-4 text-indigo-300" />
                <span className="text-sm font-semibold text-indigo-100">Free Demo Class Available</span>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleCTAClick}
                className="btn-primary text-base px-7 py-6">
                Book Free Demo Class
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button onClick={handleCTAClick} variant="outline"
                className="btn-secondary text-base px-7 py-6">
                Enquire Now
              </Button>
            </div>

            <p className="text-xs text-white/45 mt-5">
              Serving students across Nagpur — Dharampeth, Sitabuldi, Ramdaspeth, Sadar, Civil Lines &amp; online
            </p>

          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            {/* Layer 3 — soft LED border glow around the hero image card. */}
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                style={{ opacity: borderGlowOpacity, willChange: 'opacity' }}
                className="pointer-events-none absolute -inset-4 rounded-[1.6rem] -z-10"
              >
                <div
                  className="absolute inset-0 rounded-[1.6rem]"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(79,125,255,0.55) 0%, rgba(123,97,255,0.55) 100%)',
                    filter: 'blur(32px)',
                  }}
                />
              </motion.div>
            )}

            <div className="surface-card-elevated relative overflow-hidden p-2">
              <div className="rounded-[1rem] overflow-hidden">
                <img
                  alt="Students learning digital marketing at Telzon Academy Nagpur — best digital marketing institute in Nagpur"
                  src="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da"
                  className="w-full h-full object-cover"
                  loading="eager"
                  width="600"
                  height="400"
                />
              </div>
              <div className="absolute inset-2 rounded-[1rem] bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }}
                className="absolute top-6 right-6 rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 hidden md:block">
                <p className="text-3xl font-bold text-white text-center leading-none">95%</p>
                <p className="text-[10px] text-white/70 font-semibold uppercase tracking-[0.12em] text-center mt-1">Hired</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
