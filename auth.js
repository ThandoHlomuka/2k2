// =============================================
// 2k2 - Auth helpers (shared)
// Loaded after config.js + supabase CDN.
// Session is persisted by @supabase/supabase-js.
// =============================================
(function () {
  'use strict';

  const _2k2 = window._2k2 = window._2k2 || {};
  _2k2.Auth = {};

  function getClient() {
    return _2k2.getSupabase ? _2k2.getSupabase() : null;
  }

  // Current auth session (never caches a stale null).
  async function getSession() {
    const client = getClient();
    if (!client) return null;
    try {
      const { data, error } = await client.auth.getSession();
      if (error) return null;
      return data?.session || null;
    } catch (e) { return null; }
  }

  async function currentUser() {
    const s = await getSession();
    return s?.user || null;
  }

  // Cache the profile per user id so repeated calls during boot do not
  // hammer Supabase. Invalidated when the auth user changes or on sign-out.
  let profileCache = { userId: null, profile: null, ts: 0 };

  // The profile record (role) for the current auth user.
  async function getProfile({ force } = {}) {
    const user = await currentUser();
    if (!user) return null;
    const cacheKey = user.id;
    // Serve cached copy within 5s unless forced refresh.
    if (!force && profileCache.userId === cacheKey && profileCache.profile && (Date.now() - profileCache.ts) < 5000) {
      return profileCache.profile;
    }
    const client = getClient();
    try {
      const { data } = await client
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      profileCache = { userId: cacheKey, profile: data || null, ts: Date.now() };
      return data || null;
    } catch (e) { return null; }
  }

  // Convenience: role of current user ('user'|'provider'|'admin'|null).
  async function currentRole() {
    const p = await getProfile();
    return p ? p.role : null;
  }

  async function signOut() {
    const client = getClient();
    profileCache = { userId: null, profile: null, ts: 0 };
    if (!client) return;
    try { await client.auth.signOut(); } catch (e) {}
  }

  // Ensure a localStorage mirror of the current role for sync UI decisions.
  async function refreshSyncUser() {
    const user = await currentUser();
    const profile = await getProfile();
    const snap = {
      user_id: user ? user.id : null,
      email: user ? user.email : null,
      role: profile ? profile.role : null,
      status: profile ? profile.status : null
    };
    try { localStorage.setItem('k2_current_user', JSON.stringify(snap)); } catch (e) {}
    return snap;
  }

  function syncUser() {
    try { return JSON.parse(localStorage.getItem('k2_current_user') || 'null'); }
    catch (e) { return null; }
  }

  _2k2.Auth = {
    getSession: getSession,
    currentUser: currentUser,
    getProfile: getProfile,
    currentRole: currentRole,
    signOut: signOut,
    refreshSyncUser: refreshSyncUser,
    syncUser: syncUser
  };
})();
