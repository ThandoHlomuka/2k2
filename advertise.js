// =============================================
// 2k2 - Advertiser Portal (advertise.js)
// Shared logic for the advertiser portal page and
// the admin ad management panel.
//
// Depends on: script.js (Storage, wallet helpers,
// auth helpers, generateId) loaded BEFORE this file.
// =============================================
(function () {
  'use strict';

  // ---- Placements / ad products ----
  const AD_PLACEMENTS = {
    'sponsored-provider': { label: 'Sponsored Provider Card', price: 299, unit: 'week', desc: 'Pin your provider/business card to the top of the directory.' },
    'featured-listing':   { label: 'Featured Listing',        price: 199, unit: 'week', desc: 'Highlight a listing, service or content at the top of its category.' },
    'banner-top':         { label: 'Top Banner',              price: 499, unit: 'week', desc: 'A high-visibility banner at the top of every directory page.' },
    'banner-sidebar':     { label: 'Sidebar Banner',          price: 349, unit: 'week', desc: 'A banner in the sidebar seen across the whole portal.' },
    'in-feed':            { label: 'In-Feed Ad',              price: 249, unit: 'week', desc: 'A native ad card that appears in directory and browse feeds.' },
    'event-sponsor':      { label: 'Event Sponsorship',       price: 999, unit: 'event', desc: 'Brand a featured event or hosted experience.' }
  };

  const AD_TARGET_CATEGORIES = {
    'directory': 'Directory (Providers)',
    'venues': 'Venues',
    'services': 'Services',
    'content': 'Premium Content',
    'events': 'Events',
    'products': 'Products',
    'gigs': 'Gigs',
    'forum': 'Forum',
    'ads': 'Personal Ads',
    'all': 'All Categories'
  };

  // ---- Seed default packages the admin can edit ----
  function defaultAdPackages() {
    const now = new Date().toISOString();
    return [
      { id: 'pkg_banner', name: 'Top Banner', description: 'High-visibility banner at the top of directory pages for one week.', placement: 'banner-top', price: 499, durationDays: 7, features: ['Top of directory pages', 'Links to your site or profile', '7 days of display', 'Monthly impressions report'], active: true, createdAt: now },
      { id: 'pkg_sponsored', name: 'Sponsored Provider', description: 'Pin your provider or business card to the top of the directory for one week.', placement: 'sponsored-provider', price: 299, durationDays: 7, features: ['Pinned to top of directory', 'Appears in all category filters', '7 days of display', 'Click-through tracking'], active: true, createdAt: now },
      { id: 'pkg_featured', name: 'Featured Content Boost', description: 'Boost a listing, service or content piece to the top of its category.', placement: 'featured-listing', price: 199, durationDays: 7, features: ['Top of category', 'Higher visibility', '7 days of display', 'Impression tracking'], active: true, createdAt: now },
      { id: 'pkg_sidebar', name: 'Sidebar Banner', description: 'A banner shown in the sidebar across the entire portal for one week.', placement: 'banner-sidebar', price: 349, durationDays: 7, features: ['Seen across all pages', 'Short or long copy', '7 days of display', 'Weekly click report'], active: true, createdAt: now },
      { id: 'pkg_event', name: 'Event Sponsorship', description: 'Brand a featured event or hosted experience as a sponsor.', placement: 'event-sponsor', price: 999, durationDays: 1, features: ['Sponsor badge on event', 'Premium placement', 'Per-event sponsorship', 'Attendee visibility'], active: true, createdAt: now }
    ];
  }

  // ---- Helpers ----
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function toastEl(el) {
    if (!el) return function () {};
    return function (msg, ok) {
      el.textContent = msg;
      el.style.display = 'block';
      el.style.background = ok ? '#12301f' : '#3a1b17';
      el.style.borderColor = ok ? '#2e8b57' : '#d9534f';
      clearTimeout(el._h);
      el._h = setTimeout(function () { el.style.display = 'none'; }, 6000);
    };
  }

  function getPackages() {
    return window.Storage.getAdPackages();
  }
  function seedPackagesIfEmpty() {
    try { if (!window.Storage.getAdPackages().length) { window.Storage.setAdPackages(defaultAdPackages()); } } catch (e) {}
  }
  function getCampaigns() {
    return window.Storage.getAdCampaigns();
  }
  function getStats() {
    return window.Storage.getAdStats();
  }
  function getQueries() {
    return window.Storage.getAdvertiserQueries();
  }
  function guestId() {
    try {
      let id = localStorage.getItem('k2_guest_id') || '';
      if (!id) { id = 'g_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10); localStorage.setItem('k2_guest_id', id); }
      return id;
    } catch (e) { return ''; }
  }
  function authState() {
    const id = (typeof window.currentAuthId === 'function') ? (window.currentAuthId() || '') : '';
    return { id: id, signedIn: !!id };
  }
  function currentAdvertiserType() {
    // provider pages detect via path; here we inspect the signed-in profile role
    try {
      const snap = (window._2k2 && window._2k2.Auth) ? window._2k2.Auth.syncUser() : null;
      if (snap && (snap.role === 'provider' || snap.role === 'admin')) return 'provider';
    } catch (e) {}
    // fallback: current owner id came from a provider context
    try {
      if ((window._2k2_lastAuthType || '') === 'provider') return 'provider';
    } catch (e) {}
    if (/provider(\.html)?$/.test(window.location.pathname)) return 'provider';
    return 'user';
  }
  function money(n) { return 'R' + Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function generateId(prefix) { return (prefix || 'ad') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  function collectStats(campaignIds) {
    try {
      return window.Storage.getAdStats().filter(function (s) { return campaignIds.indexOf(s.campaignId) !== -1; });
    } catch (e) { return []; }
  }

  // =============================================
  // Self-serve pricing
  // base price from placement * duration multiplier
  // =============================================
  function selfServePrice(placement, days) {
    const p = AD_PLACEMENTS[placement];
    const base = p ? p.price : 199;
    days = Math.max(1, Math.min(90, Number(days) || 7));
    return Math.round(base * (days / 7) * 100) / 100;
  }

  // =============================================
  // Charge a signed-in user/provider wallet
  // Returns {ok, balance, message}
  // =============================================
  function chargeWallet(kind, amount, description) {
    const user = authState();
    if (!user.signedIn) return { ok: false, message: 'Please sign in to pay from your wallet.' };
    const ownerType = kind === 'provider' ? 'provider' : 'user';
    const ownerId = user.id;
    const balance = window.getWalletBalance(ownerType, ownerId);
    if (Number(balance) < Number(amount)) {
      return { ok: false, message: 'Insufficient wallet balance. You have ' + money(balance) + ' but this costs ' + money(amount) + '. Please top up first.' };
    }
    try {
      window.adjustWallet(ownerType, ownerId, -Number(amount), 'ad-spend', description, { camp: 'ad-spend' });
      return { ok: true, balance: Number(balance) - Number(amount) };
    } catch (err) {
      return { ok: false, message: 'Payment failed: ' + err.message };
    }
  }

  // =============================================
  // Submit a campaign
  // type: 'package' | 'custom' | 'selfserve'
  // =============================================
  function createCampaign(data) {
    const campaigns = getCampaigns();
    const now = new Date().toISOString();
    const c = Object.assign({
      id: generateId('camp'),
      advertiserId: data.advertiserId || '',
      advertiserType: data.advertiserType || 'guest',
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      type: 'custom',
      placement: 'banner-top',
      title: '',
      headline: '',
      body: '',
      image: '',
      linkUrl: '',
      targetingCategory: 'all',
      targetingLocation: '',
      price: 0,
      budget: 0,
      durationDays: 7,
      startDate: now,
      endDate: '',
      status: 'pending',
      adminNote: '',
      paidFromWallet: false,
      source: 'external',
      impressions: 0,
      clicks: 0,
      createdAt: now,
      updatedAt: now
    }, data);
    if (!c.endDate) {
      const s = new Date(c.startDate || now);
      c.endDate = new Date(s.getTime() + (Number(c.durationDays) || 7) * 86400000).toISOString();
    }
    campaigns.unshift(c);
    window.Storage.setAdCampaigns(campaigns);
    return c;
  }

  // =============================================
  // Public API
  // =============================================
  window._2k2Ads = {
    AD_PLACEMENTS: AD_PLACEMENTS,
    AD_TARGET_CATEGORIES: AD_TARGET_CATEGORIES,
    defaultAdPackages: defaultAdPackages,
    seedPackagesIfEmpty: seedPackagesIfEmpty,
    getPackages: getPackages,
    getCampaigns: getCampaigns,
    getStats: getStats,
    getQueries: getQueries,
    esc: esc,
    money: money,
    authState: authState,
    currentAdvertiserType: currentAdvertiserType,
    selfServePrice: selfServePrice,
    chargeWallet: chargeWallet,
    createCampaign: createCampaign,
    generateId: generateId,
    collectStats: collectStats,
    guestId: guestId
  };

  // Record a single impression/click for a live campaign
  function record(campaignId, type) {
    try {
      const stats = getStats();
      stats.push({ id: generateId('st'), campaignId: campaignId, type: type, recordedAt: new Date().toISOString() });
      window.Storage.setAdStats(stats);
      const campaigns = getCampaigns();
      const c = campaigns.find(function (x) { return x.id === campaignId; });
      if (c) {
        if (type === 'click') c.clicks = (c.clicks || 0) + 1;
        else c.impressions = (c.impressions || 0) + 1;
        window.Storage.setAdCampaigns(campaigns);
      }
    } catch (e) {}
  }

  // Return list of campaigns that should be displayed for a given placement +
  // category, and record impressions.
  function liveCampaignsFor(placement, category) {
    const now = new Date().getTime();
    const out = [];
    getCampaigns().forEach(function (c) {
      if (c.status !== 'live') return;
      if (c.placement && c.placement !== placement) return;
      if (category && c.targetingCategory && c.targetingCategory !== 'all' && c.targetingCategory !== category) return;
      const end = new Date(c.endDate || c.createdAt).getTime();
      if (end < now) return;
      out.push(c);
    });
    // record impressions
    out.slice(0, 5).forEach(function (c) { record(c.id, 'impression'); });
    return out.slice(0, 5);
  }

  // Reconcile statuses: mark live campaigns past their end date as completed.
  function reconcileCampaignStatus() {
    try {
      const now = new Date().getTime();
      let changed = false;
      getCampaigns().forEach(function (c) {
        if (c.status === 'live' && new Date(c.endDate).getTime() < now) {
          c.status = 'completed';
          c.updatedAt = new Date().toISOString();
          changed = true;
        }
      });
      if (changed) window.Storage.setAdCampaigns(getCampaigns());
    } catch (e) {}
  }

  window._2k2Ads.record = record;
  window._2k2Ads.liveCampaignsFor = liveCampaignsFor;
  window._2k2Ads.reconcileCampaignStatus = reconcileCampaignStatus;

  // Auto-seed on load if running on a page that includes this script
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    try { seedPackagesIfEmpty(); reconcileCampaignStatus(); } catch (e) {}
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      try { seedPackagesIfEmpty(); reconcileCampaignStatus(); } catch (e) {}
    });
  }
})();
