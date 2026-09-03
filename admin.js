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
    if (page === 'admin-approvals') renderAdminApprovals();
    if (page === 'admin-upgrades') renderAdminUpgrades();
    if (page === 'admin-providers') renderAdminProviders();
    if (page === 'admin-listings') renderAdminListings();
    if (page === 'admin-venues') renderAdminVenues();
    if (page === 'admin-ads') renderAdminAds();
    if (page === 'admin-services') renderAdminServices();
    if (page === 'admin-bookings') renderAdminBookings();
    if (page === 'admin-gigs') renderAdminGigs();
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
    if (page === 'admin-products') renderAdminProducts();
    if (page === 'admin-product-orders') renderAdminProductOrders();
    if (page === 'admin-help-queries') renderAdminHelpQueries();

    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 768) sidebar.classList.add('hidden');
    const main = document.getElementById('mainContent');
    if (main) main.classList.remove('shifted');
    setAdminBottomNav(page);
}

function setAdminBottomNav(page) {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;
    nav.querySelectorAll('.bottom-nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-page') === page);
    });
}

function navBottom(page) {
    navigateTo(page);
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
    } else if (type === 'content') {
        Storage.setContent(Storage.getContent().filter(c => c.id !== id));
        showToast('Content deleted.');
        renderAdminContent();
    } else if (type === 'event') {
        Storage.setEvents(Storage.getEvents().filter(e => e.id !== id));
        showToast('Event deleted.');
        renderAdminEvents();
    } else if (type === 'experience') {
        Storage.setExperiences(Storage.getExperiences().filter(x => x.id !== id));
        showToast('Experience deleted.');
        renderAdminExperiences();
    } else if (type === 'fantasy-request') {
        Storage.setFantasyRequests(Storage.getFantasyRequests().filter(r => r.id !== id));
        showToast('Fantasy request deleted.');
        renderAdminFantasy();
    } else if (type === 'service') {
        Storage.setServices(Storage.getServices().filter(x => x.id !== id));
        showToast('Service deleted.');
        renderAdminServices();
    } else if (type === 'booking') {
        Storage.setBookings(Storage.getBookings().filter(x => x.id !== id));
        showToast('Booking deleted.');
        renderAdminBookings();
    } else if (type === 'gig') {
        Storage.setGigs(Storage.getGigs().filter(x => x.id !== id));
        showToast('Gig deleted.');
        renderAdminGigs();
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
    if (!tags || tags.length === 0) return '<span style="color:#a99c7e">-</span>';
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

    const commissionTotal = Storage.getTransactions().filter(t => t.type === 'commission').reduce((s, t) => s + t.amount, 0);
    const commissionEl = document.getElementById('adminCommissionTotal');
    if (commissionEl) commissionEl.textContent = `R${Math.round(commissionTotal)}`;

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
        ? '<p style="color:#a99c7e;font-size:0.88rem;padding:12px 0">No activity yet</p>'
        : allItems.map(item => `
            <div class="admin-activity-item">
                <div class="admin-activity-dot" style="background:${item.color}"></div>
                <div>
                    <div class="admin-activity-text">New ${item.type}: <strong>${truncate(item.name, 25)}</strong></div>
                    <div class="admin-activity-time">${fmtDate(item.date)}</div>
                </div>
            </div>
        `).join('');

    // ---- Additional stat counts ----
    const gigs = Storage.getGigs();
    const products = Storage.getProducts();
    const forumThreads = Storage.getForumThreads();
    const experiences = Storage.getExperiences();
    const fantasy = Storage.getFantasyRequests();
    const topUps = Storage.getTopUpRequests();
    const helpQueries = Storage.getHelpQueries();

    setEl('adminContentCount', content.length);
    setEl('adminEventCount', events.length);
    setEl('adminReviewCount', reviews.length);
    setEl('adminGigCount', gigs.length);
    setEl('adminProductCount', products.length);
    setEl('adminForumCount', forumThreads.length);
    setEl('adminExperienceCount', experiences.length);
    setEl('adminFantasyCount', fantasy.length);
    setEl('adminTopUpCount', topUps.length);
    setEl('adminHelpCount', helpQueries.length);

    // ---- Pending approval count ----
    const pendingCount = getAllPendingReviews().length;
    setEl('adminApprovalCount', pendingCount);
    const badge = document.getElementById('adminApprovalsBadge');
    if (badge) { badge.textContent = pendingCount; badge.style.display = pendingCount ? 'inline-block' : 'none'; }
    const dashTile = document.getElementById('adminApprovalsTile');
    if (dashTile) {
        dashTile.style.display = '';
        const numEl = dashTile.querySelector('.stat-number');
        if (numEl) numEl.textContent = pendingCount;
    }

    // ---- Account Distribution (donut) ----
    const pie = document.getElementById('adminPieChart');
    if (pie) {
        const slices = [
            { label: 'Users', value: users.length, color: '#667eea' },
            { label: 'Providers', value: providers.length, color: '#8b5cf6' },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length + (providers.filter(p => p.role === 'admin').length), color: '#d3ad44' }
        ];
        const total = slices.reduce((s, x) => s + x.value, 0);
        let grad = 'conic-gradient(';
        let acc = 0;
        slices.forEach((s, i) => {
            const start = total ? (acc / total) * 360 : 0;
            const end = total ? ((acc + s.value) / total) * 360 : 0;
            grad += `${s.color} ${start}deg ${end}deg${i < slices.length - 1 ? ',' : ''}`;
            acc += s.value;
        });
        const deg = total ? grad + ')' : 'conic-gradient(#e6dec8 0deg 360deg)';
        pie.innerHTML = `
            <div style="flex:0 0 140px;width:140px;height:140px;border-radius:50%;background:${deg};position:relative">
                <div style="position:absolute;inset:30px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column">
                    <span style="font-size:1.3rem;font-weight:800;color:#211a0d">${total}</span>
                    <span style="font-size:0.68rem;color:#a99c7e">Accounts</span>
                </div>
            </div>
            <div style="flex:1;min-width:110px">
                ${slices.map(s => `
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0">
                        <span style="display:flex;align-items:center;gap:8px;font-size:0.82rem;color:#54492f">
                            <span style="width:12px;height:12px;border-radius:3px;background:${s.color};display:inline-block"></span>
                            ${s.label}
                        </span>
                        <strong style="color:#211a0d">${s.value} ${total ? '(' + Math.round((s.value / total) * 100) + '%)' : ''}</strong>
                    </div>`).join('')}
            </div>`;
    }

    // ---- Financial Overview (transactions by type) ----
    const fin = document.getElementById('adminFinanceChart');
    if (fin) {
        const txns = Storage.getTransactions();
        const types = {};
        txns.forEach(t => { const k = t.type || (t.amount < 0 ? 'Debit' : 'Credit') || 'Other'; types[k] = (types[k] || 0) + Math.abs(t.amount || 0); });
        let finRows;
        const finKeys = Object.keys(types);
        if (finKeys.length === 0) {
            finRows = `<p style="color:#a99c7e;font-size:0.85rem;padding:12px 0">No transactions yet</p>`;
        } else {
            const maxTxn = Math.max(...Object.values(types), 1);
            finRows = finKeys.map(k => `
                <div style="margin:10px 0">
                    <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#54492f;margin-bottom:4px">
                        <span>${k}</span><strong style="color:#211a0d">R${Math.round(types[k]).toLocaleString()}</strong>
                    </div>
                    <div style="height:10px;background:#f0ead8;border-radius:6px;overflow:hidden">
                        <div style="height:100%;width:${(types[k] / maxTxn) * 100}%;background:linear-gradient(90deg,#d3ad44,#8b5cf6);border-radius:6px"></div>
                    </div>
                </div>`).join('');
        }
        fin.innerHTML = `<div style="font-size:0.9rem;color:#211a0d;margin-bottom:6px"><strong>Volume handled</strong>: R${Math.round(txns.reduce((s,t) => s + Math.abs(t.amount||0),0)).toLocaleString()} <span style="color:#a99c7e;font-size:0.75rem">(${txns.length} txns)</span></div>` + finRows;
    }

    // ---- Top Providers by Listings ----
    const top = document.getElementById('adminTopProviders');
    if (top) {
        const counts = {};
        listings.forEach(l => { const pid = l.providerId || l.authorId || l.author || 'unknown'; counts[pid] = (counts[pid] || 0) + 1; });
        const rows = Object.entries(counts).map(([pid, c]) => {
            const prov = providers.find(p => p.id === pid);
            return { name: (prov && (prov.name || prov.businessName)) ? (prov.name || prov.businessName) : (pid === 'unknown' ? 'Unknown' : 'Provider ' + pid.slice(0, 6)), c: c, color: '#8b5cf6' };
        }).sort((a, b) => b.c - a.c).slice(0, 6);
        top.innerHTML = rows.length === 0
            ? '<p style="color:#a99c7e;font-size:0.85rem;padding:12px 0">No listings yet</p>'
            : rows.map(r => { const max = rows[0].c || 1; return `
                <div style="display:flex;align-items:center;gap:10px;margin:10px 0">
                    <div style="flex:1">
                        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#54492f;margin-bottom:4px">
                            <span>${truncate(r.name, 22)}</span><strong style="color:#211a0d">${r.c}</strong>
                        </div>
                        <div style="height:9px;background:#f0ead8;border-radius:6px;overflow:hidden">
                            <div style="height:100%;width:${(r.c / max) * 100}%;background:${r.color};border-radius:6px"></div>
                        </div>
                    </div>
                </div>`;
            }).join('');
    }

    // ---- Wallet Distribution (top balances) ----
    const wd = document.getElementById('adminWalletDist');
    if (wd) {
        const walletsAll = Storage.getWallets();
        const topW = [...walletsAll].sort((a, b) => (b.balance || 0) - (a.balance || 0)).slice(0, 6);
        const maxW = topW.length ? Math.max(...topW.map(w => w.balance || 0), 1) : 1;
        wd.innerHTML = topW.length === 0
            ? '<p style="color:#a99c7e;font-size:0.85rem;padding:12px 0">No wallets yet</p>'
            : topW.map(w => {
                const name = w.ownerName || w.username || w.email || ('User ' + (w.ownerId || '').slice(0, 6)) || 'General';
                return `
                <div style="display:flex;align-items:center;gap:10px;margin:9px 0">
                    <span style="width:34px;font-size:0.72rem;color:#a99c7e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${truncate(name, 12)}</span>
                    <div style="flex:1;height:10px;background:#f0ead8;border-radius:6px;overflow:hidden">
                        <div style="height:100%;width:${((w.balance || 0) / maxW) * 100}%;background:linear-gradient(90deg,#ec4899,#f59e0b);border-radius:6px"></div>
                    </div>
                    <strong style="font-size:0.78rem;color:#211a0d">R${Math.round(w.balance || 0).toLocaleString()}</strong>
                </div>`;
            }).join('');
    }
}

