// ==========================================
// MONETIZATION HUB (provider)
// A single page that explains EVERY way a
// service provider can earn on 2k2, plus a
// live earnings summary, revenue-by-source
// breakdown, commission paid, and a recent
// earnings feed.
// ==========================================

function monetary(n) { return 'R' + Number(n || 0).toFixed(2); }

// Provider earnings source descriptors used for the live breakdown and the guide.
const MONETIZATION_SOURCES = [
    { type: 'tip-received', key: 'tips', icon: 'fa-hand-holding-heart', color: '#10b981', label: 'Tips', desc: 'Clients send you a tip from your profile. 10% platform commission applies.', page: 'provider-tips', btn: 'Manage Tips' },
    { type: 'booking-confirmed', key: 'bookings', icon: 'fa-calendar-check', color: '#3b82f6', label: 'Bookings', desc: 'Clients pay your booking fee, held in escrow until confirmed. 10% commission applies.', page: 'provider-bookings', btn: 'Manage Bookings' },
    { type: 'product-sale', key: 'products', icon: 'fa-box', color: '#8b5cf6', label: 'Product Sales', desc: 'Sell physical/digital products. Escrow protects both sides; 10% commission applies.', page: 'provider-products', btn: 'Manage Products' },
    { type: 'shipping-received', key: 'shipping', icon: 'fa-truck', color: '#f59e0b', label: 'Shipping', desc: 'Recover delivery costs by setting shipping on each product order. Not commissioned.', page: 'provider-orders', btn: 'Manage Orders' },
    { type: 'experience-sale', key: 'experiences', icon: 'fa-gamepad', color: '#a07d12', label: 'Experiences', desc: 'Charge a fee to join your games & experiences. 10% commission applies.', page: 'provider-experiences', btn: 'Manage Experiences' },
    { type: 'subforum-subscription', key: 'subforums', icon: 'fa-comments', color: '#06b6d4', label: 'Paid Forums', desc: 'Set a join fee on a forum subforum. 10% commission applies.', page: 'provider-subforums', btn: 'Manage Subforums' },
    { type: 'gig', key: 'gigs', icon: 'fa-briefcase', color: '#ef4444', label: 'Gigs', desc: 'Offer freelance gigs to the community and earn per gig.', page: 'provider-gigs', btn: 'Manage Gigs' },
    { type: 'venue', key: 'venues', icon: 'fa-store', color: '#14b8a6', label: 'Venues', desc: 'List a venue and get discovered for bookings and events.', page: 'provider-venue-directory', btn: 'Manage Venues' },
    { type: 'content', key: 'content', icon: 'fa-newspaper', color: '#6366f1', label: 'Content', desc: 'Publish content to grow your audience and drive more paid traffic.', page: 'provider-content', btn: 'Manage Content' },
    { type: 'event', key: 'events', icon: 'fa-calendar-day', color: '#ec4899', label: 'Events', desc: 'Create events that attract paying attendees.', page: 'provider-events', btn: 'Manage Events' }
];

// Compute the provider's collection of wallets (listings + services).
function monetizationProviderWalletIds() {
    return [...new Set([
        ...Storage.getListings().map(l => l.id),
        ...Storage.getServices().map(s => s.id)
    ])];
}

function monetizationAllTxns() {
    const ids = monetizationProviderWalletIds();
    let txns = [];
    ids.forEach(pid => { txns = txns.concat(getWalletTransactions('provider', pid)); });
    return txns;
}

