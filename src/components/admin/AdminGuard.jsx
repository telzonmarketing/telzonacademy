import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const ADMIN_EMAILS = ['telzoncilentsbusiness@gmail.com'];

export const isAdminEmail = (email) =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());

const AdminGuard = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState({ loading: true, user: null });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setStatus({ loading: false, user: data?.session?.user ?? null });
    };
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus({ loading: false, user: session?.user ?? null });
    });

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (status.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060612] text-white">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    );
  }

  const email = status.user?.email?.toLowerCase();

  if (!status.user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdminEmail(email)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#060612] text-white px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Not authorised</h1>
        <p className="text-gray-400 max-w-md">
          The account <span className="text-violet-300">{email}</span> doesn't have admin access.
          Sign in with the Telzon admin email to continue.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  return children;
};

export default AdminGuard;
