import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, Play, ArrowDown, Star } from 'lucide-react';
import { submitLead, firePixelViewContent, firePixelSchedule } from '@/lib/leadSubmit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';

// ── Replace with your actual YouTube video ID ──────────────────────────────
const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ';
// ───────────────────────────────────────────────────────────────────────────

const benefits = [
  'Live project-based digital marketing training',
  'SEO, Google Ads, Meta Ads & Social Media covered',
  '95% placement assistance after course completion',
  'Expert mentors with 5+ years industry experience',
  'Flexible batches — weekday & weekend options',
];

const WatchDemoPage = () => {
  const { toast } = useToast();
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fire ViewContent on page load
  useEffect(() => {
    firePixelViewContent({ content_name: 'Watch Demo Video', content_category: 'Education' });
  }, []);

  // Load YouTube IFrame API and set up player
  useEffect(() => {
    const onYTReady = () => {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e) => {
            // YT.PlayerState.PLAYING === 1
            if (e.data === 1 && !videoStarted) {
              setVideoStarted(true);
              firePixelSchedule();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      onYTReady();
    } else {
      window.onYouTubeIframeAPIReady = onYTReady;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { ok, error } = await submitLead({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'watch-demo',
    });
    if (!ok) {
      toast({ title: 'Submission failed', description: error || 'Please try again.', variant: 'destructive' });
    } else {
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '' });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Watch Free Demo Class | Telzon Academy Nagpur</title>
        <meta name="description" content="Watch a free demo digital marketing class and register your spot at Telzon Academy Nagpur." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 0%, #1a0533 0%, #0f0a1e 40%, #1a1040 70%, #1a0a05 100%)',
          fontFamily: '-apple-system, "SF Pro Text", "Proxima Nova", Roboto, sans-serif',
        }}
      >
        {/* Top bar */}
        <div className="w-full py-4 px-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <img
              src="https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg"
              alt="Telzon Academy"
              className="h-10 w-auto rounded-md"
            />
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
            <span className="text-white text-sm ml-2 font-medium">4.9 / 5 rating</span>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 py-10">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="inline-block bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Free Demo Class — Watch Now
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
              See how we train students to get<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400"> real digital marketing jobs</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Watch the demo, then fill in your details below to reserve your free seat in the next live batch.
            </p>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-4"
            style={{ paddingTop: '56.25%' }}
          >
            <div
              ref={playerContainerRef}
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>

          {/* Scroll nudge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-1 mt-6 mb-10 text-gray-400"
          >
            <p className="text-sm">Watched the demo? Register your free seat below</p>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </motion.div>

          {/* Form + benefits grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-8 items-start"
          >
            {/* Benefits */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Book Your Free Demo Class
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Join 1,000+ students who started their digital marketing career with Telzon Academy. Limited seats per batch.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-1">Next batch starts soon</p>
                <p className="text-gray-400 text-xs">Our team will confirm your demo slot via WhatsApp within 30 minutes of registration.</p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">You're Registered!</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Our team will confirm your free demo slot on WhatsApp within 30 minutes.
                  </p>
                  <a
                    href="https://wa.me/919307189776?text=Hi%20Telzon%20Academy%2C%20I%20just%20registered%20for%20the%20free%20demo%20class"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    Chat on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-1">Register Free Demo</h3>
                  <p className="text-gray-400 text-sm mb-5">No fees. No commitment. Just a free class.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <Input
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 text-base transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                      ) : (
                        <><Play className="mr-2 h-4 w-4 fill-white" /> Reserve My Free Seat</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Your details go directly to Telzon Academy. No spam, no third-party sharing.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default WatchDemoPage;
