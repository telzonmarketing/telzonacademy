import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Search,
  Video,
  TrendingUp,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/leads', icon: Users, label: 'Leads' },
  { to: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { to: '/admin/seo', icon: Search, label: 'SEO Settings' },
  { to: '/admin/videos', icon: Video, label: 'Videos' },
  { to: '/admin/meta-ads', icon: TrendingUp, label: 'Meta Ads' },
];

const AdminShell = ({ title, children }) => {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#060612' }}>
      <Helmet>
        <title>{title ? `${title} — Admin | Telzon Academy` : 'Admin | Telzon Academy'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen flex-shrink-0 border-r border-white/[0.07] sticky top-0 hidden md:block">
          <div className="px-5 py-5 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-orange-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Telzon Admin</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Control center</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {NAV.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/30 to-orange-500/20 text-white border border-violet-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-4 left-3 right-3 space-y-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View site
            </a>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#060612]/95 backdrop-blur border-b border-white/[0.07]">
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-sm font-black">Telzon Admin</p>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-white">
              Sign out
            </button>
          </div>
          <div className="overflow-x-auto flex gap-1 px-3 pb-3">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-violet-600/30 text-white border border-violet-500/30' : 'text-gray-400 border border-transparent'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0 md:pt-0 pt-24">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            {title && (
              <h1 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">{title}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
