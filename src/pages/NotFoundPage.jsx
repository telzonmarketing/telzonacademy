import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Catch-all for unknown URLs. The server returns index.html for every path,
// so without this an unknown address showed an empty page that search engines
// could index ("soft 404"). noindex keeps those URLs out of Google.
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Page Not Found | Telzon Academy</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Page not found</h1>
          <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has moved.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="btn-primary px-6 py-3">Home</Link>
            <Link to="/pages/digital-marketing-course-in-nagpur/" className="btn-secondary px-6 py-3">Digital marketing course</Link>
            <Link to="/blog/" className="btn-secondary px-6 py-3">Blog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
