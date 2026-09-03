// =============================================
// 2k2 - Products & Product Orders module
// Loaded AFTER script.js on all portals.
//   - General users: browse products + place orders
//   - Service providers: full CRUD on own products + orders
//   - Admins: manage all products + view/handle orders
// Ownership is scoped by the auth account id (authorId).
// =============================================
(function () {
  'use strict';

  var PRODUCT_CATEGORIES = {
    fashion: { label: 'Fashion & Apparel', icon: 'fa-shirt', color: '#ec4899' },
    electronics: { label: 'Electronics & Gadgets', icon: 'fa-plug', color: '#3b82f6' },
    home: { label: 'Home & Living', icon: 'fa-house', color: '#f59e0b' },
    beauty: { label: 'Beauty & Care', icon: 'fa-spa', color: '#a855f7' },
    food: { label: 'Food & Drink', icon: 'fa-utensils', color: '#ef4444' },
    health: { label: 'Wellness & Health', icon: 'fa-heart-pulse', color: '#10b981' },
    collectibles: { label: 'Art & Collectibles', icon: 'fa-gem', color: '#a07d12' },
    services_goods: { label: 'Services & Handmade', icon: 'fa-hand-holding-heart', color: '#06b6d4' },
    toys: { label: 'Toys & Kids', icon: 'fa-baby-carriage', color: '#14b8a6' },
    sports: { label: 'Sports & Outdoors', icon: 'fa-futbol', color: '#6366f1' },
    automotive: { label: 'Automotive', icon: 'fa-car', color: '#64748b' },
    digital: { label: 'Digital & Vouchers', icon: 'fa-ticket', color: '#8b5cf6' },
    other: { label: 'Other', icon: 'fa-box', color: '#a99c7e' }
  };

  function catInfo(key) {
    return PRODUCT_CATEGORIES[key] || PRODUCT_CATEGORIES.other;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  async function currentUser() {
    try {
      if (window._2k2 && _2k2.Auth && _2k2.Auth.currentUser) return await _2k2.Auth.currentUser();
    } catch (e) {}
    return null;
  }

  async function currentAuthor() {
    var user = await currentUser();
    var authorName = 'My Business';
    try {
      if (typeof getCurrentProviderIdentity === 'function') {
        var idn = getCurrentProviderIdentity();
        if (idn && idn.name) authorName = idn.name;
      }
    } catch (e) {}
    if (user) {
      try {
        var profile = await _2k2.Auth.getProfile();
        if (profile && (profile.display_name || profile.full_name)) authorName = profile.display_name || profile.full_name;
      } catch (e) {}
    }
    return { authorId: (user && user.id) || 'anon', authorName: authorName };
  }

  // ============================================
  // GENERAL USERS - browse products
  // ============================================
  var currentProductsFilter = 'all';
  function setProductsFilterTabs() {
    document.querySelectorAll('#productsFilterTabs .filter-tab').forEach(function (tab) {
      var key = tab.getAttribute('data-cat') || 'all';
      tab.classList.toggle('active', key === currentProductsFilter);
    });
    var dropdown = document.getElementById('productsCategoryFilter');
    if (dropdown && !dropdown._syncing) dropdown.value = currentProductsFilter;
  }

  window.renderProductsBrowser = function () {
    var list = Storage.getProducts().slice().filter(function (p) { return isApprovedPublic(p); });
    var q = (document.getElementById('productsSearch') ? document.getElementById('productsSearch').value : '').toLowerCase();
    var sort = document.getElementById('productsSort') ? document.getElementById('productsSort').value : 'newest';
    var cat = currentProductsFilter;

    if (cat !== 'all') list = list.filter(function (p) { return p.category === cat; });
    if (q) list = list.filter(function (p) { return (p.name || '').toLowerCase().indexOf(q) > -1 || (p.description || '').toLowerCase().indexOf(q) > -1 || (p.authorName || '').toLowerCase().indexOf(q) > -1; });

    list.sort(function (a, b) {
      if (sort === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sort === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sort === 'name-asc') return String(a.name || '').localeCompare(b.name || '');
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    var count = document.getElementById('productsDirectoryCount');
    if (count) count.textContent = list.length;

    var container = document.getElementById('productsDirectoryList');
    if (!container) return;

    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-box-open"></i><h3>No products found</h3><p>Try adjusting your search or filters</p></div>';
      return;
    }

    container.innerHTML = list.map(function (p) {
      var ci = catInfo(p.category);
      var photo = p.photo || '';
      return '<div class="directory-card">' +
        (photo ? '<div class="directory-card-photo"><img src="' + esc(photo) + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<div class="directory-card-icon" style="display:none"><i class="fas ' + ci.icon + '"></i></div></div>'
        : '<div class="directory-card-photo"><div class="directory-card-icon"><i class="fas ' + ci.icon + '"></i></div></div>') +
        '<div class="directory-card-body">' +
          '<h3>' + esc(p.name || 'Untitled') + '</h3>' +
          '<div class="directory-card-meta"><i class="fas ' + ci.icon + '" style="color:' + esc(ci.color) + '"></i> <span style="color:' + esc(ci.color) + ';font-weight:600">' + esc(ci.label) + '</span></div>' +
          '<div class="directory-card-meta"><i class="fas fa-user"></i> ' + esc(p.authorName || 'Provider') + '</div>' +
          '<div class="directory-card-price" style="margin:8px 0;font-weight:800;color:#c9a227">R' + esc(Number(p.price || 0).toFixed(2)) + '</div>' +
          '<div class="directory-card-bio">' + esc((p.description || '').substring(0, 90)) + '</div>' +
        '</div>' +
        '<div class="directory-card-actions">' +
          '<button class="btn btn-secondary btn-sm" onclick="addToCart(\'' + esc(p.id) + '\')" ' + ((p.stock != null && p.stock <= 0) ? 'disabled' : '') + '><i class="fas fa-cart-plus"></i> Cart</button>' +
          '<button class="btn btn-primary btn-sm" onclick="viewProduct(\'' + esc(p.id) + '\')"><i class="fas fa-eye"></i> View</button>' +
        '</div>' +
      '</div>';
    }).join('');

    if (typeof restoreBrowseView === 'function') restoreBrowseView('productsDirectoryList');
  };

  window.filterProductsCategory = function (key) {
    var dropdown = document.getElementById('productsCategoryFilter');
    if (key === undefined && dropdown) {
      currentProductsFilter = dropdown.value || 'all';
    } else {
      currentProductsFilter = (key === undefined || key === null) ? 'all' : key;
    }
    setProductsFilterTabs();
    renderProductsBrowser();
  };

  // ============================================
  // GENERAL USERS - product detail + order
  // ============================================
  window.viewProduct = function (id) {
    var p = Storage.getProducts().find(function (x) { return x.id === id; });
    if (!p) { alert('Product not found.'); return; }
    var ci = catInfo(p.category);
    var photo = p.photo || '';
    document.getElementById('productViewContent').innerHTML =
      '<div class="profile-card view-header-card">' +
        '<div class="view-avatar" style="width:140px;height:140px;max-width:100%;border-radius:14px;overflow:hidden;flex-shrink:0;margin:0 auto">' +
          (photo ? '<img src="' + esc(photo) + '" style="width:100%;height:100%;object-fit:cover" alt="">'
                 : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;color:#c9a227"><i class="fas ' + ci.icon + '"></i></div>') +
        '</div>' +
        '<div class="view-header-info" style="flex:1;min-width:0">' +
          '<div class="mini-tag" style="background:rgba(201,162,39,.15);color:#d4a853">' + esc(ci.label) + '</div>' +
          '<h2 style="margin:6px 0">' + esc(p.name || 'Untitled') + '</h2>' +
          '<div style="color:#a99c7e;margin:4px 0"><i class="fas fa-user"></i> Sold by ' + esc(p.authorName || 'Provider') + '</div>' +
          '<div style="font-size:26px;font-weight:800;color:#d4a853;margin:10px 0">R' + esc(Number(p.price || 0).toFixed(2)) + '</div>' +
          '<div style="color:#a99c7e;font-size:13px">Stock: <strong>' + esc((p.stock == null ? 0 : p.stock)) + '</strong> available</div>' +
        '</div>' +
      '</div>' +
      '<div class="profile-card" style="margin-top:16px">' +
        '<h3 style="color:#c9a227;margin:0 0 8px">Description</h3>' +
        '<p style="color:#fdf9ef;line-height:1.6;white-space:pre-wrap">' + esc(p.description || 'No description provided.') + '</p>' +
        '<div style="margin-top:18px;text-align:right">' +
          '<button class="btn btn-secondary" onclick="addToCart(\'' + esc(p.id) + '\')" ' + ((p.stock != null && p.stock <= 0) ? 'disabled' : '') + '><i class="fas fa-cart-plus"></i> Add to Cart</button> ' +
          '<button class="btn btn-primary" onclick="placeProductOrder(\'' + esc(p.id) + '\')" ' + ((p.stock != null && p.stock <= 0) ? 'disabled' : '') + '><i class="fas fa-zap"></i> Buy Now</button>' +
        '</div>' +
      '</div>';
    navigateTo('product-view');
  };

  window.placeProductOrder = async function (id) {
    var p = Storage.getProducts().find(function (x) { return x.id === id; });
    if (!p) { alert('Product not found.'); return; }
    if (p.stock != null && p.stock <= 0) { alert('This product is currently out of stock.'); return; }
    var user = await currentUser();
    if (!user) { window.location.href = 'login.html?next=index.html'; return; }

    if (typeof getWalletBalance !== 'function') { alert('Wallet services are unavailable right now.'); return; }
    var total = Number(p.price || 0);
    var balance = getWalletBalance('user', user.id);
    if (total <= 0) { alert('This product has no price set.'); return; }
    if (balance < total) {
      alert('Insufficient wallet balance. You need R' + total.toFixed(2) + ' for this order. Please top up your wallet first.');
      return;
    }

    var quantity = 1;
    var orderId = 'po_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
    var orders = Storage.getProductOrders();
    orders.push({
      id: orderId,
      productId: p.id,
      productName: p.name,
      productPrice: Number(p.price || 0),
      authorId: p.authorId,
      authorName: p.authorName,
      buyerId: user.id,
      buyerName: (user.email || 'Buyer'),
      buyerEmail: user.email || '',
      quantity: quantity,
      total: total,
      status: 'pending',
      paymentStatus: 'held',
      paymentMethod: 'wallet',
      createdAt: Date.now()
    });
    Storage.setProductOrders(orders);

    // Deduct the buyer's wallet and hold the funds in escrow until the order is completed.
    adjustWallet('user', user.id, -total, 'product-purchase', 'Payment for "' + (p.name || 'product') + '" held in escrow', { productOrderId: orderId, productId: p.id });
    holdProductOrderEscrow(orderId, user.id, p.authorId, total);

    var list = Storage.getProducts().map(function (x) {
      if (x.id === p.id && x.stock != null) { var s = Math.max(0, Number(x.stock) - quantity); return Object.assign({}, x, { stock: s }); }
      return x;
    });
    Storage.setProducts(list);

    alert('Payment of R' + total.toFixed(2) + ' received. The funds are held in escrow and will be released to the provider once the order is completed. Track it under your orders.');
    // Generate invoice
    if (typeof generateInvoice === 'function') {
      generateInvoice({
        type: 'product', sourceId: orderId,
        buyerId: user.id, buyerName: user.email || 'Buyer', buyerEmail: user.email || '',
        sellerId: p.authorId, sellerName: p.authorName || 'Provider',
        items: [{ description: p.name || 'Product', quantity: quantity, unitPrice: total, total: total }],
        shippingCost: 0, status: 'paid'
      });
    }
    navigateTo('my-purchases');
  };

  // ============================================
  // CART
  // Per-user shopping cart. Each cart item is
  // scoped by the current auth user's id.
  // ============================================
  window.addToCart = async function (id) {
    var p = Storage.getProducts().find(function (x) { return x.id === id; });
    if (!p) { alert('Product not found.'); return; }
    if (p.stock != null && p.stock <= 0) { alert('This product is currently out of stock.'); return; }
    var user = await currentUser();
    if (!user) { window.location.href = 'login.html?next=index.html'; return; }
    var uid = user.id;
    var items = Storage.getCartItems();
    var existing = items.find(function (c) { return c.userId === uid && c.productId === p.id; });
    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1;
      existing.addedAt = Date.now();
      Storage.setCartItems(items);
    } else {
      items.push({
        id: 'cart_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8),
        userId: uid,
        productId: p.id,
        productName: p.name || 'Untitled',
        price: Number(p.price || 0),
        stock: (p.stock == null ? 0 : p.stock),
        authorId: p.authorId,
        authorName: p.authorName || 'Provider',
        quantity: 1,
        addedAt: Date.now()
      });
      Storage.setCartItems(items);
    }
    showToast('Added to cart');
    if (typeof refreshCartBadge === 'function') refreshCartBadge();
  };

  window.refreshCartBadge = async function () {
    try {
      var user = await currentUser();
      var badge = document.getElementById('cartBadge');
      if (!badge) return;
      if (!user) { badge.textContent = '0'; badge.style.display = 'none'; return; }
      var uid = user.id;
      var count = Storage.getCartItems().filter(function (c) { return c.userId === uid; }).reduce(function (s, c) { return s + Number(c.quantity || 1); }, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    } catch (e) {}
  };

  window.renderCart = async function () {
    var user = await currentUser();
    var container = document.getElementById('cartList');
    var totalEl = document.getElementById('cartTotal');
    var countEl = document.getElementById('cartCount');
    if (!container) return;

    var uid = user ? user.id : null;
    var items = uid ? Storage.getCartItems().filter(function (c) { return c.userId === uid; }).sort(function (a, b) { return (b.addedAt || 0) - (a.addedAt || 0); }) : [];

    if (countEl) countEl.textContent = items.length;
    if (!items.length) {
      if (totalEl) totalEl.textContent = 'R0.00';
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-cart-arrow-down"></i><h3>Your cart is empty</h3><p>Browse products and tap "Add to Cart" to start shopping</p></div>';
      return;
    }

    container.innerHTML = items.map(function (c) {
      var sub = (Number(c.price || 0) * Number(c.quantity || 1));
      return '<div class="online-user-card">' +
        '<div class="online-user-avatar-wrap"><div class="online-user-avatar initials" style="background:rgba(201,162,39,.2);color:#d4a853"><i class="fas fa-box"></i></div></div>' +
        '<div class="online-user-info">' +
          '<div class="online-user-name">' + esc(c.productName) + '</div>' +
          '<div class="online-user-loc">By ' + esc(c.authorName || 'Provider') + ' &middot; R' + esc(Number(c.price || 0).toFixed(2)) + ' each</div>' +
          '<div class="cart-qty">' +
            '<button class="btn btn-secondary btn-sm" onclick="changeCartQty(\'' + esc(c.id) + '\',-1)"><i class="fas fa-minus"></i></button>' +
            '<span style="margin:0 12px;font-weight:800">' + esc(c.quantity) + '</span>' +
            '<button class="btn btn-secondary btn-sm" onclick="changeCartQty(\'' + esc(c.id) + '\',1)"><i class="fas fa-plus"></i></button>' +
            '<span style="margin-left:16px;color:#d4a853;font-weight:800">R' + Number(sub).toFixed(2) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="online-user-actions">' +
          '<button class="btn btn-danger btn-sm" onclick="removeCartItem(\'' + esc(c.id) + '\')"><i class="fas fa-trash"></i> Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');

    var total = items.reduce(function (s, c) { return s + Number(c.price || 0) * Number(c.quantity || 1); }, 0);
    if (totalEl) totalEl.textContent = 'R' + total.toFixed(2);

    var walletNote = document.getElementById('cartWalletNote');
    if (walletNote && user) {
      var bal = (typeof getWalletBalance === 'function') ? getWalletBalance('user', user.id) : 0;
      walletNote.innerHTML = bal >= total
        ? '<span style="color:#10b981"><i class="fas fa-check-circle"></i> Wallet balance R' + bal.toFixed(2) + ' - enough to checkout</span>'
        : '<span style="color:#ef4444"><i class="fas fa-exclamation-circle"></i> Wallet balance R' + bal.toFixed(2) + ' - short R' + (total - bal).toFixed(2) + '. Please top up your wallet before checkout.</span>';
    }
  };

  window.changeCartQty = async function (id, delta) {
    var user = await currentUser();
    if (!user) return;
    var items = Storage.getCartItems();
    var item = items.find(function (c) { return c.id === id && c.userId === user.id; });
    if (!item) return;
    var p = Storage.getProducts().find(function (x) { return x.id === item.productId; });
    var maxStock = (p && p.stock != null) ? p.stock : Infinity;
    var newQty = Number(item.quantity || 1) + delta;
    if (newQty < 1) newQty = 1;
    if (delta > 0 && maxStock !== Infinity && newQty > maxStock) { showToast('Only ' + maxStock + ' available in stock', 'error'); return; }
    item.quantity = newQty;
    Storage.setCartItems(items);
    renderCart();
    refreshCartBadge();
  };

  window.removeCartItem = async function (id) {
    var user = await currentUser();
    if (!user) return;
    Storage.setCartItems(Storage.getCartItems().filter(function (c) { return c.id !== id; }));
    renderCart();
    refreshCartBadge();
  };

  window.clearCart = async function () {
    var user = await currentUser();
    if (!user) return;
    Storage.setCartItems(Storage.getCartItems().filter(function (c) { return c.userId !== user.id; }));
    renderCart();
    refreshCartBadge();
  };

  // ============================================
  // CHECKOUT - place orders for all cart items
  // ============================================
  window.checkoutCart = async function () {
    var user = await currentUser();
    if (!user) { window.location.href = 'login.html?next=index.html'; return; }
    var uid = user.id;
    var items = Storage.getCartItems().filter(function (c) { return c.userId === uid; });
    if (!items.length) { alert('Your cart is empty.'); return; }

    if (typeof getWalletBalance !== 'function' || typeof adjustWallet !== 'function' || typeof holdProductOrderEscrow !== 'function') { alert('Wallet services are unavailable right now.'); return; }

    // Refresh each cart item against current product stock/price.
    var lines = [];
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      var p = Storage.getProducts().find(function (x) { return x.id === c.productId; });
      if (!p) { alert('"' + (c.productName || 'product') + '" is no longer available.'); return; }
      if (p.stock != null && p.stock <= 0) { alert('"' + p.name + '" is out of stock.'); return; }
      if (p.stock != null && Number(c.quantity) > Number(p.stock)) { alert('Only ' + p.stock + ' of "' + p.name + '" available in stock.'); return; }
      var price = Number(p.price || 0);
      if (price <= 0) { alert('"' + p.name + '" has no price set.'); return; }
      lines.push({ item: c, product: p, price: price, sub: price * Number(c.quantity) });
    }

    var total = lines.reduce(function (s, l) { return s + l.sub; }, 0);
    var balance = getWalletBalance('user', uid);
    if (balance < total) {
      alert('Insufficient wallet balance. You need R' + total.toFixed(2) + ' for this checkout. Please top up your wallet first.');
      return;
    }

    if (!confirm('Checkout ' + lines.reduce(function (s, l) { return s + Number(l.item.quantity); }, 0) + ' item(s) for R' + total.toFixed(2) + '? Payment will be held in escrow until each order is completed.')) return;

    // Deduct wallet once for the whole cart.
    adjustWallet('user', uid, -total, 'product-purchase', 'Cart checkout payment held in escrow');

    var orders = Storage.getProductOrders();
    var stockList = Storage.getProducts();
    var created = [];
    for (var j = 0; j < lines.length; j++) {
      var l = lines[j];
      var orderId = 'po_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
      orders.push({
        id: orderId,
        productId: l.product.id,
        productName: l.product.name,
        productPrice: l.price,
        authorId: l.product.authorId,
        authorName: l.product.authorName,
        buyerId: uid,
        buyerName: (user.email || 'Buyer'),
        buyerEmail: user.email || '',
        quantity: Number(l.item.quantity),
        total: l.sub,
        status: 'pending',
        paymentStatus: 'held',
        paymentMethod: 'wallet',
        createdAt: Date.now()
      });
      holdProductOrderEscrow(orderId, uid, l.product.authorId, l.sub);
      // Generate invoice for this order
      if (typeof generateInvoice === 'function') {
        generateInvoice({
          type: 'product', sourceId: orderId,
          buyerId: uid, buyerName: user.email || 'Buyer', buyerEmail: user.email || '',
          sellerId: l.product.authorId, sellerName: l.product.authorName || 'Provider',
          items: [{ description: l.product.name || 'Product', quantity: Number(l.item.quantity), unitPrice: l.price, total: l.sub }],
          shippingCost: 0, status: 'paid'
        });
      }
      stockList = stockList.map(function (x) {
        if (x.id === l.product.id && x.stock != null) { var ns = Math.max(0, Number(x.stock) - Number(l.item.quantity)); return Object.assign({}, x, { stock: ns }); }
        return x;
      });
      created.push({ name: l.product.name, total: l.sub });
    }
    Storage.setProductOrders(orders);
    Storage.setProducts(stockList);
    // Clear the cart now that checkout succeeded.
    Storage.setCartItems(Storage.getCartItems().filter(function (c) { return c.userId !== uid; }));

    refreshCartBadge();
    var msg = 'Payment of R' + total.toFixed(2) + ' received for ' + created.length + ' order(s). Funds are held in escrow and released to providers once each order is completed.';
    alert(msg);
    navigateTo('my-purchases');
    renderMyPurchases();
  };

  // ============================================
  // MY PURCHASES - buyer's own product orders
  // ============================================
  window.renderMyPurchases = async function () {
    var user = await currentUser();
    var container = document.getElementById('myPurchasesList');
    var countEl = document.getElementById('myPurchasesCount');
    if (!container) return;
    var uid = user ? user.id : null;
    var list = uid ? Storage.getProductOrders().filter(function (o) { return (o.buyerId || '') === uid; }).sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); }) : [];
    if (countEl) countEl.textContent = list.length;
    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-box-open"></i><h3>No purchases yet</h3><p>Products you order, and their escrow status, will show up here</p></div>';
      return;
    }
    container.innerHTML = list.map(function (o) {
      var st = {
        pending: ['Processing', '#f59e0b'],
        shipped: ['Shipped', '#3b82f6'],
        completed: ['Completed', '#10b981'],
        cancelled: ['Cancelled', '#ef4444']
      }[o.status] || [o.status || 'Pending', '#a99c7e'];
      var escrow = Storage.getEscrowFunds().find(function (e) { return e.productOrderId === o.id; });
      var escInfo = escrow ? {
        held: ['Held in escrow', '#f59e0b'],
        released: ['Released to provider', '#10b981'],
        refunded: ['Refunded', '#ef4444']
      }[escrow.status] || [escrow.status, '#a99c7e'] : ['-', '#a99c7e'];
      // Shipping status
      var ship = Storage.getShipping().find(function (s) { return s.productOrderId === o.id; });
      var shipInfo = ship ? ({
        pending: ['Awaiting shipping payment', '#f59e0b'],
        paid: ['Paid - awaiting dispatch', '#3b82f6'],
        shipped: ['In transit', '#8b5cf6'],
        delivered: ['Delivered', '#10b981']
      }[ship.shippingStatus] || [ship.shippingStatus, '#a99c7e']) : null;
      var actions = '';
      if (ship && ship.shippingStatus === 'pending') {
        actions += '<button class="btn btn-primary btn-sm" onclick="payShipping(\'' + esc(o.id) + '\')"><i class="fas fa-truck"></i> Pay Shipping' + (ship.cost > 0 ? ' R' + Number(ship.cost).toFixed(2) : '') + '</button>';
      } else if (ship && ship.shippingStatus === 'shipped') {
        actions += '<button class="btn btn-primary btn-sm" onclick="confirmReceipt(\'' + esc(o.id) + '\')"><i class="fas fa-check"></i> Confirm Receipt</button>';
      }
      if (typeof generateInvoice === 'function') {
        var myInv = Storage.getInvoices().find(function (i) { return i.sourceId === o.id && i.type === 'product'; });
        if (myInv) {
          actions += '<button class="btn btn-secondary btn-sm" onclick="viewInvoice(\'' + esc(myInv.id) + '\')"><i class="fas fa-file-invoice"></i> Invoice</button>';
        }
      }
      return '<div class="profile-card">' +
        '<div class="profile-header">' +
          '<div class="profile-avatar" style="background:rgba(201,162,39,.2)"><i class="fas fa-box"></i></div>' +
          '<div class="profile-info">' +
            '<h4>' + esc(o.productName || 'Product') + ' <span class="mini-tag" style="background:' + st[1] + '18;color:' + st[1] + '"><i class="fas fa-circle"></i> ' + st[0] + '</span>' +
            (shipInfo ? ' <span class="mini-tag" style="background:' + shipInfo[1] + '18;color:' + shipInfo[1] + '"><i class="fas fa-truck"></i> ' + shipInfo[0] + '</span>' : '') +
            '</h4>' +
            '<div class="profile-meta">From ' + esc(o.authorName || 'Provider') + ' &middot; Qty ' + Number(o.quantity || 1) + '</div>' +
            '<div class="profile-meta" style="margin-top:4px"><span class="mini-tag" style="background:' + escInfo[1] + '18;color:' + escInfo[1] + '">' + escInfo[0] + '</span></div>' +
          '</div>' +
          '<div class="profile-actions" style="flex-direction:column;align-items:flex-end;gap:6px">' +
            '<div class="profile-meta" style="color:#c9a227;font-weight:800">R' + esc(Number(o.total || 0).toFixed(2)) + '</div>' +
            (actions ? '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">' + actions + '</div>' : '') +
          '</div>' +
        '</div>' +
        (ship ? '<div id="shippingDetails_' + esc(o.id) + '"></div>' : '') +
      '</div>';
    }).join('');
    // Render shipping detail panels
    list.forEach(function (o) {
      if (typeof renderShippingDetails === 'function') {
        renderShippingDetails(o.id);
      }
    });
  };


  function escrowRecordForOrder(orderId) {
    return Storage.getEscrowFunds().find(function (e) { return e.productOrderId === orderId; });
  }

  function holdProductOrderEscrow(orderId, buyerId, providerId, amount) {
    var escrows = Storage.getEscrowFunds();
    escrows.push({
      id: generateId(),
      productOrderId: orderId,
      fromType: 'user',
      fromId: buyerId,
      payeeType: 'provider',
      payeeId: providerId,
      amount: amount,
      status: 'held',
      createdAt: new Date().toISOString()
    });
    Storage.setEscrowFunds(escrows);
    adjustWalletHeld('user', buyerId, amount, 'product-escrow', 'Payment of R' + Number(amount).toFixed(2) + ' held in escrow for product order', { productOrderId: orderId });
  }

  function releaseProductOrderEscrow(order, amount) {
    var escrows = Storage.getEscrowFunds();
    var escrow = escrows.find(function (e) { return e.productOrderId === order.id; });
    if (!escrow) {
      escrow = { id: generateId(), productOrderId: order.id, fromType: 'user', fromId: order.buyerId, payeeType: 'provider', payeeId: order.authorId, amount: amount, status: 'held', createdAt: new Date().toISOString() };
      escrows.push(escrow);
    }
    if (escrow.status !== 'released') {
      escrow.status = 'released';
      escrow.releasedAt = new Date().toISOString();
      Storage.setEscrowFunds(escrows);
      adjustWalletHeld('user', escrow.fromId, -amount, 'product-escrow-released', 'Escrow released for product order', { productOrderId: order.id });
      adjustWallet('provider', order.authorId, amount, 'product-sale', 'Sale of "' + (order.productName || 'product') + '" released from escrow', { productOrderId: order.id });
    }
  }

  function refundProductOrderEscrow(order, amount) {
    var escrows = Storage.getEscrowFunds();
    var escrow = escrows.find(function (e) { return e.productOrderId === order.id; });
    if (escrow && escrow.status === 'held') {
      escrow.status = 'refunded';
      escrow.refundedAt = new Date().toISOString();
      Storage.setEscrowFunds(escrows);
      adjustWalletHeld('user', escrow.fromId, -amount, 'product-escrow-released', 'Escrow returned for cancelled product order', { productOrderId: order.id });
      adjustWallet('user', order.buyerId, amount, 'product-refund', 'Refund for order of "' + (order.productName || 'product') + '"', { productOrderId: order.id });
      return true;
    }
    return false;
  }

  // Called whenever an order transitions status. Releases or refunds escrow.
  function settleProductOrderEscrow(order) {
    if (!order) return;
    // Only settle orders that were paid via the wallet escrow system.
    if (order.paymentMethod !== 'wallet' && order.paymentStatus !== 'held') return;
    var total = Number(order.total || 0);
    if (total <= 0) return;
    if (order.status === 'completed') {
      releaseProductOrderEscrow(order, total);
    } else if (order.status === 'cancelled') {
      refundProductOrderEscrow(order, total);
    }
  }

  // ============================================
  // PROVIDER - products CRUD
  // ============================================
  async function myAuthorId() {
    var a = await currentAuthor();
    return a.authorId;
  }

  window.renderProviderProducts = async function () {
    var uid = await myAuthorId();
    var list = Storage.getProducts().filter(function (p) { return (p.authorId || '') === uid; });
    var f = document.getElementById('providerProductsFilter') ? document.getElementById('providerProductsFilter').value : 'all';
    if (f !== 'all') list = list.filter(function (p) { return p.status === f; });

    var container = document.getElementById('providerProductsList');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-box-open"></i><h3>No products yet</h3><p>Add your first product to start selling on 2k2</p></div>';
      return;
    }
    container.innerHTML = list.map(function (p) {
      var ci = catInfo(p.category);
      return '<div class="profile-card">' +
        '<div class="profile-header">' +
          '<div class="profile-avatar">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : '<i class="fas ' + ci.icon + '"></i>') + '</div>' +
          '<div class="profile-info"><h4>' + esc(p.name) + '</h4><div class="profile-meta">' + esc(ci.label) + '</div></div>' +
          '<div class="profile-meta" style="color:#c9a227;font-weight:800">R' + esc(Number(p.price || 0).toFixed(2)) + '</div>' +
        '</div>' +
        '<div class="profile-actions">' +
          '<span class="mini-tag" style="background:rgba(16,185,129,.15);color:#10b981">Stock: ' + esc(p.stock == null ? 0 : p.stock) + '</span>' +
          '<button class="btn btn-secondary btn-sm" onclick="editProduct(\'' + esc(p.id) + '\')"><i class="fas fa-edit"></i> Edit</button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteProduct(\'' + esc(p.id) + '\')"><i class="fas fa-trash"></i> Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  };

  window.filterProviderProducts = function () { renderProviderProducts(); };

  window.resetProductForm = function () {
    var f = document.getElementById('productForm'); if (f) f.reset();
    var id = document.getElementById('productId'); if (id) id.value = '';
    var title = document.getElementById('productFormTitle');
    if (title) title.textContent = 'Add Product';
    var btn = document.getElementById('productSubmitBtn');
    if (btn) btn.textContent = 'Publish Product';
    var prev = document.getElementById('productCoverPreview');
    if (prev) prev.innerHTML = '<i class="fas fa-camera"></i><span>Click to upload</span>';
  };

  function getProductCover() {
    var prev = document.getElementById('productCoverPreview');
    if (!prev) return '';
    var img = prev.querySelector('img');
    return img ? img.getAttribute('src') : '';
  }

  function setProductCover(src) {
    var prev = document.getElementById('productCoverPreview');
    if (prev) prev.innerHTML = src ? '<img src="' + src + '" alt="">' : '<i class="fas fa-camera"></i><span>Click to upload</span>';
  }

  window.handleProductSubmit = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    var id = (document.getElementById('productId') ? document.getElementById('productId').value : '') || '';
    var name = (document.getElementById('productName') ? document.getElementById('productName').value : '').trim();
    var category = document.getElementById('productCategory') ? document.getElementById('productCategory').value : 'other';
    var price = parseFloat(document.getElementById('productPrice') ? document.getElementById('productPrice').value : 0) || 0;
    var stock = parseInt(document.getElementById('productStock') ? document.getElementById('productStock').value : 0, 10) || 0;
    var description = (document.getElementById('productDescription') ? document.getElementById('productDescription').value : '').trim();
    var coverSrc = getProductCover();

    if (!name) { alert('Please enter a product name.'); return; }
    if (id === '') {
      var a = await currentAuthor();
      var products = Storage.getProducts();
      products.push({
        id: 'prod_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8),
        name: name,
        category: category,
        price: price,
        stock: stock,
        description: description,
        photo: coverSrc,
        gallery: [],
        authorId: a.authorId,
        authorName: a.authorName,
        status: 'active',
        createdAt: Date.now()
      });
      markPendingApproval(products[products.length - 1]);
      Storage.setProducts(products);
    } else {
      var list = Storage.getProducts().map(function (p) {
        if (p.id === id) return Object.assign({}, p, { name: name, category: category, price: price, stock: stock, description: description, photo: coverSrc || p.photo });
        return p;
      });
      for (var i2 = 0; i2 < list.length; i2++) {
        if (list[i2].id === id) markPendingApproval(list[i2]);
      }
      Storage.setProducts(list);
    }
    navigateTo('provider-products');
    renderProviderProducts();
  };

  window.editProduct = async function (id) {
    var p = Storage.getProducts().find(function (x) { return x.id === id; });
    if (!p) { alert('Product not found.'); return; }
    var uid = await myAuthorId();
    if ((p.authorId || '') !== uid) { alert('You can only manage your own products.'); return; }
    navigateTo('provider-product-create');
    renderApprovalBanner('page-provider-product-create', p, 'Product', 'provider-product-create');
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name || '';
    document.getElementById('productCategory').value = p.category || 'other';
    document.getElementById('productPrice').value = p.price || '';
    document.getElementById('productStock').value = p.stock == null ? '' : p.stock;
    document.getElementById('productDescription').value = p.description || '';
    var title = document.getElementById('productFormTitle'); if (title) title.textContent = 'Edit Product';
    var btn = document.getElementById('productSubmitBtn'); if (btn) btn.textContent = 'Update Product';
    setProductCover(p.photo || '');
  };

  window.deleteProduct = async function (id) {
    var p = Storage.getProducts().find(function (x) { return x.id === id; });
    if (!p) return;
    var uid = await myAuthorId();
    if ((p.authorId || '') !== uid) { alert('You can only delete your own products.'); return; }
    if (!confirm('Delete this product? This cannot be undone.')) return;
    Storage.setProducts(Storage.getProducts().filter(function (x) { return x.id !== id; }));
    renderProviderProducts();
  };

  // ============================================
  // PROVIDER - orders for their products
  // ============================================
  window.renderProviderOrders = async function () {
    var uid = await myAuthorId();
    var list = Storage.getProductOrders().filter(function (o) { return (o.authorId || '') === uid; })
      .sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });

    var container = document.getElementById('providerOrdersList');
    if (!container) return;
    var pending = list.filter(function (o) { return o.status === 'pending'; }).length;

    var head = document.getElementById('providerOrdersCount');
    if (head) head.textContent = list.length;

    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-inbox"></i><h3>No orders yet</h3><p>Orders for your products will appear here</p></div>';
      return;
    }
    var badges = { pending: 'rgba(245,158,11,.15);color:#f59e0b', processing: 'rgba(59,130,246,.15);color:#3b82f6', shipped: 'rgba(16,185,129,.15);color:#10b981', completed: 'rgba(16,185,129,.15);color:#10b981', cancelled: 'rgba(239,68,68,.15);color:#ef4444' };
    container.innerHTML = '<div class="admin-summary-cards" style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:140px;background:#17140e;border:1px solid #c9a227;border-radius:12px;padding:16px"><div style="color:#a99c7e;font-size:12px">Total Orders</div><div style="font-size:26px;font-weight:800;color:#fdf9ef">' + esc(list.length) + '</div></div>' +
        '<div style="flex:1;min-width:140px;background:#17140e;border:1px solid #f59e0b;border-radius:12px;padding:16px"><div style="color:#a99c7e;font-size:12px">Pending</div><div style="font-size:26px;font-weight:800;color:#f59e0b">' + esc(pending) + '</div></div>' +
      '</div>' +
      list.map(function (o) {
        var bg = badges[o.status] || badges.pending;
        var ship = Storage.getShipping().find(function (s) { return s.productOrderId === o.id; });
        var shipInfo = ship ? ({
          pending: ['Awaiting shipping payment', '#f59e0b'],
          paid: ['Paid - awaiting dispatch', '#3b82f6'],
          shipped: ['In transit', '#8b5cf6'],
          delivered: ['Delivered', '#10b981']
        }[ship.shippingStatus] || [ship.shippingStatus, '#a99c7e']) : null;
        var shipAction = '';
        if (ship && ship.shippingStatus === 'paid' && o.status !== 'shipped' && o.status !== 'completed') {
          shipAction = '<button class="btn btn-primary btn-sm" onclick="markAsShipped(\'' + esc(o.id) + '\')"><i class="fas fa-paper-plane"></i> Mark Shipped</button>';
        }
        var invBtn = '';
        if (typeof generateInvoice === 'function') {
          var myInv = Storage.getInvoices().find(function (i) { return i.sourceId === o.id && i.type === 'product'; });
          if (myInv) invBtn = '<button class="btn btn-secondary btn-sm" onclick="viewInvoice(\'' + esc(myInv.id) + '\')"><i class="fas fa-file-invoice"></i> Invoice</button>';
        }
        return '<div class="profile-card">' +
          '<div class="profile-header">' +
            '<div class="profile-avatar"><i class="fas fa-box"></i></div>' +
            '<div class="profile-info"><h4>' + esc(o.productName || 'Product') +
              (shipInfo ? ' <span class="mini-tag" style="background:' + shipInfo[1] + '18;color:' + shipInfo[1] + '"><i class="fas fa-truck"></i> ' + shipInfo[0] + '</span>' : '') +
              '</h4>' +
              '<div class="profile-meta">Buyer: ' + esc(o.buyerName || o.buyerEmail || 'Buyer') + '</div>' +
              '<div class="profile-meta">Qty: ' + esc(o.quantity) + ' &middot; ' + new Date(o.createdAt).toLocaleString() + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="color:#d4a853;font-weight:800">R' + esc(Number(o.total || 0).toFixed(2)) + '</div>' +
              '<span class="mini-tag" style="' + bg + '">' + esc(o.status.charAt(0).toUpperCase() + o.status.slice(1)) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="profile-actions"><span style="color:#a99c7e;font-size:12px">Order #' + esc(o.id.slice(-8).toUpperCase()) + '</span>' +
            '<button class="btn btn-secondary btn-sm" onclick="openShippingModal(\'' + esc(o.id) + '\')"><i class="fas fa-truck"></i> Shipping</button>' +
            '<button class="btn btn-secondary btn-sm" onclick="providerSetOrderStatus(\'' + esc(o.id) + '\',\'processing\')">Mark Processing</button>' +
            '<button class="btn btn-primary btn-sm" onclick="providerSetOrderStatus(\'' + esc(o.id) + '\',\'completed\')">Mark Completed</button>' +
            shipAction + invBtn +
          '</div>' +
        '</div>';
      }).join('');
  };

  window.providerSetOrderStatus = async function (id, status) {
    var orders = Storage.getProductOrders().map(function (o) { return o.id === id ? Object.assign({}, o, { status: status }) : o; });
    Storage.setProductOrders(orders);
    var changed = orders.find(function (o) { return o.id === id; });
    if (changed) settleProductOrderEscrow(changed);
    renderProviderOrders();
  };

  // ============================================
  // ADMIN - manage all products + pending orders
  // ============================================
  window.renderAdminProducts = function () {
    var list = Storage.getProducts().slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
    var afSel = document.getElementById('adminProductsCategoryFilter');
    var af = afSel ? afSel.value : 'all';
    if (af && af !== 'all') list = list.filter(function (p) { return p.category === af; });
    var container = document.getElementById('adminProductsList');
    if (!container) return;
    var count = document.getElementById('adminProductsCount');
    if (count) count.textContent = list.length;

    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-box-open"></i><h3>No products</h3><p>Providers have not listed any products yet</p></div>';
      return;
    }
    container.innerHTML = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      '<th>Product</th><th>Category</th><th>Provider</th><th>Price</th><th>Stock</th><th>Status</th><th class="admin-actions">Actions</th>' +
      '</tr></thead><tbody>' +
      list.map(function (p) {
        var ci = catInfo(p.category);
        return '<tr>' +
          '<td>' + (p.photo ? '<img src="' + esc(p.photo) + '" style="width:36px;height:36px;object-fit:cover;border-radius:8px;vertical-align:middle;margin-right:8px" alt="">' : '') + esc(p.name || 'Untitled') + '</td>' +
          '<td>' + esc(ci.label) + '</td>' +
          '<td>' + esc(p.authorName || '-') + '</td>' +
          '<td style="color:#d4a853;font-weight:700">R' + esc(Number(p.price || 0).toFixed(2)) + '</td>' +
          '<td>' + esc(p.stock == null ? 0 : p.stock) + '</td>' +
          '<td><span class="mini-tag" style="background:rgba(16,185,129,.15);color:#10b981">' + esc(p.status || 'active') + '</span></td>' +
          '<td class="admin-actions">' +
            '<button class="btn btn-xs btn-secondary" onclick="adminToggleProductStatus(\'' + esc(p.id) + '\')">' + (p.status === 'archived' ? 'Activate' : 'Archive') + '</button>' +
            '<button class="btn btn-xs btn-danger" onclick="adminDeleteProduct(\'' + esc(p.id) + '\')">Delete</button>' +
          '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  };

  window.adminToggleProductStatus = function (id) {
    Storage.setProducts(Storage.getProducts().map(function (p) { return p.id === id ? Object.assign({}, p, { status: p.status === 'archived' ? 'active' : 'archived' }) : p; }));
    renderAdminProducts();
  };

  window.adminDeleteProduct = function (id) {
    if (!confirm('Delete this product permanently?')) return;
    Storage.setProducts(Storage.getProducts().filter(function (p) { return p.id !== id; }));
    renderAdminProducts();
  };

  window.viewAdminProduct = function (id) {
    var p = Storage.getProducts().find(function (x) { return x.id === id; });
    if (!p) return;
    var ci = catInfo(p.category);
    alert('Product: ' + p.name + '\nCategory: ' + ci.label + '\nProvider: ' + p.authorName + '\nPrice: R' + Number(p.price || 0).toFixed(2) + '\nStock: ' + (p.stock == null ? 0 : p.stock) + '\n\nDescription:\n' + (p.description || ''));
  };

  window.renderAdminProductOrders = function () {
    var list = Storage.getProductOrders().slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
    var container = document.getElementById('adminProductOrdersList');
    if (!container) return;
    var count = document.getElementById('adminProductOrdersCount');
    if (count) count.textContent = list.length;
    var pending = list.filter(function (o) { return o.status === 'pending'; }).length;
    var pCount = document.getElementById('adminPendingOrdersCount');
    if (pCount) pCount.textContent = pending;

    if (!list.length) {
      container.innerHTML = '<div class="forum-empty"><i class="fas fa-inbox"></i><h3>No orders</h3><p>No product orders have been placed yet</p></div>';
      return;
    }
    var badges = { pending: 'rgba(245,158,11,.15);color:#f59e0b', processing: 'rgba(59,130,246,.15);color:#3b82f6', shipped: 'rgba(16,185,129,.15);color:#10b981', completed: 'rgba(16,185,129,.15);color:#10b981', cancelled: 'rgba(239,68,68,.15);color:#ef4444' };
    container.innerHTML = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      '<th>Order</th><th>Product</th><th>Buyer</th><th>Provider</th><th>Total</th><th>Status</th><th class="admin-actions">Actions</th>' +
      '</tr></thead><tbody>' +
      list.map(function (o) {
        var bg = badges[o.status] || badges.pending;
        return '<tr>' +
          '<td>#' + esc(o.id.slice(-8).toUpperCase()) + '<div style="color:#a99c7e;font-size:11px">' + new Date(o.createdAt).toLocaleString() + '</div></td>' +
          '<td>' + esc(o.productName || '-') + ' &times; ' + esc(o.quantity) + '</td>' +
          '<td>' + esc(o.buyerName || o.buyerEmail || '-') + '</td>' +
          '<td>' + esc(o.authorName || '-') + '</td>' +
          '<td style="color:#d4a853;font-weight:700">R' + esc(Number(o.total || 0).toFixed(2)) + '</td>' +
          '<td><span class="mini-tag" style="' + bg + '">' + esc(o.status.charAt(0).toUpperCase() + o.status.slice(1)) + '</span></td>' +
          '<td class="admin-actions">' +
            '<select class="admin-status-select" style="background:#0f0d09;color:#fdf9ef;border:1px solid #3a3527;border-radius:6px;padding:4px 6px" onchange="adminSetOrderStatus(\'' + esc(o.id) + '\',this.value)">' +
              ['pending','processing','shipped','completed','cancelled'].map(function (s) { return '<option value="' + s + '" ' + (s === o.status ? 'selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>'; }).join('') +
            '</select>' +
          '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  };

  window.adminSetOrderStatus = function (id, status) {
    var orders = Storage.getProductOrders().map(function (o) { return o.id === id ? Object.assign({}, o, { status: status }) : o; });
    Storage.setProductOrders(orders);
    var changed = orders.find(function (o) { return o.id === id; });
    if (changed) settleProductOrderEscrow(changed);
    renderAdminProductOrders();
  };

  // populate category dropdowns and filter tabs on load
  function populateCategorySelects() {
    ['#productCategory', '#productsCategoryFilter', '#adminProductsCategoryFilter'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el || el.querySelectorAll('option').length > 1) return;
      Object.keys(PRODUCT_CATEGORIES).forEach(function (k) {
        var opt = document.createElement('option');
        opt.value = k; opt.textContent = PRODUCT_CATEGORIES[k].label;
        el.appendChild(opt);
      });
    });
    var tabs = document.getElementById('productsFilterTabs');
    if (tabs && tabs.querySelectorAll('.filter-tab[data-cat]').length === 0) {
      var allBtn = tabs.querySelector('.filter-tab.active');
      if (allBtn) allBtn.setAttribute('data-cat', 'all');
      Object.keys(PRODUCT_CATEGORIES).forEach(function (k) {
        var btn = document.createElement('button');
        btn.className = 'filter-tab';
        btn.setAttribute('data-cat', k);
        btn.setAttribute('onclick', 'filterProductsCategory(\'' + k + '\')');
        btn.innerHTML = '<i class="fas ' + PRODUCT_CATEGORIES[k].icon + '"></i> ' + esc(PRODUCT_CATEGORIES[k].label);
        tabs.appendChild(btn);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateCategorySelects);
  } else {
    populateCategorySelects();
  }
})();
