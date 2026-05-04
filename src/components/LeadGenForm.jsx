import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Send, ShieldCheck, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { submitLead } from '@/lib/leadSubmit';

/**
 * LeadGenForm
 * A reusable lead generation form component that captures user details
 * and stores them in the Supabase `leads` table.  It displays a success
 * message once the submission is complete.  The parent page can pass a
 * `source` prop to identify which landing page the lead originated from.
 *
 * Props:
 *  - heading: string – Heading text displayed above the form.
 *  - subheading: string – Subheading text displayed below the heading.
 *  - source: string – A slug identifying the landing page (e.g. "digital-marketing-course-in-nagpur").
 */
const LeadGenForm = ({
  heading = 'Book Your Free Consultation',
  subheading = 'Fill out the form below and we will contact you shortly.',
  source = 'general',
  buttonText = 'Submit',
  badge = 'Free Career Call',
  benefits = ['Get the full course roadmap', 'Speak with an admissions counsellor', 'Know fees, batch timing and placement path'],
  trustNote = 'No spam. Our counsellor will call only for course guidance.'
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
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
    setIsSubmitting(true);

    const { ok, error } = await submitLead({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      source,
    });

    if (!ok) {
      console.error('Error inserting lead:', error);
      toast({
        title: 'Submission Failed',
        description: error || 'An error occurred while submitting your details. Please try again later.',
        variant: 'destructive',
        duration: 5000,
      });
    } else {
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '' });
      toast({
        title: 'Thank you! 🎉',
        description: 'Your details have been submitted successfully. Our team will contact you soon.',
        duration: 5000,
      });
      setTimeout(() => setIsSuccess(false), 5000);
    }

    setIsSubmitting(false);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden" id={`lead-gen-${source}`}>
      {/* Subtle background blur blob for visual interest */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-orange-500/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden"
        >
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent -z-10"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-200 px-3 py-1 rounded-full text-sm font-semibold mb-6 border border-orange-500/20">
                <Clock className="w-4 h-4" />
                <span>{badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {heading}
              </h2>
              <p className="text-gray-300 mb-6 font-light">
                {subheading}
              </p>
              <ul className="space-y-3 mb-6">
                {benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <Users className="w-4 h-4 text-purple-300 mb-2" />
                  <p className="text-white font-bold">1,000+</p>
                  <p className="text-gray-400 text-xs">students trained</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <ShieldCheck className="w-4 h-4 text-green-300 mb-2" />
                  <p className="text-white font-bold">95%</p>
                  <p className="text-gray-400 text-xs">placement support</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-gray-300">We have received your enquiry. Our team will contact you soon.</p>
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    variant="link"
                    className="mt-6 text-purple-300 hover:text-purple-200"
                  >
                    Submit another enquiry
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor={`name-${source}`} className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input
                      id={`name-${source}`}
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor={`email-${source}`} className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      id={`email-${source}`}
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor={`phone-${source}`} className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <Input
                      id={`phone-${source}`}
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold py-6 mt-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        {buttonText}
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    {trustNote}
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

export default LeadGenForm;
