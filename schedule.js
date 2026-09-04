/* 2k2 Provider Schedule Manager
   Loaded AFTER script.js on provider.html. Lets a provider manage the
   availability, blocked dates, and ad-hoc slots for each of their services
   and listings. Saved state is read by bookings-advance.js to build the
   booking calendar + slot grid. */
(function () {
  'use strict';

  var DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  function ownEntities() {
    var services = [], listings = [];
    try {
      var provId = findCurrentProviderId();
      services = (Storage.getServices() || []).filter(function (s) { return String(s.ownerId) === String(provId) || String(s.providerId) === String(provId); });
      listings = (Storage.getListings() || []).filter(function (l) { return String(l.ownerId) === String(provId) || String(l.providerId) === String(provId); });
    } catch (e) {}
    return {
      services: services,
      listings: listings,
      all: services.map(function (s) { return { type: 'service', entity: s }; })
        .concat(listings.map(function (l) { return { type: 'listing', entity: l }; }))
    };
  }

  function storageSet(type) {
    return type === 'service' ? Storage.setServices : Storage.setListings;
  }
  function storageGet(type) {
    return type === 'service' ? Storage.getServices : Storage.getListings;
  }

  function saveEntity(type, id, patch) {
    var list = storageGet(type)();
    var idx = list.findIndex(function (x) { return String(x.id) === String(id); });
    if (idx === -1) return false;
    list[idx] = Object.assign({}, list[idx], patch);
    storageSet(type)(list);
    return true;
  }

  function getAvail(entity) {
    var a = entity.availability || {};
    return {
      workStart: a.workStart || entity.workStart || '09:00',
      workEnd: a.workEnd || entity.workEnd || '17:00',
      slotStep: parseInt(a.slotStep || entity.slotStep, 10) || 60,
      days: DAY_KEYS.reduce(function (o, d) { o[d] = !!a[d]; return o; }, {})
    };
  }

  function getBlocked(entity) { return (entity && Array.isArray(entity.blockedDates)) ? entity.blockedDates : []; }
  function getAdHoc(entity) { return (entity && Array.isArray(entity.adHocSlots)) ? entity.adHocSlots : []; }

  function renderOptions() {
    var sel = document.getElementById('scheduleEntitySelect');
    if (!sel) return;
    var items = ownEntities().all;
    var opts = '<option value="">Choose an item to manage</option>';
    items.forEach(function (it, i) {
      var label = (it.entity.name || it.entity.title || 'Untitled') + (it.type === 'service' ? ' (Service)' : ' (Listing)');
      opts += '<option value="' + i + '">' + label + '</option>';
    });
    sel.innerHTML = opts;
  }

  function current() {
    var sel = document.getElementById('scheduleEntitySelect');
    if (!sel || sel.value === '') return null;
    var items = ownEntities().all;
    var idx = parseInt(sel.value, 10);
    if (isNaN(idx) || !items[idx]) return null;
    return items[idx];
  }

  function renderCurrent() {
    var cur = current();
    var editor = document.getElementById('scheduleEditor');
    var blockSec = document.getElementById('scheduleBlockSection');
    var adhocSec = document.getElementById('scheduleAdHocSection');
    if (!cur) {
      editor.style.display = 'none';
      blockSec.style.display = 'none';
      adhocSec.style.display = 'none';
      return;
    }
    editor.style.display = '';
    blockSec.style.display = '';
    adhocSec.style.display = '';

    var title = document.getElementById('scheduleEntityTitle');
    if (title) title.textContent = 'Availability - ' + (cur.entity.name || cur.entity.title || 'Item');

    var avail = getAvail(cur.entity);
    document.getElementById('scheduleWorkStart').value = avail.workStart;
    document.getElementById('scheduleWorkEnd').value = avail.workEnd;
    var stepSel = document.getElementById('scheduleSlotStep');
    if (stepSel && !Array.prototype.some.call(stepSel.options, function (o) { return String(o.value) === String(avail.slotStep); })) {
      var opt = document.createElement('option');
      opt.value = avail.slotStep; opt.textContent = avail.slotStep + ' min';
      stepSel.appendChild(opt);
    }
    if (stepSel) stepSel.value = avail.slotStep;
    document.querySelectorAll('#scheduleDays input[type=checkbox]').forEach(function (cb) {
      cb.checked = !!avail.days[cb.value];
    });

    renderBlockedList();
    renderAdHocList();
  }

  function renderBlockedList() {
    var cur = current();
    var root = document.getElementById('scheduleBlockedList');
    if (!root) return;
    var blocked = cur ? getBlocked(cur.entity) : [];
    if (!blocked.length) { root.innerHTML = '<p style="color:#6a6a6a;font-size:.85rem;">No blocked dates.</p>'; return; }
    root.innerHTML = blocked.map(function (d) {
      return '<div style="display:flex;align-items:center;gap:10px;background:#151515;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;margin-bottom:6px;">'
        + '<span style="flex:1;font-size:.88rem;">' + d + '</span>'
        + '<button class="btn btn-danger" style="padding:6px 12px;" onclick="removeScheduleBlock(\'' + d + '\')">Remove</button>'
        + '</div>';
    }).join('');
  }

  function renderAdHocList() {
    var cur = current();
    var root = document.getElementById('scheduleAdHocList');
    if (!root) return;
    var adhoc = cur ? getAdHoc(cur.entity) : [];
    if (!adhoc.length) { root.innerHTML = '<p style="color:#6a6a6a;font-size:.85rem;">No extra slots.</p>'; return; }
    root.innerHTML = adhoc.map(function (s, i) {
      return '<div style="display:flex;align-items:center;gap:10px;background:#151515;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px;margin-bottom:6px;">'
        + '<i class="fas fa-clock" style="color:#5ce6a0"></i>'
        + '<span style="flex:1;font-size:.88rem;">' + s.date + ' at ' + s.time + '</span>'
        + '<button class="btn btn-danger" style="padding:6px 12px;" onclick="removeScheduleAdHoc(' + i + ')">Remove</button>'
        + '</div>';
    }).join('');
  }

  function onScheduleEntityChange() {
    renderCurrent();
  }

  function onScheduleFieldChange() {
    var cur = current();
    if (!cur) return;
    var avail = getAvail(cur.entity);
    avail.workStart = document.getElementById('scheduleWorkStart').value || avail.workStart;
    avail.workEnd = document.getElementById('scheduleWorkEnd').value || avail.workEnd;
    avail.slotStep = parseInt(document.getElementById('scheduleSlotStep').value, 10) || avail.slotStep;
    var a = Object.assign({}, cur.entity.availability || {}, {
      workStart: avail.workStart, workEnd: avail.workEnd, slotStep: avail.slotStep
    });
    saveEntity(cur.type, cur.entity.id, { availability: a });
    showToast('Availability updated.', 'success');
  }

  function onScheduleDayChange() {
    var cur = current();
    if (!cur) return;
    var avail = getAvail(cur.entity);
    document.querySelectorAll('#scheduleDays input[type=checkbox]').forEach(function (cb) {
      avail.days[cb.value] = cb.checked;
    });
    var a = Object.assign({}, cur.entity.availability || {}, {
      workStart: avail.workStart, workEnd: avail.workEnd, slotStep: avail.slotStep,
      sun: avail.days.sun, mon: avail.days.mon, tue: avail.days.tue, wed: avail.days.wed,
      thu: avail.days.thu, fri: avail.days.fri, sat: avail.days.sat
    });
    saveEntity(cur.type, cur.entity.id, { availability: a });
    showToast('Availability updated.', 'success');
  }

  function saveScheduleAvailability() {
    var cur = current();
    if (!cur) return;
    var avail = {
      workStart: document.getElementById('scheduleWorkStart').value || '09:00',
      workEnd: document.getElementById('scheduleWorkEnd').value || '17:00',
      slotStep: parseInt(document.getElementById('scheduleSlotStep').value, 10) || 60,
      sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false
    };
    document.querySelectorAll('#scheduleDays input[type=checkbox]').forEach(function (cb) {
      avail[cb.value] = cb.checked;
    });
    var a = Object.assign({}, cur.entity.availability || {}, avail);
    saveEntity(cur.type, cur.entity.id, { availability: a });
    showToast('Availability saved.', 'success');
  }

  function addScheduleBlock() {
    var cur = current();
    if (!cur) return;
    var date = document.getElementById('scheduleBlockDate').value;
    if (!date) { showToast('Please pick a date to block.', 'error'); return; }
    var list = getBlocked(cur.entity);
    if (list.indexOf(date) === -1) list.push(date);
    saveEntity(cur.type, cur.entity.id, { blockedDates: list });
    renderBlockedList();
    showToast('Date blocked.', 'success');
  }

  function removeScheduleBlock(date) {
    var cur = current();
    if (!cur) return;
    var list = getBlocked(cur.entity).filter(function (d) { return d !== date; });
    saveEntity(cur.type, cur.entity.id, { blockedDates: list });
    renderBlockedList();
    showToast('Date unblocked.', 'success');
  }

  function addScheduleAdHoc() {
    var cur = current();
    if (!cur) return;
    var date = document.getElementById('scheduleAdHocDate').value;
    var time = document.getElementById('scheduleAdHocTime').value;
    if (!date || !time) { showToast('Please choose a date and time.', 'error'); return; }
    var list = getAdHoc(cur.entity);
    var dup = list.some(function (s) { return s.date === date && s.time === time; });
    if (dup) { showToast('That slot already exists.', 'error'); return; }
    list.push({ date: date, time: time });
    saveEntity(cur.type, cur.entity.id, { adHocSlots: list });
    renderAdHocList();
    showToast('Extra slot added.', 'success');
  }

  function removeScheduleAdHoc(idx) {
    var cur = current();
    if (!cur) return;
    var list = getAdHoc(cur.entity).filter(function (_, i) { return i !== idx; });
    saveEntity(cur.type, cur.entity.id, { adHocSlots: list });
    renderAdHocList();
    showToast('Extra slot removed.', 'success');
  }

  function renderProviderSchedule() {
    renderOptions();
    renderCurrent();
  }

  window.renderProviderSchedule = renderProviderSchedule;
  window.onScheduleEntityChange = onScheduleEntityChange;
  window.onScheduleFieldChange = onScheduleFieldChange;
  window.onScheduleDayChange = onScheduleDayChange;
  window.saveScheduleAvailability = saveScheduleAvailability;
  window.addScheduleBlock = addScheduleBlock;
  window.removeScheduleBlock = removeScheduleBlock;
  window.addScheduleAdHoc = addScheduleAdHoc;
  window.removeScheduleAdHoc = removeScheduleAdHoc;
})();
