import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true) // Fixed column name
        .order('created_at', { ascending: false }); // <--- CHANGED from 'publishedAt'

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Digital Marketing Blog & Resources | Telzon Academy Nagpur</title>
      <meta name="description" content="Read the latest articles, guides, and insights on digital marketing trends, SEO, social media, and more from Telzon Academy in Nagpur." />
      {/* Open Graph */}
      <meta property="og:title" content="Digital Marketing Blog & Resources | Telzon Academy Nagpur" />
      <meta property="og:description" content="Explore expert articles on SEO, social media, PPC, content marketing and more from Telzon Academy, Nagpur's leading digital marketing institute." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://telzonacademy.in/blog" />
      <meta property="og:image" content="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Digital Marketing Blog & Resources | Telzon Academy Nagpur" />
      <meta name="twitter:description" content="Explore expert articles on SEO, social media, PPC, content marketing and more from Telzon Academy, Nagpur's leading digital marketing institute." />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da" />
      {/* Canonical */}
      <link rel="canonical" href="https://telzonacademy.in/blog" />
    </Helmet>
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Resources</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore the latest insights, tutorials, and success stories from the world of digital marketing.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found yet</h3>
              <p className="text-gray-500">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1 bg-purple-500/10 text-purple-300 px-2 py-1 rounded">
                        <Tag className="w-3 h-3" />
                        {blog.category || 'General'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {blog.title}
                    </h2>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {blog.excerpt}
                    </p>
                    
                    <Link to={`/blog/${blog.slug}`}>
                      <Button variant="link" className="p-0 text-white font-semibold hover:text-purple-300">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default BlogList;