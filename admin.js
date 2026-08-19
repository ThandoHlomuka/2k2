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

    document.getElementById('adminUserCount').textContent = users.length;
    document.getElementById('adminProviderCount').textContent = providers.length;
    document.getElementById('adminListingCount').textContent = listings.length;
    document.getElementById('adminVenueCount').textContent = venues.length;
    document.getElementById('adminAdCount').textContent = ads.length;

    // Bar chart
    const chartData = [
        { label: 'Users', value: users.length, color: '#667eea' },
        { label: 'Providers', value: providers.length, color: '#8b5cf6' },
        { label: 'Listings', value: listings.length, color: '#ec4899' },
        { label: 'Venues', value: venues.length, color: '#3b82f6' },
        { label: 'Ads', value: ads.length, color: '#f59e0b' }
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
        ...ads.map(a => ({ type: 'ad', name: a.title, date: a.createdAt, color: '#f59e0b' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

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

    const latest = (arr) => arr.length > 0 ? fmtDate(arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt) : '-';

    const tbody = document.querySelector('#adminLogsTable tbody');
    if (tbody) {
        tbody.innerHTML = [
            { entity: 'Users', total: users.length, active: users.length, latest: latest(users) },
            { entity: 'Providers', total: providers.length, active: providers.length, latest: latest(providers) },
            { entity: 'Listings', total: listings.length, active: listings.filter(l => l.status === 'active').length, latest: latest(listings) },
            { entity: 'Venues', total: venues.length, active: venues.filter(v => v.status === 'active').length, latest: latest(venues) },
            { entity: 'Ads', total: ads.length, active: ads.filter(a => a.status === 'active').length, latest: latest(ads) }
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
        ['k2_users', 'k2_providers', 'k2_listings', 'k2_venues', 'k2_ads'].forEach(key => {
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

// Sidebar toggle
document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('mainContent').classList.toggle('shifted');
});

document.getElementById('closeBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('mainContent').classList.remove('shifted');
});
