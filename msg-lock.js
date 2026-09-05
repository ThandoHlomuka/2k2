/* 2k2 Paid Communication Lock (upgrade)
   Loaded AFTER script.js on index/provider pages.

   Enhances the existing fixed-fee message gate (PROVIDER_MSG_UNLOCK_FEE=25)
   into a provider-customizable paid messaging lock:
   - Providers opt in (Messaging Protection toggle) and set their own unlock
     fee (defaults to R25 when unset).
   - Clients who click Message on a locked provider see a popup explaining the
     fee before any conversation is opened.
   - Clients with an approved (confirmed/completed) booking bypass the lock:
     once booked there is no extra fee to arrange details via chat.
   - The inline send-time gate + unlock payment use the dynamic per-provider
     fee. */
(function () {
  'use strict';

  var DEFAULT_FEE = 25;

  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }

  function getProvider(providerId) {
    return (Storage.getProviders() || []).find(function (p) { return String(p.id) === String(providerId); }) || null;
  }

  function getMsgFee(providerId) {
    var p = getProvider(providerId);
    if (p && num(p.msgFee) > 0) return num(p.msgFee);
    try {
      if (typeof getProviderSettings === 'function') {
        var s = getProviderSettings();
        if (num(s.msgFee) > 0) return num(s.msgFee);
      }
    } catch (e) {}
    return DEFAULT_FEE;
  }

  /* A user with an approved (confirmed or completed) booking for this
     provider should not pay an extra fee to arrange the booking via chat. */
  function hasApprovedBooking(providerId) {
    try {
      var uid = (typeof currentAuthId === 'function') ? currentAuthId() : '';
      if (!uid) return false;
      return (Storage.getBookings() || []).some(function (b) {
        return String(b.providerId) === String(providerId)
          && (b.status === 'confirmed' || b.status === 'completed')
          && (String(b.clientOwnerId) === String(uid));
      });
    } catch (e) { return false; }
  }

  /* Bypass the lock for approved-booked clients. */
  var _origGate = window.providerMsgGateAllowed;
  window.providerMsgGateAllowed = function (recipientId, recipientRole) {
    if (recipientRole === 'provider' && hasApprovedBooking(recipientId)) return true;
    return _origGate ? _origGate(recipientId, recipientRole) : true;
  };

  /* ---- Popup: greet the user when they click a paid message button ---- */
  function openPaidMsgPopup(providerId, providerName) {
    window._paidMsgProvider = { id: providerId, name: providerName || getProvider(providerId) && getProvider(providerId).businessName || 'Provider' };
    var nameEl = document.getElementById('paidMsgModalName');
    var descEl = document.getElementById('paidMsgModalDesc');
    var feeEl = document.getElementById('paidMsgModalFee');
    var fee = getMsgFee(providerId);
    if (nameEl) nameEl.textContent = window._paidMsgProvider.name;
    if (feeEl) feeEl.textContent = 'R' + fee;
    if (descEl) descEl.textContent = 'This service provider has enabled paid messaging. Pay R' + fee
      + ' to open a conversation. If you already have a confirmed booking with '
      + window._paidMsgProvider.name + ', messaging is free.';
    var modal = document.getElementById('paidMsgModal');
    if (modal) modal.classList.add('active');
  }

  function closePaidMsgPopup() {
    var modal = document.getElementById('paidMsgModal');
    if (modal) modal.classList.remove('active');
    window._paidMsgProvider = null;
  }

  function confirmPaidMsgPay() {
    var p = window._paidMsgProvider;
    if (!p) return;
    if (typeof payProviderUnlock === 'function') payProviderUnlock(p.id, p.name);
  }

  /* ---- Unlock uses the per-provider fee, not the fixed constant ---- */
  var _origPayUnlock = window.payProviderUnlock;
  window.payProviderUnlock = function (providerId, providerName) {
    var fee = getMsgFee(providerId);
    if (typeof requireSignIn === 'function' && !requireSignIn('Unlock contact.')) return;
    var uid = typeof currentAuthId === 'function' ? currentAuthId() : '';
    var bal = (typeof getWalletBalance === 'function') ? getWalletBalance('user', uid) : 0;
    if (bal < fee) {
      showToast('Insufficient wallet balance to unlock. Please top up your wallet first.', 'error');
      return;
    }
    if (typeof adjustWallet === 'function') {
      adjustWallet('user', uid, -fee, 'provider-unlock', 'Unlock paid contact - ' + (providerName || 'Provider'), { providerId: providerId });
      if (typeof getOrCreateWallet === 'function') getOrCreateWallet('provider', providerId);
      adjustWallet('provider', providerId, fee, 'provider-unlock', 'Paid contact unlock - ' + (providerName || 'Provider'), { userId: uid });
    }
    if (typeof recordProviderMsgUnlock === 'function') recordProviderMsgUnlock(providerId);
    closePaidMsgPopup();
    showToast('Unlocked! You can now message ' + (providerName || 'the provider') + '.');
    if (typeof openComposeTo === 'function') openComposeTo(providerId, providerName || 'Provider', 'provider');
  };

  /* ---- Send-time gate card uses the dynamic fee ---- */
  var _origRenderGate = window.renderProviderMsgGate;
  window.renderProviderMsgGate = function (providerId, providerName) {
    var fee = getMsgFee(providerId);
    var container = document.getElementById('messageThreadContent');
    if (!container) return;
    container.innerHTML = ''
      + '<div class="provider-gate-card">'
      + '<div class="gate-icon"><i class="fas fa-shield-halved"></i></div>'
      + '<h2>' + (typeof escapeHtml === 'function' ? escapeHtml(providerName || 'Provider') : providerName || 'Provider') + ' protects their time</h2>'
      + '<p style="color:#a99c7e;max-width:480px;margin:10px auto">This service provider has enabled <strong>Require Paid Contact</strong> to filter out time-wasters. Pay an unlock fee of <strong>R' + fee + '</strong> to get in touch and start a conversation.</p>'
      + '<button class="btn btn-primary" onclick="payProviderUnlock(\'' + providerId + '\',\'' + (typeof escapeHtml === 'function' ? escapeHtml((providerName || 'Provider').replace(/'/g, "\\'")) : providerName || 'Provider') + '\')" style="margin-top:12px"><i class="fas fa-lock-open"></i> Unlock for R' + fee + '</button>'
      + '</div>';
  };

  /* ---- Message button: intercept locked recipients and show the popup ---- */
  function resolveLockTarget(participantId, participantName, role) {
    if (role === 'provider') {
      return { providerId: participantId, providerName: participantName };
    }
    if (role === 'listing' || role === 'service') {
      var ent = null;
      if (role === 'listing') ent = (Storage.getListings() || []).find(function (l) { return String(l.id) === String(participantId); });
      else ent = (Storage.getServices() || []).find(function (s) { return String(s.id) === String(participantId); });
      if (ent && (ent.ownerId || ent.providerId)) {
        return { providerId: ent.ownerId || ent.providerId, providerName: participantName };
      }
    }
    return null;
  }

  var _origCompose = window.openComposeTo;
  window.openComposeTo = function (participantId, participantName, role) {
    var target = resolveLockTarget(participantId, participantName, role);
    if (target) {
      if (typeof requireSignIn === 'function' && !requireSignIn('Send a message.')) return;
      var sender = (typeof getMsgSenderInfo === 'function') ? getMsgSenderInfo() : { role: 'user' };
      var locked = (typeof providerMsgLocked === 'function') && providerMsgLocked(target.providerId);
      var unlocked = (typeof isProviderMsgUnlocked === 'function') && isProviderMsgUnlocked(target.providerId);
      if (sender.role === 'user' && locked && !unlocked && !hasApprovedBooking(target.providerId)) {
        openPaidMsgPopup(target.providerId, target.providerName);
        return;
      }
    }
    if (_origCompose) _origCompose(participantId, participantName, role);
  };

  /* ---- Provider settings: custom fee input ---- */
  var _origLoadPS = window.loadProviderSettings;
  window.loadProviderSettings = function () {
    if (_origLoadPS) _origLoadPS();
    var el = document.getElementById('providerSettingMsgFee');
    if (el) {
      try { var s = getProviderSettings(); el.value = num(s.msgFee) || ''; } catch (e) { el.value = ''; }
    }
  };

  var _origSavePS = window.saveProviderSettings;
  window.saveProviderSettings = function () {
    if (_origSavePS) _origSavePS();
    var feeEl = document.getElementById('providerSettingMsgFee');
    var fee = feeEl ? Math.max(0, parseInt(feeEl.value, 10) || 0) : 0;
    try {
      var s = getProviderSettings(); s.msgFee = fee; setProviderSettings(s);
      var idn = (typeof getCurrentProviderIdentity === 'function') ? getCurrentProviderIdentity() : null;
      if (idn && idn.id) {
        var provs = Storage.getProviders().map(function (p) { return p.id === idn.id ? Object.assign({}, p, { msgFee: fee }) : p; });
        Storage.setProviders(provs);
      }
    } catch (e) {}
  };

  /* ---- Profile view: reflect the lock + fee on the Message button ---- */
  var _origViewProv = window.viewProviderProfile;
  window.viewProviderProfile = function (id) {
    if (_origViewProv) _origViewProv(id);
    var btn = document.getElementById('providerMsgBtn');
    if (!btn) return;
    var locked = (typeof providerMsgLocked === 'function') && providerMsgLocked(id);
    if (locked) {
      btn.innerHTML = '<i class="fas fa-lock"></i> Message (R' + getMsgFee(id) + ')';
    } else {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Message';
    }
  };

  /* Expose globals used by inline handlers. */
  window.openPaidMsgPopup = openPaidMsgPopup;
  window.closePaidMsgPopup = closePaidMsgPopup;
  window.confirmPaidMsgPay = confirmPaidMsgPay;
  window.getProviderMsgFee = getMsgFee;
  window.hasApprovedBookingForMsg = hasApprovedBooking;
})();