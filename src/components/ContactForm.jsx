import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { submitLead } from '@/lib/leadSubmit';

const WHATSAPP_NUMBER = '919307189776';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '', // honeypot — must stay empty
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Honeypot: bots fill hidden fields, real users don't
    if (formData.website) return;
    setIsSubmitting(true);

    const { ok, error } = await submitLead({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: 'homepage-contact',
      website: formData.website,
    });

    setIsSubmitting(false);

    if (!ok) {
      toast({
        title: 'Submission failed',
        description: error || 'Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: "We've got your message!",
      description: 'Opening WhatsApp so we can chat instantly.',
    });

    const whatsappMessage =
      `Hello Telzon Academy, I want to enquire about the digital marketing course.%0A%0A` +
      `Name: ${encodeURIComponent(formData.name)}%0A` +
      `Email: ${encodeURIComponent(formData.email)}%0A` +
      `Phone: ${encodeURIComponent(formData.phone)}%0A` +
      `Message: ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');

    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-300 font-light">
            Have questions? Fill out the form and we'll get back to you on WhatsApp!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 rounded-2xl border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot — hidden from real users, bots fill this */}
            <div style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
              />
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none focus:border-purple-500 focus:ring-purple-500 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300 hover:scale-105 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send via WhatsApp
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
