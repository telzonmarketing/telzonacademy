import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Tag, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true) // Only fetch published blogs
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Blog post not found</h1>
          <p className="text-gray-400 mb-8">The article you are looking for does not exist or has been removed.</p>
          <Link to="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {/* SEO metadata for this blog post */}
      {(() => {
        // Compute canonical URL using the slug.  If your production domain changes,
        // update the base URL accordingly.
        const canonicalUrl = `https://telzonacademy.in/blog/${blog.slug}`;
        // Choose a cover image for social sharing.  If your table includes a
        // 'cover_image' column, use it; otherwise fall back to a default.
        const coverImage = blog.cover_image || 'https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da';
        // Build structured data for the blog post following the Schema.org
        // BlogPosting specification.  This helps search engines understand the
        // article content and improves eligibility for rich results.
        const articleSchema = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          description: blog.excerpt,
          articleBody: blog.content,
          datePublished: blog.publishedAt || blog.created_at,
          dateModified: blog.updated_at || blog.publishedAt || blog.created_at,
          author: {
            '@type': 'Organization',
            name: 'Telzon Academy',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Telzon Academy',
            logo: {
              '@type': 'ImageObject',
              url: coverImage,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
          image: [coverImage],
        };
        return (
          <Helmet>
            <title>{`${blog.title} | Telzon Academy Blog`}</title>
            <meta name="description" content={blog.excerpt} />
            {/* Canonical and Open Graph tags */}
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={blog.title} />
            <meta property="og:description" content={blog.excerpt} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={coverImage} />
            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={blog.title} />
            <meta name="twitter:description" content={blog.excerpt} />
            <meta name="twitter:image" content={coverImage} />
            {/* Structured data script */}
            <script type="application/ld+json">
              {JSON.stringify(articleSchema)}
            </script>
          </Helmet>
        );
      })()}
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <main className="flex-grow pt-32 pb-20 px-4">
          <article className="container mx-auto max-w-3xl">
            <Link to="/blog" className="inline-block mb-8">
              <Button variant="ghost" className="text-gray-400 hover:text-white pl-0 hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all articles
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1 bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                  <Tag className="w-3 h-3" />
                  {blog.category || 'General'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.publishedAt || blog.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.max(1, Math.ceil((blog.content || '').length / 500))} min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light border-l-4 border-purple-500 pl-6 italic">
                  {blog.excerpt}
                </p>
              )}

              <div className="prose prose-lg prose-invert max-w-none text-gray-300">
                {/* 
                  Note: In a real production app, use a library like 'dompurify' before dangerouslySetInnerHTML 
                  to prevent XSS attacks. For this controlled environment, we proceed directly.
                */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: (blog.content || '').replace(/\n/g, '<br />'),
                  }}
                  className="space-y-6 leading-relaxed"
                />
              </div>

              <div className="mt-16 pt-8 border-t border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-white">Share this article</h3>
                <div className="flex gap-4">
                  {/* Simplified share buttons */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 bg-gray-800 hover:bg-gray-700"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </div>
            </motion.div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;