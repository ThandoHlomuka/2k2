// ==========================================
// 2k2 - CRUD Profile Management System
// ==========================================
// Storage hooks ready for Vercel integration
// Replace localStorage calls with your storage API

const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('k2_users') || '[]'),
    setUsers: (data) => localStorage.setItem('k2_users', JSON.stringify(data)),
    getProviders: () => JSON.parse(localStorage.getItem('k2_providers') || '[]'),
    setProviders: (data) => localStorage.setItem('k2_providers', JSON.stringify(data)),
    getListings: () => JSON.parse(localStorage.getItem('k2_listings') || '[]'),
    setListings: (data) => localStorage.setItem('k2_listings', JSON.stringify(data)),
    getVenues: () => JSON.parse(localStorage.getItem('k2_venues') || '[]'),
    setVenues: (data) => localStorage.setItem('k2_venues', JSON.stringify(data)),
    getAds: () => JSON.parse(localStorage.getItem('k2_ads') || '[]'),
    setAds: (data) => localStorage.setItem('k2_ads', JSON.stringify(data)),
    getServices: () => JSON.parse(localStorage.getItem('k2_services') || '[]'),
    setServices: (data) => localStorage.setItem('k2_services', JSON.stringify(data)),
    getBookings: () => JSON.parse(localStorage.getItem('k2_bookings') || '[]'),
    setBookings: (data) => localStorage.setItem('k2_bookings', JSON.stringify(data)),
    getTips: () => JSON.parse(localStorage.getItem('k2_tips') || '[]'),
    setTips: (data) => localStorage.setItem('k2_tips', JSON.stringify(data)),
    getCustomServiceTypes: () => JSON.parse(localStorage.getItem('k2_service_types') || '[]'),
    setCustomServiceTypes: (data) => localStorage.setItem('k2_service_types', JSON.stringify(data)),
    getWallets: () => JSON.parse(localStorage.getItem('k2_wallets') || '[]'),
    setWallets: (data) => localStorage.setItem('k2_wallets', JSON.stringify(data)),
    getTransactions: () => JSON.parse(localStorage.getItem('k2_transactions') || '[]'),
    setTransactions: (data) => localStorage.setItem('k2_transactions', JSON.stringify(data)),
    getTopUpRequests: () => JSON.parse(localStorage.getItem('k2_topup_requests') || '[]'),
    setTopUpRequests: (data) => localStorage.setItem('k2_topup_requests', JSON.stringify(data)),
    getWithdrawalRequests: () => JSON.parse(localStorage.getItem('k2_withdrawal_requests') || '[]'),
    setWithdrawalRequests: (data) => localStorage.setItem('k2_withdrawal_requests', JSON.stringify(data)),
    getContent: () => JSON.parse(localStorage.getItem('k2_content') || '[]'),
    setContent: (data) => localStorage.setItem('k2_content', JSON.stringify(data)),
    getEvents: () => JSON.parse(localStorage.getItem('k2_events') || '[]'),
    setEvents: (data) => localStorage.setItem('k2_events', JSON.stringify(data)),
    getContentComments: () => JSON.parse(localStorage.getItem('k2_content_comments') || '[]'),
    setContentComments: (data) => localStorage.setItem('k2_content_comments', JSON.stringify(data)),
    getContentReactions: () => JSON.parse(localStorage.getItem('k2_content_reactions') || '[]'),
    setContentReactions: (data) => localStorage.setItem('k2_content_reactions', JSON.stringify(data)),
    getReviews: () => JSON.parse(localStorage.getItem('k2_reviews') || '[]'),
    setReviews: (data) => localStorage.setItem('k2_reviews', JSON.stringify(data)),
    getForumThreads: () => JSON.parse(localStorage.getItem('k2_forum_threads') || '[]'),
    setForumThreads: (data) => localStorage.setItem('k2_forum_threads', JSON.stringify(data)),
    getForumReplies: () => JSON.parse(localStorage.getItem('k2_forum_replies') || '[]'),
    setForumReplies: (data) => localStorage.setItem('k2_forum_replies', JSON.stringify(data)),
    getForumLikes: () => JSON.parse(localStorage.getItem('k2_forum_likes') || '[]'),
    setForumLikes: (data) => localStorage.setItem('k2_forum_likes', JSON.stringify(data)),
    clearAll: () => { ['k2_users','k2_providers','k2_listings','k2_venues','k2_ads','k2_services','k2_bookings','k2_tips','k2_service_types','k2_wallets','k2_transactions','k2_topup_requests','k2_withdrawal_requests','k2_content','k2_events','k2_content_comments','k2_content_reactions','k2_reviews','k2_forum_threads','k2_forum_replies','k2_forum_likes'].forEach(k => localStorage.removeItem(k)); }
};

