import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lcnfnwivodzjjpykihfn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbmZud2l2b2R6ampweWtpaGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTUxNDYsImV4cCI6MjA4MTM5MTE0Nn0.8tcOMzqCHKcfB82rUcTCjeFq0X8-3p2urQL0GQ778dE';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