function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ==========================================
// CONTENT APPROVALS (review queue)
// ==========================================
function renderAdminApprovals() {
    const container = document.getElementById('adminApprovalsPanels');
    if (!container) return;

    const pending = getAllPendingReviews();
    const pendingCount = pending.length;

    const badge = document.getElementById('adminApprovalsBadge');
    if (badge) { badge.textContent = pendingCount; badge.style.display = pendingCount ? 'inline-block' : 'none'; }
    setEl('adminApprovalCount', pendingCount);

    if (!pending.length) {
        container.innerHTML = '<div class="admin-approval-empty"><i class="fas fa-clipboard-check"></i><strong>All caught up!</strong><div>No content is waiting for approval right now.</div></div>';
        return;
    }

    const grouped = {};
    pending.forEach(r => { (grouped[r.type] = grouped[r.type] || []).push(r); });

    const typeOrder = Object.keys(APPROVAL_TYPES);
    let html = '';
    typeOrder.forEach(type => {
        const group = grouped[type];
        if (!group || !group.length) return;
        const t = APPROVAL_TYPES[type];
        html += `<div class="admin-approval-group">
            <h3><i class="fas fa-${iconForApprovalGroup(type)}"></i> ${escapeHtml(t.label)}s <span class="approval-group-count">${group.length}</span></h3>`;
        group.forEach(r => {
            const item = r.item;
            const title = escapeHtml(itemDisplayTitle(item, type));
            const owner = escapeHtml(itemOwnerName(item, type));
            const when = fmtDate((item.approval && item.approval.requestedAt) || item.createdAt || '') || '-';
            const desc = escapeHtml(truncate(extractApprovalExcerpt(item, type), 120));
            html += `<div class="admin-approval-card">
                <div class="admin-approval-card-info">
                    <div class="admin-approval-card-title">${title}</div>
                    <div class="admin-approval-card-meta"><i class="fas fa-user"></i> ${owner} &nbsp;•&nbsp; Requested ${when}</div>
                    ${desc ? `<div class="admin-approval-card-meta">${desc}</div>` : ''}
                </div>
                <div class="admin-approval-card-actions">
                    <input class="admin-approval-reason-input" id="rejReason_${type}_${item.id}" placeholder="Reject reason (required)" />
                    <button class="btn btn-success btn-sm" onclick="adminApproveItem('${type}','${String(item.id).replace(/'/g, "\\'")}')"><i class="fas fa-check"></i> Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="adminRejectItem('${type}','${String(item.id).replace(/'/g, "\\'")}')"><i class="fas fa-ban"></i> Reject</button>
                </div>
            </div>`;
        });
        html += `</div>`;
    });

    container.innerHTML = html;
}

function iconForApprovalGroup(type) {
    return {
        user: 'user', provider: 'user-tie', listing: 'address-book', venue: 'store',
        ad: 'bullhorn', service: 'concierge-bell', content: 'photo-film', event: 'calendar-days',
        gig: 'briefcase', experience: 'star', product: 'cart-shopping', fantasy: 'wand-magic-sparkles'
    }[type] || 'clipboard-check';
}

function extractApprovalExcerpt(item, type) {
    const s = item.bio || item.description || item.body || item.details || '';
    if (typeof s === 'string') return s.replace(/<[^>]*>/g, ' ');
    return '';
}

function adminApproveItem(type, id) {
    const res = reviewItem(type, id, 'approved', '');
    if (res.ok) showAdminToast(`${res.type.label} approved`, 'success');
    else showAdminToast(res.error || 'Could not approve item', 'error');
    renderAdminApprovals();
}

function adminRejectItem(type, id) {
    const reason = (document.getElementById('rejReason_' + type + '_' + id) || {}).value || '';
    if (!reason.trim()) { showAdminToast('Please enter a reason for rejection.', 'error'); return; }
    const res = reviewItem(type, id, 'rejected', reason);
    if (res.ok) showAdminToast(`${res.type.label} rejected`, 'success');
    else showAdminToast(res.error || 'Could not reject item', 'error');
    renderAdminApprovals();
}

function showAdminToast(message, type = 'success') {
    if (typeof showToast === 'function') { showToast(message, type); return; }
    alert(message);
}

