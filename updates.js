/* 2k2 Update Engine
   Loaded (with a ?v= cache-buster) on EVERY portal page.

   On load:
     1. Fetches version.json (cache-busted via ?_t=Date.now()).
     2. Promotes any CONFIRMED pending update (see handshake) and shows the
        release-note toast.
     3. Compares the served version with the last-applied version stored in
        k2_app_version. If the served version is NEWER, an update entry is
        injected into the sidebar, the change banner is shown, and the
        5-hour auto-update is armed.
     4. Re-checks every 5 minutes even while up-to-date, so long-lived tabs
        still discover new releases without requiring a manual reload.

   Update handshake (device/version control):
     - k2_app_version is ONLY ever written with a version this device has
       actually been SERVED.
     - Triggering an update records the target in k2_app_version_pending and
       hard-reloads the page.
     - The reloaded page re-fetches version.json; if the served version
       matches the pending target, the marker is promoted to k2_app_version
       and the release notes toast is shown.
     - If the served version does NOT match the target (reload aborted,
       network dropped, server rolled back) nothing is stamped - the pending
       marker is retried on the next load. A device can therefore never
       believe it is running a build it did not actually receive. */
(function () {
  'use strict';

  var LS_VERSION = 'k2_app_version';
  var LS_NOTICE = 'k2_upd_notice_at';
  var LS_NOTES = 'k2_upd_pending_notes';
  var LS_PENDING = 'k2_app_version_pending';
  var AUTO_MS = 5 * 60 * 60 * 1000;
  var NOTES_CLOSE_MS = 15000;
  var RECHECK_MS = 5 * 60 * 1000;

  var info = null;
  var available = false;
  var applied = false;
  var notified = false;
  var timer = null;

  function get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function set(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function del(key) { try { localStorage.removeItem(key); } catch (e) {} }
  function qs(s) { return document.querySelector(s); }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Segment-wise version compare: "2.3.10" > "2.3.9".
  // Returns 1 if a > b, -1 if a < b, 0 if equal.
  function compareVers(a, b) {
    var pa = String(a || '').split('.');
    var pb = String(b || '').split('.');
    var n = Math.max(pa.length, pb.length);
    for (var i = 0; i < n; i++) {
      var x = parseInt(pa[i], 10) || 0;
      var y = parseInt(pb[i], 10) || 0;
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return 0;
  }

  function fetchInfo(cb) {
    var x = new XMLHttpRequest();
    x.open('GET', 'version.json?_t=' + Date.now());
    x.timeout = 8000;
    x.onload = function () {
      if (x.status === 200 && x.responseText) {
        try { cb(JSON.parse(x.responseText)); }
        catch (e) { cb(null); }
      } else { cb(null); }
    };
    x.onerror = function () { cb(null); };
    x.ontimeout = function () { cb(null); };
    x.send();
  }

  function notesHtml(notes) {
    return (notes || []).map(function (n) {
      return '<li><i class="fas fa-check-circle"></i><span>' + escapeHtml(n) + '</span></li>';
    }).join('');
  }

  /* ---- Modal banner ---- */
  function buildModal() {
    if (qs('#k2UpdModal')) return;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'k2UpdModal';
    overlay.onclick = function (e) { if (e.target === overlay) k2Upd.later(); };
    var notes = notesHtml(info.notes);
    overlay.innerHTML =
      '<div class="modal" style="max-width:440px">' +
        '<div class="modal-icon" style="background:linear-gradient(135deg,#10b981,#0d9488)"><i class="fas fa-arrow-circle-up"></i></div>' +
        '<h2>' + escapeHtml(info.title || 'Update Available') + '</h2>' +
        '<p>A new version of 2k2 is ready (' + escapeHtml(String(info.version || '')) + '). Tap <strong>Update Now</strong> to get the latest features and fixes.</p>' +
        (notes ? '<div class="k2-upd-note-block"><h3>What\u2019s new</h3><ul class="k2-upd-notes">' + notes + '</ul></div>' : '') +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary" onclick="k2Upd.later()">Remind Me Later</button>' +
          '<button class="btn btn-primary" onclick="k2Upd.run()"><i class="fas fa-arrow-circle-up"></i> Update Now</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function showModal() {
    buildModal();
    var m = qs('#k2UpdModal');
    if (m) m.classList.add('active');
  }

  function hideModal() {
    var m = qs('#k2UpdModal');
    if (m) m.classList.remove('active');
  }

  function maybeShowModal() {
    var onb = qs('#onboardingOverlay');
    if (onb && onb.classList.contains('active')) {
      var attempts = 0;
      var iv = setInterval(function () {
        attempts++;
        if (!onb.classList.contains('active') || attempts > 40) {
          clearInterval(iv);
          showModal();
        }
      }, 500);
    } else {
      showModal();
    }
  }

  /* ---- Sidebar menu entry ---- */
  function injectNavItem() {
    var host = qs('.sidebar-header') || qs('#sidebar');
    if (!host || qs('.k2-upd-nav')) return;
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'nav-item k2-upd-nav';
    a.setAttribute('onclick', 'k2Upd.run();return false;');
    a.innerHTML = '<i class="fas fa-arrow-circle-up"></i><span>Update</span><span class="k2-upd-nav-badge">NEW</span>';
    host.insertAdjacentElement('afterend', a);
    a.style.display = 'flex';
  }

  /* ---- Post-update notes toast (auto-dismiss after 15s) ---- */
  function showNotesToast() {
    var raw = get(LS_NOTES);
    if (!raw) return;
    del(LS_NOTES);
    var data = null;
    try { data = JSON.parse(raw); } catch (e) {}
    if (!data || !(data.notes && data.notes.length)) return;

    var toast = document.createElement('div');
    toast.className = 'k2-upd-toast';
    toast.innerHTML =
      '<div class="k2-upd-toast-head">' +
        '<i class="fas fa-rocket"></i>' +
        '<span class="k2-upd-toast-title">' + escapeHtml(data.title || '2k2 Updated') + '</span>' +
        (data.version ? '<span class="k2-upd-toast-ver">v' + escapeHtml(data.version) + '</span>' : '') +
        '<button class="k2-upd-toast-close" onclick="k2Upd.dismissNotes()" aria-label="Close"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<ul class="k2-upd-notes">' + notesHtml(data.notes) + '</ul>';
    document.body.appendChild(toast);
    toast.classList.add('show');
    if (window.k2Upd._notesTimer) clearTimeout(window.k2Upd._notesTimer);
    window.k2Upd._notesTimer = setTimeout(k2Upd.dismissNotes, NOTES_CLOSE_MS);
  }

  function dismissNotes() {
    var toast = qs('.k2-upd-toast');
    if (!toast) return;
    if (window.k2Upd._notesTimer) { clearTimeout(window.k2Upd._notesTimer); window.k2Upd._notesTimer = null; }
    toast.classList.add('hide');
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
  }

  /* ---- Pending-update handshake ----
     After a successful fetch, promote the pending target to k2_app_version
     ONLY when the served version matches it. Returns true when promoted. */
  function confirmPending() {
    var raw = get(LS_PENDING);
    if (!raw) return false;
    var pend = null;
    try { pend = JSON.parse(raw); } catch (e) {}
    if (!pend || !pend.version) { del(LS_PENDING); return false; }
    if (info && info.version && String(info.version) === String(pend.version)) {
      set(LS_VERSION, String(info.version));
      if (pend.notes && pend.notes.length) {
        set(LS_NOTES, JSON.stringify({ version: String(info.version), title: pend.title || '2k2 Updated', notes: pend.notes }));
      }
      del(LS_PENDING);
      del(LS_NOTICE);
      showNotesToast();
      return true;
    }
    return false; // target not served yet - retry on the next load
  }

  /* ---- Applying the update: mark pending, then hard-reload. ---- */
  function applyUpdate() {
    if (applied || !info || !info.version) return;
    applied = true;
    set(LS_PENDING, JSON.stringify({
      version: String(info.version),
      title: info.title || '2k2 Updated',
      notes: info.notes || []
    }));
    if (!get(LS_NOTICE)) set(LS_NOTICE, String(Date.now()));
    var path = window.location.pathname;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    window.location.href = path + sep + 'k2u=' + Date.now() + (window.location.hash || '');
  }

  function checkAuto() {
    if (!available || applied) return;
    var noticeAt = parseInt(get(LS_NOTICE) || '0', 10);
    if (noticeAt && Date.now() - noticeAt >= AUTO_MS) applyUpdate();
  }

  function presentUpdate() {
    if (!available || applied) return;
    if (!notified && !get(LS_PENDING)) {
      notified = true;
      setTimeout(maybeShowModal, 900);
    }
    checkAuto();
  }

  /* Central evaluation after each version.json fetch. */
  function evaluateRemote() {
    if (!info || !info.version) return;
    confirmPending();

    var local = get(LS_VERSION);
    if (!local) { set(LS_VERSION, String(info.version)); del(LS_PENDING); return; }

    if (compareVers(local, String(info.version)) >= 0) {
      available = false;
      notified = false;
      return;
    }

    available = true;
    injectNavItem();
    if (!get(LS_NOTICE)) set(LS_NOTICE, String(Date.now()));
    presentUpdate();
  }

  function startChecks() {
    if (timer) return;
    timer = setInterval(function () {
      fetchInfo(function (remote) {
        if (!remote || !remote.version) return;
        info = remote;
        evaluateRemote();
      });
    }, RECHECK_MS);
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  window.k2Upd = {
    run: applyUpdate,
    later: hideModal,
    dismissNotes: dismissNotes
  };

  ready(function () {
    showNotesToast();
    fetchInfo(function (remote) {
      if (!remote || !remote.version) return;
      info = remote;
      evaluateRemote();
      startChecks();
    });
  });
})();