function renderProviderMonetization() {
    const ids = monetizationProviderWalletIds();
    let totalBalance = 0;
    let totalHeld = 0;
    ids.forEach(pid => {
        totalBalance += getOrCreateWallet('provider', pid).balance;
    });
    Storage.getEscrowFunds().forEach(e => {
        if (e.status === 'held' && e.payeeType === 'provider' && ids.includes(String(e.payeeId))) totalHeld += e.amount || 0;
    });

    const txns = monetizationAllTxns().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Per-source earnings (gross credits), count, and commission paid (10% of gross).
    const sourceStats = {};
    let grossTotal = 0;
    MONETIZATION_SOURCES.forEach(s => { sourceStats[s.key] = { gross: 0, count: 0, commission: 0 }; });
    txns.forEach(t => {
        if (t.amount <= 0) return;
        const src = MONETIZATION_SOURCES.find(s => s.type === t.type);
        if (!src) return;
        sourceStats[src.key].gross += t.amount;
        sourceStats[src.key].count += 1;
        const isCommissionable = ['tip-received','booking-confirmed','product-sale','experience-sale','subforum-subscription'].indexOf(t.type) !== -1;
        sourceStats[src.key].commission += isCommissionable ? Math.round(t.amount * 0.10 * 100) / 100 : 0;
        grossTotal += t.amount;
    });
    const totalCommission = Math.round(grossTotal * 0.10 * 100) / 100;

    // --- summary cards ---
    const summary = document.getElementById('monetizationSummary');
    if (summary) {
        summary.innerHTML = [
            { icon: 'fa-wallet', color: '#c9a227', val: monetary(totalBalance), label: 'Available Balance', page: 'provider-wallet' },
            { icon: 'fa-arrow-down', color: '#10b981', val: monetary(grossTotal), label: 'Total Earned', page: 'provider-wallet' },
            { icon: 'fa-shield-halved', color: '#8b5cf6', val: monetary(totalHeld), label: 'Pending in Escrow', page: 'provider-orders' },
            { icon: 'fa-percent', color: '#f59e0b', val: monetary(totalCommission), label: 'Commission Paid (10%)', page: 'admin-wallets' }
        ].map(c => `
            <div class="stat-card" onclick="navigateTo('${c.page}')">
                <div class="stat-icon" style="background:${c.color}22;color:${c.color}"><i class="fas ${c.icon}"></i></div>
                <div class="stat-info">
                    <span class="stat-number">${c.val}</span>
                    <span class="stat-label">${c.label}</span>
                </div>
            </div>`).join('');
    }

    // --- revenue by source ---
    const breakdown = document.getElementById('monetizationBreakdown');
    if (breakdown) {
        breakdown.innerHTML = MONETIZATION_SOURCES.map(s => {
            const st = sourceStats[s.key];
            const pct = grossTotal > 0 ? Math.round((st.gross / grossTotal) * 100) : 0;
            return `
            <div class="profile-card" style="padding:16px">
                <div class="mon-src-head">
                    <div class="wallet-stat-icon" style="background:${s.color}22;color:${s.color}"><i class="fas ${s.icon}"></i></div>
                    <div>
                        <div style="font-weight:800;color:#1c1917">${s.label}</div>
                        <div style="font-size:.8rem;color:#78716c">${st.count} payment${st.count === 1 ? '' : 's'}</div>
                    </div>
                    <div style="margin-left:auto;text-align:right">
                        <div style="font-weight:800;color:#c9a227">${monetary(st.gross)}</div>
                        <div style="font-size:.75rem;color:#a8a29e">${pct}% of earnings</div>
                    </div>
                </div>
                ${grossTotal > 0 ? `<div class="mon-bar"><div style="width:${pct}%;background:${s.color}"></div></div>` : ''}
                <div class="mon-src-actions">
                    <span class="mini-tag" style="background:${s.color}18;color:${s.color}">${st.commission > 0 ? 'Commission ' + monetary(st.commission) : 'No commission'}</span>
                    <button class="btn btn-secondary btn-sm" onclick="navigateTo('${s.page}')">${s.btn}</button>
                </div>
            </div>`;
        }).join('');
    }

    // --- recent earnings feed ---
    const feed = document.getElementById('monetizationRecent');
    if (feed) {
        if (txns.length === 0) {
            feed.innerHTML = '<div class="empty-section"><i class="fas fa-coins"></i><p>No earnings yet</p><span>Your tips, bookings and sales will appear here</span></div>';
        } else {
            feed.innerHTML = txns.slice(0, 15).map(t => {
                const color = { 'tip-received': '#10b981', 'booking-confirmed': '#3b82f6', 'product-sale': '#8b5cf6', 'experience-sale': '#a07d12', 'subforum-subscription': '#06b6d4', 'shipping-received': '#f59e0b' }[t.type] || '#8a7b55';
                const label = { 'tip-received': 'Tip', 'booking-confirmed': 'Booking Confirmed', 'product-sale': 'Product Sale', 'experience-sale': 'Experience', 'subforum-subscription': 'Subforum', 'shipping-received': 'Shipping' }[t.type] || t.type;
                return `
                <div class="txn-row">
                    <div class="txn-icon" style="background:${color}22;color:${color}"><i class="fas fa-arrow-down"></i></div>
                    <div class="txn-info">
                        <div class="txn-desc">${t.description || label}</div>
                        <div class="txn-meta">${label} &middot; ${formatDate(t.createdAt)}</div>
                    </div>
                    <div class="txn-amount positive">+${monetary(t.amount)}</div>
                </div>`;
            }).join('');
        }
    }

    // --- Ways to Earn guide (static, always shown) ---
    const guide = document.getElementById('monetizationGuide');
    if (guide) {
        guide.innerHTML = MONETIZATION_SOURCES.map((s, i) => `
            <div class="how-step">
                <div class="how-step-num">${i + 1}</div>
                <div class="mon-guide-icon" style="background:${s.color}22;color:${s.color}"><i class="fas ${s.icon}"></i></div>
                <h4>${s.label}</h4>
                <p>${s.desc}</p>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('${s.page}')"><i class="fas fa-arrow-right"></i> ${s.btn}</button>
            </div>`).join('');
    }
}

