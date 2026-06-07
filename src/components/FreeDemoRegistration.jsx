import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Calendar, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { submitLead } from '@/lib/leadSubmit';

const FreeDemoRegistration = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '', // honeypot — must stay empty
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Honeypot: bots fill hidden fields, real users don't
    if (formData.website) return;
    setIsSubmitting(true);

    const { ok, error } = await submitLead({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source: 'homepage-free-demo',
      website: formData.website, // passed to edge function for server-side check too
    });

    if (!ok) {
      setIsSubmitting(false);
      toast({
        title: 'Registration Failed',
        description: error || 'Please try again in a few minutes.',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', phone: '' });

    toast({
      title: "Registration Successful! 🎉",
      description: "Your spot for the Free Demo Class has been booked. We will contact you shortly.",
      duration: 5000,
    });

    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="demo-registration">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/12 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-card-elevated grid-bg p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="badge-tag-accent mb-6">
                <Calendar className="w-3.5 h-3.5" />
                <span>Limited Seats</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
                Book your{' '}
                <span className="font-serif-display italic text-white/90">free demo class</span>
              </h2>

              <p className="text-base text-white/65 mb-7 leading-relaxed">
                Experience our practical, AI-powered teaching methodology before you commit. Register now to secure your spot in the next demo session.
              </p>

              <ul className="space-y-3 mb-2">
                {['Live Project Overview', 'Career Guidance Session', 'AI Tools Demonstration'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-[15px] text-white/80">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 rounded-2xl border border-emerald-400/30 bg-emerald-400/15 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">You're booked!</h3>
                  <p className="text-sm text-white/65">We've sent the details to your email. See you in class.</p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="link"
                    className="mt-5 text-indigo-300 hover:text-indigo-200"
                  >
                    Register another person
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot — hidden from real users, bots fill this */}
                  <div style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }} aria-hidden="true">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-white/55 uppercase tracking-[0.08em] mb-1.5">Full Name</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-white/55 uppercase tracking-[0.08em] mb-1.5">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-white/55 uppercase tracking-[0.08em] mb-1.5">Phone Number</label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-accent w-full py-6 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Free Demo
                        <Send className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-center text-white/40 mt-3">
                    By registering, you agree to receive updates about our courses.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeDemoRegistration;
