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
    if (page === 'admin-content') renderAdminContent();
    if (page === 'admin-events') renderAdminEvents();
    if (page === 'admin-reviews') renderAdminReviews();
    if (page === 'admin-wallets') renderAdminWallets();
    if (page === 'admin-forum') renderAdminForum();
    if (page === 'admin-messages') renderAdminMessages();
    if (page === 'admin-message-logs') renderAdminMessageLogs();
    if (page === 'admin-saved-items') renderAdminSavedItems();
    if (page === 'admin-downloads') renderAdminDownloads();
    if (page === 'admin-experiences') renderAdminExperiences();
    if (page === 'admin-fantasy') renderAdminFantasy();
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
let adminDeleteAfterConfirm = null;

function promptAdminDelete(type, id, name) {
    adminDeleteTarget = { type, id };
    document.getElementById('deleteModalText').textContent = `Delete "${name}"? This cannot be undone.`;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    adminDeleteTarget = { type: null, id: null };
    adminDeleteAfterConfirm = null;
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
    } else if (type === 'forum-thread') {
        Storage.setForumThreads(Storage.getForumThreads().filter(t => t.id !== id));
        Storage.setForumReplies(Storage.getForumReplies().filter(r => r.threadId !== id));
        showToast('Thread deleted.');
        if (adminDeleteAfterConfirm) {
            adminDeleteAfterConfirm();
            adminDeleteAfterConfirm = null;
        } else {
            renderAdminForum();
        }
    } else if (type === 'forum-reply') {
        Storage.setForumReplies(Storage.getForumReplies().filter(r => r.id !== id));
        showToast('Reply deleted.');
        if (adminDeleteAfterConfirm) {
            adminDeleteAfterConfirm();
            adminDeleteAfterConfirm = null;
        } else {
            renderAdminForum();
        }
    } else if (type === 'conversation') {
        Storage.setConversations(Storage.getConversations().filter(c => c.id !== id));
        Storage.setMessages(Storage.getMessages().filter(m => m.conversationId !== id));
        showToast('Conversation deleted.');
        renderAdminMessages();
    } else if (type === 'message') {
        Storage.setMessages(Storage.getMessages().filter(m => m.id !== id));
        showToast('Message deleted.');
        renderAdminMessageLogs();
        renderAdminMessages();
    } else if (type === 'saved-item') {
        Storage.setSavedItems(Storage.getSavedItems().filter(s => s.id !== id));
        showToast('Saved item removed.');
        renderAdminSavedItems();
    } else if (type === 'download') {
        Storage.setDownloads(Storage.getDownloads().filter(d => d.id !== id));
        showToast('Download record deleted.');
        renderAdminDownloads();
    } else if (type === 'experience') {
        Storage.setExperiences(Storage.getExperiences().filter(x => x.id !== id));
        showToast('Experience deleted.');
        renderAdminExperiences();
    } else if (type === 'fantasy-request') {
        Storage.setFantasyRequests(Storage.getFantasyRequests().filter(r => r.id !== id));
        showToast('Fantasy request deleted.');
        renderAdminFantasy();
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

function renderMsgBodyText(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/\[gif:(.*?)\]/g, (m, url) => `<img class="admin-msg-gif" src="${url}" alt="GIF" loading="lazy" style="max-width:160px;border-radius:8px;display:block;margin:4px 0">`);
    html = html.replace(/\n/g, '<br>');
    return html;
}

function msgPreviewText(text) {
    if (!text) return '';
    return text.replace(/\[gif:.*?\]/g, '[GIF]');
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
    const content = Storage.getContent();
    const events = Storage.getEvents();
    const reviews = Storage.getReviews();

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
        { label: 'Content', value: content.length, color: '#ef4444' },
        { label: 'Events', value: events.length, color: '#f97316' },
        { label: 'Bookings', value: bookings.length, color: '#06b6d4' },
        { label: 'Reviews', value: reviews.length, color: '#f59e0b' },
        { label: 'Saved', value: Storage.getSavedItems().length, color: '#eab308' },
        { label: 'Downloads', value: Storage.getDownloads().length, color: '#0284c7' },
        { label: 'Experiences', value: Storage.getExperiences().length, color: '#7c3aed' },
        { label: 'Fantasy', value: Storage.getFantasyRequests().length, color: '#db2777' }
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
        ...bookings.map(b => ({ type: 'booking', name: `${b.clientName} → ${b.serviceType}`, date: b.createdAt, color: '#06b6d4' })),
        ...Storage.getMessages().map(m => ({ type: 'message', name: `${m.senderName}: ${m.body}`, date: m.createdAt, color: '#ef4444' }))
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
// ==========================================
// ADMIN - CONTENT MANAGEMENT
// ==========================================
function renderAdminContent() {
    const content = Storage.getContent();
    const filter = document.getElementById('adminContentFilter')?.value || 'all';
    const filtered = filter === 'all' ? [...content] : content.filter(c => c.type === filter);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    document.getElementById('adminContentCount').textContent = filtered.length;
    const tbody = document.getElementById('adminContentTable');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">No content found</td></tr>';
        return;
    }

    const providers = [...Storage.getListings(), ...Storage.getServices()];
    tbody.innerHTML = filtered.map(c => {
        const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#64748b' };
        const author = providers.find(p => p.id === c.providerId);
        return `<tr>
            <td><strong>${c.title}</strong></td>
            <td><span class="badge" style="background:${type.color}22;color:${type.color};border:1px solid ${type.color}44"><i class="fas ${type.icon}"></i> ${type.label}</span></td>
            <td>${author ? author.name : 'Unknown'}</td>
            <td>${fmtDate(c.createdAt)}</td>
            <td><button class="btn btn-danger btn-xs" onclick="adminDeleteContent('${c.id}')"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    }).join('');
}

function adminDeleteContent(id) {
    if (!confirm('Delete this content item?')) return;
    const content = Storage.getContent().filter(c => c.id !== id);
    Storage.setContent(content);
    showToast('Content deleted.', 'info');
    renderAdminContent();
}

// ==========================================
// ADMIN - EVENTS MANAGEMENT
// ==========================================
function renderAdminEvents() {
    const events = Storage.getEvents();
    const filter = document.getElementById('adminEventsFilter')?.value || 'all';
    const filtered = filter === 'all' ? [...events] : events.filter(e => e.type === filter);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    document.getElementById('adminEventsCount').textContent = filtered.length;
    const tbody = document.getElementById('adminEventsTable');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No events found</td></tr>';
        return;
    }

    const providers = [...Storage.getListings(), ...Storage.getServices()];
    tbody.innerHTML = filtered.map(ev => {
        const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#64748b' };
        const host = providers.find(p => p.id === ev.providerId);
        const eventDate = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
        return `<tr>
            <td><strong>${ev.name}</strong></td>
            <td><span class="badge" style="background:${type.color}22;color:${type.color};border:1px solid ${type.color}44"><i class="fas ${type.icon}"></i> ${type.label}</span></td>
            <td>${eventDate}</td>
            <td>${ev.venue || '-'}</td>
            <td>${host ? host.name : 'Unknown'}</td>
            <td><button class="btn btn-danger btn-xs" onclick="adminDeleteEvent('${ev.id}')"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    }).join('');
}

function adminDeleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    const events = Storage.getEvents().filter(e => e.id !== id);
    Storage.setEvents(events);
    showToast('Event deleted.', 'info');
    renderAdminEvents();
}

// ==========================================
// ADMIN - REVIEWS MANAGEMENT
// ==========================================
function renderAdminReviews() {
    const reviews = Storage.getReviews();
    const filter = document.getElementById('adminReviewsFilter')?.value || 'all';
    let filtered;
    if (filter === 'flagged') {
        filtered = reviews.filter(r => r.flagged);
    } else if (filter === 'all') {
        filtered = [...reviews];
    } else {
        filtered = reviews.filter(r => r.targetType === filter);
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : '0.0';
    const flagged = reviews.filter(r => r.flagged).length;

    document.getElementById('adminTotalReviews').textContent = totalReviews;
    document.getElementById('adminAvgRating').textContent = avgRating;
    document.getElementById('adminFlaggedReviews').textContent = flagged;

    const tbody = document.getElementById('adminReviewsTable');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No reviews found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(r => {
        const stars = Array.from({length: 5}, (_, i) => `<i class="fas fa-star" style="color:${i < r.rating ? '#f59e0b' : '#e2e8f0'}"></i>`).join('');
        const targetType = r.targetType || 'unknown';
        return `<tr${r.flagged ? ' style="background:#fef2f2"' : ''}>
            <td><div class="review-stars-mini">${stars}</div></td>
            <td><strong>${(r.text || '').substring(0, 60)}${(r.text || '').length > 60 ? '...' : ''}</strong></td>
            <td>${r.authorName || 'Anonymous'}</td>
            <td><span class="badge" style="background:#3b82f622;color:#3b82f6;border:1px solid #3b82f644">${targetType}</span></td>
            <td>${fmtDate(r.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-xs" style="background:${r.flagged ? '#10b981' : '#f59e0b'};color:white;border:none" onclick="adminToggleFlagReview('${r.id}')" title="${r.flagged ? 'Unflag' : 'Flag'}"><i class="fas fa-flag"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteReview('${r.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminToggleFlagReview(id) {
    const reviews = Storage.getReviews();
    const review = reviews.find(r => r.id === id);
    if (review) {
        review.flagged = !review.flagged;
        Storage.setReviews(reviews);
        showToast(review.flagged ? 'Review flagged.' : 'Review unflagged.', 'info');
        renderAdminReviews();
    }
}

function adminDeleteReview(id) {
    if (!confirm('Delete this review?')) return;
    const reviews = Storage.getReviews().filter(r => r.id !== id);
    Storage.setReviews(reviews);
    showToast('Review deleted.', 'info');
    renderAdminReviews();
}

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
        content: Storage.getContent(),
        events: Storage.getEvents(),
        reviews: Storage.getReviews(),
        contentComments: Storage.getContentComments(),
        contentReactions: Storage.getContentReactions(),
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

// ==========================================
// FORUM ADMIN
// ==========================================
let currentAdminForumFilter = 'all';

function filterAdminForum(filter) {
    currentAdminForumFilter = filter;
    forumGroupFilter = '';
    document.querySelectorAll('#page-admin-forum .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderAdminForum();
}

const ADMIN_FORUM_CATS = {
    'hookups': { label: 'Hookups', color: '#ef4444', icon: 'fa-fire' },
    'fetishes': { label: 'Fetishes', color: '#8b5cf6', icon: 'fa-mask' },
    'swingers': { label: 'Swingers', color: '#ec4899', icon: 'fa-people-arrows' },
    'clubs': { label: 'Clubs', color: '#f59e0b', icon: 'fa-champagne-glasses' },
    'bdsm': { label: 'BDSM', color: '#6366f1', icon: 'fa-link' },
    'group-action': { label: 'Group Action', color: '#10b981', icon: 'fa-users' },
    'general': { label: 'General', color: '#3b82f6', icon: 'fa-comments' },
    'events': { label: 'Events', color: '#0ea5e9', icon: 'fa-calendar-days' },
    'tips': { label: 'Tips', color: '#10b981', icon: 'fa-lightbulb' },
    'newcomers': { label: 'New Members', color: '#f59e0b', icon: 'fa-hand-wave' },
    'offtopic': { label: 'Off-Topic', color: '#64748b', icon: 'fa-ellipsis' },
    'premium-exclusive': { label: 'Exclusive Content', color: '#d946ef', icon: 'fa-gem' },
    'premium-events': { label: 'Premium Events', color: '#f59e0b', icon: 'fa-star' },
    'premium-providers': { label: 'VIP Providers', color: '#d97706', icon: 'fa-crown' },
    'premium-safety': { label: 'Safety & Verified', color: '#10b981', icon: 'fa-shield-halved' },
    'premium-lounge': { label: 'VIP Lounge', color: '#6366f1', icon: 'fa-martini-glass-citrus' },
    'premium-marketplace': { label: 'Premium Marketplace', color: '#ec4899', icon: 'fa-store' }
};

function adminSetForumHeader(show) {
    const thead = document.getElementById('adminForumThead');
    if (thead) thead.style.display = show ? '' : 'none';
}

function renderAdminForum() {
    if (currentAdminForumFilter === 'replies') { renderAdminForumReplies(); return; }
    if (currentAdminForumFilter === 'groups') { renderAdminForumGroups(); return; }

    const threads = Storage.getForumThreads();
    const replies = Storage.getForumReplies();

    const repliesCount = replies.length;
    const totalLikes = Storage.getForumLikes().length;
    const threadCount = threads.length;
    const participants = new Set([...threads.map(t => t.author), ...replies.map(r => r.author)].filter(Boolean)).size;
    const setNum = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setNum('adminForumThreadCount', threadCount);
    setNum('adminForumReplyCount', repliesCount);
    setNum('adminForumLikeCount', totalLikes);
    setNum('adminForumUsersCount', participants);

    const search = document.getElementById('adminForumSearch')?.value?.toLowerCase() || '';

    let filtered = [...threads];

    if (forumGroupFilter) {
        filtered = filtered.filter(t => t.category === forumGroupFilter);
    } else if (currentAdminForumFilter === 'pinned') {
        filtered = filtered.filter(t => t.pinned);
    } else if (currentAdminForumFilter === 'locked') {
        filtered = filtered.filter(t => t.locked);
    }

    if (search) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(search) ||
            t.author.toLowerCase().includes(search) ||
            t.body.toLowerCase().includes(search) ||
            ((ADMIN_FORUM_CATS[t.category] || {}).label || '').toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tbody = document.getElementById('adminForumTableBody');
    if (!tbody) return;

    if (currentAdminForumFilter === 'all') {
        adminSetForumHeader(false);
        renderAdminForumActivity();
        return;
    }

    adminSetForumHeader(true);

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">No forum threads found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(thread => {
        const cat = ADMIN_FORUM_CATS[thread.category] || { label: thread.category, color: '#64748b', icon: 'fa-comment' };
        const threadReplies = replies.filter(r => r.threadId === thread.id).length;
        const likes = Storage.getForumLikes();
        const threadLikes = likes.filter(l => l.targetId === thread.id && l.type === 'thread').length;
        const date = new Date(thread.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

        let statusBadges = '';
        if (thread.pinned) statusBadges += '<span class="forum-pin-badge" style="margin-right:4px"><i class="fas fa-thumbtack"></i> Pinned</span>';
        if (thread.locked) statusBadges += '<span class="forum-lock-badge"><i class="fas fa-lock"></i> Locked</span>';
        if (!thread.pinned && !thread.locked) statusBadges = '<span style="color:var(--text-muted, #94a3b8);font-size:0.8rem">Active</span>';

        return `
            <tr>
                <td class="truncate" style="max-width:250px"><strong>${escapeHtml(thread.title)}</strong></td>
                <td>${escapeHtml(thread.author)}</td>
                <td><span style="background:${cat.color}18;color:${cat.color};padding:3px 8px;border-radius:8px;font-size:0.75rem;font-weight:600">${cat.label}</span></td>
                <td>${threadReplies}</td>
                <td>${threadLikes}</td>
                <td>${statusBadges}</td>
                <td>${date}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-xs" onclick="adminViewThread('${thread.id}')" title="Moderate">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-secondary btn-xs" onclick="adminTogglePin('${thread.id}')" title="${thread.pinned ? 'Unpin' : 'Pin'}">
                            <i class="fas fa-thumbtack"></i>
                        </button>
                        <button class="btn btn-secondary btn-xs" onclick="adminToggleLock('${thread.id}')" title="${thread.locked ? 'Unlock' : 'Lock'}">
                            <i class="fas fa-${thread.locked ? 'lock-open' : 'lock'}"></i>
                        </button>
                        <button class="btn btn-danger btn-xs" onclick="adminDeleteForumThread('${thread.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAdminForumReplies() {
    adminSetForumHeader(false);
    const replies = Storage.getForumReplies();
    const threads = Storage.getForumThreads();
    const search = document.getElementById('adminForumSearch')?.value?.toLowerCase() || '';

    let filtered = [...replies];

    if (search) {
        filtered = filtered.filter(r =>
            r.author.toLowerCase().includes(search) ||
            r.body.toLowerCase().includes(search) ||
            ((threads.find(t => t.id === r.threadId) || {}).title || '').toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tbody = document.getElementById('adminForumTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No replies found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(reply => {
        const thread = threads.find(t => t.id === reply.threadId);
        const cat = ADMIN_FORUM_CATS[thread && thread.category] || { label: thread ? thread.category : 'Unknown', color: '#64748b', icon: 'fa-comment' };
        const likes = Storage.getForumLikes();
        const replyLikes = likes.filter(l => l.targetId === reply.id && l.type === 'reply').length;
        const date = new Date(reply.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

        return `
            <tr>
                <td class="truncate" style="max-width:280px">${renderGistShort(reply.body)}</td>
                <td>${escapeHtml(reply.author)}</td>
                <td><a href="#" onclick="event.preventDefault(); adminViewThread('${thread ? thread.id : ''}')">${thread ? '<i class="fas fa-comment"></i> ' + escapeHtml(truncate(thread.title, 40)) : '<span style="color:var(--text-muted, #94a3b8)">Deleted thread</span>'}</a></td>
                <td>${replyLikes}</td>
                <td>${date}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-xs" onclick="adminDeleteForumReply('${reply.id}', '${thread ? thread.id : ''}')" title="Delete reply"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAdminForumGroups() {
    adminSetForumHeader(false);
    const threads = Storage.getForumThreads();
    const replies = Storage.getForumReplies();
    const likes = Storage.getForumLikes();

    const sections = {
        public: { label: 'Public Groups', desc: 'Open discussion categories', color: '#3b82f6' },
        premium: { label: 'Premium Groups', desc: 'Exclusive member categories', color: '#d946ef' }
    };

    const container = document.getElementById('adminForumTableBody');
    if (!container) return;

    const groupsBySection = Object.keys(ADMIN_FORUM_CATS).reduce((acc, key) => {
        const isPremium = key.startsWith('premium');
        const secKey = isPremium ? 'premium' : 'public';
        if (!acc[secKey]) acc[secKey] = [];
        acc[secKey].push(key);
        return acc;
    }, {});

    let html = '<tr><td colspan="8" style="padding:0">';
    Object.keys(sections).forEach(secKey => {
        const sec = sections[secKey];
        const keys = groupsBySection[secKey] || [];
        html += `<div style="margin-bottom:24px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                <span class="stat-icon" style="background:${sec.color}18;color:${sec.color};width:38px;height:38px;font-size:1rem"><i class="fas fa-layer-group"></i></span>
                <div><div style="font-weight:700;color:var(--text-primary, #1e293b)">${sec.label}</div>
                <div style="font-size:0.8rem;color:var(--text-muted, #94a3b8)">${sec.desc}</div></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">`;
        keys.forEach(key => {
            const cat = ADMIN_FORUM_CATS[key];
            const catThreads = threads.filter(t => t.category === key);
            const catRepliesCount = replies.filter(r => catThreads.some(t => t.id === r.threadId)).length;
            const catLikes = likes.filter(l => catThreads.some(t => t.id === l.targetId)).length;
            const last = catThreads.length ? new Date(Math.max(...catThreads.map(t => new Date(t.createdAt)))).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : 'No activity';
            html += `
                <div style="border:1px solid var(--border, #e2e8f0);border-radius:12px;padding:14px;background:var(--card-bg, #fff)">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                        <i class="fas ${cat.icon}" style="color:${cat.color}"></i>
                        <strong style="font-size:0.9rem">${cat.label}</strong>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.8rem;color:var(--text-muted, #94a3b8);margin-bottom:4px">
                        <div><i class="fas fa-comment" style="margin-right:4px"></i>${catThreads.length} threads</div>
                        <div><i class="fas fa-reply" style="margin-right:4px"></i>${catRepliesCount} replies</div>
                        <div><i class="fas fa-heart" style="margin-right:4px"></i>${catLikes} likes</div>
                        <div><i class="fas fa-clock" style="margin-right:4px"></i>${last}</div>
                    </div>
                    <div style="margin-top:10px">
                        <button class="btn btn-secondary btn-xs" onclick="filterAdminForumThreadsByGroup('${key}')"><i class="fas fa-eye"></i> View threads</button>
                    </div>
                </div>`;
        });
        html += '</div></div>';
    });
    html += '</td></tr>';
    container.innerHTML = html;
}

function filterAdminForumThreadsByGroup(category) {
    currentAdminForumFilter = 'threads';
    document.querySelectorAll('#page-admin-forum .filter-tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`#page-admin-forum .filter-tab[data-group="${category}"]`);
    if (tab) tab.classList.add('active');
    else document.querySelector('#page-admin-forum .filter-tab[onclick*="threads"]')?.classList.add('active');
    const search = document.getElementById('adminForumSearch');
    if (search) search.value = '';
    forumGroupFilter = category;
    renderAdminForum();
}

let forumGroupFilter = '';

function renderAdminForumThreads() {
    renderAdminForum();
}

function adminViewThread(id) {
    const thread = Storage.getForumThreads().find(t => t.id === id);
    if (!thread) { showAdminView('<p>Thread not found.</p>'); return; }
    const replies = Storage.getForumReplies().filter(r => r.threadId === id);
    const cat = ADMIN_FORUM_CATS[thread.category] || { label: thread.category, color: '#64748b', icon: 'fa-comment' };
    const likes = Storage.getForumLikes();
    const threadLikes = likes.filter(l => l.targetId === id && l.type === 'thread').length;
    const date = new Date(thread.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

    let statusBadges = '';
    if (thread.pinned) statusBadges += '<span class="forum-pin-badge" style="margin-right:4px"><i class="fas fa-thumbtack"></i> Pinned</span>';
    if (thread.locked) statusBadges += '<span class="forum-lock-badge"><i class="fas fa-lock"></i> Locked</span>';

    let repliesHtml = replies.length ? replies.map(r => {
        const rLikes = likes.filter(l => l.targetId === r.id && l.type === 'reply').length;
        return `
            <div style="display:flex;gap:10px;padding:12px 0;border-top:1px solid var(--border, #f1f5f9)">
                <div class="forum-reply-avatar">${escapeHtml((r.author || '?').charAt(0).toUpperCase())}</div>
                <div style="flex:1;min-width:0">
                    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
                        <strong style="font-size:0.88rem">${escapeHtml(r.author)}</strong>
                        <div style="display:flex;gap:8px;align-items:center">
                            <span style="font-size:0.75rem;color:var(--text-muted, #94a3b8)"><i class="fas fa-heart"></i> ${rLikes}</span>
                            <button class="btn btn-danger btn-xs" onclick="adminDeleteForumReply('${r.id}', '${id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div style="font-size:0.85rem;color:var(--text-secondary, #475569);margin-top:6px;line-height:1.6">${renderAdminRichText(r.body)}</div>
                </div>
            </div>`;
    }).join('') : '<p style="color:var(--text-muted, #94a3b8);font-size:0.85rem;padding:12px 0">No replies yet.</p>';

    showAdminView(`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">
            <span class="stat-icon" style="background:${cat.color}18;color:${cat.color};width:40px;height:40px;font-size:1rem"><i class="fas ${cat.icon}"></i></span>
            <div>
                <h2 style="margin:0 0 4px">${escapeHtml(thread.title)}</h2>
                <div style="font-size:0.8rem;color:var(--text-muted, #94a3b8)">
                    by <strong>${escapeHtml(thread.author)}</strong> · ${cat.label} · ${date} · <i class="fas fa-heart"></i> ${threadLikes}
                </div>
            </div>
        </div>
        ${statusBadges}
        <div style="margin:14px 0;padding:14px;background:#f8fafc;border-radius:10px;font-size:0.9rem;line-height:1.7">${renderAdminRichText(thread.body)}</div>
        <h3 style="font-size:1rem;margin:0 0 4px"><i class="fas fa-comments"></i> Replies (${replies.length})</h3>
        ${repliesHtml}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
            <button class="btn btn-secondary btn-sm" onclick="adminEditThread('${thread.id}')"><i class="fas fa-pen"></i> Edit Thread</button>
            <button class="btn ${thread.pinned ? 'btn-warning' : 'btn-secondary'} btn-sm" onclick="adminTogglePin('${thread.id}')"><i class="fas fa-thumbtack"></i> ${thread.pinned ? 'Unpin' : 'Pin'}</button>
            <button class="btn ${thread.locked ? 'btn-warning' : 'btn-secondary'} btn-sm" onclick="adminToggleLock('${thread.id}')"><i class="fas fa-lock"></i> ${thread.locked ? 'Unlock' : 'Lock'}</button>
            <button class="btn btn-danger btn-sm" onclick="adminDeleteForumThread('${thread.id}')"><i class="fas fa-trash"></i> Delete Thread</button>
        </div>
    `);
}

function renderAdminRichText(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/\[gif:(.*?)\]/g, (m, url) => `<img src="${url}" alt="GIF" loading="lazy" style="max-width:180px;border-radius:8px;display:block;margin:6px 0">`);
    html = html.replace(/\n/g, '<br>');
    return html;
}

function renderGistShort(text) {
    if (!text) return '';
    return truncate(text.replace(/\[gif:.*?\]/g, '[GIF]').replace(/\n/g, ' '), 60);
}

function adminEditThread(id) {
    const thread = Storage.getForumThreads().find(t => t.id === id);
    if (!thread) return;
    const categoryOptions = Object.keys(ADMIN_FORUM_CATS).map(key =>
        `<option value="${key}" ${key === thread.category ? 'selected' : ''}>${ADMIN_FORUM_CATS[key].label}</option>`
    ).join('');

    showAdminView(`
        <h2 style="margin:0 0 16px"><i class="fas fa-pen"></i> Edit Thread</h2>
        <label class="admin-form-label">Title</label>
        <input class="admin-form-input" id="adminEditThreadTitle" value="${escapeHtml(thread.title)}" />
        <label class="admin-form-label" style="margin-top:12px">Category</label>
        <select class="admin-form-input" id="adminEditThreadCategory">${categoryOptions}</select>
        <label class="admin-form-label" style="margin-top:12px">Body</label>
        <textarea class="admin-form-input" id="adminEditThreadBody" style="min-height:130px">${escapeHtml(thread.body)}</textarea>
        <div style="display:flex;gap:16px;margin-top:12px">
            <label style="font-size:0.85rem;display:flex;align-items:center;gap:6px"><input type="checkbox" id="adminEditThreadPinned" ${thread.pinned ? 'checked' : ''}> Pinned</label>
            <label style="font-size:0.85rem;display:flex;align-items:center;gap:6px"><input type="checkbox" id="adminEditThreadLocked" ${thread.locked ? 'checked' : ''}> Locked</label>
        </div>
        <div style="display:flex;gap:8px;margin-top:18px">
            <button class="btn btn-primary btn-sm" onclick="adminSaveThreadEdit('${thread.id}')"><i class="fas fa-save"></i> Save Changes</button>
            <button class="btn btn-secondary btn-sm" onclick="adminViewThread('${thread.id}')"><i class="fas fa-arrow-left"></i> Cancel</button>
        </div>
    `);
}

function adminSaveThreadEdit(id) {
    const threads = Storage.getForumThreads();
    const thread = threads.find(t => t.id === id);
    if (!thread) return;
    const title = document.getElementById('adminEditThreadTitle').value.trim();
    const category = document.getElementById('adminEditThreadCategory').value;
    const body = document.getElementById('adminEditThreadBody').value.trim();
    if (!title || !body) { showToast('Title and body are required.'); return; }
    thread.title = title;
    thread.category = category;
    thread.body = body;
    thread.pinned = document.getElementById('adminEditThreadPinned').checked;
    thread.locked = document.getElementById('adminEditThreadLocked').checked;
    thread.editedByAdmin = true;
    Storage.setForumThreads(threads);
    showToast('Thread updated.');
    adminViewThread(id);
}

function adminDeleteForumReply(id, threadId) {
    adminDeleteTarget = { type: 'forum-reply', id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Delete this reply? This cannot be undone.';
    adminDeleteAfterConfirm = () => {
        Storage.setForumReplies(Storage.getForumReplies().filter(r => r.id !== id));
        showToast('Reply deleted.');
        if (threadId && document.getElementById('adminViewModal').classList.contains('active')) {
            adminViewThread(threadId);
        } else {
            renderAdminForum();
        }
    };
    modal.classList.add('active');
}

function renderAdminForumActivity() {
    const threads = Storage.getForumThreads();
    const replies = Storage.getForumReplies();
    const likes = Storage.getForumLikes();
    const search = document.getElementById('adminForumSearch')?.value?.toLowerCase() || '';

    const items = [];
    threads.forEach(t => {
        const cat = ADMIN_FORUM_CATS[t.category] || { label: t.category, color: '#64748b', icon: 'fa-comment' };
        items.push({
            id: t.id,
            type: 'thread',
            title: t.title,
            author: t.author,
            category: t.category,
            catLabel: cat.label,
            catColor: cat.color,
            catIcon: cat.icon,
            likes: likes.filter(l => l.targetId === t.id && l.type === 'thread').length,
            time: new Date(t.createdAt),
            body: t.body
        });
    });
    replies.forEach(r => {
        const t = threads.find(x => x.id === r.threadId);
        const cat = ADMIN_FORUM_CATS[t && t.category] || { label: t ? t.category : 'Unknown', color: '#64748b', icon: 'fa-comment' };
        items.push({
            id: r.id,
            type: 'reply',
            title: t ? truncate(t.title, 50) : 'Deleted thread',
            threadId: r.threadId,
            author: r.author,
            category: t ? t.category : '',
            catLabel: cat.label,
            catColor: cat.color,
            catIcon: cat.icon,
            likes: likes.filter(l => l.targetId === r.id && l.type === 'reply').length,
            time: new Date(r.createdAt),
            body: r.body
        });
    });

    let filtered = items;
    if (search) {
        filtered = items.filter(i =>
            i.author.toLowerCase().includes(search) ||
            i.title.toLowerCase().includes(search) ||
            i.body.toLowerCase().includes(search) ||
            i.catLabel.toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => b.time - a.time);

    const tbody = document.getElementById('adminForumTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">No forum activity found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(item => {
        const date = item.time.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + item.time.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
        const target = item.type === 'thread'
            ? `onclick="adminViewThread('${item.id}')" style="cursor:pointer"`
            : (item.threadId ? `onclick="adminViewThread('${item.threadId}')" style="cursor:pointer"` : '');
        const icon = item.type === 'thread' ? 'fa-comment' : 'fa-reply';
        return `
            <tr ${target}>
                <td style="white-space:nowrap"><span class="stat-icon" style="background:${item.catColor}18;color:${item.catColor};width:32px;height:32px;font-size:0.8rem"><i class="fas ${icon}"></i></span></td>
                <td>
                    <strong style="font-size:0.88rem">${escapeHtml(item.title)}</strong>
                    <div style="font-size:0.75rem;color:var(--text-muted, #94a3b8);margin-top:2px">${renderGistShort(item.body)}</div>
                </td>
                <td>${escapeHtml(item.author)}</td>
                <td><span style="background:${item.catColor}18;color:${item.catColor};padding:3px 8px;border-radius:8px;font-size:0.75rem;font-weight:600">${item.catLabel}</span></td>
                <td style="white-space:nowrap">${date}</td>
            </tr>
        `;
    }).join('');
}

function adminTogglePin(id) {
    const threads = Storage.getForumThreads();
    const thread = threads.find(t => t.id === id);
    if (!thread) return;
    thread.pinned = !thread.pinned;
    Storage.setForumThreads(threads);
    showToast(thread.pinned ? 'Thread pinned.' : 'Thread unpinned.');
    renderAdminForum();
}

function adminToggleLock(id) {
    const threads = Storage.getForumThreads();
    const thread = threads.find(t => t.id === id);
    if (!thread) return;
    thread.locked = !thread.locked;
    Storage.setForumThreads(threads);
    showToast(thread.locked ? 'Thread locked.' : 'Thread unlocked.');
    renderAdminForum();
}

function adminDeleteForumThread(id) {
    adminDeleteTarget = { type: 'forum-thread', id };
    const modal = document.getElementById('deleteModal');
    const text = document.getElementById('deleteModalText');
    text.textContent = 'Delete this thread and all its replies? This cannot be undone.';
    adminDeleteAfterConfirm = () => {
        closeAdminView();
        renderAdminForum();
    };
    modal.classList.add('active');
}

// ==========================================
// MESSAGE ADMIN
// ==========================================
let currentAdminMsgFilter = 'all';

function filterAdminMessages(filter) {
    currentAdminMsgFilter = filter;
    document.querySelectorAll('#page-admin-messages .filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.closest('.filter-tab')?.classList.add('active');
    renderAdminMessages();
}

function renderAdminMessages() {
    const convs = Storage.getConversations();
    const messages = Storage.getMessages();
    const search = document.getElementById('adminMessagesSearch')?.value?.toLowerCase() || '';

    document.getElementById('adminMsgConvCount').textContent = convs.length;
    document.getElementById('adminMsgCount').textContent = messages.length;
    document.getElementById('adminMsgUnreadCount').textContent = messages.filter(m => m.senderId !== 'me' && !m.read).length;
    document.getElementById('adminMsgArchivedCount').textContent = convs.filter(c => c.status === 'archived').length;

    let filtered = [...convs];
    if (currentAdminMsgFilter === 'unread') {
        filtered = filtered.filter(c => messages.some(m => m.conversationId === c.id && m.senderId !== 'me' && !m.read));
    } else if (currentAdminMsgFilter === 'archived') {
        filtered = filtered.filter(c => c.status === 'archived');
    }

    if (search) {
        filtered = filtered.filter(c =>
            c.subject.toLowerCase().includes(search) ||
            c.participantName.toLowerCase().includes(search) ||
            c.lastMessage.toLowerCase().includes(search)
        );
    }

    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const tbody = document.getElementById('adminMessagesTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">No conversations found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(c => {
        const convMsgs = messages.filter(m => m.conversationId === c.id);
        const unread = convMsgs.filter(m => m.senderId !== 'me' && !m.read).length;
        return `
            <tr>
                <td class="truncate" style="max-width:220px"><strong>${escapeHtml(c.subject)}</strong></td>
                <td>${escapeHtml(c.participantName)} ${c.participantRole === 'provider' ? '<span style="color:#10b981;font-size:0.75rem">(provider)</span>' : ''}</td>
                <td>${convMsgs.length}</td>
                <td>${unread ? `<span style="color:#ef4444;font-weight:700">${unread}</span>` : '-'}</td>
                <td>${c.status === 'archived' ? '<span style="color:#94a3b8">Archived</span>' : '<span style="color:#10b981">Active</span>'}</td>
                <td class="truncate" style="max-width:200px">${escapeHtml(msgPreviewText(c.lastMessage))}</td>
                <td>${fmtDate(c.updatedAt)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-xs" onclick="adminViewConversation('${c.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-secondary btn-xs" onclick="adminToggleArchive('${c.id}')" title="${c.status === 'archived' ? 'Unarchive' : 'Archive'}">
                            <i class="fas ${c.status === 'archived' ? 'fa-box-open' : 'fa-box-archive'}"></i>
                        </button>
                        <button class="btn btn-danger btn-xs" onclick="adminDeleteConversation('${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function adminViewConversation(id) {
    const conv = Storage.getConversations().find(c => c.id === id);
    if (!conv) return;
    const msgs = Storage.getMessages().filter(m => m.conversationId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const threadHtml = msgs.length === 0
        ? '<p style="color:#94a3b8">No messages</p>'
        : msgs.map(m => `
            <div style="padding:10px 0;border-bottom:1px solid #f1f5f9">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <strong>${escapeHtml(m.senderName)}</strong>
                    <span style="color:#94a3b8;font-size:0.75rem">${fmtDate(m.createdAt)}</span>
                </div>
                <div style="font-size:0.9rem;color:#334155">${renderMsgBodyText(m.body)}</div>
            </div>
        `).join('');

    showAdminView(`
        <h2><i class="fas fa-envelope-open-text"></i> ${escapeHtml(conv.subject)}</h2>
        <p style="color:#64748b;margin-top:4px">With: <strong>${escapeHtml(conv.participantName)}</strong> (${conv.participantRole}) &middot; Created ${fmtDate(conv.createdAt)}</p>
        <div style="max-height:280px;overflow-y:auto;margin-top:16px;background:#f8fafc;border-radius:10px;padding:12px 16px">${threadHtml}</div>
        <div style="margin-top:16px">
            <label style="display:block;font-weight:600;color:#475569;font-size:0.85rem;margin-bottom:6px">Reply as Admin:</label>
            <textarea id="adminMsgReplyBody" rows="3" style="width:100%;padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;font-family:inherit;font-size:0.88rem;resize:none"></textarea>
            <button class="btn btn-primary btn-xs" onclick="adminReplyConversation('${conv.id}')" style="margin-top:8px"><i class="fas fa-paper-plane"></i> Send Reply</button>
        </div>
    `);
}

function adminReplyConversation(id) {
    const body = document.getElementById('adminMsgReplyBody')?.value.trim();
    if (!body) { showToast('Please enter a reply.', 'error'); return; }

    const convs = Storage.getConversations();
    const conv = convs.find(c => c.id === id);
    if (!conv) return;

    const messages = Storage.getMessages();
    messages.push({
        id: generateId(),
        conversationId: id,
        senderId: 'admin',
        senderName: '2k2 Admin',
        body,
        read: true,
        createdAt: new Date().toISOString()
    });
    Storage.setMessages(messages);

    conv.lastMessage = body;
    conv.updatedAt = new Date().toISOString();
    Storage.setConversations(convs);

    showToast('Admin reply sent.');
    renderAdminMessages();
    closeAdminView();
}

function adminToggleArchive(id) {
    const convs = Storage.getConversations();
    const conv = convs.find(c => c.id === id);
    if (!conv) return;
    conv.status = conv.status === 'archived' ? 'active' : 'archived';
    conv.updatedAt = new Date().toISOString();
    Storage.setConversations(convs);
    showToast(conv.status === 'archived' ? 'Conversation archived.' : 'Conversation restored.');
    renderAdminMessages();
}

function adminDeleteConversation(id) {
    const conv = Storage.getConversations().find(c => c.id === id);
    promptAdminDelete('conversation', id, conv ? conv.subject : 'Conversation');
}

function adminMessageLogsSearch() { renderAdminMessageLogs(); }

function renderAdminMessageLogs() {
    let messages = [...Storage.getMessages()];
    const search = document.getElementById('adminLogsSearch')?.value?.toLowerCase() || '';

    if (search) {
        messages = messages.filter(m =>
            m.senderName.toLowerCase().includes(search) ||
            (m.body || '').toLowerCase().includes(search)
        );
    }

    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tbody = document.getElementById('adminMessageLogsBody');
    if (!tbody) return;

    if (messages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">No messages found</td></tr>';
        return;
    }

    const convs = Storage.getConversations();
    tbody.innerHTML = messages.map(m => {
        const conv = convs.find(c => c.id === m.conversationId);
        const contact = conv ? conv.participantName : '-';
        return `
            <tr>
                <td>${fmtDate(m.createdAt)}</td>
                <td>${escapeHtml(m.senderName)} ${m.senderId === 'admin' ? '<span style="color:#ef4444;font-size:0.75rem">(admin)</span>' : ''}</td>
                <td>${escapeHtml(contact)}</td>
                <td class="truncate" style="max-width:300px">${escapeHtml(msgPreviewText(m.body))}</td>
                <td>
                    <div class="admin-actions">
                        ${conv ? `<button class="btn btn-secondary btn-xs" onclick="adminViewConversation('${conv.id}')" title="View"><i class="fas fa-eye"></i></button>` : ''}
                        <button class="btn btn-danger btn-xs" onclick="adminDeleteMessage('${m.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function adminDeleteMessage(id) {
    promptAdminDelete('message', id, 'message');
}

function renderAdminSavedItems() {
    let items = [...Storage.getSavedItems()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const search = document.getElementById('adminSavedSearch')?.value?.toLowerCase() || '';
    if (search) items = items.filter(s => (s.title || '').toLowerCase().includes(search) || (s.sub || '').toLowerCase().includes(search));

    const tbody = document.getElementById('adminSavedItemsBody');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">No saved items found</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(s => `
        <tr>
            <td><i class="fas ${s.icon || 'fa-star'}" style="color:${s.color || '#64748b'};margin-right:8px"></i>${escapeHtml(s.title)}</td>
            <td>${escapeHtml((s.kind || 'item').replace('-', ' '))}</td>
            <td class="truncate" style="max-width:200px">${escapeHtml(s.sub || '-')}</td>
            <td>${fmtDate(s.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-danger btn-xs" onclick="promptAdminDelete('saved-item', '${s.id}', '${escapeHtml(s.title).replace(/'/g, "\\'")}')" title="Remove"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderAdminDownloads() {
    let items = [...Storage.getDownloads()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const search = document.getElementById('adminDownloadsSearch')?.value?.toLowerCase() || '';
    if (search) items = items.filter(d => (d.title || '').toLowerCase().includes(search) || (d.sub || '').toLowerCase().includes(search));

    const tbody = document.getElementById('adminDownloadsBody');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-cell">No downloads found</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(d => `
        <tr>
            <td><i class="fas fa-file" style="color:#0ea5e9;margin-right:8px"></i>${escapeHtml(d.title)}</td>
            <td>${escapeHtml((d.kind || 'file').replace('-', ' '))}</td>
            <td>${fmtDate(d.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminPreviewDownload('${d.id}')" title="Preview"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="promptAdminDelete('download', '${d.id}', '${escapeHtml(d.title).replace(/'/g, "\\'")}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function adminPreviewDownload(id) {
    const d = Storage.getDownloads().find(x => x.id === id);
    if (!d) return;
    const fileType = (d.fileType || '').toLowerCase();
    let body = `<p class="admin-view-row"><span class="label">Title</span><span class="value">${escapeHtml(d.title)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Type</span><span class="value">${escapeHtml(d.kind)}</span></p>`;
    if (fileType.startsWith('image/') || fileType.startsWith('video/') || fileType.startsWith('audio/')) {
        body += `<div style="margin:16px 0"><img src="${d.fileData}" alt="${escapeHtml(d.title)}" style="max-width:100%;max-height:240px;border-radius:12px;object-fit:contain"></div>`;
    }
    showAdminView(body);
}

function renderAdminExperiences() {
    let experiences = [...Storage.getExperiences()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const search = document.getElementById('adminExperiencesSearch')?.value?.toLowerCase() || '';
    if (search) {
        experiences = experiences.filter(x =>
            (x.title || '').toLowerCase().includes(search) ||
            (x.type || '').toLowerCase().includes(search) ||
            (x.location || '').toLowerCase().includes(search)
        );
    }

    const purchases = Storage.getExperiencePurchases();
    const tbody = document.getElementById('adminExperiencesBody');
    if (!tbody) return;

    if (experiences.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">No experiences found</td></tr>';
        return;
    }

    tbody.innerHTML = experiences.map(x => {
        const type = EXPERIENCE_TYPES[x.type] || { label: x.type || '-', icon: 'fa-gamepad', color: '#64748b' };
        const sales = purchases.filter(p => p.experienceId === x.id);
        const sold = sales.length;
        const revenue = sales.reduce((s, p) => s + p.amount, 0);
        return `
            <tr>
                <td><i class="fas ${type.icon}" style="color:${type.color};margin-right:8px"></i>${escapeHtml(x.title)}</td>
                <td>${escapeHtml(type.label)}</td>
                <td>${escapeHtml(x.author || x.providerId || '-')}</td>
                <td>R${x.price || 0}</td>
                <td>${sold} (R${revenue.toFixed(0)})</td>
                <td>${fmtDate(x.createdAt)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-xs" onclick="adminViewExperience('${x.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-danger btn-xs" onclick="promptAdminDelete('experience', '${x.id}', '${escapeHtml(x.title).replace(/'/g, "\\'")}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function adminViewExperience(id) {
    const x = Storage.getExperiences().find(item => item.id === id);
    if (!x) return;
    const type = EXPERIENCE_TYPES[x.type] || { label: x.type || '-', icon: 'fa-gamepad', color: '#64748b' };
    const sales = Storage.getExperiencePurchases().filter(p => p.experienceId === id);
    let body = `<p class="admin-view-row"><span class="label">Title</span><span class="value">${escapeHtml(x.title)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Type</span><span class="value"><i class="fas ${type.icon}" style="color:${type.color}"></i> ${escapeHtml(type.label)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Provider</span><span class="value">${escapeHtml(x.author || x.providerId || '-')}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Price</span><span class="value">R${x.price || 0}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Location</span><span class="value">${escapeHtml(x.location || '-')}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Sold</span><span class="value">${sales.length} (R${sales.reduce((s, p) => s + p.amount, 0).toFixed(0)})</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Capacity</span><span class="value">${escapeHtml(x.capacity || '-')}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Duration</span><span class="value">${escapeHtml(x.duration || '-')}</span></p>`;
    if (x.coverPhoto) body += `<div style="margin:12px 0"><img src="${x.coverPhoto}" alt="" style="max-width:100%;max-height:200px;border-radius:12px;object-fit:cover"></div>`;
    body += `<p class="admin-view-row"><span class="label">Description</span></p><p>${escapeHtml(x.description || '-')}</p>`;
    if (x.rules) body += `<p class="admin-view-row"><span class="label">Rules</span></p><p>${escapeHtml(x.rules)}</p>`;
    if (x.includes) body += `<p class="admin-view-row"><span class="label">Includes</span></p><p>${escapeHtml(x.includes)}</p>`;
    showAdminView(body);
}

function renderAdminFantasy() {
    let requests = [...Storage.getFantasyRequests()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const search = document.getElementById('adminFantasySearch')?.value?.toLowerCase() || '';
    if (search) {
        requests = requests.filter(r =>
            (r.title || '').toLowerCase().includes(search) ||
            (r.category || '').toLowerCase().includes(search)
        );
    }

    const tbody = document.getElementById('adminFantasyBody');
    if (!tbody) return;

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">No fantasy requests found</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(r => {
        const cat = FANTASY_CATEGORIES[r.category] || { label: r.category || '-', icon: 'fa-scroll', color: '#64748b' };
        const status = FANTASY_STATUSES[r.status] || { label: r.status || '-', color: '#64748b', icon: 'fa-circle' };
        const responseCount = (r.responses || []).length;
        return `
            <tr>
                <td><i class="fas ${cat.icon}" style="color:${cat.color};margin-right:8px"></i>${escapeHtml(r.title)}</td>
                <td>${escapeHtml(cat.label)}</td>
                <td>R${r.price || 0}</td>
                <td>${responseCount}</td>
                <td><span class="status-badge" style="background:${status.color}20;color:${status.color}"><i class="fas ${status.icon}"></i> ${escapeHtml(status.label)}</span></td>
                <td>${fmtDate(r.createdAt)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-xs" onclick="adminViewFantasy('${r.id}')" title="View"><i class="fas fa-eye"></i></button>
                        ${r.status === 'pending' ? `
                            <button class="btn btn-success btn-xs" onclick="adminApproveFantasy('${r.id}')" title="Approve"><i class="fas fa-check"></i></button>
                            <button class="btn btn-warning btn-xs" onclick="adminRejectFantasy('${r.id}')" title="Reject"><i class="fas fa-ban"></i></button>
                        ` : ''}
                        <button class="btn btn-danger btn-xs" onclick="promptAdminDelete('fantasy-request', '${r.id}', '${escapeHtml(r.title).replace(/'/g, "\\'")}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function adminViewFantasy(id) {
    const r = Storage.getFantasyRequests().find(item => item.id === id);
    if (!r) return;
    const cat = FANTASY_CATEGORIES[r.category] || { label: r.category || '-', icon: 'fa-scroll', color: '#64748b' };
    const status = FANTASY_STATUSES[r.status] || { label: r.status || '-', color: '#64748b', icon: 'fa-circle' };
    let body = `<p class="admin-view-row"><span class="label">Title</span><span class="value">${escapeHtml(r.title)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Category</span><span class="value"><i class="fas ${cat.icon}" style="color:${cat.color}"></i> ${escapeHtml(cat.label)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Budget</span><span class="value">R${r.price || 0}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Location</span><span class="value">${escapeHtml(r.location || '-')}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Status</span><span class="value"><i class="fas ${status.icon}" style="color:${status.color}"></i> ${escapeHtml(status.label)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Description</span></p><p>${escapeHtml(r.description || '-')}</p>`;
    if (r.responses && r.responses.length > 0) {
        body += `<p class="admin-view-row"><span class="label">Provider Responses</span></p>`;
        r.responses.forEach(res => {
            body += `<div style="border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;margin:8px 0">
                <strong><i class="fas fa-briefcase"></i> ${escapeHtml(res.providerName || 'Provider')}</strong> <span style="color:#10b981">R${res.price || 0}</span>
                <p style="font-size:0.85rem;color:#475569;margin-top:6px">${escapeHtml(res.message || '')}</p>
                <span style="font-size:0.75rem;color:#94a3b8">${fmtDate(res.createdAt)}</span>
            </div>`;
        });
    }
    showAdminView(body);
}

function adminApproveFantasy(id) {
    const requests = Storage.getFantasyRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return;
    requests[idx].status = 'approved';
    requests[idx].approvedAt = new Date().toISOString();
    Storage.setFantasyRequests(requests);
    showToast('Fantasy request approved and published.');
    renderAdminFantasy();
}

function adminRejectFantasy(id) {
    const requests = Storage.getFantasyRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return;
    requests[idx].status = 'rejected';
    requests[idx].rejectedAt = new Date().toISOString();
    Storage.setFantasyRequests(requests);
    showToast('Fantasy request rejected.');
    renderAdminFantasy();
}
