// =============================================
// 2k2 - Invoices Module
// Loaded AFTER script.js, products.js, shipping.js.
// Generates invoices for all payment types:
// product orders, experience purchases, bookings,
// tips. Provides admin, buyer, and provider views.
// =============================================
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function generateInvoiceNumber() {
    var d = new Date();
    var ds = d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
    var rand = Math.random().toString(36).substr(2, 4).toUpperCase();
    return 'INV-' + ds + '-' + rand;
  }

  // ============================================
  // INVOICE GENERATION
  // Called from each payment flow after the
  // wallet adjustment succeeds.
  // ============================================
  window.generateInvoice = function (opts) {
    /*
      opts = {
        type: 'product'|'experience'|'booking'|'tip',
        sourceId: orderId|experienceId|bookingId|tipId,
        buyerId, buyerName, buyerEmail,
        sellerId, sellerName,
        items: [{ description, quantity, unitPrice, total }],
        shippingCost: 0,
        status: 'paid'|'refunded'|'cancelled',
        paidAt: ISO string (optional, defaults to now)
      }
    */
    var subtotal = (opts.items || []).reduce(function (s, i) { return s + (Number(i.total) || 0); }, 0);
    var shipping = Number(opts.shippingCost || 0);
    var invoice = {
      id: 'inv_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8),
      invoiceNumber: generateInvoiceNumber(),
      type: opts.type || 'product',
      sourceId: opts.sourceId || '',
      buyerId: opts.buyerId || '',
      buyerName: opts.buyerName || 'Buyer',
      buyerEmail: opts.buyerEmail || '',
      sellerId: opts.sellerId || '',
      sellerName: opts.sellerName || 'Seller',
      items: opts.items || [],
      subtotal: subtotal,
      shippingCost: shipping,
      total: subtotal + shipping,
      status: opts.status || 'paid',
      createdAt: opts.paidAt || new Date().toISOString(),
      paidAt: opts.paidAt || new Date().toISOString()
    };
    var invoices = Storage.getInvoices();
    invoices.push(invoice);
    Storage.setInvoices(invoices);
    return invoice;
  };

  window.updateInvoiceStatus = function (invoiceId, status) {
    var invoices = Storage.getInvoices().map(function (inv) {
      return inv.id === invoiceId ? Object.assign({}, inv, { status: status }) : inv;
    });
    Storage.setInvoices(invoices);
  };

  // ============================================
  // BUYER - My Invoices
  // ============================================
  window.renderMyInvoices = async function () {
    var user = await currentUser();
    var container = document.getElementById('myInvoicesList');
    var countEl = document.getElementById('myInvoicesCount');
    if (!container) return;
    var uid = user ? user.id : null;
    var list = uid ? Storage.getInvoices().filter(function (inv) { return (inv.buyerId || '') === uid; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }) : [];
    if (countEl) countEl.textContent = list.length;
    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-file-invoice"></i><h3>No invoices yet</h3><p>Your purchase invoices will appear here</p></div>';
      return;
    }
    container.innerHTML = list.map(function (inv) {
      var typeInfo = { product: ['Product', '#c9a227'], experience: ['Experience', '#8b5cf6'], booking: ['Booking', '#3b82f6'], tip: ['Tip', '#10b981'] }[inv.type] || ['Other', '#a99c7e'];
      var statusInfo = { paid: ['#10b981', 'Paid'], refunded: ['#f59e0b', 'Refunded'], cancelled: ['#ef4444', 'Cancelled'] }[inv.status] || ['#a99c7e', inv.status];
      return '<div class="profile-card">' +
        '<div class="profile-header">' +
          '<div class="profile-avatar" style="background:' + typeInfo[1] + '20"><i class="fas fa-file-invoice" style="color:' + typeInfo[1] + '"></i></div>' +
          '<div class="profile-info">' +
            '<h4>' + esc(inv.invoiceNumber) + ' <span class="mini-tag" style="background:' + statusInfo[1] + '18;color:' + statusInfo[1] + '">' + statusInfo[1] + '</span></h4>' +
            '<div class="profile-meta"><span class="mini-tag" style="background:' + typeInfo[1] + '18;color:' + typeInfo[1] + '">' + typeInfo[0] + '</span> &middot; ' + esc(inv.sellerName || 'Seller') + '</div>' +
            '<div class="profile-meta" style="margin-top:4px;font-size:12px;color:#a99c7e">' + new Date(inv.createdAt).toLocaleDateString('en-ZA') + '</div>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<div style="color:#c9a227;font-weight:800;font-size:18px">R' + Number(inv.total || 0).toFixed(2) + '</div>' +
            '<button class="btn btn-secondary btn-sm" style="margin-top:6px" onclick="viewInvoice(\'' + esc(inv.id) + '\')"><i class="fas fa-eye"></i> View</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  };

  // ============================================
  // PROVIDER - My Sales Invoices
  // ============================================
  window.renderProviderInvoices = async function () {
    var user = await currentUser();
    var uid = user ? user.id : null;
    var container = document.getElementById('providerInvoicesList');
    var countEl = document.getElementById('providerInvoicesCount');
    if (!container) return;
    var list = uid ? Storage.getInvoices().filter(function (inv) { return (inv.sellerId || '') === uid; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }) : [];
    if (countEl) countEl.textContent = list.length;
    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-file-invoice"></i><h3>No sales invoices yet</h3><p>Invoices from your sales will appear here</p></div>';
      return;
    }
    container.innerHTML = list.map(function (inv) {
      var typeInfo = { product: ['Product', '#c9a227'], experience: ['Experience', '#8b5cf6'], booking: ['Booking', '#3b82f6'], tip: ['Tip', '#10b981'] }[inv.type] || ['Other', '#a99c7e'];
      var statusInfo = { paid: ['#10b981', 'Paid'], refunded: ['#f59e0b', 'Refunded'], cancelled: ['#ef4444', 'Cancelled'] }[inv.status] || ['#a99c7e', inv.status];
      return '<div class="profile-card">' +
        '<div class="profile-header">' +
          '<div class="profile-avatar" style="background:' + typeInfo[1] + '20"><i class="fas fa-file-invoice" style="color:' + typeInfo[1] + '"></i></div>' +
          '<div class="profile-info">' +
            '<h4>' + esc(inv.invoiceNumber) + ' <span class="mini-tag" style="background:' + statusInfo[1] + '18;color:' + statusInfo[1] + '">' + statusInfo[1] + '</span></h4>' +
            '<div class="profile-meta"><span class="mini-tag" style="background:' + typeInfo[1] + '18;color:' + typeInfo[1] + '">' + typeInfo[0] + '</span> &middot; Buyer: ' + esc(inv.buyerName || 'Buyer') + '</div>' +
            '<div class="profile-meta" style="margin-top:4px;font-size:12px;color:#a99c7e">' + new Date(inv.createdAt).toLocaleDateString('en-ZA') + '</div>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<div style="color:#c9a227;font-weight:800;font-size:18px">R' + Number(inv.total || 0).toFixed(2) + '</div>' +
            '<button class="btn btn-secondary btn-sm" style="margin-top:6px" onclick="viewInvoice(\'' + esc(inv.id) + '\')"><i class="fas fa-eye"></i> View</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  };

  // ============================================
  // ADMIN - All Invoices
  // ============================================
  window.renderAdminInvoices = function () {
    var list = Storage.getInvoices().slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var container = document.getElementById('adminInvoicesList');
    var countEl = document.getElementById('adminInvoicesCount');
    if (!container) return;
    if (countEl) countEl.textContent = list.length;
    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-file-invoice"></i><h3>No invoices yet</h3><p>All platform invoices will appear here</p></div>';
      return;
    }
    container.innerHTML = '<table class="admin-table"><thead><tr><th>Invoice</th><th>Type</th><th>Buyer</th><th>Seller</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>' +
      list.map(function (inv) {
        var typeInfo = { product: ['#c9a227', 'Product'], experience: ['#8b5cf6', 'Experience'], booking: ['#3b82f6', 'Booking'], tip: ['#10b981', 'Tip'] }[inv.type] || ['#a99c7e', 'Other'];
        var statusInfo = { paid: ['#10b981', 'Paid'], refunded: ['#f59e0b', 'Refunded'], cancelled: ['#ef4444', 'Cancelled'] }[inv.status] || ['#a99c7e', inv.status];
        return '<tr>' +
          '<td><strong>' + esc(inv.invoiceNumber) + '</strong></td>' +
          '<td><span class="mini-tag" style="background:' + typeInfo[0] + '18;color:' + typeInfo[0] + '">' + typeInfo[1] + '</span></td>' +
          '<td>' + esc(inv.buyerName || '-') + '</td>' +
          '<td>' + esc(inv.sellerName || '-') + '</td>' +
          '<td style="color:#c9a227;font-weight:800">R' + Number(inv.total || 0).toFixed(2) + '</td>' +
          '<td><span class="mini-tag" style="background:' + statusInfo[0] + '18;color:' + statusInfo[0] + '">' + statusInfo[1] + '</span></td>' +
          '<td style="font-size:12px">' + new Date(inv.createdAt).toLocaleDateString('en-ZA') + '</td>' +
          '<td><button class="btn btn-secondary btn-sm" onclick="viewInvoice(\'' + esc(inv.id) + '\')"><i class="fas fa-eye"></i></button></td>' +
        '</tr>';
      }).join('') + '</tbody></table>';
  };

  // ============================================
  // INVOICE DETAIL VIEW (shared by all roles)
  // ============================================
  window.viewInvoice = function (invoiceId) {
    var inv = Storage.getInvoices().find(function (x) { return x.id === invoiceId; });
    if (!inv) return;
    var typeInfo = { product: ['#c9a227', 'Product'], experience: ['#8b5cf6', 'Experience'], booking: ['#3b82f6', 'Booking'], tip: ['#10b981', 'Tip'] }[inv.type] || ['#a99c7e', 'Other'];
    var statusInfo = { paid: ['#10b981', 'Paid'], refunded: ['#f59e0b', 'Refunded'], cancelled: ['#ef4444', 'Cancelled'] }[inv.status] || ['#a99c7e', inv.status];

    var html =
      '<div class="profile-card" style="max-width:700px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">' +
          '<div>' +
            '<h2 style="margin:0;color:#c9a227">' + esc(inv.invoiceNumber) + '</h2>' +
            '<div style="margin-top:6px"><span class="mini-tag" style="background:' + typeInfo[0] + '18;color:' + typeInfo[0] + '">' + typeInfo[1] + '</span> <span class="mini-tag" style="background:' + statusInfo[0] + '18;color:' + statusInfo[1] + '">' + statusInfo[1] + '</span></div>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<div style="font-size:28px;font-weight:800;color:#c9a227">R' + Number(inv.total || 0).toFixed(2) + '</div>' +
            '<div style="font-size:12px;color:#a99c7e">Issued ' + new Date(inv.createdAt).toLocaleDateString('en-ZA') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(201,162,39,.15)">' +
          '<div>' +
            '<div style="font-size:11px;text-transform:uppercase;color:#a99c7e;letter-spacing:1px;margin-bottom:4px">Bill To</div>' +
            '<div style="color:#fdf9ef;font-weight:600">' + esc(inv.buyerName || 'Buyer') + '</div>' +
            '<div style="color:#a99c7e;font-size:13px">' + esc(inv.buyerEmail || '') + '</div>' +
          '</div>' +
          '<div>' +
            '<div style="font-size:11px;text-transform:uppercase;color:#a99c7e;letter-spacing:1px;margin-bottom:4px">Sold By</div>' +
            '<div style="color:#fdf9ef;font-weight:600">' + esc(inv.sellerName || 'Seller') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:20px">' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
            '<thead><tr style="border-bottom:1px solid rgba(201,162,39,.15)">' +
              '<th style="text-align:left;padding:8px 0;color:#a99c7e;font-weight:600">Description</th>' +
              '<th style="text-align:center;padding:8px 0;color:#a99c7e;font-weight:600">Qty</th>' +
              '<th style="text-align:right;padding:8px 0;color:#a99c7e;font-weight:600">Unit Price</th>' +
              '<th style="text-align:right;padding:8px 0;color:#a99c7e;font-weight:600">Total</th>' +
            '</tr></thead><tbody>' +
            (inv.items || []).map(function (item) {
              return '<tr style="border-bottom:1px solid rgba(201,162,39,.08)">' +
                '<td style="padding:10px 0;color:#fdf9ef">' + esc(item.description || '-') + '</td>' +
                '<td style="text-align:center;padding:10px 0;color:#fdf9ef">' + esc(item.quantity || 1) + '</td>' +
                '<td style="text-align:right;padding:10px 0;color:#fdf9ef">R' + Number(item.unitPrice || 0).toFixed(2) + '</td>' +
                '<td style="text-align:right;padding:10px 0;color:#c9a227;font-weight:600">R' + Number(item.total || 0).toFixed(2) + '</td>' +
              '</tr>';
            }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(201,162,39,.15);text-align:right">' +
          '<div style="color:#a99c7e;font-size:13px">Subtotal: R' + Number(inv.subtotal || 0).toFixed(2) + '</div>' +
          (inv.shippingCost > 0 ? '<div style="color:#a99c7e;font-size:13px">Shipping: R' + Number(inv.shippingCost || 0).toFixed(2) + '</div>' : '') +
          '<div style="color:#c9a227;font-size:18px;font-weight:800;margin-top:6px">Total: R' + Number(inv.total || 0).toFixed(2) + '</div>' +
        '</div>' +
      '</div>';

    // Display in a modal or in-place
    var modal = document.getElementById('invoiceDetailModal');
    if (modal) {
      modal.querySelector('.invoice-detail-content').innerHTML = html;
      modal.classList.add('active');
    } else {
      // Fallback: show in a simple alert-like display
      showToast('Invoice ' + inv.invoiceNumber + ': R' + Number(inv.total).toFixed(2) + ' (' + inv.status + ')');
    }
  };

  window.closeInvoiceModal = function () {
    var modal = document.getElementById('invoiceDetailModal');
    if (modal) modal.classList.remove('active');
  };

  async function currentUser() {
    try {
      if (window._2k2 && _2k2.Auth && _2k2.Auth.currentUser) return await _2k2.Auth.currentUser();
    } catch (e) {}
    return null;
  }

})();
