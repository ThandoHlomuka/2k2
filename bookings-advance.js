/* 2k2 Advance Bookings
   Calendar-based slot availability + rates/services merge for service
   providers. Loaded AFTER script.js on index/provider/admin pages.

   Slot model (provider chosen: "auto defaults + provider can override"):
   - AUTO: daily slots are generated from the entity's workStart->workEnd
     window (default 09:00-17:00) at slotStep minutes, only on the entity's
     available days of the week.
   - OVERRIDE: providers can block specific dates (blockedDates) and add
     ad-hoc date+time slots (adHocSlots) per entity via a schedule page.
   - BOOKED: slots already taken by an existing (non-cancelled) booking for
     that provider/date/time are shown as booked. All other generated slots
     are empty/available.
   The booking is PAID: user pays rate amount + booking fee, escrowed until
   the provider confirms. */
(function () {
  'use strict';

  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DEFAULT_START = '09:00';
  var DEFAULT_END = '17:00';
  var DEFAULT_STEP = 60;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function todayStr() { return dateStr(new Date()); }
  function toMin(t) { var p = String(t || '09:00').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); }
  function minToTime(m) { m = Math.max(0, m); return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function fmt12(t) { var p = String(t || '').split(':'); var h = +p[0], mm = pad(+p[1] || 0); var a = h >= 12 ? 'PM' : 'AM'; var hh = h % 12 || 12; return hh + ':' + mm + ' ' + a; }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function parseDate(s) { var p = String(s || '').split('-'); if (p.length < 3) return null; return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate()); nd.setDate(nd.getDate() + n); return nd; }

  function getEntity(providerId, providerType) {
    var items = providerType === 'service' ? Storage.getServices() : Storage.getListings();
    for (var i = 0; i < items.length; i++) { if (String(items[i].id) === String(providerId)) return items[i]; }
    return null;
  }

  function getRates(entity) {
    if (entity && Array.isArray(entity.rates) && entity.rates.length) return entity.rates;
    return entity && entity.name ? [{ label: entity.name, amount: num(entity.rate) }] : [];
  }

  function getAvailability(entity) {
    var a = entity && entity.availability ? entity.availability : {};
    var start = (a.workStart || entity && entity.workStart || DEFAULT_START);
    var end = (a.workEnd || entity && entity.workEnd || DEFAULT_END);
    var step = parseInt(a.slotStep || entity && entity.slotStep, 10) || DEFAULT_STEP;
    var days = {};
    DAYS.forEach(function (d) { days[d] = a[d] ? true : false; });
    var any = DAYS.some(function (d) { return days[d]; });
    if (!any) { DAYS.forEach(function (d) { days[d] = true; }); }
    return { workStart: start, workEnd: end, slotStep: step, days: days };
  }

  function getOverrides(entity) {
    return {
      blockedDates: entity && Array.isArray(entity.blockedDates) ? entity.blockedDates : [],
      adHocSlots: entity && Array.isArray(entity.adHocSlots) ? entity.adHocSlots : []
    };
  }

  function isBlocked(entity, dateStr) {
    var ov = getOverrides(entity);
    for (var i = 0; i < ov.blockedDates.length; i++) { if (String(ov.blockedDates[i]) === String(dateStr)) return true; }
    return false;
  }

  function getBookedSlotKeys(providerId, providerType, dateStr) {
    var keys = {};
    var state = Storage.getBookings();
    for (var i = 0; i < state.length; i++) {
      var b = state[i];
      if (String(b.providerId) !== String(providerId)) continue;
      if (String(b.date) !== String(dateStr)) continue;
      if (b.status === 'cancelled' || b.status === 'declined') continue;
      var t = (b.slotTime || b.time || '').trim();
      if (t) keys[t] = true;
    }
    return keys;
  }

  /* Build the full ordered list of slot times for a given date.
     Returns [] when the date is blocked or outside the availability window. */
  function generateDateSlots(providerId, providerType, dateStr) {
    var entity = getEntity(providerId, providerType);
    if (!entity) return [];
    var avail = getAvailability(entity);
    if (isBlocked(entity, dateStr)) return [];

    var d = parseDate(dateStr);
    if (!d) return [];
    var dowKey = DAYS[d.getDay()];
    var today = todayStr();

    var slots = [];
    var seen = {};

    // Auto slots within the work window on available days.
    if (avail.days[dowKey]) {
      var start = toMin(avail.workStart);
      var end = toMin(avail.workEnd);
      var step = avail.slotStep;
      if (end <= start) { end = start + step; }
      for (var t = start; t < end; t += step) {
        var time = minToTime(t);
        if (dateStr === today && toMin(time) <= toMin(minToTime(toMin(time)))) {}
        if (dateStr === today && toMin(time) <= (function () { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); })()) continue;
        if (!seen[time]) { seen[time] = true; slots.push(time); }
      }
    }

    // Ad-hoc slots added by the provider for this date.
    var ov = getOverrides(entity);
    for (var i = 0; i < ov.adHocSlots.length; i++) {
      var s = ov.adHocSlots[i];
      if (String(s.date) !== String(dateStr)) continue;
      var at = s.time;
      if (dateStr === today && toMin(at) <= (function () { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); })()) continue;
      if (!seen[at]) { seen[at] = true; slots.push(at); }
    }

    slots.sort(function (a, b) { return toMin(a) - toMin(b); });

    // Mark booked vs empty.
    var booked = getBookedSlotKeys(providerId, providerType, dateStr);
    return slots.map(function (t) {
      return { time: t, booked: !!booked[t], available: !booked[t] };
    });
  }

  /* Day-of-calendar status: 'closed' (blocked/never available), 'booked'
     (all generated slots taken), 'available' (at least one empty slot). */
  function getDayStatus(providerId, providerType, dateStr) {
    var entity = getEntity(providerId, providerType);
    if (!entity) return 'closed';
    var d = parseDate(dateStr);
    if (!d) return 'closed';
    var avail = getAvailability(entity);
    if (isBlocked(entity, dateStr)) return 'closed';
    if (!avail.days[DAYS[d.getDay()]]) {
      var ov = getOverrides(entity);
      var hasAdHoc = false;
      for (var i = 0; i < ov.adHocSlots.length; i++) { if (String(ov.adHocSlots[i].date) === String(dateStr)) hasAdHoc = true; }
      if (!hasAdHoc) return 'closed';
    }
    var slots = generateDateSlots(providerId, providerType, dateStr);
    if (!slots.length) return 'closed';
    var anyAvail = slots.some(function (s) { return s.available; });
    return anyAvail ? 'available' : 'booked';
  }

  /* Render a month calendar into #bookingCalendar for the booking modal. */
  var bkCalDate = new Date();
  function shiftBkCal(dir) {
    bkCalDate = new Date(bkCalDate.getFullYear(), bkCalDate.getMonth() + dir, 1);
    refreshBkCalendar();
  }
  function refreshBkCalendar() {
    if (!window.currentBookingProviderId) return;
    var providerId = window.currentBookingProviderId;
    var providerType = window.currentBookingProviderType;
    var el = document.getElementById('bookingCalendar');
    if (!el) return;
    var y = bkCalDate.getFullYear(), m = bkCalDate.getMonth();
    var first = new Date(y, m, 1);
    var daysIn = new Date(y, m + 1, 0).getDate();
    var lead = first.getDay();
    var monthName = first.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
      + '<button type="button" onclick="shiftBkCal(-1)" style="background:none;border:1px solid #c9a22744;color:#c9a227;border-radius:6px;padding:4px 10px;cursor:pointer;">&#9664;</button>'
      + '<strong style="color:#f0d48a">' + monthName + '</strong>'
      + '<button type="button" onclick="shiftBkCal(1)" style="background:none;border:1px solid #c9a22744;color:#c9a227;border-radius:6px;padding:4px 10px;cursor:pointer;">&#9654;</button>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;font-size:.68rem;color:#8a7b55;margin-bottom:4px;">';
    for (var w = 0; w < 7; w++) html += '<div>' + DAY_LABELS[w] + '</div>';
    html += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';

    for (var i = 0; i < lead; i++) html += '<div></div>';

    for (var day = 1; day <= daysIn; day++) {
      var ds = y + '-' + pad(m + 1) + '-' + pad(day);
      var isToday = ds === todayStr();
      var past = ds < todayStr();
      var st = past ? 'past' : getDayStatus(providerId, providerType, ds);
      var bg, color;
      if (past) { bg = 'transparent'; color = '#3a3a3a'; }
      else if (st === 'available') { bg = '#1d8a4e33'; color = '#5ce6a0'; }
      else if (st === 'booked') { bg = '#8b5cf622'; color = '#c4b0f2'; }
      else { bg = '#151515'; color = '#5a5a5a'; }
      var sel = ds === window.bkSelectedDate ? ';outline:2px solid #c9a227' : '';
      html += '<button type="button" data-date="' + ds + '" onclick="pickBkDate(' + "'" + ds + "'" + ')"'
        + ' style="aspect-ratio:1;border:1px solid ' + (isToday ? '#c9a227' : '#2a2a2a') + ';border-radius:6px;background:' + bg + ';color:' + color + ';font-size:.8rem;cursor:' + (past ? 'not-allowed' : 'pointer') + ';' + sel + '">'
        + day + '</button>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function renderBkSlots(dateStr) {
    if (!window.currentBookingProviderId) return;
    var providerId = window.currentBookingProviderId;
    var providerType = window.currentBookingProviderType;
    var grid = document.getElementById('bookingSlotGrid');
    var noSlots = document.getElementById('bookingNoSlots');
    var slots = generateDateSlots(providerId, providerType, dateStr);
    if (!grid || !noSlots) return;
    if (!slots.length) {
      grid.innerHTML = '';
      noSlots.style.display = 'block';
      return;
    }
    noSlots.style.display = 'none';
    var html = slots.map(function (s) {
      var sel = s.time === window.bkSelectedTime ? ';outline:2px solid #c9a227' : '';
      var inner = '<i class="fas fa-' + (s.booked ? 'lock' : 'calendar-check') + '" style="margin-right:6px;font-size:.75rem"></i>' + fmt12(s.time)
        + (s.booked ? ' <span style="display:block;font-size:.62rem;color:#9a8fbf">Booked</span>' : ' <span style="display:block;font-size:.62rem;color:#5ce6a0">Available</span>');
      return '<button type="button" ' + (s.booked ? 'disabled' : '') + ' onclick="pickBkSlot(' + "'" + s.time + "'" + ')"'
        + ' style="flex:1 1 96px;min-width:96px;padding:10px 8px;border-radius:8px;font-size:.82rem;border:1px solid ' + (s.booked ? '#3a3a3a' : '#1d8a4e55') + ';background:' + (s.booked ? '#141414' : '#1d8a4e22') + ';color:' + (s.booked ? '#6a6a6a' : '#5ce6a0') + ';cursor:' + (s.booked ? 'not-allowed' : 'pointer') + ';' + sel + '">' + inner + '</button>';
    }).join('');
    grid.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;">' + html + '</div>';
  }

  function pickBkDate(dateStr) {
    if (dateStr < todayStr()) return;
    var st = window.currentBookingProviderId ? getDayStatus(window.currentBookingProviderId, window.currentBookingProviderType, dateStr) : 'closed';
    if (st === 'closed') { showToast('No bookable slots on that date.', 'error'); return; }
    window.bkSelectedDate = dateStr;
    window.bkSelectedTime = null;
    document.getElementById('bookingSelectedDate').value = dateStr;
    document.getElementById('bookingSelectedTime').value = '';
    refreshBkCalendar();
    renderBkSlots(dateStr);
    updateBkTotal();
  }

  function pickBkSlot(time) {
    window.bkSelectedTime = time;
    document.getElementById('bookingSelectedDate').value = window.bkSelectedDate || '';
    document.getElementById('bookingSelectedTime').value = time;
    document.getElementById('bookingDate').value = window.bkSelectedDate || '';
    document.getElementById('bookingTime').value = time;
    renderBkSlots(window.bkSelectedDate);
    updateBkTotal();
  }

  function onBookingRateChange() {
    updateBkTotal();
  }

  function updateBkTotal() {
    var sel = document.getElementById('bookingRateSelect');
    var rateAmount = 0, rateLabel = '';
    if (sel && sel.value) {
      var opt = sel.options[sel.selectedIndex];
      rateAmount = num(opt.getAttribute('data-amount'));
      rateLabel = opt.getAttribute('data-label') || opt.text;
    }
    var fee = num(window.currentBookingFee);
    var total = rateAmount + fee;
    document.getElementById('bookingSelectedRateAmount').value = rateAmount;
    document.getElementById('bookingSelectedRateLabel').value = rateLabel;
    document.getElementById('bookingRateAmountDisplay').textContent = 'R' + rateAmount.toFixed(0);
    document.getElementById('bookingTotalDisplay').textContent = 'R' + total.toFixed(0);
    var payRow = document.getElementById('bookingPayRow');
    if (payRow) payRow.style.display = rateAmount > 0 ? 'flex' : 'none';
  }

  /* Override openBookingModal: build calendar + rate selector. */
  var _origOpenBk = window.openBookingModal;
  window.openBookingModal = function (providerId, providerType) {
    if (typeof requireSignIn === 'function' && !requireSignIn('Request a booking.')) return;
    window.currentBookingProviderId = providerId;
    window.currentBookingProviderType = providerType;
    window.currentBookingFee = getBookingFeeFor(providerId, providerType);
    window.bkSelectedDate = null;
    window.bkSelectedTime = null;
    bkCalDate = new Date();

    var entity = getEntity(providerId, providerType);
    var rates = getRates(entity);

    var feeEl = document.getElementById('bookingFeeDisplay');
    if (feeEl) feeEl.textContent = 'R' + num(window.currentBookingFee);

    var rateSel = document.getElementById('bookingRateSelect');
    if (rateSel) {
      var opts = '<option value="">Select a service or rate</option>';
      rates.forEach(function (r, i) {
        var lab = (r.label || 'Rate ' + (i + 1));
        var amt = num(r.amount);
        opts += '<option value="' + i + '" data-amount="' + amt + '" data-label="' + lab + '">' + lab + ' - R' + amt.toFixed(0) + '</option>';
      });
      rateSel.innerHTML = opts;
    }

    var hd = document.getElementById('bookingServiceType');
    if (hd) {
      var opts2 = '';
      rates.forEach(function (r, i) { opts2 += '<option value="' + (r.label || '') + '">' + (r.label || '') + '</option>'; });
      if (!opts2) opts2 = '<option value="Service">Service</option>';
      hd.innerHTML = opts2;
    }

    // Reset hidden slot/date fields to the original field names for compat.
    var fName = document.getElementById('bookingClientName'), fEmail = document.getElementById('bookingClientEmail');
    var authUser = (typeof window._2k2 !== 'undefined' && window._2k2.Auth) ? window._2k2.Auth.currentProfile && window._2k2.Auth.currentProfile() : null;
    if (authUser && authUser.username && fName && !fName.value) fName.value = authUser.username;
    if (authUser && authUser.email && fEmail && !fEmail.value) fEmail.value = authUser.email;

    var payRow = document.getElementById('bookingPayRow');
    if (payRow) payRow.style.display = 'none';

    document.getElementById('bookingModal').classList.add('active');
    updateBkTotal();
    refreshBkCalendar();
  };

  /* Override closeBookingModal to clear slot state. */
  var _origCloseBk = window.closeBookingModal;
  window.closeBookingModal = function () {
    window.bkSelectedDate = null;
    window.bkSelectedTime = null;
    var hd = document.getElementById('bookingSelectedDate'); if (hd) hd.value = '';
    var ht = document.getElementById('bookingSelectedTime'); if (ht) ht.value = '';
    var bd = document.getElementById('bookingDate'); if (bd) bd.value = '';
    var bt = document.getElementById('bookingTime'); if (bt) bt.value = '';
    if (_origCloseBk) _origCloseBk();
  };

  /* Override handleBookingSubmit: escrow full (rate + fee), save slot + rate. */
  var _origSubmit = window.handleBookingSubmit;
  window.handleBookingSubmit = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof requireSignIn === 'function' && !requireSignIn('Send a booking request.')) return;

    var rateAmount = num(document.getElementById('bookingSelectedRateAmount').value);
    var rateLabel = document.getElementById('bookingSelectedRateLabel').value;
    var date = (window.bkSelectedDate || document.getElementById('bookingSelectedDate').value || '').trim();
    var time = (window.bkSelectedTime || document.getElementById('bookingSelectedTime').value || '').trim();

    var clientName = (document.getElementById('bookingClientName').value || '').trim();
    var clientEmail = (document.getElementById('bookingClientEmail').value || '').trim();

    if (!rateAmount && !rateLabel) { showToast('Please select a service or rate to book.', 'error'); return; }
    if (!date) { showToast('Please pick a date on the calendar.', 'error'); return; }
    if (!time) { showToast('Please pick an available time slot.', 'error'); return; }

    var fee = num(window.currentBookingFee) || num(getBookingFeeFor(window.currentBookingProviderId, window.currentBookingProviderType));
    var total = Math.round((rateAmount + fee) * 100) / 100;

    if (typeof guardFinancial === 'function' && !guardFinancial('booking', total, 1, 100000)) return;

    var booking = {
      id: generateId(),
      providerId: window.currentBookingProviderId,
      providerType: window.currentBookingProviderType,
      fee: fee,
      rateLabel: rateLabel,
      rateAmount: rateAmount,
      totalAmount: total,
      clientOwnerId: currentUserOwnerId(),
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: (document.getElementById('bookingClientPhone').value || '').trim(),
      date: date,
      time: time,
      slotTime: time,
      serviceType: rateLabel || (document.getElementById('bookingServiceType') && document.getElementById('bookingServiceType').value) || 'Service',
      notes: (document.getElementById('bookingNotes').value || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Deduct total from user wallet and hold it in escrow.
    adjustWallet('user', currentUserOwnerId(), -total, 'booking-fee', 'Booking payment of R' + total.toFixed(2) + ' for ' + (rateLabel || 'service'), { bookingId: booking.id, providerId: booking.providerId });
    holdBookingFee(booking, total);

    if (typeof generateInvoice === 'function') {
      generateInvoice({
        type: 'booking', sourceId: booking.id,
        buyerId: currentUserOwnerId(), buyerName: clientName || 'Client', buyerEmail: clientEmail || '',
        sellerId: booking.providerId, sellerName: rateLabel || 'Provider',
        items: [{ description: (rateLabel || 'Booking fee') + ' (' + (booking.time || '') + ')', quantity: 1, unitPrice: total, total: total }],
        shippingCost: 0, status: 'paid'
      });
    }

    var bookings = Storage.getBookings();
    bookings.push(booking);
    Storage.setBookings(bookings);
    window.closeBookingModal();
    showToast('Booking request sent! R' + total.toFixed(2) + ' held in escrow until the provider confirms.', 'success');
  };

  /* Override updateBookingStatus: release/refund the full totalAmount. */
  var _origStatus = window.updateBookingStatus;
  window.updateBookingStatus = function (id, status) {
    var bookings = Storage.getBookings();
    var booking = bookings.find(function (b) { return b.id === id; });
    if (!booking) { if (_origStatus) _origStatus(id, status); return; }
    var amount = num(booking.totalAmount) || num(booking.fee);
    if (status === 'confirmed') {
      booking.status = 'confirmed';
      Storage.setBookings(bookings);
      releaseBookingEscrow(booking, amount);
      showToast('Booking confirmed. R' + amount.toFixed(2) + ' released to your wallet.', 'success');
      renderProviderBookings();
      if (typeof renderProviderWallet === 'function') renderProviderWallet();
    } else if (status === 'cancelled') {
      booking.status = 'cancelled';
      Storage.setBookings(bookings);
      refundBookingEscrow(booking, amount, 'Refund for cancelled booking');
      showToast('Booking declined. Client refunded R' + amount.toFixed(2) + '.', 'success');
      renderProviderBookings();
      if (typeof renderProviderWallet === 'function') renderProviderWallet();
    } else if (status === 'completed') {
      booking.status = 'completed';
      Storage.setBookings(bookings);
      showToast('Booking marked complete.', 'success');
      renderProviderBookings();
    } else if (_origStatus) {
      _origStatus(id, status);
    }
  };

  /* Ensure booking re-renders stay wired to the base render functions
     (which now display rate + total escrow for paid bookings). */
  var _origRenderUser = window.renderUserBookings;
  window.renderUserBookings = function () { if (_origRenderUser) _origRenderUser(); };
  var _origRenderProv = window.renderProviderBookings;
  window.renderProviderBookings = function () { if (_origRenderProv) _origRenderProv(); };

  /* Expose globals used by inline handlers. */
  window.shiftBkCal = shiftBkCal;
  window.pickBkDate = pickBkDate;
  window.pickBkSlot = pickBkSlot;
  window.onBookingRateChange = onBookingRateChange;
  window.getBookingsSlots = generateDateSlots;
  window.getBookingDayStatus = getDayStatus;
  window.bkGenerateDateSlots = generateDateSlots;
})();
