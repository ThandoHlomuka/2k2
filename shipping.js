// =============================================
// 2k2 - Shipping Module
// Loaded AFTER script.js and products.js.
// Manages post-purchase shipping for physical
// products: provider adds cost/carrier/tracking,
// buyer pays shipping, provider ships, buyer
// confirms receipt -> escrow released.
// =============================================
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  async function currentUser() {
    try {
      if (window._2k2 && _2k2.Auth && _2k2.Auth.currentUser) return await _2k2.Auth.currentUser();
    } catch (e) {}
    return null;
  }

  // ============================================
  // PROVIDER - add shipping details to an order
  // ============================================
  window.openShippingModal = function (orderId) {
    var order = Storage.getProductOrders().find(function (o) { return o.id === orderId; });
    if (!order) return;
    var existing = Storage.getShipping().find(function (s) { return s.productOrderId === orderId; });
    document.getElementById('shippingOrderId').value = orderId;
    document.getElementById('shippingAddress').value = existing ? (existing.address || '') : '';
    document.getElementById('shippingCost').value = existing ? (existing.cost || '') : '';
    document.getElementById('shippingCarrier').value = existing ? (existing.carrier || '') : '';
    document.getElementById('shippingTracking').value = existing ? (existing.trackingNumber || '') : '';
    document.getElementById('shippingNotes').value = existing ? (existing.notes || '') : '';
    document.getElementById('shippingModal').classList.add('active');
  };

  window.closeShippingModal = function () {
    document.getElementById('shippingModal').classList.remove('active');
  };

  window.saveShippingDetails = function (e) {
    e.preventDefault();
    var orderId = document.getElementById('shippingOrderId').value;
    var address = document.getElementById('shippingAddress').value.trim();
    var cost = parseFloat(document.getElementById('shippingCost').value) || 0;
    var carrier = document.getElementById('shippingCarrier').value.trim();
    var tracking = document.getElementById('shippingTracking').value.trim();
    var notes = document.getElementById('shippingNotes').value.trim();

    if (!orderId) return;
    if (!address) { alert('Please enter a shipping address.'); return; }
    if (cost < 0) { alert('Shipping cost cannot be negative.'); return; }

    var shipments = Storage.getShipping();
    var idx = shipments.findIndex(function (s) { return s.productOrderId === orderId; });
    var record = {
      id: idx >= 0 ? shipments[idx].id : 'ship_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8),
      productOrderId: orderId,
      address: address,
      cost: cost,
      carrier: carrier,
      trackingNumber: tracking,
      notes: notes,
      shippingStatus: idx >= 0 ? shipments[idx].shippingStatus : 'pending',
      createdAt: idx >= 0 ? shipments[idx].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      shipments[idx] = record;
    } else {
      shipments.push(record);
    }
    Storage.setShipping(shipments);
    closeShippingModal();
    showToast('Shipping details saved. Buyer will be notified to pay shipping cost.');
    // Re-render provider orders if visible
    if (typeof renderProviderOrders === 'function') renderProviderOrders();
  };

  // Provider marks as shipped
  window.markAsShipped = function (orderId) {
    var shipments = Storage.getShipping();
    var s = shipments.find(function (x) { return x.productOrderId === orderId; });
    if (!s) { alert('No shipping details found for this order.'); return; }
    if (!s.trackingNumber) { alert('Please add a tracking number before marking as shipped.'); return; }
    s.shippingStatus = 'shipped';
    s.shippedAt = new Date().toISOString();
    s.updatedAt = new Date().toISOString();
    Storage.setShipping(shipments);
    // Update order status
    var orders = Storage.getProductOrders().map(function (o) {
      return o.id === orderId ? Object.assign({}, o, { status: 'shipped' }) : o;
    });
    Storage.setProductOrders(orders);
    showToast('Order marked as shipped!');
    if (typeof renderProviderOrders === 'function') renderProviderOrders();
  };

  // ============================================
  // BUYER - pay shipping cost
  // ============================================
  window.payShipping = async function (orderId) {
    var user = await currentUser();
    if (!user) { window.location.href = 'login.html?next=index.html'; return; }

    var shipment = Storage.getShipping().find(function (s) { return s.productOrderId === orderId; });
    if (!shipment) { alert('No shipping details available for this order.'); return; }

    var order = Storage.getProductOrders().find(function (o) { return o.id === orderId; });
    if (!order) { alert('Order not found.'); return; }

    if (shipment.shippingStatus === 'paid' || shipment.shippingStatus === 'shipped' || shipment.shippingStatus === 'delivered') {
      alert('Shipping has already been paid for this order.');
      return;
    }

    var cost = Number(shipment.cost || 0);
    if (cost <= 0) {
      // No shipping cost — mark as paid directly
      shipment.shippingStatus = 'paid';
      shipment.paidAt = new Date().toISOString();
      shipment.updatedAt = new Date().toISOString();
      Storage.setShipping(Storage.getShipping());
      showToast('No shipping cost. Ready for dispatch.');
      renderMyPurchases();
      return;
    }

    var balance = getWalletBalance('user', user.id);
    if (balance < cost) {
      alert('Insufficient wallet balance for shipping. You need R' + cost.toFixed(2) + '. Please top up your wallet.');
      return;
    }

    if (!confirm('Pay R' + cost.toFixed(2) + ' shipping for this order?')) return;

    // Direct payment to provider (no escrow for shipping)
    adjustWallet('user', user.id, -cost, 'shipping-payment', 'Shipping payment for order #' + orderId, { productOrderId: orderId });
    adjustWallet('provider', order.authorId, cost, 'shipping-received', 'Shipping payment received for order #' + orderId, { productOrderId: orderId });

    shipment.shippingStatus = 'paid';
    shipment.paidAt = new Date().toISOString();
    shipment.updatedAt = new Date().toISOString();
    Storage.setShipping(Storage.getShipping());

    showToast('Shipping payment of R' + cost.toFixed(2) + ' sent!');
    renderMyPurchases();
  };

  // ============================================
  // BUYER - confirm receipt
  // ============================================
  window.confirmReceipt = function (orderId) {
    var shipments = Storage.getShipping();
    var s = shipments.find(function (x) { return x.productOrderId === orderId; });
    if (!s) { alert('No shipping record for this order.'); return; }
    if (s.shippingStatus !== 'shipped') { alert('This order has not been shipped yet.'); return; }
    if (!confirm('Confirm that you have received this order?')) return;

    s.shippingStatus = 'delivered';
    s.deliveredAt = new Date().toISOString();
    s.updatedAt = new Date().toISOString();
    Storage.setShipping(shipments);

    // Complete the order -> release escrow
    if (typeof providerSetOrderStatus === 'function') {
      providerSetOrderStatus(orderId, 'completed');
    } else {
      // Fallback: complete the order directly
      var orders = Storage.getProductOrders().map(function (o) {
        return o.id === orderId ? Object.assign({}, o, { status: 'completed' }) : o;
      });
      Storage.setProductOrders(orders);
    }

    showToast('Order confirmed! Escrow has been released to the provider.');
    renderMyPurchases();
  };

  // ============================================
  // RENDERING
  // ============================================
  window.renderShippingDetails = function (orderId) {
    var s = Storage.getShipping().find(function (x) { return x.productOrderId === orderId; });
    var container = document.getElementById('shippingDetails_' + orderId);
    if (!container) return;
    if (!s) {
      container.innerHTML = '<div style="padding:12px;color:#a99c7e;font-size:13px">No shipping details yet.</div>';
      return;
    }
    var statusColors = {
      pending: ['#f59e0b', 'Awaiting payment'],
      paid: ['#3b82f6', 'Paid - Awaiting dispatch'],
      shipped: ['#8b5cf6', 'In transit'],
      delivered: ['#10b981', 'Delivered']
    };
    var st = statusColors[s.shippingStatus] || ['#a99c7e', s.shippingStatus];
    container.innerHTML =
      '<div style="padding:12px;background:rgba(201,162,39,.05);border-radius:8px;border:1px solid rgba(201,162,39,.15);margin-top:8px">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
          '<span class="mini-tag" style="background:' + st[0] + '18;color:' + st[0] + '">' + st[1] + '</span>' +
        '</div>' +
        '<div style="font-size:13px;color:#fdf9ef">' +
          '<div><strong>Address:</strong> ' + esc(s.address || '-') + '</div>' +
          (s.cost > 0 ? '<div><strong>Shipping Cost:</strong> R' + Number(s.cost).toFixed(2) + '</div>' : '') +
          (s.carrier ? '<div><strong>Carrier:</strong> ' + esc(s.carrier) + '</div>' : '') +
          (s.trackingNumber ? '<div><strong>Tracking:</strong> ' + esc(s.trackingNumber) + '</div>' : '') +
          (s.notes ? '<div><strong>Notes:</strong> ' + esc(s.notes) + '</div>' : '') +
        '</div>' +
      '</div>';
  };

  // ============================================
  // PROVIDER - render shipping status in orders
  // ============================================
  function getShippingBadge(orderId) {
    var s = Storage.getShipping().find(function (x) { return x.productOrderId === orderId; });
    if (!s) return '';
    var colors = { pending: '#f59e0b', paid: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981' };
    var labels = { pending: 'Awaiting shipping payment', paid: 'Paid - awaiting dispatch', shipped: 'In transit', delivered: 'Delivered' };
    var c = colors[s.shippingStatus] || '#a99c7e';
    var l = labels[s.shippingStatus] || s.shippingStatus;
    return '<span class="mini-tag" style="background:' + c + '18;color:' + c + '"><i class="fas fa-truck"></i> ' + l + '</span>';
  }
  window.getShippingBadge = getShippingBadge;

})();