// ==========================================
// USERS MANAGEMENT
// ==========================================
function renderAdminUsers() {
    const users = Storage.getUsers();
    const tbody = document.querySelector('#adminUsersTable tbody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a99c7e;padding:40px">No users registered yet</td></tr>';
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
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleUserStatus('${u.id}')" title="${u.status === 'suspended' ? 'Reinstate' : 'Suspend'}">
                        <i class="fas fa-${u.status === 'suspended' ? 'check-circle' : 'ban'}" style="color:${u.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteUser('${u.id}','${(u.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function adminToggleUserStatus(id) {
    const users = Storage.getUsers();
    const u = users.find(x => x.id === id);
    if (!u) return;
    u.status = u.status === 'suspended' ? 'active' : 'suspended';
    Storage.setUsers(users);
    showToast(u.status === 'suspended' ? 'User suspended.' : 'User reinstated.');
    renderAdminUsers();
}

function openAdminAddUser() {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.classList.add('active');
}

function closeAdminAddUser() {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.classList.remove('active');
}

function adminSaveNewUser() {
    const name = (document.getElementById('addUserName').value || '').trim();
    const email = (document.getElementById('addUserEmail').value || '').trim();
    const phone = (document.getElementById('addUserPhone').value || '').trim();
    const location = (document.getElementById('addUserLocation').value || '').trim();
    const type = document.getElementById('addUserType').value;
    const status = document.getElementById('addUserStatus').value;
    const bio = (document.getElementById('addUserBio').value || '').trim();

    if (!name) { showToast('Please enter a name.', 'error'); return; }
    if (!email) { showToast('Please enter an email.', 'error'); return; }

    const id = generateId();
    const now = new Date().toISOString();

    if (type === 'provider') {
        const providers = Storage.getProviders();
        providers.push({
            id: id,
            userId: '',
            name: name,
            businessName: name,
            businessType: '',
            contactPerson: name,
            email: email,
            phone: phone,
            location: location,
            address: location,
            description: bio,
            tagline: '',
            website: '',
            services: [],
            categories: [],
            logo: '',
            accountType: 'provider',
            role: 'provider',
            status: status,
            createdAt: now,
            updatedAt: now
        });
        Storage.setProviders(providers);
    } else {
        const users = Storage.getUsers();
        users.push({
            id: id,
            userId: '',
            username: name,
            fullName: name,
            name: name,
            email: email,
            phone: phone,
            location: location,
            bio: bio,
            interests: [],
            tags: [],
            accountType: type,
            role: type,
            status: status,
            createdAt: now,
            updatedAt: now
        });
        Storage.setUsers(users);
    }

    const modal = document.getElementById('addUserModal');
    if (modal) modal.classList.remove('active');
    document.getElementById('addUserName').value = '';
    document.getElementById('addUserEmail').value = '';
    document.getElementById('addUserPhone').value = '';
    document.getElementById('addUserLocation').value = '';
    document.getElementById('addUserBio').value = '';
    showToast('User added successfully.');
    renderAdminUsers();
    renderAdminProviders();
}

function adminViewUser(id) {
    const u = Storage.getUsers().find(x => x.id === id);
    if (!u) return;
    showAdminView(`
        <h2><i class="fas fa-user" style="color:#c9a227;margin-right:8px"></i> User Details</h2>
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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a99c7e;padding:40px">No providers registered yet</td></tr>';
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
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleProviderStatus('${p.id}')" title="${p.status === 'suspended' ? 'Reinstate' : 'Suspend'}">
                        <i class="fas fa-${p.status === 'suspended' ? 'check-circle' : 'ban'}" style="color:${p.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteProvider('${p.id}','${(p.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function adminToggleProviderStatus(id) {
    const providers = Storage.getProviders();
    const p = providers.find(x => x.id === id);
    if (!p) return;
    p.status = p.status === 'suspended' ? 'active' : 'suspended';
    Storage.setProviders(providers);
    showToast(p.status === 'suspended' ? 'Provider suspended.' : 'Provider reinstated.');
    renderAdminProviders();
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
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#a99c7e;padding:40px">No listings yet</td></tr>';
        return;
    }

    const types = typeof DIRECTORY_TYPES !== 'undefined' ? DIRECTORY_TYPES : {};

    tbody.innerHTML = listings.map(l => {
        const t = types[l.category] || {};
        return `
        <tr>
            <td><strong>${truncate(l.name, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${t.color||'#8a7b55'}20;color:${t.color||'#8a7b55'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${t.label || l.category}</span></td>
            <td>${l.location || '-'}</td>
            <td><span class="status-badge status-${l.status}">${l.status}</span></td>
            <td>${fmtDate(l.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewListing('${l.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleListingStatus('${l.id}')" title="${l.status === 'suspended' ? 'Reinstate' : 'Suspend'}">
                        <i class="fas fa-${l.status === 'suspended' ? 'check-circle' : 'ban'}" style="color:${l.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteListing('${l.id}','${(l.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminToggleListingStatus(id) {
    const listings = Storage.getListings();
    const l = listings.find(x => x.id === id);
    if (!l) return;
    l.status = l.status === 'suspended' ? 'active' : 'suspended';
    Storage.setListings(listings);
    showToast(l.status === 'suspended' ? 'Listing suspended.' : 'Listing reinstated.');
    renderAdminListings();
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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a99c7e;padding:40px">No venues yet</td></tr>';
        return;
    }

    const types = typeof VENUE_TYPES !== 'undefined' ? VENUE_TYPES : {};

    tbody.innerHTML = venues.map(v => {
        const t = types[v.category] || {};
        return `
        <tr>
            <td><strong>${truncate(v.name, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${t.color||'#8a7b55'}20;color:${t.color||'#8a7b55'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${t.label || v.category}</span></td>
            <td>${v.location || '-'}</td>
            <td>${v.capacity || '-'}</td>
            <td><span class="status-badge status-${v.status}">${v.status}</span></td>
            <td>${fmtDate(v.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewVenue('${v.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleVenueStatus('${v.id}')" title="${v.status === 'suspended' ? 'Reinstate' : 'Suspend'}">
                        <i class="fas fa-${v.status === 'suspended' ? 'check-circle' : 'ban'}" style="color:${v.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteVenue('${v.id}','${(v.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminToggleVenueStatus(id) {
    const venues = Storage.getVenues();
    const v = venues.find(x => x.id === id);
    if (!v) return;
    v.status = v.status === 'suspended' ? 'active' : 'suspended';
    Storage.setVenues(venues);
    showToast(v.status === 'suspended' ? 'Venue suspended.' : 'Venue reinstated.');
    renderAdminVenues();
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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a99c7e;padding:40px">No ads yet</td></tr>';
        return;
    }

    const cats = typeof AD_CATEGORIES !== 'undefined' ? AD_CATEGORIES : {};

    tbody.innerHTML = ads.map(a => {
        const c = cats[a.category] || {};
        return `
        <tr>
            <td><strong>${truncate(a.title, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${c.color||'#8a7b55'}20;color:${c.color||'#8a7b55'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${c.label || a.category}</span></td>
            <td>${a.contactName || '-'}</td>
            <td>${a.location || '-'}</td>
            <td><span class="status-badge status-${a.status}">${a.status}</span></td>
            <td>${fmtDate(a.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewAd('${a.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleAdStatus('${a.id}')" title="${a.status === 'suspended' ? 'Reinstate' : 'Suspend'}">
                        <i class="fas fa-${a.status === 'suspended' ? 'check-circle' : 'ban'}" style="color:${a.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteAd('${a.id}','${(a.title||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminToggleAdStatus(id) {
    const ads = Storage.getAds();
    const a = ads.find(x => x.id === id);
    if (!a) return;
    a.status = a.status === 'suspended' ? 'active' : 'suspended';
    Storage.setAds(ads);
    showToast(a.status === 'suspended' ? 'Ad suspended.' : 'Ad reinstated.');
    renderAdminAds();
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
// SERVICES MANAGEMENT
// ==========================================
function renderAdminServices() {
    const services = Storage.getServices();
    const tbody = document.querySelector('#adminServicesTable tbody');
    if (!tbody) return;

    setEl('adminServicesCount', services.length);

    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a99c7e;padding:40px">No services yet</td></tr>';
        return;
    }

    const types = typeof SERVICE_TYPES !== 'undefined' && SERVICE_TYPES ? SERVICE_TYPES : {};

    tbody.innerHTML = services.map(s => {
        const label = types[s.category] ? (types[s.category].label || s.category) : s.category;
        const color = types[s.category] && types[s.category].color ? types[s.category].color : '#10b981';
        return `
        <tr>
            <td><strong>${truncate(s.name, 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${color}20;color:${color};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${label}</span></td>
            <td>${s.location || '-'}</td>
            <td>${s.rate || (s.bookingFee != null ? 'R' + s.bookingFee : 'Contact')}</td>
            <td><span class="status-badge status-${s.status || 'active'}">${s.status || 'active'}</span></td>
            <td>${fmtDate(s.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewService('${s.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteService('${s.id}','${(s.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewService(id) {
    const s = Storage.getServices().find(x => x.id === id);
    if (!s) return;
    showAdminView(`
        <h2><i class="fas fa-concierge-bell" style="color:#10b981;margin-right:8px"></i> Service Details</h2>
        <div class="admin-view-row"><span class="label">Name</span><span class="value">${escapeHtml(s.name || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Category</span><span class="value">${escapeHtml(s.category || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Provider</span><span class="value">${escapeHtml(s.ownerName || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${escapeHtml(s.location || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Booking Fee</span><span class="value">${s.bookingFee != null ? 'R' + s.bookingFee : '-'}</span></div>
        <div class="admin-view-row"><span class="label">Rate</span><span class="value">${escapeHtml(s.rate || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Bio</span><span class="value">${escapeHtml(truncate(s.bio || '-', 180))}</span></div>
        <div class="admin-view-row"><span class="label">Tags</span><span class="value">${(s.tags||[]).map(escapeHtml).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Status</span><span class="value">${s.status || 'active'}</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(s.createdAt)}</span></div>
    `);
}

function adminDeleteService(id, name) { promptAdminDelete('service', id, name); }

// ==========================================
// BOOKINGS MANAGEMENT
// ==========================================
function renderAdminBookings() {
    const bookings = Storage.getBookings();
    const tbody = document.querySelector('#adminBookingsTable tbody');
    if (!tbody) return;

    setEl('adminBookingsCount', bookings.length);

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#a99c7e;padding:40px">No bookings yet</td></tr>';
        return;
    }

    const listingTypeLabel = (b) => {
        const provider = b.providerType === 'service' ? Storage.getServices().find(p => p.id === b.providerId) : Storage.getListings().find(p => p.id === b.providerId);
        return provider ? (provider.name || provider.title || 'Unknown') : (b.serviceType || 'Unknown');
    };

    tbody.innerHTML = bookings.map(b => {
        const status = (typeof BOOKING_STATUSES !== 'undefined' && BOOKING_STATUSES[b.status]) ? BOOKING_STATUSES[b.status] : { label: b.status || 'pending', color: '#f59e0b' };
        const fee = b.fee != null ? 'R' + b.fee : '-';
        return `
        <tr>
            <td><strong>${truncate(b.clientName || '-', 18)}</strong></td>
            <td>${truncate(listingTypeLabel(b), 20)}</td>
            <td>${b.date || '-'} ${b.time ? '&middot; ' + b.time : ''}</td>
            <td>${b.serviceType || '-'}</td>
            <td>${fee}</td>
            <td><span class="status-badge" style="background:${status.color}22;color:${status.color};border:1px solid ${status.color}44">${status.label}</span></td>
            <td>${fmtDate(b.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewBooking('${b.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteBooking('${b.id}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewBooking(id) {
    const b = Storage.getBookings().find(x => x.id === id);
    if (!b) return;
    const status = (typeof BOOKING_STATUSES !== 'undefined' && BOOKING_STATUSES[b.status]) ? BOOKING_STATUSES[b.status] : { label: b.status || 'pending', color: '#f59e0b' };
    showAdminView(`
        <h2><i class="fas fa-calendar-check" style="color:#a07d12;margin-right:8px"></i> Booking Details</h2>
        <div class="admin-view-row"><span class="label">Client</span><span class="value">${escapeHtml(b.clientName || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Client Email</span><span class="value">${escapeHtml(b.clientEmail || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Client Phone</span><span class="value">${escapeHtml(b.clientPhone || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Service Type</span><span class="value">${escapeHtml(b.serviceType || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Date</span><span class="value">${escapeHtml(b.date || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Time</span><span class="value">${escapeHtml(b.time || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Fee</span><span class="value">${b.fee != null ? 'R' + b.fee : '-'}</span></div>
        <div class="admin-view-row"><span class="label">Status</span><span class="value" style="color:${status.color}">${status.label}</span></div>
        <div class="admin-view-row"><span class="label">Notes</span><span class="value">${escapeHtml(b.notes || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(b.createdAt)}</span></div>
    `);
}

function adminDeleteBooking(id) { promptAdminDelete('booking', id, 'this booking'); }

// ==========================================
// GIGS MANAGEMENT
// ==========================================
function renderAdminGigs() {
    const gigs = Storage.getGigs();
    const tbody = document.querySelector('#adminGigsTable tbody');
    if (!tbody) return;

    setEl('adminGigsCount', gigs.length);

    if (gigs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#a99c7e;padding:40px">No gigs yet</td></tr>';
        return;
    }

    const types = typeof GIG_TYPES !== 'undefined' ? GIG_TYPES : {};

    tbody.innerHTML = gigs.map(g => {
        const t = types[g.gigType] || {};
        const rate = g.rate != null ? 'R' + g.rate + (g.rateType && g.rateType !== 'fixed' ? '/' + g.rateType : '') : 'Contact';
        return `
        <tr>
            <td><strong>${truncate(g.title || '-', 20)}</strong></td>
            <td><span class="directory-type-badge" style="background:${t.color||'#a855f7'}20;color:${t.color||'#a855f7'};padding:4px 10px;border-radius:12px;font-size:0.75rem;font-weight:600">${t.label || g.gigType || '-'}</span></td>
            <td>${rate}</td>
            <td>${g.author || g.authorName || '-'}</td>
            <td>${g.location || '-'}</td>
            <td><span class="status-badge status-${g.status || 'active'}">${g.status || 'active'}</span></td>
            <td>${fmtDate(g.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewGig('${g.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteGig('${g.id}','${(g.title||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash" style="color:#ef4444"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewGig(id) {
    const g = Storage.getGigs().find(x => x.id === id);
    if (!g) return;
    const t = typeof GIG_TYPES !== 'undefined' ? (GIG_TYPES[g.gigType] || {}) : {};
    showAdminView(`
        <h2><i class="fas fa-briefcase" style="color:#a855f7;margin-right:8px"></i> Gig Details</h2>
        <div class="admin-view-row"><span class="label">Title</span><span class="value">${escapeHtml(g.title || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Type</span><span class="value">${escapeHtml(t.label || g.gigType || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Author</span><span class="value">${escapeHtml(g.author || g.authorName || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Location</span><span class="value">${escapeHtml(g.location || '-')}</span></div>
        <div class="admin-view-row"><span class="label">Rate</span><span class="value">${g.rate != null ? 'R' + g.rate + (g.rateType && g.rateType !== 'fixed' ? '/' + g.rateType : '') : 'Contact'}</span></div>
        <div class="admin-view-row"><span class="label">Description</span><span class="value">${escapeHtml(truncate(g.description || '-', 180))}</span></div>
        <div class="admin-view-row"><span class="label">Tags</span><span class="value">${(g.tags||[]).map(escapeHtml).join(', ') || '-'}</span></div>
        <div class="admin-view-row"><span class="label">Urgent</span><span class="value">${g.urgent ? 'Yes' : 'No'}</span></div>
        <div class="admin-view-row"><span class="label">Status</span><span class="value">${g.status || 'active'}</span></div>
        <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(g.createdAt)}</span></div>
    `);
}

function adminDeleteGig(id, name) { promptAdminDelete('gig', id, name); }

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
            html += `<div style="padding:12px;background:#fdf9ef;border-radius:10px"><div style="font-weight:700;color:#211a0d;font-size:0.85rem">${key.replace('k2_', '').toUpperCase()}</div><div style="color:#8a7b55;font-size:0.82rem;margin-top:4px">${kb} KB</div></div>`;
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

    tbody.innerHTML = filtered.map(c => {
        const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#8a7b55' };
        const authorName = resolveProviderAuthorName(c, 'Unknown');
        return `<tr>
            <td><strong>${c.title}</strong></td>
            <td><span class="badge" style="background:${type.color}22;color:${type.color};border:1px solid ${type.color}44"><i class="fas ${type.icon}"></i> ${type.label}</span></td>
            <td>${escapeHtml(authorName)}</td>
            <td>${fmtDate(c.createdAt)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewContent('${c.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminEditContent('${c.id}')"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleContentStatus('${c.id}')" title="${c.status === 'suspended' ? 'Reinstate' : 'Suspend'}">
                        <i class="fas fa-${c.status === 'suspended' ? 'check-circle' : 'ban'}" style="color:${c.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteContent('${c.id}','${(c.title||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewContent(id) {
    const c = Storage.getContent().find(x => x.id === id);
    if (!c) return;
    const type = CONTENT_TYPES[c.type] || { label: c.type, icon: 'fa-file', color: '#8a7b55' };
    const authorName = resolveProviderAuthorName(c, 'Unknown');
    let mediaHtml = '';
    if (c.type === 'audio' || c.type === 'podcast') {
        mediaHtml = c.fileUrl ? `<div style="margin:14px 0"><button type="button" class="btn btn-primary btn-sm" onclick="adminPlayContentAudio('${c.id}')"><i class="fas fa-headphones"></i> Listen / Play</button></div>` : '';
    } else if (c.img || (c.gallery && c.gallery.length)) {
        mediaHtml = `<div style="margin:14px 0;display:grid;gap:8px">${((c.type === 'book') ? [] : (c.gallery && c.gallery.length ? c.gallery : c.img ? [c.img] : [])).slice(0, 6).map(u => `<img src="${escapeHtml(u)}" style="max-width:100%;max-height:200px;border-radius:10px;object-fit:cover" onerror="this.style.display='none'">`).join('')}</div>`;
    }
    showAdminView(`
        <h2><i class="fas ${type.icon}" style="color:${type.color};margin-right:8px"></i> Content Details</h2>
        ${mediaHtml}
        <div style="padding:14px;background:#fdf9ef;border-radius:10px;margin:10px 0;font-size:0.9rem;line-height:1.6">${renderAdminRichText(c.description || c.title)}</div>
        <div style="margin-top:16px">
            <div class="admin-view-row"><span class="label">Title</span><span class="value">${escapeHtml(c.title || '-')}</span></div>
            <div class="admin-view-row"><span class="label">Type</span><span class="value">${type.label}</span></div>
            <div class="admin-view-row"><span class="label">Creator</span><span class="value">${escapeHtml(authorName)}</span></div>
            <div class="admin-view-row"><span class="label">Status</span><span class="value">${c.status || 'active'}</span></div>
            <div class="admin-view-row"><span class="label">Price</span><span class="value">${c.price ? 'R' + c.price : 'Free'}</span></div>
            <div class="admin-view-row"><span class="label">Downloads</span><span class="value">${(c.downloads || 0)}</span></div>
            <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(c.createdAt)}</span></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
            <button class="btn btn-primary btn-sm" onclick="adminEditContent('${c.id}')"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="adminToggleContentStatus('${c.id}')"><i class="fas fa-${c.status === 'suspended' ? 'check-circle' : 'ban'}"></i> ${c.status === 'suspended' ? 'Reinstate' : 'Suspend'}</button>
        </div>
    `);
}

function adminPlayContentAudio(id) {
    const c = Storage.getContent().find(x => x.id === id);
    if (!c || !c.fileUrl) return;
    if (window._2k2Media) {
        window._2k2Media.openPodcastPlayer({ src: c.fileUrl, title: c.title || 'Podcast', sub: 'Podcast / Audio' });
    } else if (window.openPodcastPlayer) {
        window.openPodcastPlayer({ src: c.fileUrl, title: c.title || 'Podcast' });
    }
}

function adminEditContent(id) {
    const c = Storage.getContent().find(x => x.id === id);
    if (!c) return;
    const typeOptions = Object.keys(CONTENT_TYPES).map(key =>
        `<option value="${key}" ${key === c.type ? 'selected' : ''}>${CONTENT_TYPES[key].label}</option>`
    ).join('');
    showAdminView(`
        <h2><i class="fas fa-pen" style="color:var(--primary, #c9a227);margin-right:8px"></i> Edit Content</h2>
        <label class="admin-form-label">Title</label>
        <input class="admin-form-input" id="adminEditContentTitle" value="${escapeHtml(c.title || '')}" />
        <label class="admin-form-label" style="margin-top:12px">Type</label>
        <select class="admin-form-input" id="adminEditContentType">${typeOptions}</select>
        <label class="admin-form-label" style="margin-top:12px">Description</label>
        <textarea class="admin-form-input" id="adminEditContentDesc" style="min-height:120px">${escapeHtml(c.description || '')}</textarea>
        <label class="admin-form-label" style="margin-top:12px">Price (R, blank = free)</label>
        <input class="admin-form-input" id="adminEditContentPrice" value="${c.price || ''}" type="number" min="0" step="0.01" />
        <div style="display:flex;gap:8px;margin-top:18px">
            <button class="btn btn-primary btn-sm" onclick="adminSaveContentEdit('${c.id}')"><i class="fas fa-save"></i> Save Changes</button>
            <button class="btn btn-secondary btn-sm" onclick="adminViewContent('${c.id}')"><i class="fas fa-arrow-left"></i> Cancel</button>
        </div>
    `);
}

function adminSaveContentEdit(id) {
    const content = Storage.getContent();
    const c = content.find(x => x.id === id);
    if (!c) return;
    const title = document.getElementById('adminEditContentTitle').value.trim();
    const type = document.getElementById('adminEditContentType').value;
    const description = document.getElementById('adminEditContentDesc').value.trim();
    const price = document.getElementById('adminEditContentPrice').value;
    if (!title) { showToast('Title is required.', 'error'); return; }
    c.title = title;
    c.type = type;
    c.description = description;
    c.price = price !== '' && !isNaN(parseFloat(price)) ? parseFloat(price) : null;
    c.editedByAdmin = true;
    Storage.setContent(content);
    showToast('Content updated.');
    adminViewContent(id);
}

function adminToggleContentStatus(id) {
    const content = Storage.getContent();
    const c = content.find(x => x.id === id);
    if (!c) return;
    c.status = c.status === 'suspended' ? 'active' : 'suspended';
    Storage.setContent(content);
    showToast(c.status === 'suspended' ? 'Content suspended.' : 'Content reinstated.');
    renderAdminContent();
}

function adminDeleteContent(id, title) {
    promptAdminDelete('content', id, title || 'content item');
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

    tbody.innerHTML = filtered.map(ev => {
        const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#8a7b55' };
        const hostName = resolveProviderAuthorName(ev, 'Unknown');
        const eventDate = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
        return `<tr>
            <td><strong>${ev.name}</strong></td>
            <td><span class="badge" style="background:${type.color}22;color:${type.color};border:1px solid ${type.color}44"><i class="fas ${type.icon}"></i> ${type.label}</span></td>
            <td>${eventDate}</td>
            <td>${ev.venue || '-'}</td>
            <td>${escapeHtml(hostName)}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-secondary btn-xs" onclick="adminViewEvent('${ev.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminEditEvent('${ev.id}')"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-secondary btn-xs" onclick="adminToggleEventStatus('${ev.id}')" title="${ev.status === 'suspended' ? 'Reinstate' : 'Cancel/Remove'}">
                        <i class="fas fa-${ev.status === 'suspended' ? 'check-circle' : 'calendar-xmark'}" style="color:${ev.status === 'suspended' ? '#10b981' : '#f59e0b'}"></i>
                    </button>
                    <button class="btn btn-danger btn-xs" onclick="adminDeleteEvent('${ev.id}','${(ev.name||'').replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function adminViewEvent(id) {
    const ev = Storage.getEvents().find(x => x.id === id);
    if (!ev) return;
    const type = EVENT_TYPES[ev.type] || { label: ev.type, icon: 'fa-calendar', color: '#8a7b55' };
    const hostName = resolveProviderAuthorName(ev, 'Unknown');
    showAdminView(`
        <h2><i class="fas ${type.icon}" style="color:${type.color};margin-right:8px"></i> Event Details</h2>
        <div style="margin-top:12px">
            <div class="admin-view-row"><span class="label">Name</span><span class="value">${escapeHtml(ev.name || '-')}</span></div>
            <div class="admin-view-row"><span class="label">Type</span><span class="value">${type.label}</span></div>
            <div class="admin-view-row"><span class="label">Date</span><span class="value">${ev.eventDate ? new Date(ev.eventDate).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span></div>
            <div class="admin-view-row"><span class="label">Venue</span><span class="value">${escapeHtml(ev.venue || '-')}</span></div>
            <div class="admin-view-row"><span class="label">Entry</span><span class="value">${ev.entryFee ? 'R' + ev.entryFee : 'Free'}</span></div>
            <div class="admin-view-row"><span class="label">Host</span><span class="value">${escapeHtml(hostName)}</span></div>
            <div class="admin-view-row"><span class="label">Status</span><span class="value">${ev.status || 'active'}</span></div>
            <div class="admin-view-row"><span class="label">Created</span><span class="value">${fmtDate(ev.createdAt)}</span></div>
        </div>
        <div style="padding:14px;background:#fdf9ef;border-radius:10px;margin-top:12px;font-size:0.9rem;line-height:1.6">${renderAdminRichText(ev.description || 'No description')}</div>
        <div style="display:flex;gap:8px;margin-top:16px">
            <button class="btn btn-primary btn-sm" onclick="adminEditEvent('${ev.id}')"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="adminToggleEventStatus('${ev.id}')"><i class="fas fa-${ev.status === 'suspended' ? 'check-circle' : 'ban'}"></i> ${ev.status === 'suspended' ? 'Reinstate' : 'Cancel Event'}</button>
        </div>
    `);
}

function adminEditEvent(id) {
    const ev = Storage.getEvents().find(x => x.id === id);
    if (!ev) return;
    const typeOptions = Object.keys(EVENT_TYPES).map(key =>
        `<option value="${key}" ${key === ev.type ? 'selected' : ''}>${EVENT_TYPES[key].label}</option>`
    ).join('');
    showAdminView(`
        <h2><i class="fas fa-pen" style="color:var(--primary, #c9a227);margin-right:8px"></i> Edit Event</h2>
        <label class="admin-form-label">Name</label>
        <input class="admin-form-input" id="adminEditEventName" value="${escapeHtml(ev.name || '')}" />
        <label class="admin-form-label" style="margin-top:12px">Type</label>
        <select class="admin-form-input" id="adminEditEventType">${typeOptions}</select>
        <label class="admin-form-label" style="margin-top:12px">Event Date</label>
        <input class="admin-form-input" id="adminEditEventDate" type="datetime-local" value="${ev.eventDate ? ev.eventDate.substring(0, 16) : ''}" />
        <label class="admin-form-label" style="margin-top:12px">Venue / Location</label>
        <input class="admin-form-input" id="adminEditEventVenue" value="${escapeHtml(ev.venue || '')}" />
        <label class="admin-form-label" style="margin-top:12px">Entry Fee (R, blank = free)</label>
        <input class="admin-form-input" id="adminEditEventFee" value="${ev.entryFee || ''}" type="number" min="0" step="0.01" />
        <label class="admin-form-label" style="margin-top:12px">Description</label>
        <textarea class="admin-form-input" id="adminEditEventDesc" style="min-height:90px">${escapeHtml(ev.description || '')}</textarea>
        <div style="display:flex;gap:8px;margin-top:18px">
            <button class="btn btn-primary btn-sm" onclick="adminSaveEventEdit('${ev.id}')"><i class="fas fa-save"></i> Save Changes</button>
            <button class="btn btn-secondary btn-sm" onclick="adminViewEvent('${ev.id}')"><i class="fas fa-arrow-left"></i> Cancel</button>
        </div>
    `);
}

function adminSaveEventEdit(id) {
    const events = Storage.getEvents();
    const ev = events.find(x => x.id === id);
    if (!ev) return;
    const name = document.getElementById('adminEditEventName').value.trim();
    if (!name) { showToast('Event name is required.', 'error'); return; }
    ev.name = name;
    ev.type = document.getElementById('adminEditEventType').value;
    ev.eventDate = document.getElementById('adminEditEventDate').value || ev.eventDate;
    ev.venue = document.getElementById('adminEditEventVenue').value.trim();
    const fee = document.getElementById('adminEditEventFee').value;
    ev.entryFee = fee !== '' && !isNaN(parseFloat(fee)) ? parseFloat(fee) : null;
    ev.description = document.getElementById('adminEditEventDesc').value.trim();
    ev.editedByAdmin = true;
    Storage.setEvents(events);
    showToast('Event updated.');
    adminViewEvent(id);
}

function adminToggleEventStatus(id) {
    const events = Storage.getEvents();
    const ev = events.find(x => x.id === id);
    if (!ev) return;
    ev.status = ev.status === 'suspended' ? 'active' : 'suspended';
    Storage.setEvents(events);
    showToast(ev.status === 'suspended' ? 'Event removed from public view.' : 'Event reinstated.');
    renderAdminEvents();
}

function adminDeleteEvent(id, name) {
    promptAdminDelete('event', id, name || 'event');
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
            reqContainer.innerHTML = '<p style="color:#a99c7e;font-size:0.88rem;padding:12px 0">No pending requests</p>';
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
                let reqDetail = '';
                if (isTopUp) {
                    const identity = r.username || r.email || ownerLabel;
                    const mail = r.email ? `<div><i class="fas fa-envelope" style="width:16px"></i> ${escapeHtml(r.email)}</div>` : '';
                    const phone = r.phone ? `<div><i class="fas fa-phone" style="width:16px"></i> ${escapeHtml(r.phone)}</div>` : '';
                    const addr = r.address ? `<div><i class="fas fa-map-marker-alt" style="width:16px"></i> ${escapeHtml(r.address)}</div>` : '';
                    reqDetail = `
                        <div style="margin-top:8px;padding-left:10px;border-left:2px solid ${typeColor}44;font-size:0.82rem;color:#d8cebd;line-height:1.5">
                            <div style="font-weight:700;color:#fff">${escapeHtml(identity)}</div>
                            ${mail}${phone}${addr}
                            ${r.ownerId && r.ownerId !== 'general' ? `<div style="color:#a99c7e;font-size:0.72rem;margin-top:2px">ID: ${escapeHtml(r.ownerId)}</div>` : ''}
                        </div>`;
                }
                return `
                    <div class="admin-request-row">
                        <div class="admin-request-info">
                            <span class="badge" style="background:${typeColor}22;color:${typeColor};border:1px solid ${typeColor}44"><i class="fas ${typeIcon}"></i> ${typeLabel}</span>
                            <div>
                                <strong>R${r.amount.toFixed(2)}</strong>
                                <span style="color:#a99c7e;font-size:0.82rem;margin-left:8px">${ownerLabel}</span>
                            </div>
                            <span style="color:#a99c7e;font-size:0.8rem">${fmtDate(r.createdAt)}</span>
                            ${reqDetail}
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
            wTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#a99c7e;padding:40px">No wallets yet</td></tr>';
        } else {
            wTbody.innerHTML = wallets.map(w => {
                let ownerName = w.ownerId;
                let ownerSub = w.ownerId;
                if (w.ownerType === 'user') {
                    const users = Storage.getUsers();
                    const u = users.find(x => x.userId === w.ownerId);
                    if (u && (u.username || u.fullName || u.email)) {
                        ownerName = u.username || u.fullName || u.email;
                        ownerSub = u.email || (u.fullName || '') || w.ownerId;
                    } else {
                        ownerName = w.ownerId === 'general' ? 'General User' : w.ownerId;
                    }
                } else if (w.ownerType === 'provider') {
                    const providers = Storage.getProviders();
                    const p = providers.find(x => x.id === w.ownerId);
                    ownerName = p ? p.name : w.ownerId;
                }
                return `
                    <tr>
                        <td><strong>${truncate(ownerName, 25)}</strong><br><span style="font-size:0.75rem;color:#a99c7e">${ownerSub}</span></td>
                        <td><span class="badge" style="background:${w.ownerType === 'user' ? '#667eea22; color:#667eea' : '#8b5cf622; color:#8b5cf6'}">${w.ownerType}</span></td>
                        <td><strong>R${w.balance.toFixed(2)}</strong></td>
                        <td>${fmtDate(w.updatedAt)}</td>
                        <td>
                            <div class="admin-actions">
                                <button class="btn btn-secondary btn-xs" onclick="adminViewWalletTxns('${w.ownerType}','${w.ownerId}')"><i class="fas fa-history"></i></button>
                                <button class="btn btn-secondary btn-xs" onclick="adminWalletDelta('${w.ownerType}','${w.ownerId}',1)" title="Credit"><i class="fas fa-plus" style="color:#10b981"></i></button>
                                <button class="btn btn-secondary btn-xs" onclick="adminWalletDelta('${w.ownerType}','${w.ownerId}',-1)" title="Deduct"><i class="fas fa-minus" style="color:#ef4444"></i></button>
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
            tTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a99c7e;padding:40px">No transactions yet</td></tr>';
        } else {
            tTbody.innerHTML = txns.slice(0, 50).map(t => {
                const typeColors = { 'top-up': '#10b981', 'tip-sent': '#f59e0b', 'tip-received': '#10b981', 'booking-fee': '#ef4444', 'booking-confirmed': '#3b82f6', 'withdrawal': '#8b5cf6', 'admin-adjust': '#8a7b55', 'refund': '#06b6d4', 'credit': '#10b981', 'deduct': '#ef4444', 'experience-sale': '#7c3aed', 'experience-purchase': '#db2777', 'commission': '#f59e0b' };
                const typeLabels = { 'top-up': 'Top Up', 'tip-sent': 'Tip Sent', 'tip-received': 'Tip Received', 'booking-fee': 'Booking Fee', 'booking-confirmed': 'Booking Confirmed', 'withdrawal': 'Withdrawal', 'admin-adjust': 'Admin Adjust', 'refund': 'Refund', 'credit': 'Credit', 'deduct': 'Deduct', 'experience-sale': 'Experience Sale', 'experience-purchase': 'Experience Purchase', 'commission': 'Platform Commission' };
                const color = typeColors[t.type] || '#8a7b55';
                const label = typeLabels[t.type] || t.type;
                return `
                    <tr>
                        <td>${fmtDate(t.createdAt)}</td>
                        <td><span style="font-size:0.8rem;color:#a99c7e">${t.ownerType}: ${truncate(t.ownerId, 15)}</span></td>
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
    let html = `<h2><i class="fas fa-history" style="color:#c9a227;margin-right:8px"></i> Transactions</h2>`;
    html += `<div class="admin-view-row"><span class="label">Owner</span><span class="value">${ownerType}: ${ownerId}</span></div>`;
    html += `<div class="admin-view-row"><span class="label">Balance</span><span class="value">R${wallet.balance.toFixed(2)}</span></div>`;
    if (txns.length === 0) {
        html += '<p style="color:#a99c7e;margin-top:16px">No transactions</p>';
    } else {
        html += '<div style="margin-top:16px;max-height:400px;overflow-y:auto">';
        txns.forEach(t => {
            html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f3eddd">
                <div><div style="font-weight:600;font-size:0.88rem">${t.description || t.type}</div><div style="font-size:0.75rem;color:#a99c7e">${fmtDate(t.createdAt)}</div></div>
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

function adminWalletDelta(ownerType, ownerId, direction) {
    const wallet = getOrCreateWallet(ownerType, ownerId);
    const action = direction > 0 ? 'CREDIT' : 'DEDUCT';
    const amt = prompt(`${action} R amount for ${ownerType}:${ownerId}\nCurrent: R${wallet.balance.toFixed(2)}`, '100');
    if (amt === null) return;
    const amount = parseFloat(amt);
    if (isNaN(amount) || amount <= 0) { showToast('Please enter a valid amount.', 'error'); return; }
    const delta = direction > 0 ? amount : -amount;
    const reason = prompt(`${action} reason (optional):`, action === 'CREDIT' ? 'Admin credit' : 'Admin deduction');
    if (reason === null) return;
    if (delta < 0 && wallet.balance + delta < 0) {
        if (!confirm(`Deducting R${amount.toFixed(2)} would take this wallet negative (balance R${wallet.balance.toFixed(2)}). Continue?`)) return;
    }
    adjustWallet(ownerType, ownerId, delta, direction > 0 ? 'credit' : 'deduct', (reason || '').trim() ? reason : (action === 'CREDIT' ? 'Admin credit' : 'Admin deduction'));
    showToast(`R${amount.toFixed(2)} ${action.toLowerCase()}ed.`);
    renderAdminWallets();
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
    'offtopic': { label: 'Off-Topic', color: '#8a7b55', icon: 'fa-ellipsis' },
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
    if (currentAdminForumFilter === 'subforums') { renderAdminForumSubforums(); return; }

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
        const cat = ADMIN_FORUM_CATS[thread.category] || { label: thread.category, color: '#8a7b55', icon: 'fa-comment' };
        const threadReplies = replies.filter(r => r.threadId === thread.id).length;
        const likes = Storage.getForumLikes();
        const threadLikes = likes.filter(l => l.targetId === thread.id && l.type === 'thread').length;
        const date = new Date(thread.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

        let statusBadges = '';
        if (thread.pinned) statusBadges += '<span class="forum-pin-badge" style="margin-right:4px"><i class="fas fa-thumbtack"></i> Pinned</span>';
        if (thread.locked) statusBadges += '<span class="forum-lock-badge"><i class="fas fa-lock"></i> Locked</span>';
        if (!thread.pinned && !thread.locked) statusBadges = '<span style="color:var(--text-muted, #a99c7e);font-size:0.8rem">Active</span>';

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
        const cat = ADMIN_FORUM_CATS[thread && thread.category] || { label: thread ? thread.category : 'Unknown', color: '#8a7b55', icon: 'fa-comment' };
        const likes = Storage.getForumLikes();
        const replyLikes = likes.filter(l => l.targetId === reply.id && l.type === 'reply').length;
        const date = new Date(reply.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

        return `
            <tr>
                <td class="truncate" style="max-width:280px">${renderGistShort(reply.body)}</td>
                <td>${escapeHtml(reply.author)}</td>
                <td><a href="#" onclick="event.preventDefault(); adminViewThread('${thread ? thread.id : ''}')">${thread ? '<i class="fas fa-comment"></i> ' + escapeHtml(truncate(thread.title, 40)) : '<span style="color:var(--text-muted, #a99c7e)">Deleted thread</span>'}</a></td>
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
                <div><div style="font-weight:700;color:var(--text-primary, #211a0d)">${sec.label}</div>
                <div style="font-size:0.8rem;color:var(--text-muted, #a99c7e)">${sec.desc}</div></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">`;
        keys.forEach(key => {
            const cat = ADMIN_FORUM_CATS[key];
            const catThreads = threads.filter(t => t.category === key);
            const catRepliesCount = replies.filter(r => catThreads.some(t => t.id === r.threadId)).length;
            const catLikes = likes.filter(l => catThreads.some(t => t.id === l.targetId)).length;
            const last = catThreads.length ? new Date(Math.max(...catThreads.map(t => new Date(t.createdAt)))).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : 'No activity';
            html += `
                <div style="border:1px solid var(--border, #e6dec8);border-radius:12px;padding:14px;background:var(--card-bg, #fff)">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                        <i class="fas ${cat.icon}" style="color:${cat.color}"></i>
                        <strong style="font-size:0.9rem">${cat.label}</strong>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.8rem;color:var(--text-muted, #a99c7e);margin-bottom:4px">
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

// ==========================================
// ADMIN SUBFORUM CRUD (multi-level groups)
// ==========================================
let adminSubforumEditingId = null;
let adminSubforumFormOpen = false;

const ADMIN_SUBFORUM_ICONS = ['fa-folder', 'fa-folder-open', 'fa-users', 'fa-gem', 'fa-fire', 'fa-martini-glass-citrus', 'fa-champagne-glasses', 'fa-mask', 'fa-heart', 'fa-music', 'fa-film', 'fa-gamepad', 'fa-scroll', 'fa-crown', 'fa-star', 'fa-shield-halved'];
const ADMIN_SUBFORUM_COLORS = ['#8a7b55', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1', '#0ea5e9', '#d97706'];

function renderAdminForumSubforums() {
    adminSetForumHeader(false);
    const container = document.getElementById('adminForumTableBody');
    if (!container) return;

    const subs = Storage.getForumSubforums() || [];
    const threads = Storage.getForumThreads();
    const members = Storage.getForumSubMemberships() || [];

    const threadCount = id => threads.filter(t => t.subforumId === id).length;
    const memberCount = id => members.filter(m => m.subforumId === id).length;

    const sections = {
        public: { label: 'Public Subforums & Groups', desc: 'Open community subforums', color: '#3b82f6' },
        premium: { label: 'Premium Subforums & Groups', desc: 'Exclusive / provider-run subforums', color: '#d946ef' }
    };

    const buildTree = (parentId, depth) => {
        return subs.filter(s => s.parentId === parentId).map(sub => {
            const sec = sub.ownerType === 'provider' ? 'premium' : (sub.section || 'public');
            const ds = {
                threads: threadCount(sub.id),
                members: memberCount(sub.id),
                owner: sub.ownerType === 'provider' ? sub.ownerName || 'Provider' : null,
                active: !sub.status || sub.status === 'active'
            };
            const children = buildTree(sub.id, depth + 1);
            return `
                <div style="margin-left:${depth * 22}px;margin-bottom:8px">
                    <div style="display:flex;align-items:center;gap:10px;border:1px solid var(--border, #e6dec8);border-radius:12px;padding:10px 12px;background:var(--card-bg, #fff)">
                        <span style="width:34px;height:34px;min-width:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:${sub.color || '#8a7b55'}18;color:${sub.color || '#8a7b55'}"><i class="fas ${sub.icon || 'fa-folder'}"></i></span>
                        <div style="flex:1;min-width:0">
                            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                                <strong style="font-size:0.92rem">${escapeHtml(sub.name)}</strong>
                                ${sub.ownerType === 'provider' ? '<span class="admin-subforum-badge" style="background:#f3e8ff;color:#7c3aed"><i class="fas fa-store"></i> ' + escapeHtml(sub.ownerName || 'Provider') + '</span>' : '<span class="admin-subforum-badge" style="background:#e6f4ff;color:#0369a1"><i class="fas fa-crown"></i> Admin</span>'}
                                ${ds.active ? '' : '<span class="admin-subforum-badge" style="background:#fee2e2;color:#b91c1c"><i class="fas fa-pause-circle"></i> Suspended</span>'}
                                ${sec === 'premium' ? '<span class="admin-subforum-badge" style="background:#fdf3e4;color:#d97706"><i class="fas fa-crown"></i> Premium</span>' : ''}
                            </div>
                            <div style="font-size:0.78rem;color:var(--text-muted, #a99c7e)" title="${escapeHtml(sub.description || '')}">${escapeHtml((sub.description || 'No description').substring(0, 80))}${(sub.description || '').length > 80 ? '...' : ''}</div>
                            <div style="display:flex;gap:14px;font-size:0.78rem;color:var(--text-muted, #a99c7e);margin-top:4px">
                                <span><i class="fas fa-comment"></i> ${ds.threads} threads</span>
                                <span><i class="fas fa-users"></i> ${ds.members} members</span>
                                <span><i class="fas fa-tag"></i> ${sub.joinFee > 0 ? 'R' + sub.joinFee + ' to join' : 'Free to join'}</span>
                            </div>
                        </div>
                        <div style="display:flex;gap:6px;flex-shrink:0">
                            <button class="btn btn-secondary btn-xs" onclick="adminEditSubforum('${sub.id}')"><i class="fas fa-pen"></i> Edit</button>
                            <button class="btn btn-secondary btn-xs" onclick="adminToggleSubforumStatus('${sub.id}')"><i class="fas ${ds.active ? 'fa-pause' : 'fa-play'}"></i></button>
                            <button class="btn btn-danger btn-xs" onclick="adminDeleteSubforum('${sub.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    ${children}
                </div>`;
        }).join('');
    };

    const form = adminSubforumFormOpen ? `
        <div style="border:1px dashed #c9a227;border-radius:12px;padding:16px;margin-bottom:20px;background:#fdfbf4">
            <div style="font-weight:700;margin-bottom:12px;color:var(--text-primary,#211a0d)"><i class="fas fa-layer-group"></i> ${adminSubforumEditingId ? 'Edit Subforum' : 'New Subforum'}</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">
                <input type="text" id="adminSubforumName" placeholder="Name (e.g. Cape Town After Dark)" value="${adminSubforumEditingId ? (subs.find(s => s.id === adminSubforumEditingId) || {}).name || '' : ''}">
                <input type="text" id="adminSubforumDesc" placeholder="Short description" value="${escapeHtml(((subs.find(s => s.id === adminSubforumEditingId) || {}).description || ''))}">
                <select id="adminSubforumSection">
                    <option value="">Section...</option>
                    <option value="public" ${adminSubforumEditingId && (subs.find(s => s.id === adminSubforumEditingId) || {}).section === 'public' ? 'selected' : ''}>Public Forum</option>
                    <option value="premium" ${adminSubforumEditingId && ((subs.find(s => s.id === adminSubforumEditingId) || {}).section === 'premium' || (subs.find(s => s.id === adminSubforumEditingId) || {}).ownerType === 'provider') ? 'selected' : ''}>Premium Forum</option>
                </select>
                <select id="adminSubforumParent">
                    <option value="">Parent (top level)</option>
                    ${subs.filter(s => (s.ownerType !== 'provider') && s.id !== adminSubforumEditingId).map(s => `<option value="${s.id}" ${adminSubforumEditingId && (subs.find(x => x.id === adminSubforumEditingId) || {}).parentId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
                </select>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:10px">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                    <label style="font-size:0.75rem;color:var(--text-muted,#a99c7e)"><i class="fas fa-icons"></i> Icon</label>
                    <div style="display:flex;gap:6px;flex-wrap:wrap" id="adminSubforumIconPick">
                        ${ADMIN_SUBFORUM_ICONS.map(ic => `<button type="button" class="btn btn-xs ${(subs.find(s => s.id === adminSubforumEditingId) || {}).icon === ic ? 'btn-primary' : 'btn-secondary'}" data-icon="${ic}" onclick="pickAdminSubforumIcon('${ic}')"><i class="fas ${ic}"></i></button>`).join('')}
                    </div>
                    <input type="hidden" id="adminSubforumIcon" value="${(subs.find(s => s.id === adminSubforumEditingId) || {}).icon || 'fa-folder'}">
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                    <label style="font-size:0.75rem;color:var(--text-muted,#a99c7e)"><i class="fas fa-palette"></i> Color</label>
                    <div style="display:flex;gap:6px;flex-wrap:wrap" id="adminSubforumColorPick">
                        ${ADMIN_SUBFORUM_COLORS.map(c => `<button type="button" class="btn btn-xs" style="background:${c};width:26px;height:26px;padding:0" data-color="${c}" onclick="pickAdminSubforumColor('${c}')"></button>`).join('')}
                    </div>
                    <input type="hidden" id="adminSubforumColor" value="${escapeHtml((subs.find(s => s.id === adminSubforumEditingId) || {}).color || '#8a7b55')}">
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    <label style="font-size:0.75rem;color:var(--text-muted,#a99c7e)"><i class="fas fa-tag"></i> Join Fee (R, 0 = free)</label>
                    <input type="number" id="adminSubforumFee" min="0" step="10" value="${(subs.find(s => s.id === adminSubforumEditingId) || {}).joinFee || 0}" style="max-width:120px">
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px">
                <button class="btn btn-primary btn-sm" onclick="adminSaveSubforum()"><i class="fas fa-check"></i> ${adminSubforumEditingId ? 'Save Changes' : 'Create Subforum'}</button>
                <button class="btn btn-secondary btn-sm" onclick="adminCancelSubforumForm()"><i class="fas fa-times"></i> Cancel</button>
            </div>
        </div>` : '';

    let html = '<tr><td colspan="8" style="padding:0">';
    html += `<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="toggleAdminSubforumForm()"><i class="fas fa-plus"></i> ${adminSubforumFormOpen ? 'Collapse Form' : 'New Subforum'}</button>
        ${!adminSubforumFormOpen && subs.length > 0 ? '<span style="align-self:center;font-size:0.8rem;color:var(--text-muted,#a99c7e)"><i class="fas fa-info-circle"></i> Provider-run subforums appear under Premium and can be suspended here.</span>' : ''}
    </div>`;
    html += form;

    Object.keys(sections).forEach(secKey => {
        const sec = sections[secKey];
        const secSubs = subs.filter(s => (s.ownerType === 'provider' ? 'premium' : (s.section || 'public')) === secKey);
        if (secSubs.length === 0) return;
        html += `<div style="margin-bottom:24px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                <span class="stat-icon" style="background:${sec.color}18;color:${sec.color};width:38px;height:38px;font-size:1rem"><i class="fas fa-folder-open"></i></span>
                <div><div style="font-weight:700;color:var(--text-primary, #211a0d)">${sec.label}</div>
                <div style="font-size:0.8rem;color:var(--text-muted, #a99c7e)">${sec.desc}</div></div>
            </div>`;
        html += buildTree(null, 0);
        html += '</div>';
    });

    if (subs.length === 0) {
        html += '<div class="empty-cell" style="padding:40px;text-align:center;color:var(--text-muted,#a99c7e)"><i class="fas fa-folder-open" style="font-size:2rem;display:block;margin-bottom:10px"></i>No subforums yet. Create the first one to organise the forum.</div>';
    }

    html += '</td></tr>';
    container.innerHTML = html;
}

function pickAdminSubforumIcon(icon) {
    const hid = document.getElementById('adminSubforumIcon');
    if (hid) hid.value = icon;
    document.querySelectorAll('#adminSubforumIconPick button').forEach(b => {
        b.classList.toggle('btn-primary', b.getAttribute('data-icon') === icon);
        b.classList.toggle('btn-secondary', b.getAttribute('data-icon') !== icon);
    });
}

function pickAdminSubforumColor(color) {
    const hid = document.getElementById('adminSubforumColor');
    if (hid) hid.value = color;
    document.querySelectorAll('#adminSubforumColorPick button').forEach(b => {
        b.style.outline = b.getAttribute('data-color') === color ? '3px solid #c9a227' : 'none';
        b.style.outlineOffset = '2px';
    });
}

function toggleAdminSubforumForm() {
    adminSubforumFormOpen = !adminSubforumFormOpen;
    if (adminSubforumFormOpen) adminSubforumEditingId = null;
    renderAdminForumSubforums();
}

function adminCancelSubforumForm() {
    adminSubforumFormOpen = false;
    adminSubforumEditingId = null;
    renderAdminForumSubforums();
}

function adminEditSubforum(id) {
    adminSubforumEditingId = id;
    adminSubforumFormOpen = true;
    renderAdminForumSubforums();
}

function adminSaveSubforum() {
    const name = document.getElementById('adminSubforumName').value.trim();
    const desc = document.getElementById('adminSubforumDesc').value.trim();
    const section = document.getElementById('adminSubforumSection').value;
    const parentId = document.getElementById('adminSubforumParent').value || null;
    const icon = document.getElementById('adminSubforumIcon').value || 'fa-folder';
    const color = document.getElementById('adminSubforumColor').value || '#8a7b55';
    const joinFee = parseInt(document.getElementById('adminSubforumFee').value, 10) || 0;

    if (!name || !section) { alert('Name and section are required.'); return; }

    const subs = Storage.getForumSubforums() || [];
    const parent = parentId ? subs.find(s => s.id === parentId) : null;
    if (parent && parent.ownerType === 'provider') { alert('Subforums cannot be nested under a provider-run subforum.'); return; }

    if (adminSubforumEditingId) {
        const idx = subs.findIndex(s => s.id === adminSubforumEditingId);
        if (idx !== -1) {
            const isProviderRun = subs[idx].ownerType === 'provider';
            subs[idx].name = name;
            subs[idx].description = desc;
            subs[idx].icon = icon;
            subs[idx].color = color;
            if (!isProviderRun) {
                subs[idx].section = section;
                subs[idx].parentId = parentId;
            } else if (parentId !== (subs[idx].parentId || null)) {
                alert('Provider-run subforums cannot be nested under another subforum.');
            }
            subs[idx].joinFee = joinFee;
            subs[idx].updatedAt = new Date().toISOString();
        }
    } else {
        subs.push({
            id: generateId(),
            name, description: desc, section,
            parentId, icon, color, joinFee,
            ownerType: null, ownerId: null, ownerName: null,
            status: 'active',
            createdAt: new Date().toISOString()
        });
    }
    Storage.setForumSubforums(subs);
    adminSubforumEditingId = null;
    adminSubforumFormOpen = false;
    renderAdminForumSubforums();
}

function adminToggleSubforumStatus(id) {
    const subs = Storage.getForumSubforums() || [];
    const sub = subs.find(s => s.id === id);
    if (!sub) return;
    sub.status = (sub.status === 'active' || !sub.status) ? 'suspended' : 'active';
    sub.updatedAt = new Date().toISOString();
    Storage.setForumSubforums(subs);
    renderAdminForumSubforums();
}

function adminDeleteSubforum(id) {
    const subs = Storage.getForumSubforums() || [];
    const sub = subs.find(s => s.id === id);
    if (!sub) return;
    if (subs.some(s => s.parentId === id)) {
        alert('This subforum has child subforums. Move or delete them first.');
        return;
    }
    if (!confirm(`Delete subforum "${sub.name}"? Threads inside it will be moved to the main forum.`)) return;
    const filtered = subs.filter(s => s.id !== id);
    const threads = Storage.getForumThreads();
    let changed = false;
    const newThreads = threads.map(t => {
        if (t.subforumId === id) { changed = true; t.subforumId = ''; }
        return t;
    });
    const memberships = (Storage.getForumSubMemberships() || []).filter(m => m.subforumId !== id);
    Storage.setForumSubforums(filtered);
    Storage.setForumSubMemberships(memberships);
    if (changed) Storage.setForumThreads(newThreads);
    if (adminSubforumEditingId === id) { adminSubforumEditingId = null; adminSubforumFormOpen = false; }
    renderAdminForumSubforums();
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
    const cat = ADMIN_FORUM_CATS[thread.category] || { label: thread.category, color: '#8a7b55', icon: 'fa-comment' };
    const likes = Storage.getForumLikes();
    const threadLikes = likes.filter(l => l.targetId === id && l.type === 'thread').length;
    const date = new Date(thread.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

    let statusBadges = '';
    if (thread.pinned) statusBadges += '<span class="forum-pin-badge" style="margin-right:4px"><i class="fas fa-thumbtack"></i> Pinned</span>';
    if (thread.locked) statusBadges += '<span class="forum-lock-badge"><i class="fas fa-lock"></i> Locked</span>';

    let repliesHtml = replies.length ? replies.map(r => {
        const rLikes = likes.filter(l => l.targetId === r.id && l.type === 'reply').length;
        return `
            <div style="display:flex;gap:10px;padding:12px 0;border-top:1px solid var(--border, #f3eddd)">
                <div class="forum-reply-avatar">${escapeHtml((r.author || '?').charAt(0).toUpperCase())}</div>
                <div style="flex:1;min-width:0">
                    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
                        <strong style="font-size:0.88rem">${escapeHtml(r.author)}</strong>
                        <div style="display:flex;gap:8px;align-items:center">
                            <span style="font-size:0.75rem;color:var(--text-muted, #a99c7e)"><i class="fas fa-heart"></i> ${rLikes}</span>
                            <button class="btn btn-danger btn-xs" onclick="adminDeleteForumReply('${r.id}', '${id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div style="font-size:0.85rem;color:var(--text-secondary, #54492f);margin-top:6px;line-height:1.6">${renderAdminRichText(r.body)}</div>
                </div>
            </div>`;
    }).join('') : '<p style="color:var(--text-muted, #a99c7e);font-size:0.85rem;padding:12px 0">No replies yet.</p>';

    showAdminView(`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">
            <span class="stat-icon" style="background:${cat.color}18;color:${cat.color};width:40px;height:40px;font-size:1rem"><i class="fas ${cat.icon}"></i></span>
            <div>
                <h2 style="margin:0 0 4px">${escapeHtml(thread.title)}</h2>
                <div style="font-size:0.8rem;color:var(--text-muted, #a99c7e)">
                    by <strong>${escapeHtml(thread.author)}</strong> · ${cat.label} · ${date} · <i class="fas fa-heart"></i> ${threadLikes}
                </div>
            </div>
        </div>
        ${statusBadges}
        <div style="margin:14px 0;padding:14px;background:#fdf9ef;border-radius:10px;font-size:0.9rem;line-height:1.7">${renderAdminRichText(thread.body)}</div>
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
        const cat = ADMIN_FORUM_CATS[t.category] || { label: t.category, color: '#8a7b55', icon: 'fa-comment' };
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
        const cat = ADMIN_FORUM_CATS[t && t.category] || { label: t ? t.category : 'Unknown', color: '#8a7b55', icon: 'fa-comment' };
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
                    <div style="font-size:0.75rem;color:var(--text-muted, #a99c7e);margin-top:2px">${renderGistShort(item.body)}</div>
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
                <td>${c.status === 'archived' ? '<span style="color:#a99c7e">Archived</span>' : '<span style="color:#10b981">Active</span>'}</td>
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
        ? '<p style="color:#a99c7e">No messages</p>'
        : msgs.map(m => `
            <div style="padding:10px 0;border-bottom:1px solid #f3eddd">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <strong>${escapeHtml(m.senderName)}</strong>
                    <span style="color:#a99c7e;font-size:0.75rem">${fmtDate(m.createdAt)}</span>
                </div>
                <div style="font-size:0.9rem;color:#3a3121">${renderMsgBodyText(m.body)}</div>
            </div>
        `).join('');

    showAdminView(`
        <h2><i class="fas fa-envelope-open-text"></i> ${escapeHtml(conv.subject)}</h2>
        <p style="color:#8a7b55;margin-top:4px">With: <strong>${escapeHtml(conv.participantName)}</strong> (${conv.participantRole}) &middot; Created ${fmtDate(conv.createdAt)}</p>
        <div style="max-height:280px;overflow-y:auto;margin-top:16px;background:#fdf9ef;border-radius:10px;padding:12px 16px">${threadHtml}</div>
        <div style="margin-top:16px">
            <label style="display:block;font-weight:600;color:#54492f;font-size:0.85rem;margin-bottom:6px">Reply as Admin:</label>
            <textarea id="adminMsgReplyBody" rows="3" style="width:100%;padding:10px 12px;border:1px solid #e6dec8;border-radius:8px;font-family:inherit;font-size:0.88rem;resize:none"></textarea>
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

// ==========================================
// HELP & QUERIES
// ==========================================
let currentAdminHelpFilter = 'all';
let currentHelpQueryId = null;

function filterAdminHelp(filter) {
    currentAdminHelpFilter = filter;
    const tabs = document.querySelectorAll('#page-admin-help-queries .filter-tab');
    tabs.forEach(t => t.classList.toggle('active', (t.getAttribute('onclick') || '').includes("'" + filter + "'")));
    renderAdminHelpQueries();
}

function renderAdminHelpQueries() {
    let queries = [...Storage.getHelpQueries()];
    const search = document.getElementById('adminHelpSearch')?.value?.toLowerCase() || '';

    document.getElementById('adminHelpQueryCount').textContent = queries.length;
    document.getElementById('adminHelpOpenCount').textContent = queries.filter(q => q.status === 'open').length;
    document.getElementById('adminHelpResolvedCount').textContent = queries.filter(q => q.status === 'resolved').length;

    if (currentAdminHelpFilter === 'open') {
        queries = queries.filter(q => q.status === 'open');
    } else if (currentAdminHelpFilter === 'resolved') {
        queries = queries.filter(q => q.status === 'resolved');
    }

    if (search) {
        queries = queries.filter(q =>
            (q.name || '').toLowerCase().includes(search) ||
            (q.email || '').toLowerCase().includes(search) ||
            (q.topic || '').toLowerCase().includes(search) ||
            (q.message || '').toLowerCase().includes(search)
        );
    }

    queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const tbody = document.getElementById('adminHelpTableBody');
    if (!tbody) return;

    if (queries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No help queries found</td></tr>';
        return;
    }

    tbody.innerHTML = queries.map(q => {
        const isOpen = q.status === 'open';
        return `
            <tr>
                <td>
                    <strong>${escapeHtml(q.name || '-')}</strong>
                    <div class="truncate" style="max-width:200px;font-size:0.8rem;color:#a99c7e">${escapeHtml(q.email || '')}</div>
                </td>
                <td>${escapeHtml(q.topic || 'Other')}</td>
                <td class="truncate" style="max-width:240px">${escapeHtml(q.message || '')}</td>
                <td>${isOpen ? '<span style="color:#f59e0b;font-weight:700">Open</span>' : '<span style="color:#10b981;font-weight:700">Resolved</span>'}</td>
                <td>${fmtDate(q.createdAt)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-xs" onclick="openAdminHelpReply('${q.id}')"><i class="fas fa-reply"></i> Reply</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openAdminHelpReply(id) {
    const q = Storage.getHelpQueries().find(x => x.id === id);
    if (!q) return;
    currentHelpQueryId = id;
    const body = document.getElementById('adminHelpReplyBody');
    const preview = q.adminReply
        ? `<div class="admin-view-block"><h4 style="color:#d4a853;margin:0 0 6px">Your Reply</h4><p style="margin:0">${escapeHtml(q.adminReply)}</p></div>`
        : '';
    body.innerHTML = `
        <div class="admin-view-block">
            <h4 style="margin:0 0 6px">${escapeHtml(q.name || 'Unknown')} <span style="font-size:0.75rem;color:#a99c7e">${escapeHtml(q.email || '')}</span></h4>
            <p style="margin:0 0 4px"><span style="color:#d4a853">${escapeHtml(q.topic || 'Other')}</span></p>
            <p style="margin:0">${escapeHtml(q.message || '')}</p>
            <div style="font-size:0.78rem;color:#a99c7e;margin-top:6px">Submitted ${fmtDate(q.createdAt)} &middot; Status: ${q.status === 'open' ? 'Open' : 'Resolved'}</div>
        </div>
        ${preview}
        <div class="form-group" style="margin-top:14px">
            <label>Your Response</label>
            <textarea id="adminHelpReplyText" rows="5" placeholder="Type your reply to this user...">${escapeHtml(q.adminReply || '')}</textarea>
        </div>
        <div style="text-align:right;margin-top:14px;display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap">
            <button class="btn btn-secondary" onclick="closeAdminHelpReply()">Close</button>
            <button class="btn btn-primary" onclick="saveAdminHelpReply('${q.id}')">${q.status === 'open' ? 'Send Reply &amp; Resolve' : 'Update Reply'}</button>
        </div>
    `;
    document.getElementById('adminHelpReplyModal').classList.add('active');
}

function closeAdminHelpReply() {
    document.getElementById('adminHelpReplyModal').classList.remove('active');
}

function saveAdminHelpReply(id) {
    const reply = document.getElementById('adminHelpReplyText').value.trim();
    if (!reply) { showToast('Please type a reply.', 'error'); return; }
    const queries = Storage.getHelpQueries();
    const q = queries.find(x => x.id === id);
    if (!q) return;
    q.adminReply = reply;
    q.status = 'resolved';
    q.repliedAt = new Date().toISOString();
    q.updatedAt = new Date().toISOString();
    Storage.setHelpQueries(queries);
    closeAdminHelpReply();
    renderAdminHelpQueries();
    showToast('Reply sent to the user. Query marked as resolved.');
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
            <td><i class="fas ${s.icon || 'fa-star'}" style="color:${s.color || '#8a7b55'};margin-right:8px"></i>${escapeHtml(s.title)}</td>
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
        const type = EXPERIENCE_TYPES[x.type] || { label: x.type || '-', icon: 'fa-gamepad', color: '#8a7b55' };
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
    const type = EXPERIENCE_TYPES[x.type] || { label: x.type || '-', icon: 'fa-gamepad', color: '#8a7b55' };
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
        const cat = FANTASY_CATEGORIES[r.category] || { label: r.category || '-', icon: 'fa-scroll', color: '#8a7b55' };
        const status = FANTASY_STATUSES[r.status] || { label: r.status || '-', color: '#8a7b55', icon: 'fa-circle' };
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
    const cat = FANTASY_CATEGORIES[r.category] || { label: r.category || '-', icon: 'fa-scroll', color: '#8a7b55' };
    const status = FANTASY_STATUSES[r.status] || { label: r.status || '-', color: '#8a7b55', icon: 'fa-circle' };
    let body = `<p class="admin-view-row"><span class="label">Title</span><span class="value">${escapeHtml(r.title)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Category</span><span class="value"><i class="fas ${cat.icon}" style="color:${cat.color}"></i> ${escapeHtml(cat.label)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Budget</span><span class="value">R${r.price || 0}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Location</span><span class="value">${escapeHtml(r.location || '-')}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Status</span><span class="value"><i class="fas ${status.icon}" style="color:${status.color}"></i> ${escapeHtml(status.label)}</span></p>`;
    body += `<p class="admin-view-row"><span class="label">Description</span></p><p>${escapeHtml(r.description || '-')}</p>`;
    if (r.responses && r.responses.length > 0) {
        body += `<p class="admin-view-row"><span class="label">Provider Responses</span></p>`;
        r.responses.forEach(res => {
            body += `<div style="border:1px solid #e6dec8;border-radius:10px;padding:10px 12px;margin:8px 0">
                <strong><i class="fas fa-briefcase"></i> ${escapeHtml(res.providerName || 'Provider')}</strong> <span style="color:#10b981">R${res.price || 0}</span>
                <p style="font-size:0.85rem;color:#54492f;margin-top:6px">${escapeHtml(res.message || '')}</p>
                <span style="font-size:0.75rem;color:#a99c7e">${fmtDate(res.createdAt)}</span>
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
