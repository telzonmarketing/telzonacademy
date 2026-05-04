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
      source: 'homepage-free-demo',
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
    <section className="py-20 px-4 relative overflow-hidden" id="demo-registration">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-orange-500/20 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden"
        >
           {/* Decorative corner accent */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent -z-10"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-300 px-3 py-1 rounded-full text-sm font-semibold mb-6 border border-orange-500/20">
                <Calendar className="w-4 h-4" />
                <span>Limited Seats Available</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">Free Demo Class</span>
              </h2>
              
              <p className="text-gray-300 mb-6 font-light">
                Experience our practical, AI-powered teaching methodology before you commit. Register now to secure your spot in the next demo session.
              </p>

              <ul className="space-y-3 mb-8">
                {['Live Project Overview', 'Career Guidance Session', 'AI Tools Demonstration'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
                  <h3 className="text-2xl font-bold text-white mb-2">You're Booked!</h3>
                  <p className="text-gray-300">We've sent the details to your email. See you in class!</p>
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    variant="link"
                    className="mt-6 text-purple-300 hover:text-purple-200"
                  >
                    Register another person
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <Input
                      id="email"
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <Input
                      id="phone"
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
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Free Demo
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
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