// Compact earnings snapshot + ways-to-earn teaser shown on the provider home dashboard.
function renderProviderHomeEarnings() {
    const ids = monetizationProviderWalletIds();
    let totalBalance = 0;
    let gross = 0;
    let totalHeld = 0;
    let pendingOrders = 0;
    ids.forEach(pid => {
        totalBalance += getOrCreateWallet('provider', pid).balance;
        getWalletTransactions('provider', pid).forEach(t => { if (t.amount > 0) gross += t.amount; });
    });
    Storage.getEscrowFunds().forEach(e => {
        if (e.status === 'held' && e.payeeType === 'provider' && ids.includes(String(e.payeeId))) totalHeld += e.amount || 0;
    });
    const myOrders = Storage.getProductOrders();
    myOrders.forEach(o => {
        if ((o.providerId && ids.includes(String(o.providerId))) || (o.authorId && ids.includes(String(o.authorId)))) {
            if (['pending', 'shipped', 'processing'].indexOf(o.status) !== -1) pendingOrders += 1;
        }
    });

    const stats = document.getElementById('homeMonetizationStats');
    if (stats) {
        stats.innerHTML = [
            { icon: 'fa-wallet', color: '#c9a227', val: monetary(totalBalance), label: 'Balance' },
            { icon: 'fa-arrow-down', color: '#10b981', val: monetary(gross), label: 'Total Earned' },
            { icon: 'fa-shield-halved', color: '#8b5cf6', val: monetary(totalHeld), label: 'In Escrow' },
            { icon: 'fa-box-open', color: '#3b82f6', val: String(pendingOrders), label: 'Open Orders' }
        ].map(c => `
            <div class="stat-card" style="min-width:150px">
                <div class="stat-icon" style="background:${c.color}22;color:${c.color};width:40px;height:40px;font-size:.95rem"><i class="fas ${c.icon}"></i></div>
                <div class="stat-info">
                    <span class="stat-number" style="font-size:1.25rem">${c.val}</span>
                    <span class="stat-label">${c.label}</span>
                </div>
            </div>`).join('');
    }

    const teaser = document.getElementById('homeWaysToEarn');
    if (teaser) {
        teaser.innerHTML = MONETIZATION_SOURCES.slice(0, 8).map(s => `
            <div class="earn-teaser-card" onclick="navigateTo('${s.page}')">
                <i class="fas ${s.icon}" style="color:${s.color}"></i>
                <div class="et-title">${s.label}</div>
                <div class="et-sub">Earn &middot; ${s.btn}</div>
            </div>`).join('');
    }
}
