// =============================================
// 2k2 - Supabase configuration (shared)
// Loaded before script.js on every portal.
// =============================================
(function () {
  const SUPABASE_URL = 'https://kagpmugybyisfmqhbrzu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ3BtdWd5Ynlpc2ZtcWhicnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNDU4ODcsImV4cCI6MjEwMjYyMTg4N30.Q_2avIVOkgIVFbVOyPgslhk8aYI23B_bfk1gxN_0JTs';

  window.SUPABASE_CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY };
  window._2k2 = window._2k2 || {};

  // Singleton supabase client (created once the CDN lib is present).
  window._2k2.getSupabase = function () {
    if (!window.supabase) return null;
    if (!window._2k2.client) {
      window._2k2.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }
    return window._2k2.client;
  };
})();
