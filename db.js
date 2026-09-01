// =============================================
// 2k2 - Hybrid Sync-Cache data layer
// Loaded BEFORE script.js.
//
// Preserves the synchronous `Storage` API used by
// the whole app (Storage.getUsers() / setUsers()...)
// while persisting every write to Supabase and
// hydrating from Supabase on load. Existing
// localStorage data is migrated up automatically.
// =============================================
(function () {
  'use strict';

  const _2k2 = window._2k2 = window._2k2 || {};

  // name: Storage method suffix, col: app_data collection, key: localStorage key
  const COLLECTIONS = [
    { name: 'Users', col: 'users', key: 'k2_users' },
    { name: 'Providers', col: 'providers', key: 'k2_providers' },
    { name: 'Listings', col: 'listings', key: 'k2_listings' },
    { name: 'Venues', col: 'venues', key: 'k2_venues' },
    { name: 'Ads', col: 'ads', key: 'k2_ads' },
    { name: 'Services', col: 'services', key: 'k2_services' },
    { name: 'Bookings', col: 'bookings', key: 'k2_bookings' },
    { name: 'Tips', col: 'tips', key: 'k2_tips' },
    { name: 'CustomServiceTypes', col: 'service_types', key: 'k2_service_types' },
    { name: 'Wallets', col: 'wallets', key: 'k2_wallets' },
    { name: 'Transactions', col: 'transactions', key: 'k2_transactions' },
    { name: 'TopUpRequests', col: 'topup_requests', key: 'k2_topup_requests' },
    { name: 'WithdrawalRequests', col: 'withdrawal_requests', key: 'k2_withdrawal_requests' },
    { name: 'Content', col: 'content', key: 'k2_content' },
    { name: 'Events', col: 'events', key: 'k2_events' },
    { name: 'ContentComments', col: 'content_comments', key: 'k2_content_comments' },
    { name: 'ContentReactions', col: 'content_reactions', key: 'k2_content_reactions' },
    { name: 'Reviews', col: 'reviews', key: 'k2_reviews' },
    { name: 'ForumThreads', col: 'forum_threads', key: 'k2_forum_threads' },
    { name: 'ForumReplies', col: 'forum_replies', key: 'k2_forum_replies' },
    { name: 'ForumLikes', col: 'forum_likes', key: 'k2_forum_likes' },
    { name: 'Gigs', col: 'gigs', key: 'k2_gigs' },
    { name: 'Conversations', col: 'conversations', key: 'k2_conversations' },
    { name: 'Messages', col: 'messages', key: 'k2_messages' },
    { name: 'SavedItems', col: 'saved_items', key: 'k2_saved_items' },
    { name: 'Downloads', col: 'downloads', key: 'k2_downloads' },
    { name: 'Experiences', col: 'experiences', key: 'k2_experiences' },
    { name: 'ExperiencePurchases', col: 'experience_purchases', key: 'k2_experience_purchases' },
    { name: 'FantasyRequests', col: 'fantasy_requests', key: 'k2_fantasy_requests' },
    { name: 'Products', col: 'products', key: 'k2_products' },
    { name: 'ProductOrders', col: 'product_orders', key: 'k2_product_orders' },
    { name: 'HelpQueries', col: 'help_queries', key: 'k2_help_queries' },
    { name: 'Follows', col: 'follows', key: 'k2_follows' },
    { name: 'EscrowFunds', col: 'escrow_funds', key: 'k2_escrow_funds' }
  ];

  const cache = {};      // col -> array
  const writeQueues = {}; // col -> promise chain
  let readyState = false;

  function getClient() {
    return window._2k2.getSupabase ? window._2k2.getSupabase() : null;
  }

  // ---- local helpers ----
  function loadLocal(col) {
    try { return JSON.parse(localStorage.getItem('k2_' + col) || '[]') || []; }
    catch (e) { return []; }
  }

  // ---- sync cache (what the app actually reads/writes) ----
  function get(col) {
    if (!(col in cache)) cache[col] = loadLocal(col);
    return cache[col];
  }
  function set(col, arr) {
    arr = Array.isArray(arr) ? arr : [];
    cache[col] = arr;
    try { localStorage.setItem('k2_' + col, JSON.stringify(arr)); } catch (e) { /* storage full */ }
    push(col, arr);
    return arr;
  }

  // ---- async Supabase write (serialized per collection, last-write-wins) ----
  function push(col, arr) {
    const client = getClient();
    if (!client) return;
    const payload = JSON.parse(JSON.stringify(arr)); // strip functions/cycles
    writeQueues[col] = (writeQueues[col] || Promise.resolve())
      .catch(function () {})
      .then(function () {
        return client
          .from('app_data')
          .upsert(
            { collection: col, data: payload, updated_at: new Date().toISOString() },
            { onConflict: 'collection' }
          );
      });
  }

  // ---- hydrate from Supabase, reconcile + migrate ----
  async function hydrate() {
    const client = getClient();
    // Seed cache from localStorage synchronously so the first render is instant.
    COLLECTIONS.forEach(function (c) { if (!(c.col in cache)) cache[c.col] = loadLocal(c.col); });

    if (!client) { readyState = true; return; }

    try {
      const { data, error } = await client
        .from('app_data')
        .select('collection,data');

      if (error) throw error;

      const remote = {};
      (data || []).forEach(function (r) { remote[r.collection] = r.data || []; });

      for (const c of COLLECTIONS) {
        const local = loadLocal(c.col);
        if (c.col in remote) {
          // Supabase is authoritative; adopt it (and mirror to cache/local).
          cache[c.col] = Array.isArray(remote[c.col]) ? remote[c.col] : local;
          try { localStorage.setItem('k2_' + c.col, JSON.stringify(cache[c.col])); } catch (e) {}
        } else if (local.length > 0) {
          // Fresh DB: migrate existing localStorage data up.
          cache[c.col] = local;
          push(c.col, local);
        }
      }
      readyState = true;
    } catch (e) {
      // Offline / RLS failure: fall back to localStorage-only (degraded).
      readyState = true;
    }

    // After hydration, re-render the currently visible page so fresh remote
    // data appears immediately (no manual refresh needed).
    try {
      var rerender = window.rerenderCurrentPage;
      if (typeof rerender === 'function') rerender();
    } catch (e) {}
  }

  _2k2.DB = {
    get: get,
    set: set,
    hydrate: hydrate,
    ready: function () { return readyState; },
    isSupabaseReady: function () { return !!getClient() && !!window.supabase; },
    getClient: getClient,
    columns: COLLECTIONS
  };

  // ---- Build the `Storage` object the rest of the app depends on ----
  const Storage = {};
  COLLECTIONS.forEach(function (c) {
    Storage['get' + c.name] = function () { return get(c.col); };
    Storage['set' + c.name] = function (data) { return set(c.col, data); };
  });
  Storage.clearAll = function () {
    COLLECTIONS.forEach(function (c) {
      delete cache[c.col];
      try { localStorage.removeItem('k2_' + c.col); } catch (e) {}
      if (getClient()) {
        writeQueues[c.col] = writeQueues[c.col] || Promise.resolve();
      }
    });
  };

  window.Storage = Storage;
  _2k2.Storage = Storage;

  // Kick off hydration after DOM so nothing blocks first paint.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(); });
  } else {
    hydrate();
  }
})();
