// ==========================================
// 2k2 - CRUD Profile Management System
// ==========================================
// Storage hooks ready for Vercel integration
// Replace localStorage calls with your storage API

// Storage is provided by db.js (loaded before this file).
// It exposes the same synchronous getX()/setX() API, backed by
// Supabase with a hybrid sync-cache (see db.js).

const SA_PROVINCES = {
    'gauteng': { label: 'Gauteng', cities: ['Johannesburg','Pretoria','Sandton','Randburg','Roodepoort','Soweto','Midrand','Centurion','Benoni','Boksburg','Brakpan','Germiston','Kempton Park','Alberton','Vanderbijlpark','Vereeniging','Krugersdorp','Springs'] },
    'western-cape': { label: 'Western Cape', cities: ['Cape Town','Stellenbosch','Paarl','George','Worcester','Hermanus','Somerset West','Strand','Camps Bay','Claremont','Bellville','Mossel Bay','Oudtshoorn','Saldanha Bay'] },
    'kwazulu-natal': { label: 'KwaZulu-Natal', cities: ['Durban','Pietermaritzburg','Umhlanga','Richards Bay','Newcastle','Port Shepstone','Ladysmith','Pinetown','Ballito','Margate'] },
    'eastern-cape': { label: 'Eastern Cape', cities: ['Port Elizabeth','East London','Grahamstown','Mthatha','Queenstown','Jeffreys Bay'] },
    'free-state': { label: 'Free State', cities: ['Bloemfontein','Welkom','Bethlehem','Harrismith'] },
    'mpumalanga': { label: 'Mpumalanga', cities: ['Nelspruit','Witbank','Middelburg','Secunda','Hazyview'] },
    'limpopo': { label: 'Limpopo', cities: ['Polokwane','Thohoyandou','Tzaneen','Mokopane'] },
    'north-west': { label: 'North West', cities: ['Rustenburg','Mahikeng','Potchefstroom','Klerksdorp','Brits'] },
    'northern-cape': { label: 'Northern Cape', cities: ['Kimberley','Upington','Springbok','De Aar'] }
};

function generateSAProvinceOptions() {
    return '<option value="">All Provinces</option>' +
        Object.entries(SA_PROVINCES).map(([key, prov]) =>
            `<optgroup label="${prov.label}">` +
            prov.cities.map(city => `<option value="${city}">${city}</option>`).join('') +
            '</optgroup>'
        ).join('');
}

function generateSAProvinceSelect(selected) {
    return '<option value="">Select location</option>' +
        Object.entries(SA_PROVINCES).map(([key, prov]) =>
            `<optgroup label="${prov.label}">` +
            prov.cities.map(city => `<option value="${city}"${city === selected ? ' selected' : ''}>${city}</option>`).join('') +
            '</optgroup>'
        ).join('');
}

const DIRECTORY_TYPES = {
    'content-creator': { label: 'Content Creator', icon: 'fa-video', color: '#8b5cf6' },
    'model': { label: 'Model', icon: 'fa-camera-retro', color: '#ec4899' },
    'exotic-dancer': { label: 'Exotic Dancer', icon: 'fa-music', color: '#f59e0b' },
    'escort': { label: 'Escort', icon: 'fa-gem', color: '#6366f1' },
    'nude-chef': { label: 'Nude Chef', icon: 'fa-utensils', color: '#ef4444' },
    'masseuse': { label: 'Masseuse', icon: 'fa-spa', color: '#0ea5e9' }
};

const VENUE_TYPES = {
    'bnb': { label: 'B&B', icon: 'fa-house-chimney', color: '#10b981' },
    'lodge': { label: 'Lodge', icon: 'fa-campground', color: '#f59e0b' },
    'hotel': { label: 'Hotel', icon: 'fa-bed', color: '#3b82f6' },
    'fetish-club': { label: 'Fetish Club', icon: 'fa-mask', color: '#8b5cf6' },
    'nightclub': { label: 'Nightclub', icon: 'fa-moon', color: '#6366f1' },
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#8a7b55' }
};

const AD_CATEGORIES = {
    'woman-seeking-man': { label: 'Woman Seeking Man', icon: 'fa-venus', color: '#ec4899' },
    'man-seeking-woman': { label: 'Man Seeking Woman', icon: 'fa-mars', color: '#3b82f6' },
    'woman-seeking-woman': { label: 'Woman Seeking Woman', icon: 'fa-venus-double', color: '#d946ef' },
    'man-seeking-man': { label: 'Man Seeking Man', icon: 'fa-mars-double', color: '#6366f1' },
    'couple-seeking-single': { label: 'Couple Seeking Single', icon: 'fa-user-group', color: '#8b5cf6' },
    'single-seeking-couple': { label: 'Single Seeking Couple', icon: 'fa-user-group', color: '#a855f7' },
    'services-offered': { label: 'Services Offered', icon: 'fa-hand-holding-heart', color: '#10b981' },
    'services-wanted': { label: 'Services Wanted', icon: 'fa-search', color: '#f59e0b' },
    'friends-with-benefits': { label: 'Friends with Benefits', icon: 'fa-handshake', color: '#0ea5e9' },
    'casual-hookups': { label: 'Casual Hookups', icon: 'fa-fire', color: '#ef4444' },
    'general': { label: 'General', icon: 'fa-tag', color: '#8a7b55' }
};

const GIG_TYPES = {
    'photography': { label: 'Photography', icon: 'fa-camera', color: '#ec4899' },
    'modeling': { label: 'Modeling', icon: 'fa-person', color: '#8b5cf6' },
    'dancing': { label: 'Dancing / Entertainment', icon: 'fa-music', color: '#f59e0b' },
    'catering': { label: 'Catering / Chef', icon: 'fa-utensils', color: '#10b981' },
    'massage': { label: 'Massage / Wellness', icon: 'fa-spa', color: '#0ea5e9' },
    'stripping': { label: 'Striptease / Performance', icon: 'fa-star', color: '#d946ef' },
    'companionship': { label: 'Companionship', icon: 'fa-heart', color: '#ef4444' },
    'event-staff': { label: 'Event Staffing', icon: 'fa-people-group', color: '#6366f1' },
    'content-creation': { label: 'Content Creation', icon: 'fa-video', color: '#a855f7' },
    'domming': { label: 'Dom / Sub Services', icon: 'fa-link', color: '#8a7b55' },
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#8a7b55' }
};

const SERVICE_TYPES = {}; // Replaced by dynamic custom service types

const BOOKING_STATUSES = {
    'pending': { label: 'Pending', color: '#f59e0b', icon: 'fa-clock' },
    'confirmed': { label: 'Confirmed', color: '#10b981', icon: 'fa-check-circle' },
    'completed': { label: 'Completed', color: '#3b82f6', icon: 'fa-flag-checkered' },
    'cancelled': { label: 'Cancelled', color: '#ef4444', icon: 'fa-ban' }
};

const CONTENT_TYPES = {
    'video': { label: 'Videos', icon: 'fa-video', color: '#ef4444', accept: 'video/*' },
    'image': { label: 'Images', icon: 'fa-image', color: '#ec4899', accept: 'image/*' },
    'gif': { label: 'GIFs', icon: 'fa-icons', color: '#f59e0b', accept: 'image/gif' },
    'audio': { label: 'Audio (ASMR)', icon: 'fa-headphones', color: '#8b5cf6', accept: 'audio/*' },
    'podcast': { label: 'Podcasts', icon: 'fa-podcast', color: '#3b82f6', accept: 'audio/*' },
    'story': { label: 'Stories', icon: 'fa-book-open', color: '#10b981', accept: '' },
    'book': { label: 'Books', icon: 'fa-book', color: '#06b6d4', accept: '' }
};

const EVENT_TYPES = {
    'party': { label: 'Parties', icon: 'fa-champagne-glasses', color: '#ec4899' },
    'g2g': { label: 'G2G', icon: 'fa-people-arrows', color: '#8b5cf6' },
    'club': { label: 'Club Invites', icon: 'fa-compact-disc', color: '#3b82f6' },
    'fun': { label: 'Fun Nights/Days', icon: 'fa-sun', color: '#f59e0b' },
    'cookout': { label: 'Cookout', icon: 'fa-fire-burner', color: '#ef4444' },
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#8a7b55' }
};

const EXPERIENCE_TYPES = {
    'multiplayer': { label: 'Multiplayer', icon: 'fa-users', color: '#ec4899' },
    'arcade': { label: 'Arcade', icon: 'fa-gamepad', color: '#8b5cf6' },
    'board-game': { label: 'Board Games', icon: 'fa-chess-board', color: '#f59e0b' },
    'card-game': { label: 'Card Games', icon: 'fa-suitcase', color: '#10b981' },
    'betting': { label: 'Betting & Wagers', icon: 'fa-dice', color: '#0ea5e9' },
    'trivia': { label: 'Trivia & Quizzes', icon: 'fa-lightbulb', color: '#ef4444' },
    'sports': { label: 'Sports & Physical', icon: 'fa-futbol', color: '#3b82f6' },
    'virtual': { label: 'Virtual / VR', icon: 'fa-vr-cardboard', color: '#a855f7' },
    'strategy': { label: 'Strategy & Puzzles', icon: 'fa-brain', color: '#06b6d4' },
    'tournament': { label: 'Tournaments', icon: 'fa-trophy', color: '#f97316' },
    'fantasy': { label: 'Fantasy Games', icon: 'fa-dragon', color: '#d946ef' },
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#8a7b55' }
};

const FANTASY_CATEGORIES = {
    'sports': { label: 'Sports Fantasy', icon: 'fa-futbol', color: '#10b981' },
    'gaming': { label: 'Gaming Fantasy', icon: 'fa-gamepad', color: '#8b5cf6' },
    'roleplay': { label: 'Role Playing', icon: 'fa-masks-theater', color: '#ec4899' },
    'battle': { label: 'Battle Royale', icon: 'fa-crosshairs', color: '#ef4444' },
    'card': { label: 'Card & Board', icon: 'fa-chess-board', color: '#f59e0b' },
    'strategy': { label: 'Strategy', icon: 'fa-brain', color: '#06b6d4' },
    'virtual': { label: 'Virtual Worlds', icon: 'fa-vr-cardboard', color: '#a855f7' },
    'social': { label: 'Social Games', icon: 'fa-people-group', color: '#3b82f6' },
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#8a7b55' }
};

const FANTASY_STATUSES = {
    'pending': { label: 'Pending Approval', color: '#f59e0b', icon: 'fa-clock' },
    'approved': { label: 'Approved', color: '#10b981', icon: 'fa-check-circle' },
    'rejected': { label: 'Rejected', color: '#ef4444', icon: 'fa-ban' }
};

// ==========================================
// CUSTOM SERVICE TYPES
// ==========================================
const SERVICE_TYPE_ICONS = ['fa-camera','fa-video','fa-palette','fa-headphones','fa-utensils','fa-calendar-check','fa-spa','fa-dumbbell','fa-hands','fa-broom','fa-car','fa-music','fa-microphone','fa-paint-brush','fa-cut','fa-bolt','fa-leaf','fa-gem','fa-star','fa-heart','fa-fire','fa-moon','fa-sun','fa-cloud','fa-mountain','fa-umbrella-beach','fa-city','fa-house-chimney','fa-shield-halved','fa-graduation-cap','fa-laptop-code','fa-chart-line'];
const SERVICE_TYPE_COLORS = ['#ec4899','#8b5cf6','#f59e0b','#6366f1','#10b981','#3b82f6','#f472b6','#ef4444','#06b6d4','#84cc16','#f97316','#e11d48','#7c3aed','#0891b2','#059669','#d97706','#2563eb','#be185d','#c026d3','#0d9488'];

function getAllServiceTypes() {
    return Storage.getCustomServiceTypes();
}

function addCustomServiceType(name) {
    const types = Storage.getCustomServiceTypes();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (types.find(t => t.slug === slug)) return types.find(t => t.slug === slug);
    const icon = SERVICE_TYPE_ICONS[types.length % SERVICE_TYPE_ICONS.length];
    const color = SERVICE_TYPE_COLORS[types.length % SERVICE_TYPE_COLORS.length];
    const newType = { slug, label: name.trim(), icon, color, createdAt: new Date().toISOString() };
    types.push(newType);
    Storage.setCustomServiceTypes(types);
    return newType;
}

function getServiceTypeBySlug(slug) {
    return getAllServiceTypes().find(t => t.slug === slug) || { label: slug, icon: 'fa-concierge-bell', color: '#8a7b55' };
}

function getMostUsedServiceType() {
    const services = Storage.getServices();
    if (services.length === 0) return '';
    const counts = {};
    services.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

function getServiceTypeSelectHTML(selectedValue) {
    const types = getAllServiceTypes();
    let html = '<option value="">Select category</option>';
    types.forEach(t => {
        html += `<option value="${t.slug}" ${t.slug === selectedValue ? 'selected' : ''}>${t.label}</option>`;
    });
    html += '<option value="__custom__">+ Add New Category</option>';
    return html;
}

function getServiceTypeFilterHTML() {
    const types = getAllServiceTypes();
    let html = '<button class="filter-tab active" onclick="filterServicesDirectory(\'all\')">All</button>';
    types.forEach(t => {
        html += `<button class="filter-tab" onclick="filterServicesDirectory('${t.slug}')"><i class="fas ${t.icon}"></i> ${t.label}</button>`;
    });
    if (types.length === 0) {
        html = '<p style="color:var(--text-muted);font-size:0.85rem;padding:8px 0">No service types yet. Create a service to add categories.</p>';
    }
    return html;
}

// ==========================================
// WALLET SYSTEM
// ==========================================
function getWalletId(ownerType, ownerId) { return `wallet_${ownerType}_${ownerId}`; }

// Per-user wallets are keyed by the signed-in user's ID (fallback: 'general').
function currentUserOwnerId() {
    const id = currentAuthId();
    return id ? id : 'general';
}

// ==========================================
// PLATFORM COMMISSION (10% on gross earnings)
// A flat 10% commission is taken on every gross earning credited to a
// provider's wallet and paid into the admin's own wallet.
// ==========================================
const PLATFORM_COMMISSION = 0.10;
const ADMIN_WALLET_TYPE = 'admin';
const ADMIN_WALLET_ID = 'platform';
// Types that represent gross earnings from sales (commissionable). Refunds,
// top-ups, admin-adjusts and other flows are intentionally NOT commissioned.
const COMMISSIONABLE_TYPES = { 'booking-confirmed': 1, 'tip-received': 1, 'experience-sale': 1 };

function adminWalletOwner() { return { ownerType: ADMIN_WALLET_TYPE, ownerId: ADMIN_WALLET_ID }; }

// Credit the admin wallet with the 10% commission on a gross earning.
function creditAdminCommission(grossAmount, sourceType, meta) {
    if (!(grossAmount > 0)) return;
    const commission = Math.round(grossAmount * PLATFORM_COMMISSION * 100) / 100;
    if (commission <= 0) return;
    const adm = adminWalletOwner();
    adjustWallet(adm.ownerType, adm.ownerId, commission, 'commission',
        `10% commission on ${sourceType || 'transaction'}`, Object.assign({ commissionOn: grossAmount, rate: PLATFORM_COMMISSION }, meta || {}));
    return commission;
}

// True when a wallet credit represents gross earnings (subject to commission).
function isCommissionableCredit(type, amount) {
    return amount > 0 && !!COMMISSIONABLE_TYPES[type];
}

function getOrCreateWallet(ownerType, ownerId) {
    const wallets = Storage.getWallets();
    const walletId = getWalletId(ownerType, ownerId);
    let wallet = wallets.find(w => w.id === walletId);
    if (!wallet) {
        wallet = { id: walletId, ownerType, ownerId, balance: 0, held: 0, currency: 'ZAR', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        wallets.push(wallet);
        Storage.setWallets(wallets);
    }
    return wallet;
}

function getWalletBalance(ownerType, ownerId) {
    return getOrCreateWallet(ownerType, ownerId).balance;
}

function adjustWallet(ownerType, ownerId, amount, type, description, meta = {}) {
    const wallets = Storage.getWallets();
    const walletId = getWalletId(ownerType, ownerId);
    let wallet = wallets.find(w => w.id === walletId);
    if (!wallet) {
        wallet = { id: walletId, ownerType, ownerId, balance: 0, currency: 'ZAR', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        wallets.push(wallet);
    }
    const prevBalance = wallet.balance;
    wallet.balance = Math.round((wallet.balance + amount) * 100) / 100;
    if (wallet.balance < 0) wallet.balance = 0;
    wallet.updatedAt = new Date().toISOString();
    Storage.setWallets(wallets);

    const transactions = Storage.getTransactions();
    transactions.push({
        id: generateId(),
        walletId,
        ownerType,
        ownerId,
        type,
        amount,
        prevBalance,
        newBalance: wallet.balance,
        description,
        meta,
        createdAt: new Date().toISOString()
    });
    Storage.setTransactions(transactions);
    if (isCommissionableCredit(type, amount) && ownerType !== ADMIN_WALLET_TYPE) {
        creditAdminCommission(amount, type, { sourceType: type, sourceWallet: walletId });
    }
    return wallet.balance;
}

function getWalletTransactions(ownerType, ownerId) {
    const walletId = getWalletId(ownerType, ownerId);
    return Storage.getTransactions().filter(t => t.walletId === walletId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ==========================================
// ESCROW / HELD FUNDS
// Every escrow movement is mirrored to the wallet `held` field and to the
// transaction ledger so the wallet always reconciles (balance + held = total).
// ==========================================
function getWalletHeld(ownerType, ownerId) {
    return getOrCreateWallet(ownerType, ownerId).held || 0;
}

function setWalletHeld(ownerType, ownerId, held) {
    const wallets = Storage.getWallets();
    const wallet = wallets.find(w => w.id === getWalletId(ownerType, ownerId));
    if (wallet) {
        wallet.held = Math.max(0, Math.round(held * 100) / 100);
        wallet.updatedAt = new Date().toISOString();
        Storage.setWallets(wallets);
        return wallet.held;
    }
    return 0;
}

// Mutate the held amount on a wallet without touching its available balance.
// Records a transaction so the audit trail stays intact.
function adjustWalletHeld(ownerType, ownerId, deltaHeld, type, description, meta = {}) {
    const wallet = getOrCreateWallet(ownerType, ownerId);
    const prevHeld = wallet.held || 0;
    const newHeld = Math.max(0, Math.round((prevHeld + deltaHeld) * 100) / 100);
    setWalletHeld(ownerType, ownerId, newHeld);

    const transactions = Storage.getTransactions();
    transactions.push({
        id: generateId(),
        walletId: getWalletId(ownerType, ownerId),
        ownerType,
        ownerId,
        type,
        amount: deltaHeld,
        prevBalance: wallet.balance,
        newBalance: wallet.balance,
        prevHeld,
        newHeld,
        description,
        meta,
        createdAt: new Date().toISOString()
    });
    Storage.setTransactions(transactions);
    return newHeld;
}

function getEscrowForBooking(bookingId) {
    return Storage.getEscrowFunds().find(e => e.bookingId === bookingId);
}

// Called on booking request: record the hold and raise the user's held amount.
function holdBookingFee(booking, fee) {
    const escrows = Storage.getEscrowFunds();
    escrows.push({
        id: generateId(),
        bookingId: booking.id,
        fromType: 'user',
        fromId: currentUserOwnerId(),
        payeeType: 'provider',
        payeeId: booking.providerId,
        amount: fee,
        status: 'held',
        createdAt: new Date().toISOString()
    });
    Storage.setEscrowFunds(escrows);
    adjustWalletHeld('user', currentUserOwnerId(), fee, 'booking-escrow', `Booking fee of R${fee.toFixed(2)} held in escrow`, { bookingId: booking.id });
}

// Called on provider confirmation: release the held fee to the provider.
function releaseBookingEscrow(booking, fee) {
    const escrows = Storage.getEscrowFunds();
    let escrow = escrows.find(e => e.bookingId === booking.id);
    if (!escrow) {
        escrow = { id: generateId(), bookingId: booking.id, fromType: 'user', fromId: booking.clientOwnerId || 'general', payeeType: 'provider', payeeId: booking.providerId, amount: fee, status: 'held', createdAt: new Date().toISOString() };
        escrows.push(escrow);
    }
    if (escrow.status !== 'released') {
        escrow.status = 'released';
        escrow.releasedAt = new Date().toISOString();
        Storage.setEscrowFunds(escrows);

        const fromId = escrow.fromId;
        adjustWalletHeld('user', fromId, -fee, 'booking-escrow-released', `Booking escrow released`, { bookingId: booking.id });
        adjustWallet('provider', booking.providerId, fee, 'booking-confirmed', `Booking confirmed from ${booking.clientName || 'client'}`, { bookingId: booking.id, escrowId: escrow.id });
    }
}

// Called on cancellation/decline: refund the held fee back to the client.
function refundBookingEscrow(booking, fee, reason) {
    const escrows = Storage.getEscrowFunds();
    const escrow = escrows.find(e => e.bookingId === booking.id);
    if (escrow && escrow.status === 'held') {
        escrow.status = 'refunded';
        escrow.refundedAt = new Date().toISOString();
        Storage.setEscrowFunds(escrows);

        const fromId = escrow.fromId;
        adjustWalletHeld('user', fromId, -fee, 'booking-escrow-released', `Booking escrow returned`, { bookingId: booking.id, escrowId: escrow.id });
        adjustWallet('user', fromId, fee, 'booking-refund', reason || `Refund for cancelled booking`, { bookingId: booking.id, escrowId: escrow.id });
        return true;
    }
    return false;
}

function getActiveEscrowTotal(ownerType, ownerId) {
    return Storage.getEscrowFunds()
        .filter(e => e.status === 'held' && e.fromType === ownerType && String(e.fromId) === String(ownerId))
        .reduce((s, e) => s + (e.amount || 0), 0);
}

function getAllEscrow() {
    return Storage.getEscrowFunds().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getAllWallets() {
    return Storage.getWallets().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function getAllTransactions() {
    return Storage.getTransactions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function adminAdjustBalance(ownerType, ownerId, newAmount, reason) {
    const wallet = getOrCreateWallet(ownerType, ownerId);
    const diff = newAmount - wallet.balance;
    adjustWallet(ownerType, ownerId, diff, 'admin-adjust', reason || 'Admin balance adjustment');
    return getOrCreateWallet(ownerType, ownerId).balance;
}

function adminRefundTransaction(txnId, reason) {
    const transactions = Storage.getTransactions();
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return false;
    if (txn.type === 'refund') return false;
    adjustWallet(txn.ownerType, txn.ownerId, Math.abs(txn.amount), 'refund', reason || `Refund for: ${txn.description}`, { originalTxnId: txnId });
    return true;
}

let currentViewUserId = null;
let currentViewProviderId = null;
let currentViewListingId = null;
let currentViewVenueId = null;
let currentViewAdId = null;
let deleteTarget = { type: null, id: null };
let userTags = [];
let providerTags = [];
let listingTags = [];
let listingGallery = [];
let listingLinks = [];
let currentDirectoryFilter = 'all';
let venueTags = [];
let venueGallery = [];
let currentVenueDirectoryFilter = 'all';
let adTags = [];
let adGallery = [];
let currentAdsFilter = 'all';
let providerAdTags = [];
let providerAdGallery = [];
let serviceTags = [];
let serviceGallery = [];
let serviceLinks = [];
let serviceRates = [];
let currentServicesFilter = 'all';
let currentServicesOwnerFilter = null;
let providerServiceTags = [];
let providerServiceGallery = [];
let currentBookingProviderId = null;
let currentBookingProviderType = null;
let currentBookingFee = 0;
let currentBookingFilter = 'all';
let currentServiceViewId = null;
let currentWalletTab = 'overview';
let currentContentFilter = 'all';
let currentContentViewId = null;
let currentEventFilter = 'all';
let currentEventViewId = null;

// ==========================================
// Navigation
// ==========================================
function navigateTo(page) {
    const sidebar = document.getElementById('sidebar');
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));

    const targetPage = document.getElementById('page-' + page);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.animation = 'none';
        targetPage.offsetHeight;
        targetPage.style.animation = 'pageFadeIn 0.5s ease';
    }

    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navItem) navItem.classList.add('active');

    if (page === 'user-dashboard') { renderUserProfiles(); renderUserDashboardStats(); }
    if (page === 'my-network') renderMyNetwork();
    if (page === 'provider-dashboard') renderProviderProfiles();
    if (page === 'user-create') { populateLocationDropdowns(); resetUserForm(); }
    if (page === 'provider-create') { populateLocationDropdowns(); resetProviderForm(); }
    if (page === 'directory') renderDirectory();
    if (page === 'provider-directory') renderListings();
    if (page === 'provider-listing-create') resetListingForm();
    if (page === 'venue-directory') renderVenueDirectory();
    if (page === 'provider-venue-directory') renderVenueListings();
    if (page === 'provider-venue-create') resetVenueForm();
    if (page === 'ads-browse') renderAdsBrowse();
    if (page === 'ads-create') resetAdForm();
    if (page === 'user-ads') renderUserAds();
    if (page === 'provider-ads') renderProviderAds();
    if (page === 'provider-ads-create') resetProviderAdForm();
    if (page === 'services-directory') renderServicesDirectory();
    if (page === 'provider-services') renderProviderServices();
    if (page === 'provider-service-create') resetServiceForm();
    if (page === 'user-bookings') renderUserBookings();
    if (page === 'provider-bookings') renderProviderBookings();
    if (page === 'provider-tips') renderProviderTips();
    if (page === 'user-wallet') renderUserWallet();
    if (page === 'provider-wallet') renderProviderWallet();
    if (page === 'content-directory') { populateLocationDropdowns(); renderContentDirectory(); }
    if (page === 'provider-content') renderProviderContent();
    if (page === 'provider-content-create') { populateLocationDropdowns(); resetContentForm(); }
    if (page === 'events-directory') renderEventsDirectory();
    if (page === 'provider-events') renderProviderEvents();
    if (page === 'provider-event-create') resetEventForm();
    if (page === 'user-settings') loadUserSettings();
    if (page === 'provider-settings') loadProviderSettings();
    if (page === 'gigs-browse') { populateGigDropdowns(); renderGigsBrowse(); }
    if (page === 'provider-gigs') renderProviderGigs();
    if (page === 'provider-gig-create') { populateGigDropdowns(); resetProviderGigForm(); }
    if (page === 'inbox') renderInbox();
    if (page === 'message-view') renderMessageThread();
    if (page === 'message-compose') renderMessageCompose();
    if (page === 'online-users') { populateOnlineCityFilters(); renderOnlineUsers(); }
    if (page === 'help-queries') prefillHelpForm();
    if (page === 'saved-items') renderSavedItems();
    if (page === 'downloads') renderDownloads();
    if (page === 'experiences-browse') renderExperiencesBrowse();
    if (page === 'experiences-my') renderMyGames();
    if (page === 'fantasy-requests') { populateFantasyDropdowns(); renderFantasyRequests(); }
    if (page === 'fantasy-request-create') { populateFantasyDropdowns(); resetFantasyForm(); }
    if (page === 'provider-experiences') renderProviderExperiences();
    if (page === 'provider-experience-create') { populateExperienceDropdowns(); resetProviderExperienceForm(); }
    if (page === 'provider-fantasy-requests') { populateFantasyDropdowns(); renderProviderFantasyRequests(); }
    if (page === 'products-directory') renderProductsBrowser();
    if (page === 'provider-products') renderProviderProducts();
    if (page === 'provider-product-create') { resetProductForm(); }
    if (page === 'provider-orders') renderProviderOrders();
    if (['directory','venue-directory','services-directory','content-directory','events-directory','ads-browse','gigs-browse','forum-browse','products-directory'].includes(page)) renderSaveButtons();
    setActiveBottomNav(page);
}

// Re-render the page that is currently visible (called after Supabase
// hydration so fresh remote data shows without a manual refresh).
function rerenderCurrentPage() {
    if (typeof renderSaveButtons === 'function') renderSaveButtons();
    const active = document.querySelector('.page.active');
    if (!active) return;
    const id = active.id;
    const r = {
        'page-user-dashboard': () => { renderUserProfiles(); renderUserDashboardStats(); },
        'page-my-network': () => renderMyNetwork(),
        'page-provider-dashboard': () => renderProviderProfiles(),
        'page-directory': () => renderDirectory(),
        'page-provider-directory': () => renderListings(),
        'page-venue-directory': () => renderVenueDirectory(),
        'page-provider-venue-directory': () => renderVenueListings(),
        'page-ads-browse': () => renderAdsBrowse(),
        'page-user-ads': () => renderUserAds(),
        'page-provider-ads': () => renderProviderAds(),
        'page-services-directory': () => renderServicesDirectory(),
        'page-provider-services': () => renderProviderServices(),
        'page-user-bookings': () => renderUserBookings(),
        'page-provider-bookings': () => renderProviderBookings(),
        'page-provider-tips': () => renderProviderTips(),
        'page-user-wallet': () => renderUserWallet(),
        'page-provider-wallet': () => renderProviderWallet(),
        'page-content-directory': () => renderContentDirectory(),
        'page-provider-content': () => renderProviderContent(),
        'page-events-directory': () => renderEventsDirectory(),
        'page-provider-events': () => renderProviderEvents(),
        'page-gigs-browse': () => renderGigsBrowse(),
        'page-provider-gigs': () => renderProviderGigs(),
        'page-inbox': () => renderInbox(),
        'page-message-view': () => renderMessageThread(),
        'page-online-users': () => renderOnlineUsers(),
        'page-saved-items': () => renderSavedItems(),
        'page-downloads': () => renderDownloads(),
        'page-experiences-browse': () => renderExperiencesBrowse(),
        'page-experiences-my': () => renderMyGames(),
        'page-fantasy-requests': () => renderFantasyRequests(),
        'page-provider-experiences': () => renderProviderExperiences(),
        'page-provider-fantasy-requests': () => renderProviderFantasyRequests(),
        'page-products-directory': () => renderProductsBrowser(),
        'page-provider-products': () => renderProviderProducts(),
        'page-provider-orders': () => renderProviderOrders()
    };
    const fn = r[id];
    if (fn) { try { fn(); } catch (e) {} }
}

function setActiveBottomNav(page) {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;
    nav.querySelectorAll('.bottom-nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-page') === page);
    });
}

function navBottom(page) {
    closeSidebar();
    navigateTo(page);
}

function maybeCloseSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('menu-open');
    }
}

function populateGigDropdowns() {
    document.querySelectorAll('#gigType').forEach(sel => {
        if (sel.options.length > 1) return;
        Object.entries(GIG_TYPES).forEach(([key, val]) => {
            const opt = document.createElement('option');
            opt.value = key; opt.textContent = val.label;
            sel.appendChild(opt);
        });
    });
    document.querySelectorAll('#gigLocation, #gigLocationFilter').forEach(sel => {
        if (sel.options.length > 1) return;
        const opts = generateSAProvinceOptions();
        sel.insertAdjacentHTML('beforeend', opts.replace('<option value="">All Provinces</option>', '<option value="">All Locations</option>'));
    });
}

function populateLocationDropdowns() {
    document.querySelectorAll('#userFormLocation, #providerFormLocation, #contentLocation, #contentLocationFilter').forEach(sel => {
        if (sel.options.length > 1) return;
        const opts = generateSAProvinceOptions();
        const placeholder = sel.id.includes('Filter') ? '<option value="">All Locations</option>' : '<option value="">Select location</option>';
        sel.insertAdjacentHTML('beforeend', opts.replace(/<option value="">.*?<\/option>/, placeholder));
    });
}

function populateOnlineCityFilters() {
    const sel = document.getElementById('onlineCityFilter');
    if (!sel) return;
    if (sel.options.length > 1) return;
    sel.innerHTML = '<option value="">All Locations</option>' + generateSAProvinceOptions().replace('<option value="">All Provinces</option>', '');
}

// ==========================================
// Sidebar
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('closeBtn');

    // The sidebar is hidden by CSS by default on mobile (translateX(-100%))
    // and opened via the .menu-open class, so it can never flash over the
    // screen while scripts are still loading.

    if (closeBtn) closeBtn.addEventListener('click', () => { if (sidebar && window.innerWidth <= 768) closeSidebar(); });

    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page === 'user-create' && getUserProfilesByAuth().length > 0) {
                editUserById(getUserProfilesByAuth()[0].id);
            } else {
                navigateTo(page);
            }
            maybeCloseSidebar();
        });
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

    // Tags input
    document.getElementById('userTagsInput')?.addEventListener('keydown', handleUserTagInput);
    document.getElementById('providerTagsInput')?.addEventListener('keydown', handleProviderTagInput);
    document.getElementById('listingTagsInput')?.addEventListener('keydown', handleListingTagInput);
    document.getElementById('venueTagsInput')?.addEventListener('keydown', handleVenueTagInput);
    document.getElementById('adTagsInput')?.addEventListener('keydown', handleAdTagInput);
    document.getElementById('providerAdTagsInput')?.addEventListener('keydown', handleProviderAdTagInput);
    document.getElementById('serviceTagsInput')?.addEventListener('keydown', handleServiceTagInput);
    document.getElementById('contentTagsInput')?.addEventListener('keydown', handleContentTagInput);
    document.getElementById('eventTagsInput')?.addEventListener('keydown', handleEventTagInput);
    document.getElementById('directorySearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchDirectory(); });
    document.getElementById('venueSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchVenueDirectory(); });
    document.getElementById('adsSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchAds(); });
    document.getElementById('servicesSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchServicesDirectory(); });

    // Auto-detect page and render
    const isProviderPage = window.location.pathname.includes('provider.html');
    if (isProviderPage) {
        document.getElementById('providerProfilesList') && renderProviderProfiles();
        document.getElementById('listingsList') && renderListings();
        document.getElementById('venueListingsList') && renderVenueListings();
        document.getElementById('providerAdsList') && renderProviderAds();
        document.getElementById('providerServicesList') && renderProviderServices();
        document.getElementById('providerBookingsList') && renderProviderBookings();
        document.getElementById('providerTipsList') && renderProviderTips();
        document.getElementById('providerWalletBalance') && renderProviderWallet();
        document.getElementById('providerContentList') && renderProviderContent();
        document.getElementById('providerEventsList') && renderProviderEvents();
        if (document.getElementById('serviceCategory')) updateServiceCategorySelect();
    } else {
        document.getElementById('userProfilesList') && renderUserProfiles();
        if (document.getElementById('page-user-dashboard')) renderUserDashboardStats();
        document.getElementById('directoryList') && renderDirectory();
        document.getElementById('venueDirectoryList') && renderVenueDirectory();
        document.getElementById('adsBrowseList') && renderAdsBrowse();
        document.getElementById('userAdsList') && renderUserAds();
        document.getElementById('servicesDirectoryList') && renderServicesDirectory();
        document.getElementById('userBookingsList') && renderUserBookings();
        document.getElementById('userWalletBalance') && renderUserWallet();
        document.getElementById('contentDirectoryList') && renderContentDirectory();
        document.getElementById('eventsDirectoryList') && renderEventsDirectory();
    }
    maybeShowProfileSetup();
    updateUserNavLabels();
});

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || window.innerWidth > 768) return;
    sidebar.classList.add('hidden');
    sidebar.classList.remove('menu-open');
}

// Opens the slide-in navigation menu (mobile Menu button).
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('menu-open');
    }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle', warning: 'exclamation-circle' };
    toast.innerHTML = `<i class="fas fa-${icons[type] || icons.success}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-hide'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ==========================================
// GENERAL USER - CRUD
// ==========================================
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }

// ==========================================
// SECURITY - input sanitization + rate limiting
// ==========================================
// Hardened HTML escaper (also escapes single quotes so attributes are safe).
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Neutralize dangerous schemes that can run code or exfiltrate data.
function sanitizeUrl(url) {
    if (!url) return '';
    const raw = String(url).trim();
    if (/^(javascript|data|vbscript):/i.test(raw)) return '';
    if (raw.startsWith('//')) return 'https:' + raw;
    if (!/^https?:\/\//i.test(raw)) return '';
    return raw;
}

// Anti-DDoS / rate limiting: allow at most `limit` invocations of a named
// action per `windowMs` per browser tab. Returns false and fires a warning
// when the caller should be throttled.
const __throttleStore = {};
function securityThrottle(action, limit, windowMs) {
    try {
        if (!action || limit <= 0) return true;
        const now = Date.now();
        const key = action + '|' + (currentAuthId() || 'anon');
        const rec = __throttleStore[key];
        if (!rec || (now - rec.start) > windowMs) {
            __throttleStore[key] = { start: now, count: 1 };
            return true;
        }
        rec.count += 1;
        if (rec.count > limit) {
            showToast('You are moving too fast. Please slow down.', 'error');
            return false;
        }
        return true;
    } catch (e) { return true; }
}

// Guard a money-mutating action: require sign-in + throttle + positive amount.
function guardFinancial(action, amount, limit, windowMs) {
    if (!requireSignIn('Complete this transaction.')) return false;
    if (typeof amount === 'number' && (!isFinite(amount) || amount < 0)) { showToast('Invalid amount.', 'error'); return false; }
    return securityThrottle(action, limit || 2, windowMs || 2000);
}

function resetUserForm() {
    document.getElementById('userProfileForm').reset();
    document.getElementById('userProfileId').value = '';
    document.getElementById('userFormTitle').textContent = 'Create General User Profile';
    document.getElementById('userSubmitBtn').textContent = 'Create Profile';
    userTags = [];
    renderUserTags();
    document.getElementById('userPhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
    const urlInput = document.getElementById('userPhotoUrl');
    if (urlInput) urlInput.value = '';
}

function renderProfileSetupBanner() {
    const banner = document.getElementById('profileSetupBanner');
    if (!banner) return;
    const profiles = getUserProfilesByAuth();
    if (profiles.length > 0) { banner.style.display = 'none'; return; }
    banner.style.display = 'flex';
}

function maybeShowProfileSetup() {
    if (!document.getElementById('page-user-dashboard')) return;
    renderProfileSetupBanner();
    if (new URLSearchParams(window.location.search).get('setup') === '1') {
        if (getUserProfilesByAuth().length === 0) { navigateTo('user-create'); return; }
    }
}

function updateUserNavLabels() {
    const nav = document.querySelector('#sidebar .nav-item[data-page="user-create"]');
    if (!nav) return;
    const hasProfile = getUserProfilesByAuth().length > 0;
    const span = nav.querySelector('span');
    const icon = nav.querySelector('i');
    if (span) span.textContent = hasProfile ? 'Edit Profile' : 'Create Profile';
    if (icon) icon.className = hasProfile ? 'fas fa-user-edit' : 'fas fa-user-plus';
}

function currentAuthId() {
    try {
        const snap = _2k2.Auth && _2k2.Auth.syncUser ? _2k2.Auth.syncUser() : null;
        return snap && snap.user_id ? snap.user_id : (window._2k2_lastAuthId || '');
    } catch (e) { return ''; }
}

function getUserProfilesByAuth() {
    const users = Storage.getUsers();
    const authId = currentAuthId();
    if (authId) return users.filter(u => u.userId === authId);
    const snap = _2k2.Auth && _2k2.Auth.syncUser ? _2k2.Auth.syncUser() : null;
    if (snap && snap.email) return users.filter(u => (u.email || '').toLowerCase() === snap.email.toLowerCase());
    return [];
}

// ==========================================
// Followers / Following
// ==========================================
function followKey(type, id) { return (type || 'user') + ':' + String(id); }

function currentFollowActor() {
    try {
        const profile = getUserProfilesByAuth()[0];
        if (profile) return { type: 'user', id: profile.id, name: profile.fullName || profile.username || 'Member' };
        const authId = currentAuthId();
        if (!authId) return null;
        const listing = Storage.getListings().find(l => String(l.ownerId) === String(authId));
        if (listing) return { type: 'listing', id: listing.id, name: listing.name };
        const snap = _2k2.Auth && _2k2.Auth.syncUser ? _2k2.Auth.syncUser() : null;
        return { type: 'auth', id: authId, name: ((snap && snap.email) || 'Member').split('@')[0] || 'Member' };
    } catch (e) { return null; }
}

function getMyFollowIdentityKeys() {
    const keys = [];
    getUserProfilesByAuth().forEach(p => keys.push('user:' + p.id));
    const authId = currentAuthId();
    if (authId) {
        Storage.getListings().filter(l => String(l.ownerId) === String(authId)).forEach(l => keys.push('listing:' + l.id));
        keys.push('auth:' + authId);
    }
    return keys;
}

function isFollowing(targetType, targetId) {
    const actor = currentFollowActor();
    if (!actor) return false;
    const key = followKey(actor.type, actor.id);
    return Storage.getFollows().some(f => f.followerKey === key && f.followeeType === targetType && String(f.followeeId) === String(targetId));
}

function getFollowerCount(targetType, targetId) {
    return Storage.getFollows().filter(f => f.followeeType === targetType && String(f.followeeId) === String(targetId)).length;
}

function getProfileFollowingCount(type, id) {
    return Storage.getFollows().filter(f => f.followerType === type && String(f.followerId) === String(id)).length;
}

function myFollowerCount() {
    const myKeys = getMyFollowIdentityKeys();
    return Storage.getFollows().filter(f => myKeys.includes(followKey(f.followeeType, f.followeeId))).length;
}

function myFollowingCount() {
    const actor = currentFollowActor();
    if (!actor) return 0;
    return Storage.getFollows().filter(f => f.followerKey === followKey(actor.type, actor.id)).length;
}

function toggleFollow(targetType, targetId, targetName) {
    if (!requireSignIn('Follow profiles to stay connected.')) return false;
    const actor = currentFollowActor();
    if (!actor) { showToast('Sign in with a profile to follow others.', 'error'); return false; }
    const myKeys = getMyFollowIdentityKeys();
    if (myKeys.includes(followKey(targetType, targetId))) { showToast('You cannot follow your own profile.', 'info'); return false; }

    const follows = Storage.getFollows();
    const key = followKey(actor.type, actor.id);
    const existingIndex = follows.findIndex(f => f.followerKey === key && f.followeeType === targetType && String(f.followeeId) === String(targetId));
    if (existingIndex !== -1) {
        follows.splice(existingIndex, 1);
        Storage.setFollows(follows);
        showToast('Unfollowed ' + (targetName || 'profile') + '.', 'info');
    } else {
        follows.push({
            id: generateId(),
            followerType: actor.type,
            followerId: actor.id,
            followerName: actor.name,
            followerKey: key,
            followeeType: targetType,
            followeeId: String(targetId),
            followeeName: targetName || '',
            createdAt: new Date().toISOString()
        });
        Storage.setFollows(follows);
        showToast('You are now following ' + (targetName || 'this profile') + '.');
    }
    refreshFollowUI();
    return true;
}

function updateDashNetworkCounts() {
    const f = document.getElementById('dashFollowers');
    const g = document.getElementById('dashFollowing');
    if (f) f.textContent = myFollowerCount();
    if (g) g.textContent = myFollowingCount();
}

function refreshFollowUI() {
    document.querySelectorAll('[data-follow-btn]').forEach(btn => {
        const t = btn.getAttribute('data-t');
        const id = btn.getAttribute('data-id');
        if (!t || !id) return;
        const following = isFollowing(t, id);
        btn.classList.toggle('follow-active', following);
        btn.classList.toggle('btn-secondary', following);
        btn.classList.toggle('btn-primary', !following);
        if (btn.hasAttribute('data-unfollow')) {
            btn.innerHTML = following ? '<i class="fas fa-user-minus"></i> Unfollow' : '<i class="fas fa-user-plus"></i> Follow';
        } else {
            btn.innerHTML = following ? '<i class="fas fa-check"></i> Following' : '<i class="fas fa-user-plus"></i> Follow';
        }
    });
    document.querySelectorAll('[data-follower-count]').forEach(el => {
        const t = el.getAttribute('data-t');
        const id = el.getAttribute('data-id');
        if (t && id) el.textContent = getFollowerCount(t, id);
    });
    document.querySelectorAll('[data-following-count]').forEach(el => {
        const t = el.getAttribute('data-t');
        const id = el.getAttribute('data-id');
        if (t && id) el.textContent = getProfileFollowingCount(t, id);
    });
    updateDashNetworkCounts();
    const netPage = document.getElementById('page-my-network');
    if (netPage && netPage.classList.contains('active')) renderMyNetwork();
}

function followButtonHTML(targetType, targetId, extraClass) {
    const following = isFollowing(targetType, targetId);
    return `<button type="button" class="btn ${following ? 'btn-secondary follow-active' : 'btn-primary'} ${extraClass || ''}" data-follow-btn="1" data-t="${targetType}" data-id="${targetId}" onclick="event.stopPropagation(); toggleFollow('${targetType}','${targetId}')"><i class="fas ${following ? 'fa-check' : 'fa-user-plus'}"></i> ${following ? 'Following' : 'Follow'}</button>`;
}

function resolveFollowProfile(type, id, fallbackName) {
    if (type === 'listing') {
        const l = Storage.getListings().find(x => String(x.id) === String(id));
        if (l) return { name: l.name || fallbackName || 'Provider', photo: l.photo || '', typeLabel: 'Provider' };
    } else if (type === 'user') {
        const u = Storage.getUsers().find(x => String(x.id) === String(id));
        if (u) return { name: u.fullName || u.username || fallbackName || 'Member', photo: u.photo || '', typeLabel: 'Member' };
    }
    return { name: fallbackName || 'Member', photo: '', typeLabel: type === 'listing' ? 'Provider' : 'Member' };
}

function renderMyNetwork() {
    if (!requireSignIn('View your network.')) { if (document.getElementById('page-user-dashboard')) navigateTo('user-dashboard'); return; }
    const myKeys = getMyFollowIdentityKeys();
    const follows = Storage.getFollows();
    const actor = currentFollowActor();
    const myFollowKey = actor ? followKey(actor.type, actor.id) : null;

    const followers = follows.filter(f => myKeys.includes(followKey(f.followeeType, f.followeeId)));
    const following = myFollowKey ? follows.filter(f => f.followerKey === myFollowKey) : [];

    document.getElementById('netFollowersCount').textContent = followers.length;
    document.getElementById('netFollowingCount').textContent = following.length;

    const folContainer = document.getElementById('netFollowersList');
    if (followers.length === 0) {
        folContainer.innerHTML = `<div class="empty-state"><i class="fas fa-user-plus"></i><h3>No followers yet</h3><p>When other members follow you, they'll appear here.</p></div>`;
    } else {
        folContainer.innerHTML = followers.map(f => {
            const p = resolveFollowProfile(f.followerType, f.followerId, f.followerName);
            const icon = f.followerType === 'listing' ? 'store' : 'user';
            return `
            <div class="network-item">
                <div class="network-item-avatar">${p.photo ? `<img src="${p.photo}" alt="">` : `<i class="fas fa-${icon}"></i>`}</div>
                <div class="network-item-info"><h4>${escapeHtml(p.name)}</h4><span>${p.typeLabel}</span></div>
                <div class="network-item-actions">${followButtonHTML(f.followerType, f.followerId)}</div>
            </div>`;
        }).join('');
    }

    const folFollowing = document.getElementById('netFollowingList');
    if (following.length === 0) {
        folFollowing.innerHTML = `<div class="empty-state"><i class="fas fa-users"></i><h3>Not following anyone yet</h3><p>Use the Follow button on any profile to build your network.</p></div>`;
    } else {
        folFollowing.innerHTML = following.map(f => {
            const p = resolveFollowProfile(f.followeeType, f.followeeId, f.followeeName);
            const icon = f.followeeType === 'listing' ? 'store' : 'user';
            return `
            <div class="network-item">
                <div class="network-item-avatar">${p.photo ? `<img src="${p.photo}" alt="">` : `<i class="fas fa-${icon}"></i>`}</div>
                <div class="network-item-info"><h4>${escapeHtml(p.name)}</h4><span>${p.typeLabel}</span></div>
                <div class="network-item-actions">
                    <button type="button" class="btn btn-secondary follow-active" data-follow-btn="1" data-unfollow="1" data-t="${f.followeeType}" data-id="${f.followeeId}" onclick="toggleFollow('${f.followeeType}','${f.followeeId}')"><i class="fas fa-user-minus"></i> Unfollow</button>
                </div>
            </div>`;
        }).join('');
    }
}

// Guests/anon users can browse, but must have an account to engage.
// Returns true when action can proceed, false when the user was prompted to sign in.
function requireSignIn(actionText) {
    if (currentAuthId()) return true;
    const modal = document.getElementById('authPromptModal');
    if (modal) {
        const text = document.getElementById('authPromptText');
        if (text) text.textContent = (actionText || 'Continue') + ' Create a free account to unlock this feature. Choose Member or Service Provider.';
        modal.classList.add('active');
        updateAuthPrompt();
    } else {
        openSignInToast();
    }
    return false;
}

function closeAuthPrompt() { document.getElementById('authPromptModal')?.classList.remove('active'); }

function openSignInToast() { showToast('Please sign in to continue.', 'info'); }

function applyAsProvider() {
    window.location.href = currentAuthId() ? 'upgrade.html' : 'register.html?plan=provider';
}

async function hasPendingProviderRequest() {
    const client = window._2k2 && typeof window._2k2.getSupabase === 'function' ? window._2k2.getSupabase() : null;
    const id = currentAuthId();
    if (!client || !id) return false;
    try {
        const { data } = await client.from('provider_upgrade_requests')
            .select('id').eq('user_id', id).eq('status', 'pending').limit(1);
        return !!(data && data.length);
    } catch (e) { return false; }
}

async function updateAuthPrompt() {
    const actions = document.getElementById('authPromptActions');
    const pendingBox = document.getElementById('authProviderPending');
    if (!actions || !pendingBox) return;
    const id = currentAuthId();
    let alreadySubmitted = false;
    if (id) {
        alreadySubmitted = await hasPendingProviderRequest();
    } else {
        alreadySubmitted = localStorage.getItem('k2_provider_requested') === '1';
    }
    const memberBtn = document.getElementById('authMemberBtn');
    const providerBtn = document.getElementById('authProviderBtn');
    const loginBtn = document.getElementById('authLoginBtn');
    if (alreadySubmitted) {
        if (memberBtn) memberBtn.style.display = 'none';
        if (providerBtn) providerBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        actions.style.display = 'none';
        pendingBox.style.display = 'block';
        return;
    }
    pendingBox.style.display = 'none';
    actions.style.display = '';
    if (id) {
        if (memberBtn) memberBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        if (providerBtn) providerBtn.innerHTML = '<i class="fas fa-briefcase"></i> Apply to Become a Service Provider';
    }
}

function openPhotoModal(src) {
    const modal = document.getElementById('photoModal');
    const img = document.getElementById('photoModalImg');
    if (!modal || !img) return;
    img.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePhotoModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('photoModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}


function handleUserSubmit(e) {
    e.preventDefault();
    if (!requireSignIn('Create your profile.')) return;
    const id = document.getElementById('userProfileId').value;
    const now = new Date().toISOString();
    
    const profile = {
        id: id || generateId(),
        userId: currentAuthId(),
        username: document.getElementById('userUsername').value.trim(),
        fullName: document.getElementById('userFullName').value,
        email: document.getElementById('userFormEmail').value,
        phone: document.getElementById('userFormPhone').value,
        location: document.getElementById('userFormLocation').value,
        dob: document.getElementById('userDob').value,
        gender: document.getElementById('userGender').value,
        bio: document.getElementById('userFormBio').value,
        website: document.getElementById('userFormWebsite').value,
        interests: [...userTags],
        photo: document.getElementById('userPhotoPreview').querySelector('img')?.src || '',
        status: 'active',
        createdAt: id ? undefined : now,
        updatedAt: now
    };

    const users = Storage.getUsers();
    if (id) {
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) { profile.createdAt = users[idx].createdAt; users[idx] = profile; }
        showToast('Profile updated successfully!');
    } else {
        profile.createdAt = now;
        users.push(profile);
        showToast('Profile created successfully!');
    }
    Storage.setUsers(users);
    renderProfileSetupBanner();
    updateUserNavLabels();
    navigateTo('user-dashboard');
}

function handleHelpSubmit(e) {
    e.preventDefault();
    if (!requireSignIn('Submit a help query.')) return;
    const name = document.getElementById('helpName').value.trim();
    const email = document.getElementById('helpEmail').value.trim();
    const topic = document.getElementById('helpTopic').value;
    const message = document.getElementById('helpMessage').value.trim();

    if (!topic) { showToast('Please choose a topic.', 'error'); return; }
    if (!message) { showToast('Please enter your message.', 'error'); return; }

    const queries = Storage.getHelpQueries();
    queries.push({
        id: generateId(),
        userId: currentAuthId(),
        name,
        email,
        topic,
        message,
        status: 'open',
        adminReply: '',
        repliedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    Storage.setHelpQueries(queries);

    e.target.reset();
    prefillHelpForm();
    showToast('Your query has been sent to our support team. We\'ll be in touch soon!', 'success');
}

function prefillHelpForm() {
    try {
        const snap = _2k2.Auth && _2k2.Auth.syncUser ? _2k2.Auth.syncUser() : null;
        if (snap && snap.email) {
            const emailEl = document.getElementById('helpEmail');
            const nameEl = document.getElementById('helpName');
            if (emailEl && !emailEl.value) emailEl.value = snap.email;
            if (nameEl && !nameEl.value) {
                const p = Storage.getUsers().find(u => (u.userId && snap.user_id && u.userId === snap.user_id) || (u.email && u.email.toLowerCase() === snap.email.toLowerCase()));
                if (p && p.fullName) nameEl.value = p.fullName;
            }
        }
    } catch (e) {}
}

function renderUserProfiles(filter = 'all') {
    const users = Storage.getUsers();
    const container = document.getElementById('userProfilesList');
    const filtered = filter === 'all' ? users : users.filter(u => u.status === filter);

    document.getElementById('userCount').textContent = users.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-user-plus"></i><h3>No profiles yet</h3><p>Create your first profile to get started</p><button class="btn btn-primary" onclick="navigateTo('user-create')">Create Profile</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((u, i) => `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s" onclick="viewUserProfile('${u.id}')">
            <div class="list-card-avatar">${u.photo ? `<img src="${u.photo}" alt="">` : `<i class="fas fa-user"></i>`}</div>
            <div class="list-card-info">
                <h3>${u.fullName}</h3>
                <p>${u.email}</p>
                <div class="list-card-tags">${(u.interests || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${u.status}">${u.status}</span>
                ${followButtonHTML('user', u.id, 'follow-mini')}
                <button class="btn-icon" onclick="event.stopPropagation(); editUserById('${u.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterUserProfiles() { renderUserProfiles(document.getElementById('userFilter').value); }

async function renderUserDashboardStats() {
    const setNum = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    // Explore counts (platform-wide menu items)
    const explore = {
        Profiles: Storage.getUsers().length,
        Venues: Storage.getVenues().length,
        Services: Storage.getServices().length,
        Content: Storage.getContent().length,
        Events: Storage.getEvents().length,
        Ads: Storage.getAds().length,
        Gigs: Storage.getGigs().length,
        Products: Storage.getProducts().length,
        Experiences: Storage.getExperiences().length,
        'Fantasy Req.': Storage.getFantasyRequests().length,
        'Forum Threads': Storage.getForumThreads().length
    };
    setNum('dashCountProfiles', explore.Profiles);
    setNum('dashCountVenues', explore.Venues);
    setNum('dashCountServices', explore.Services);
    setNum('dashCountContent', explore.Content);
    setNum('dashCountEvents', explore.Events);
    setNum('dashCountAds', explore.Ads);
    setNum('dashCountGigs', explore.Gigs);
    setNum('dashCountProducts', explore.Products);
    setNum('dashCountExperiences', explore.Experiences);
    setNum('dashCountFantasy', explore['Fantasy Req.']);
    setNum('dashCountThreads', explore['Forum Threads']);
    setNum('userCount', Storage.getUsers().length);
    setNum('userInterestsCount', Storage.getUsers().reduce((s, u) => s + (u.interests || []).length, 0));
    setNum('userActiveCount', Storage.getUsers().filter(u => u.status === 'active').length);

    try {
        const data = await (window._2k2 && _2k2.Presence ? _2k2.Presence.fetchPresence() : { members: [], guests: [] });
        setNum('dashCountOnline', (data.members || []).length + (data.guests || []).length);
    } catch (e) { setNum('dashCountOnline', 0); }

    // Personal analytics
    const meId = currentUserOwnerId();
    const txns = getWalletTransactions('user', meId);
    setNum('dashWalletBalance', 'R' + getWalletBalance('user', meId).toFixed(2));
    setNum('dashMyProfiles', getUserProfilesByAuth().length);
    setNum('dashPendingTopups', Storage.getTopUpRequests().filter(r => r.status === 'pending' && r.ownerType === 'user' && r.ownerId === meId).length);
    setNum('dashMyTxns', txns.length);
    updateDashNetworkCounts();

    // Chart 1: Explore breakdown (bar)
    if (dashExploreChart) dashExploreChart.destroy();
    const ctxE = document.getElementById('dashExploreChart');
    if (ctxE) {
        dashExploreChart = new Chart(ctxE, {
            type: 'bar',
            data: { labels: Object.keys(explore), datasets: [{ label: 'Count', data: Object.values(explore), backgroundColor: '#c9a227', borderRadius: 6 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#eee6d4' }, ticks: { font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 0 } }
                },
                animation: { duration: 900, easing: 'easeOutQuart' }
            }
        });
    }

    // Chart 2: Wallet spending by type (doughnut)
    const spent = txns.filter(t => t.amount < 0);
    const typeCounts = {};
    spent.forEach(t => { typeCounts[t.type] = (typeCounts[t.type] || 0) + Math.abs(t.amount); });
    if (dashSpendTypeChart) dashSpendTypeChart.destroy();
    const ctxS = document.getElementById('dashSpendTypeChart');
    if (ctxS) {
        dashSpendTypeChart = new Chart(ctxS, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typeCounts).map(k => TYPE_LABELS[k] || k),
                datasets: [{ data: Object.values(typeCounts), backgroundColor: Object.keys(typeCounts).map(k => TYPE_COLORS[k] || '#8a7b55'), borderWidth: 2, borderColor: '#fff' }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '62%',
                plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font: { size: 11 } } } },
                animation: { animateRotate: true, duration: 1100, easing: 'easeOutQuart' }
            }
        });
    }

    // Chart 3: Wallet balance trend (line)
    const trend = {};
    txns.slice().reverse().forEach(t => {
        const d = new Date(t.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
        trend[d] = t.newBalance !== undefined ? t.newBalance : (trend[d] || 0);
    });
    if (dashWalletChart) dashWalletChart.destroy();
    const ctxW = document.getElementById('dashWalletChart');
    if (ctxW) {
        dashWalletChart = new Chart(ctxW, {
            type: 'line',
            data: {
                labels: Object.keys(trend),
                datasets: [{ label: 'Balance', data: Object.values(trend), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.10)', fill: true, tension: 0.4, borderWidth: 2.5, pointBackgroundColor: '#10b981', pointRadius: 3, pointHoverRadius: 6 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e6dec8' }, ticks: { callback: v => 'R' + v, font: { size: 11 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 45 } }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    }
}

function viewUserProfile(id) {
    const users = Storage.getUsers();
    const u = users.find(p => p.id === id);
    if (!u) return;
    currentViewUserId = id;

    document.getElementById('userViewName').textContent = u.fullName;
    document.getElementById('userViewUsername').textContent = u.username || '-';
    document.getElementById('userViewEmail').textContent = u.email;
    document.getElementById('userViewPhone').textContent = u.phone || '-';
    document.getElementById('userViewLocation').textContent = u.location || '-';
    document.getElementById('userViewDob').textContent = u.dob ? new Date(u.dob).toLocaleDateString() : '-';
    document.getElementById('userViewGender').textContent = u.gender || '-';
    document.getElementById('userViewBio').textContent = u.bio || 'No bio provided.';
    document.getElementById('userViewWebsite').textContent = u.website || '-';
    document.getElementById('userViewWebsite').href = u.website || '#';
    document.getElementById('userViewCreated').textContent = u.createdAt ? new Date(u.createdAt).toLocaleString() : '-';
    document.getElementById('userViewUpdated').textContent = u.updatedAt ? new Date(u.updatedAt).toLocaleString() : '-';
    document.getElementById('userViewStatus').textContent = u.status;
    
    const avatarImg = document.getElementById('userViewAvatar');
    const avatarPlaceholder = avatarImg.nextElementSibling;
    if (u.photo) { avatarImg.src = u.photo; avatarImg.style.display = 'block'; avatarPlaceholder.style.display = 'none'; }
    else { avatarImg.style.display = 'none'; avatarPlaceholder.style.display = 'flex'; }

    const interestsContainer = document.getElementById('userViewInterests');
    if (u.interests && u.interests.length > 0) {
        interestsContainer.innerHTML = u.interests.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        interestsContainer.innerHTML = '<span class="tag empty-tag">No interests added</span>';
    }

    const mine = getUserProfilesByAuth();
    const isOwnProfile = mine.some(p => p.id === u.id) || (!!currentAuthId() && u.userId === currentAuthId());
    const editBtn = document.getElementById('editUserProfileBtn');
    const delBtn = document.getElementById('deleteUserProfileBtn');
    if (editBtn) editBtn.style.display = isOwnProfile ? '' : 'none';
    if (delBtn) delBtn.style.display = isOwnProfile ? '' : 'none';

    const uBtn = document.getElementById('userViewFollowBtn');
    if (uBtn) {
        uBtn.setAttribute('data-t', 'user');
        uBtn.setAttribute('data-id', u.id);
        uBtn.style.display = isOwnProfile ? 'none' : '';
    }
    document.querySelectorAll('#page-user-profile [data-follower-count], #page-user-profile [data-following-count]').forEach(el => {
        el.setAttribute('data-t', 'user');
        el.setAttribute('data-id', u.id);
    });
    refreshFollowUI();

    navigateTo('user-profile');
}

function editUserById(id) {
    const users = Storage.getUsers();
    const u = users.find(p => p.id === id);
    if (!u) return;
    navigateTo('user-create');
    populateUserForm(u);
}

function editUserProfile() {
    let id = currentViewUserId;
    if (!id) {
        const mine = getUserProfilesByAuth();
        if (mine.length > 0) id = mine[0].id;
    }
    if (id) editUserById(id);
}

function populateUserForm(u) {
    document.getElementById('userProfileId').value = u.id;
    document.getElementById('userUsername').value = u.username || '';
    document.getElementById('userFullName').value = u.fullName || '';
    document.getElementById('userFormEmail').value = u.email || '';
    document.getElementById('userFormPhone').value = u.phone || '';
    document.getElementById('userFormLocation').value = u.location || '';
    document.getElementById('userDob').value = u.dob || '';
    document.getElementById('userGender').value = u.gender || '';
    document.getElementById('userFormBio').value = u.bio || '';
    document.getElementById('userFormWebsite').value = u.website || '';
    document.getElementById('userFormTitle').textContent = 'Edit General User Profile';
    document.getElementById('userSubmitBtn').textContent = 'Update Profile';
    userTags = [...(u.interests || [])];
    renderUserTags();
    
    const preview = document.getElementById('userPhotoPreview');
    if (u.photo) { preview.innerHTML = `<img src="${u.photo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>'; }
}

function deleteUserProfile() { if (currentViewUserId) promptDeleteUser(currentViewUserId); }

function promptDeleteUser(id) {
    deleteTarget = { type: 'user', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this user profile. This action cannot be undone.';
    document.getElementById('deleteModal').classList.add('active');
}

function promptDeleteProvider(id) {
    deleteTarget = { type: 'provider', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this business profile and all its services. This action cannot be undone.';
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); deleteTarget = { type: null, id: null }; }

function confirmDelete() {
    if (deleteTarget.type === 'user') {
        const users = Storage.getUsers().filter(u => u.id !== deleteTarget.id);
        Storage.setUsers(users);
        showToast('User profile deleted.', 'info');
        currentViewUserId = null;
        navigateTo('user-dashboard');
    } else if (deleteTarget.type === 'provider') {
        const providers = Storage.getProviders().filter(p => p.id !== deleteTarget.id);
        Storage.setProviders(providers);
        showToast('Business profile deleted.', 'info');
        currentViewProviderId = null;
        navigateTo('provider-dashboard');
    } else if (deleteTarget.type === 'forum-thread') {
        const threads = Storage.getForumThreads().filter(t => t.id !== deleteTarget.id);
        Storage.setForumThreads(threads);
        const replies = Storage.getForumReplies().filter(r => r.threadId !== deleteTarget.id);
        Storage.setForumReplies(replies);
        showToast('Thread deleted.', 'info');
        currentForumViewId = null;
        navigateTo('forum-browse');
        renderForumThreads();
    }
    closeDeleteModal();
}

// ==========================================
// GENERAL USER - Tags
// ==========================================
function handleUserTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !userTags.includes(val)) { userTags.push(val); renderUserTags(); }
        e.target.value = '';
    }
}

function addSuggestedTag(tag) {
    if (!userTags.includes(tag)) { userTags.push(tag); renderUserTags(); }
}

function removeUserTag(index) { userTags.splice(index, 1); renderUserTags(); }

function renderUserTags() {
    const container = document.getElementById('userTagsDisplay');
    if (!container) return;
    container.innerHTML = userTags.map((t, i) => `<span class="tag">${t}<button type="button" onclick="removeUserTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// SERVICE PROVIDER - CRUD
// ==========================================
function resetProviderForm() {
    document.getElementById('providerProfileForm').reset();
    document.getElementById('providerProfileId').value = '';
    document.getElementById('providerFormTitle').textContent = 'Create Service Provider Profile';
    document.getElementById('providerSubmitBtn').textContent = 'Create Profile';
    providerTags = [];
    renderProviderTags();
    document.getElementById('providerLogoPreview').innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload logo</span>';
    
    const servicesList = document.getElementById('providerServicesList');
    servicesList.innerHTML = `<div class="service-item">
        <input type="text" placeholder="Service name" class="service-name" required>
        <input type="number" placeholder="Price ($)" class="service-price" min="0" step="0.01">
        <input type="text" placeholder="Description (optional)" class="service-desc">
        <button type="button" class="btn-remove" onclick="removeServiceItem(this)"><i class="fas fa-times"></i></button>
    </div>`;

    document.getElementById('provMon').checked = true;
    document.getElementById('provTue').checked = true;
    document.getElementById('provWed').checked = true;
    document.getElementById('provThu').checked = true;
    document.getElementById('provFri').checked = true;
    document.getElementById('provSat').checked = false;
    document.getElementById('provSun').checked = false;
}

function addServiceItem() {
    const list = document.getElementById('providerServicesList');
    const item = document.createElement('div');
    item.className = 'service-item';
    item.style.animation = 'serviceSlide 0.3s ease';
    item.innerHTML = `<input type="text" placeholder="Service name" class="service-name" required>
        <input type="number" placeholder="Price ($)" class="service-price" min="0" step="0.01">
        <input type="text" placeholder="Description (optional)" class="service-desc">
        <button type="button" class="btn-remove" onclick="removeServiceItem(this)"><i class="fas fa-times"></i></button>`;
    list.appendChild(item);
}

function removeServiceItem(btn) {
    const item = btn.closest('.service-item');
    const list = document.getElementById('providerServicesList');
    if (list.children.length > 1) {
        item.style.animation = 'serviceSlide 0.3s ease reverse';
        setTimeout(() => item.remove(), 300);
    } else {
        showToast('At least one service is required.', 'warning');
    }
}

function handleProviderSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('providerProfileId').value;
    const now = new Date().toISOString();

    const serviceItems = document.querySelectorAll('#providerServicesList .service-item');
    const services = [];
    serviceItems.forEach(item => {
        const name = item.querySelector('.service-name')?.value.trim();
        if (name) {
            services.push({
                name,
                price: item.querySelector('.service-price')?.value || '',
                description: item.querySelector('.service-desc')?.value || ''
            });
        }
    });

    const availability = {
        mon: document.getElementById('provMon').checked,
        tue: document.getElementById('provTue').checked,
        wed: document.getElementById('provWed').checked,
        thu: document.getElementById('provThu').checked,
        fri: document.getElementById('provFri').checked,
        sat: document.getElementById('provSat').checked,
        sun: document.getElementById('provSun').checked,
        workStart: document.getElementById('providerWorkStart').value,
        workEnd: document.getElementById('providerWorkEnd').value
    };

    const profile = {
        id: id || generateId(),
        businessName: document.getElementById('providerBusinessName').value,
        businessType: document.getElementById('providerBusinessType').value,
        contactPerson: document.getElementById('providerContactPerson').value,
        email: document.getElementById('providerFormEmail').value,
        phone: document.getElementById('providerFormPhone').value,
        estYear: document.getElementById('providerEstYear').value,
        website: document.getElementById('providerFormWebsite').value,
        address: document.getElementById('providerFormAddress').value,
        location: document.getElementById('providerFormLocation')?.value || '',
        description: document.getElementById('providerFormDescription').value,
        tagline: document.getElementById('providerFormTagline').value,
        services,
        categories: [...providerTags],
        availability,
        logo: document.getElementById('providerLogoPreview').querySelector('img')?.src || '',
        status: 'active',
        updatedAt: now
    };

    const providers = Storage.getProviders();
    if (id) {
        const idx = providers.findIndex(p => p.id === id);
        if (idx !== -1) { profile.createdAt = providers[idx].createdAt; providers[idx] = profile; }
        showToast('Business profile updated!');
    } else {
        profile.createdAt = now;
        providers.push(profile);
        showToast('Business profile created!');
    }
    Storage.setProviders(providers);
    navigateTo('provider-dashboard');
}

function renderProviderProfiles(filter = 'all') {
    const providers = Storage.getProviders();
    const container = document.getElementById('providerProfilesList');
    const filtered = filter === 'all' ? providers : providers.filter(p => p.status === filter);

    document.getElementById('providerCount').textContent = providers.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><h3>No business profiles yet</h3><p>Create your first business profile to get started</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-create')">Create Profile</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((p, i) => `
        <div class="profile-list-card provider-list-card" style="animation-delay:${i * 0.1}s" onclick="viewProviderProfile('${p.id}')">
            <div class="list-card-avatar provider-avatar-sm">${p.logo ? `<img src="${p.logo}" alt="">` : `<i class="fas fa-briefcase"></i>`}</div>
            <div class="list-card-info">
                <h3>${p.businessName}</h3>
                <p>${p.email} &middot; ${p.businessType}</p>
                <div class="list-card-tags">${(p.categories || []).slice(0, 3).map(t => `<span class="mini-tag provider-mini">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${p.status}">${p.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editProviderById('${p.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteProvider('${p.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterProviderProfiles() { renderProviderProfiles(document.getElementById('providerFilter').value); }

function viewProviderProfile(id) {
    const providers = Storage.getProviders();
    const p = providers.find(pr => pr.id === id);
    if (!p) return;
    currentViewProviderId = id;

    document.getElementById('providerViewName').textContent = p.businessName;
    document.getElementById('providerViewEmail').textContent = p.email;
    document.getElementById('providerViewType').textContent = p.businessType;
    document.getElementById('providerViewPhone').textContent = p.phone || '-';
    document.getElementById('providerViewAddress').textContent = p.address || '-';
    document.getElementById('providerViewContact').textContent = p.contactPerson || '-';
    document.getElementById('providerViewEst').textContent = p.estYear || '-';
    document.getElementById('providerViewTagline').textContent = p.tagline || '';
    document.getElementById('providerViewDescription').textContent = p.description || 'No description provided.';
    document.getElementById('providerViewWebsite').textContent = p.website || '-';
    document.getElementById('providerViewWebsite').href = p.website || '#';
    document.getElementById('providerViewCreated').textContent = p.createdAt ? new Date(p.createdAt).toLocaleString() : '-';
    document.getElementById('providerViewUpdated').textContent = p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '-';
    document.getElementById('providerViewStatus').textContent = p.status;
    document.getElementById('providerViewHours').textContent = (p.availability?.workStart || '09:00') + ' - ' + (p.availability?.workEnd || '17:00');

    const logoImg = document.getElementById('providerViewAvatar');
    const logoPlaceholder = logoImg.nextElementSibling;
    if (p.logo) { logoImg.src = p.logo; logoImg.style.display = 'block'; logoPlaceholder.style.display = 'none'; }
    else { logoImg.style.display = 'none'; logoPlaceholder.style.display = 'flex'; }

    const servicesContainer = document.getElementById('providerViewServices');
    if (p.services && p.services.length > 0) {
        servicesContainer.innerHTML = p.services.map(s => `
            <div class="service-view-item">
                <div class="service-view-info">
                    <span class="service-view-name">${s.name}</span>
                    <span class="service-view-desc">${s.description || ''}</span>
                </div>
                <span class="service-view-price">${s.price ? '$' + s.price : 'Free'}</span>
            </div>
        `).join('');
    } else {
        servicesContainer.innerHTML = '<p class="empty-text">No services added</p>';
    }

    const categoriesContainer = document.getElementById('providerViewCategories');
    if (p.categories && p.categories.length > 0) {
        categoriesContainer.innerHTML = p.categories.map(t => `<span class="tag provider-tag">${t}</span>`).join('');
    } else {
        categoriesContainer.innerHTML = '<span class="tag empty-tag">No categories added</span>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('providerViewAvailability');
    availContainer.innerHTML = days.map((d, i) => `<span class="day-badge ${p.availability?.[d] ? 'day-active' : 'day-inactive'}">${dayLabels[i]}</span>`).join('');

    navigateTo('provider-profile');
}

function editProviderById(id) {
    const providers = Storage.getProviders();
    const p = providers.find(pr => pr.id === id);
    if (!p) return;
    navigateTo('provider-create');
    populateProviderForm(p);
}

function editProviderProfile() {
    let id = currentViewProviderId;
    if (!id) id = findCurrentProviderId();
    if (id) editProviderById(id);
}

function populateProviderForm(p) {
    document.getElementById('providerProfileId').value = p.id;
    document.getElementById('providerBusinessName').value = p.businessName || '';
    document.getElementById('providerBusinessType').value = p.businessType || '';
    document.getElementById('providerContactPerson').value = p.contactPerson || '';
    document.getElementById('providerFormEmail').value = p.email || '';
    document.getElementById('providerFormPhone').value = p.phone || '';
    document.getElementById('providerEstYear').value = p.estYear || '';
    document.getElementById('providerFormWebsite').value = p.website || '';
    document.getElementById('providerFormAddress').value = p.address || '';
    if (document.getElementById('providerFormLocation')) document.getElementById('providerFormLocation').value = p.location || '';
    document.getElementById('providerFormDescription').value = p.description || '';
    document.getElementById('providerFormTagline').value = p.tagline || '';
    document.getElementById('providerFormTitle').textContent = 'Edit Service Provider Profile';
    document.getElementById('providerSubmitBtn').textContent = 'Update Profile';

    providerTags = [...(p.categories || [])];
    renderProviderTags();

    if (p.availability) {
        document.getElementById('provMon').checked = p.availability.mon || false;
        document.getElementById('provTue').checked = p.availability.tue || false;
        document.getElementById('provWed').checked = p.availability.wed || false;
        document.getElementById('provThu').checked = p.availability.thu || false;
        document.getElementById('provFri').checked = p.availability.fri || false;
        document.getElementById('provSat').checked = p.availability.sat || false;
        document.getElementById('provSun').checked = p.availability.sun || false;
        document.getElementById('providerWorkStart').value = p.availability.workStart || '09:00';
        document.getElementById('providerWorkEnd').value = p.availability.workEnd || '17:00';
    }

    const servicesList = document.getElementById('providerServicesList');
    if (p.services && p.services.length > 0) {
        servicesList.innerHTML = p.services.map(s => `
            <div class="service-item">
                <input type="text" placeholder="Service name" class="service-name" value="${s.name}" required>
                <input type="number" placeholder="Price ($)" class="service-price" min="0" step="0.01" value="${s.price || ''}">
                <input type="text" placeholder="Description (optional)" class="service-desc" value="${s.description || ''}">
                <button type="button" class="btn-remove" onclick="removeServiceItem(this)"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }

    const preview = document.getElementById('providerLogoPreview');
    if (p.logo) { preview.innerHTML = `<img src="${p.logo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload logo</span>'; }
}

function deleteProviderProfile() { if (currentViewProviderId) promptDeleteProvider(currentViewProviderId); }

// ==========================================
// SERVICE PROVIDER - Tags
// ==========================================
function handleProviderTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !providerTags.includes(val)) { providerTags.push(val); renderProviderTags(); }
        e.target.value = '';
    }
}

function addProviderSuggestedTag(tag) {
    if (!providerTags.includes(tag)) { providerTags.push(tag); renderProviderTags(); }
}

function removeProviderTag(index) { providerTags.splice(index, 1); renderProviderTags(); }

function renderProviderTags() {
    const container = document.getElementById('providerTagsDisplay');
    if (!container) return;
    container.innerHTML = providerTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeProviderTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// PHOTO UPLOAD
// ==========================================
function previewPhoto(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" alt="">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

const USER_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'gif', 'webp', 'png'];

function userPhotoExtErrMsg() {
    return 'Please choose a valid image. Accepted formats: JPG, JPEG, GIF, WebP, PNG.';
}

function validateUserPhoto(input, previewId) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const name = (file.name || '').toLowerCase();
    const ext = name.split('.').pop();
    if (!USER_PHOTO_EXTENSIONS.includes(ext)) {
        alert(userPhotoExtErrMsg());
        input.value = '';
        return;
    }
    previewPhoto(input, previewId);
}

function setUserPhotoFromUrl() {
    const input = document.getElementById('userPhotoUrl');
    const preview = document.getElementById('userPhotoPreview');
    if (!input || !preview) return;
    let url = (input.value || '').trim();
    if (!url) { alert('Please paste an image link first.'); return; }

    const okHttp = /^https?:\/\/.+/i.test(url);
    const dataOk = /^data:image\/(jpeg|jpg|gif|webp|png);base64,/i.test(url);
    if (!okHttp && !dataOk) {
        alert('Please enter a valid image link (http or https) or a supported data image.');
        return;
    }

    const ext = url.split('?')[0].split('#')[0].toLowerCase().split('.').pop() || '';
    if (okHttp && !USER_PHOTO_EXTENSIONS.includes(ext)) {
        alert('Image link must end in one of: JPG, JPEG, GIF, WebP, PNG.');
        return;
    }

    preview.innerHTML = `<img src="${url.replace(/"/g, '&quot;')}" alt="" onerror="this.onerror=null;this.parentElement.innerHTML='<i class=&quot;fas fa-camera&quot;></i><span>Click to upload</span>';">`;
}

// ==========================================
// DIRECTORY - BROWSE (General User Page)
// ==========================================
function renderDirectory() {
    const listings = Storage.getListings();
    const container = document.getElementById('directoryList');
    if (!container) return;

    let filtered = listings.filter(l => !l.status || l.status === 'active');
    
    if (currentDirectoryFilter !== 'all') {
        filtered = filtered.filter(l => l.category === currentDirectoryFilter);
    }

    const locationVal = document.getElementById('directoryLocationFilter')?.value || '';
    if (locationVal) {
        filtered = filtered.filter(l => l.location && l.location.toLowerCase().includes(locationVal.toLowerCase()));
    }

    const searchVal = (document.getElementById('directorySearch')?.value || '').toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(l =>
            l.name.toLowerCase().includes(searchVal) ||
            l.location.toLowerCase().includes(searchVal) ||
            (l.tags || []).some(t => t.toLowerCase().includes(searchVal))
        );
    }

    const sortVal = document.getElementById('directorySort')?.value || 'newest';
    filtered.sort((a, b) => {
        if (sortVal === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortVal === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
        if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

    document.getElementById('directoryCount').textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><h3>No profiles found</h3><p>Try adjusting your filters or search terms</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((l, i) => {
        const type = DIRECTORY_TYPES[l.category] || {};
        return `
        <div class="directory-card" style="animation-delay:${i * 0.05}s" onclick="viewDirectoryListing('${l.id}')">
            <button class="save-item-btn ${isItemSaved('profile', l.id) ? 'saved' : ''}" data-kind="profile" data-id="${l.id}" onclick="event.stopPropagation(); toggleSaveItem('profile','${l.id}')"><i class="fas ${isItemSaved('profile', l.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
            <div class="directory-card-photo">
                ${l.photo ? `<img src="${l.photo}" alt="">` : `<div class="directory-card-icon" style="background:${type.color}"><i class="fas ${type.icon || 'fa-user'}"></i></div>`}
            </div>
            <div class="directory-card-body">
                <div class="directory-card-header">
                    <h3>${l.name}</h3>
                    <span class="directory-type-badge" style="background:${type.color}20; color:${type.color}">${type.label || l.category}</span>
                </div>
                <p class="directory-card-location"><i class="fas fa-map-marker-alt"></i> ${l.location}</p>
                <div class="directory-card-tags">${(l.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
                <div class="directory-card-footer">
                    <div class="directory-card-foot-left">
                        <span class="directory-card-rate">${l.rate || 'Contact'}</span>
                        <span class="follow-count-chip"><i class="fas fa-user-plus"></i> <span data-follower-count data-t="listing" data-id="${l.id}">${getFollowerCount('listing', l.id)}</span></span>
                    </div>
                    ${followButtonHTML('listing', l.id)}
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterDirectory(type) {
    currentDirectoryFilter = type;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    renderDirectory();
}

function searchDirectory() { renderDirectory(); }

function safeExternalUrl(u) {
    if (!u) return null;
    let s = String(u).trim();
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    return /^https?:\/\//i.test(s) ? s : null;
}

function renderProfileLinks(containerId, links) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const valid = (links || []).filter(l => l && l.url).map(l => ({ label: String(l.label || '').trim(), url: safeExternalUrl(l.url) })).filter(l => l.url).slice(0, 5);
    if (valid.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = valid.map(l => `
        <a class="profile-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> ${escapeHtml(l.label || l.url)}
        </a>
    `).join('');
}

let currentActivityOwner = { id: null, name: null };

const ACTIVITY_NAV = {
    experiences: 'experiences-browse',
    gigs: 'gigs-browse',
    content: 'content-directory',
    forums: 'forum-browse',
    events: 'events-directory'
};

function providerItemMatches(item, owner) {
    if (!item || !owner) return false;
    const id = owner.id && owner.id !== 'current' && owner.id !== 'unknown' ? String(owner.id) : null;
    const name = owner.name ? String(owner.name).toLowerCase() : null;
    if (id && (item.ownerId === id || item.providerId === id || item.authorId === id)) return true;
    if (name) {
        const fields = [item.ownerName, item.providerName, item.author, item.authorName, item.owner, item.businessName];
        if (fields.some(f => f && String(f).toLowerCase() === name)) return true;
    }
    return false;
}

function resolveProviderAuthorName(item, fallback) {
    if (!item) return fallback || 'Unknown';
    if (item.ownerName || item.authorName) return item.ownerName || item.authorName;
    if (item.author) return item.author;
    if (item.providerId && item.providerId !== 'unknown') {
        const pool = [...Storage.getListings(), ...Storage.getServices(), ...Storage.getProviders()];
        const byId = pool.find(p => p.id === item.providerId);
        if (byId) return byId.name || byId.businessName || byId.authorName || '';
        const byName = [...Storage.getListings(), ...Storage.getServices()].find(p => (p.name || '') === item.providerId);
        if (byName) return byName.name;
    }
    return fallback || 'Unknown';
}

function getProviderActivityItems(type) {
    const owner = currentActivityOwner;
    switch (type) {
        case 'experiences': return Storage.getExperiences().filter(x => providerItemMatches(x, owner));
        case 'gigs':        return Storage.getGigs().filter(g => providerItemMatches(g, owner));
        case 'content':     return Storage.getContent().filter(c => providerItemMatches(c, owner));
        case 'forums':      return Storage.getForumThreads().filter(t => providerItemMatches(t, owner));
        case 'events':      return Storage.getEvents().filter(e => providerItemMatches(e, owner));
    }
    return [];
}

function providerActivityCardHTML(type, item) {
    switch (type) {
        case 'experiences':
            return `<div class="activity-item" onclick="viewExperience('${item.id}')">
                <div class="activity-item-icon" style="background:#7c3aed22;color:#7c3aed"><i class="fas fa-gem"></i></div>
                <div class="activity-item-body">
                    <h4>${escapeHtml(item.title || 'Untitled Experience')}</h4>
                    <span>${escapeHtml(item.type || 'Experience')}${item.location ? ' &middot; ' + escapeHtml(item.location) : ''}</span>
                    <small>${item.price ? 'R' + escapeHtml(item.price) : 'Free'}${item.createdAt ? ' &middot; ' + new Date(item.createdAt).toLocaleDateString() : ''}</small>
                </div>
            </div>`;
        case 'gigs':
            return `<div class="activity-item" onclick="viewGig('${item.id}')">
                <div class="activity-item-icon" style="background:#0ea5e922;color:#0ea5e9"><i class="fas fa-briefcase"></i></div>
                <div class="activity-item-body">
                    <h4>${escapeHtml(item.title || 'Untitled Gig')}</h4>
                    <span>${escapeHtml(item.gigType || 'Gig')}${item.location ? ' &middot; ' + escapeHtml(item.location) : ''}</span>
                    <small>${item.rate ? 'R' + escapeHtml(item.rate) + (item.rateType ? ' / ' + escapeHtml(item.rateType) : '') : 'Rate on enquiry'}${item.createdAt ? ' &middot; ' + new Date(item.createdAt).toLocaleDateString() : ''}</small>
                </div>
            </div>`;
        case 'content':
            return `<div class="activity-item" onclick="viewContent('${item.id}')">
                <div class="activity-item-icon" style="background:#f59e0b22;color:#f59e0b"><i class="fas fa-photo-film"></i></div>
                <div class="activity-item-body">
                    <h4>${escapeHtml(item.title || 'Untitled Content')}</h4>
                    <span>${escapeHtml(item.type || 'Content')}${item.location ? ' &middot; ' + escapeHtml(item.location) : ''}</span>
                    <small>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</small>
                </div>
            </div>`;
        case 'forums':
            return `<div class="activity-item" onclick="viewForumThread('${item.id}')">
                <div class="activity-item-icon" style="background:#10b98122;color:#10b981"><i class="fas fa-comments"></i></div>
                <div class="activity-item-body">
                    <h4>${escapeHtml(item.title || 'Untitled Thread')}</h4>
                    <span>${escapeHtml(item.category || 'Forum')}${item.pinned ? ' &middot; Pinned' : ''}</span>
                    <small>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</small>
                </div>
            </div>`;
        case 'events':
            return `<div class="activity-item" onclick="viewEvent('${item.id}')">
                <div class="activity-item-icon" style="background:#ef444422;color:#ef4444"><i class="fas fa-calendar"></i></div>
                <div class="activity-item-body">
                    <h4>${escapeHtml(item.name || 'Untitled Event')}</h4>
                    <span>${escapeHtml(item.type || 'Event')}${item.venue ? ' &middot; ' + escapeHtml(item.venue) : ''}</span>
                    <small>${item.eventDate ? new Date(item.eventDate).toLocaleDateString() : ''}${item.fee ? ' &middot; R' + escapeHtml(item.fee) : ''}</small>
                </div>
            </div>`;
    }
    return '';
}

function renderProviderActivity(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = getProviderActivityItems(type);
    const shown = items.slice(0, 5);
    const nav = ACTIVITY_NAV[type] || '';
    if (shown.length === 0) {
        container.innerHTML = `<div class="activity-empty"><i class="fas fa-box-open"></i><p>No ${escapeHtml(type)} from this provider yet.</p></div>`;
        return;
    }
    container.innerHTML = `<div class="activity-list">${shown.map(i => providerActivityCardHTML(type, i)).join('')}</div>
        ${nav ? `<button class="btn btn-secondary btn-sm activity-view-more" onclick="navigateTo('${nav}')"><i class="fas fa-arrow-right"></i> View More ${escapeHtml(type)}</button>` : ''}`;
}

function switchProviderActivity(type, containerId, btn) {
    const content = document.getElementById(containerId);
    if (!content) return;
    const card = content.closest('.profile-card');
    if (card) card.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderProviderActivity(containerId, type);
}

function viewDirectoryListing(id) {
    const listings = Storage.getListings();
    const l = listings.find(item => item.id === id);
    if (!l) return;
    currentViewListingId = id;

    const type = DIRECTORY_TYPES[l.category] || {};
    
    document.getElementById('dirViewName').textContent = l.name;
    document.getElementById('dirViewLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${l.location}`;
    document.getElementById('dirViewEmail').textContent = l.email;
    document.getElementById('dirViewPhone').textContent = l.phone || '-';
    document.getElementById('dirViewRate').textContent = l.rate || 'Contact for rate';
    document.getElementById('dirViewBio').textContent = l.bio || '-';
    document.getElementById('dirViewWebsite').textContent = l.website || '-';
    document.getElementById('dirViewWebsite').href = l.website || '#';
    renderProfileLinks('dirViewLinks', l.links);

    const typeBadge = document.getElementById('dirViewType');
    typeBadge.textContent = type.label || l.category;
    typeBadge.style.background = (type.color || '#6366f1') + '20';
    typeBadge.style.color = type.color || '#6366f1';

    const avatarImg = document.getElementById('dirViewAvatar');
    const avatarPlaceholder = avatarImg.nextElementSibling;
    const avatarContainer = document.getElementById('directoryViewAvatar');
    if (l.photo) { avatarImg.src = l.photo; avatarImg.style.display = 'block'; avatarPlaceholder.style.display = 'none'; }
    else { avatarImg.style.display = 'none'; avatarPlaceholder.style.display = 'flex'; avatarPlaceholder.style.background = `linear-gradient(135deg, ${type.color}, ${type.color}dd)`; }

    const tagsContainer = document.getElementById('dirViewTags');
    if (l.tags && l.tags.length > 0) {
        tagsContainer.innerHTML = l.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No specialties listed</span>';
    }

    const galleryContainer = document.getElementById('dirViewGallery');
    if (l.gallery && l.gallery.length > 0) {
        galleryContainer.innerHTML = l.gallery.map(img => `<div class="gallery-item" onclick="openPhotoModal('${img}')"><img src="${img}" alt=""></div>`).join('');
    } else {
        galleryContainer.innerHTML = '<p class="empty-text">No gallery images</p>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('dirViewAvailability');
    availContainer.innerHTML = days.map((d, i) => '<span class="day-badge ' + (l.availability?.[d] ? 'day-active' : 'day-inactive') + '">' + dayLabels[i] + '</span>').join('');

    renderReviewsList('profile', id);
    initStarRating('profileStarRating');

    currentActivityOwner = { id: l.ownerId, name: l.ownerName };
    renderProviderActivity('directoryActivityContent', 'experiences');

    const dBtn = document.getElementById('dirViewFollowBtn');
    if (dBtn) {
        dBtn.setAttribute('data-t', 'listing');
        dBtn.setAttribute('data-id', l.id);
        dBtn.style.display = getMyFollowIdentityKeys().includes('listing:' + l.id) ? 'none' : '';
    }
    document.querySelectorAll('#page-directory-view [data-follower-count], #page-directory-view [data-following-count]').forEach(el => {
        el.setAttribute('data-t', 'listing');
        el.setAttribute('data-id', l.id);
    });
    refreshFollowUI();

    navigateTo('directory-view');
}

// ==========================================
// DIRECTORY - CRUD (Provider Page)
// ==========================================
function resetListingForm() {
    const form = document.getElementById('listingForm');
    if (!form) return;
    form.reset();
    document.getElementById('listingId').value = '';
    document.getElementById('listingFormTitle').textContent = 'Create Directory Listing';
    document.getElementById('listingSubmitBtn').textContent = 'Publish Listing';
    listingTags = [];
    listingGallery = [];
    listingLinks = [];
    renderListingTags();
    renderGalleryUpload();
    renderListingLinks();
    document.getElementById('listingPhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
}

function handleListingSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('listingId').value;
    const now = new Date().toISOString();

    const listing = {
        id: id || generateId(),
        name: document.getElementById('listingName').value,
        category: document.getElementById('listingCategory').value,
        email: document.getElementById('listingEmail').value,
        phone: document.getElementById('listingPhone').value,
        location: document.getElementById('listingLocation').value,
        rate: document.getElementById('listingRate').value,
        bookingFee: parseFloat(document.getElementById('listingBookingFee')?.value) || null,
        website: document.getElementById('listingWebsite').value,
        links: collectListingLinks(),
        bio: document.getElementById('listingBio').value,
        tags: [...listingTags],
        gallery: [...listingGallery],
        photo: document.getElementById('listingPhotoPreview').querySelector('img')?.src || '',
        availability: {
            mon: document.getElementById('listMon').checked,
            tue: document.getElementById('listTue').checked,
            wed: document.getElementById('listWed').checked,
            thu: document.getElementById('listThu').checked,
            fri: document.getElementById('listFri').checked,
            sat: document.getElementById('listSat').checked,
            sun: document.getElementById('listSun').checked
        },
        status: 'active',
        ownerId: getCurrentProviderIdentity().id,
        ownerName: getCurrentProviderIdentity().name,
        updatedAt: now
    };

    const listings = Storage.getListings();
    if (id) {
        const idx = listings.findIndex(l => l.id === id);
        if (idx !== -1) { listing.createdAt = listings[idx].createdAt; listings[idx] = listing; }
        showToast('Listing updated successfully!');
    } else {
        listing.createdAt = now;
        listings.push(listing);
        showToast('Listing published successfully!');
    }
    Storage.setListings(listings);
    navigateTo('provider-directory');
}

function renderListings(filter = 'all') {
    const listings = Storage.getListings();
    const container = document.getElementById('listingsList');
    const countEl = document.getElementById('listingCount');
    if (!container) return;

    const filtered = filter === 'all' ? listings : listings.filter(l => l.category === filter);
    if (countEl) countEl.textContent = listings.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><h3>No listings yet</h3><p>Create your first directory listing to get discovered</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-listing-create')">Create Listing</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((l, i) => {
        const type = DIRECTORY_TYPES[l.category] || {};
        return `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s">
            <div class="list-card-avatar" style="background:${type.color}20; color:${type.color}">
                ${l.photo ? `<img src="${l.photo}" alt="">` : `<i class="fas ${type.icon || 'fa-user'}"></i>`}
            </div>
            <div class="list-card-info">
                <h3>${l.name}</h3>
                <p>${type.label || l.category} &middot; ${l.location}</p>
                <div class="list-card-tags">${(l.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${l.status}">${l.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editListingById('${l.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteListing('${l.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterListings() { renderListings(document.getElementById('listingFilter').value); }

function editListingById(id) {
    const listings = Storage.getListings();
    const l = listings.find(item => item.id === id);
    if (!l) return;
    populateListingForm(l);
    navigateTo('provider-listing-create');
}

function populateListingForm(l) {
    document.getElementById('listingId').value = l.id;
    document.getElementById('listingName').value = l.name || '';
    document.getElementById('listingCategory').value = l.category || '';
    document.getElementById('listingEmail').value = l.email || '';
    document.getElementById('listingPhone').value = l.phone || '';
    document.getElementById('listingLocation').value = l.location || '';
    document.getElementById('listingRate').value = l.rate || '';
    if (document.getElementById('listingBookingFee')) document.getElementById('listingBookingFee').value = l.bookingFee ?? '';
    document.getElementById('listingWebsite').value = l.website || '';
    document.getElementById('listingBio').value = l.bio || '';
    document.getElementById('listingFormTitle').textContent = 'Edit Directory Listing';
    document.getElementById('listingSubmitBtn').textContent = 'Update Listing';

    listingTags = [...(l.tags || [])];
    listingGallery = [...(l.gallery || [])];
    listingLinks = [...(l.links || [])];
    renderListingTags();
    renderGalleryUpload();
    renderListingLinks();

    if (l.availability) {
        document.getElementById('listMon').checked = l.availability.mon || false;
        document.getElementById('listTue').checked = l.availability.tue || false;
        document.getElementById('listWed').checked = l.availability.wed || false;
        document.getElementById('listThu').checked = l.availability.thu || false;
        document.getElementById('listFri').checked = l.availability.fri || false;
        document.getElementById('listSat').checked = l.availability.sat || false;
        document.getElementById('listSun').checked = l.availability.sun || false;
    }

    const preview = document.getElementById('listingPhotoPreview');
    if (l.photo) { preview.innerHTML = `<img src="${l.photo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>'; }
}

function promptDeleteListing(id) {
    deleteTarget = { type: 'listing', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this directory listing.';
    document.getElementById('deleteModal').classList.add('active');
}

// ==========================================
// DIRECTORY - Tags
// ==========================================
function handleListingTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !listingTags.includes(val)) { listingTags.push(val); renderListingTags(); }
        e.target.value = '';
    }
}

function addListingSuggestedTag(tag) {
    if (!listingTags.includes(tag)) { listingTags.push(tag); renderListingTags(); }
}

function removeListingTag(index) { listingTags.splice(index, 1); renderListingTags(); }

function renderListingTags() {
    const container = document.getElementById('listingTagsDisplay');
    if (!container) return;
    container.innerHTML = listingTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeListingTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// DIRECTORY - External Links (max 5)
// ==========================================
function addListingLink() {
    if (listingLinks.length >= 5) return;
    listingLinks.push({ label: '', url: '' });
    renderListingLinks();
}

function removeListingLink(index) {
    listingLinks.splice(index, 1);
    renderListingLinks();
}

function renderListingLinks() {
    const container = document.getElementById('listingLinksContainer');
    if (!container) return;
    if (listingLinks.length === 0) {
        container.innerHTML = '<p style="color:#a99c7e;font-size:0.85rem">No external links added yet.</p>';
        return;
    }
    container.innerHTML = listingLinks.map((link, i) => `
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
            <input type="text" data-link-label="${i}" value="${escapeHtml(link.label)}" placeholder="Label (e.g. Instagram, X, OnlyFans)" class="form-input" style="flex:1;min-width:120px">
            <input type="url" data-link-url="${i}" value="${escapeHtml(link.url)}" placeholder="https://..." class="form-input" style="flex:2;min-width:180px">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeListingLink(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function collectListingLinks() {
    return (listingLinks || []).map((_, i) => ({
        label: (document.querySelector(`#listingLinksContainer input[data-link-label="${i}"]`)?.value || '').trim(),
        url: (document.querySelector(`#listingLinksContainer input[data-link-url="${i}"]`)?.value || '').trim()
    })).filter(l => l.url).slice(0, 5);
}


// ==========================================
// DIRECTORY - Gallery
// ==========================================
function addGalleryImage(input) {
    if (input.files && input.files[0] && listingGallery.length < 6) {
        const reader = new FileReader();
        reader.onload = function(e) {
            listingGallery.push(e.target.result);
            renderGalleryUpload();
        };
        reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
}

function removeGalleryImage(index) {
    listingGallery.splice(index, 1);
    renderGalleryUpload();
}

function renderGalleryUpload() {
    const container = document.getElementById('galleryUploadGrid');
    if (!container) return;

    let html = listingGallery.map((img, i) => `
        <div class="gallery-upload-item has-image">
            <img src="${img}" alt="">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    if (listingGallery.length < 6) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('galleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// UPDATE confirmDelete for listings
// ==========================================
const _origConfirmDelete = confirmDelete;
confirmDelete = function() {
    if (deleteTarget.type === 'listing') {
        const listings = Storage.getListings().filter(l => l.id !== deleteTarget.id);
        Storage.setListings(listings);
        showToast('Listing deleted.', 'info');
        currentViewListingId = null;
        closeDeleteModal();
        navigateTo('provider-directory');
        return;
    }
    if (deleteTarget.type === 'venue') {
        const venues = Storage.getVenues().filter(v => v.id !== deleteTarget.id);
        Storage.setVenues(venues);
        showToast('Venue deleted.', 'info');
        currentViewVenueId = null;
        closeDeleteModal();
        navigateTo('provider-venue-directory');
        return;
    }
    if (deleteTarget.type === 'ad') {
        const ads = Storage.getAds().filter(a => a.id !== deleteTarget.id);
        Storage.setAds(ads);
        showToast('Ad deleted.', 'info');
        currentViewAdId = null;
        closeDeleteModal();
        if (window.location.pathname.includes('provider.html')) {
            navigateTo('provider-ads');
        } else {
            navigateTo('user-ads');
        }
        return;
    }
    if (deleteTarget.type === 'service') {
        const services = Storage.getServices().filter(s => s.id !== deleteTarget.id);
        Storage.setServices(services);
        showToast('Service deleted.', 'info');
        closeDeleteModal();
        navigateTo('provider-services');
        return;
    }
    if (deleteTarget.type === 'booking') {
        const bookings = Storage.getBookings().filter(b => b.id !== deleteTarget.id);
        Storage.setBookings(bookings);
        showToast('Booking deleted.', 'info');
        closeDeleteModal();
        if (window.location.pathname.includes('provider.html')) {
            navigateTo('provider-bookings');
        } else {
            navigateTo('user-bookings');
        }
        return;
    }
    if (deleteTarget.type === 'content') {
        const content = Storage.getContent().filter(c => c.id !== deleteTarget.id);
        Storage.setContent(content);
        showToast('Content deleted.', 'info');
        closeDeleteModal();
        navigateTo('provider-content');
        return;
    }
    if (deleteTarget.type === 'event') {
        const events = Storage.getEvents().filter(e => e.id !== deleteTarget.id);
        Storage.setEvents(events);
        showToast('Event deleted.', 'info');
        closeDeleteModal();
        navigateTo('provider-events');
        return;
    }
    _origConfirmDelete();
};

// ==========================================
// VENUE DIRECTORY - BROWSE (General User Page)
// ==========================================
function renderVenueDirectory() {
    const venues = Storage.getVenues();
    const container = document.getElementById('venueDirectoryList');
    if (!container) return;

    let filtered = venues.filter(v => !v.status || v.status === 'active');

    if (currentVenueDirectoryFilter !== 'all') {
        filtered = filtered.filter(v => v.category === currentVenueDirectoryFilter);
    }

    const locationVal = document.getElementById('venueLocationFilter')?.value || '';
    if (locationVal) {
        filtered = filtered.filter(v => v.location && v.location.toLowerCase().includes(locationVal.toLowerCase()));
    }

    const searchVal = (document.getElementById('venueSearch')?.value || '').toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(v =>
            v.name.toLowerCase().includes(searchVal) ||
            v.location.toLowerCase().includes(searchVal) ||
            (v.tags || []).some(t => t.toLowerCase().includes(searchVal))
        );
    }

    const sortVal = document.getElementById('venueSort')?.value || 'newest';
    filtered.sort((a, b) => {
        if (sortVal === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortVal === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
        if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

    document.getElementById('venueDirectoryCount').textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><h3>No venues found</h3><p>Try adjusting your filters or search terms</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((v, i) => {
        const type = VENUE_TYPES[v.category] || {};
        return `
        <div class="directory-card" style="animation-delay:${i * 0.05}s" onclick="viewVenueDirectory('${v.id}')">
            <button class="save-item-btn ${isItemSaved('venue', v.id) ? 'saved' : ''}" data-kind="venue" data-id="${v.id}" onclick="event.stopPropagation(); toggleSaveItem('venue','${v.id}')"><i class="fas ${isItemSaved('venue', v.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
            <div class="directory-card-photo">
                ${v.photo ? `<img src="${v.photo}" alt="">` : `<div class="directory-card-icon" style="background:${type.color}"><i class="fas ${type.icon || 'fa-store'}"></i></div>`}
            </div>
            <div class="directory-card-body">
                <div class="directory-card-header">
                    <h3>${v.name}</h3>
                    <span class="directory-type-badge" style="background:${type.color}20; color:${type.color}">${type.label || v.category}</span>
                </div>
                <p class="directory-card-location"><i class="fas fa-map-marker-alt"></i> ${v.location}</p>
                <div class="directory-card-tags">${(v.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
                <div class="directory-card-footer">
                    <span class="directory-card-rate">${v.rate || 'Free Entry'}</span>
                    ${v.capacity ? `<span class="directory-card-capacity"><i class="fas fa-users"></i> ${v.capacity}</span>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterVenueDirectory(type) {
    currentVenueDirectoryFilter = type;
    document.querySelectorAll('#page-venue-directory .filter-tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    renderVenueDirectory();
}

function searchVenueDirectory() { renderVenueDirectory(); }

function viewVenueDirectory(id) {
    const venues = Storage.getVenues();
    const v = venues.find(item => item.id === id);
    if (!v) return;
    currentViewVenueId = id;

    const type = VENUE_TYPES[v.category] || {};

    document.getElementById('venViewName').textContent = v.name;
    document.getElementById('venViewLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${v.location}`;
    document.getElementById('venViewEmail').textContent = v.email;
    document.getElementById('venViewPhone').textContent = v.phone || '-';
    document.getElementById('venViewRate').textContent = v.rate || 'Free Entry';
    document.getElementById('venViewCapacity').textContent = v.capacity || '-';
    document.getElementById('venViewBio').textContent = v.bio || '-';
    document.getElementById('venViewWebsite').textContent = v.website || '-';
    document.getElementById('venViewWebsite').href = v.website || '#';

    const typeBadge = document.getElementById('venViewType');
    typeBadge.textContent = type.label || v.category;
    typeBadge.style.background = (type.color || '#6366f1') + '20';
    typeBadge.style.color = type.color || '#6366f1';

    const avatarImg = document.getElementById('venViewAvatar');
    const avatarPlaceholder = avatarImg.nextElementSibling;
    const avatarContainer = document.getElementById('venueViewAvatar');
    if (v.photo) { avatarImg.src = v.photo; avatarImg.style.display = 'block'; avatarPlaceholder.style.display = 'none'; }
    else { avatarImg.style.display = 'none'; avatarPlaceholder.style.display = 'flex'; avatarPlaceholder.style.background = `linear-gradient(135deg, ${type.color}, ${type.color}dd)`; }

    const tagsContainer = document.getElementById('venViewTags');
    if (v.tags && v.tags.length > 0) {
        tagsContainer.innerHTML = v.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No features listed</span>';
    }

    const galleryContainer = document.getElementById('venViewGallery');
    if (v.gallery && v.gallery.length > 0) {
        galleryContainer.innerHTML = v.gallery.map(img => `<div class="gallery-item" onclick="openPhotoModal('${img}')"><img src="${img}" alt=""></div>`).join('');
    } else {
        galleryContainer.innerHTML = '<p class="empty-text">No gallery images</p>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('venViewHours');
    availContainer.innerHTML = days.map((d, i) => '<span class="day-badge ' + (v.hours?.[d] ? 'day-active' : 'day-inactive') + '">' + dayLabels[i] + '</span>').join('');

    renderReviewsList('venue', id);
    initStarRating('venueStarRating');
    navigateTo('venue-directory-view');
}

// ==========================================
// VENUE DIRECTORY - CRUD (Provider Page)
// ==========================================
function resetVenueForm() {
    const form = document.getElementById('venueForm');
    if (!form) return;
    form.reset();
    document.getElementById('venueId').value = '';
    document.getElementById('venueFormTitle').textContent = 'Add Venue';
    document.getElementById('venueSubmitBtn').textContent = 'Publish Venue';
    venueTags = [];
    venueGallery = [];
    renderVenueTags();
    renderVenueGalleryUpload();
    document.getElementById('venuePhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
}

function handleVenueSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('venueId').value;
    const now = new Date().toISOString();

    const venue = {
        id: id || generateId(),
        name: document.getElementById('venueName').value,
        category: document.getElementById('venueCategory').value,
        email: document.getElementById('venueEmail').value,
        phone: document.getElementById('venuePhone').value,
        location: document.getElementById('venueLocation').value,
        rate: document.getElementById('venueRate').value,
        capacity: document.getElementById('venueCapacity').value,
        website: document.getElementById('venueWebsite').value,
        bio: document.getElementById('venueBio').value,
        tags: [...venueTags],
        gallery: [...venueGallery],
        photo: document.getElementById('venuePhotoPreview').querySelector('img')?.src || '',
        hours: {
            mon: document.getElementById('venMon').checked,
            tue: document.getElementById('venTue').checked,
            wed: document.getElementById('venWed').checked,
            thu: document.getElementById('venThu').checked,
            fri: document.getElementById('venFri').checked,
            sat: document.getElementById('venSat').checked,
            sun: document.getElementById('venSun').checked
        },
        status: 'active',
        updatedAt: now
    };

    const venues = Storage.getVenues();
    if (id) {
        const idx = venues.findIndex(v => v.id === id);
        if (idx !== -1) { venue.createdAt = venues[idx].createdAt; venues[idx] = venue; }
        showToast('Venue updated successfully!');
    } else {
        venue.createdAt = now;
        venues.push(venue);
        showToast('Venue published successfully!');
    }
    Storage.setVenues(venues);
    navigateTo('provider-venue-directory');
}

function renderVenueListings(filter = 'all') {
    const venues = Storage.getVenues();
    const container = document.getElementById('venueListingsList');
    const countEl = document.getElementById('venueCount');
    if (!container) return;

    const filtered = filter === 'all' ? venues : venues.filter(v => v.category === filter);
    if (countEl) countEl.textContent = venues.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-store"></i><h3>No venues yet</h3><p>Add your first venue to get discovered</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-venue-create')">Add Venue</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((v, i) => {
        const type = VENUE_TYPES[v.category] || {};
        return `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s">
            <div class="list-card-avatar" style="background:${type.color}20; color:${type.color}">
                ${v.photo ? `<img src="${v.photo}" alt="">` : `<i class="fas ${type.icon || 'fa-store'}"></i>`}
            </div>
            <div class="list-card-info">
                <h3>${v.name}</h3>
                <p>${type.label || v.category} &middot; ${v.location}</p>
                <div class="list-card-tags">${(v.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${v.status}">${v.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editVenueById('${v.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteVenue('${v.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterVenueListings() { renderVenueListings(document.getElementById('venueListingFilter').value); }

function editVenueById(id) {
    const venues = Storage.getVenues();
    const v = venues.find(item => item.id === id);
    if (!v) return;
    populateVenueForm(v);
    navigateTo('provider-venue-create');
}

function populateVenueForm(v) {
    document.getElementById('venueId').value = v.id;
    document.getElementById('venueName').value = v.name || '';
    document.getElementById('venueCategory').value = v.category || '';
    document.getElementById('venueEmail').value = v.email || '';
    document.getElementById('venuePhone').value = v.phone || '';
    document.getElementById('venueLocation').value = v.location || '';
    document.getElementById('venueRate').value = v.rate || '';
    document.getElementById('venueCapacity').value = v.capacity || '';
    document.getElementById('venueWebsite').value = v.website || '';
    document.getElementById('venueBio').value = v.bio || '';
    document.getElementById('venueFormTitle').textContent = 'Edit Venue';
    document.getElementById('venueSubmitBtn').textContent = 'Update Venue';

    venueTags = [...(v.tags || [])];
    venueGallery = [...(v.gallery || [])];
    renderVenueTags();
    renderVenueGalleryUpload();

    if (v.hours) {
        document.getElementById('venMon').checked = v.hours.mon || false;
        document.getElementById('venTue').checked = v.hours.tue || false;
        document.getElementById('venWed').checked = v.hours.wed || false;
        document.getElementById('venThu').checked = v.hours.thu || false;
        document.getElementById('venFri').checked = v.hours.fri || false;
        document.getElementById('venSat').checked = v.hours.sat || false;
        document.getElementById('venSun').checked = v.hours.sun || false;
    }

    const preview = document.getElementById('venuePhotoPreview');
    if (v.photo) { preview.innerHTML = `<img src="${v.photo}" alt="">`; }
    else { preview.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>'; }
}

function promptDeleteVenue(id) {
    deleteTarget = { type: 'venue', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this venue listing.';
    document.getElementById('deleteModal').classList.add('active');
}

// ==========================================
// VENUE DIRECTORY - Tags
// ==========================================
function handleVenueTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !venueTags.includes(val)) { venueTags.push(val); renderVenueTags(); }
        e.target.value = '';
    }
}

function addVenueSuggestedTag(tag) {
    if (!venueTags.includes(tag)) { venueTags.push(tag); renderVenueTags(); }
}

function removeVenueTag(index) { venueTags.splice(index, 1); renderVenueTags(); }

function renderVenueTags() {
    const container = document.getElementById('venueTagsDisplay');
    if (!container) return;
    container.innerHTML = venueTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeVenueTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// VENUE DIRECTORY - Gallery
// ==========================================
function addVenueGalleryImage(input) {
    if (input.files && input.files[0] && venueGallery.length < 8) {
        const reader = new FileReader();
        reader.onload = function(e) {
            venueGallery.push(e.target.result);
            renderVenueGalleryUpload();
        };
        reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
}

function removeVenueGalleryImage(index) {
    venueGallery.splice(index, 1);
    renderVenueGalleryUpload();
}

function renderVenueGalleryUpload() {
    const container = document.getElementById('venueGalleryUploadGrid');
    if (!container) return;

    let html = venueGallery.map((img, i) => `
        <div class="gallery-upload-item has-image">
            <img src="${img}" alt="">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeVenueGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    if (venueGallery.length < 8) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('venueGalleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// ADS - BROWSE (General User Page)
// ==========================================
function renderAdsBrowse() {
    const ads = Storage.getAds();
    const container = document.getElementById('adsBrowseList');
    if (!container) return;

    let filtered = ads.filter(a => !a.status || a.status === 'active');

    if (currentAdsFilter !== 'all') {
        filtered = filtered.filter(a => a.category === currentAdsFilter);
    }

    const locationVal = document.getElementById('adsLocationFilter')?.value || '';
    if (locationVal) {
        filtered = filtered.filter(a => a.location && a.location.toLowerCase().includes(locationVal.toLowerCase()));
    }

    const searchVal = (document.getElementById('adsSearch')?.value || '').toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(a =>
            a.title.toLowerCase().includes(searchVal) ||
            a.body.toLowerCase().includes(searchVal) ||
            a.contactName.toLowerCase().includes(searchVal) ||
            (a.tags || []).some(t => t.toLowerCase().includes(searchVal))
        );
    }

    const sortVal = document.getElementById('adsSort')?.value || 'newest';
    filtered.sort((a, b) => {
        if (sortVal === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortVal === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortVal === 'title-asc') return a.title.localeCompare(b.title);
        if (sortVal === 'title-desc') return b.title.localeCompare(a.title);
        return 0;
    });

    document.getElementById('adsCount').textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-bullhorn"></i><h3>No ads found</h3><p>Try adjusting your filters or post a new ad</p></div>`;
        return;
    }

    container.innerHTML = filtered.map((a, i) => {
        const cat = AD_CATEGORIES[a.category] || {};
        const hasPhotos = a.gallery && a.gallery.length > 0;
        return `
        <div class="ad-card" style="animation-delay:${i * 0.05}s" onclick="viewAd('${a.id}')">
            <button class="save-item-btn ${isItemSaved('ad', a.id) ? 'saved' : ''}" data-kind="ad" data-id="${a.id}" onclick="event.stopPropagation(); toggleSaveItem('ad','${a.id}')"><i class="fas ${isItemSaved('ad', a.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
            <div class="ad-card-header">
                <span class="ad-card-category" style="background:${cat.color}20; color:${cat.color}"><i class="fas ${cat.icon || 'fa-tag'}"></i> ${cat.label || a.category}</span>
                <span class="ad-card-date">${formatDate(a.createdAt)}</span>
            </div>
            <h3 class="ad-card-title">${a.title}</h3>
            <p class="ad-card-body">${a.body.length > 120 ? a.body.substring(0, 120) + '...' : a.body}</p>
            <div class="ad-card-meta">
                <span><i class="fas fa-user"></i> ${a.contactName}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${a.location}</span>
                ${hasPhotos ? `<span><i class="fas fa-images"></i> ${a.gallery.length}</span>` : ''}
            </div>
            <div class="ad-card-tags">${(a.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
        </div>`;
    }).join('');
}

function filterAds(type) {
    currentAdsFilter = type;
    document.querySelectorAll('#page-ads-browse .filter-tab').forEach(t => t.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    renderAdsBrowse();
}

function searchAds() { renderAdsBrowse(); }

function viewAd(id) {
    const ads = Storage.getAds();
    const a = ads.find(item => item.id === id);
    if (!a) return;
    currentViewAdId = id;

    const cat = AD_CATEGORIES[a.category] || {};

    document.getElementById('adViewTitle').textContent = a.title;
    document.getElementById('adViewDate').textContent = formatDate(a.createdAt);
    document.getElementById('adViewAuthor').textContent = a.contactName;
    document.getElementById('adViewLocation').textContent = a.location;
    document.getElementById('adViewPhone').textContent = a.phone || '-';
    document.getElementById('adViewPhoneWrap').style.display = a.phone ? 'flex' : 'none';
    document.getElementById('adViewBody').textContent = a.body;

    const typeBadge = document.getElementById('adViewType');
    typeBadge.textContent = cat.label || a.category;
    typeBadge.style.background = (cat.color || '#8a7b55') + '20';
    typeBadge.style.color = cat.color || '#8a7b55';

    const tagsContainer = document.getElementById('adViewTags');
    if (a.tags && a.tags.length > 0) {
        tagsContainer.innerHTML = a.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No tags</span>';
    }

    const galleryContainer = document.getElementById('adViewGallery');
    if (a.gallery && a.gallery.length > 0) {
        galleryContainer.innerHTML = a.gallery.map(img => `<div class="gallery-item" onclick="openPhotoModal('${img}')"><img src="${img}" alt=""></div>`).join('');
    } else {
        galleryContainer.innerHTML = '<p class="empty-text">No photos attached</p>';
    }

    navigateTo('ad-view');
}

// ==========================================
// ADS - CRUD (General User Page)
// ==========================================
function resetAdForm() {
    const form = document.getElementById('adForm');
    if (!form) return;
    form.reset();
    document.getElementById('adId').value = '';
    document.getElementById('adAuthor').value = '';
    document.getElementById('adFormTitle').textContent = 'Post an Ad';
    document.getElementById('adSubmitBtn').textContent = 'Publish Ad';
    adTags = [];
    adGallery = [];
    renderAdTags();
    renderAdGalleryUpload();
}

function handleAdSubmit(e) {
    e.preventDefault();
    if (!requireSignIn('Post an ad.')) return;
    const id = document.getElementById('adId').value;
    const now = new Date().toISOString();

    const ad = {
        id: id || generateId(),
        title: document.getElementById('adTitle').value,
        category: document.getElementById('adCategory').value,
        contactName: document.getElementById('adContactName').value,
        phone: document.getElementById('adPhone').value,
        location: document.getElementById('adLocation').value,
        body: document.getElementById('adBody').value,
        tags: [...adTags],
        gallery: [...adGallery],
        author: document.getElementById('adAuthor').value || 'user-' + Date.now(),
        status: 'active',
        updatedAt: now
    };

    const ads = Storage.getAds();
    if (id) {
        const idx = ads.findIndex(a => a.id === id);
        if (idx !== -1) { ad.createdAt = ads[idx].createdAt; ad.author = ads[idx].author; ads[idx] = ad; }
        showToast('Ad updated successfully!');
    } else {
        ad.createdAt = now;
        ads.push(ad);
        showToast('Ad published successfully!');
    }
    Storage.setAds(ads);
    navigateTo('user-ads');
}

function renderUserAds(filter = 'all') {
    const ads = Storage.getAds();
    const container = document.getElementById('userAdsList');
    if (!container) return;

    const filtered = filter === 'all' ? ads : ads.filter(a => a.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-bullhorn"></i><h3>No ads yet</h3><p>Post your first ad to get started</p><button class="btn btn-primary" onclick="navigateTo('ads-create')">Post Ad</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((a, i) => {
        const cat = AD_CATEGORIES[a.category] || {};
        return `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s">
            <div class="list-card-avatar" style="background:${cat.color}20; color:${cat.color}">
                <i class="fas ${cat.icon || 'fa-tag'}"></i>
            </div>
            <div class="list-card-info">
                <h3>${a.title}</h3>
                <p>${cat.label || a.category} &middot; ${a.location}</p>
                <div class="list-card-tags">${(a.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${a.status}">${a.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editAdById('${a.id}', 'user')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteAd('${a.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterUserAds() { renderUserAds(document.getElementById('userAdsFilter').value); }

function editAdById(id, source) {
    const ads = Storage.getAds();
    const a = ads.find(item => item.id === id);
    if (!a) return;
    if (source === 'provider') {
        populateProviderAdForm(a);
        navigateTo('provider-ads-create');
    } else {
        populateAdForm(a);
        navigateTo('ads-create');
    }
}

function populateAdForm(a) {
    document.getElementById('adId').value = a.id;
    document.getElementById('adTitle').value = a.title || '';
    document.getElementById('adCategory').value = a.category || '';
    document.getElementById('adContactName').value = a.contactName || '';
    document.getElementById('adPhone').value = a.phone || '';
    document.getElementById('adLocation').value = a.location || '';
    document.getElementById('adBody').value = a.body || '';
    document.getElementById('adAuthor').value = a.author || '';
    document.getElementById('adFormTitle').textContent = 'Edit Ad';
    document.getElementById('adSubmitBtn').textContent = 'Update Ad';

    adTags = [...(a.tags || [])];
    adGallery = [...(a.gallery || [])];
    renderAdTags();
    renderAdGalleryUpload();
}

function promptDeleteAd(id) {
    deleteTarget = { type: 'ad', id };
    document.getElementById('deleteModalText').textContent = 'This will permanently delete this ad.';
    document.getElementById('deleteModal').classList.add('active');
}

// ==========================================
// ADS - Tags (User Page)
// ==========================================
function handleAdTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !adTags.includes(val)) { adTags.push(val); renderAdTags(); }
        e.target.value = '';
    }
}

function addAdSuggestedTag(tag) {
    if (!adTags.includes(tag)) { adTags.push(tag); renderAdTags(); }
}

function removeAdTag(index) { adTags.splice(index, 1); renderAdTags(); }

function renderAdTags() {
    const container = document.getElementById('adTagsDisplay');
    if (!container) return;
    container.innerHTML = adTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeAdTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// ADS - Gallery (User Page)
// ==========================================
function addAdGalleryImage(input) {
    if (input.files && input.files[0] && adGallery.length < 4) {
        const reader = new FileReader();
        reader.onload = function(e) {
            adGallery.push(e.target.result);
            renderAdGalleryUpload();
        };
        reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
}

function removeAdGalleryImage(index) {
    adGallery.splice(index, 1);
    renderAdGalleryUpload();
}

function renderAdGalleryUpload() {
    const container = document.getElementById('adGalleryUploadGrid');
    if (!container) return;

    let html = adGallery.map((img, i) => `
        <div class="gallery-upload-item has-image">
            <img src="${img}" alt="">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeAdGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    if (adGallery.length < 4) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('adGalleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// ADS - CRUD (Provider Page)
// ==========================================
function resetProviderAdForm() {
    const form = document.getElementById('providerAdForm');
    if (!form) return;
    form.reset();
    document.getElementById('providerAdId').value = '';
    document.getElementById('providerAdAuthor').value = '';
    document.getElementById('providerAdFormTitle').textContent = 'Post an Ad';
    document.getElementById('providerAdSubmitBtn').textContent = 'Publish Ad';
    providerAdTags = [];
    providerAdGallery = [];
    renderProviderAdTags();
    renderProviderAdGalleryUpload();
}

function handleProviderAdSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('providerAdId').value;
    const now = new Date().toISOString();

    const ad = {
        id: id || generateId(),
        title: document.getElementById('providerAdTitle').value,
        category: document.getElementById('providerAdCategory').value,
        contactName: document.getElementById('providerAdContactName').value,
        phone: document.getElementById('providerAdPhone').value,
        location: document.getElementById('providerAdLocation').value,
        body: document.getElementById('providerAdBody').value,
        tags: [...providerAdTags],
        gallery: [...providerAdGallery],
        author: document.getElementById('providerAdAuthor').value || 'provider-' + Date.now(),
        source: 'provider',
        status: 'active',
        updatedAt: now
    };

    const ads = Storage.getAds();
    if (id) {
        const idx = ads.findIndex(a => a.id === id);
        if (idx !== -1) { ad.createdAt = ads[idx].createdAt; ad.author = ads[idx].author; ads[idx] = ad; }
        showToast('Ad updated successfully!');
    } else {
        ad.createdAt = now;
        ads.push(ad);
        showToast('Ad published successfully!');
    }
    Storage.setAds(ads);
    navigateTo('provider-ads');
}

function renderProviderAds(filter = 'all') {
    const ads = Storage.getAds().filter(a => a.author && (a.author.startsWith('provider') || a.source === 'provider'));
    const container = document.getElementById('providerAdsList');
    if (!container) return;

    const filtered = filter === 'all' ? ads : ads.filter(a => a.category === filter);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-bullhorn"></i><h3>No ads yet</h3><p>Post your first ad to get started</p><button class="btn btn-primary provider-btn" onclick="navigateTo('provider-ads-create')">Post Ad</button></div>`;
        return;
    }

    container.innerHTML = filtered.map((a, i) => {
        const cat = AD_CATEGORIES[a.category] || {};
        return `
        <div class="profile-list-card" style="animation-delay:${i * 0.1}s">
            <div class="list-card-avatar" style="background:${cat.color}20; color:${cat.color}">
                <i class="fas ${cat.icon || 'fa-tag'}"></i>
            </div>
            <div class="list-card-info">
                <h3>${a.title}</h3>
                <p>${cat.label || a.category} &middot; ${a.location}</p>
                <div class="list-card-tags">${(a.tags || []).slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}</div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-${a.status}">${a.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editAdById('${a.id}', 'provider')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteAd('${a.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterProviderAds() { renderProviderAds(document.getElementById('providerAdsFilter').value); }

function populateProviderAdForm(a) {
    document.getElementById('providerAdId').value = a.id;
    document.getElementById('providerAdTitle').value = a.title || '';
    document.getElementById('providerAdCategory').value = a.category || '';
    document.getElementById('providerAdContactName').value = a.contactName || '';
    document.getElementById('providerAdPhone').value = a.phone || '';
    document.getElementById('providerAdLocation').value = a.location || '';
    document.getElementById('providerAdBody').value = a.body || '';
    document.getElementById('providerAdAuthor').value = a.author || '';
    document.getElementById('providerAdFormTitle').textContent = 'Edit Ad';
    document.getElementById('providerAdSubmitBtn').textContent = 'Update Ad';

    providerAdTags = [...(a.tags || [])];
    providerAdGallery = [...(a.gallery || [])];
    renderProviderAdTags();
    renderProviderAdGalleryUpload();
}

// ==========================================
// ADS - Tags (Provider Page)
// ==========================================
function handleProviderAdTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !providerAdTags.includes(val)) { providerAdTags.push(val); renderProviderAdTags(); }
        e.target.value = '';
    }
}

function addProviderAdSuggestedTag(tag) {
    if (!providerAdTags.includes(tag)) { providerAdTags.push(tag); renderProviderAdTags(); }
}

function removeProviderAdTag(index) { providerAdTags.splice(index, 1); renderProviderAdTags(); }

function renderProviderAdTags() {
    const container = document.getElementById('providerAdTagsDisplay');
    if (!container) return;
    container.innerHTML = providerAdTags.map((t, i) => `<span class="tag provider-tag">${t}<button type="button" onclick="removeProviderAdTag(${i})"><i class="fas fa-times"></i></button></span>`).join('');
}

// ==========================================
// ADS - Gallery (Provider Page)
// ==========================================
function addProviderAdGalleryImage(input) {
    if (input.files && input.files[0] && providerAdGallery.length < 4) {
        const reader = new FileReader();
        reader.onload = function(e) {
            providerAdGallery.push(e.target.result);
            renderProviderAdGalleryUpload();
        };
        reader.readAsDataURL(input.files[0]);
    }
    input.value = '';
}

function removeProviderAdGalleryImage(index) {
    providerAdGallery.splice(index, 1);
    renderProviderAdGalleryUpload();
}

function renderProviderAdGalleryUpload() {
    const container = document.getElementById('providerAdGalleryUploadGrid');
    if (!container) return;

    let html = providerAdGallery.map((img, i) => `
        <div class="gallery-upload-item has-image">
            <img src="${img}" alt="">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeProviderAdGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    if (providerAdGallery.length < 4) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('providerAdGalleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// UTILITY - Date Formatter
// ==========================================
function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ==========================================
// SERVICES DIRECTORY
// ==========================================
function renderServicesOwnerBanner() {
    const banner = document.getElementById('servicesOwnerBanner');
    if (!banner) return;
    if (!currentServicesOwnerFilter) {
        banner.style.display = 'none';
        return;
    }
    const name = currentServicesOwnerFilter.name ? String(currentServicesOwnerFilter.name) : 'this provider';
    const title = document.getElementById('servicesOwnerBannerTitle');
    if (title) title.textContent = name;
    banner.style.display = 'flex';
}

function viewProviderServices(owner) {
    currentServicesOwnerFilter = owner || null;
    currentServicesFilter = 'all';
    if (typeof navigateTo === 'function') navigateTo('services-directory');
}

function clearServicesOwnerFilter() {
    currentServicesOwnerFilter = null;
    renderServicesDirectory();
}

function renderServicesDirectory() {
    const services = Storage.getServices();
    const search = (document.getElementById('servicesSearch')?.value || '').toLowerCase();
    const location = document.getElementById('servicesLocationFilter')?.value || '';
    const sortBy = document.getElementById('servicesSort')?.value || 'newest';

    // Re-render filter tabs dynamically
    const filterContainer = document.querySelector('#page-services-directory .filter-tabs');
    if (filterContainer) filterContainer.innerHTML = getServiceTypeFilterHTML();

    renderServicesOwnerBanner();

    let filtered = services.filter(s => {
        if (currentServicesFilter !== 'all' && s.category !== currentServicesFilter) return false;
        if (currentServicesOwnerFilter && !providerItemMatches(s, currentServicesOwnerFilter)) return false;
        if (location && s.location !== location) return false;
        if (search) {
            const searchFields = [s.name, s.email, s.phone, s.location, s.rate, s.bio, s.category, ...(s.tags || []), ...(s.rates || []).map(r => r.label + ' ' + r.amount)].join(' ').toLowerCase();
            if (!searchFields.includes(search)) return false;
        }
        return true;
    });

    if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));

    const container = document.getElementById('servicesDirectoryList');
    const countEl = document.getElementById('servicesDirectoryCount');
    if (countEl) countEl.textContent = filtered.length;

    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-concierge-bell"></i><p>No services found</p><span>Try adjusting your filters</span></div>';
        return;
    }

    container.innerHTML = filtered.map(s => {
        const cat = getServiceTypeBySlug(s.category);
        return `
            <div class="directory-card profile-card-hover" onclick="viewServiceDirectory('${s.id}')">
                <button class="save-item-btn ${isItemSaved('service', s.id) ? 'saved' : ''}" data-kind="service" data-id="${s.id}" onclick="event.stopPropagation(); toggleSaveItem('service','${s.id}')"><i class="fas ${isItemSaved('service', s.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
                <div class="dir-avatar">
                    ${s.coverPhoto
                        ? `<img src="${s.coverPhoto}" alt="${s.name}">`
                        : `<div class="avatar-placeholder"><i class="fas ${cat.icon}"></i></div>`
                    }
                </div>
                <div class="dir-info">
                    <h3>${s.name}</h3>
                    <div class="dir-meta">
                        <span class="badge" style="background: ${cat.color}22; color: ${cat.color}; border: 1px solid ${cat.color}44;">
                            <i class="fas ${cat.icon}"></i> ${cat.label}
                        </span>
                    </div>
                    <div class="dir-meta">
                        <i class="fas fa-map-marker-alt"></i> ${s.location}
                    </div>
                    ${s.rate ? `<div class="dir-meta"><i class="fas fa-tag"></i> ${s.rate}</div>` : ''}
                    <div class="dir-tags">
                        ${(s.tags || []).slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
                        ${(s.tags || []).length > 4 ? `<span class="tag tag-more">+${(s.tags || []).length - 4}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterServicesDirectory(category) {
    currentServicesFilter = category;
    document.querySelectorAll('#page-services-directory .filter-tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderServicesDirectory();
}

function searchServicesDirectory() { renderServicesDirectory(); }

function viewServiceDirectory(id) {
    const services = Storage.getServices();
    const s = services.find(x => x.id === id);
    if (!s) return;
    currentServiceViewId = id;

    const cat = getServiceTypeBySlug(s.category);

    const avatar = document.getElementById('svcViewAvatar');
    if (s.coverPhoto) { avatar.src = s.coverPhoto; avatar.style.display = 'block'; }
    else { avatar.style.display = 'none'; }

    document.getElementById('svcViewName').textContent = s.name;
    const typeBadge = document.getElementById('svcViewType');
    typeBadge.textContent = cat.label;
    typeBadge.style.background = cat.color + '22';
    typeBadge.style.color = cat.color;
    typeBadge.style.border = '1px solid ' + cat.color + '44';
    document.getElementById('svcViewLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${s.location}`;
    document.getElementById('svcViewCategory').textContent = cat.label;
    document.getElementById('svcViewEmail').textContent = s.email || '-';
    document.getElementById('svcViewPhone').textContent = s.phone || '-';
    if (s.rates && s.rates.length) {
        document.getElementById('svcViewRate').innerHTML = s.rates.map(r =>
            (r.label ? `<strong>${escapeHtml(r.label)}</strong> &mdash; ` : '') + escapeHtml(r.amount)
        ).join('<br>');
    } else {
        document.getElementById('svcViewRate').textContent = s.rate || '-';
    }
    document.getElementById('svcViewBio').textContent = s.bio || 'No description provided.';
    const website = document.getElementById('svcViewWebsite');
    if (s.website) { website.href = s.website; website.textContent = s.website; }
    else { website.href = '#'; website.textContent = '-'; }
    renderProfileLinks('svcViewLinks', s.links);

    const tagsContainer = document.getElementById('svcViewTags');
    if (s.tags && s.tags.length) {
        tagsContainer.innerHTML = s.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No specialties listed</span>';
    }

    const gallery = document.getElementById('svcViewGallery');
    if (s.gallery && s.gallery.length) {
        gallery.innerHTML = s.gallery.map((url, i) => `
            <div class="directory-gallery-item" onclick="openPhotoModal('${url}', this)">
                <img src="${url}" alt="Gallery ${i + 1}">
            </div>
        `).join('');
    } else {
        gallery.innerHTML = '<p class="empty-text">No gallery images</p>';
    }

    const avail = document.getElementById('svcViewAvailability');
    if (s.availability) {
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const keys = ['mon','tue','wed','thu','fri','sat','sun'];
        avail.innerHTML = `<div class="availability-grid">${days.map((d, i) => `<div class="day ${s.availability[keys[i]] ? 'active' : 'inactive'}">${d}</div>`).join('')}</div>`;
    } else {
        avail.innerHTML = '<p class="empty-text">No availability set</p>';
    }

    currentActivityOwner = { id: s.ownerId, name: s.ownerName };
    renderProviderActivity('serviceActivityContent', 'experiences');

    navigateTo('service-directory-view');
}

// ==========================================
// SERVICES - PROVIDER CRUD
// ==========================================
function renderProviderServices() {
    const services = Storage.getServices();
    const filter = document.getElementById('providerServicesFilter')?.value || 'all';
    const filtered = filter === 'all' ? services : services.filter(s => s.category === filter);

    // Populate filter dropdown dynamically
    const filterSelect = document.getElementById('providerServicesFilter');
    if (filterSelect && !filterSelect._dynamicPopulated) {
        const types = getAllServiceTypes();
        types.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.slug;
            opt.textContent = t.label;
            filterSelect.appendChild(opt);
        });
        filterSelect._dynamicPopulated = true;
    }

    const container = document.getElementById('providerServicesList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-concierge-bell"></i><p>No services yet</p><span>Add your first service offering</span></div>';
        return;
    }

    container.innerHTML = filtered.map(s => {
        const cat = getServiceTypeBySlug(s.category);
        return `
            <div class="profile-card profile-card-hover">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${s.coverPhoto
                            ? `<img src="${s.coverPhoto}" alt="${s.name}">`
                            : `<div class="avatar-placeholder"><i class="fas ${cat.icon}"></i></div>`
                        }
                    </div>
                    <div class="profile-info">
                        <h3>${s.name}</h3>
                        <span class="badge" style="background: ${cat.color}22; color: ${cat.color}; border: 1px solid ${cat.color}44;">
                            <i class="fas ${cat.icon}"></i> ${cat.label}
                        </span>
                        <p><i class="fas fa-map-marker-alt"></i> ${s.location}</p>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editService('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService('${s.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterProviderServices() { renderProviderServices(); }

function resetServiceForm() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceFormTitle').textContent = 'Add Service';
    document.getElementById('serviceSubmitBtn').textContent = 'Publish Service';
    serviceTags = [];
    serviceGallery = [];
    serviceLinks = [];
    serviceRates = [{ label: '', amount: '' }];
    renderServiceTags();
    renderServiceGalleryUpload();
    renderServiceLinks();
    renderServiceRates();
    const addBtn = document.getElementById('serviceSubmitAddBtn');
    if (addBtn) addBtn.style.display = '';
    renderServicePhotoPreview();
    // Auto-fill category based on most used
    const mostUsed = getMostUsedServiceType();
    if (mostUsed) {
        const catSelect = document.getElementById('serviceCategory');
        if (catSelect) {
            const types = getAllServiceTypes();
            const opt = types.find(t => t.slug === mostUsed);
            if (opt) catSelect.value = mostUsed;
        }
    }
    updateServiceCategorySelect();
}

function updateServiceCategorySelect() {
    const catSelect = document.getElementById('serviceCategory');
    if (!catSelect) return;
    const currentVal = catSelect.value;
    catSelect.innerHTML = getServiceTypeSelectHTML(currentVal);
    catSelect.onchange = function() {
        if (this.value === '__custom__') {
            const name = prompt('Enter new service category name:');
            if (name && name.trim()) {
                const newType = addCustomServiceType(name.trim());
                updateServiceCategorySelect();
                this.value = newType.slug;
            } else {
                this.value = currentVal || '';
            }
        }
    };
}

function renderServicePhotoPreview() {
    const container = document.getElementById('servicePhotoPreview');
    if (!container) return;
    container.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
    container.style.backgroundImage = '';
}

function renderServiceTags() {
    const container = document.getElementById('serviceTagsDisplay');
    if (!container) return;
    container.innerHTML = serviceTags.map((t, i) =>
        `<span class="tag tag-removable" onclick="removeServiceTag(${i})">${t} <i class="fas fa-times"></i></span>`
    ).join('');
}

function removeServiceTag(i) { serviceTags.splice(i, 1); renderServiceTags(); }

function handleServiceTagInput(e) {
    if (e.key === 'Enter') { e.preventDefault(); addServiceTag(e.target.value); e.target.value = ''; }
}

function addServiceTag(value) {
    const t = value.trim();
    if (t && !serviceTags.includes(t)) { serviceTags.push(t); renderServiceTags(); }
}

function addServiceSuggestedTag(value) { addServiceTag(value); }

// ==========================================
// SERVICE - External Links (max 5)
// ==========================================
function addServiceLink() {
    if (serviceLinks.length >= 5) return;
    serviceLinks.push({ label: '', url: '' });
    renderServiceLinks();
}

function removeServiceLink(index) {
    serviceLinks.splice(index, 1);
    renderServiceLinks();
}

function renderServiceLinks() {
    const container = document.getElementById('serviceLinksContainer');
    if (!container) return;
    if (serviceLinks.length === 0) {
        container.innerHTML = '<p style="color:#a99c7e;font-size:0.85rem">No external links added yet.</p>';
        return;
    }
    container.innerHTML = serviceLinks.map((link, i) => `
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
            <input type="text" data-link-label="${i}" value="${escapeHtml(link.label)}" placeholder="Label (e.g. Instagram, X, OnlyFans)" class="form-input" style="flex:1;min-width:120px">
            <input type="url" data-link-url="${i}" value="${escapeHtml(link.url)}" placeholder="https://..." class="form-input" style="flex:2;min-width:180px">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeServiceLink(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function collectServiceLinks() {
    return (serviceLinks || []).map((_, i) => ({
        label: (document.querySelector(`#serviceLinksContainer input[data-link-label="${i}"]`)?.value || '').trim(),
        url: (document.querySelector(`#serviceLinksContainer input[data-link-url="${i}"]`)?.value || '').trim()
    })).filter(l => l.url).slice(0, 5);
}

// ==========================================
// SERVICE - Rates & Pricing (multiple rates)
// ==========================================
function addServiceRate() {
    serviceRates.push({ label: '', amount: '' });
    renderServiceRates();
}

function removeServiceRate(i) {
    serviceRates.splice(i, 1);
    renderServiceRates();
}

function renderServiceRates() {
    const box = document.getElementById('serviceRatesContainer');
    if (!box) return;
    if (serviceRates.length === 0) serviceRates = [{ label: '', amount: '' }];
    box.innerHTML = serviceRates.map((r, i) => `
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
            <input type="text" data-rate-label="${i}" value="${escapeHtml(r.label)}" placeholder="Option (e.g. 60 min session)" class="form-input" style="flex:1;min-width:140px">
            <input type="text" data-rate-amount="${i}" value="${escapeHtml(r.amount)}" placeholder="Amount (e.g. R500)" class="form-input" style="flex:1;min-width:140px">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeServiceRate(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function collectServiceRates() {
    return (serviceRates || []).map((_, i) => ({
        label: (document.querySelector(`#serviceRatesContainer input[data-rate-label="${i}"]`)?.value || '').trim(),
        amount: (document.querySelector(`#serviceRatesContainer input[data-rate-amount="${i}"]`)?.value || '').trim()
    })).filter(r => r.amount);
}

function serviceRatesDisplay(rates) {
    return rates.map(r => (r.label ? r.label + ' \u2014 ' : '') + r.amount).join(' \u00b7 ');
}

function renderServiceGalleryUpload() {
    const container = document.getElementById('serviceGalleryUploadGrid');
    if (!container) return;
    let html = serviceGallery.map((url, i) => `
        <div class="gallery-upload-item has-image" onclick="event.stopPropagation()">
            <img src="${url}" alt="Gallery ${i + 1}">
            <button class="gallery-remove" onclick="event.stopPropagation(); removeServiceGalleryImage(${i})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
    if (serviceGallery.length < 8) {
        html += `<div class="gallery-upload-item" onclick="document.getElementById('serviceGalleryInput').click()"><i class="fas fa-plus"></i><span>Add Photo</span></div>`;
    }
    container.innerHTML = html;
}

function addServiceGalleryImage(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => { serviceGallery.push(e.target.result); renderServiceGalleryUpload(); };
    reader.readAsDataURL(file);
    input.value = '';
}

function removeServiceGalleryImage(i) { serviceGallery.splice(i, 1); renderServiceGalleryUpload(); }

function handleServiceSubmit(e) {
    e.preventDefault();
    submitService(false);
}

function submitService(addAnother) {
    const id = document.getElementById('serviceId').value;
    const rates = collectServiceRates();
    const serviceData = {
        rates,
        rate: serviceRatesDisplay(rates),
        name: document.getElementById('serviceName').value.trim(),
        category: document.getElementById('serviceCategory').value,
        email: document.getElementById('serviceEmail').value.trim(),
        phone: document.getElementById('servicePhone').value.trim(),
        location: document.getElementById('serviceLocation').value,
        bookingFee: parseFloat(document.getElementById('serviceBookingFee')?.value) || null,
        website: document.getElementById('serviceWebsite').value.trim(),
        links: collectServiceLinks(),
        bio: document.getElementById('serviceBio').value.trim(),
        tags: [...serviceTags],
        gallery: [...serviceGallery],
        coverPhoto: document.getElementById('servicePhotoPreview')?.style.backgroundImage?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') || null,
        availability: {
            mon: document.getElementById('svcMon')?.checked || false,
            tue: document.getElementById('svcTue')?.checked || false,
            wed: document.getElementById('svcWed')?.checked || false,
            thu: document.getElementById('svcThu')?.checked || false,
            fri: document.getElementById('svcFri')?.checked || false,
            sat: document.getElementById('svcSat')?.checked || false,
            sun: document.getElementById('svcSun')?.checked || false
        }
    };

    const services = Storage.getServices();
    let createdNew = false;
    if (id) {
        const idx = services.findIndex(s => s.id === id);
        if (idx !== -1) { services[idx] = { ...services[idx], ...serviceData, ownerId: getCurrentProviderIdentity().id, ownerName: getCurrentProviderIdentity().name, updatedAt: new Date().toISOString() }; }
        showToast('Service updated!', 'success');
    } else {
        serviceData.id = generateId();
        serviceData.createdAt = new Date().toISOString();
        serviceData.ownerId = getCurrentProviderIdentity().id;
        serviceData.ownerName = getCurrentProviderIdentity().name;
        services.push(serviceData);
        createdNew = true;
        showToast('Service published!', 'success');
    }
    Storage.setServices(services);
    if (createdNew && addAnother) {
        resetServiceForm();
        return;
    }
    navigateTo('provider-services');
}

function editService(id) {
    const services = Storage.getServices();
    const s = services.find(x => x.id === id);
    if (!s) return;

    navigateTo('provider-service-create');
    document.getElementById('serviceId').value = s.id;
    document.getElementById('serviceFormTitle').textContent = 'Edit Service';
    document.getElementById('serviceSubmitBtn').textContent = 'Update Service';
    document.getElementById('serviceName').value = s.name || '';
    document.getElementById('serviceBio').value = s.bio || '';
    document.getElementById('serviceEmail').value = s.email || '';
    document.getElementById('servicePhone').value = s.phone || '';
    document.getElementById('serviceLocation').value = s.location || '';
    if (s.rates && s.rates.length) {
        serviceRates = JSON.parse(JSON.stringify(s.rates));
    } else if (s.rate) {
        serviceRates = [{ label: '', amount: s.rate }];
    } else {
        serviceRates = [{ label: '', amount: '' }];
    }
    renderServiceRates();
    const addAnother = document.getElementById('serviceSubmitAddBtn');
    if (addAnother) addAnother.style.display = 'none';
    if (document.getElementById('serviceBookingFee')) document.getElementById('serviceBookingFee').value = s.bookingFee ?? '';
    document.getElementById('serviceWebsite').value = s.website || '';

    serviceTags = [...(s.tags || [])];
    serviceGallery = [...(s.gallery || [])];
    serviceLinks = [...(s.links || [])];
    renderServiceTags();
    renderServiceGalleryUpload();
    renderServiceLinks();

    // Set category with dynamic select
    updateServiceCategorySelect();
    document.getElementById('serviceCategory').value = s.category || '';

    if (s.coverPhoto) {
        const preview = document.getElementById('servicePhotoPreview');
        preview.style.backgroundImage = `url(${s.coverPhoto})`;
        preview.innerHTML = '';
    }

    if (s.availability) {
        if (document.getElementById('svcMon')) document.getElementById('svcMon').checked = s.availability.mon;
        if (document.getElementById('svcTue')) document.getElementById('svcTue').checked = s.availability.tue;
        if (document.getElementById('svcWed')) document.getElementById('svcWed').checked = s.availability.wed;
        if (document.getElementById('svcThu')) document.getElementById('svcThu').checked = s.availability.thu;
        if (document.getElementById('svcFri')) document.getElementById('svcFri').checked = s.availability.fri;
        if (document.getElementById('svcSat')) document.getElementById('svcSat').checked = s.availability.sat;
        if (document.getElementById('svcSun')) document.getElementById('svcSun').checked = s.availability.sun;
    }
}

function deleteService(id) {
    deleteTarget = { type: 'service', id: id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Are you sure you want to delete this service? This action cannot be undone.';
    modal.classList.add('active');
}

// ==========================================
// BOOKING MODAL
// ==========================================
function getBookingFeeFor(providerId, providerType) {
    const items = providerType === 'service' ? Storage.getServices() : Storage.getListings();
    const item = items.find(x => x.id === providerId);
    if (item && item.bookingFee != null && item.bookingFee >= 0) return item.bookingFee;
    return (getAdminSettings().bookingFee || 50);
}

function openBookingModal(providerId, providerType) {
    if (!requireSignIn('Request a booking.')) return;
    currentBookingProviderId = providerId;
    currentBookingProviderType = providerType;
    currentBookingFee = getBookingFeeFor(providerId, providerType);
    const feeEl = document.getElementById('bookingFeeDisplay');
    if (feeEl) feeEl.textContent = 'R' + currentBookingFee;
    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.getElementById('bookingForm').reset();
    currentBookingProviderId = null;
    currentBookingProviderType = null;
    currentBookingFee = 0;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    if (!requireSignIn('Send a booking request.')) return;
    const fee = currentBookingFee || getBookingFeeFor(currentBookingProviderId, currentBookingProviderType);
    const booking = {
        id: generateId(),
        providerId: currentBookingProviderId,
        providerType: currentBookingProviderType,
        fee,
        clientOwnerId: currentUserOwnerId(),
        clientName: document.getElementById('bookingClientName').value.trim(),
        clientEmail: document.getElementById('bookingClientEmail').value.trim(),
        clientPhone: document.getElementById('bookingClientPhone').value.trim(),
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        serviceType: document.getElementById('bookingServiceType').value,
        notes: document.getElementById('bookingNotes').value.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Deduct this provider's booking fee from the user wallet and hold it in escrow.
    adjustWallet('user', currentUserOwnerId(), -fee, 'booking-fee', `Booking request sent to provider`, { bookingId: booking.id, providerId: booking.providerId });
    holdBookingFee(booking, fee);

    const bookings = Storage.getBookings();
    bookings.push(booking);
    Storage.setBookings(bookings);
    closeBookingModal();
    showToast(`Booking request sent! R${fee} held in escrow until the provider confirms.`, 'success');
}

// ==========================================
// TIP JAR MODAL
// ==========================================
function openTipModal(providerId, providerType, providerName) {
    if (!requireSignIn('Send a tip.')) return;
    currentBookingProviderId = providerId;
    currentBookingProviderType = providerType;
    document.getElementById('tipProviderName').textContent = providerName;
    document.getElementById('tipModal').classList.add('active');
}

function closeTipModal() {
    document.getElementById('tipModal').classList.remove('active');
    document.getElementById('tipForm').reset();
    currentBookingProviderId = null;
    currentBookingProviderType = null;
}

function setTipAmount(amount) {
    document.getElementById('tipAmount').value = amount;
}

function handleTipSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('tipAmount').value) || 0;
    if (!guardFinancial('tip', amount, 3, 2000)) return;
    if (!(amount > 0) || amount > 50000) { showToast('Please enter a valid amount.', 'error'); return; }
    const tip = {
        id: generateId(),
        providerId: currentBookingProviderId,
        providerType: currentBookingProviderType,
        tipperName: document.getElementById('tipperName').value.trim(),
        tipperEmail: document.getElementById('tipperEmail').value.trim(),
        amount,
        message: document.getElementById('tipMessage').value.trim(),
        createdAt: new Date().toISOString()
    };

    // Deduct from user wallet, credit provider wallet
    adjustWallet('user', currentUserOwnerId(), -tip.amount, 'tip-sent', `Tip sent to provider`, { tipId: tip.id, providerId: tip.providerId });
    adjustWallet('provider', tip.providerId, tip.amount, 'tip-received', `Tip received from ${tip.tipperName}`, { tipId: tip.id, tipperName: tip.tipperName });

    const tips = Storage.getTips();
    tips.push(tip);
    Storage.setTips(tips);
    closeTipModal();
    showToast(`Tip of R${tip.amount.toFixed(2)} sent!`, 'success');
}

// ==========================================
// USER BOOKINGS
// ==========================================
function renderUserBookings() {
    const bookings = Storage.getBookings();
    const filter = document.getElementById('userBookingsFilter')?.value || 'all';
    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('userBookingsList');
    if (!container) return;

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-calendar-check"></i><p>No bookings yet</p><span>Book a provider from the directory</span></div>';
        return;
    }

    container.innerHTML = sorted.map(b => {
        const status = BOOKING_STATUSES[b.status] || BOOKING_STATUSES['pending'];
        const providers = b.providerType === 'service' ? Storage.getServices() : Storage.getListings();
        const provider = providers.find(p => p.id === b.providerId);
        const providerName = provider ? provider.name : 'Unknown Provider';

        return `
            <div class="booking-card profile-card">
                <div class="booking-card-header">
                    <div class="booking-provider">
                        <i class="fas ${b.providerType === 'service' ? 'fa-concierge-bell' : 'fa-user-tie'}"></i>
                        <span>${providerName}</span>
                    </div>
                    <span class="booking-status" style="background:${status.color}22; color:${status.color}; border:1px solid ${status.color}44;">
                        <i class="fas ${status.icon}"></i> ${status.label}
                    </span>
                </div>
                <div class="booking-card-body">
                    <div class="booking-detail"><i class="fas fa-calendar"></i> ${b.date || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-clock"></i> ${b.time || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-tag"></i> ${b.serviceType || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-wallet"></i> Booking Fee: R${b.fee != null ? b.fee : getBookingFeeFor(b.providerId, b.providerType)}</div>
                    ${b.notes ? `<div class="booking-detail booking-notes"><i class="fas fa-comment"></i> ${b.notes}</div>` : ''}
                </div>
                <div class="booking-card-footer">
                    <span class="booking-date">Booked ${formatDate(b.createdAt)}</span>
                    ${b.status === 'pending' ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.id}')"><i class="fas fa-times"></i> Cancel</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function filterUserBookings() { renderUserBookings(); }

function cancelBooking(id) {
    const bookings = Storage.getBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        const fee = (booking.fee != null) ? booking.fee : getBookingFeeFor(booking.providerId, booking.providerType);
        booking.status = 'cancelled';
        Storage.setBookings(bookings);
        refundBookingEscrow(booking, fee, 'Refund for booking cancelled by client');
        showToast('Booking cancelled. Escrowed fee refunded to your wallet.', 'info');
        if (window.location.pathname.includes('provider.html')) {
            renderProviderBookings();
        } else {
            renderUserBookings();
            if (typeof renderUserWallet === 'function') renderUserWallet();
        }
    }
}

// ==========================================
// PROVIDER BOOKINGS
// ==========================================
function renderProviderBookings() {
    const listings = Storage.getListings();
    const services = Storage.getServices();
    const allProviders = [...listings.map(l => ({...l, _type: 'listing'})), ...services.map(s => ({...s, _type: 'service'}))];
    const providerIds = allProviders.map(p => p.id);

    const bookings = Storage.getBookings().filter(b => providerIds.includes(b.providerId));
    const filter = document.getElementById('providerBookingsFilter')?.value || 'all';
    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('providerBookingsList');
    if (!container) return;

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-calendar-check"></i><p>No bookings received</p><span>Bookings from clients will appear here</span></div>';
        return;
    }

    container.innerHTML = sorted.map(b => {
        const status = BOOKING_STATUSES[b.status] || BOOKING_STATUSES['pending'];
        const providers = b.providerType === 'service' ? services : listings;
        const provider = providers.find(p => p.id === b.providerId);
        const providerName = provider ? provider.name : 'Unknown';

        return `
            <div class="booking-card profile-card">
                <div class="booking-card-header">
                    <div class="booking-provider">
                        <i class="fas fa-user"></i>
                        <span>${b.clientName}</span>
                    </div>
                    <span class="booking-status" style="background:${status.color}22; color:${status.color}; border:1px solid ${status.color}44;">
                        <i class="fas ${status.icon}"></i> ${status.label}
                    </span>
                </div>
                <div class="booking-card-body">
                    <div class="booking-detail"><i class="fas fa-building"></i> For: ${providerName}</div>
                    <div class="booking-detail"><i class="fas fa-envelope"></i> ${b.clientEmail}</div>
                    <div class="booking-detail"><i class="fas fa-phone"></i> ${b.clientPhone || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-calendar"></i> ${b.date || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-clock"></i> ${b.time || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-tag"></i> ${b.serviceType || '-'}</div>
                    <div class="booking-detail"><i class="fas fa-wallet"></i> Your Fee: R${b.fee != null ? b.fee : getBookingFeeFor(b.providerId, b.providerType)}</div>
                    ${b.notes ? `<div class="booking-detail booking-notes"><i class="fas fa-comment"></i> ${b.notes}</div>` : ''}
                </div>
                <div class="booking-card-footer">
                    <span class="booking-date">Received ${formatDate(b.createdAt)}</span>
                    <div class="booking-actions">
                        ${b.status === 'pending' ? `
                            <button class="btn btn-primary btn-sm" onclick="updateBookingStatus('${b.id}', 'confirmed')"><i class="fas fa-check"></i> Confirm</button>
                            <button class="btn btn-danger btn-sm" onclick="updateBookingStatus('${b.id}', 'cancelled')"><i class="fas fa-times"></i> Decline</button>
                        ` : ''}
                        ${b.status === 'confirmed' ? `
                            <button class="btn btn-primary btn-sm" onclick="updateBookingStatus('${b.id}', 'completed')"><i class="fas fa-flag-checkered"></i> Complete</button>
                        ` : ''}
                        <button class="btn btn-secondary btn-sm" onclick="deleteBooking('${b.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterProviderBookings() { renderProviderBookings(); }

function updateBookingStatus(id, status) {
    const bookings = Storage.getBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = status;
        Storage.setBookings(bookings);

        // Release the escrowed booking fee to the provider on confirmation.
        if (status === 'confirmed') {
            const providerFee = (booking.fee != null) ? booking.fee : getBookingFeeFor(booking.providerId, booking.providerType);
            booking.fee = providerFee;
            Storage.setBookings(bookings);
            releaseBookingEscrow(booking, providerFee);
        } else if (status === 'cancelled') {
            refundBookingEscrow(booking, booking.fee != null ? booking.fee : 0, `Refund for cancelled booking`);
        }

        showToast(`Booking ${status}.`, 'success');
        renderProviderBookings();
        if (window.location.pathname.includes('provider.html')) {
            renderProviderWallet && renderProviderWallet();
        }
    }
}

function deleteBooking(id) {
    deleteTarget = { type: 'booking', id: id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Are you sure you want to delete this booking? This action cannot be undone.';
    modal.classList.add('active');
}

// ==========================================
// PROVIDER TIPS
// ==========================================
function renderProviderTips() {
    const listings = Storage.getListings();
    const services = Storage.getServices();
    const allProviders = [...listings.map(l => l.id), ...services.map(s => s.id)];

    const tips = Storage.getTips().filter(t => allProviders.includes(t.providerId));
    const sorted = [...tips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalTips = tips.reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalEl = document.getElementById('providerTipsTotal');
    if (totalEl) totalEl.textContent = `R${totalTips.toFixed(2)}`;

    const container = document.getElementById('providerTipsList');
    if (!container) return;

    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-hand-holding-heart"></i><p>No tips received yet</p><span>Tips from supporters will appear here</span></div>';
        return;
    }

    container.innerHTML = sorted.map(t => `
        <div class="tip-card profile-card">
            <div class="tip-card-header">
                <div class="tip-amount">R${(t.amount || 0).toFixed(2)}</div>
                <div class="tip-from"><i class="fas fa-user"></i> ${t.tipperName}</div>
            </div>
            <div class="tip-card-body">
                ${t.message ? `<p class="tip-message">"${t.message}"</p>` : ''}
                <span class="tip-date">${formatDate(t.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

// ==========================================
// WALLET PAGES
// ==========================================
function renderUserWallet() {
    const meId = currentUserOwnerId();
    const wallet = getOrCreateWallet('user', meId);
    document.getElementById('userWalletBalance').textContent = `R${wallet.balance.toFixed(2)}`;
    document.getElementById('userWalletUpdated').textContent = formatDate(wallet.updatedAt);
    const held = wallet.held || 0;
    const heldEl = document.getElementById('userWalletHeld');
    if (heldEl) heldEl.textContent = `R${held.toFixed(2)}`;
    const escrowList = document.getElementById('userWalletEscrow');
    const escrows = Storage.getEscrowFunds().filter(e => e.status === 'held' && e.fromType === 'user' && String(e.fromId) === String(meId));
    if (escrowList) {
        if (escrows.length === 0) {
            escrowList.innerHTML = '<div class="empty-section"><i class="fas fa-lock"></i><p>No funds held in escrow</p><span>Booking fees are securely held until providers confirm.</span></div>';
        } else {
            escrowList.innerHTML = '<div class="profile-card pend-requests-card escrow-card"><h2><i class="fas fa-lock"></i> Escrowed Funds</h2>' +
                escrows.map(es => `
                    <div class="pending-request-row">
                        <div class="pending-request-info">
                            <span class="badge" style="background:#8b5cf622;color:#8b5cf6;border:1px solid #8b5cf644"><i class="fas fa-lock"></i> In Escrow</span>
                            <span><strong>R${es.amount.toFixed(2)}</strong> held for your booking</span>
                        </div>
                        <span class="pending-request-date">Held ${formatDate(es.createdAt)}</span>
                    </div>
                `).join('') + '</div>';
        }
    }
    const activeHeld = getActiveEscrowTotal('user', meId);
    const heldStat = document.getElementById('userWalletHeldStat');
    if (heldStat) heldStat.textContent = `R${activeHeld.toFixed(2)}`;

    const txns = getWalletTransactions('user', meId);
    const income = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const spent = txns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    document.getElementById('userWalletIncome').textContent = `R${income.toFixed(2)}`;
    document.getElementById('userWalletSpent').textContent = `R${spent.toFixed(2)}`;
    document.getElementById('userWalletTxns').textContent = txns.length;

    renderUserAnalytics();

    // Pending top-up requests
    const pendingRequests = Storage.getTopUpRequests().filter(r => r.status === 'pending' && r.ownerType === 'user' && r.ownerId === meId);
    const pendingContainer = document.getElementById('userPendingRequests');
    if (pendingContainer) {
        if (pendingRequests.length === 0) {
            pendingContainer.innerHTML = '';
        } else {
            pendingContainer.innerHTML = '<div class="profile-card pending-requests-card"><h2><i class="fas fa-hourglass-half"></i> Pending Requests</h2>' +
                pendingRequests.map(r => `
                    <div class="pending-request-row">
                        <div class="pending-request-info">
                            <span class="badge" style="background:#f59e0b22;color:#f59e0b;border:1px solid #f59e0b44"><i class="fas fa-clock"></i> Pending</span>
                            <span>Top-up of <strong>R${r.amount.toFixed(2)}</strong></span>
                        </div>
                        <span class="pending-request-date">Submitted ${formatDate(r.createdAt)}</span>
                    </div>
                `).join('') + '</div>';
        }
    }

    const container = document.getElementById('userWalletTransactions');
    if (!container) return;

    if (txns.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-receipt"></i><p>No transactions yet</p><span>Top up your wallet to get started</span></div>';
        return;
    }

    container.innerHTML = txns.map(t => {
        const typeColors = { 'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#10b981', 'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'booking-escrow': '#8b5cf6', 'booking-escrow-released': '#8b5cf6', 'booking-refund': '#06b6d4', 'withdrawal': '#8b5cf6', 'admin-adjust': '#8a7b55', 'refund': '#06b6d4', 'commission': '#f59e0b' };
        const typeLabels = { 'top-up': 'Top Up', 'tip-sent': 'Tip Sent', 'tip-received': 'Tip Received', 'booking-fee': 'Booking Fee', 'booking-confirmed': 'Booking Confirmed', 'booking-escrow': 'In Escrow', 'booking-escrow-released': 'Escrow Released', 'booking-refund': 'Booking Refund', 'withdrawal': 'Withdrawal', 'admin-adjust': 'Admin Adjust', 'refund': 'Refund', 'commission': 'Platform Commission' };
        const color = typeColors[t.type] || '#8a7b55';
        const label = typeLabels[t.type] || t.type;
        return `
            <div class="txn-row">
                <div class="txn-icon" style="background:${color}22; color:${color}"><i class="fas fa-${t.amount >= 0 ? 'arrow-down' : 'arrow-up'}"></i></div>
                <div class="txn-info">
                    <div class="txn-desc">${t.description || label}</div>
                    <div class="txn-meta">${label} &middot; ${formatDate(t.createdAt)}</div>
                </div>
                <div class="txn-amount ${t.amount >= 0 ? 'positive' : 'negative'}">${t.amount >= 0 ? '+' : ''}R${Math.abs(t.amount).toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

function openTopUpModal() { if (!requireSignIn('Top up your wallet.')) return; document.getElementById('topUpModal').classList.add('active'); }
function closeTopUpModal() { document.getElementById('topUpModal').classList.remove('active'); document.getElementById('topUpAmount').value = ''; }
function setTopUpAmount(amt) { document.getElementById('topUpAmount').value = amt; }

function processTopUp() {
    const amount = parseFloat(document.getElementById('topUpAmount').value);
    if (!amount || amount <= 0) { showToast('Enter a valid amount.', 'error'); return; }
    if (!guardFinancial('topup', amount, 1, 4000)) return;
    if (amount > 100000) { showToast('Amount exceeds the single top-up limit.', 'error'); return; }

    const requests = Storage.getTopUpRequests();
    const me = getUserProfilesByAuth()[0] || {};
    const authSnap = (_2k2.Auth && _2k2.Auth.syncUser) ? _2k2.Auth.syncUser() : null;
    requests.push({
        id: generateId(),
        ownerType: 'user',
        ownerId: currentAuthId() || 'general',
        username: me.username || '',
        email: me.email || (authSnap && authSnap.email) || '',
        phone: me.phone || '',
        address: me.location || '',
        amount,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    Storage.setTopUpRequests(requests);
    closeTopUpModal();
    showToast(`Top-up request of R${amount.toFixed(2)} submitted. Awaiting admin approval.`, 'info');
    renderUserWallet();
}

function renderProviderWallet() {
    const providers = [...Storage.getListings().map(l => l.id), ...Storage.getServices().map(s => s.id)];
    let totalBalance = 0;
    let totalIncome = 0;
    let totalWithdrawn = 0;
    let totalTxns = 0;
    let allProviderTxns = [];

    providers.forEach(pid => {
        const wallet = getOrCreateWallet('provider', pid);
        totalBalance += wallet.balance;
        const txns = getWalletTransactions('provider', pid);
        allProviderTxns = allProviderTxns.concat(txns);
        txns.forEach(t => {
            if (t.amount > 0) totalIncome += t.amount;
            else totalWithdrawn += Math.abs(t.amount);
        });
    });
    totalTxns = allProviderTxns.length;

    document.getElementById('providerWalletBalance').textContent = `R${totalBalance.toFixed(2)}`;
    document.getElementById('providerWalletUpdated').textContent = new Date().toLocaleDateString();
    document.getElementById('providerWalletIncome').textContent = `R${totalIncome.toFixed(2)}`;
    document.getElementById('providerWalletWithdrawn').textContent = `R${totalWithdrawn.toFixed(2)}`;
    document.getElementById('providerWalletTxns').textContent = totalTxns;

    renderProviderAnalytics();

    // Pending withdrawal requests
    const pendingRequests = Storage.getWithdrawalRequests().filter(r => r.status === 'pending');
    const pendingContainer = document.getElementById('providerPendingRequests');
    if (pendingContainer) {
        if (pendingRequests.length === 0) {
            pendingContainer.innerHTML = '';
        } else {
            pendingContainer.innerHTML = '<div class="profile-card pending-requests-card"><h2><i class="fas fa-hourglass-half"></i> Pending Withdrawals</h2>' +
                pendingRequests.map(r => `
                    <div class="pending-request-row">
                        <div class="pending-request-info">
                            <span class="badge" style="background:#f59e0b22;color:#f59e0b;border:1px solid #f59e0b44"><i class="fas fa-clock"></i> Pending</span>
                            <span>Withdrawal of <strong>R${r.amount.toFixed(2)}</strong></span>
                        </div>
                        <span class="pending-request-date">Submitted ${formatDate(r.createdAt)}</span>
                    </div>
                `).join('') + '</div>';
        }
    }

    allProviderTxns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('providerWalletTransactions');
    if (!container) return;

    if (allProviderTxns.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-receipt"></i><p>No earnings yet</p><span>Tips and bookings will appear here</span></div>';
        return;
    }

    container.innerHTML = allProviderTxns.slice(0, 30).map(t => {
        const typeColors = { 'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#10b981', 'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'booking-escrow': '#8b5cf6', 'booking-escrow-released': '#8b5cf6', 'booking-refund': '#06b6d4', 'withdrawal': '#8b5cf6', 'admin-adjust': '#8a7b55', 'refund': '#06b6d4', 'commission': '#f59e0b' };
        const typeLabels = { 'top-up': 'Top Up', 'tip-sent': 'Tip Sent', 'tip-received': 'Tip Received', 'booking-fee': 'Booking Fee', 'booking-confirmed': 'Booking Confirmed', 'booking-escrow': 'In Escrow', 'booking-escrow-released': 'Escrow Released', 'booking-refund': 'Booking Refund', 'withdrawal': 'Withdrawal', 'admin-adjust': 'Admin Adjust', 'refund': 'Refund', 'commission': 'Platform Commission' };
        const color = typeColors[t.type] || '#8a7b55';
        const label = typeLabels[t.type] || t.type;
        return `
            <div class="txn-row">
                <div class="txn-icon" style="background:${color}22; color:${color}"><i class="fas fa-${t.amount >= 0 ? 'arrow-down' : 'arrow-up'}"></i></div>
                <div class="txn-info">
                    <div class="txn-desc">${t.description || label}</div>
                    <div class="txn-meta">${label} &middot; ${formatDate(t.createdAt)}</div>
                </div>
                <div class="txn-amount ${t.amount >= 0 ? 'positive' : 'negative'}">${t.amount >= 0 ? '+' : ''}R${Math.abs(t.amount).toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

function openWithdrawModal() {
    const providers = [...Storage.getListings().map(l => l.id), ...Storage.getServices().map(s => s.id)];
    let totalBalance = 0;
    providers.forEach(pid => { totalBalance += getOrCreateWallet('provider', pid).balance; });
    document.getElementById('withdrawAvailable').textContent = `R${totalBalance.toFixed(2)}`;
    document.getElementById('withdrawModal').classList.add('active');
}

function closeWithdrawModal() { document.getElementById('withdrawModal').classList.remove('active'); document.getElementById('withdrawAmount').value = ''; }

function processWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    if (!amount || amount <= 0) { showToast('Enter a valid amount.', 'error'); return; }
    if (!guardFinancial('withdraw', amount, 1, 4000)) return;

    const providers = [...Storage.getListings().map(l => l.id), ...Storage.getServices().map(s => s.id)];
    let totalBalance = 0;
    providers.forEach(pid => { totalBalance += getOrCreateWallet('provider', pid).balance; });

    if (amount > totalBalance) { showToast('Insufficient balance.', 'error'); return; }
    if (amount > 50000) { showToast('Amount exceeds the single withdrawal limit.', 'error'); return; }

    const requests = Storage.getWithdrawalRequests();
    requests.push({
        id: generateId(),
        ownerType: 'provider',
        ownerId: providers[0] || 'unknown',
        amount,
        providerIds: providers,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    Storage.setWithdrawalRequests(requests);
    closeWithdrawModal();
    showToast(`Withdrawal request of R${amount.toFixed(2)} submitted. Awaiting admin approval.`, 'info');
    renderProviderWallet();
}

// ==========================================
// CONTENT DIRECTORY
// ==========================================
let contentTags = [];

function handleContentTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !contentTags.includes(val)) { contentTags.push(val); renderContentTags(); }
        e.target.value = '';
    }
}

function renderContentDirectory() {
    const content = Storage.getContent();
    let filtered = currentContentFilter === 'all' ? [...content] : content.filter(c => c.type === currentContentFilter);

    const search = document.getElementById('contentSearch')?.value?.toLowerCase() || '';
    if (search) filtered = filtered.filter(c => c.title.toLowerCase().includes(search) || c.description.toLowerCase().includes(search) || (c.tags || []).some(t => t.toLowerCase().includes(search)));

    const locationFilter = document.getElementById('contentLocationFilter')?.value || '';
    if (locationFilter) filtered = filtered.filter(c => c.location === locationFilter);

    const sort = document.getElementById('contentSort')?.value || 'newest';
    if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === 'title-asc') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'title-desc') filtered.sort((a, b) => b.title.localeCompare(a.title));

    const countEl = document.getElementById('contentDirectoryCount');
    if (countEl) countEl.textContent = filtered.length;

    // Update filter tabs active state
    document.querySelectorAll('#contentFilterTabs .filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('onclick')?.includes(`'${currentContentFilter}'`));
    });

    const container = document.getElementById('contentDirectoryList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-photo-film"></i><p>No content found</p><span>Check back later for new content</span></div>';
        return;
    }

    container.innerHTML = filtered.map(c => {
        const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#8a7b55' };
        const authorName = resolveProviderAuthorName(c, 'Unknown Creator');
        const hasMedia = c.fileData && c.fileData.length > 100;
        return `
            <div class="content-card profile-card" onclick="viewContent('${c.id}')">
                <button class="save-item-btn ${isItemSaved('content', c.id) ? 'saved' : ''}" data-kind="content" data-id="${c.id}" onclick="event.stopPropagation(); toggleSaveItem('content','${c.id}')"><i class="fas ${isItemSaved('content', c.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
                ${hasMedia ? `<div class="content-card-thumb"><div class="content-thumb-icon" style="background:${type.color}22;color:${type.color}"><i class="fas ${type.icon}"></i></div></div>` : `<div class="content-card-icon" style="background:${type.color}22;color:${type.color}"><i class="fas ${type.icon}"></i></div>`}
                <h3 class="content-card-title">${c.title}</h3>
                <p class="content-card-desc">${(c.description || '').substring(0, 80)}${(c.description || '').length > 80 ? '...' : ''}</p>
                <div class="content-card-footer">
                    <span class="badge" style="background:${type.color}22;color:${type.color};border:1px solid ${type.color}44"><i class="fas ${type.icon}"></i> ${type.label}</span>
                    <span class="content-card-author"><i class="fas fa-user"></i> ${authorName}</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterContentDirectory(type) {
    currentContentFilter = type;
    renderContentDirectory();
}

function searchContentDirectory() { renderContentDirectory(); }

function viewContent(id) {
    const content = Storage.getContent();
    const item = content.find(c => c.id === id);
    if (!item) { showToast('Content not found.', 'error'); return; }

    currentContentViewId = id;
    const type = CONTENT_TYPES[item.type] || { label: item.type, icon: 'fa-file', color: '#8a7b55' };
    const authorName = resolveProviderAuthorName(item, 'Unknown Creator');

    document.getElementById('contentDetailViewType').innerHTML = `<i class="fas ${type.icon}"></i> ${type.label}`;
    document.getElementById('contentDetailViewType').style.background = `${type.color}22`;
    document.getElementById('contentDetailViewType').style.color = type.color;
    document.getElementById('contentDetailViewType').style.border = `1px solid ${type.color}44`;
    document.getElementById('contentDetailViewTitle').textContent = item.title;
    document.getElementById('contentDetailViewDate').textContent = formatDate(item.createdAt);
    document.getElementById('contentDetailViewAuthor').textContent = `By ${authorName}`;
    document.getElementById('contentDetailViewBody').innerHTML = item.description ? `<p>${escapeHtml(item.description).replace(/\n/g, '<br>')}</p>` : '<p class="empty-text">No description</p>';

    // Media player
    const mediaContainer = document.getElementById('contentDetailMedia');
    if (item.fileData && item.fileData.length > 100) {
        if (item.type === 'video') {
            mediaContainer.innerHTML = `<div class="content-media-player"><video controls preload="metadata" class="content-video-player"><source src="${item.fileData}" type="${item.fileType || 'video/mp4'}"></video></div>`;
        } else if (item.type === 'audio' || item.type === 'podcast') {
            mediaContainer.innerHTML = `<div class="content-media-player audio-player"><div class="audio-icon-wrap"><i class="fas fa-headphones"></i></div><audio controls preload="metadata" class="content-audio-player"><source src="${item.fileData}" type="${item.fileType || 'audio/mpeg'}"></audio></div>`;
        } else if (item.type === 'image') {
            mediaContainer.innerHTML = `<div class="content-media-player"><img src="${item.fileData}" alt="${item.title}" class="content-image-player"></div>`;
        } else if (item.type === 'gif') {
            mediaContainer.innerHTML = `<div class="content-media-player"><img src="${item.fileData}" alt="${item.title}" class="content-gif-player"></div>`;
        } else {
            mediaContainer.innerHTML = `<div class="content-media-player"><div class="content-file-download"><i class="fas fa-file"></i><span>Attached file</span><a href="${item.fileData}" download="${item.title}" class="btn btn-primary btn-sm"><i class="fas fa-download"></i> Download</a></div></div>`;
        }
    } else {
        mediaContainer.innerHTML = '';
    }

    // Tags
    const tagsContainer = document.getElementById('contentDetailViewTags');
    if (item.tags && item.tags.length > 0) {
        tagsContainer.innerHTML = item.tags.map(t => `<span class="tag-chip">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '';
    }

    // Reactions
    renderContentReactions(id);

    // Comments
    renderContentComments(id);

    // Reviews
    renderReviewsList('content', id);
    initStarRating('contentStarRating');

    navigateTo('content-view');
}

function downloadContentView() {
    if (!requireSignIn('Download content.')) return;
    const item = Storage.getContent().find(c => c.id === currentContentViewId);
    if (!item) { showToast('Content not found.', 'error'); return; }
    if (!item.fileData || item.fileData.length <= 100) {
        showToast('This content has no downloadable file.', 'error');
        return;
    }
    logDownload({
        kind: 'content',
        itemId: item.id,
        title: item.title,
        sub: (CONTENT_TYPES[item.type] || { label: item.type }).label,
        fileData: item.fileData,
        fileType: item.fileType
    });
}

// ==========================================
// WALLET ANALYTICS
// ==========================================
let userSpendingByTypeChart = null;
let userSpendingOverTimeChart = null;
let providerEarningsByTypeChart = null;
let providerEarningsOverTimeChart = null;
let dashExploreChart = null;
let dashSpendTypeChart = null;
let dashWalletChart = null;

const TYPE_COLORS = {
    'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#f59e0b',
    'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'withdrawal': '#8b5cf6',
    'admin-adjust': '#8a7b55', 'refund': '#06b6d4', 'commission': '#f59e0b'
};

const TYPE_LABELS = {
    'top-up': 'Top Up', 'tip-sent': 'Tips Sent', 'tip-received': 'Tips Received',
    'booking-fee': 'Booking Fees', 'booking-confirmed': 'Booking Income',
    'withdrawal': 'Withdrawals', 'admin-adjust': 'Admin Adjust', 'refund': 'Refunds',
    'commission': 'Platform Commission'
};

function filterTxnsByPeriod(txns, period) {
    if (period === 'all') return txns;
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return txns.filter(t => new Date(t.createdAt) >= cutoff);
}

function renderUserAnalytics() {
    const txns = filterTxnsByPeriod(getWalletTransactions('user', currentUserOwnerId()), document.getElementById('userAnalyticsPeriod')?.value || 'all');
    const spentTxns = txns.filter(t => t.amount < 0);

    const totalSpent = spentTxns.reduce((s, t) => s + Math.abs(t.amount), 0);
    const avgTxn = spentTxns.length > 0 ? totalSpent / spentTxns.length : 0;

    document.getElementById('userAnalyticsTotalSpent').textContent = 'R' + totalSpent.toFixed(0);
    document.getElementById('userAnalyticsAvgTxn').textContent = 'R' + avgTxn.toFixed(0);
    document.getElementById('userAnalyticsTxnCount').textContent = spentTxns.length;

    const typeCounts = {};
    spentTxns.forEach(t => { typeCounts[t.type] = (typeCounts[t.type] || 0) + Math.abs(t.amount); });
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('userAnalyticsTopCategory').textContent = topType ? (TYPE_LABELS[topType[0]] || topType[0]) : '-';

    // Spending by Type (Doughnut)
    const byTypeLabels = Object.keys(typeCounts).map(k => TYPE_LABELS[k] || k);
    const byTypeData = Object.values(typeCounts);
    const byTypeColors = Object.keys(typeCounts).map(k => TYPE_COLORS[k] || '#8a7b55');

    if (userSpendingByTypeChart) userSpendingByTypeChart.destroy();
    const ctx1 = document.getElementById('userSpendingByTypeChart');
    if (ctx1) {
        userSpendingByTypeChart = new Chart(ctx1, {
            type: 'doughnut',
            data: { labels: byTypeLabels, datasets: [{ data: byTypeData, backgroundColor: byTypeColors, borderWidth: 2, borderColor: '#fff' }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '65%',
                plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { size: 12 } } } },
                animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' }
            }
        });
    }

    // Spending Over Time (Line)
    const daily = {};
    spentTxns.forEach(t => {
        const d = new Date(t.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
        daily[d] = (daily[d] || 0) + Math.abs(t.amount);
    });
    const timeLabels = Object.keys(daily);
    const timeData = Object.values(daily);

    if (userSpendingOverTimeChart) userSpendingOverTimeChart.destroy();
    const ctx2 = document.getElementById('userSpendingOverTimeChart');
    if (ctx2) {
        userSpendingOverTimeChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Spending', data: timeData,
                    borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)',
                    fill: true, tension: 0.4, borderWidth: 2.5,
                    pointBackgroundColor: '#ef4444', pointRadius: 4, pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e6dec8' }, ticks: { callback: v => 'R' + v, font: { size: 11 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 11 } } }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    }
}

function renderProviderAnalytics() {
    const providerIds = [...Storage.getListings().map(l => l.id), ...Storage.getServices().map(s => s.id)];
    let allTxns = [];
    providerIds.forEach(pid => { allTxns = allTxns.concat(getWalletTransactions('provider', pid)); });
    const txns = filterTxnsByPeriod(allTxns, document.getElementById('providerAnalyticsPeriod')?.value || 'all');
    const earnedTxns = txns.filter(t => t.amount > 0);

    const totalEarned = earnedTxns.reduce((s, t) => s + t.amount, 0);
    const avgTxn = earnedTxns.length > 0 ? totalEarned / earnedTxns.length : 0;

    document.getElementById('providerAnalyticsTotalEarned').textContent = 'R' + totalEarned.toFixed(0);
    document.getElementById('providerAnalyticsAvgTxn').textContent = 'R' + avgTxn.toFixed(0);
    document.getElementById('providerAnalyticsTxnCount').textContent = earnedTxns.length;

    const typeCounts = {};
    earnedTxns.forEach(t => { typeCounts[t.type] = (typeCounts[t.type] || 0) + t.amount; });
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('providerAnalyticsTopSource').textContent = topType ? (TYPE_LABELS[topType[0]] || topType[0]) : '-';

    // Earnings by Type (Doughnut)
    const byTypeLabels = Object.keys(typeCounts).map(k => TYPE_LABELS[k] || k);
    const byTypeData = Object.values(typeCounts);
    const byTypeColors = Object.keys(typeCounts).map(k => TYPE_COLORS[k] || '#8a7b55');

    if (providerEarningsByTypeChart) providerEarningsByTypeChart.destroy();
    const ctx1 = document.getElementById('providerEarningsByTypeChart');
    if (ctx1) {
        providerEarningsByTypeChart = new Chart(ctx1, {
            type: 'doughnut',
            data: { labels: byTypeLabels, datasets: [{ data: byTypeData, backgroundColor: byTypeColors, borderWidth: 2, borderColor: '#fff' }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '65%',
                plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { size: 12 } } } },
                animation: { animateRotate: true, duration: 1200, easing: 'easeOutQuart' }
            }
        });
    }

    // Earnings Over Time (Line)
    const daily = {};
    earnedTxns.forEach(t => {
        const d = new Date(t.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
        daily[d] = (daily[d] || 0) + t.amount;
    });
    const timeLabels = Object.keys(daily);
    const timeData = Object.values(daily);

    if (providerEarningsOverTimeChart) providerEarningsOverTimeChart.destroy();
    const ctx2 = document.getElementById('providerEarningsOverTimeChart');
    if (ctx2) {
        providerEarningsOverTimeChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Earnings', data: timeData,
                    borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)',
                    fill: true, tension: 0.4, borderWidth: 2.5,
                    pointBackgroundColor: '#10b981', pointRadius: 4, pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e6dec8' }, ticks: { callback: v => 'R' + v, font: { size: 11 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 11 } } }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    }
}

// ==========================================
// SETTINGS
// ==========================================
function getUserSettings() { return JSON.parse(localStorage.getItem('k2_user_settings') || '{}'); }
function setUserSettings(s) { localStorage.setItem('k2_user_settings', JSON.stringify(s)); }
function getProviderSettings() { return JSON.parse(localStorage.getItem('k2_provider_settings') || '{}'); }
function setProviderSettings(s) { localStorage.setItem('k2_provider_settings', JSON.stringify(s)); }
function getAdminSettings() { return JSON.parse(localStorage.getItem('k2_admin_settings') || '{}'); }
function setAdminSettings(s) { localStorage.setItem('k2_admin_settings', JSON.stringify(s)); }

function loadUserSettings() {
    const s = getUserSettings();
    if (document.getElementById('userSettingTheme')) document.getElementById('userSettingTheme').value = s.theme || 'light';
    if (document.getElementById('userSettingVisibility')) document.getElementById('userSettingVisibility').checked = s.visibility !== false;
    if (document.getElementById('userSettingOnlineStatus')) document.getElementById('userSettingOnlineStatus').checked = s.onlineStatus !== false;
    if (document.getElementById('userSettingShowPhone')) document.getElementById('userSettingShowPhone').checked = s.showPhone === true;
    if (document.getElementById('userSettingBookingNotifs')) document.getElementById('userSettingBookingNotifs').checked = s.bookingNotifs !== false;
    if (document.getElementById('userSettingTipNotifs')) document.getElementById('userSettingTipNotifs').checked = s.tipNotifs !== false;
    if (document.getElementById('userSettingEventNotifs')) document.getElementById('userSettingEventNotifs').checked = s.eventNotifs !== false;
    if (document.getElementById('userSettingLanguage')) document.getElementById('userSettingLanguage').value = s.language || 'en';
    if (document.getElementById('userSettingCurrency')) document.getElementById('userSettingCurrency').value = s.currency || 'ZAR';
}

function saveUserSettings() {
    const s = {
        theme: document.getElementById('userSettingTheme')?.value || 'light',
        visibility: document.getElementById('userSettingVisibility')?.checked !== false,
        onlineStatus: document.getElementById('userSettingOnlineStatus')?.checked !== false,
        showPhone: document.getElementById('userSettingShowPhone')?.checked === true,
        bookingNotifs: document.getElementById('userSettingBookingNotifs')?.checked !== false,
        tipNotifs: document.getElementById('userSettingTipNotifs')?.checked !== false,
        eventNotifs: document.getElementById('userSettingEventNotifs')?.checked !== false,
        language: document.getElementById('userSettingLanguage')?.value || 'en',
        currency: document.getElementById('userSettingCurrency')?.value || 'ZAR'
    };
    setUserSettings(s);
    showToast('Settings saved!');
}

function loadProviderSettings() {
    const s = getProviderSettings();
    if (document.getElementById('providerSettingTheme')) document.getElementById('providerSettingTheme').value = s.theme || 'light';
    if (document.getElementById('providerSettingAutoConfirm')) document.getElementById('providerSettingAutoConfirm').checked = s.autoConfirm === true;
    if (document.getElementById('providerSettingBookingWindow')) document.getElementById('providerSettingBookingWindow').value = s.bookingWindow || '14';
    if (document.getElementById('providerSettingRequireDeposit')) document.getElementById('providerSettingRequireDeposit').checked = s.requireDeposit === true;
    if (document.getElementById('providerSettingAvailability')) document.getElementById('providerSettingAvailability').value = s.availability || 'all';
    if (document.getElementById('providerSettingInstantResponse')) document.getElementById('providerSettingInstantResponse').checked = s.instantResponse !== false;
    if (document.getElementById('providerSettingMinPayout')) document.getElementById('providerSettingMinPayout').value = s.minPayout || 100;
    if (document.getElementById('providerSettingPayoutFreq')) document.getElementById('providerSettingPayoutFreq').value = s.payoutFreq || 'monthly';
    if (document.getElementById('providerSettingBookingAlerts')) document.getElementById('providerSettingBookingAlerts').checked = s.bookingAlerts !== false;
    if (document.getElementById('providerSettingTipAlerts')) document.getElementById('providerSettingTipAlerts').checked = s.tipAlerts !== false;
    if (document.getElementById('providerSettingReviewAlerts')) document.getElementById('providerSettingReviewAlerts').checked = s.reviewAlerts !== false;
    if (document.getElementById('providerSettingWalletAlerts')) document.getElementById('providerSettingWalletAlerts').checked = s.walletAlerts !== false;
}

function saveProviderSettings() {
    const s = {
        theme: document.getElementById('providerSettingTheme')?.value || 'light',
        autoConfirm: document.getElementById('providerSettingAutoConfirm')?.checked === true,
        bookingWindow: document.getElementById('providerSettingBookingWindow')?.value || '14',
        requireDeposit: document.getElementById('providerSettingRequireDeposit')?.checked === true,
        availability: document.getElementById('providerSettingAvailability')?.value || 'all',
        instantResponse: document.getElementById('providerSettingInstantResponse')?.checked !== false,
        minPayout: parseInt(document.getElementById('providerSettingMinPayout')?.value) || 100,
        payoutFreq: document.getElementById('providerSettingPayoutFreq')?.value || 'monthly',
        bookingAlerts: document.getElementById('providerSettingBookingAlerts')?.checked !== false,
        tipAlerts: document.getElementById('providerSettingTipAlerts')?.checked !== false,
        reviewAlerts: document.getElementById('providerSettingReviewAlerts')?.checked !== false,
        walletAlerts: document.getElementById('providerSettingWalletAlerts')?.checked !== false
    };
    setProviderSettings(s);
    showToast('Settings saved!');
}

function loadAdminSettings() {
    const s = getAdminSettings();
    if (document.getElementById('adminSettingTheme')) document.getElementById('adminSettingTheme').value = s.theme || 'light';
    if (document.getElementById('adminSettingSidebar')) document.getElementById('adminSettingSidebar').value = s.sidebar || 'expanded';
    if (document.getElementById('adminSettingSiteName')) document.getElementById('adminSettingSiteName').value = s.siteName || '2K2';
    if (document.getElementById('adminSettingBookingFee')) document.getElementById('adminSettingBookingFee').value = s.bookingFee || 50;
    if (document.getElementById('adminSettingMaintenance')) document.getElementById('adminSettingMaintenance').checked = s.maintenance === true;
    if (document.getElementById('adminSettingName')) document.getElementById('adminSettingName').value = s.adminName || 'Administrator';
}

function saveAdminSettings() {
    const s = {
        theme: document.getElementById('adminSettingTheme')?.value || 'light',
        sidebar: document.getElementById('adminSettingSidebar')?.value || 'expanded',
        siteName: document.getElementById('adminSettingSiteName')?.value || '2K2',
        bookingFee: parseInt(document.getElementById('adminSettingBookingFee')?.value) || 50,
        maintenance: document.getElementById('adminSettingMaintenance')?.checked === true,
        adminName: document.getElementById('adminSettingName')?.value || 'Administrator'
    };
    setAdminSettings(s);
    showToast('Settings saved!');
}

// ==========================================
// PROVIDER CONTENT CRUD
// ==========================================
function renderProviderContent() {
    const content = Storage.getContent();
    const filter = document.getElementById('providerContentFilter')?.value || 'all';
    const filtered = filter === 'all' ? [...content] : content.filter(c => c.type === filter);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('providerContentList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-photo-film"></i><p>No content yet</p><span>Create your first content item to get started</span></div>';
        return;
    }

    container.innerHTML = filtered.map(c => {
        const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#8a7b55' };
        return `
            <div class="provider-card profile-card">
                <div class="provider-card-icon" style="background:${type.color}22;color:${type.color}"><i class="fas ${type.icon}"></i></div>
                <div class="provider-card-info">
                    <h3>${c.title}</h3>
                    <span class="provider-card-type"><i class="fas ${type.icon}"></i> ${type.label}</span>
                </div>
                <div class="provider-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editContent('${c.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteContent('${c.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function filterProviderContent() { renderProviderContent(); }

function resetContentForm() {
    document.getElementById('contentFormTitle').textContent = 'New Content';
    document.getElementById('contentSubmitBtn').textContent = 'Publish Content';
    document.getElementById('contentId').value = '';
    document.getElementById('contentTitle').value = '';
    document.getElementById('contentType').value = '';
    document.getElementById('contentDescription').value = '';
    document.getElementById('contentFileData').value = '';
    document.getElementById('contentFileType').value = '';
    document.getElementById('contentFileInput').value = '';
    document.getElementById('contentUploadPreview').style.display = 'none';
    document.getElementById('contentUploadArea').querySelector('.content-upload-placeholder').style.display = '';
    contentTags = [];
    renderContentTags();
}

function handleContentFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 52428800) { showToast('File too large. Max 50MB.', 'error'); input.value = ''; return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('contentFileData').value = e.target.result;
        document.getElementById('contentFileType').value = file.type;
        const preview = document.getElementById('contentUploadPreview');
        const placeholder = document.getElementById('contentUploadArea').querySelector('.content-upload-placeholder');
        placeholder.style.display = 'none';
        preview.style.display = '';
        const type = document.getElementById('contentType').value;
        if (type === 'video') {
            preview.innerHTML = `<video controls preload="metadata" class="content-upload-preview-media"><source src="${e.target.result}" type="${file.type}"></video><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        } else if (type === 'audio' || type === 'podcast') {
            preview.innerHTML = `<div class="content-upload-audio-preview"><i class="fas fa-headphones"></i><audio controls preload="metadata" class="content-upload-preview-media"><source src="${e.target.result}" type="${file.type}"></audio></div><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        } else if (type === 'image' || type === 'gif') {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="content-upload-preview-image"><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        } else {
            preview.innerHTML = `<div class="content-upload-file-preview"><i class="fas fa-file"></i><span>${file.name}</span></div><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        }
    };
    reader.readAsDataURL(file);
}

function clearContentFile() {
    document.getElementById('contentFileData').value = '';
    document.getElementById('contentFileType').value = '';
    document.getElementById('contentFileInput').value = '';
    document.getElementById('contentUploadPreview').style.display = 'none';
    document.getElementById('contentUploadArea').querySelector('.content-upload-placeholder').style.display = '';
}

function renderContentTags() {
    const container = document.getElementById('contentTagsDisplay');
    if (!container) return;
    container.innerHTML = contentTags.map((tag, i) => `<span class="tag-chip removable" onclick="removeContentTag(${i})"><i class="fas fa-times"></i> ${tag}</span>`).join('');
}

function removeContentTag(index) { contentTags.splice(index, 1); renderContentTags(); }

function addContentSuggestedTag(tag) {
    if (!contentTags.includes(tag)) { contentTags.push(tag); renderContentTags(); }
}

function handleContentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('contentId').value;
    const title = document.getElementById('contentTitle').value.trim();
    const type = document.getElementById('contentType').value;
    const location = document.getElementById('contentLocation')?.value || '';
    const description = document.getElementById('contentDescription').value.trim();
    const fileData = document.getElementById('contentFileData').value;
    const fileType = document.getElementById('contentFileType').value;

    if (!title || !type || !description) { showToast('Please fill in all required fields.', 'error'); return; }

    const content = Storage.getContent();
    if (id) {
        const idx = content.findIndex(c => c.id === id);
        if (idx !== -1) {
            content[idx].title = title;
            content[idx].type = type;
            content[idx].location = location;
            content[idx].description = description;
            if (fileData) { content[idx].fileData = fileData; content[idx].fileType = fileType; }
            content[idx].tags = [...contentTags];
            content[idx].updatedAt = new Date().toISOString();
        }
        showToast('Content updated!', 'success');
    } else {
        const owner = getCurrentProviderIdentity();
        content.push({
            id: generateId(),
            title, type, location, description,
            fileData: fileData || '',
            fileType: fileType || '',
            tags: [...contentTags],
            providerId: owner.id,
            ownerId: owner.id,
            ownerName: owner.name,
            createdAt: new Date().toISOString()
        });
        showToast('Content published!', 'success');
    }
    Storage.setContent(content);
    navigateTo('provider-content');
}

function editContent(id) {
    const content = Storage.getContent();
    const item = content.find(c => c.id === id);
    if (!item) return;

    document.getElementById('contentFormTitle').textContent = 'Edit Content';
    document.getElementById('contentSubmitBtn').textContent = 'Save Changes';
    document.getElementById('contentId').value = item.id;
    document.getElementById('contentTitle').value = item.title;
    document.getElementById('contentType').value = item.type;
    document.getElementById('contentLocation').value = item.location || '';
    document.getElementById('contentDescription').value = item.description || '';
    contentTags = [...(item.tags || [])];

    if (item.fileData && item.fileData.length > 100) {
        document.getElementById('contentFileData').value = item.fileData;
        document.getElementById('contentFileType').value = item.fileType || '';
        const preview = document.getElementById('contentUploadPreview');
        const placeholder = document.getElementById('contentUploadArea').querySelector('.content-upload-placeholder');
        placeholder.style.display = 'none';
        preview.style.display = '';
        if (item.type === 'video') {
            preview.innerHTML = `<video controls preload="metadata" class="content-upload-preview-media"><source src="${item.fileData}" type="${item.fileType}"></video><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        } else if (item.type === 'audio' || item.type === 'podcast') {
            preview.innerHTML = `<div class="content-upload-audio-preview"><i class="fas fa-headphones"></i><audio controls preload="metadata" class="content-upload-preview-media"><source src="${item.fileData}" type="${item.fileType}"></audio></div><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        } else if (item.type === 'image' || item.type === 'gif') {
            preview.innerHTML = `<img src="${item.fileData}" alt="Preview" class="content-upload-preview-image"><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        } else {
            preview.innerHTML = `<div class="content-upload-file-preview"><i class="fas fa-file"></i><span>Attached file</span></div><button class="btn btn-danger btn-sm" onclick="clearContentFile()" style="margin-top:8px"><i class="fas fa-times"></i> Remove</button>`;
        }
    }

    renderContentTags();
    navigateTo('provider-content-create');
}

function deleteContent(id) {
    deleteTarget = { type: 'content', id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Are you sure you want to delete this content? This action cannot be undone.';
    modal.classList.add('active');
}

// ==========================================
// CONTENT REACTIONS & COMMENTS
// ==========================================
const REACTION_TYPES = [
    { type: 'like', icon: 'fa-thumbs-up', label: 'Like', color: '#3b82f6' },
    { type: 'love', icon: 'fa-heart', label: 'Love', color: '#ef4444' },
    { type: 'fire', icon: 'fa-fire', label: 'Fire', color: '#f97316' },
    { type: 'laugh', icon: 'fa-face-laugh-beam', label: 'Haha', color: '#f59e0b' },
    { type: 'wow', icon: 'fa-face-surprise', label: 'Wow', color: '#8b5cf6' },
    { type: 'sad', icon: 'fa-face-sad-tear', label: 'Sad', color: '#8a7b55' }
];

function renderContentReactions(contentId) {
    const reactions = Storage.getContentReactions().filter(r => r.contentId === contentId);
    const bar = document.getElementById('contentReactionsBar');
    if (!bar) return;

    const counts = {};
    REACTION_TYPES.forEach(r => { counts[r.type] = 0; });
    reactions.forEach(r => { if (counts[r.type] !== undefined) counts[r.type]++; });

    bar.innerHTML = `<div class="reactions-row">${REACTION_TYPES.map(r => {
        const count = counts[r.type];
        return `<button class="reaction-btn" style="--reaction-color:${r.color}" onclick="toggleContentReaction('${contentId}','${r.type}')" title="${r.label}"><i class="fas ${r.icon}"></i>${count > 0 ? `<span class="reaction-count">${count}</span>` : ''}</button>`;
    }).join('')}</div>`;
}

function toggleContentReaction(contentId, type) {
    const reactions = Storage.getContentReactions();
    const existing = reactions.find(r => r.contentId === contentId && r.type === type);
    if (existing) {
        const idx = reactions.indexOf(existing);
        reactions.splice(idx, 1);
    } else {
        reactions.push({ id: generateId(), contentId, type, createdAt: new Date().toISOString() });
    }
    Storage.setContentReactions(reactions);
    renderContentReactions(contentId);
}

function renderContentComments(contentId) {
    const comments = Storage.getContentComments().filter(c => c.contentId === contentId);
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const countEl = document.getElementById('contentCommentCount');
    if (countEl) countEl.textContent = `(${comments.length})`;

    const list = document.getElementById('contentCommentsList');
    if (!list) return;

    if (comments.length === 0) {
        list.innerHTML = '<p class="empty-text" style="padding:12px 0;font-size:0.85rem">No comments yet. Be the first!</p>';
        return;
    }

    list.innerHTML = comments.map(c => `
        <div class="comment-item">
            <div class="comment-avatar"><i class="fas fa-user"></i></div>
            <div class="comment-body">
                <div class="comment-header">
                    <span class="comment-author">${c.authorName || 'Anonymous'}</span>
                    <span class="comment-time">${formatDate(c.createdAt)}</span>
                </div>
                <p class="comment-text">${c.text}</p>
            </div>
        </div>
    `).join('');
}

function submitContentComment() {
    if (!requireSignIn('Comment on content.')) return;
    const input = document.getElementById('contentCommentInput');
    const text = input.value.trim();
    if (!text) return;

    const comments = Storage.getContentComments();
    comments.push({
        id: generateId(),
        contentId: currentContentViewId,
        text,
        authorName: 'General User',
        createdAt: new Date().toISOString()
    });
    Storage.setContentComments(comments);
    input.value = '';
    renderContentComments(currentContentViewId);
    showToast('Comment posted!');
}

function shareContent() {
    if (navigator.share) {
        navigator.share({ title: '2K2 Content', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
    }
}

// ==========================================
// REVIEW / RATING SYSTEM
// ==========================================
function initStarRating(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const stars = container.querySelectorAll('.fa-star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.star);
            container.dataset.rating = rating;
            stars.forEach((s, i) => { s.classList.toggle('active', i < rating); });
        });
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.star);
            stars.forEach((s, i) => { s.classList.toggle('hover', i < rating); });
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}

function getReviewsForTarget(targetType, targetId) {
    return Storage.getReviews().filter(r => r.targetType === targetType && r.targetId === targetId);
}

function getAverageRating(targetType, targetId) {
    const reviews = getReviewsForTarget(targetType, targetId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}

function getRatingBadgeHtml(targetType, targetId) {
    const { avg, count } = getAverageRating(targetType, targetId);
    if (count === 0) return '';
    return `<span class="rating-badge"><i class="fas fa-star"></i> ${avg} <span class="rating-badge-count">(${count})</span></span>`;
}

function renderReviewsList(targetType, targetId) {
    const reviews = getReviewsForTarget(targetType, targetId);
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const summaryEl = document.getElementById(targetType + 'ReviewSummary');
    const listEl = document.getElementById(targetType + 'ReviewsList');

    if (summaryEl) {
        const { avg, count } = getAverageRating(targetType, targetId);
        if (count === 0) {
            summaryEl.innerHTML = '<p class="empty-text">No reviews yet. Be the first!</p>';
        } else {
            const starsHtml = Array.from({length: 5}, (_, i) => '<i class="fas fa-star" style="color:' + (i < Math.round(avg) ? '#f59e0b' : '#e2e8f0') + '"></i>').join('');
            summaryEl.innerHTML = '<div class="review-average"><span class="review-avg-number">' + avg + '</span><div class="review-avg-stars">' + starsHtml + '</div><span class="review-avg-count">' + count + ' review' + (count !== 1 ? 's' : '') + '</span></div>';
        }
    }

    if (listEl) {
        if (reviews.length === 0) {
            listEl.innerHTML = '';
        } else {
            listEl.innerHTML = reviews.map(r => {
                const stars = Array.from({length: 5}, (_, i) => '<i class="fas fa-star" style="color:' + (i < r.rating ? '#f59e0b' : '#e2e8f0') + '"></i>').join('');
                return '<div class="review-item"><div class="review-item-header"><div class="review-item-stars">' + stars + '</div><span class="review-item-author">' + (r.authorName || 'Anonymous') + '</span><span class="review-item-date">' + formatDate(r.createdAt) + '</span></div><p class="review-item-text">' + r.text + '</p></div>';
            }).join('');
        }
    }
}

function submitReview(targetType, targetId) {
    if (!requireSignIn('Leave a review.')) return;
    const container = document.getElementById(targetType + 'StarRating');
    const textEl = document.getElementById(targetType + 'ReviewText');
    if (!container || !textEl) return;

    const rating = parseInt(container.dataset.rating);
    const text = textEl.value.trim();

    if (!rating || rating < 1) { showToast('Please select a star rating.', 'error'); return; }
    if (!text) { showToast('Please write a review.', 'error'); return; }

    const reviews = Storage.getReviews();
    reviews.push({
        id: generateId(),
        targetType: targetType,
        targetId: targetId,
        rating: rating,
        text: text,
        authorName: 'General User',
        flagged: false,
        createdAt: new Date().toISOString()
    });
    Storage.setReviews(reviews);

    container.dataset.rating = 0;
    container.querySelectorAll('.fa-star').forEach(s => { s.classList.remove('active'); s.classList.remove('hover'); });
    textEl.value = '';

    renderReviewsList(targetType, targetId);
    showToast('Review submitted!');
}

// ==========================================
// EVENTS DIRECTORY
// ==========================================
let eventTags = [];

function handleEventTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !eventTags.includes(val)) { eventTags.push(val); renderEventTags(); }
        e.target.value = '';
    }
}

function renderEventTags() {
    const container = document.getElementById('eventTagsDisplay');
    if (!container) return;
    container.innerHTML = eventTags.map((t, i) => `<span class="tag-chip removable" onclick="removeEventTag(${i})"><i class="fas fa-times"></i> ${t}</span>`).join('');
}

function removeEventTag(index) { eventTags.splice(index, 1); renderEventTags(); }

function addEventSuggestedTag(tag) {
    if (!eventTags.includes(tag)) { eventTags.push(tag); renderEventTags(); }
}

function renderEventsDirectory() {
    const events = Storage.getEvents();
    let filtered = currentEventFilter === 'all' ? [...events] : events.filter(e => e.type === currentEventFilter);

    const search = document.getElementById('eventSearch')?.value?.toLowerCase() || '';
    if (search) filtered = filtered.filter(e => e.name.toLowerCase().includes(search) || e.description.toLowerCase().includes(search) || e.venue?.toLowerCase().includes(search) || (e.tags || []).some(t => t.toLowerCase().includes(search)));

    const province = document.getElementById('eventProvince')?.value || '';
    if (province) filtered = filtered.filter(e => e.province === province || e.location === province);

    const sort = document.getElementById('eventSort')?.value || 'newest';
    if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'date-asc') filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    else if (sort === 'title-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    const countEl = document.getElementById('eventsDirectoryCount');
    if (countEl) countEl.textContent = filtered.length;

    document.querySelectorAll('#eventFilterTabs .filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('onclick')?.includes(`'${currentEventFilter}'`));
    });

    const container = document.getElementById('eventsDirectoryList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-calendar-days"></i><p>No events found</p><span>Check back later for upcoming events</span></div>';
        return;
    }

    container.innerHTML = filtered.map(ev => {
        const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#8a7b55' };
        const authorName = resolveProviderAuthorName(ev, 'Unknown Host');
        const eventDate = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
        return `
            <div class="content-card profile-card event-grid-card" onclick="viewEvent('${ev.id}')">
                <button class="save-item-btn ${isItemSaved('event', ev.id) ? 'saved' : ''}" data-kind="event" data-id="${ev.id}" onclick="event.stopPropagation(); toggleSaveItem('event','${ev.id}')"><i class="fas ${isItemSaved('event', ev.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
                <div class="content-card-thumb event-card-thumb" style="background:linear-gradient(135deg, ${type.color}22, ${type.color}08)">
                    <div class="content-thumb-icon" style="background:${type.color}22;color:${type.color}"><i class="fas ${type.icon}"></i></div>
                    ${ev.eventDate ? `<div class="event-card-date-badge"><span class="event-date-day">${new Date(ev.eventDate).getDate()}</span><span class="event-date-month">${new Date(ev.eventDate).toLocaleDateString('en-ZA', { month: 'short' })}</span></div>` : ''}
                </div>
                <h3 class="content-card-title">${ev.name}</h3>
                <div class="event-card-info">
                    ${ev.eventTime ? `<span><i class="fas fa-clock"></i> ${ev.eventTime}</span>` : ''}
                    ${ev.venue ? `<span><i class="fas fa-location-dot"></i> ${ev.venue}</span>` : ''}
                </div>
                <p class="content-card-desc">${(ev.description || '').substring(0, 70)}${(ev.description || '').length > 70 ? '...' : ''}</p>
                <div class="content-card-footer">
                    <span class="badge" style="background:${type.color}22;color:${type.color};border:1px solid ${type.color}44"><i class="fas ${type.icon}"></i> ${type.label}</span>
                    <span class="content-card-author"><i class="fas fa-user"></i> ${authorName}</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterEventsDirectory(type) {
    currentEventFilter = type;
    renderEventsDirectory();
}

function searchEventsDirectory() { renderEventsDirectory(); }

function viewEvent(id) {
    const events = Storage.getEvents();
    const ev = events.find(e => e.id === id);
    if (!ev) { showToast('Event not found.', 'error'); return; }

    currentEventViewId = id;
    const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#8a7b55' };
    const authorName = resolveProviderAuthorName(ev, 'Unknown Host');

    document.getElementById('eventDetailViewType').innerHTML = `<i class="fas ${type.icon}"></i> ${type.label}`;
    document.getElementById('eventDetailViewType').style.background = `${type.color}22`;
    document.getElementById('eventDetailViewType').style.color = type.color;
    document.getElementById('eventDetailViewType').style.border = `1px solid ${type.color}44`;
    document.getElementById('eventDetailViewTitle').textContent = ev.name;
    document.getElementById('eventDetailViewDate').textContent = formatDate(ev.createdAt);

    const eventDateStr = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
    document.getElementById('eventDetailViewMeta').innerHTML = `
        <div class="event-meta-grid">
            ${eventDateStr ? `<div class="event-meta-item"><i class="fas fa-calendar"></i><span>${eventDateStr}</span></div>` : ''}
            ${ev.eventTime ? `<div class="event-meta-item"><i class="fas fa-clock"></i><span>${ev.eventTime}</span></div>` : ''}
            ${ev.venue ? `<div class="event-meta-item"><i class="fas fa-location-dot"></i><span>${ev.venue}${ev.province ? ', ' + ev.province : ''}</span></div>` : ''}
            ${ev.fee ? `<div class="event-meta-item"><i class="fas fa-ticket"></i><span>${ev.fee}</span></div>` : ''}
            ${ev.dressCode ? `<div class="event-meta-item"><i class="fas fa-shirt"></i><span>${ev.dressCode}</span></div>` : ''}
            <div class="event-meta-item"><i class="fas fa-user"></i><span>Hosted by ${authorName}</span></div>
        </div>
    `;
    document.getElementById('eventDetailViewBody').innerHTML = ev.description ? `<p>${escapeHtml(ev.description).replace(/\n/g, '<br>')}</p>` : '<p class="empty-text">No description</p>';

    const tagsContainer = document.getElementById('eventDetailViewTags');
    if (ev.tags && ev.tags.length > 0) {
        tagsContainer.innerHTML = ev.tags.map(t => `<span class="tag-chip">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '';
    }

    renderReviewsList('event', id);
    initStarRating('eventStarRating');
    navigateTo('event-view');
}

// ==========================================
// PROVIDER EVENTS CRUD
// ==========================================
function renderProviderEvents() {
    const events = Storage.getEvents();
    const filter = document.getElementById('providerEventFilter')?.value || 'all';
    const filtered = filter === 'all' ? [...events] : events.filter(e => e.type === filter);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('providerEventsList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-section"><i class="fas fa-calendar-days"></i><p>No events yet</p><span>Create your first event to get started</span></div>';
        return;
    }

    container.innerHTML = filtered.map(ev => {
        const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#8a7b55' };
        const eventDateStr = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : '';
        return `
            <div class="provider-card profile-card">
                <div class="provider-card-icon" style="background:${type.color}22;color:${type.color}"><i class="fas ${type.icon}"></i></div>
                <div class="provider-card-info">
                    <h3>${ev.name}</h3>
                    <span class="provider-card-type"><i class="fas ${type.icon}"></i> ${type.label}${eventDateStr ? ' &middot; ' + eventDateStr : ''}</span>
                </div>
                <div class="provider-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editEvent('${ev.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEvent('${ev.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function filterProviderEvents() { renderProviderEvents(); }

function resetEventForm() {
    document.getElementById('eventFormTitle').textContent = 'New Event';
    document.getElementById('eventSubmitBtn').textContent = 'Publish Event';
    document.getElementById('eventId').value = '';
    document.getElementById('eventName').value = '';
    document.getElementById('eventType').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventVenue').value = '';
    document.getElementById('eventProvinceForm').value = '';
    document.getElementById('eventFee').value = '';
    document.getElementById('eventDressCode').value = '';
    document.getElementById('eventDescription').value = '';
    eventTags = [];
    renderEventTags();
}

function handleEventSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('eventId').value;
    const name = document.getElementById('eventName').value.trim();
    const type = document.getElementById('eventType').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const venue = document.getElementById('eventVenue').value.trim();
    const province = document.getElementById('eventProvinceForm').value;
    const fee = document.getElementById('eventFee').value.trim();
    const dressCode = document.getElementById('eventDressCode').value.trim();
    const description = document.getElementById('eventDescription').value.trim();

    if (!name || !type || !eventDate || !eventTime || !venue || !province || !description) { showToast('Please fill in all required fields.', 'error'); return; }

    const events = Storage.getEvents();
    if (id) {
        const idx = events.findIndex(ev => ev.id === id);
        if (idx !== -1) {
            events[idx].name = name;
            events[idx].type = type;
            events[idx].eventDate = eventDate;
            events[idx].eventTime = eventTime;
            events[idx].venue = venue;
            events[idx].province = province;
            events[idx].fee = fee;
            events[idx].dressCode = dressCode;
            events[idx].description = description;
            events[idx].tags = [...eventTags];
            events[idx].updatedAt = new Date().toISOString();
        }
        showToast('Event updated!', 'success');
    } else {
        const owner = getCurrentProviderIdentity();
        events.push({
            id: generateId(),
            name, type, eventDate, eventTime, venue, province, fee, dressCode, description,
            tags: [...eventTags],
            providerId: owner.id,
            ownerId: owner.id,
            ownerName: owner.name,
            createdAt: new Date().toISOString()
        });
        showToast('Event published!', 'success');
    }
    Storage.setEvents(events);
    navigateTo('provider-events');
}

function editEvent(id) {
    const events = Storage.getEvents();
    const ev = events.find(e => e.id === id);
    if (!ev) return;

    document.getElementById('eventFormTitle').textContent = 'Edit Event';
    document.getElementById('eventSubmitBtn').textContent = 'Save Changes';
    document.getElementById('eventId').value = ev.id;
    document.getElementById('eventName').value = ev.name;
    document.getElementById('eventType').value = ev.type;
    document.getElementById('eventDate').value = ev.eventDate || '';
    document.getElementById('eventTime').value = ev.eventTime || '';
    document.getElementById('eventVenue').value = ev.venue || '';
    document.getElementById('eventProvinceForm').value = ev.province || '';
    document.getElementById('eventFee').value = ev.fee || '';
    document.getElementById('eventDressCode').value = ev.dressCode || '';
    document.getElementById('eventDescription').value = ev.description || '';
    eventTags = [...(ev.tags || [])];
    renderEventTags();
    navigateTo('provider-event-create');
}

function deleteEvent(id) {
    deleteTarget = { type: 'event', id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Are you sure you want to delete this event? This action cannot be undone.';
    modal.classList.add('active');
}

// ==========================================
// FORUM SYSTEM
// ==========================================
const FORUM_CATEGORIES = {
    'hookups': { label: 'Hookups', icon: 'fa-fire', color: '#ef4444', section: 'public' },
    'fetishes': { label: 'Fetishes', icon: 'fa-mask', color: '#8b5cf6', section: 'public' },
    'swingers': { label: 'Swingers', icon: 'fa-people-arrows', color: '#ec4899', section: 'public' },
    'clubs': { label: 'Clubs', icon: 'fa-champagne-glasses', color: '#f59e0b', section: 'public' },
    'bdsm': { label: 'BDSM', icon: 'fa-link', color: '#6366f1', section: 'public' },
    'group-action': { label: 'Group Action', icon: 'fa-users', color: '#10b981', section: 'public' },
    'general': { label: 'General Discussion', icon: 'fa-comments', color: '#3b82f6', section: 'public' },
    'events': { label: 'Events', icon: 'fa-calendar-days', color: '#0ea5e9', section: 'public' },
    'tips': { label: 'Tips & Tricks', icon: 'fa-lightbulb', color: '#10b981', section: 'public' },
    'newcomers': { label: 'New Members', icon: 'fa-hand-wave', color: '#f59e0b', section: 'public' },
    'offtopic': { label: 'Off-Topic', icon: 'fa-ellipsis', color: '#8a7b55', section: 'public' },
    'premium-exclusive': { label: 'Exclusive Content', icon: 'fa-gem', color: '#d946ef', section: 'premium' },
    'premium-events': { label: 'Premium Events', icon: 'fa-star', color: '#f59e0b', section: 'premium' },
    'premium-providers': { label: 'VIP Providers', icon: 'fa-crown', color: '#d97706', section: 'premium' },
    'premium-safety': { label: 'Safety & Verified', icon: 'fa-shield-halved', color: '#10b981', section: 'premium' },
    'premium-lounge': { label: 'VIP Lounge', icon: 'fa-martini-glass-citrus', color: '#6366f1', section: 'premium' },
    'premium-marketplace': { label: 'Premium Marketplace', icon: 'fa-store', color: '#ec4899', section: 'premium' }
};

const FORUM_EMOJIS = [
    '😀','😂','😍','🥰','😘','😎','🤩','🥳','😏','😴',
    '🤔','😱','🤗','😇','🙃','🙄','😬','🤯','🤭','🤫',
    '👍','👎','👏','🙌','🤝','💪','🫶','❤️','🔥','💯',
    '🎉','🎊','⭐','✨','💎','👑','🏆','🥂','🍾','💫',
    '😍','🥰','😘','💋','👄','👅','🍑','🍆','🥵','🥶',
    '😈','👿','💀','👻','🎃','🖤','💜','💙','💚','💛',
    '🌹','🌺','🌸','💐','🎵','🎶','🎬','📸','📱','💬'
];

const FORUM_PUBLIC_CATS = ['hookups','fetishes','swingers','clubs','bdsm','group-action','general','events','tips','newcomers','offtopic'];
const FORUM_PREMIUM_CATS = ['premium-exclusive','premium-events','premium-providers','premium-safety','premium-lounge','premium-marketplace'];

let currentForumFilter = 'all';
let currentForumSection = 'public';
let currentForumViewId = null;
let currentEmojiTarget = null;
let currentForumProvince = '';

function switchForumSection(section) {
    currentForumSection = section;
    currentForumFilter = 'all';
    currentForumProvince = '';
    const provinceSelect = document.getElementById('forumProvinceFilter');
    if (provinceSelect) provinceSelect.value = '';
    document.querySelectorAll('.forum-main-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.forum-main-tab')?.classList.add('active');
    updateForumSubTabs();
    renderForumThreads();
}

function updateForumSubTabs() {
    const tabs = document.getElementById('forumSubTabs');
    if (!tabs) return;
    const cats = currentForumSection === 'premium' ? FORUM_PREMIUM_CATS : FORUM_PUBLIC_CATS;
    tabs.innerHTML = `<button class="filter-tab active" onclick="filterForum('all')"><i class="fas fa-globe"></i> All</button>` +
        cats.map(key => {
            const cat = FORUM_CATEGORIES[key];
            return `<button class="filter-tab" onclick="filterForum('${key}')"><i class="fas ${cat.icon}"></i> ${cat.label}</button>`;
        }).join('');
}

function updateForumCategoryOptions() {
    const section = document.getElementById('forumThreadSectionSelect')?.value || '';
    const catSelect = document.getElementById('forumThreadCategory');
    const sectionInput = document.getElementById('forumThreadSection');
    if (!catSelect) return;
    if (sectionInput) sectionInput.value = section;
    const cats = section === 'premium' ? FORUM_PREMIUM_CATS : FORUM_PUBLIC_CATS;
    catSelect.innerHTML = '<option value="">Select category</option>' +
        cats.map(key => {
            const cat = FORUM_CATEGORIES[key];
            return `<option value="${key}">${cat.label}</option>`;
        }).join('');
}

function toggleEmojiPicker(targetId) {
    currentEmojiTarget = targetId;
    let picker = document.getElementById('forumEmojiPicker');
    if (picker) {
        picker.remove();
        return;
    }
    picker = document.createElement('div');
    picker.id = 'forumEmojiPicker';
    picker.className = 'forum-emoji-picker';
    picker.innerHTML = `<div class="emoji-grid">${FORUM_EMOJIS.map(e => `<button type="button" class="emoji-btn" onclick="insertEmoji('${e}')">${e}</button>`).join('')}</div>`;
    const target = document.getElementById(targetId);
    if (target) {
        target.parentElement.style.position = 'relative';
        target.parentElement.appendChild(picker);
    }
}

function insertEmoji(emoji) {
    const ta = document.getElementById(currentEmojiTarget);
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + emoji + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + emoji.length;
    ta.focus();
    const picker = document.getElementById('forumEmojiPicker');
    if (picker) picker.remove();
}

function insertGistFormat(type, targetId) {
    const ta = document.getElementById(targetId || 'forumThreadBody');
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    let before = '', after = '', replacement = '';
    switch (type) {
        case 'bold': before = '**'; after = '**'; replacement = selected || 'bold text'; break;
        case 'italic': before = '*'; after = '*'; replacement = selected || 'italic text'; break;
        case 'underline': before = '__'; after = '__'; replacement = selected || 'underlined'; break;
        case 'strikethrough': before = '~~'; after = '~~'; replacement = selected || 'strikethrough'; break;
        case 'quote': before = '\n> '; after = ''; replacement = selected || 'quoted text'; break;
        case 'code': before = '`'; after = '`'; replacement = selected || 'code'; break;
        case 'link': before = '['; after = '](https://)'; replacement = selected || 'link text'; break;
        case 'list': before = '\n- '; after = ''; replacement = selected || 'list item'; break;
    }
    ta.value = ta.value.substring(0, start) + before + replacement + after + ta.value.substring(end);
    ta.selectionStart = start + before.length;
    ta.selectionEnd = start + before.length + replacement.length;
    ta.focus();
}

function renderGistContent(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.+?)__/g, '<u>$1</u>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
    html = html.replace(/`(.+?)`/g, '<code class="forum-inline-code">$1</code>');
    html = html.replace(/^&gt;\s?(.+)$/gm, '<blockquote class="forum-blockquote">$1</blockquote>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="forum-link">$1</a>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="forum-list">$1</ul>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function renderForumThreads() {
    const threads = Storage.getForumThreads();
    const replies = Storage.getForumReplies();
    const likes = Storage.getForumLikes();
    const search = document.getElementById('forumSearch')?.value?.toLowerCase() || '';
    const sort = document.getElementById('forumSort')?.value || 'newest';

    let filtered = threads.filter(t => {
        const cat = FORUM_CATEGORIES[t.category];
        if (cat && cat.section !== currentForumSection) return false;
        return true;
    });

    if (currentForumFilter !== 'all') {
        filtered = filtered.filter(t => t.category === currentForumFilter);
    }

    if (currentForumProvince) {
        filtered = filtered.filter(t => t.province === currentForumProvince);
    }

    if (search) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(search) ||
            t.body.toLowerCase().includes(search) ||
            (t.tags || []).some(tag => tag.toLowerCase().includes(search)) ||
            t.author.toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const aLikes = likes.filter(l => l.targetId === a.id && l.type === 'thread').length;
        const bLikes = likes.filter(l => l.targetId === b.id && l.type === 'thread').length;
        const aReplies = replies.filter(r => r.threadId === a.id).length;
        const bReplies = replies.filter(r => r.threadId === b.id).length;
        switch (sort) {
            case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
            case 'popular': return bLikes - aLikes;
            case 'replies': return bReplies - aReplies;
            default: return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const count = filtered.length;
    const countEl = document.getElementById('forumCount');
    if (countEl) countEl.textContent = count;

    const container = document.getElementById('forumThreadsList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-comments"></i><h3>No threads found</h3><p>Be the first to start a conversation in this forum!</p></div>';
        return;
    }

    container.innerHTML = filtered.map(thread => {
        const cat = FORUM_CATEGORIES[thread.category] || { label: thread.category, icon: 'fa-comment', color: '#8a7b55' };
        const threadLikes = likes.filter(l => l.targetId === thread.id && l.type === 'thread').length;
        const threadReplies = replies.filter(r => r.threadId === thread.id).length;
        const isLiked = likes.some(l => l.targetId === thread.id && l.type === 'thread' && l.userId === 'current');
        const tagsHtml = (thread.tags || []).slice(0, 3).map(t => `<span class="forum-tag">${t}</span>`).join('');
        const timeAgo = getTimeAgo(thread.createdAt);
        const isPremium = cat.section === 'premium';
        const sectionBadge = isPremium ? '<span class="forum-premium-badge"><i class="fas fa-crown"></i> Premium</span>' : '';
        const provinceBadge = thread.province ? `<span class="forum-tag"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(thread.province)}</span>` : '';

        return `
            <div class="forum-thread-card${thread.pinned ? ' pinned' : ''}${thread.locked ? ' locked' : ''}" onclick="viewForumThread('${thread.id}')" style="position:relative">
                <button class="save-item-btn ${isItemSaved('forum-thread', thread.id) ? 'saved' : ''}" data-kind="forum-thread" data-id="${thread.id}" onclick="event.stopPropagation(); toggleSaveItem('forum-thread','${thread.id}')"><i class="fas ${isItemSaved('forum-thread', thread.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
                <div class="forum-thread-card-inner">
                    <div class="forum-thread-votes" onclick="event.stopPropagation()">
                        <button class="forum-vote-btn${isLiked ? ' liked' : ''}" onclick="toggleForumLike('${thread.id}', 'thread', this)" title="Like">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <span class="forum-vote-count">${threadLikes}</span>
                    </div>
                    <div class="forum-thread-content">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                            <span class="forum-thread-category-badge" style="background:${cat.color}18;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                            ${sectionBadge}
                            ${provinceBadge}
                            ${thread.pinned ? '<span class="forum-pin-badge"><i class="fas fa-thumbtack"></i> Pinned</span>' : ''}
                            ${thread.locked ? '<span class="forum-lock-badge"><i class="fas fa-lock"></i> Locked</span>' : ''}
                        </div>
                        <h3 class="forum-thread-title">${escapeHtml(thread.title)}</h3>
                        <p class="forum-thread-excerpt">${escapeHtml(thread.body).substring(0, 180)}${thread.body.length > 180 ? '...' : ''}</p>
                        <div class="forum-thread-meta">
                            <span><i class="fas fa-user"></i> ${escapeHtml(thread.author)}</span>
                            <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                            <span><i class="fas fa-comment"></i> ${threadReplies} ${threadReplies === 1 ? 'reply' : 'replies'}</span>
                            <span><i class="fas fa-eye"></i> ${thread.views || 0} views</span>
                        </div>
                        ${tagsHtml ? `<div class="forum-thread-tags">${tagsHtml}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterForum(category) {
    currentForumFilter = category;
    document.querySelectorAll('#forumSubTabs .filter-tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderForumThreads();
}

function searchForum() { renderForumThreads(); }

function filterForumProvince(province) {
    currentForumProvince = province;
    renderForumThreads();
}

function viewForumThread(id) {
    const threads = Storage.getForumThreads();
    const thread = threads.find(t => t.id === id);
    if (!thread) return;

    currentForumViewId = id;

    const replies = Storage.getForumReplies();
    const likes = Storage.getForumLikes();
    const cat = FORUM_CATEGORIES[thread.category] || { label: thread.category, icon: 'fa-comment', color: '#8a7b55' };
    const threadLikes = likes.filter(l => l.targetId === id && l.type === 'thread').length;
    const isLiked = likes.some(l => l.targetId === id && l.type === 'thread' && l.userId === 'current');
    const threadReplies = replies.filter(r => r.threadId === id);
    const tagsHtml = (thread.tags || []).map(t => `<span class="forum-tag">${t}</span>`).join('');
    const createdStr = new Date(thread.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const isPremium = cat.section === 'premium';
    const sectionBadge = isPremium ? '<span class="forum-premium-badge" style="margin-left:8px"><i class="fas fa-crown"></i> Premium</span>' : '';
    const provinceBadge = thread.province ? `<span class="forum-tag" style="margin-left:8px"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(thread.province)}</span>` : '';

    const titleEl = document.getElementById('forumViewTitle');
    if (titleEl) titleEl.textContent = thread.title;

    const fullEl = document.getElementById('forumThreadFull');
    if (fullEl) {
        fullEl.innerHTML = `
            <div class="forum-thread-full-header">
                <span class="forum-thread-full-category" style="background:${cat.color}18;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                ${sectionBadge}
                ${provinceBadge}
                ${thread.pinned ? '<span class="forum-pin-badge" style="margin-left:8px"><i class="fas fa-thumbtack"></i> Pinned</span>' : ''}
                ${thread.locked ? '<span class="forum-lock-badge" style="margin-left:8px"><i class="fas fa-lock"></i> Locked</span>' : ''}
                <h1 class="forum-thread-full-title">${escapeHtml(thread.title)}</h1>
                <div class="forum-thread-full-meta">
                    <span><i class="fas fa-user"></i> ${escapeHtml(thread.author)}</span>
                    <span><i class="fas fa-clock"></i> ${createdStr}</span>
                    <span><i class="fas fa-eye"></i> ${thread.views || 0} views</span>
                </div>
            </div>
            <div class="forum-thread-full-body">
                <div class="forum-gist-content">${renderGistContent(thread.body)}</div>
            </div>
            ${tagsHtml ? `<div class="forum-thread-full-tags">${tagsHtml}</div>` : ''}
            <div class="forum-thread-full-actions">
                <button class="btn btn-secondary btn-sm" onclick="toggleForumLike('${id}', 'thread', this); viewForumThread('${id}')" style="display:inline-flex;align-items:center;gap:6px;${isLiked ? 'background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;border:none' : ''}">
                    <i class="fas fa-thumbs-up"></i> ${threadLikes} ${threadLikes === 1 ? 'Like' : 'Likes'}
                </button>
                <button class="btn btn-secondary btn-sm" onclick="document.getElementById('forumReplyBody').focus()" style="display:inline-flex;align-items:center;gap:6px">
                    <i class="fas fa-reply"></i> Reply
                </button>
                ${!thread.locked ? `<button class="btn btn-danger btn-sm" onclick="deleteForumThread('${id}')" style="display:inline-flex;align-items:center;gap:6px"><i class="fas fa-trash"></i> Delete</button>` : ''}
            </div>
        `;
    }

    const replyCountEl = document.getElementById('forumReplyCount');
    if (replyCountEl) replyCountEl.textContent = `(${threadReplies.length})`;

    const repliesList = document.getElementById('forumRepliesList');
    if (repliesList) {
        if (threadReplies.length === 0) {
            repliesList.innerHTML = '<p style="color:var(--text-muted, #a99c7e);font-style:italic;padding:10px 0">No replies yet. Be the first to reply!</p>';
        } else {
            repliesList.innerHTML = threadReplies.map(reply => {
                const initials = reply.author.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                const replyLikes = likes.filter(l => l.targetId === reply.id && l.type === 'reply').length;
                const isReplyLiked = likes.some(l => l.targetId === reply.id && l.type === 'reply' && l.userId === 'current');
                const replyTime = getTimeAgo(reply.createdAt);
                return `
                    <div class="forum-reply-item">
                        <div class="forum-reply-avatar">${initials}</div>
                        <div class="forum-reply-content">
                            <div class="forum-reply-header">
                                <span class="forum-reply-author">${escapeHtml(reply.author)}</span>
                                <span class="forum-reply-time">${replyTime}</span>
                            </div>
                            <div class="forum-reply-body">${renderGistContent(reply.body)}</div>
                            <div class="forum-reply-actions">
                                <button class="forum-reply-action-btn${isReplyLiked ? ' liked' : ''}" onclick="toggleForumLike('${reply.id}', 'reply', this); viewForumThread('${id}')">
                                    <i class="fas fa-thumbs-up"></i> ${replyLikes}
                                </button>
                                <button class="forum-reply-action-btn" onclick="deleteForumReply('${reply.id}', '${id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    thread.views = (thread.views || 0) + 1;
    Storage.setForumThreads(threads);

    navigateTo('forum-view');
}

function handleForumThreadSubmit(e) {
    e.preventDefault();
    if (!requireSignIn('Create a forum thread.')) return;
    const id = document.getElementById('forumThreadId').value;
    const title = document.getElementById('forumThreadTitle').value.trim();
    const section = document.getElementById('forumThreadSectionSelect')?.value || document.getElementById('forumThreadSection')?.value || 'public';
    const category = document.getElementById('forumThreadCategory').value;
    const province = document.getElementById('forumThreadProvince')?.value || '';
    const author = document.getElementById('forumThreadAuthor').value.trim();
    const body = document.getElementById('forumThreadBody').value.trim();
    const tagsStr = document.getElementById('forumThreadTags').value.trim();
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (!title || !category || !author || !body) { showToast('Please fill in all required fields.', 'error'); return; }

    const threads = Storage.getForumThreads();
    if (id) {
        const idx = threads.findIndex(t => t.id === id);
        if (idx !== -1) {
            threads[idx].title = title;
            threads[idx].section = section;
            threads[idx].category = category;
            threads[idx].province = province;
            threads[idx].author = author;
            threads[idx].body = body;
            threads[idx].tags = tags;
            threads[idx].updatedAt = new Date().toISOString();
        }
        showToast('Thread updated!', 'success');
    } else {
        const threadOwner = getCurrentProviderIdentity();
        threads.push({
            id: generateId(), title, section, category, province, author, body, tags,
            ownerId: threadOwner.id, ownerName: threadOwner.name,
            views: 0, pinned: false, locked: false,
            createdAt: new Date().toISOString()
        });
        showToast('Thread posted!', 'success');
    }
    Storage.setForumThreads(threads);
    navigateTo('forum-browse');
    renderForumThreads();
}

function submitForumReply() {
    if (!requireSignIn('Reply in the forum.')) return;
    if (!currentForumViewId) return;
    const author = document.getElementById('forumReplyAuthor').value.trim();
    const body = document.getElementById('forumReplyBody').value.trim();

    if (!author || !body) { showToast('Please fill in your name and reply.', 'error'); return; }

    const threads = Storage.getForumThreads();
    const thread = threads.find(t => t.id === currentForumViewId);
    if (thread && thread.locked) { showToast('This thread is locked.', 'error'); return; }

    const replies = Storage.getForumReplies();
    replies.push({
        id: generateId(), threadId: currentForumViewId, author, body,
        createdAt: new Date().toISOString()
    });
    Storage.setForumReplies(replies);

    document.getElementById('forumReplyBody').value = '';
    showToast('Reply posted!', 'success');
    viewForumThread(currentForumViewId);
}

function toggleForumLike(targetId, type, btn) {
    const likes = Storage.getForumLikes();
    const existingIdx = likes.findIndex(l => l.targetId === targetId && l.type === type && l.userId === 'current');
    if (existingIdx !== -1) {
        likes.splice(existingIdx, 1);
    } else {
        likes.push({ id: generateId(), targetId, type, userId: 'current', createdAt: new Date().toISOString() });
    }
    Storage.setForumLikes(likes);
    if (btn) {
        const isNowLiked = likes.some(l => l.targetId === targetId && l.type === type && l.userId === 'current');
        btn.classList.toggle('liked', isNowLiked);
        const countEl = btn.nextElementSibling;
        if (countEl && countEl.classList.contains('forum-vote-count')) {
            countEl.textContent = likes.filter(l => l.targetId === targetId && l.type === type).length;
        }
    }
}

function deleteForumThread(id) {
    deleteTarget = { type: 'forum-thread', id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Are you sure you want to delete this thread and all its replies?';
    modal.classList.add('active');
}

function deleteForumReply(replyId, threadId) {
    const replies = Storage.getForumReplies();
    const filtered = replies.filter(r => r.id !== replyId);
    Storage.setForumReplies(filtered);
    showToast('Reply deleted.', 'success');
    viewForumThread(threadId);
}

function renderUserForumThreads() {
    const threads = Storage.getForumThreads();
    const replies = Storage.getForumReplies();
    const likes = Storage.getForumLikes();
    const userThreads = threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('userForumThreadsList');
    if (!container) return;

    if (userThreads.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-comments"></i><h3>No threads yet</h3><p>Start a discussion in the community forum!</p></div>';
        return;
    }

    container.innerHTML = userThreads.map(thread => {
        const cat = FORUM_CATEGORIES[thread.category] || { label: thread.category, icon: 'fa-comment', color: '#8a7b55' };
        const threadLikes = likes.filter(l => l.targetId === thread.id && l.type === 'thread').length;
        const threadReplies = replies.filter(r => r.threadId === thread.id).length;
        const timeAgo = getTimeAgo(thread.createdAt);
        const isPremium = cat.section === 'premium';

        return `
            <div class="forum-thread-card${thread.pinned ? ' pinned' : ''}${thread.locked ? ' locked' : ''}" onclick="viewForumThread('${thread.id}')">
                <div class="forum-thread-card-inner">
                    <div class="forum-thread-votes" onclick="event.stopPropagation()">
                        <button class="forum-vote-btn" onclick="toggleForumLike('${thread.id}', 'thread', this)"><i class="fas fa-arrow-up"></i></button>
                        <span class="forum-vote-count">${threadLikes}</span>
                    </div>
                    <div class="forum-thread-content">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                            <span class="forum-thread-category-badge" style="background:${cat.color}18;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                            ${isPremium ? '<span class="forum-premium-badge"><i class="fas fa-crown"></i> Premium</span>' : ''}
                            ${thread.pinned ? '<span class="forum-pin-badge"><i class="fas fa-thumbtack"></i> Pinned</span>' : ''}
                            ${thread.locked ? '<span class="forum-lock-badge"><i class="fas fa-lock"></i> Locked</span>' : ''}
                        </div>
                        <h3 class="forum-thread-title">${escapeHtml(thread.title)}</h3>
                        <p class="forum-thread-excerpt">${escapeHtml(thread.body).substring(0, 180)}${thread.body.length > 180 ? '...' : ''}</p>
                        <div class="forum-thread-meta">
                            <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                            <span><i class="fas fa-comment"></i> ${threadReplies} replies</span>
                            <span><i class="fas fa-eye"></i> ${thread.views || 0} views</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function resetForumForm() {
    document.getElementById('forumFormTitle').textContent = 'New Thread';
    document.getElementById('forumThreadSubmitBtn').textContent = 'Post Thread';
    document.getElementById('forumThreadId').value = '';
    document.getElementById('forumThreadTitle').value = '';
    document.getElementById('forumThreadSectionSelect').value = '';
    document.getElementById('forumThreadCategory').innerHTML = '<option value="">Select category</option>';
    document.getElementById('forumThreadAuthor').value = '';
    document.getElementById('forumThreadBody').value = '';
    document.getElementById('forumThreadTags').value = '';
}

// ==========================================
// JOBS / GIGS SYSTEM
// ==========================================
let currentGigViewId = null;

function renderGigsBrowse() {
    const gigs = Storage.getGigs();
    const search = document.getElementById('gigSearch')?.value?.toLowerCase() || '';
    const typeFilter = document.getElementById('gigTypeFilter')?.value || 'all';
    const locationFilter = document.getElementById('gigLocationFilter')?.value || '';
    const sort = document.getElementById('gigSort')?.value || 'newest';

    let filtered = gigs.filter(g => g.status !== 'deleted');

    if (typeFilter !== 'all') filtered = filtered.filter(g => g.gigType === typeFilter);
    if (locationFilter) filtered = filtered.filter(g => g.location === locationFilter);
    if (search) {
        filtered = filtered.filter(g =>
            g.title.toLowerCase().includes(search) ||
            g.description.toLowerCase().includes(search) ||
            (g.tags || []).some(t => t.toLowerCase().includes(search)) ||
            g.author.toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        switch (sort) {
            case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
            case 'rate-high': return (b.rate || 0) - (a.rate || 0);
            case 'rate-low': return (a.rate || 0) - (b.rate || 0);
            default: return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const countEl = document.getElementById('gigCount');
    if (countEl) countEl.textContent = filtered.length;

    const container = document.getElementById('gigsList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-briefcase"></i><h3>No gigs found</h3><p>Be the first to post a gig!</p></div>';
        return;
    }

    container.innerHTML = filtered.map(gig => {
        const type = GIG_TYPES[gig.gigType] || { label: gig.gigType, icon: 'fa-briefcase', color: '#8a7b55' };
        const timeAgo = getTimeAgo(gig.createdAt);
        const rateStr = gig.rate ? `R${gig.rate}/${gig.rateType || 'hr'}` : 'Negotiable';
        return `
        <div class="forum-thread-card${gig.featured ? ' pinned' : ''}" onclick="viewGig('${gig.id}')" style="cursor:pointer;position:relative">
            <button class="save-item-btn ${isItemSaved('gig', gig.id) ? 'saved' : ''}" data-kind="gig" data-id="${gig.id}" onclick="event.stopPropagation(); toggleSaveItem('gig','${gig.id}')"><i class="fas ${isItemSaved('gig', gig.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
            <div class="forum-thread-card-inner">
                <div class="forum-thread-content" style="width:100%">
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                        <span class="forum-thread-category-badge" style="background:${type.color}18;color:${type.color}"><i class="fas ${type.icon}"></i> ${type.label}</span>
                        ${gig.featured ? '<span class="forum-pin-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                        ${gig.urgent ? '<span class="forum-lock-badge" style="background:#ef444418;color:#ef4444"><i class="fas fa-bolt"></i> Urgent</span>' : ''}
                    </div>
                    <h3 class="forum-thread-title">${escapeHtml(gig.title)}</h3>
                    <p class="forum-thread-excerpt">${escapeHtml(gig.description).substring(0, 150)}${gig.description.length > 150 ? '...' : ''}</p>
                    <div class="forum-thread-meta">
                        <span><i class="fas fa-user"></i> ${escapeHtml(gig.author)}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(gig.location || 'Remote')}</span>
                        <span><i class="fas fa-tag"></i> ${rateStr}</span>
                        <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function viewGig(id) {
    const gigs = Storage.getGigs();
    const gig = gigs.find(g => g.id === id);
    if (!gig) return;
    currentGigViewId = id;

    const type = GIG_TYPES[gig.gigType] || { label: gig.gigType, icon: 'fa-briefcase', color: '#8a7b55' };
    const createdStr = new Date(gig.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
    const rateStr = gig.rate ? `R${gig.rate}/${gig.rateType || 'hr'}` : 'Negotiable';
    const tagsHtml = (gig.tags || []).map(t => `<span class="forum-tag">${t}</span>`).join('');

    const titleEl = document.getElementById('gigViewTitle');
    if (titleEl) titleEl.textContent = gig.title;

    const contentEl = document.getElementById('gigViewContent');
    if (contentEl) {
        contentEl.innerHTML = `
        <div class="profile-card">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
                <span class="forum-thread-category-badge" style="background:${type.color}18;color:${type.color}"><i class="fas ${type.icon}"></i> ${type.label}</span>
                ${gig.featured ? '<span class="forum-pin-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                ${gig.urgent ? '<span class="forum-lock-badge" style="background:#ef444418;color:#ef4444"><i class="fas fa-bolt"></i> Urgent</span>' : ''}
            </div>
            <h1 style="font-size:1.5rem;margin-bottom:8px">${escapeHtml(gig.title)}</h1>
            <div class="forum-thread-full-meta" style="margin-bottom:16px">
                <span><i class="fas fa-user"></i> ${escapeHtml(gig.author)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(gig.location || 'Remote')}</span>
                <span><i class="fas fa-tag"></i> ${rateStr}</span>
                <span><i class="fas fa-clock"></i> ${createdStr}</span>
            </div>
            ${gig.contact ? `<p style="margin-bottom:12px"><i class="fas fa-phone" style="color:var(--primary);margin-right:6px"></i> ${escapeHtml(gig.contact)}</p>` : ''}
        </div>
        <div class="profile-card">
            <h2><i class="fas fa-file-alt"></i> Description</h2>
            <p class="view-bio" style="white-space:pre-wrap;line-height:1.7">${escapeHtml(gig.description)}</p>
        </div>
        ${tagsHtml ? `<div class="profile-card"><h2><i class="fas fa-tag"></i> Tags</h2><div class="tags-container">${tagsHtml}</div></div>` : ''}
        <div style="display:flex;gap:12px;margin-top:16px">
            <button class="btn btn-primary" onclick="openComposeTo('current', '${escapeHtml(gig.author.replace(/'/g, "\\'"))}', 'gig-author')" style="flex:1"><i class="fas fa-paper-plane"></i> Respond</button>
            <button class="btn btn-secondary" onclick="navigateTo('gigs-browse')" style="flex:1"><i class="fas fa-arrow-left"></i> Back to Gigs</button>
            ${gig.authorId === 'current' ? `<button class="btn btn-danger" onclick="deleteGig('${gig.id}')"><i class="fas fa-trash"></i> Delete</button>` : ''}
        </div>`;
    }
}

function handleGigSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('gigId')?.value || '';
    const title = document.getElementById('gigTitle').value.trim();
    const gigType = document.getElementById('gigType').value;
    const location = document.getElementById('gigLocation')?.value || '';
    const rate = document.getElementById('gigRate')?.value || '';
    const rateType = document.getElementById('gigRateType')?.value || 'hr';
    const contact = document.getElementById('gigContact')?.value || '';
    const author = document.getElementById('gigAuthor').value.trim();
    const description = document.getElementById('gigDescription').value.trim();
    const tagsStr = document.getElementById('gigTags')?.value?.trim() || '';
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    const urgent = document.getElementById('gigUrgent')?.checked || false;

    if (!title || !gigType || !author || !description) { showToast('Please fill in all required fields.', 'error'); return; }

    const gigs = Storage.getGigs();
    if (id) {
        const idx = gigs.findIndex(g => g.id === id);
        if (idx !== -1) {
            gigs[idx].title = title;
            gigs[idx].gigType = gigType;
            gigs[idx].location = location;
            gigs[idx].rate = rate ? parseFloat(rate) : null;
            gigs[idx].rateType = rateType;
            gigs[idx].contact = contact;
            gigs[idx].author = author;
            gigs[idx].description = description;
            gigs[idx].tags = tags;
            gigs[idx].urgent = urgent;
            gigs[idx].updatedAt = new Date().toISOString();
        }
        showToast('Gig updated!', 'success');
    } else {
        const gigOwner = getCurrentProviderIdentity();
        gigs.push({
            id: generateId(), title, gigType, location, rate: rate ? parseFloat(rate) : null, rateType,
            contact, author, authorId: 'current', description, tags, urgent,
            ownerId: gigOwner.id, ownerName: gigOwner.name,
            featured: false, status: 'active',
            createdAt: new Date().toISOString()
        });
        showToast('Gig posted!', 'success');
    }
    Storage.setGigs(gigs);
    navigateTo('gigs-browse');
}

function resetGigForm() {
    document.getElementById('gigId').value = '';
    document.getElementById('gigTitle').value = '';
    document.getElementById('gigType').value = '';
    document.getElementById('gigRate').value = '';
    document.getElementById('gigContact').value = '';
    document.getElementById('gigAuthor').value = '';
    document.getElementById('gigDescription').value = '';
    document.getElementById('gigTags').value = '';
    document.getElementById('gigLocation').value = '';
    const urgentEl = document.getElementById('gigUrgent');
    if (urgentEl) urgentEl.checked = false;
    document.getElementById('gigFormTitle').textContent = 'Post a Gig';
}

function renderUserGigs() {
    const gigs = Storage.getGigs().filter(g => g.authorId === 'current');
    const container = document.getElementById('userGigsList');
    if (!container) return;
    if (gigs.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-briefcase"></i><h3>No gigs posted</h3><p>Post your first gig to get started!</p></div>';
        return;
    }
    container.innerHTML = gigs.map(gig => {
        const type = GIG_TYPES[gig.gigType] || { label: gig.gigType, icon: 'fa-briefcase', color: '#8a7b55' };
        return `
        <div class="forum-thread-card" onclick="viewGig('${gig.id}')" style="cursor:pointer">
            <div class="forum-thread-card-inner">
                <div class="forum-thread-content" style="width:100%">
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                        <span class="forum-thread-category-badge" style="background:${type.color}18;color:${type.color}"><i class="fas ${type.icon}"></i> ${type.label}</span>
                        <span class="status-badge status-${gig.status}">${gig.status}</span>
                    </div>
                    <h3 class="forum-thread-title">${escapeHtml(gig.title)}</h3>
                    <div class="forum-thread-meta">
                        <span><i class="fas fa-clock"></i> ${getTimeAgo(gig.createdAt)}</span>
                        <span><i class="fas fa-tag"></i> ${gig.rate ? 'R' + gig.rate + '/' + (gig.rateType || 'hr') : 'Negotiable'}</span>
                    </div>
                    <div style="margin-top:8px;display:flex;gap:6px">
                        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();editGig('${gig.id}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteGig('${gig.id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderProviderGigs() { renderUserGigs(); }

function editGig(id) {
    const gig = Storage.getGigs().find(g => g.id === id);
    if (!gig) return;
    navigateTo('provider-gig-create');
    document.getElementById('gigId').value = gig.id;
    document.getElementById('gigTitle').value = gig.title;
    document.getElementById('gigType').value = gig.gigType;
    document.getElementById('gigRate').value = gig.rate || '';
    document.getElementById('gigContact').value = gig.contact || '';
    document.getElementById('gigAuthor').value = gig.author;
    document.getElementById('gigDescription').value = gig.description;
    document.getElementById('gigTags').value = (gig.tags || []).join(', ');
    document.getElementById('gigLocation').value = gig.location || '';
    const urgentEl = document.getElementById('gigUrgent');
    if (urgentEl) urgentEl.checked = gig.urgent || false;
    document.getElementById('gigFormTitle').textContent = 'Edit Gig';
}

function deleteGig(id) {
    const gigs = Storage.getGigs();
    const gig = gigs.find(g => g.id === id);
    if (!gig) return;
    if (!confirm(`Delete gig "${gig.title}"?`)) return;
    Storage.setGigs(gigs.filter(g => g.id !== id));
    showToast('Gig deleted', 'success');
    if (currentGigViewId === id) navigateTo('gigs-browse');
    else { renderUserGigs(); renderGigsBrowse(); }
}

function resetProviderGigForm() { resetGigForm(); }

function getTimeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ==========================================
// MESSAGING / INBOX SYSTEM
// ==========================================
let currentMessageViewId = null;
let currentInboxFilter = 'all';

function getMsgIdentity() {
    const stored = JSON.parse(localStorage.getItem('k2_msg_identity') || 'null');
    if (stored) return stored;
    const users = Storage.getUsers();
    return { name: users[0]?.fullName || '2k2 Member', email: users[0]?.email || '' };
}

function saveMsgIdentity(name, email) {
    localStorage.setItem('k2_msg_identity', JSON.stringify({ name, email }));
}

function getMsgRecipients() {
    const users = Storage.getUsers().map(u => ({ id: u.id, name: u.fullName || 'User', role: 'user' }));
    const providers = Storage.getProviders().map(p => ({ id: p.id, name: p.businessName || 'Provider', role: 'provider' }));
    return [...users, ...providers];
}

function conversationUnread(conv) {
    const msgs = Storage.getMessages().filter(m => m.conversationId === conv.id && m.senderId !== 'me' && !m.read);
    return msgs.length;
}

function inboxTotalUnread() {
    return Storage.getConversations().reduce((s, c) => s + (c.status !== 'deleted' ? conversationUnread(c) : 0), 0);
}

function filterInbox(filter) {
    currentInboxFilter = filter;
    document.querySelectorAll('#page-inbox .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderInbox();
}

function renderInbox() {
    let convs = Storage.getConversations().filter(c => c.status !== 'deleted');
    const search = (document.getElementById('inboxSearch')?.value || '').toLowerCase();

    if (currentInboxFilter === 'unread') convs = convs.filter(c => conversationUnread(c) > 0);
    else if (currentInboxFilter === 'archived') convs = convs.filter(c => c.status === 'archived');
    else convs = convs.filter(c => c.status !== 'archived');

    if (search) {
        convs = convs.filter(c =>
            c.subject.toLowerCase().includes(search) ||
            c.participantName.toLowerCase().includes(search) ||
            c.lastMessage.toLowerCase().includes(search)
        );
    }

    convs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const container = document.getElementById('inboxList');
    const countEl = document.getElementById('inboxCount');
    if (countEl) countEl.textContent = convs.length;
    if (!container) return;

    if (convs.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-envelope-open-text"></i><h3>No messages</h3><p>Your conversations will appear here</p><button class="btn btn-primary btn-sm" onclick="navigateTo(\'message-compose\')" style="margin-top:8px"><i class="fas fa-plus"></i> New Message</button></div>';
        return;
    }

    container.innerHTML = convs.map(conv => {
        const unread = conversationUnread(conv);
        const initials = conv.participantName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        return `
        <div class="conv-card${unread ? ' unread' : ''}${conv.status === 'archived' ? ' archived' : ''}" onclick="openConversation('${conv.id}')">
            <div class="conv-avatar">${escapeHtml(initials)}</div>
            <div class="conv-body">
                <div class="conv-top">
                    <span class="conv-name">${escapeHtml(conv.participantName)}</span>
                    <span class="conv-time">${getTimeAgo(conv.updatedAt)}</span>
                </div>
                <div class="conv-subject">${escapeHtml(conv.subject)}</div>
                <div class="conv-preview">${escapeHtml(msgPreviewText(conv.lastMessage))}</div>
            </div>
            ${unread ? `<span class="conv-unread-badge">${unread}</span>` : ''}
        </div>`;
    }).join('');
}

function openConversation(id) {
    currentMessageViewId = id;
    const msgs = Storage.getMessages();
    msgs.forEach(m => { if (m.conversationId === id && m.senderId !== 'me') m.read = true; });
    Storage.setMessages(msgs);
    navigateTo('message-view');
}

function renderMessageThread() {
    const conv = Storage.getConversations().find(c => c.id === currentMessageViewId);
    const container = document.getElementById('messageThreadContent');
    const titleEl = document.getElementById('messageViewTitle');
    if (!conv || !container) return;

    if (titleEl) titleEl.textContent = conv.subject;
    const msgs = Storage.getMessages().filter(m => m.conversationId === currentMessageViewId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const me = getMsgIdentity();
    container.innerHTML = `
        <div class="profile-card">
            <div class="msg-thread-meta">
                <div class="conv-avatar lg">${escapeHtml(conv.participantName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase())}</div>
                <div>
                    <h3>${escapeHtml(conv.participantName)}</h3>
                    <p style="color:var(--text-muted, #a99c7e);font-size:0.85rem">${conv.participantRole === 'provider' ? 'Service Provider' : 'Member'}</p>
                </div>
                <div style="margin-left:auto;display:flex;gap:8px">
                    <button class="btn btn-secondary btn-sm" onclick="archiveConversation('${conv.id}')"><i class="fas ${conv.status === 'archived' ? 'fa-box-open' : 'fa-box-archive'}"></i> ${conv.status === 'archived' ? 'Unarchive' : 'Archive'}</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteConversation('${conv.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>
        <div class="msg-thread">
            ${msgs.length === 0 ? '<div class="msg-empty"><i class="fas fa-comments"></i><p>No messages in this conversation yet</p></div>' : msgs.map(m => `
                <div class="msg-bubble ${m.senderId === 'me' ? 'mine' : (m.senderId === 'admin' ? 'admin' : 'theirs')}">
                    <div class="msg-bubble-head"><span class="msg-sender">${escapeHtml(m.senderName)}</span><span class="msg-time">${new Date(m.createdAt).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                    <div class="msg-body">${renderMsgBody(m.body)}</div>
                </div>
            `).join('')}
        </div>
        <div class="profile-card" style="margin-top:16px">
            <h2><i class="fas fa-reply"></i> Reply</h2>
            <div class="msg-toolbar">
                <button type="button" class="gist-btn" onclick="toggleMsgEmojiPicker('messageReplyBody')" title="Emoji"><i class="fas fa-face-smile"></i></button>
                <button type="button" class="gist-btn" onclick="toggleMsgGifPicker('messageReplyBody')" title="GIF"><i class="fas fa-images"></i></button>
            </div>
            <div class="form-group" style="margin-top:8px">
                <textarea id="messageReplyBody" rows="3" placeholder="Type your reply... Add emojis and GIFs 🎉" style="width:100%;padding:12px 14px;border:1px solid var(--border, #e6dec8);border-radius:10px;font-family:inherit;font-size:0.9rem;resize:none;outline:none;background:var(--card-bg, #fdf9ef);color:var(--text-primary, #211a0d)"></textarea>
            </div>
            <div class="form-grid" style="grid-template-columns:2fr 1fr;gap:10px">
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" id="messageReplyName" value="${escapeHtml(me.name)}">
                </div>
                <div class="form-group">
                    <label>&nbsp;</label>
                    <button class="btn btn-primary" style="width:100%" onclick="sendMessageReply()"><i class="fas fa-paper-plane"></i> Send</button>
                </div>
            </div>
        </div>`;

    const elThread = container.querySelector('.msg-thread');
    if (elThread) elThread.scrollTop = elThread.scrollHeight;
}

function sendMessageReply() {
    const body = document.getElementById('messageReplyBody').value.trim();
    const name = document.getElementById('messageReplyName').value.trim();
    if (!body || !name) { showToast('Please enter your name and a reply.', 'error'); return; }
    if (!currentMessageViewId) { showToast('No conversation selected.', 'error'); return; }

    const convs = Storage.getConversations();
    const conv = convs.find(c => c.id === currentMessageViewId);
    if (!conv) { showToast('Conversation not found.', 'error'); return; }

    const messages = Storage.getMessages();
    messages.push({
        id: generateId(),
        conversationId: conv.id,
        senderId: 'me',
        senderName: name,
        body,
        read: true,
        createdAt: new Date().toISOString()
    });
    Storage.setMessages(messages);

    conv.lastMessage = body;
    conv.updatedAt = new Date().toISOString();
    Storage.setConversations(convs);

    saveMsgIdentity(name, getMsgIdentity().email);
    document.getElementById('messageReplyBody').value = '';
    renderMessageThread();
    showToast('Reply sent.');
}

function archiveConversation(id) {
    const convs = Storage.getConversations();
    const conv = convs.find(c => c.id === id);
    if (!conv) return;
    conv.status = conv.status === 'archived' ? 'active' : 'archived';
    conv.updatedAt = new Date().toISOString();
    Storage.setConversations(convs);
    showToast(conv.status === 'archived' ? 'Conversation archived.' : 'Conversation restored.');
    renderMessageThread();
}

function deleteConversation(id) {
    if (!confirm('Delete this conversation and all its messages?')) return;
    const convs = Storage.getConversations();
    const idx = convs.findIndex(c => c.id === id);
    if (idx !== -1) convs.splice(idx, 1);
    Storage.setConversations(convs);
    Storage.setMessages(Storage.getMessages().filter(m => m.conversationId !== id));
    showToast('Conversation deleted.');
    navigateTo('inbox');
}

function renderMessageCompose() {
    const recipients = getMsgRecipients();
    const select = document.getElementById('msgRecipient');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">Select recipient</option>' + recipients.map(r =>
        `<option value="${r.id}" data-role="${r.role}">${escapeHtml(r.name)} (${r.role})</option>`
    ).join('') + '<option value="custom">Custom contact...</option>';
    if (current) select.value = current;

    const customWrap = document.getElementById('msgRecipientCustomWrap');
    if (customWrap) customWrap.style.display = select.value === 'custom' ? 'block' : 'none';

    const me = getMsgIdentity();
    const nameEl = document.getElementById('msgSenderName');
    if (nameEl && !nameEl.value) nameEl.value = me.name;
}

function openComposeTo(participantId, participantName, role) {
    if (!requireSignIn('Send a message.')) return;
    navigateTo('message-compose');
    const select = document.getElementById('msgRecipient');
    const recipients = getMsgRecipients();
    const match = recipients.find(r => r.id === participantId);
    if (match) {
        select.value = match.id;
        const customWrap = document.getElementById('msgRecipientCustomWrap');
        if (customWrap) customWrap.style.display = 'none';
    } else {
        select.value = 'custom';
        const customName = document.getElementById('msgRecipientCustom');
        if (customName) customName.value = participantName;
        const customWrap = document.getElementById('msgRecipientCustomWrap');
        if (customWrap) customWrap.style.display = 'block';
    }
}

function handleMessageSubmit(e) {
    e.preventDefault();
    const recipientSel = document.getElementById('msgRecipient');
    const recipientId = recipientSel.value;
    const recipientRole = recipientSel.options[recipientSel.selectedIndex]?.dataset?.role || 'contact';
    let recipientName = recipientSel.options[recipientSel.selectedIndex]?.text?.replace(/\s*\((user|provider)\)$/, '') || '';
    if (recipientId === 'custom') {
        recipientName = document.getElementById('msgRecipientCustom').value.trim();
        if (!recipientName) { showToast('Please enter the contact name.', 'error'); return; }
    }
    if (!recipientId) { showToast('Please select a recipient.', 'error'); return; }

    const subject = document.getElementById('msgSubject').value.trim();
    const body = document.getElementById('msgBody').value.trim();
    const senderName = document.getElementById('msgSenderName').value.trim();
    if (!subject || !body || !senderName) { showToast('Please fill in subject, message and your name.', 'error'); return; }
    if (recipientId === 'custom') { recipientId = 'contact-' + generateId(); recipientSel.value = recipientId; }

    const convs = Storage.getConversations();
    const existing = convs.find(c => c.participantId === recipientId && c.status !== 'deleted');
    let convId;
    const now = new Date().toISOString();

    if (existing) {
        convId = existing.id;
        existing.lastMessage = body;
        existing.updatedAt = now;
        existing.subject = subject;
    } else {
        convId = generateId();
        convs.push({
            id: convId,
            subject,
            participantId: recipientId,
            participantName: recipientName,
            participantRole: recipientRole,
            createdAt: now,
            updatedAt: now,
            lastMessage: body,
            status: 'active'
        });
    }
    Storage.setConversations(convs);

    const messages = Storage.getMessages();
    messages.push({
        id: generateId(),
        conversationId: convId,
        senderId: 'me',
        senderName,
        body,
        read: true,
        createdAt: now
    });
    Storage.setMessages(messages);

    saveMsgIdentity(senderName, getMsgIdentity().email);
    showToast('Message sent.');
    currentMessageViewId = convId;
    navigateTo('message-view');
}

// ==========================================
// MESSAGING - EMOJI & GIF SUPPORT
// ==========================================
const MSG_GIF_LIBRARY = [
    { name: 'Celebrate', url: '//media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif' },
    { name: 'Thumbs Up', url: '//media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif' },
    { name: 'Party', url: '//media.giphy.com/media/1BXa2alBjrCXC/giphy.gif' },
    { name: 'Wink', url: '//media.giphy.com/media/uLqJEJfU0Q4lO/giphy.gif' },
    { name: 'Clap', url: '//media.giphy.com/media/8Jc4hBOcvXs9XHBLML/giphy.gif' },
    { name: 'Happy', url: '//media.giphy.com/media/L95W4wv8nnb9K/giphy.gif' },
    { name: 'Love', url: '//media.giphy.com/media/ddcut2AMLnczi/giphy.gif' },
    { name: 'Dance', url: '//media.giphy.com/media/KiT9mxPcM8mDm/giphy.gif' },
    { name: 'Crying Laugh', url: '//media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' },
    { name: 'Excited', url: '//media.giphy.com/media/l3q2WMhNcnFABP8xO/giphy.gif' },
    { name: 'Cool', url: '//media.giphy.com/media/qWeVxLQqJvT5e/giphy.gif' },
    { name: 'Wow', url: '//media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif' },
    { name: 'Eyes', url: '//media.giphy.com/media/l0MYC2uMljszXBKdK/giphy.gif' },
    { name: 'Strong', url: '//media.giphy.com/media/3o7abLDj0b3rxrZUxW/giphy.gif' },
    { name: 'Nope', url: '//media.giphy.com/media/icoXPlRUmSdw8/giphy.gif' },
    { name: 'Jazz Hands', url: '//media.giphy.com/media/l4pTdc5T7zJkPYGiI/giphy.gif' },
    { name: 'Hug', url: '//media.giphy.com/media/3ohze1bG0rUkOofAG0/giphy.gif' },
    { name: 'Heart Eyes', url: '//media.giphy.com/media/26BRr0BUGRQhIGgqM/giphy.gif' },
    { name: 'Relax', url: '//media.giphy.com/media/3o7qDMavvgDstqkt1e/giphy.gif' },
    { name: 'Thank You', url: '//media.giphy.com/media/l0ExceAJKZSFRJphO/giphy.gif' },
    { name: 'OMG', url: '//media.giphy.com/media/xT1XGQ2wZ2cT1O9RwM/giphy.gif' },
    { name: 'Cute', url: '//media.giphy.com/media/8UEZs2oJmbK3y/giphy.gif' },
    { name: 'Silly', url: '//media.giphy.com/media/13we8yQO8zvhrW/giphy.gif' }
];

let currentMsgEmojiTarget = null;
let currentMsgGifTarget = null;

function renderMsgBody(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/\[gif:(.*?)\]/g, (m, url) => `<img class="msg-gif" src="${url}" alt="GIF" loading="lazy">`);
    html = html.replace(/\n/g, '<br>');
    return html;
}

function msgPreviewText(text) {
    if (!text) return '';
    return text.replace(/\[gif:.*?\]/g, '[GIF]');
}

function toggleMsgEmojiPicker(targetId) {
    currentMsgEmojiTarget = targetId;
    let picker = document.getElementById('msgEmojiPicker');
    if (picker) { picker.remove(); return; }
    picker = document.createElement('div');
    picker.id = 'msgEmojiPicker';
    picker.className = 'forum-emoji-picker';
    picker.innerHTML = `<div class="emoji-grid">${FORUM_EMOJIS.map(e => `<button type="button" class="emoji-btn" onclick="insertMsgEmoji('${e}')">${e}</button>`).join('')}</div>`;
    const target = document.getElementById(targetId);
    if (target) {
        target.parentElement.style.position = 'relative';
        target.parentElement.appendChild(picker);
    }
}

function insertMsgEmoji(emoji) {
    const ta = document.getElementById(currentMsgEmojiTarget);
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + emoji + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + emoji.length;
    ta.focus();
    const picker = document.getElementById('msgEmojiPicker');
    if (picker) picker.remove();
}

function toggleMsgGifPicker(targetId) {
    currentMsgGifTarget = targetId;
    let picker = document.getElementById('msgGifPicker');
    if (picker) { picker.remove(); return; }
    picker = document.createElement('div');
    picker.id = 'msgGifPicker';
    picker.className = 'msg-gif-picker';
    picker.innerHTML = `<div class="msg-gif-grid">${MSG_GIF_LIBRARY.map(g => `<button type="button" class="msg-gif-item" title="${g.name}" onclick="insertMsgGif('${g.url}')"><img src="https:${g.url}" alt="${g.name}" loading="lazy"></button>`).join('')}</div>`;
    const target = document.getElementById(targetId);
    if (target) {
        target.parentElement.style.position = 'relative';
        target.parentElement.appendChild(picker);
    }
}

function insertMsgGif(url) {
    const ta = document.getElementById(currentMsgGifTarget);
    if (!ta) return;
    const marker = `[gif:${url.replace(/^\/\//, '//')}]`;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, end) + (ta.value.length && end && ta.value.charAt(end - 1) !== ' ' ? ' ' : '') + marker + ' ' + ta.value.substring(end);
    ta.focus();
    const picker = document.getElementById('msgGifPicker');
    if (picker) picker.remove();
}

// ==========================================
// ONLINE USERS
// ==========================================
let currentOnlineFilter = 'all';
let currentOnlineViewId = null;

function filterOnlineUsers(filter) {
    currentOnlineFilter = filter;
    document.querySelectorAll('#page-online-users .filter-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#page-online-users .filter-tab').forEach(t => {
        if (t.getAttribute('data-filter') === filter || t.getAttribute('data-filter') === String(filter)) t.classList.add('active');
    });
    renderOnlineUsers();
}

function buildOnlineListMarkup(list) {
    if (!list || list.length === 0) {
        return '<div class="forum-empty"><i class="fas fa-user-slash"></i><h3>No users found</h3><p>Try adjusting your filters</p></div>';
    }
    return list.map(m => {
        const online = !!m.online;
        const isGuest = m.role === 'guest';
        const displayName = m.username || m.email || m.name || 'Member';
        const initials = String(displayName || '?').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
        const tagBg = isGuest ? 'background:rgba(217,119,6,.15);color:#d97706'
            : m.role === 'provider' ? 'background:rgba(16,185,129,.15);color:#10b981'
            : m.role === 'admin' ? 'background:rgba(239,68,68,.15);color:#ef4444'
            : 'background:rgba(102,126,234,.15);color:#667eea';
        const tagLabel = isGuest ? 'Guest' : m.role === 'provider' ? 'Service Provider' : m.role === 'admin' ? 'Admin' : 'General User';
        const safeId = String(m.id || '').replace(/'/g, "\\'");
        const safeName = String(m.name || '').replace(/'/g, "\\'");
        const msgBtn = isGuest ? '' : `<button class="btn btn-primary btn-sm" onclick="openComposeTo('${safeId}', '${safeName}', '${m.role}')"><i class="fas fa-paper-plane"></i> Message</button>`;
        const locText = isGuest ? 'Browsing 2k2' : (m.location || 'Location not set');
        return `
        <div class="online-user-card">
            <div class="online-user-avatar-wrap">
                ${m.photo ? `<img src="${m.photo}" alt="" class="online-user-avatar">` : `<div class="online-user-avatar initials">${escapeHtml(initials)}</div>`}
                <span class="online-dot ${online ? 'on' : 'off'}" title="${online ? 'Online' : 'Offline'}"></span>
            </div>
            <div class="online-user-info">
                <div class="online-user-name">${escapeHtml(displayName)} <span class="mini-tag" style="${tagBg}">${tagLabel}</span></div>
                <div class="online-user-loc"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(locText)}</div>
                <div class="online-user-bio">${escapeHtml((m.bio || '').substring(0, 90))}</div>
            </div>
            <div class="online-user-actions">${msgBtn}</div>
        </div>`;
    }).join('');
}

async function renderOnlineUsers() {
    let members = [];
    let guests = [];
    try {
        const data = await (window._2k2 && _2k2.Presence ? _2k2.Presence.fetchPresence() : { members: [], guests: [] });
        members = data.members.slice();
        guests = data.guests.slice();
    } catch (e) { members = []; guests = []; }

    // Ensure the current signed-in user is always present in the list.
    try {
        const sid = await _2k2.Auth.getSession();
        if (sid && sid.user && !members.some(m => m.id === sid.user.id)) {
            const profile = await _2k2.Auth.getProfile();
            const emailLocal = (sid.user.email || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
            members.push({
                id: sid.user.id,
                name: (profile && (profile.display_name || profile.full_name)) || emailLocal || sid.user.email || 'You',
                username: (profile && profile.profile_data && profile.profile_data.username) || '',
                role: profile ? profile.role : 'user',
                email: sid.user.email || '',
                location: '',
                photo: '',
                bio: 'This is you',
                lastSeen: Date.now(),
                online: true
            });
        }
    } catch (e) { /* ignore */ }

    // Overlay usernames from the users collection (edits made via the profile form).
    const userMap = {};
    Storage.getUsers().forEach(u => {
        if (u.userId && u.username) userMap[u.userId] = u.username;
    });
    members.forEach(m => {
        if (!m.username && userMap[m.id]) m.username = userMap[m.id];
    });

    const search = (document.getElementById('onlineSearch')?.value || '').toLowerCase();
    const typeF = document.getElementById('onlineTypeFilter')?.value || 'all';
    const cityF = document.getElementById('onlineCityFilter')?.value || '';

    const container = document.getElementById('onlineUsersList');
    const countEl = document.getElementById('onlineUserCount');
    if (!container) return;

    if (currentOnlineFilter === 'guests') {
        let list = guests;
        if (search) list = list.filter(g => g.name.toLowerCase().includes(search));
        list.sort((a, b) => b.lastSeen - a.lastSeen);
        if (countEl) countEl.textContent = list.length;
        container.innerHTML = buildOnlineListMarkup(list);
        return;
    }

    if (currentOnlineFilter === 'online') members = members.filter(m => m.online);
    else if (currentOnlineFilter === 'offline') members = members.filter(m => !m.online);
    if (typeF !== 'all') members = members.filter(m => m.role === typeF);
    if (cityF) members = members.filter(m => (m.location || '').toLowerCase().includes(cityF.toLowerCase()));
    if (search) members = members.filter(m => m.name.toLowerCase().includes(search) || (m.location || '').toLowerCase().includes(search));

    members.sort((a, b) => (b.online - a.online) || a.name.localeCompare(b.name));

    if (countEl) countEl.textContent = members.length;
    container.innerHTML = buildOnlineListMarkup(members);
}

// ==========================================
// SAVED ITEMS & DOWNLOADS
// ==========================================
let currentSavedFilter = 'all';

function getSaveableMeta(kind, id) {
    switch (kind) {
        case 'profile': {
            const u = Storage.getUsers().find(x => x.id === id);
            if (u) return { title: u.fullName, sub: u.role || 'Member', icon: 'fa-user', color: '#c9a227' };
            const l = [...Storage.getListings(), ...Storage.getServices()].find(x => x.id === id);
            return { title: l ? l.name : 'Profile', sub: l ? (l.typeLabel || l.type || '') : '', icon: 'fa-user', color: '#c9a227' };
        }
        case 'venue': {
            const v = Storage.getVenues().find(x => x.id === id);
            const type = VENUE_TYPES[(v && v.venueType) || 'other'] || { label: 'Venue', icon: 'fa-store' };
            return { title: v ? v.name : 'Venue', sub: type.label, icon: type.icon || 'fa-store', color: '#10b981' };
        }
        case 'service': {
            const s = Storage.getServices().find(x => x.id === id);
            return { title: s ? s.name : 'Service', sub: s ? s.duration || '' : '', icon: 'fa-concierge-bell', color: '#3b82f6' };
        }
        case 'content': {
            const c = Storage.getContent().find(x => x.id === id);
            const type = CONTENT_TYPES[(c && c.type) || ''] || { label: 'Content', icon: 'fa-photo-film' };
            return { title: c ? c.title : 'Content', sub: type.label, icon: type.icon || 'fa-photo-film', color: '#8b5cf6' };
        }
        case 'event': {
            const e = Storage.getEvents().find(x => x.id === id);
            return { title: e ? e.title : 'Event', sub: e ? (e.location || '') : '', icon: 'fa-calendar-days', color: '#f59e0b' };
        }
        case 'ad': {
            const a = Storage.getAds().find(x => x.id === id);
            const cat = AD_CATEGORIES[(a && a.category) || 'general'] || { label: 'Ad', icon: 'fa-bullhorn' };
            return { title: a ? a.title : 'Ad', sub: cat.label, icon: cat.icon || 'fa-bullhorn', color: '#ec4899' };
        }
        case 'gig': {
            const g = Storage.getGigs().find(x => x.id === id);
            const type = GIG_TYPES[(g && g.gigType) || 'other'] || { label: 'Gig', icon: 'fa-briefcase' };
            return { title: g ? g.title : 'Gig', sub: type.label, icon: type.icon || 'fa-briefcase', color: '#0ea5e9' };
        }
        case 'forum-thread': {
            const t = Storage.getForumThreads().find(x => x.id === id);
            const cat = FORUM_CATEGORIES[(t && t.category) || 'general'] || { label: 'Thread', icon: 'fa-comments' };
            return { title: t ? t.title : 'Thread', sub: cat.label, icon: cat.icon || 'fa-comments', color: '#6366f1' };
        }
        default:
            return { title: 'Item', sub: '', icon: 'fa-star', color: '#8a7b55' };
    }
}

function openSaveTarget(kind, id) {
    switch (kind) {
        case 'profile': return () => viewDirectoryListing(id);
        case 'venue': return () => viewVenueDirectory(id);
        case 'service': return () => viewServiceDirectory(id);
        case 'content': return () => viewContent(id);
        case 'event': return () => viewEvent(id);
        case 'ad': return () => viewAd(id);
        case 'gig': return () => { viewGig(id); navigateTo('gig-view'); };
        case 'forum-thread': return () => viewForumThread(id);
    }
}

function isItemSaved(kind, id) {
    return Storage.getSavedItems().some(s => s.kind === kind && s.itemId === id);
}

function toggleSaveItem(kind, id) {
    if (!requireSignIn('Save items to your library.')) return;
    const saved = Storage.getSavedItems();
    if (isItemSaved(kind, id)) {
        Storage.setSavedItems(saved.filter(s => !(s.kind === kind && s.itemId === id)));
        showToast('Removed from saved items.');
    } else {
        const meta = getSaveableMeta(kind, id);
        saved.push({ id: generateId(), kind, itemId: id, title: meta.title, sub: meta.sub, icon: meta.icon, color: meta.color, createdAt: new Date().toISOString() });
        Storage.setSavedItems(saved);
        showToast('Saved item added.');
    }
    if (currentSavedFilter === 'all' || currentSavedFilter === kind) {
        const list = document.getElementById('savedItemsList');
        if (list && list.parentElement.parentElement.classList.contains('active')) renderSavedItems();
    }
    renderSaveButtons();
}

function renderSaveButtons() {
    document.querySelectorAll('.save-item-btn[data-kind]').forEach(btn => {
        const kind = btn.dataset.kind;
        const id = btn.dataset.id;
        const saved = isItemSaved(kind, id);
        btn.innerHTML = saved ? '<i class="fas fa-bookmark"></i>' : '<i class="fas fa-bookmark-o"></i>';
        btn.classList.toggle('saved', saved);
        btn.title = saved ? 'Remove from saved' : 'Save item';
    });
}

function filterSavedItems(filter) {
    currentSavedFilter = filter;
    document.querySelectorAll('#page-saved-items .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderSavedItems();
}

function renderSavedItems() {
    let items = [...Storage.getSavedItems()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (currentSavedFilter !== 'all') items = items.filter(s => s.kind === currentSavedFilter);

    const search = (document.getElementById('savedSearch')?.value || '').toLowerCase();
    if (search) items = items.filter(s => (s.title || '').toLowerCase().includes(search) || (s.sub || '').toLowerCase().includes(search));

    const container = document.getElementById('savedItemsList');
    const countEl = document.getElementById('savedCount');
    if (countEl) countEl.textContent = items.length;
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-bookmark-o"></i><h3>No saved items</h3><p>Tap the bookmark icon on profiles, venues, services, content & more to save them here</p></div>';
        return;
    }

    container.innerHTML = items.map(s => `
        <div class="online-user-card">
            <div class="online-user-avatar-wrap">
                <div class="online-user-avatar initials" style="background:${s.color}"><i class="fas ${s.icon}"></i></div>
            </div>
            <div class="online-user-info">
                <div class="online-user-name">${escapeHtml(s.title)} <span class="mini-tag" style="background:${s.color}18;color:${s.color}">${s.kind.replace('-', ' ')}</span></div>
                <div class="online-user-loc">${escapeHtml(s.sub || '')}</div>
            </div>
            <div class="online-user-actions">
                <button class="btn btn-secondary btn-sm" onclick="openSavedItem('${s.kind}','${s.itemId}')"><i class="fas fa-eye"></i> View</button>
                <button class="btn btn-danger btn-sm" onclick="removeSavedItem('${s.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function openSavedItem(kind, id) {
    const pageMap = {
        'profile': 'directory-view',
        'venue': 'venue-directory-view',
        'service': 'services-directory',
        'content': 'content-view',
        'event': 'event-view',
        'ad': 'ad-view',
        'gig': 'gig-view',
        'forum-thread': 'forum-view'
    };
    const targetPage = pageMap[kind];
    if (targetPage && !document.getElementById('page-' + targetPage)) {
        showToast('Open this item from the General User portal.', 'error');
        return;
    }
    const fn = openSaveTarget(kind, id);
    if (fn) fn();
}

function removeSavedItem(id) {
    Storage.setSavedItems(Storage.getSavedItems().filter(s => s.id !== id));
    showToast('Removed from saved items.');
    renderSavedItems();
}

function logDownload({ kind, itemId, title, sub, fileData, fileType }) {
    const dl = Storage.getDownloads();
    if (!dl.some(d => d.kind === kind && d.itemId === itemId)) {
        const meta = getSaveableMeta(kind, itemId);
        dl.push({
            id: generateId(),
            kind,
            itemId,
            title: title || meta.title,
            sub: sub || meta.sub,
            fileData,
            fileType: fileType || 'application/octet-stream',
            createdAt: new Date().toISOString()
        });
        Storage.setDownloads(dl);
    }
    const a = document.createElement('a');
    a.href = fileData;
    a.download = (title || meta.title || 'download') + '.' + (fileType || 'file').split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Download started.');
}

function filterDownloads(filter) {
    document.querySelectorAll('#page-downloads .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderDownloads();
}

function renderDownloads() {
    let items = [...Storage.getDownloads()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const search = (document.getElementById('downloadsSearch')?.value || '').toLowerCase();
    if (search) items = items.filter(d => (d.title || '').toLowerCase().includes(search));

    const container = document.getElementById('downloadsList');
    const countEl = document.getElementById('downloadsCount');
    if (countEl) countEl.textContent = items.length;
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<div class="forum-empty"><i class="fas fa-download"></i><h3>No downloads yet</h3><p>Files you download from content creators will appear here</p></div>';
        return;
    }

    container.innerHTML = items.map(d => `
        <div class="online-user-card">
            <div class="online-user-avatar-wrap">
                <div class="online-user-avatar initials" style="background:${d.color || '#0ea5e9'}"><i class="fas fa-file"></i></div>
            </div>
            <div class="online-user-info">
                <div class="online-user-name">${escapeHtml(d.title)} <span class="mini-tag" style="background:#0ea5e918;color:#0ea5e9">${escapeHtml(d.kind || 'file')}</span></div>
                <div class="online-user-loc">${escapeHtml(d.sub || '')} &middot; ${getTimeAgo(d.createdAt)}</div>
            </div>
            <div class="online-user-actions">
                <button class="btn btn-primary btn-sm" onclick="reDownload('${d.id}')"><i class="fas fa-download"></i> Download</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDownload('${d.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function reDownload(id) {
    const d = Storage.getDownloads().find(x => x.id === id);
    if (!d) return;
    const a = document.createElement('a');
    a.href = d.fileData;
    a.download = d.title + '.' + (d.fileType || 'file').split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Download started.');
}

function deleteDownload(id) {
    Storage.setDownloads(Storage.getDownloads().filter(d => d.id !== id));
    showToast('Download removed.');
    renderDownloads();
}

// ==========================================
// GAMES - EXPERIENCES SYSTEM
// ==========================================
let currentExperienceFilter = 'all';
let currentExperienceViewId = null;
let currentExperienceSearch = '';
let currentProviderExperienceFilter = 'all';
let currentProviderExperienceViewId = null;

let currentFantasyFilter = 'all';
let currentFantasyViewId = null;
let currentProviderFantasyViewId = null;
let currentProviderId = null;

function populateExperienceDropdowns() {
    document.querySelectorAll('#expType').forEach(sel => {
        if (sel.options.length > 1) return;
        Object.entries(EXPERIENCE_TYPES).forEach(([key, val]) => {
            const opt = document.createElement('option');
            opt.value = key; opt.textContent = val.label;
            sel.appendChild(opt);
        });
    });
    document.querySelectorAll('#expLocation').forEach(sel => {
        if (sel.options.length > 1) return;
        sel.insertAdjacentHTML('beforeend', generateSAProvinceOptions().replace('<option value="">All Provinces</option>', '<option value="">Select location</option>'));
    });
}

function resetProviderExperienceForm() {
    const form = document.getElementById('experienceForm');
    if (!form) return;
    form.reset();
    document.getElementById('experienceId').value = '';
    document.getElementById('experienceFormTitle').textContent = 'Add Experience';
    document.getElementById('experienceSubmitBtn').textContent = 'Publish Experience';
    document.getElementById('expCoverPreview')?.classList.add('hidden');
    document.getElementById('expCoverPreview')?.removeAttribute('src');
}

function handleExperienceCover(files) {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('expCoverPreview');
        if (img) { img.src = e.target.result; img.classList.remove('hidden'); }
    };
    reader.readAsDataURL(file);
}

function getCurrentProviderIdentity() {
    const bizNameInput = document.getElementById('providerBusinessName');
    const name = bizNameInput ? bizNameInput.value.trim() || 'My Business' : 'My Business';
    let id = 'current';
    const p = Storage.getProviders().find(x => (x.businessName || '').toLowerCase() === name.toLowerCase());
    if (p) id = p.id;
    return { id, name };
}

function handleExperienceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('experienceId')?.value || '';
    const title = document.getElementById('expTitle').value.trim();
    const type = document.getElementById('expType').value;
    const location = document.getElementById('expLocation').value;
    const price = parseFloat(document.getElementById('expPrice').value) || 0;
    const description = document.getElementById('expDescription').value.trim();
    const rules = document.getElementById('expRules').value.trim();
    const includes = document.getElementById('expIncludes').value.trim();
    const capacity = document.getElementById('expCapacity').value.trim();
    const duration = document.getElementById('expDuration').value.trim();
    const coverPhoto = document.getElementById('expCoverPreview')?.src || '';

    if (!title || !type) { showToast('Please fill in the title and game type.', 'error'); return; }

    const experiences = Storage.getExperiences();
    const { id: providerId, name: author } = getCurrentProviderIdentity();

    if (id) {
        const idx = experiences.findIndex(x => x.id === id);
        if (idx !== -1) {
            experiences[idx] = { ...experiences[idx], title, type, location, price, description, rules, includes, capacity, duration, coverPhoto, updatedAt: new Date().toISOString() };
        }
        showToast('Experience updated!', 'success');
    } else {
        experiences.push({
            id: generateId(), title, type, location, price, description, rules, includes, capacity,
            duration, coverPhoto, author, providerId, authorId: 'current', ownerId: providerId, ownerName: author, status: 'active', tags: [],
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        });
        showToast('Experience published!', 'success');
    }
    Storage.setExperiences(experiences);
    navigateTo('provider-experiences');
}

function editProviderExperience(id) {
    const e = Storage.getExperiences().find(x => x.id === id);
    if (!e) return;
    navigateTo('provider-experience-create');
    setTimeout(() => {
        document.getElementById('experienceId').value = e.id;
        document.getElementById('experienceFormTitle').textContent = 'Edit Experience';
        document.getElementById('experienceSubmitBtn').textContent = 'Save Changes';
        document.getElementById('expTitle').value = e.title || '';
        document.getElementById('expType').value = e.type || '';
        document.getElementById('expLocation').value = e.location || '';
        document.getElementById('expPrice').value = e.price ?? '';
        document.getElementById('expDescription').value = e.description || '';
        document.getElementById('expRules').value = e.rules || '';
        document.getElementById('expIncludes').value = e.includes || '';
        document.getElementById('expCapacity').value = e.capacity || '';
        document.getElementById('expDuration').value = e.duration || '';
        if (e.coverPhoto) {
            const img = document.getElementById('expCoverPreview');
            if (img) { img.src = e.coverPhoto; img.classList.remove('hidden'); }
        }
        const typeSel = document.getElementById('expType');
        if (typeSel && typeSel.options.length <= 1) {
            Object.entries(EXPERIENCE_TYPES).forEach(([key, val]) => {
                const opt = document.createElement('option');
                opt.value = key; opt.textContent = val.label;
                typeSel.appendChild(opt);
            });
            typeSel.value = e.type || '';
        }
        const locSel = document.getElementById('expLocation');
        if (locSel && locSel.options.length <= 1) {
            locSel.insertAdjacentHTML('beforeend', generateSAProvinceOptions().replace('<option value="">All Provinces</option>', '<option value="">Select location</option>'));
            locSel.value = e.location || '';
        }
    }, 0);
}

function deleteProviderExperience(id) {
    if (!confirm('Delete this experience?')) return;
    Storage.setExperiences(Storage.getExperiences().filter(x => x.id !== id));
    showToast('Experience deleted.');
    renderProviderExperiences();
}

function findCurrentProviderId() {
    const name = document.getElementById('providerBusinessName')?.textContent || '';
    const p = Storage.getProviders().find(x => (x.businessName || '').toLowerCase() === name.toLowerCase() || x.id === name);
    return p ? p.id : 'current';
}

function getExperienceProvider(providerId) {
    const p = Storage.getProviders().find(x => x.id === providerId);
    return p ? p.businessName : 'Provider';
}

function renderProviderExperiences() {
    const experiences = Storage.getExperiences().filter(x => x.authorId === 'current');
    let filtered = [...experiences];
    const typeFilter = document.getElementById('providerExperienceFilter')?.value || 'all';
    if (typeFilter !== 'all') filtered = filtered.filter(x => x.type === typeFilter);

    const purchases = Storage.getExperiencePurchases();
    const container = document.getElementById('providerExperiencesList');
    const countEl = document.getElementById('providerExperienceCount');
    if (countEl) countEl.textContent = filtered.length;
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-gamepad"></i><h3>No experiences yet</h3><p>Add your first game experience to start earning</p><button class="btn btn-primary provider-btn" onclick="navigateTo(\'provider-experience-create\')">Add Experience</button></div>';
        return;
    }

    container.innerHTML = filtered.map(x => {
        const type = EXPERIENCE_TYPES[x.type] || { label: x.type, icon: 'fa-gamepad', color: '#8a7b55' };
        const sold = purchases.filter(p => p.experienceId === x.id).length;
        const revenue = purchases.filter(p => p.experienceId === x.id).reduce((s, p) => s + p.amount, 0);
        return `
        <div class="profile-list-card" style="animation-delay:${0}s">
            <div class="list-card-avatar" style="background:${type.color}20; color:${type.color}">
                ${x.coverPhoto ? `<img src="${x.coverPhoto}" alt="">` : `<i class="fas ${type.icon || 'fa-gamepad'}"></i>`}
            </div>
            <div class="list-card-info">
                <h3>${escapeHtml(x.title)}</h3>
                <p>${type.label || x.type} &middot; ${escapeHtml(x.location || 'Anywhere')} &middot; R${x.price || 0}</p>
                <div class="list-card-tags">
                    <span class="mini-tag" style="background:#10b98118;color:#10b981"><i class="fas fa-shopping-cart"></i> ${sold} sold</span>
                    <span class="mini-tag" style="background:#8b5cf618;color:#8b5cf6"><i class="fas fa-coins"></i> R${revenue.toFixed(0)} earned</span>
                </div>
            </div>
            <div class="list-card-actions">
                <span class="status-badge status-active">${x.status}</span>
                <button class="btn-icon" onclick="event.stopPropagation(); editProviderExperience('${x.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); deleteProviderExperience('${x.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

function filterProviderExperiences() {
    renderProviderExperiences();
}

function renderExperiencesBrowse() {
    const experiences = Storage.getExperiences().filter(x => !x.status || x.status === 'active');
    const walletBalanceEl = document.getElementById('expWalletBalance');
    if (walletBalanceEl) walletBalanceEl.textContent = 'R' + getWalletBalance('user', currentUserOwnerId());
    let filtered = [...experiences];

    if (currentExperienceFilter !== 'all') filtered = filtered.filter(x => x.type === currentExperienceFilter);
    const searchVal = (document.getElementById('experienceSearch')?.value || '').toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(x => x.title.toLowerCase().includes(searchVal) || (EXPERIENCE_TYPES[x.type]?.label || '').toLowerCase().includes(searchVal) || (x.location || '').toLowerCase().includes(searchVal));
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('experiencesList');
    const countEl = document.getElementById('experienceCount');
    if (countEl) countEl.textContent = filtered.length;
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-gamepad"></i><h3>No experiences found</h3><p>Check back soon for new game experiences</p></div>';
        return;
    }

    container.innerHTML = filtered.map(x => {
        const type = EXPERIENCE_TYPES[x.type] || { label: x.type, icon: 'fa-gamepad', color: '#8a7b55' };
        const purchases = Storage.getExperiencePurchases();
        const soldCount = purchases.filter(p => p.experienceId === x.id).length;
        return `
        <div class="forum-thread-card" style="cursor:pointer" onclick="viewExperience('${x.id}')">
            <div class="forum-thread-card-inner">
                <div class="forum-thread-content" style="width:100%">
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                        <span class="forum-thread-category-badge" style="background:${type.color}18;color:${type.color}"><i class="fas ${type.icon || 'fa-gamepad'}"></i> ${type.label || x.type}</span>
                        <span class="forum-pin-badge" style="background:#10b98118;color:#10b981"><i class="fas fa-users"></i> ${soldCount} joined</span>
                    </div>
                    <h3 class="forum-thread-title">${escapeHtml(x.title)}</h3>
                    <p class="forum-thread-excerpt">${escapeHtml((x.description || '').substring(0, 120))}${(x.description || '').length > 120 ? '...' : ''}</p>
                    <div class="forum-thread-meta">
                        <span><i class="fas fa-tag"></i> R${x.price || 0}</span>
                        ${x.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(x.location)}</span>` : ''}
                        ${x.duration ? `<span><i class="fas fa-clock"></i> ${escapeHtml(x.duration)}</span>` : ''}
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" style="align-self:center" onclick="event.stopPropagation(); viewExperience('${x.id}')"><i class="fas fa-arrow-right"></i> Join</button>
            </div>
        </div>`;
    }).join('');
}

function filterExperiences(type) {
    currentExperienceFilter = type;
    document.querySelectorAll('#page-experiences-browse .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderExperiencesBrowse();
}

function searchExperiences() { renderExperiencesBrowse(); }

function viewExperience(id) {
    const item = Storage.getExperiences().find(x => x.id === id);
    if (!item) return;
    currentExperienceViewId = id;
    const type = EXPERIENCE_TYPES[item.type] || { label: item.type, icon: 'fa-gamepad', color: '#8a7b55' };
    const provider = getExperienceProvider(item.providerId);
    const alreadyBought = Storage.getExperiencePurchases().some(p => p.experienceId === id);

    const container = document.getElementById('experienceViewContent');
    if (!container) return;
    container.innerHTML = `
        <div class="profile-card">
            ${item.coverPhoto ? `<img src="${item.coverPhoto}" alt="" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px;margin-bottom:16px">` : ''}
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
                <span class="badge" style="background:${type.color}20;color:${type.color}"><i class="fas ${type.icon}"></i> ${type.label}</span>
                <span class="badge" style="background:#10b98120;color:#10b981"><i class="fas fa-user"></i> ${escapeHtml(provider)}</span>
            </div>
            <h1 style="font-size:1.5rem;margin-bottom:8px">${escapeHtml(item.title)}</h1>
            <div class="forum-thread-full-meta" style="margin-bottom:16px">
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(item.location || 'Anywhere')}</span>
                <span><i class="fas fa-tag"></i> R${item.price || 0}</span>
                ${item.duration ? `<span><i class="fas fa-clock"></i> ${escapeHtml(item.duration)}</span>` : ''}
                ${item.capacity ? `<span><i class="fas fa-users"></i> ${escapeHtml(item.capacity)}</span>` : ''}
            </div>
        </div>
        ${item.description ? `<div class="profile-card"><h2><i class="fas fa-file-alt"></i> About this experience</h2><p class="view-bio" style="white-space:pre-wrap;line-height:1.7">${escapeHtml(item.description)}</p></div>` : ''}
        ${item.includes ? `<div class="profile-card"><h2><i class="fas fa-gift"></i> What's included</h2><p class="view-bio" style="white-space:pre-wrap;line-height:1.7">${escapeHtml(item.includes)}</p></div>` : ''}
        ${item.rules ? `<div class="profile-card"><h2><i class="fas fa-scroll"></i> Rules</h2><p class="view-bio" style="white-space:pre-wrap;line-height:1.7">${escapeHtml(item.rules)}</p></div>` : ''}
        <div style="display:flex;gap:12px;margin-top:16px">
            <button class="btn btn-primary" style="flex:2" onclick="${alreadyBought ? `openExperienceAccess('${item.id}')` : `purchaseExperience('${item.id}')`}"><i class="fas ${alreadyBought ? 'fa-unlock' : 'fa-cart-shopping'}"></i> ${alreadyBought ? 'Open Experience' : 'Join Now - R' + (item.price || 0)}</button>
            <button class="btn btn-secondary" style="flex:1" onclick="navigateTo('experiences-browse')"><i class="fas fa-arrow-left"></i> Back</button>
        </div>
        ${alreadyBought ? `<p style="margin-top:10px;font-size:0.8rem;color:#10b981"><i class="fas fa-check-circle"></i> You've already joined this experience. You now have lifetime access.</p>` : ''}
    `;
    navigateTo('experiences-view');
}

function openExperienceAccess(id) {
    navigateTo('experiences-my');
}

function purchaseExperience(id) {
    if (!requireSignIn('Join an experience.')) return;
    const item = Storage.getExperiences().find(x => x.id === id);
    if (!item) return;
    if (Storage.getExperiencePurchases().some(p => p.experienceId === id)) {
        showToast('You already own this experience.');
        return;
    }
    const price = item.price || 0;
    if (price <= 0) {
        Storage.setExperiencePurchases([...Storage.getExperiencePurchases(), {
            id: generateId(), experienceId: id, buyerId: 'current', amount: 0, title: item.title, providerId: item.providerId,
            status: 'active', createdAt: new Date().toISOString()
        }]);
        showToast('Free experience joined!');
        viewExperience(id);
        return;
    }
    const balance = getWalletBalance('user', currentUserOwnerId());
    if (balance < price) {
        showToast('Insufficient wallet balance. Please top up your wallet first.', 'error');
        navigateTo('user-wallet');
        return;
    }
    adjustWallet('user', currentUserOwnerId(), -price, 'experience-purchase', `Joined experience: ${item.title}`, { experienceId: id });
    adjustWallet('provider', item.providerId, price, 'experience-sale', `Experience sold: ${item.title}`, { experienceId: id });
    Storage.setExperiencePurchases([...Storage.getExperiencePurchases(), {
        id: generateId(), experienceId: id, buyerId: 'current', amount: price, title: item.title, providerId: item.providerId,
        status: 'active', createdAt: new Date().toISOString()
    }]);
    showToast('Experience joined! Payment complete.');
    viewExperience(id);
}

function renderMyGames() {
    const purchases = Storage.getExperiencePurchases().filter(p => p.buyerId === 'current');
    const myRequests = Storage.getFantasyRequests().filter(r => r.authorId === 'current');

    const container = document.getElementById('myGamesList');
    if (!container) return;

    let html = '';
    if (purchases.length > 0) {
        html += `<h3 style="margin:0 0 12px;color:var(--text-primary)"><i class="fas fa-gamepad"></i> My Experiences</h3>`;
        html += purchases.map(p => {
            const exp = Storage.getExperiences().find(x => x.id === p.experienceId);
            const type = EXPERIENCE_TYPES[exp?.type] || { label: 'Experience', icon: 'fa-gamepad', color: '#8a7b55' };
            return `
            <div class="forum-thread-card" style="cursor:pointer" onclick="viewExperience('${p.experienceId}')">
                <div class="forum-thread-card-inner">
                    <div class="forum-thread-content" style="width:100%">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                            <span class="forum-thread-category-badge" style="background:${type.color}18;color:${type.color}"><i class="fas ${type.icon}"></i> ${type.label}</span>
                            <span class="forum-pin-badge" style="background:#10b98120;color:#10b981"><i class="fas fa-check-circle"></i> Joined</span>
                        </div>
                        <h3 class="forum-thread-title">${escapeHtml(p.title || 'Experience')}</h3>
                        <div class="forum-thread-meta">
                            <span><i class="fas fa-tag"></i> R${p.amount || 0}</span>
                            <span><i class="fas fa-clock"></i> ${getTimeAgo(p.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
        html += `<div style="height:24px"></div>`;
    } else {
        html += `<div class="forum-empty"><i class="fas fa-gamepad"></i><h3>No experiences yet</h3><p>Browse game experiences and join one to start playing</p><button class="btn btn-primary provider-btn" onclick="navigateTo('experiences-browse')">Browse Experiences</button></div>`;
    }

    if (myRequests.length > 0) {
        html += `<h3 style="margin:0 0 12px;color:var(--text-primary)"><i class="fas fa-scroll"></i> My Fantasy Requests</h3>`;
        html += myRequests.map(r => {
            const cat = FANTASY_CATEGORIES[r.category] || { label: r.category, icon: 'fa-scroll', color: '#8a7b55' };
            const status = FANTASY_STATUSES[r.status] || { label: r.status, color: '#8a7b55', icon: 'fa-circle' };
            const responseCount = (r.responses || []).length;
            return `
            <div class="forum-thread-card" style="cursor:pointer" onclick="viewFantasyRequest('${r.id}')">
                <div class="forum-thread-card-inner">
                    <div class="forum-thread-content" style="width:100%">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                            <span class="forum-thread-category-badge" style="background:${cat.color}18;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                            <span class="status-badge" style="background:${status.color}20;color:${status.color}"><i class="fas ${status.icon}"></i> ${status.label}</span>
                        </div>
                        <h3 class="forum-thread-title">${escapeHtml(r.title)}</h3>
                        <div class="forum-thread-meta">
                            <span><i class="fas fa-tag"></i> R${r.price || 0} budget</span>
                            <span><i class="fas fa-comments"></i> ${responseCount} provider ${responseCount === 1 ? 'response' : 'responses'}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    } else {
        html += `<div class="forum-empty"><i class="fas fa-scroll"></i><h3>No fantasy requests yet</h3><p>Post a fantasy request and let providers respond with offers</p><button class="btn btn-primary provider-btn" onclick="navigateTo('fantasy-request-create')">Post a Request</button></div>`;
    }

    container.innerHTML = html;
}

// ==========================================
// GAMES - FANTASY REQUESTS SYSTEM
// ==========================================
function populateFantasyDropdowns() {
    document.querySelectorAll('#fantasyCategory, #fantasyCategoryFilter').forEach(sel => {
        if (sel.options.length > 1) return;
        const placeholder = sel.id.includes('Filter') ? '<option value="all">All Categories</option>' : '<option value="">Select category</option>';
        let opts = placeholder;
        Object.entries(FANTASY_CATEGORIES).forEach(([key, val]) => {
            opts += `<option value="${key}">${val.label}</option>`;
        });
        sel.innerHTML = opts;
    });
    document.querySelectorAll('#fantasyLocation').forEach(sel => {
        if (sel.options.length > 1) return;
        sel.insertAdjacentHTML('beforeend', generateSAProvinceOptions().replace('<option value="">All Provinces</option>', '<option value="">Select location</option>'));
    });
}

function resetFantasyForm() {
    const form = document.getElementById('fantasyForm');
    if (!form) return;
    form.reset();
    document.getElementById('fantasyRequestId').value = '';
}

function handleFantasySubmit(e) {
    e.preventDefault();
    if (!requireSignIn('Post a fantasy request.')) return;
    const id = document.getElementById('fantasyRequestId')?.value || '';
    const title = document.getElementById('fantasyTitle').value.trim();
    const category = document.getElementById('fantasyCategory').value;
    const price = parseFloat(document.getElementById('fantasyPrice').value) || 0;
    const location = document.getElementById('fantasyLocation').value;
    const description = document.getElementById('fantasyDescription').value.trim();

    if (!title || !category) { showToast('Please fill in the title and category.', 'error'); return; }

    const requests = Storage.getFantasyRequests();
    if (id) {
        const idx = requests.findIndex(x => x.id === id);
        if (idx !== -1) {
            requests[idx] = { ...requests[idx], title, category, price, location, description, status: 'pending', updatedAt: new Date().toISOString() };
        }
        showToast('Request updated! Resubmitted for admin approval.', 'success');
    } else {
        requests.push({
            id: generateId(), title, category, price, location, description, authorId: 'current',
            author: 'Me', status: 'pending', responses: [], createdAt: new Date().toISOString()
        });
        showToast('Request submitted! Pending admin approval.', 'success');
    }
    Storage.setFantasyRequests(requests);
    navigateTo('fantasy-requests');
}

function renderFantasyRequests() {
    const requests = Storage.getFantasyRequests().filter(r => r.status === 'approved' || r.authorId === 'current');
    let filtered = [...requests];

    if (currentFantasyFilter !== 'all') filtered = filtered.filter(r => r.category === currentFantasyFilter);
    const searchVal = (document.getElementById('fantasySearch')?.value || '').toLowerCase();
    if (searchVal) filtered = filtered.filter(r => r.title.toLowerCase().includes(searchVal) || (r.description || '').toLowerCase().includes(searchVal));

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('fantasyRequestsList');
    const countEl = document.getElementById('fantasyCount');
    if (countEl) countEl.textContent = filtered.length;
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-scroll"></i><h3>No fantasy requests yet</h3><p>Be the first to post a fantasy request</p><button class="btn btn-primary provider-btn" onclick="navigateTo(\'fantasy-request-create\')">Post a Request</button></div>';
        return;
    }

    container.innerHTML = filtered.map(r => {
        const cat = FANTASY_CATEGORIES[r.category] || { label: r.category, icon: 'fa-scroll', color: '#8a7b55' };
        const status = FANTASY_STATUSES[r.status] || { label: r.status, color: '#8a7b55', icon: 'fa-circle' };
        const responseCount = (r.responses || []).length;
        const isMine = r.authorId === 'current';
        return `
        <div class="forum-thread-card" style="cursor:pointer" onclick="viewFantasyRequest('${r.id}')">
            <div class="forum-thread-card-inner">
                <div class="forum-thread-content" style="width:100%">
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
                        <span class="forum-thread-category-badge" style="background:${cat.color}18;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                        ${isMine ? `<span class="status-badge" style="background:${status.color}20;color:${status.color}"><i class="fas ${status.icon}"></i> ${status.label}</span>` : '<span class="status-badge" style="background:#10b98120;color:#10b981"><i class="fas fa-check-circle"></i> Approved</span>'}
                    </div>
                    <h3 class="forum-thread-title">${escapeHtml(r.title)}</h3>
                    <p class="forum-thread-excerpt">${escapeHtml((r.description || '').substring(0, 120))}${(r.description || '').length > 120 ? '...' : ''}</p>
                    <div class="forum-thread-meta">
                        <span><i class="fas fa-tag"></i> R${r.price || 0} budget</span>
                        ${r.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(r.location)}</span>` : ''}
                        <span><i class="fas fa-comments"></i> ${responseCount} responses</span>
                        <span><i class="fas fa-clock"></i> ${getTimeAgo(r.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterFantasyRequests(category) {
    currentFantasyFilter = category;
    document.querySelectorAll('#page-fantasy-requests .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderFantasyRequests();
}

function searchFantasyRequests() { renderFantasyRequests(); }

function viewFantasyRequest(id) {
    const r = Storage.getFantasyRequests().find(x => x.id === id);
    if (!r) return;
    currentFantasyViewId = id;
    currentProviderFantasyViewId = id;
    const cat = FANTASY_CATEGORIES[r.category] || { label: r.category, icon: 'fa-scroll', color: '#8a7b55' };
    const status = FANTASY_STATUSES[r.status] || { label: r.status, color: '#8a7b55', icon: 'fa-circle' };
    const canRespond = r.status === 'approved' && currentProviderFantasyViewId === id && document.getElementById('page-provider-fantasy-requests');

    const container = document.getElementById('fantasyViewContent');
    if (!container) return;

    const responsesHtml = (r.responses || []).map(res => `
        <div class="fantasy-response-card">
            <div class="fantasy-response-avatar"><i class="fas fa-briefcase"></i></div>
            <div class="fantasy-response-body">
                <div class="fantasy-response-name">${escapeHtml(res.providerName || 'Provider')} <span class="mini-tag" style="background:#0ea5e918;color:#0ea5e9"><i class="fas fa-tag"></i> R${res.price || 0}</span></div>
                <p>${escapeHtml(res.message || '')}</p>
                <div class="fantasy-response-time">${getTimeAgo(res.createdAt)}</div>
            </div>
            ${r.authorId === 'current' ? `<button class="btn btn-secondary btn-sm" onclick="openResponseCompose('${res.providerId}', '${escapeHtml((res.providerName || 'Provider').replace(/'/g, "\\'"))}')" style="flex-shrink:0"><i class="fas fa-paper-plane"></i> Reply</button>` : ''}
        </div>
    `).join('') || '<p class="empty-text">No responses yet. Providers will respond with their best offer.</p>';

    const formHtml = document.getElementById('page-provider-fantasy-requests')
        ? `
        <div class="profile-card">
            <h2><i class="fas fa-reply"></i> Respond as Provider</h2>
            <form onsubmit="submitFantasyResponse(event)">
                <input type="hidden" id="fantasyResponseId" value="${r.id}">
                <input type="hidden" id="fantasyResponseProviderId" value="${getCurrentProviderIdentity().id}">
                <div class="form-grid" style="gap:12px">
                    <input type="text" id="fantasyResponseProvider" placeholder="Provider business name" value="${escapeHtml(getCurrentProviderIdentity().name)}" required>
                    <input type="number" id="fantasyResponsePrice" placeholder="Your offer (R)" min="0" step="0.01" required>
                </div>
                <textarea id="fantasyResponseMessage" placeholder="Describe your offer..." rows="3" style="margin-top:12px" required></textarea>
                <div style="text-align:right;margin-top:12px"><button class="btn btn-primary" type="submit"><i class="fas fa-paper-plane"></i> Submit Offer</button></div>
            </form>
        </div>`
        : '';

    container.innerHTML = `
        <div class="profile-card">
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
                <span class="badge" style="background:${cat.color}20;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                <span class="status-badge" style="background:${status.color}20;color:${status.color}"><i class="fas ${status.icon}"></i> ${status.label}</span>
            </div>
            <h1 style="font-size:1.5rem;margin-bottom:8px">${escapeHtml(r.title)}</h1>
            <div class="forum-thread-full-meta" style="margin-bottom:16px">
                <span><i class="fas fa-tag"></i> R${r.price || 0} budget</span>
                ${r.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(r.location)}</span>` : ''}
                <span><i class="fas fa-user"></i> General Member</span>
                <span><i class="fas fa-clock"></i> ${getTimeAgo(r.createdAt)}</span>
            </div>
            <p class="view-bio" style="white-space:pre-wrap;line-height:1.7">${escapeHtml(r.description || '')}</p>
            ${r.authorId === 'current' && r.status !== 'approved' ? `
                <div style="display:flex;gap:8px;margin-top:16px">
                    <button class="btn btn-secondary btn-sm" onclick="editFantasyRequest('${r.id}')"><i class="fas fa-edit"></i> Edit & Resubmit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFantasyRequest('${r.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>` : ''}
        </div>
        <div class="profile-card">
            <h2><i class="fas fa-comments"></i> Provider Offers (${(r.responses || []).length})</h2>
            ${responsesHtml}
        </div>
        ${formHtml}
        <div style="display:flex;gap:12px;margin-top:16px">
            <button class="btn btn-secondary" onclick="navigateTo('${document.getElementById('page-provider-fantasy-requests') ? 'provider-fantasy-requests' : 'fantasy-requests'}')"><i class="fas fa-arrow-left"></i> Back</button>
        </div>
    `;
    navigateTo('fantasy-view');
}

function editFantasyRequest(id) {
    const r = Storage.getFantasyRequests().find(x => x.id === id);
    if (!r) return;
    navigateTo('fantasy-request-create');
    setTimeout(() => {
        document.getElementById('fantasyRequestId').value = r.id;
        document.getElementById('fantasyTitle').value = r.title || '';
        document.getElementById('fantasyCategory').value = r.category || '';
        document.getElementById('fantasyPrice').value = r.price ?? '';
        document.getElementById('fantasyLocation').value = r.location || '';
        document.getElementById('fantasyDescription').value = r.description || '';
        const catSel = document.getElementById('fantasyCategory');
        if (catSel && catSel.options.length <= 1) {
            let opts = '<option value="">Select category</option>';
            Object.entries(FANTASY_CATEGORIES).forEach(([key, val]) => { opts += `<option value="${key}">${val.label}</option>`; });
            catSel.innerHTML = opts;
            catSel.value = r.category || '';
        }
        const locSel = document.getElementById('fantasyLocation');
        if (locSel && locSel.options.length <= 1) {
            locSel.insertAdjacentHTML('beforeend', generateSAProvinceOptions().replace('<option value="">All Provinces</option>', '<option value="">Select location</option>'));
            locSel.value = r.location || '';
        }
    }, 0);
}

function deleteFantasyRequest(id, confirmText) {
    if (!confirm(confirmText || 'Delete this fantasy request?')) return;
    Storage.setFantasyRequests(Storage.getFantasyRequests().filter(x => x.id !== id));
    showToast('Fantasy request deleted.');
    if (document.getElementById('page-fantasy-requests')) renderFantasyRequests();
    if (document.getElementById('page-provider-fantasy-requests')) renderProviderFantasyRequests();
}

function openResponseCompose(providerId, providerName) {
    openComposeTo(providerId, providerName, 'provider');
}

function submitFantasyResponse(e) {
    e.preventDefault();
    const id = document.getElementById('fantasyResponseId').value;
    const provider = document.getElementById('fantasyResponseProvider').value.trim();
    const providerId = document.getElementById('fantasyResponseProviderId')?.value || 'current';
    const price = parseFloat(document.getElementById('fantasyResponsePrice').value) || 0;
    const message = document.getElementById('fantasyResponseMessage').value.trim();
    if (!provider || !message) { showToast('Please fill in your offer.', 'error'); return; }

    const requests = Storage.getFantasyRequests();
    const idx = requests.findIndex(x => x.id === id);
    if (idx === -1) return;
    if (!requests[idx].responses) requests[idx].responses = [];
    requests[idx].responses.push({
        id: generateId(), providerId, providerName: provider,
        price, message, createdAt: new Date().toISOString()
    });
    Storage.setFantasyRequests(requests);
    showToast('Offer submitted!');
    viewFantasyRequest(id);
}

function renderProviderFantasyRequests() {
    const requests = Storage.getFantasyRequests().filter(r => r.status === 'approved' || r.authorId === 'current');
    let filtered = [...requests];
    const searchVal = (document.getElementById('providerFantasySearch')?.value || '').toLowerCase();
    if (searchVal) filtered = filtered.filter(r => r.title.toLowerCase().includes(searchVal));

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const container = document.getElementById('providerFantasyRequestsList');
    const countEl = document.getElementById('providerFantasyCount');
    if (countEl) countEl.textContent = filtered.length;
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-scroll"></i><h3>No fantasy requests yet</h3><p>Approved fantasy requests from members will appear here</p></div>';
        return;
    }

    container.innerHTML = filtered.map(r => {
        const cat = FANTASY_CATEGORIES[r.category] || { label: r.category, icon: 'fa-scroll', color: '#8a7b55' };
        const responseCount = (r.responses || []).length;
        const me = getCurrentProviderIdentity();
        const alreadyResponded = (r.responses || []).some(res => res.providerId === me.id);
        return `
        <div class="profile-list-card" style="cursor:pointer" onclick="viewFantasyRequest('${r.id}')">
            <div class="list-card-avatar" style="background:${cat.color}20; color:${cat.color}"><i class="fas ${cat.icon}"></i></div>
            <div class="list-card-info">
                <h3>${escapeHtml(r.title)}</h3>
                <p>${cat.label} &middot; R${r.price || 0} budget ${r.location ? '&middot; ' + escapeHtml(r.location) : ''}</p>
                <div class="list-card-tags">
                    <span class="mini-tag" style="background:#10b98118;color:#10b981"><i class="fas fa-check-circle"></i> Approved</span>
                    <span class="mini-tag" style="background:#3b82f618;color:#3b82f6"><i class="fas fa-comments"></i> ${responseCount} responses</span>
                </div>
            </div>
            <div class="list-card-actions">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); viewFantasyRequest('${r.id}')"><i class="fas ${alreadyResponded ? 'fa-check' : 'fa-paper-plane'}"></i> ${alreadyResponded ? 'View My Offer' : 'Respond'}</button>
                <button class="btn-icon" onclick="event.stopPropagation(); viewFantasyRequest('${r.id}')"><i class="fas fa-eye"></i></button>
            </div>
        </div>`;
    }).join('');
}

function searchProviderFantasyRequests() { renderProviderFantasyRequests(); }

// ==========================================
// ONBOARDING - First Visit Check
// ==========================================
(function checkOnboarding() {
    if (!localStorage.getItem('k2_onboarded')) {
        const overlay = document.getElementById('onboardingOverlay');
        if (overlay) overlay.classList.add('active');
    }
})();

function completeOnboarding() {
    localStorage.setItem('k2_onboarded', 'true');
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) {
        overlay.classList.add('exiting');
        setTimeout(() => overlay.classList.remove('active', 'exiting'), 800);
    }
    const tr = document.getElementById('k2TourTrigger');
    if (tr) tr.classList.remove('hidden');
}

// ==========================================
// SIDEBAR / MENU TOUR (tooltip coachmarks)
// ==========================================
const TOUR_LS_KEY = 'k2_sidebar_tour_done';
function tourDoneKey() { return TOUR_LS_KEY + '_' + currentTourPort(); }
const tourState = { active: false, index: 0, steps: [], prevEl: null };

const PORT_TOUR_STEPS = {
    user: [
        { id: 'tourUserDash', el: () => document.querySelector('#sidebar .nav-item[href="index.html"]'), title: 'Dashboard', text: 'Your home base. See your recent activity, saved items and quick access in one place.' },
        { id: 'tourUserCreate', el: () => document.querySelector('#sidebar .nav-item[data-page="user-create"]'), title: 'Create Profile', text: 'Build your own 2k2 profile so other members and providers can find and message you.' },
        { id: 'tourUserProfile', el: () => document.querySelector('#sidebar .nav-item[data-page="user-profile"]'), title: 'View Profile', text: 'Preview your public-facing profile exactly as other members see it.' },
        { id: 'tourDirectory', el: () => document.querySelector('#sidebar .nav-item[data-page="directory"]'), title: 'Profiles Directory', text: 'Browse service providers across all 9 provinces. Filter by category, view their full profile, book them or send a tip.' },
        { id: 'tourVenues', el: () => document.querySelector('#sidebar .nav-item[data-page="venue-directory"]'), title: 'Venues', text: 'Discover venues such as lodges, clubs and fetish venues available near you.' },
        { id: 'tourServices', el: () => document.querySelector('#sidebar .nav-item[data-page="services-directory"]'), title: 'Services', text: 'Browse bookable services offered by providers and request appointments with your chosen fee.' },
        { id: 'tourContent', el: () => document.querySelector('#sidebar .nav-item[data-page="content-directory"]'), title: 'Content', text: 'Explore premium content: videos, images, ASMR, podcasts and stories from creators.' },
        { id: 'tourEvents', el: () => document.querySelector('#sidebar .nav-item[data-page="events-directory"]'), title: 'Events', text: 'See upcoming events and parties you can attend or RSVP to.' },
        { id: 'tourBrowseAds', el: () => document.querySelector('#sidebar .nav-item[data-page="ads-browse"]'), title: 'Browse Ads', text: 'Browse personal and classified ads - everything from companionship to casual connections.' },
        { id: 'tourBrowseGigs', el: () => document.querySelector('#sidebar .nav-item[data-page="gigs-browse"]'), title: 'Browse Gigs', text: 'Find jobs and gigs, or browse talent you can hire for events and services.' },
        { id: 'tourProducts', el: () => document.querySelector('#sidebar .nav-item[data-page="products-directory"]'), title: 'Products', text: 'Shop physical and digital products listed by providers.' },
        { id: 'tourExperiences', el: () => document.querySelector('#sidebar .nav-item[data-page="experiences-browse"]'), title: 'Browse Experiences', text: 'Discover paid experiences - from dates to group sessions - offered by providers.' },
        { id: 'tourFantasy', el: () => document.querySelector('#sidebar .nav-item[data-page="fantasy-requests"]'), title: 'Fantasy Requests', text: 'Browse fantasy requests posted by members, or find one you can fulfil.' },
        { id: 'tourFantasyCreate', el: () => document.querySelector('#sidebar .nav-item[data-page="fantasy-request-create"]'), title: 'Post Fantasy Request', text: 'Post your own fantasy request so providers can make you an offer.' },
        { id: 'tourForum', el: () => document.querySelector('#sidebar .nav-item[data-page="forum-browse"]'), title: 'Browse Forum', text: 'Join community discussion across public and premium forums.' },
        { id: 'tourForumCreate', el: () => document.querySelector('#sidebar .nav-item[data-page="forum-create"]'), title: 'New Thread', text: 'Start a new forum thread and engage with the community.' },
        { id: 'tourMyThreads', el: () => document.querySelector('#sidebar .nav-item[data-page="user-forum-threads"]'), title: 'My Threads', text: 'Review, edit or delete the forum threads you have started.' },
        { id: 'tourPostAd', el: () => document.querySelector('#sidebar .nav-item[data-page="ads-create"]'), title: 'Post an Ad', text: 'Create your own personal or classified ad.' },
        { id: 'tourMyAds', el: () => document.querySelector('#sidebar .nav-item[data-page="user-ads"]'), title: 'My Ads', text: 'Manage and update the ads you have posted.' },
        { id: 'tourInbox', el: () => document.querySelector('#sidebar .nav-item[data-page="inbox"]'), title: 'Inbox', text: 'Read and reply to all your private messages.' },
        { id: 'tourCompose', el: () => document.querySelector('#sidebar .nav-item[data-page="message-compose"]'), title: 'New Message', text: 'Send a direct message to another member.' },
        { id: 'tourOnline', el: () => document.querySelector('#sidebar .nav-item[data-page="online-users"]'), title: 'Online Users', text: 'See who is currently online and start a conversation.' },
        { id: 'tourBookings', el: () => document.querySelector('#sidebar .nav-item[data-page="user-bookings"]'), title: 'My Bookings', text: 'Track your bookings, confirmations and any booking fees paid.' },
        { id: 'tourWallet', el: () => document.querySelector('#sidebar .nav-item[data-page="user-wallet"]'), title: 'My Wallet', text: 'Top up, withdraw and keep track of your balance and transactions.' },
        { id: 'tourSaved', el: () => document.querySelector('#sidebar .nav-item[data-page="saved-items"]'), title: 'Saved Items', text: 'One place to view every profile, listing or item you have bookmarked.' },
        { id: 'tourDownloads', el: () => document.querySelector('#sidebar .nav-item[data-page="downloads"]'), title: 'Downloads', text: 'Access the premium content you have purchased or downloaded.' },
        { id: 'tourUserSettings', el: () => document.querySelector('#sidebar .nav-item[data-page="user-settings"]'), title: 'Settings', text: 'Manage your account, privacy and notification preferences.' },
        { id: 'tourSwitchProvider', el: () => document.querySelector('#sidebar .nav-item[href="provider.html"]'), title: 'Service Provider Portal', text: 'Switch to the provider portal to sell services, host events and start earning.' },
        { id: 'tourHowItWorks', el: () => document.querySelector('#sidebar .nav-item[data-page="how-it-works"]'), title: 'How It Works', text: 'Learn how 2k2 works - costs, features and how to get started.' },
        { id: 'tourHelp', el: () => document.querySelector('#sidebar .nav-item[data-page="help-queries"]'), title: 'Help', text: 'Get support or submit an enquiry to the 2k2 team.' }
    ],
    userBottom: [
        { id: 'tourBH', el: () => document.querySelector('#bottomNav .bottom-nav-item[data-page="user-dashboard"]'), title: 'Home', text: 'Your dashboard and quick access hub.' },
        { id: 'tourBMenu', el: () => document.getElementById('bottomNavMenu'), title: 'Menu', text: 'Open the main navigation menu to jump anywhere on 2k2.' },
        { id: 'tourBM', el: () => document.querySelector('#bottomNav .bottom-nav-item[data-page="inbox"]'), title: 'Messages', text: 'Open your private inbox.' },
        { id: 'tourBP', el: () => document.querySelector('#bottomNav .bottom-nav-item[data-page="user-profile"]'), title: 'Profile', text: 'View your public profile.' }
    ],
    provider: [
        { id: 'tourPdash', el: () => document.querySelector('#sidebar .nav-item[href="provider.html"]'), title: 'Dashboard', text: 'Your provider control centre - see earnings, bookings and platform stats at a glance.' },
        { id: 'tourPcreate', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-create"]'), title: 'Create Profile', text: 'Set up your provider business profile for members to find.' },
        { id: 'tourPprofile', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-profile"]'), title: 'View Profile', text: 'Preview how your public provider profile appears to clients.' },
        { id: 'tourPlistings', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-directory"]'), title: 'My Listings', text: 'Manage the directory listings you have published with your own booking fees and links.' },
        { id: 'tourPlistingNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-listing-create"]'), title: 'New Listing', text: 'Create a new directory listing so clients can find, book and tip you.' },
        { id: 'tourPvenues', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-venue-directory"]'), title: 'My Venues', text: 'Manage the venues you host at or operate.' },
        { id: 'tourPvenueNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-venue-create"]'), title: 'New Venue', text: 'Add a new venue to attract clients.' },
        { id: 'tourPservices', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-services"]'), title: 'My Services', text: 'Manage the services you offer, each with its own price and booking fee.' },
        { id: 'tourPserviceNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-service-create"]'), title: 'New Service', text: 'Create a bookable service with your own rate and booking fee.' },
        { id: 'tourProducts', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-products"]'), title: 'My Products', text: 'Manage the physical and digital products you sell.' },
        { id: 'tourPproductNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-product-create"]'), title: 'New Product', text: 'Add a new product to your store.' },
        { id: 'tourPorders', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-orders"]'), title: 'Product Orders', text: 'Review and fulfil orders placed by customers.' },
        { id: 'tourPcontent', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-content"]'), title: 'My Content', text: 'Manage your premium content catalogue.' },
        { id: 'tourPcontentNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-content-create"]'), title: 'New Content', text: 'Publish premium content such as videos, images or audio to sell.' },
        { id: 'tourPevents', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-events"]'), title: 'My Events', text: 'Manage the events you host and their promotion.' },
        { id: 'tourPeventNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-event-create"]'), title: 'New Event', text: 'Create a new event or party for members to attend.' },
        { id: 'tourForum', el: () => document.querySelector('#sidebar .nav-item[data-page="forum-browse"]'), title: 'Browse Forum', text: 'Participate in community forums to build your presence.' },
        { id: 'tourForumCreate', el: () => document.querySelector('#sidebar .nav-item[data-page="forum-create"]'), title: 'New Thread', text: 'Start a forum thread to engage with members.' },
        { id: 'tourPMyThreads', el: () => document.querySelector('#sidebar .nav-item[data-page="user-forum-threads"]'), title: 'My Threads', text: 'Review threads you have started in the forum.' },
        { id: 'tourPBrowseGigs', el: () => document.querySelector('#sidebar .nav-item[data-page="gigs-browse"]'), title: 'Browse Gigs', text: 'Browse gigs and job opportunities in the marketplace.' },
        { id: 'tourPMyGigs', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-gigs"]'), title: 'My Gigs', text: 'Manage the gigs or job posts you have created.' },
        { id: 'tourPPostGig', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-gig-create"]'), title: 'Post a Gig', text: 'Post a gig - advertise work you offer or talent you need.' },
        { id: 'tourPMyAds', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-ads"]'), title: 'My Ads', text: 'Manage your personal and classified ads.' },
        { id: 'tourPPostAd', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-ads-create"]'), title: 'Post an Ad', text: 'Create an ad to promote yourself or your offerings.' },
        { id: 'tourInbox', el: () => document.querySelector('#sidebar .nav-item[data-page="inbox"]'), title: 'Inbox', text: 'Read and reply to client messages.' },
        { id: 'tourCompose', el: () => document.querySelector('#sidebar .nav-item[data-page="message-compose"]'), title: 'New Message', text: 'Compose a direct message to a member.' },
        { id: 'tourOnline', el: () => document.querySelector('#sidebar .nav-item[data-page="online-users"]'), title: 'Online Users', text: 'See who is online to engage with.' },
        { id: 'tourPBookings', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-bookings"]'), title: 'Bookings', text: 'Manage incoming bookings, confirm them and collect your booking fees.' },
        { id: 'tourPTips', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-tips"]'), title: 'Tips Received', text: 'See tips sent to you by grateful clients.' },
        { id: 'tourPExps', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-experiences"]'), title: 'My Experiences', text: 'Manage the paid experiences you host.' },
        { id: 'tourPExpNew', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-experience-create"]'), title: 'Add Experience', text: 'Create and price a new paid experience.' },
        { id: 'tourPFantasy', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-fantasy-requests"]'), title: 'Fantasy Requests', text: 'Browse and respond to fantasy requests from members.' },
        { id: 'tourPWallet', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-wallet"]'), title: 'My Earnings', text: 'Track earnings, withdrawals and your wallet balance.' },
        { id: 'tourSaved', el: () => document.querySelector('#sidebar .nav-item[data-page="saved-items"]'), title: 'Saved Items', text: 'Items you have saved across the platform.' },
        { id: 'tourPDownloads', el: () => document.querySelector('#sidebar .nav-item[data-page="downloads"]'), title: 'Downloads', text: 'Files and content you have downloaded.' },
        { id: 'tourPSwitchUser', el: () => document.querySelector('#sidebar .nav-item[href="index.html"]'), title: 'General User Portal', text: 'Switch back to the general user view of the app.' },
        { id: 'tourPsettings', el: () => document.querySelector('#sidebar .nav-item[data-page="provider-settings"]'), title: 'Settings', text: 'Manage your provider account settings.' },
        { id: 'tourPHowItWorks', el: () => document.querySelector('#sidebar .nav-item[data-page="how-it-works"]'), title: 'How It Works', text: 'Understand how the provider side of 2k2 works.' }
    ],
    providerBottom: [
        { id: 'tourPBH', el: () => document.querySelector('#bottomNav .bottom-nav-item[data-page="provider-dashboard"]'), title: 'Home', text: 'Your provider dashboard.' },
        { id: 'tourPBMenu', el: () => document.getElementById('bottomNavMenu'), title: 'Menu', text: 'Open the main navigation menu to manage your listings, bookings and earnings.' },
        { id: 'tourPBM', el: () => document.querySelector('#bottomNav .bottom-nav-item[data-page="inbox"]'), title: 'Messages', text: 'Open your client inbox.' },
        { id: 'tourPBP', el: () => document.querySelector('#bottomNav .bottom-nav-item[data-page="provider-profile"]'), title: 'Profile', text: 'View your provider profile.' }
    ]
};

const PORT_CONTENT = {
    user: { badge: 'General User', stepsKey: 'user', bottomKey: 'userBottom' },
    provider: { badge: 'Service Provider', stepsKey: 'provider', bottomKey: 'providerBottom' }
};

function isProviderPortalPage() {
    return typeof window !== 'undefined' && window.location.pathname.includes('provider.html');
}

function currentTourPort() {
    return isProviderPortalPage() ? 'provider' : 'user';
}

function buildTourSteps() {
    const port = currentTourPort();
    const cfg = PORT_CONTENT[port];
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        return (PORT_TOUR_STEPS[cfg.bottomKey] || []).filter(s => s.el() != null);
    }
    return (PORT_TOUR_STEPS[cfg.stepsKey] || []).filter(s => s.el() != null);
}

function ensureTourDOM() {
    if (document.getElementById('k2TourOverlay')) return;
    const frag = document.createDocumentFragment();

    const btn = document.createElement('button');
    btn.id = 'k2TourTrigger';
    btn.className = 'k2-tour-trigger';
    btn.innerHTML = '<i class="fas fa-compass"></i><span>Tour</span>';
    btn.title = 'Take the guided tour';
    btn.addEventListener('click', () => startSidebarTour());
    frag.appendChild(btn);

    // The dim scrim. Kept BELOW the lifted sidebar z-index (11002) so the
    // menu stays visibly/clickable while the tour highlights an item.
    const overlay = document.createElement('div');
    overlay.id = 'k2TourOverlay';
    overlay.className = 'k2-tour-overlay';
    overlay.addEventListener('click', (e) => { if (e.target === overlay) stepTour(1); });
    frag.appendChild(overlay);

    // Highlight + tooltip are appended DIRECTLY to <body> (siblings of the
    // overlay/sidebar), each in its own stacking context. Their z-index sits
    // ABOVE the lifted sidebar (11002) so the menu can never cover the
    // tooltip, while the dim overlay still stays beneath the menu.
    const highlight = document.createElement('div');
    highlight.id = 'k2TourHighlight';
    highlight.className = 'k2-tour-highlight';
    frag.appendChild(highlight);

    const tooltip = document.createElement('div');
    tooltip.id = 'k2TourTooltip';
    tooltip.className = 'k2-tour-tooltip';
    tooltip.innerHTML =
        '<button class="k2-tour-close" id="k2TourClose" title="Skip tour"><i class="fas fa-xmark"></i></button>' +
        '<div class="k2-tour-badge" id="k2TourBadge"></div>' +
        '<h3 class="k2-tour-title" id="k2TourTitle"></h3>' +
        '<p class="k2-tour-text" id="k2TourText"></p>' +
        '<div class="k2-tour-progress" id="k2TourProgress"></div>' +
        '<div class="k2-tour-actions">' +
            '<button class="k2-tour-btn k2-tour-skip" id="k2TourSkip">Skip tour</button>' +
            '<button class="k2-tour-btn k2-tour-prev" id="k2TourPrev"><i class="fas fa-chevron-left"></i> Back</button>' +
            '<button class="k2-tour-btn k2-tour-next" id="k2TourNext">Next <i class="fas fa-chevron-right"></i></button>' +
        '</div>';
    frag.appendChild(tooltip);

    document.body.appendChild(frag);

    document.getElementById('k2TourClose').addEventListener('click', skipSidebarTour);
    document.getElementById('k2TourSkip').addEventListener('click', skipSidebarTour);
    document.getElementById('k2TourPrev').addEventListener('click', () => stepTour(-1));
    document.getElementById('k2TourNext').addEventListener('click', () => {
        // "Done" (last step) must end the tour immediately; otherwise advance.
        if (tourState.index >= tourState.steps.length - 1) finishTour();
        else stepTour(1);
    });
}

function tourKeyHandler(e) {
    if (!tourState.active) return;
    if (e.key === 'Escape') { skipSidebarTour(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepTour(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepTour(-1); }
}

function startSidebarTour() {
    if (tourState.active) return;
    ensureTourDOM();
    tourState.steps = buildTourSteps();
    if (!tourState.steps.length) return;
    tourState.index = 0;
    tourState.active = true;
    document.addEventListener('keydown', tourKeyHandler);
    document.getElementById('k2TourTrigger').classList.add('hidden');
    document.getElementById('k2TourOverlay').classList.add('active');
    const liftSidebar = document.getElementById('sidebar');
    if (liftSidebar) liftSidebar.classList.add('k2-tour-lift');
    const liftBottom = document.getElementById('bottomNav');
    if (liftBottom) liftBottom.classList.add('k2-tour-lift');
    renderTourStep();
}

function markTourDone() {
    try { localStorage.setItem(tourDoneKey(), '1'); } catch (e) { /* storage unavailable/private mode */ }
}

function hideTourChrome() {
    const h = document.getElementById('k2TourHighlight');
    const t = document.getElementById('k2TourTooltip');
    if (h) h.style.display = 'none';
    if (t) t.style.display = 'none';
}

function tourCleanup() {
    const ls = document.getElementById('sidebar');
    if (ls) ls.classList.remove('k2-tour-lift');
    const lb = document.getElementById('bottomNav');
    if (lb) lb.classList.remove('k2-tour-lift');
    if (tourState.prevEl) {
        tourState.prevEl.classList.remove('k2-tour-active-item');
        tourState.prevEl = null;
    }
}

function skipSidebarTour() {
    if (!tourState.active) return;
    tourState.active = false;
    markTourDone();
    document.getElementById('k2TourOverlay').classList.remove('active');
    document.getElementById('k2TourTrigger').classList.remove('hidden');
    document.removeEventListener('keydown', tourKeyHandler);
    tourCleanup();
    hideTourChrome();
}

function stepTour(dir) {
    if (!tourState.active) return;
    tourState.index += dir;
    if (tourState.index < 0 || tourState.index >= tourState.steps.length) {
        finishTour();
        return;
    }
    renderTourStep();
}

function finishTour() {
    tourState.active = false;
    markTourDone();
    const ov = document.getElementById('k2TourOverlay');
    if (ov) ov.classList.remove('active');
    const tr = document.getElementById('k2TourTrigger');
    if (tr) tr.classList.remove('hidden');
    document.removeEventListener('keydown', tourKeyHandler);
    tourCleanup();
    hideTourChrome();
}

function renderTourStep() {
    if (!tourState.steps.length) return;
    const step = tourState.steps[tourState.index];
    const el = step.el && step.el();
    const total = tourState.steps.length;
    const port = currentTourPort();
    const cfg = PORT_CONTENT[port];

    if (tourState.prevEl && tourState.prevEl !== el) {
        tourState.prevEl.classList.remove('k2-tour-active-item');
        tourState.prevEl = null;
    }

    const badge = document.getElementById('k2TourBadge');
    if (badge) badge.innerHTML = '<i class="fas ' + (port === 'provider' ? 'fa-briefcase' : 'fa-user') + '"></i> ' + cfg.badge +
        ' &middot; ' + (tourState.index + 1) + ' / ' + total;

    document.getElementById('k2TourTitle').textContent = step.title || '';
    document.getElementById('k2TourText').textContent = step.text || '';

    const progress = document.getElementById('k2TourProgress');
    progress.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'k2-tour-dot' + (i === tourState.index ? ' active' : '');
        progress.appendChild(dot);
    }

    const next = document.getElementById('k2TourNext');
    const prev = document.getElementById('k2TourPrev');
    const skip = document.getElementById('k2TourSkip');
    if (tourState.index === total - 1) {
        next.innerHTML = '<i class="fas fa-check"></i> Done';
        skip.style.display = 'none';
    } else {
        next.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        skip.style.display = '';
    }
    prev.style.display = tourState.index === 0 ? 'none' : '';

    if (el) {
        el.classList.add('k2-tour-active-item');
        tourState.prevEl = el;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(() => positionTour(el), 320);
    } else {
        document.getElementById('k2TourHighlight').style.display = 'none';
        document.getElementById('k2TourTooltip').style.display = 'block';
        document.getElementById('k2TourTooltip').style.top = '40%';
        document.getElementById('k2TourTooltip').style.left = '50%';
        document.getElementById('k2TourTooltip').style.transform = 'translate(-50%, -50%)';
    }
}

function positionTour(el) {
    const rect = el.getBoundingClientRect();
    const h = document.getElementById('k2TourHighlight');
    const tip = document.getElementById('k2TourTooltip');
    const pad = 6;
    h.style.display = 'block';
    tip.style.display = 'block';
    h.style.top = (rect.top - pad) + 'px';
    h.style.left = (rect.left - pad) + 'px';
    h.style.width = (rect.width + pad * 2) + 'px';
    h.style.height = (rect.height + pad * 2) + 'px';

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;

    let top, left;
    // Default: below the target
    if (rect.bottom + th + 16 <= vh - 16) {
        top = rect.bottom + 16;
    } else if (rect.top - th - 16 >= 16) {
        top = rect.top - th - 16;
    } else {
        top = Math.max(16, Math.min(vh - th - 16, (vh - th) / 2));
    }
    left = rect.left + rect.width / 2 - tw / 2;
    if (left < 16) left = 16;
    if (left + tw > vw - 16) left = vw - tw - 16;

    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    tip.style.transform = 'none';
}

function isTourAvailable() {
    if (isProviderPortalPage()) return true;
    const p = (window.location.pathname.split('/').pop() || '').toLowerCase();
    if (!p || p === 'index.html') return true;
    return false;
}

function initTour() {
    if (!document.body || !isTourAvailable()) return;
    ensureTourDOM();
    const onb = document.getElementById('onboardingOverlay');
    if (onb && onb.classList.contains('active')) {
        // Keep the floating Tour button off the onboarding cards; completeOnboarding() restores it.
        const tr = document.getElementById('k2TourTrigger');
        if (tr) tr.classList.add('hidden');
        return;
    }
    if (localStorage.getItem(tourDoneKey())) return;
    const port = currentTourPort();
    const cfg = PORT_CONTENT[port];
    const steps = (window.innerWidth <= 768 ? PORT_TOUR_STEPS[cfg.bottomKey] : PORT_TOUR_STEPS[cfg.stepsKey]) || [];
    if (!steps.length) return;
    window.setTimeout(() => startSidebarTour(), 1800);
}

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTour);
    } else {
        initTour();
    }
})();