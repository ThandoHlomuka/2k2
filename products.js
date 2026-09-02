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
    fashion: { label: 'Fashion & Apparel', icon: 'fa-shirt' },
    electronics: { label: 'Electronics & Gadgets', icon: 'fa-plug' },
    home: { label: 'Home & Living', icon: 'fa-house' },
    beauty: { label: 'Beauty & Care', icon: 'fa-spa' },
    food: { label: 'Food & Drink', icon: 'fa-utensils' },
    health: { label: 'Wellness & Health', icon: 'fa-heart-pulse' },
    collectibles: { label: 'Art & Collectibles', icon: 'fa-gem' },
    services_goods: { label: 'Services & Handmade', icon: 'fa-hand-holding-heart' },
    other: { label: 'Other', icon: 'fa-box' }
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
  window.renderProductsBrowser = function () {
    var list = Storage.getProducts().slice().filter(function (p) { return isApprovedPublic(p); });
    var q = (document.getElementById('productsSearch') ? document.getElementById('productsSearch').value : '').toLowerCase();
    var cat = document.getElementById('productsCategoryFilter') ? document.getElementById('productsCategoryFilter').value : 'all';
    var sort = document.getElementById('productsSort') ? document.getElementById('productsSort').value : 'newest';

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
          '<div class="directory-card-meta"><i class="fas ' + ci.icon + '"></i> ' + esc(ci.label) + '</div>' +
          '<div class="directory-card-meta"><i class="fas fa-user"></i> ' + esc(p.authorName || 'Provider') + '</div>' +
          '<div class="directory-card-price" style="margin:8px 0;font-weight:800;color:#c9a227">R' + esc(Number(p.price || 0).toFixed(2)) + '</div>' +
          '<div class="directory-card-bio">' + esc((p.description || '').substring(0, 90)) + '</div>' +
        '</div>' +
        '<div class="directory-card-actions">' +
          '<button class="btn btn-primary btn-sm" onclick="viewProduct(\'' + esc(p.id) + '\')"><i class="fas fa-eye"></i> View</button>' +
        '</div>' +
      '</div>';
    }).join('');
  };

  window.filterProductsCategory = function () { renderProductsBrowser(); };

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
          '<button class="btn btn-primary" onclick="placeProductOrder(\'' + esc(p.id) + '\')" ' + ((p.stock != null && p.stock <= 0) ? 'disabled' : '') + '><i class="fas fa-cart-plus"></i> Buy Now</button>' +
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

    var quantity = 1;
    var orders = Storage.getProductOrders();
    orders.push({
      id: 'po_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8),
      productId: p.id,
      productName: p.name,
      productPrice: Number(p.price || 0),
      authorId: p.authorId,
      authorName: p.authorName,
      buyerId: user.id,
      buyerName: (user.email || 'Buyer'),
      buyerEmail: user.email || '',
      quantity: quantity,
      total: Number(p.price || 0) * quantity,
      status: 'pending',
      createdAt: Date.now()
    });
    Storage.setProductOrders(orders);

    var list = Storage.getProducts().map(function (x) {
      if (x.id === p.id && x.stock != null) { var s = Math.max(0, Number(x.stock) - quantity); return Object.assign({}, x, { stock: s }); }
      return x;
    });
    Storage.setProducts(list);

    alert('Order placed! The provider has been notified. Track it under your orders.');
    navigateTo('products-directory');
  };

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
        return '<div class="profile-card">' +
          '<div class="profile-header">' +
            '<div class="profile-avatar"><i class="fas fa-box"></i></div>' +
            '<div class="profile-info"><h4>' + esc(o.productName || 'Product') + '</h4>' +
              '<div class="profile-meta">Buyer: ' + esc(o.buyerName || o.buyerEmail || 'Buyer') + '</div>' +
              '<div class="profile-meta">Qty: ' + esc(o.quantity) + ' &middot; ' + new Date(o.createdAt).toLocaleString() + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="color:#d4a853;font-weight:800">R' + esc(Number(o.total || 0).toFixed(2)) + '</div>' +
              '<span class="mini-tag" style="' + bg + '">' + esc(o.status.charAt(0).toUpperCase() + o.status.slice(1)) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="profile-actions"><span style="color:#a99c7e;font-size:12px">Order #' + esc(o.id.slice(-8).toUpperCase()) + '</span>' +
            '<button class="btn btn-secondary btn-sm" onclick="providerSetOrderStatus(\'' + esc(o.id) + '\',\'processing\')">Mark Processing</button>' +
            '<button class="btn btn-primary btn-sm" onclick="providerSetOrderStatus(\'' + esc(o.id) + '\',\'completed\')">Mark Completed</button>' +
          '</div>' +
        '</div>';
      }).join('');
  };

  window.providerSetOrderStatus = async function (id, status) {
    var orders = Storage.getProductOrders().map(function (o) { return o.id === id ? Object.assign({}, o, { status: status }) : o; });
    Storage.setProductOrders(orders);
    renderProviderOrders();
  };

  // ============================================
  // ADMIN - manage all products + pending orders
  // ============================================
  window.renderAdminProducts = function () {
    var list = Storage.getProducts().slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
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
    Storage.setProductOrders(Storage.getProductOrders().map(function (o) { return o.id === id ? Object.assign({}, o, { status: status }) : o; }));
    renderAdminProductOrders();
  };

  // populate category dropdowns on load
  function populateCategorySelects() {
    ['#productCategory', '#productsCategoryFilter'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el || el.querySelectorAll('option').length > 1) return;
      Object.keys(PRODUCT_CATEGORIES).forEach(function (k) {
        var opt = document.createElement('option');
        opt.value = k; opt.textContent = PRODUCT_CATEGORIES[k].label;
        el.appendChild(opt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateCategorySelects);
  } else {
    populateCategorySelects();
  }
})();
