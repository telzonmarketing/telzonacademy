import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { isAdminEmail } from '@/components/admin/AdminGuard';

// One-password login. The Supabase admin user is fixed; the user only types
// the password. Update this email if you change the admin user.
const ADMIN_EMAIL = 'telzoncilentsbusiness@gmail.com';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin';

  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const e = data?.session?.user?.email;
      if (e && isAdminEmail(e)) navigate(redirectTo, { replace: true });
    });
  }, [navigate, redirectTo]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (err) {
      setLoading(false);
      setError('Incorrect password.');
      return;
    }

    if (!isAdminEmail(data?.user?.email)) {
      await supabase.auth.signOut();
      setLoading(false);
      setError('This account is not an admin.');
      return;
    }

    setLoading(false);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#060612' }}>
      <Helmet>
        <title>Admin Login | Telzon Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-500/40">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Telzon Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Enter password to continue</p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl p-6 border border-white/10 space-y-4"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type={showPw ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-violet-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Signing in…' : 'Unlock Dashboard'}
          </button>

          <p className="text-[11px] text-gray-600 text-center pt-1 leading-relaxed">
            Forgot the password? Reset it in Supabase → Authentication → Users.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
