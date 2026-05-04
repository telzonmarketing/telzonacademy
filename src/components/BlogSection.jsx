import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogSection = () => {
  const blogs = [
    {
      title: "Top 10 Digital Marketing Trends for 2024",
      excerpt: "Discover the latest trends shaping the future of digital marketing, from AI-driven content to voice search optimization.",
      date: "Dec 12, 2024",
      author: "Telzon Team",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
    },
    {
      title: "How to Build a Strong Personal Brand on LinkedIn",
      excerpt: "Learn effective strategies to optimize your profile, create engaging content, and network with industry leaders.",
      date: "Nov 28, 2024",
      author: "Marketing Expert",
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=2400"
    },
    {
      title: "SEO vs. PPC: Which One is Right for Your Business?",
      excerpt: "A comprehensive comparison of Search Engine Optimization and Pay-Per-Click advertising to help you make informed decisions.",
      date: "Nov 15, 2024",
      author: "SEO Specialist",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=2374"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Insights & Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with expert articles, tips, and industry news from the world of digital marketing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{blog.author}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                  {blog.excerpt}
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mt-auto w-fit"
                >
                  Read More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;