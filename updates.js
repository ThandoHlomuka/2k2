/* 2k2 Update Engine
   Runs on every portal page. On load it fetches version.json (cache-busted)
   and compares the served version with the last-applied version saved in
   localStorage (k2_app_version).

   When an update is available:
     - An "Update" entry is injected into the sidebar menu.
     - A banner lists the incoming changes with Update Now / Remind Me Later.
     - If the user does not update within 5 hours of first notice, the app
       auto-updates (hard reload with a cache-busting query).

   After an update is applied, the pending release notes are shown as a push
   notification that auto-dismisses after 15 seconds. */
(function () {
  'use strict';

  var LS_VERSION = 'k2_app_version';
  var LS_NOTICE = 'k2_upd_notice_at';
  var LS_NOTES = 'k2_upd_pending_notes';
  var AUTO_MS = 5 * 60 * 60 * 1000;
  var NOTES_CLOSE_MS = 15000;
  var RECHECK_MS = 5 * 60 * 1000;

  var info = null;
  var available = false;
  var applied = false;

  function get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function set(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function del(key) { try { localStorage.removeItem(key); } catch (e) {} }
  function qs(s) { return document.querySelector(s); }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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

  /* ---- Applying the update ---- */
  function applyUpdate() {
    if (applied) return;
    applied = true;
    if (info) {
      set(LS_NOTES, JSON.stringify({
        version: info.version,
        title: info.title || '2k2 Updated',
        notes: info.notes || []
      }));
      set(LS_VERSION, String(info.version));
    }
    del(LS_NOTICE);
    var path = window.location.pathname;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    window.location.href = path + sep + 'k2u=' + Date.now() + (window.location.hash || '');
  }

  function checkAuto() {
    if (!available || applied) return;
    var noticeAt = parseInt(get(LS_NOTICE) || '0', 10);
    if (noticeAt && Date.now() - noticeAt >= AUTO_MS) applyUpdate();
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
      var local = get(LS_VERSION);
      if (!local) {
        set(LS_VERSION, String(remote.version));
        return;
      }
      if (local === String(remote.version)) return;

      available = true;
      injectNavItem();
      if (get(LS_NOTICE)) { /* keep earliest notice time */ }
      else set(LS_NOTICE, String(Date.now()));
      checkAuto();
      if (available && !applied) {
        setTimeout(maybeShowModal, 900);
        setInterval(checkAuto, RECHECK_MS);
      }
    });
  });
})();