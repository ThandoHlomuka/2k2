// =============================================
// 2k2 - Real presence tracking
// Handles:
//   - signed-in user presence heartbeat (presence table)
//   - anonymous guest presence heartbeat (guest_presence table)
//   - fetching the combined online dataset
//   - realtime subscription for live updates
// Loaded after auth.js, before script.js.
// =============================================
(function () {
  'use strict';

  const _2k2 = window._2k2 = window._2k2 || {};
  const HEARTBEAT_MS = 15000;   // write presence every 15s
  const ONLINE_MS = 60000;      // last_seen within 60s => online

  function getClient() {
    return _2k2.getSupabase ? _2k2.getSupabase() : null;
  }

  function getGuestId() {
    let id = null;
    try { id = localStorage.getItem('k2_guest_id'); } catch (e) {}
    if (!id) {
      id = 'g_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 10);
      try { localStorage.setItem('k2_guest_id', id); } catch (e) {}
    }
    return id;
  }

  function usernameFromEmail(email) {
    if (!email) return '';
    const local = String(email).split('@')[0].replace(/[._-]+/g, ' ');
    return local.trim() || String(email);
  }

  // ---------------- signed-in user heartbeat ----------------
  function startUserHeartbeat() {
    const client = getClient();
    if (!client) return;
    let running = false;

    async function pump() {
      if (running) return;
      running = true;
      try {
        const sid = await _2k2.Auth.getSession();
        if (!sid || !sid.user) { running = false; return; }
        const profile = await _2k2.Auth.getProfile();
        const displayName =
          (profile && (profile.display_name || profile.full_name)) ||
          sid.user.user_metadata?.full_name ||
          sid.user.user_metadata?.name ||
          usernameFromEmail(sid.user.email) ||
          sid.user.email ||
          'User';
        await client.from('presence').upsert(
          {
            id: sid.user.id,
            role: profile ? profile.role : 'user',
            display_name: displayName,
            email: sid.user.email || null,
            last_seen: new Date().toISOString()
          },
          { onConflict: 'id' }
        );
      } catch (e) { /* transient; ignore */ }
      finally { running = false; }
    }

    pump();
    setInterval(pump, HEARTBEAT_MS);
  }

  // ---------------- guest heartbeat ----------------
  function startGuestHeartbeat() {
    const client = getClient();
    if (!client) return;
    const guestId = getGuestId();
    // label: e.g. "Guest" + short id so admins can tell guests apart
    const label = 'Guest ' + guestId.slice(-6).toUpperCase();

    async function pump() {
      try {
        await client.rpc('touch_guest_presence', { p_guest_id: guestId, p_label: label });
      } catch (e) { /* transient; ignore */ }
    }

    pump();
    setInterval(pump, HEARTBEAT_MS);
  }

  // Guys only start GUEST heartbeat when NOT signed in; signed-in
  // users heartbeat the auth-keyed presence table instead.
  function init() {
    _2k2.Auth.getSession().then(function (sid) {
      if (sid && sid.user) {
        startUserHeartbeat();
      } else {
        startGuestHeartbeat();
      }
    });
  }

  // ---------------- fetching online dataset ----------------
  // Returns { members: [], guests: [] }
  async function fetchPresence() {
    const client = getClient();
    const out = { members: [], guests: [] };
    if (!client) return out;
    try {
      const now = Date.now();
      // signed-in members
      const { data: members, error: e1 } = await client
        .from('presence')
        .select('id, role, display_name, email, last_seen');
      if (!e1 && members) {
        out.members = members.map(function (m) {
          const t = m.last_seen ? new Date(m.last_seen).getTime() : 0;
          return {
            id: m.id,
            name: m.display_name || usernameFromEmail(m.email) || m.email || 'Member',
            role: m.role || 'user',
            email: m.email || '',
            location: '',
            photo: '',
            bio: '',
            lastSeen: t,
            online: (now - t) < ONLINE_MS
          };
        });
      }
      // guests
      const { data: guests, error: e2 } = await client
        .from('guest_presence')
        .select('guest_id, label, last_seen');
      if (!e2 && guests) {
        out.guests = guests.map(function (g) {
          const t = g.last_seen ? new Date(g.last_seen).getTime() : 0;
          return {
            id: g.guest_id,
            name: g.label || 'Guest',
            role: 'guest',
            email: '',
            location: '',
            photo: '',
            bio: 'Browsing as guest',
            lastSeen: t,
            online: (now - t) < ONLINE_MS
          };
        });
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  // ---------------- realtime live refresh ----------------
  function subscribePresence() {
    const client = getClient();
    if (!client || typeof client.channel !== 'function') return;
    try {
      const channel = client
        .channel('presence-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'presence' }, function () {
          refreshOnlineList();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_presence' }, function () {
          refreshOnlineList();
        })
        .subscribe();
      _2k2.Presence._channel = channel;
    } catch (e) { /* ignore */ }
  }

  function refreshOnlineList() {
    const el = document.getElementById('onlineUsersList');
    if (el && window.renderOnlineUsers) {
      window.renderOnlineUsers();
    }
  }

  _2k2.Presence = {
    HEARTBEAT_MS: HEARTBEAT_MS,
    ONLINE_MS: ONLINE_MS,
    init: init,
    fetchPresence: fetchPresence,
    subscribePresence: subscribePresence,
    getGuestId: getGuestId
  };

  // start once after auth helpers exist and DOM is ready
  function boot() {
    if (!window._2k2.Auth) return;
    init();
    subscribePresence();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
