// ==========================================
// 2k2 - Admin Portal JavaScript
// ==========================================

// ==========================================
// NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            if (page) navigateTo(page);
        });
    });

    renderAdminDashboard();
});

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const el = document.getElementById('page-' + page);
    if (el) el.classList.add('active');

    const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (nav) nav.classList.add('active');

    if (page === 'admin-dashboard') renderAdminDashboard();
    if (page === 'admin-users') renderAdminUsers();
    if (page === 'admin-providers') renderAdminProviders();
    if (page === 'admin-listings') renderAdminListings();
    if (page === 'admin-venues') renderAdminVenues();
    if (page === 'admin-ads') renderAdminAds();
    if (page === 'admin-wallets') renderAdminWallets();
    if (page === 'admin-logs') renderAdminLogs();

    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('mainContent');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
        main.classList.remove('shifted');
    }
}

// ==========================================
// TOAST
// ==========================================
function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => { toast.classList.remove('active'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ==========================================
// DELETE MODAL
// ==========================================
let adminDeleteTarget = { type: null, id: null };

function promptAdminDelete(type, id, name) {
    adminDeleteTarget = { type, id };
    document.getElementById('deleteModalText').textContent = `Delete "${name}"? This cannot be undone.`;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    adminDeleteTarget = { type: null, id: null };
}

function confirmDelete() {
    if (!adminDeleteTarget.id) return;
    const { type, id } = adminDeleteTarget;

    if (type === 'user') {
        Storage.setUsers(Storage.getUsers().filter(u => u.id !== id));
        showToast('User deleted.');
        renderAdminUsers();
    } else if (type === 'provider') {
        Storage.setProviders(Storage.getProviders().filter(p => p.id !== id));
        showToast('Provider deleted.');
        renderAdminProviders();
    } else if (type === 'listing') {
        Storage.setListings(Storage.getListings().filter(l => l.id !== id));
        showToast('Listing deleted.');
        renderAdminListings();
    } else if (type === 'venue') {
        Storage.setVenues(Storage.getVenues().filter(v => v.id !== id));
        showToast('Venue deleted.');
        renderAdminVenues();
    } else if (type === 'ad') {
        Storage.setAds(Storage.getAds().filter(a => a.id !== id));
        showToast('Ad deleted.');
        renderAdminAds();
    }
    closeDeleteModal();
}

// ==========================================
// VIEW MODAL
// ==========================================
function showAdminView(html) {
    const modal = document.getElementById('adminViewModal');
    const content = document.getElementById('adminViewContent');
    content.innerHTML = html + `<div style="text-align:right;margin-top:24px"><button class="btn btn-secondary" onclick="closeAdminView()">Close</button></div>`;
    modal.classList.add('active');
}

function closeAdminView() {
    document.getElementById('adminViewModal').classList.remove('active');
}

document.getElementById('adminViewModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAdminView();
});

// ==========================================
// UTILITY
// ==========================================
function fmtDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function truncate(str, len = 30) {
    if (!str) return '-';
    return str.length > len ? str.substring(0, len) + '...' : str;
}

function renderTagsHtml(tags) {
    if (!tags || tags.length === 0) return '<span style="color:#94a3b8">-</span>';
    return tags.slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('') + (tags.length > 3 ? `<span class="mini-tag">+${tags.length - 3}</span>` : '');
}

// ==========================================
// DASHBOARD
// ==========================================
function renderAdminDashboard() {
    const users = Storage.getUsers();
    const providers = Storage.getProviders();
    const listings = Storage.getListings();
    const venues = Storage.getVenues();
    const ads = Storage.getAds();
    const services = Storage.getServices();
    const bookings = Storage.getBookings();
    const wallets = Storage.getWallets();

    document.getElementById('adminUserCount').textContent = users.length;
    document.getElementById('adminProviderCount').textContent = providers.length;
    document.getElementById('adminListingCount').textContent = listings.length;
    document.getElementById('adminVenueCount').textContent = venues.length;
    document.getElementById('adminAdCount').textContent = ads.length;
    document.getElementById('adminServiceCount').textContent = services.length;
    document.getElementById('adminBookingCount').textContent = bookings.length;

    const totalWallet = wallets.reduce((s, w) => s + w.balance, 0);
    document.getElementById('adminWalletTotal').textContent = `R${Math.round(totalWallet)}`;

    // Bar chart
    const chartData = [
        { label: 'Users', value: users.length, color: '#667eea' },
        { label: 'Providers', value: providers.length, color: '#8b5cf6' },
        { label: 'Listings', value: listings.length, color: '#ec4899' },
        { label: 'Venues', value: venues.length, color: '#3b82f6' },
        { label: 'Ads', value: ads.length, color: '#f59e0b' },
        { label: 'Services', value: services.length, color: '#10b981' },
        { label: 'Bookings', value: bookings.length, color: '#06b6d4' }
    ];
    const maxVal = Math.max(...chartData.map(d => d.value), 1);

    document.getElementById('adminBarChart').innerHTML = chartData.map(d => `
        <div class="admin-bar" style="height:${(d.value / maxVal) * 140}px; background:${d.color}">
            <span class="admin-bar-value">${d.value}</span>
            <span class="admin-bar-label">${d.label}</span>
        </div>
    `).join('');

    // Activity feed
    const allItems = [
        ...users.map(u => ({ type: 'user', name: u.name || u.email, date: u.createdAt, color: '#667eea' })),
        ...providers.map(p => ({ type: 'provider', name: p.name || p.email, date: p.createdAt, color: '#8b5cf6' })),
        ...listings.map(l => ({ type: 'listing', name: l.name, date: l.createdAt, color: '#ec4899' })),
        ...venues.map(v => ({ type: 'venue', name: v.name, date: v.createdAt, color: '#3b82f6' })),
        ...ads.map(a => ({ type: 'ad', name: a.title, date: a.createdAt, color: '#f59e0b' })),
        ...services.map(s => ({ type: 'service', name: s.name, date: s.createdAt, color: '#10b981' })),
        ...bookings.map(b => ({ type: 'booking', name: `${b.clientName} → ${b.serviceType}`, date: b.createdAt, color: '#06b6d4' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    document.getElementById('adminActivityFeed').innerHTML = allItems.length === 0
        ? '<p style="color:#94a3b8;font-size:0.88rem;padding:12px 0">No activity yet</p>'
        : allItems.map(item => `
            <div class="admin-activity-item">
                <div class="admin-activity-dot" style="background:${item.color}"></div>
                <div>
                    <div class="admin-activity-text">New ${item.type}: <strong>${truncate(item.name, 25)}</strong></div>
                    <div class="admin-activity-time">${fmtDate(item.date)}</div>
                </div>
            </div>
        `).join('');
}

// ==========================================
// USERS MANAGEMENT
// ==========================================
function renderAdminUsers() {
    const users = Storage.getUsers();
    const tbody = document.querySelector('#adminUsersTable tbody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:40px">No users registered yet</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr>
            <td><strong>${truncate(u.name, 20)}</strong></td>
            <td>${u.email || '-'}</td>
            <td>${u.phone || '-'}</td>
            <td>${u.location || '-'}</td>
            <td>${renderTagsHtml(u.tags)}</td>
            <td>${fmtDate(u.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewUser('${u.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminDeleteUser('${u.id}','${(u.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function adminViewUser(id) {
    const u = Storage.getUsers().find(x => x.id === id);
    if (!u) return;
    showAdminView(`
        <h2><i class="fas fa-user" style="color:#667eea;margin-right:8px"></i> User Details</h2>
        <div class="admin-view-row"><span class="label">Name</span><span class="value">${u.name || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Email</span><span class="value">${u.email || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Phone</span><span class="value">${u.phone || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${u.location || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Bio</span><span class="value">${truncate(u.bio || '-', 100)}</span></div>
        <div class="admin-view-row"><span class="label">Tags</span><span class="value">${(u.tags||[]).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(u.createdAt)}</span></div>
    `);
}

function adminDeleteUser(id, name) { promptAdminDelete('user', id, name); }

// ==========================================
// PROVIDERS MANAGEMENT
// ==========================================
function renderAdminProviders() {
    const providers = Storage.getProviders();
    const tbody = document.querySelector('#adminProvidersTable tbody');
    if (!tbody) return;

    if (providers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:40px">No providers registered yet</td></tr>';
        return;
    }

    tbody.innerHTML = providers.map(p => `
        <tr>
            <td><strong>${truncate(p.name, 20)}</strong></td>
            <td>${p.email || '-'}</td>
            <td>${p.phone || '-'}</td>
            <td>${p.location || '-'}</td>
            <td>${renderTagsHtml(p.tags)}</td>
            <td>${fmtDate(p.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewProvider('${p.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminDeleteProvider('${p.id}','${(p.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function adminViewProvider(id) {
    const p = Storage.getProviders().find(x => x.id === id);
    if (!p) return;
    showAdminView(`
        <h2><i class="fas fa-user-tie" style="color:#8b5cf6;margin-right:8px"></i> Provider Details</h2>
        <div class="admin-view-row"><span class="label">Name</span><span class="value">${p.name || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Email</span><span class="value">${p.email || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Phone</span><span class="value">${p.phone || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${p.location || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Bio</span><span class="value">${truncate(p.bio || '-', 100)}</span></div>
        <div class="admin-view-row"><span class="label">Tags</span><span class="value">${(p.tags||[]).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(p.createdAt)}</span></div>
    `);
}

function adminDeleteProvider(id, name) { promptAdminDelete('provider', id, name); }

// ==========================================
// LISTINGS MANAGEMENT
// ==========================================
function renderAdminListings() {
    const listings = Storage.getListings();
    const tbody = document.querySelector('#adminListingsTable tbody');
    if (!tbody) return;

    if (listings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:40px">No listings yet</td></tr>';
        return;
    }

    const types = typeof DIRECTORY_TYPES !== 'undefined' ? DIRECTORY_TYPES : {};

    tbody.innerHTML = listings.map(l => {
        const t = types[l.category] || {};
        return `
        <tr>
            <td><strong>${truncate(l.name, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${t.color||'#64748b'}20;color:${t.color||'#64748b'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${t.label || l.category}</span></td>
            <td>${l.location || '-'}</td>
            <td><span class="status-badge status-${l.status}">${l.status}</span></td>
            <td>${fmtDate(l.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewListing('${l.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminDeleteListing('${l.id}','${(l.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewListing(id) {
    const l = Storage.getListings().find(x => x.id === id);
    if (!l) return;
    showAdminView(`
        <h2><i class="fas fa-address-book" style="color:#ec4899;margin-right:8px"></i> Listing Details</h2>
        <div class="admin-view-row"><span class="label">Name</span><span class="value">${l.name || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Category</span><span class="value">${l.category || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Email</span><span class="value">${l.email || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Phone</span><span class="value">${l.phone || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${l.location || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Rate</span><span class="value">${l.rate || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Status</span><span class="value">${l.status || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Bio</span><span class="value">${truncate(l.bio || '-', 150)}</span></div>
        <div class="admin-view-row"><span class="label">Tags</span><span class="value">${(l.tags||[]).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Gallery</span><span class="value">${(l.gallery||[]).length} photos</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(l.createdAt)}</span></div>
    `);
}

function adminDeleteListing(id, name) { promptAdminDelete('listing', id, name); }

// ==========================================
// VENUES MANAGEMENT
// ==========================================
function renderAdminVenues() {
    const venues = Storage.getVenues();
    const tbody = document.querySelector('#adminVenuesTable tbody');
    if (!tbody) return;

    if (venues.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:40px">No venues yet</td></tr>';
        return;
    }

    const types = typeof VENUE_TYPES !== 'undefined' ? VENUE_TYPES : {};

    tbody.innerHTML = venues.map(v => {
        const t = types[v.category] || {};
        return `
        <tr>
            <td><strong>${truncate(v.name, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${t.color||'#64748b'}20;color:${t.color||'#64748b'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${t.label || v.category}</span></td>
            <td>${v.location || '-'}</td>
            <td>${v.capacity || '-'}</td>
            <td><span class="status-badge status-${v.status}">${v.status}</span></td>
            <td>${fmtDate(v.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewVenue('${v.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminDeleteVenue('${v.id}','${(v.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewVenue(id) {
    const v = Storage.getVenues().find(x => x.id === id);
    if (!v) return;
    showAdminView(`
        <h2><i class="fas fa-store" style="color:#3b82f6;margin-right:8px"></i> Venue Details</h2>
        <div class="admin-view-row"><span class="label">Name</span><span class="value">${v.name || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Category</span><span class="value">${v.category || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Email</span><span class="value">${v.email || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Phone</span><span class="value">${v.phone || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${v.location || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Cover Charge</span><span class="value">${v.rate || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Capacity</span><span class="value">${v.capacity || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Status</span><span class="value">${v.status || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Description</span><span class="value">${truncate(v.bio || '-', 150)}</span></div>
        <div class="admin-view-row"><span class="label">Features</span><span class="value">${(v.tags||[]).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Gallery</span><span class="value">${(v.gallery||[]).length} photos</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(v.createdAt)}</span></div>
    `);
}

function adminDeleteVenue(id, name) { promptAdminDelete('venue', id, name); }

// ==========================================
// ADS MANAGEMENT
// ==========================================
function renderAdminAds() {
    const ads = Storage.getAds();
    const tbody = document.querySelector('#adminAdsTable tbody');
    if (!tbody) return;

    if (ads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:40px">No ads yet</td></tr>';
        return;
    }

    const cats = typeof AD_CATEGORIES !== 'undefined' ? AD_CATEGORIES : {};

    tbody.innerHTML = ads.map(a => {
        const c = cats[a.category] || {};
        return `
        <tr>
            <td><strong>${truncate(a.title, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${c.color||'#64748b'}20;color:${c.color||'#64748b'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${c.label || a.category}</span></td>
            <td>${a.contactName || '-'}</td>
            <td>${a.location || '-'}</td>
            <td><span class="status-badge status-${a.status}">${a.status}</span></td>
            <td>${fmtDate(a.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewAd('${a.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminDeleteAd('${a.id}','${(a.title||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewAd(id) {
    const a = Storage.getAds().find(x => x.id === id);
    if (!a) return;
    showAdminView(`
        <h2><i class="fas fa-bullhorn" style="color:#f59e0b;margin-right:8px"></i> Ad Details</h2>
        <div class="admin-view-row"><span class="label">Title</span><span class="value">${a.title || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Category</span><span class="value">${a.category || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Contact Name</span><span class="value">${a.contactName || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Phone</span><span class="value">${a.phone || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${a.location || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Description</span><span class="value">${truncate(a.body || '-', 200)}</span></div>
        <div class="admin-view-row"><span class="label">Tags</span><span class="value">${(a.tags||[]).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Photos</span><span class="value">${(a.gallery||[]).length} attached</span></div>
        <div class="admin-view-row"><span class="label">Author</span><span class="value">${a.author || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Status</span><span class="value">${a.status || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(a.createdAt)}</span></div>
    `);
}

function adminDeleteAd(id, name) { promptAdminDelete('ad', id, name); }

// ==========================================
// LOGS
// ==========================================
function renderAdminLogs() {
    const users = Storage.getUsers();
    const providers = Storage.getProviders();
    const listings = Storage.getListings();
    const venues = Storage.getVenues();
    const ads = Storage.getAds();
    const services = Storage.getServices();
    const bookings = Storage.getBookings();
    const tips = Storage.getTips();

    const latest = (arr) => arr.length > 0 ? fmtDate(arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt) : '-';

    const tbody = document.querySelector('#adminLogsTable tbody');
    if (tbody) {
        tbody.innerHTML = [
            { entity: 'Users', total: users.length, active: users.length, latest: latest(users) },
            { entity: 'Providers', total: providers.length, active: providers.length, latest: latest(providers) },
            { entity: 'Listings', total: listings.length, active: listings.filter(l => l.status === 'active').length, latest: latest(listings) },
            { entity: 'Venues', total: venues.length, active: venues.filter(v => v.status === 'active').length, latest: latest(venues) },
            { entity: 'Ads', total: ads.length, active: ads.filter(a => a.status === 'active').length, latest: latest(ads) },
            { entity: 'Services', total: services.length, active: services.length, latest: latest(services) },
            { entity: 'Bookings', total: bookings.length, active: bookings.filter(b => b.status === 'pending').length, latest: latest(bookings) },
            { entity: 'Tips', total: tips.length, active: tips.length, latest: latest(tips) }
        ].map(r => `
            <tr>
                <td><strong>${r.entity}</strong></td>
                <td>${r.total}</td>
                <td>${r.active}</td>
                <td>${r.latest}</td>
            </tr>
        `).join('');
    }

    // Storage info
    const info = document.getElementById('adminStorageInfo');
    if (info) {
        let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">';
        ['k2_users', 'k2_providers', 'k2_listings', 'k2_venues', 'k2_ads', 'k2_services', 'k2_bookings', 'k2_tips', 'k2_wallets', 'k2_transactions'].forEach(key => {
            const raw = localStorage.getItem(key) || '[]';
            const bytes = new Blob([raw]).size;
            const kb = (bytes / 1024).toFixed(1);
            html += `<div style="padding:12px;background:#f8fafc;border-radius:10px"><div style="font-weight:700;color:#1e293b;font-size:0.85rem">${key.replace('k2_', '').toUpperCase()}</div><div style="color:#64748b;font-size:0.82rem;margin-top:4px">${kb} KB</div></div>`;
        });
        html += '</div>';
        info.innerHTML = html;
    }
}

// ==========================================
// ADMIN TOOLS
// ==========================================
function adminExportData() {
    const data = {
        users: Storage.getUsers(),
        providers: Storage.getProviders(),
        listings: Storage.getListings(),
        venues: Storage.getVenues(),
        ads: Storage.getAds(),
        services: Storage.getServices(),
        bookings: Storage.getBookings(),
        tips: Storage.getTips(),
        customServiceTypes: Storage.getCustomServiceTypes(),
        wallets: Storage.getWallets(),
        transactions: Storage.getTransactions(),
        topUpRequests: Storage.getTopUpRequests(),
        withdrawalRequests: Storage.getWithdrawalRequests(),
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2k2-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!');
}

function adminClearAllData() {
    if (confirm('This will permanently delete ALL platform data. Are you absolutely sure?')) {
        if (confirm('Final warning: This cannot be undone. Proceed?')) {
            Storage.clearAll();
            showToast('All data cleared.', 'info');
            renderAdminDashboard();
        }
    }
}

// ==========================================
// WALLET MANAGEMENT
// ==========================================
function renderAdminWallets() {
    const wallets = getAllWallets();
    const txns = getAllTransactions();
    const topUpReqs = Storage.getTopUpRequests();
    const withdrawReqs = Storage.getWithdrawalRequests();
    const pendingReqs = [...topUpReqs.filter(r => r.status === 'pending'), ...withdrawReqs.filter(r => r.status === 'pending')];

    // Stats
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    document.getElementById('adminTotalBalance').textContent = `R${totalBalance.toFixed(2)}`;
    document.getElementById('adminTotalTxns').textContent = txns.length;
    document.getElementById('adminTotalWallets').textContent = wallets.length;
    document.getElementById('adminPendingRequests').textContent = pendingReqs.length;

    // Pending requests
    const reqContainer = document.getElementById('adminPendingRequestsList');
    if (reqContainer) {
        if (pendingReqs.length === 0) {
            reqContainer.innerHTML = '<p style="color:#94a3b8;font-size:0.88rem;padding:12px 0">No pending requests</p>';
        } else {
            reqContainer.innerHTML = pendingReqs.map(r => {
                const isTopUp = topUpReqs.includes(r);
                const typeLabel = isTopUp ? 'Top-Up' : 'Withdrawal';
                const typeColor = isTopUp ? '#10b981' : '#8b5cf6';
                const typeIcon = isTopUp ? 'fa-plus-circle' : 'fa-money-bill-wave';
                let ownerLabel = r.ownerType + ': ' + r.ownerId;
                if (r.ownerType === 'user') ownerLabel = 'General User';
                else if (r.ownerType === 'provider') {
                    const providers = Storage.getProviders();
                    const p = providers.find(x => x.id === r.ownerId);
                    ownerLabel = p ? p.name : r.ownerId;
                }
                return `
                    <div class="admin-request-row">
                        <div class="admin-request-info">
                            <span class="badge" style="background:${typeColor}22;color:${typeColor};border:1px solid ${typeColor}44"><i class="fas ${typeIcon}"></i> ${typeLabel}</span>
                            <div>
                                <strong>R${r.amount.toFixed(2)}</strong>
                                <span style="color:#94a3b8;font-size:0.82rem;margin-left:8px">${ownerLabel}</span>
                            </div>
                            <span style="color:#94a3b8;font-size:0.8rem">${fmtDate(r.createdAt)}</span>
                        </div>
                        <div class="admin-actions">
                            <button class="btn btn-primary btn-xs" style="background:#10b981;border:none" onclick="adminApproveRequest('${isTopUp ? 'topup' : 'withdrawal'}','${r.id}')"><i class="fas fa-check"></i> Approve</button>
                            <button class="btn btn-danger btn-xs" onclick="adminRejectRequest('${isTopUp ? 'topup' : 'withdrawal'}','${r.id}')"><i class="fas fa-times"></i> Reject</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Wallets table
    const wTbody = document.querySelector('#adminWalletsTable tbody');
    if (wTbody) {
        if (wallets.length === 0) {
            wTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:40px">No wallets yet</td></tr>';
        } else {
            wTbody.innerHTML = wallets.map(w => {
                let ownerName = w.ownerId;
                if (w.ownerType === 'user') ownerName = 'General User';
                else if (w.ownerType === 'provider') {
                    const providers = Storage.getProviders();
                    const p = providers.find(x => x.id === w.ownerId);
                    ownerName = p ? p.name : w.ownerId;
                }
                return `
                    <tr>
                        <td><strong>${truncate(ownerName, 25)}</strong><br><span style="font-size:0.75rem;color:#94a3b8">${w.ownerId}</span></td>
                        <td><span class="badge" style="background:${w.ownerType === 'user' ? '#667eea22; color:#667eea' : '#8b5cf622; color:#8b5cf6'}">${w.ownerType}</span></td>
                        <td><strong>R${w.balance.toFixed(2)}</strong></td>
                        <td>${fmtDate(w.updatedAt)}</td>
                        <td>
                            <div class="admin-actions">
                                <button class="btn btn-secondary btn-xs" onclick="adminViewWalletTxns('${w.ownerType}','${w.ownerId}')"><i class="fas fa-history"></i></button>
                                <button class="btn btn-secondary btn-xs" onclick="adminEditWalletBalance('${w.ownerType}','${w.ownerId}',${w.balance})"><i class="fas fa-edit"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // Transactions table
    const tTbody = document.querySelector('#adminTransactionsTable tbody');
    if (tTbody) {
        if (txns.length === 0) {
            tTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:40px">No transactions yet</td></tr>';
        } else {
            tTbody.innerHTML = txns.slice(0, 50).map(t => {
                const typeColors = { 'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#10b981', 'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'withdrawal': '#8b5cf6', 'admin-adjust': '#64748b', 'refund': '#06b6d4' };
                const typeLabels = { 'top-up': 'Top Up', 'tip-sent': 'Tip Sent', 'tip-received': 'Tip Received', 'booking-fee': 'Booking Fee', 'booking-confirmed': 'Booking Confirmed', 'withdrawal': 'Withdrawal', 'admin-adjust': 'Admin Adjust', 'refund': 'Refund' };
                const color = typeColors[t.type] || '#64748b';
                const label = typeLabels[t.type] || t.type;
                return `
                    <tr>
                        <td>${fmtDate(t.createdAt)}</td>
                        <td><span style="font-size:0.8rem;color:#94a3b8">${t.ownerType}: ${truncate(t.ownerId, 15)}</span></td>
                        <td><span class="badge" style="background:${color}22; color:${color}; border:1px solid ${color}44">${label}</span></td>
                        <td style="color:${t.amount >= 0 ? '#10b981' : '#ef4444'}; font-weight:700">${t.amount >= 0 ? '+' : ''}R${Math.abs(t.amount).toFixed(2)}</td>
                        <td>R${t.newBalance.toFixed(2)}</td>
                        <td class="truncate">${truncate(t.description, 30)}</td>
                        <td>
                            <div class="admin-actions">
                                ${t.type !== 'refund' && t.type !== 'admin-adjust' ? `<button class="btn btn-secondary btn-xs" onclick="adminRefundAction('${t.id}','${truncate(t.description,20).replace(/'/g,"\\'")}')"><i class="fas fa-undo" style="color:#06b6d4"></i></button>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
}

function adminViewWalletTxns(ownerType, ownerId) {
    const txns = getWalletTransactions(ownerType, ownerId);
    const wallet = getOrCreateWallet(ownerType, ownerId);
    let html = `<h2><i class="fas fa-history" style="color:#667eea;margin-right:8px"></i> Transactions</h2>`;
    html += `<div class="admin-view-row"><span class="label">Owner</span><span class="value">${ownerType}: ${ownerId}</span></div>`;
    html += `<div class="admin-view-row"><span class="label">Balance</span><span class="value">R${wallet.balance.toFixed(2)}</span></div>`;
    if (txns.length === 0) {
        html += '<p style="color:#94a3b8;margin-top:16px">No transactions</p>';
    } else {
        html += '<div style="margin-top:16px;max-height:400px;overflow-y:auto">';
        txns.forEach(t => {
            html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9">
                <div><div style="font-weight:600;font-size:0.88rem">${t.description || t.type}</div><div style="font-size:0.75rem;color:#94a3b8">${fmtDate(t.createdAt)}</div></div>
                <div style="font-weight:700;color:${t.amount >= 0 ? '#10b981' : '#ef4444'}">${t.amount >= 0 ? '+' : ''}R${Math.abs(t.amount).toFixed(2)}</div>
            </div>`;
        });
        html += '</div>';
    }
    showAdminView(html);
}

function adminEditWalletBalance(ownerType, ownerId, currentBalance) {
    const newBalance = prompt(`Set new balance for ${ownerType}:${ownerId}\nCurrent: R${currentBalance.toFixed(2)}`, currentBalance);
    if (newBalance !== null && !isNaN(parseFloat(newBalance))) {
        adminAdjustBalance(ownerType, ownerId, parseFloat(newBalance), 'Admin balance correction');
        showToast('Balance updated.');
        renderAdminWallets();
    }
}

function adminAdjustBalanceAction() {
    const ownerType = document.getElementById('adminWalletOwnerType').value;
    const ownerId = document.getElementById('adminWalletOwnerId').value.trim();
    const newBalance = parseFloat(document.getElementById('adminWalletNewBalance').value);
    const reason = document.getElementById('adminWalletReason').value.trim() || 'Admin adjustment';

    if (!ownerId) { showToast('Please enter an Owner ID.', 'error'); return; }
    if (isNaN(newBalance) || newBalance < 0) { showToast('Please enter a valid balance.', 'error'); return; }

    adminAdjustBalance(ownerType, ownerId, newBalance, reason);
    showToast('Balance adjusted successfully.');
    renderAdminWallets();
}

function adminLookupWallet() {
    const ownerType = document.getElementById('adminWalletOwnerType').value;
    const ownerId = document.getElementById('adminWalletOwnerId').value.trim();
    if (!ownerId) { showToast('Please enter an Owner ID.', 'error'); return; }
    const wallet = getOrCreateWallet(ownerType, ownerId);
    document.getElementById('adminWalletNewBalance').value = wallet.balance;
    showToast(`Wallet found. Balance: R${wallet.balance.toFixed(2)}`, 'info');
}

function adminRefundAction(txnId, description) {
    if (!confirm(`Refund transaction: "${description}"?`)) return;
    const success = adminRefundTransaction(txnId, 'Admin refund');
    if (success) { showToast('Refund processed.'); renderAdminWallets(); }
    else { showToast('Refund failed.', 'error'); }
}

function adminApproveRequest(type, reqId) {
    if (type === 'topup') {
        const requests = Storage.getTopUpRequests();
        const req = requests.find(r => r.id === reqId);
        if (!req || req.status !== 'pending') return;
        req.status = 'approved';
        req.approvedAt = new Date().toISOString();
        Storage.setTopUpRequests(requests);
        adjustWallet(req.ownerType, req.ownerId, req.amount, 'top-up', `Top-up approved (R${req.amount.toFixed(2)})`);
        showToast(`Top-up of R${req.amount.toFixed(2)} approved!`);
    } else if (type === 'withdrawal') {
        const requests = Storage.getWithdrawalRequests();
        const req = requests.find(r => r.id === reqId);
        if (!req || req.status !== 'pending') return;
        req.status = 'approved';
        req.approvedAt = new Date().toISOString();
        Storage.setWithdrawalRequests(requests);
        // Deduct from each provider wallet proportionally
        const providerIds = req.providerIds || [];
        let remaining = req.amount;
        providerIds.forEach(pid => {
            const wallet = getOrCreateWallet('provider', pid);
            if (wallet.balance > 0 && remaining > 0) {
                const deduct = Math.min(wallet.balance, remaining);
                adjustWallet('provider', pid, -deduct, 'withdrawal', `Withdrawal approved (R${deduct.toFixed(2)})`);
                remaining -= deduct;
            }
        });
        showToast(`Withdrawal of R${req.amount.toFixed(2)} approved!`);
    }
    renderAdminWallets();
}

function adminRejectRequest(type, reqId) {
    if (!confirm('Reject this request?')) return;
    if (type === 'topup') {
        const requests = Storage.getTopUpRequests();
        const req = requests.find(r => r.id === reqId);
        if (!req) return;
        req.status = 'rejected';
        req.rejectedAt = new Date().toISOString();
        Storage.setTopUpRequests(requests);
        showToast('Top-up request rejected.', 'info');
    } else if (type === 'withdrawal') {
        const requests = Storage.getWithdrawalRequests();
        const req = requests.find(r => r.id === reqId);
        if (!req) return;
        req.status = 'rejected';
        req.rejectedAt = new Date().toISOString();
        Storage.setWithdrawalRequests(requests);
        showToast('Withdrawal request rejected.', 'info');
    }
    renderAdminWallets();
}

// Sidebar toggle
document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('mainContent').classList.toggle('shifted');
});

document.getElementById('closeBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('mainContent').classList.remove('shifted');
});