const DIRECTORY_TYPES = {
    'content-creator': { label: 'Content Creator', icon: 'fa-video', color: '#8b5cf6' },
    'model': { label: 'Model', icon: 'fa-camera-retro', color: '#ec4899' },
    'exotic-dancer': { label: 'Exotic Dancer', icon: 'fa-music', color: '#f59e0b' },
    'escort': { label: 'Escort', icon: 'fa-gem', color: '#6366f1' },
    'nude-chef': { label: 'Nude Chef', icon: 'fa-utensils', color: '#ef4444' }
};

const VENUE_TYPES = {
    'bnb': { label: 'B&B', icon: 'fa-house-chimney', color: '#10b981' },
    'lodge': { label: 'Lodge', icon: 'fa-campground', color: '#f59e0b' },
    'hotel': { label: 'Hotel', icon: 'fa-bed', color: '#3b82f6' },
    'fetish-club': { label: 'Fetish Club', icon: 'fa-mask', color: '#8b5cf6' },
    'nightclub': { label: 'Nightclub', icon: 'fa-moon', color: '#6366f1' },
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#64748b' }
};

const AD_CATEGORIES = {
    'personal': { label: 'Personal', icon: 'fa-heart', color: '#ec4899' },
    'services-offered': { label: 'Services Offered', icon: 'fa-hand-holding-heart', color: '#8b5cf6' },
    'services-wanted': { label: 'Services Wanted', icon: 'fa-search', color: '#3b82f6' },
    'general': { label: 'General', icon: 'fa-tag', color: '#64748b' }
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
    'other': { label: 'Other', icon: 'fa-ellipsis', color: '#64748b' }
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
    return getAllServiceTypes().find(t => t.slug === slug) || { label: slug, icon: 'fa-concierge-bell', color: '#64748b' };
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

function getOrCreateWallet(ownerType, ownerId) {
    const wallets = Storage.getWallets();
    const walletId = getWalletId(ownerType, ownerId);
    let wallet = wallets.find(w => w.id === walletId);
    if (!wallet) {
        wallet = { id: walletId, ownerType, ownerId, balance: 0, currency: 'ZAR', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
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
    return wallet.balance;
}

function getWalletTransactions(ownerType, ownerId) {
    const walletId = getWalletId(ownerType, ownerId);
    return Storage.getTransactions().filter(t => t.walletId === walletId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
let currentServicesFilter = 'all';
let providerServiceTags = [];
let providerServiceGallery = [];
let currentBookingProviderId = null;
let currentBookingProviderType = null;
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
    const menuToggle = document.getElementById('menuToggle');
    
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

    if (page === 'user-dashboard') renderUserProfiles();
    if (page === 'provider-dashboard') renderProviderProfiles();
    if (page === 'user-create') resetUserForm();
    if (page === 'provider-create') resetProviderForm();
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
    if (page === 'content-directory') renderContentDirectory();
    if (page === 'provider-content') renderProviderContent();
    if (page === 'provider-content-create') resetContentForm();
    if (page === 'events-directory') renderEventsDirectory();
    if (page === 'provider-events') renderProviderEvents();
    if (page === 'provider-event-create') resetEventForm();
    if (page === 'user-settings') loadUserSettings();
    if (page === 'provider-settings') loadProviderSettings();
}

// ==========================================
// Sidebar
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeBtn');

    menuToggle.addEventListener('click', () => { sidebar.classList.remove('hidden'); menuToggle.classList.remove('visible'); });
    closeBtn.addEventListener('click', () => { sidebar.classList.add('hidden'); menuToggle.classList.add('visible'); });

    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-page'));
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
});

function closeSidebar() {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('menuToggle').classList.add('visible');
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

function resetUserForm() {
    document.getElementById('userProfileForm').reset();
    document.getElementById('userProfileId').value = '';
    document.getElementById('userFormTitle').textContent = 'Create General User Profile';
    document.getElementById('userSubmitBtn').textContent = 'Create Profile';
    userTags = [];
    renderUserTags();
    document.getElementById('userPhotoPreview').innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
}

function handleUserSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('userProfileId').value;
    const now = new Date().toISOString();
    
    const profile = {
        id: id || generateId(),
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
    navigateTo('user-dashboard');
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
                <button class="btn-icon" onclick="event.stopPropagation(); editUserById('${u.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger-icon" onclick="event.stopPropagation(); promptDeleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterUserProfiles() { renderUserProfiles(document.getElementById('userFilter').value); }

function viewUserProfile(id) {
    const users = Storage.getUsers();
    const u = users.find(p => p.id === id);
    if (!u) return;
    currentViewUserId = id;

    document.getElementById('userViewName').textContent = u.fullName;
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

    navigateTo('user-profile');
}

function editUserById(id) {
    const users = Storage.getUsers();
    const u = users.find(p => p.id === id);
    if (!u) return;
    populateUserForm(u);
    navigateTo('user-create');
}

function editUserProfile() {
    if (!currentViewUserId) return;
    editUserById(currentViewUserId);
}

function populateUserForm(u) {
    document.getElementById('userProfileId').value = u.id;
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
    populateProviderForm(p);
    navigateTo('provider-create');
}

function editProviderProfile() { if (currentViewProviderId) editProviderById(currentViewProviderId); }

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

// ==========================================
// DIRECTORY - BROWSE (General User Page)
// ==========================================
function renderDirectory() {
    const listings = Storage.getListings();
    const container = document.getElementById('directoryList');
    if (!container) return;

    let filtered = listings.filter(l => l.status === 'active');
    
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
                    <span class="directory-card-rate">${l.rate || 'Contact'}</span>
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
        galleryContainer.innerHTML = l.gallery.map(img => `<div class="gallery-item"><img src="${img}" alt=""></div>`).join('');
    } else {
        galleryContainer.innerHTML = '<p class="empty-text">No gallery images</p>';
    }

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const availContainer = document.getElementById('dirViewAvailability');
    availContainer.innerHTML = days.map((d, i) => '<span class="day-badge ' + (l.availability?.[d] ? 'day-active' : 'day-inactive') + '">' + dayLabels[i] + '</span>').join('');

    renderReviewsList('profile', id);
    initStarRating('profileStarRating');
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
    renderListingTags();
    renderGalleryUpload();
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
        website: document.getElementById('listingWebsite').value,
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
    document.getElementById('listingWebsite').value = l.website || '';
    document.getElementById('listingBio').value = l.bio || '';
    document.getElementById('listingFormTitle').textContent = 'Edit Directory Listing';
    document.getElementById('listingSubmitBtn').textContent = 'Update Listing';

    listingTags = [...(l.tags || [])];
    listingGallery = [...(l.gallery || [])];
    renderListingTags();
    renderGalleryUpload();

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

    let filtered = venues.filter(v => v.status === 'active');

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
        galleryContainer.innerHTML = v.gallery.map(img => `<div class="gallery-item"><img src="${img}" alt=""></div>`).join('');
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

    let filtered = ads.filter(a => a.status === 'active');

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
    typeBadge.style.background = (cat.color || '#64748b') + '20';
    typeBadge.style.color = cat.color || '#64748b';

    const tagsContainer = document.getElementById('adViewTags');
    if (a.tags && a.tags.length > 0) {
        tagsContainer.innerHTML = a.tags.map(t => `<span class="tag">${t}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<span class="tag empty-tag">No tags</span>';
    }

    const galleryContainer = document.getElementById('adViewGallery');
    if (a.gallery && a.gallery.length > 0) {
        galleryContainer.innerHTML = a.gallery.map(img => `<div class="gallery-item"><img src="${img}" alt=""></div>`).join('');
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
function renderServicesDirectory() {
    const services = Storage.getServices();
    const search = (document.getElementById('servicesSearch')?.value || '').toLowerCase();
    const location = document.getElementById('servicesLocationFilter')?.value || '';
    const sortBy = document.getElementById('servicesSort')?.value || 'newest';

    // Re-render filter tabs dynamically
    const filterContainer = document.querySelector('#page-services-directory .filter-tabs');
    if (filterContainer) filterContainer.innerHTML = getServiceTypeFilterHTML();

    let filtered = services.filter(s => {
        if (currentServicesFilter !== 'all' && s.category !== currentServicesFilter) return false;
        if (location && s.location !== location) return false;
        if (search) {
            const searchFields = [s.name, s.email, s.phone, s.location, s.rate, s.bio, s.category, ...(s.tags || [])].join(' ').toLowerCase();
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
    document.getElementById('svcViewRate').textContent = s.rate || '-';
    document.getElementById('svcViewBio').textContent = s.bio || 'No description provided.';
    const website = document.getElementById('svcViewWebsite');
    if (s.website) { website.href = s.website; website.textContent = s.website; }
    else { website.href = '#'; website.textContent = '-'; }

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
    renderServiceTags();
    renderServiceGalleryUpload();
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
    const id = document.getElementById('serviceId').value;
    const serviceData = {
        name: document.getElementById('serviceName').value.trim(),
        category: document.getElementById('serviceCategory').value,
        email: document.getElementById('serviceEmail').value.trim(),
        phone: document.getElementById('servicePhone').value.trim(),
        location: document.getElementById('serviceLocation').value,
        rate: document.getElementById('serviceRate').value.trim(),
        website: document.getElementById('serviceWebsite').value.trim(),
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
    if (id) {
        const idx = services.findIndex(s => s.id === id);
        if (idx !== -1) { services[idx] = { ...services[idx], ...serviceData, updatedAt: new Date().toISOString() }; }
        showToast('Service updated!', 'success');
    } else {
        serviceData.id = generateId();
        serviceData.createdAt = new Date().toISOString();
        services.push(serviceData);
        showToast('Service published!', 'success');
    }
    Storage.setServices(services);
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
    document.getElementById('serviceRate').value = s.rate || '';
    document.getElementById('serviceWebsite').value = s.website || '';

    serviceTags = [...(s.tags || [])];
    serviceGallery = [...(s.gallery || [])];
    renderServiceTags();
    renderServiceGalleryUpload();

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
function openBookingModal(providerId, providerType) {
    currentBookingProviderId = providerId;
    currentBookingProviderType = providerType;
    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.getElementById('bookingForm').reset();
    currentBookingProviderId = null;
    currentBookingProviderType = null;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const booking = {
        id: generateId(),
        providerId: currentBookingProviderId,
        providerType: currentBookingProviderType,
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

    // Deduct booking fee from user wallet
    adjustWallet('user', 'general', -50, 'booking-fee', `Booking request sent to provider`, { bookingId: booking.id });

    const bookings = Storage.getBookings();
    bookings.push(booking);
    Storage.setBookings(bookings);
    closeBookingModal();
    showToast('Booking request sent! R50 booking fee deducted.', 'success');
}

// ==========================================
// TIP JAR MODAL
// ==========================================
function openTipModal(providerId, providerType, providerName) {
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
    const tip = {
        id: generateId(),
        providerId: currentBookingProviderId,
        providerType: currentBookingProviderType,
        tipperName: document.getElementById('tipperName').value.trim(),
        tipperEmail: document.getElementById('tipperEmail').value.trim(),
        amount: parseFloat(document.getElementById('tipAmount').value) || 0,
        message: document.getElementById('tipMessage').value.trim(),
        createdAt: new Date().toISOString()
    };

    if (tip.amount <= 0) { showToast('Please enter a valid amount.', 'error'); return; }

    // Deduct from user wallet, credit provider wallet
    adjustWallet('user', 'general', -tip.amount, 'tip-sent', `Tip sent to provider`, { tipId: tip.id, providerId: tip.providerId });
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
        booking.status = 'cancelled';
        Storage.setBookings(bookings);
        showToast('Booking cancelled.', 'info');
        if (window.location.pathname.includes('provider.html')) {
            renderProviderBookings();
        } else {
            renderUserBookings();
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

        // Credit provider wallet on confirmation
        if (status === 'confirmed') {
            adjustWallet('provider', booking.providerId, 50, 'booking-confirmed', `Booking confirmed from ${booking.clientName}`, { bookingId: booking.id });
        }

        showToast(`Booking ${status}.`, 'success');
        renderProviderBookings();
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
    const wallet = getOrCreateWallet('user', 'general');
    document.getElementById('userWalletBalance').textContent = `R${wallet.balance.toFixed(2)}`;
    document.getElementById('userWalletUpdated').textContent = formatDate(wallet.updatedAt);

    const txns = getWalletTransactions('user', 'general');
    const income = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const spent = txns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    document.getElementById('userWalletIncome').textContent = `R${income.toFixed(2)}`;
    document.getElementById('userWalletSpent').textContent = `R${spent.toFixed(2)}`;
    document.getElementById('userWalletTxns').textContent = txns.length;

    renderUserAnalytics();

    // Pending top-up requests
    const pendingRequests = Storage.getTopUpRequests().filter(r => r.status === 'pending');
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
        const typeColors = { 'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#10b981', 'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'withdrawal': '#8b5cf6', 'admin-adjust': '#64748b', 'refund': '#06b6d4' };
        const typeLabels = { 'top-up': 'Top Up', 'tip-sent': 'Tip Sent', 'tip-received': 'Tip Received', 'booking-fee': 'Booking Fee', 'booking-confirmed': 'Booking Confirmed', 'withdrawal': 'Withdrawal', 'admin-adjust': 'Admin Adjust', 'refund': 'Refund' };
        const color = typeColors[t.type] || '#64748b';
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

function openTopUpModal() { document.getElementById('topUpModal').classList.add('active'); }
function closeTopUpModal() { document.getElementById('topUpModal').classList.remove('active'); document.getElementById('topUpAmount').value = ''; }
function setTopUpAmount(amt) { document.getElementById('topUpAmount').value = amt; }

function processTopUp() {
    const amount = parseFloat(document.getElementById('topUpAmount').value);
    if (!amount || amount <= 0) { showToast('Enter a valid amount.', 'error'); return; }

    const requests = Storage.getTopUpRequests();
    requests.push({
        id: generateId(),
        ownerType: 'user',
        ownerId: 'general',
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
        const typeColors = { 'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#10b981', 'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'withdrawal': '#8b5cf6', 'admin-adjust': '#64748b', 'refund': '#06b6d4' };
        const typeLabels = { 'top-up': 'Top Up', 'tip-sent': 'Tip Sent', 'tip-received': 'Tip Received', 'booking-fee': 'Booking Fee', 'booking-confirmed': 'Booking Confirmed', 'withdrawal': 'Withdrawal', 'admin-adjust': 'Admin Adjust', 'refund': 'Refund' };
        const color = typeColors[t.type] || '#64748b';
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

    const providers = [...Storage.getListings().map(l => l.id), ...Storage.getServices().map(s => s.id)];
    let totalBalance = 0;
    providers.forEach(pid => { totalBalance += getOrCreateWallet('provider', pid).balance; });

    if (amount > totalBalance) { showToast('Insufficient balance.', 'error'); return; }

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
        const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#64748b' };
        const providers = [...Storage.getListings(), ...Storage.getServices()];
        const author = providers.find(p => p.id === c.providerId);
        const authorName = author ? author.name : 'Unknown Creator';
        const hasMedia = c.fileData && c.fileData.length > 100;
        return `
            <div class="content-card profile-card" onclick="viewContent('${c.id}')">
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
    const type = CONTENT_TYPES[item.type] || { label: item.type, icon: 'fa-file', color: '#64748b' };
    const providers = [...Storage.getListings(), ...Storage.getServices()];
    const author = providers.find(p => p.id === item.providerId);
    const authorName = author ? author.name : 'Unknown Creator';

    document.getElementById('contentDetailViewType').innerHTML = `<i class="fas ${type.icon}"></i> ${type.label}`;
    document.getElementById('contentDetailViewType').style.background = `${type.color}22`;
    document.getElementById('contentDetailViewType').style.color = type.color;
    document.getElementById('contentDetailViewType').style.border = `1px solid ${type.color}44`;
    document.getElementById('contentDetailViewTitle').textContent = item.title;
    document.getElementById('contentDetailViewDate').textContent = formatDate(item.createdAt);
    document.getElementById('contentDetailViewAuthor').textContent = `By ${authorName}`;
    document.getElementById('contentDetailViewBody').innerHTML = item.description ? `<p>${item.description.replace(/\n/g, '<br>')}</p>` : '<p class="empty-text">No description</p>';

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

// ==========================================
// WALLET ANALYTICS
// ==========================================
let userSpendingByTypeChart = null;
let userSpendingOverTimeChart = null;
let providerEarningsByTypeChart = null;
let providerEarningsOverTimeChart = null;

const TYPE_COLORS = {
    'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#f59e0b',
    'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'withdrawal': '#8b5cf6',
    'admin-adjust': '#64748b', 'refund': '#06b6d4'
};

const TYPE_LABELS = {
    'top-up': 'Top Up', 'tip-sent': 'Tips Sent', 'tip-received': 'Tips Received',
    'booking-fee': 'Booking Fees', 'booking-confirmed': 'Booking Income',
    'withdrawal': 'Withdrawals', 'admin-adjust': 'Admin Adjust', 'refund': 'Refunds'
};

function filterTxnsByPeriod(txns, period) {
    if (period === 'all') return txns;
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return txns.filter(t => new Date(t.createdAt) >= cutoff);
}

function renderUserAnalytics() {
    const txns = filterTxnsByPeriod(getWalletTransactions('user', 'general'), document.getElementById('userAnalyticsPeriod')?.value || 'all');
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
    const byTypeColors = Object.keys(typeCounts).map(k => TYPE_COLORS[k] || '#64748b');

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
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { callback: v => 'R' + v, font: { size: 11 } } },
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
    const byTypeColors = Object.keys(typeCounts).map(k => TYPE_COLORS[k] || '#64748b');

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
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { callback: v => 'R' + v, font: { size: 11 } } },
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
        const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#64748b' };
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
            content[idx].description = description;
            if (fileData) { content[idx].fileData = fileData; content[idx].fileType = fileType; }
            content[idx].tags = [...contentTags];
            content[idx].updatedAt = new Date().toISOString();
        }
        showToast('Content updated!', 'success');
    } else {
        content.push({
            id: generateId(),
            title, type, description,
            fileData: fileData || '',
            fileType: fileType || '',
            tags: [...contentTags],
            providerId: currentProvider?.id || 'unknown',
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
    { type: 'sad', icon: 'fa-face-sad-tear', label: 'Sad', color: '#64748b' }
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
    if (province) filtered = filtered.filter(e => e.province === province);

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
        const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#64748b' };
        const providers = [...Storage.getListings(), ...Storage.getServices()];
        const author = providers.find(p => p.id === ev.providerId);
        const authorName = author ? author.name : 'Unknown Host';
        const eventDate = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
        return `
            <div class="content-card profile-card event-grid-card" onclick="viewEvent('${ev.id}')">
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
    const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#64748b' };
    const providers = [...Storage.getListings(), ...Storage.getServices()];
    const author = providers.find(p => p.id === ev.providerId);
    const authorName = author ? author.name : 'Unknown Host';

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
    document.getElementById('eventDetailViewBody').innerHTML = ev.description ? `<p>${ev.description.replace(/\n/g, '<br>')}</p>` : '<p class="empty-text">No description</p>';

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
        const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#64748b' };
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
        events.push({
            id: generateId(),
            name, type, eventDate, eventTime, venue, province, fee, dressCode, description,
            tags: [...eventTags],
            providerId: currentProvider?.id || 'unknown',
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
    'offtopic': { label: 'Off-Topic', icon: 'fa-ellipsis', color: '#64748b', section: 'public' },
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

function switchForumSection(section) {
    currentForumSection = section;
    currentForumFilter = 'all';
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
        const cat = FORUM_CATEGORIES[thread.category] || { label: thread.category, icon: 'fa-comment', color: '#64748b' };
        const threadLikes = likes.filter(l => l.targetId === thread.id && l.type === 'thread').length;
        const threadReplies = replies.filter(r => r.threadId === thread.id).length;
        const isLiked = likes.some(l => l.targetId === thread.id && l.type === 'thread' && l.userId === 'current');
        const tagsHtml = (thread.tags || []).slice(0, 3).map(t => `<span class="forum-tag">${t}</span>`).join('');
        const timeAgo = getTimeAgo(thread.createdAt);
        const isPremium = cat.section === 'premium';
        const sectionBadge = isPremium ? '<span class="forum-premium-badge"><i class="fas fa-crown"></i> Premium</span>' : '';

        return `
            <div class="forum-thread-card${thread.pinned ? ' pinned' : ''}${thread.locked ? ' locked' : ''}" onclick="viewForumThread('${thread.id}')">
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

function viewForumThread(id) {
    const threads = Storage.getForumThreads();
    const thread = threads.find(t => t.id === id);
    if (!thread) return;

    currentForumViewId = id;

    const replies = Storage.getForumReplies();
    const likes = Storage.getForumLikes();
    const cat = FORUM_CATEGORIES[thread.category] || { label: thread.category, icon: 'fa-comment', color: '#64748b' };
    const threadLikes = likes.filter(l => l.targetId === id && l.type === 'thread').length;
    const isLiked = likes.some(l => l.targetId === id && l.type === 'thread' && l.userId === 'current');
    const threadReplies = replies.filter(r => r.threadId === id);
    const tagsHtml = (thread.tags || []).map(t => `<span class="forum-tag">${t}</span>`).join('');
    const createdStr = new Date(thread.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const isPremium = cat.section === 'premium';
    const sectionBadge = isPremium ? '<span class="forum-premium-badge" style="margin-left:8px"><i class="fas fa-crown"></i> Premium</span>' : '';

    const titleEl = document.getElementById('forumViewTitle');
    if (titleEl) titleEl.textContent = thread.title;

    const fullEl = document.getElementById('forumThreadFull');
    if (fullEl) {
        fullEl.innerHTML = `
            <div class="forum-thread-full-header">
                <span class="forum-thread-full-category" style="background:${cat.color}18;color:${cat.color}"><i class="fas ${cat.icon}"></i> ${cat.label}</span>
                ${sectionBadge}
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
            repliesList.innerHTML = '<p style="color:var(--text-muted, #94a3b8);font-style:italic;padding:10px 0">No replies yet. Be the first to reply!</p>';
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
    const id = document.getElementById('forumThreadId').value;
    const title = document.getElementById('forumThreadTitle').value.trim();
    const section = document.getElementById('forumThreadSectionSelect')?.value || document.getElementById('forumThreadSection')?.value || 'public';
    const category = document.getElementById('forumThreadCategory').value;
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
            threads[idx].author = author;
            threads[idx].body = body;
            threads[idx].tags = tags;
            threads[idx].updatedAt = new Date().toISOString();
        }
        showToast('Thread updated!', 'success');
    } else {
        threads.push({
            id: generateId(), title, section, category, author, body, tags,
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
        const cat = FORUM_CATEGORIES[thread.category] || { label: thread.category, icon: 'fa-comment', color: '#64748b' };
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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}