import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PracticalLearning from '@/components/PracticalLearning';
import ComparisonTable from '@/components/ComparisonTable';
import FreeDemoRegistration from '@/components/FreeDemoRegistration';
import AIMarketing from '@/components/AIMarketing';
import Curriculum from '@/components/Curriculum';
import Mentorship from '@/components/Mentorship';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import PlacementsAndCareers from '@/components/PlacementsAndCareers';
import BestCourseSection from '@/components/BestCourseSection';
import AdminBlogs from '@/components/AdminBlogs';
import BlogList from '@/components/BlogList';
import BlogPost from '@/components/BlogPost';
import LatestBlogsHome from '@/components/LatestBlogsHome';
import WelcomeMessage from '@/components/WelcomeMessage';
import SeoSettingsDashboard from '@/components/SeoSettingsDashboard';
import GlobalSeo from '@/components/GlobalSeo';
import LandingPage from '@/pages/LandingPage';
import TrackingScripts from '@/components/TrackingScripts';
import LeadGenerationPage from '@/pages/LeadGenerationPage';
import WatchDemoPage from '@/pages/WatchDemoPage';

// Admin
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminLeads from '@/pages/admin/AdminLeads';
import AdminMetaAds from '@/pages/admin/AdminMetaAds';
import AdminVideos from '@/pages/admin/AdminVideos';

function HomePage() {
  return (
    <>
      <GlobalSeo />
      <div className="min-h-screen text-white overflow-x-hidden font-sans" style={{ scrollBehavior: 'smooth' }}>
        <Header />
        <main>
          <ScrollReveal><Hero /></ScrollReveal>
          <ScrollReveal><BestCourseSection /></ScrollReveal>
          <ScrollReveal><FreeDemoRegistration /></ScrollReveal>
          <ScrollReveal><PlacementsAndCareers /></ScrollReveal>

          {/* Logo Slider placed strategically for high-end feel */}
          <WelcomeMessage />

          <ScrollReveal><PracticalLearning /></ScrollReveal>
          <ScrollReveal><ComparisonTable /></ScrollReveal>
          <ScrollReveal><AIMarketing /></ScrollReveal>
          <ScrollReveal><Curriculum /></ScrollReveal>
          <ScrollReveal><LatestBlogsHome /></ScrollReveal>
          <ScrollReveal><Mentorship /></ScrollReveal>
          <ScrollReveal><FAQ /></ScrollReveal>
          <ScrollReveal><ContactForm /></ScrollReveal>
          <ScrollReveal><FinalCTA /></ScrollReveal>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/lead-generation-package" element={<LeadGenerationPage />} />
        <Route path="/free-demo" element={<LeadGenerationPage />} />
        <Route path="/new-batch" element={<WatchDemoPage />} />
        <Route path="/watch-demo" element={<WatchDemoPage />} />
        {/* Dynamic landing pages for keyword-targeted content */}
        <Route path="/pages/:slug" element={<LandingPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminOverview /></AdminGuard>} />
        <Route path="/admin/leads" element={<AdminGuard><AdminLeads /></AdminGuard>} />
        <Route path="/admin/blogs" element={<AdminGuard><AdminBlogs /></AdminGuard>} />
        <Route path="/admin/seo" element={<AdminGuard><SeoSettingsDashboard /></AdminGuard>} />
        <Route path="/admin/videos" element={<AdminGuard><AdminVideos /></AdminGuard>} />
        <Route path="/admin/meta-ads" element={<AdminGuard><AdminMetaAds /></AdminGuard>} />

        {/* Legacy URLs — redirect to the new auth-protected routes */}
        <Route path="/private-free-demo-leads-94f7c1a2d3" element={<Navigate to="/admin/leads" replace />} />
        <Route path="/seo-settings-dashboard-telzon-secret-2024" element={<Navigate to="/admin/seo" replace />} />
      </Routes>
      <TrackingScripts />
      <Toaster />
    </Router>
  );
}

// Optimized Scroll Reveal Component
const ScrollReveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    /* Transition set to 'spring' to remove jerky lag */
    transition={{ 
      type: "spring",
      stiffness: 50,
      damping: 25,
      mass: 1
    }}
    style={{ willChange: 'transform, opacity' }} // Forces GPU acceleration to eliminate lag
  >
    {children}
  </motion.div>
);

export default App;
