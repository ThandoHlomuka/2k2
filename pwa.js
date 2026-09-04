/* 2k2 PWA helper: service-worker registration + in-app back navigation with
   iOS-style left-edge swipe-back. Loaded at the END of the body of every page
   (after the page's own scripts) so it can wrap existing navigation. */
(function () {
  'use strict';

  /* ---- Service worker registration ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('2k2 SW registration failed:', err);
      });
    });
  }

  /* ---- In-app back navigation stack ----
     The app uses pure div-swapping navigation (navigateTo) and never changes the
     URL. So we mirror every in-app page change with history.pushState and walk
     the stack on popstate (browser back button / edge-swipe) to return to the
     previous in-app page instead of exiting the app. When there is no prior
     in-app page the normal browser back behaviour is allowed. */
  var k2 = (window._k2Nav = {
    stack: [],
    ready: false,
    suppress: 0,
    seq: 0,

    currentPage: function () {
      var active = document.querySelector('.page.active');
      if (!active) return '';
      return String(active.id).replace(/^page-/, '');
    },

    init: function () {
      if (this.ready) return;
      this.stack = [this.currentPage()];
      try { history.replaceState({ k2: true, i: 0 }, ''); } catch (e) {}
      this.ready = true;
      window.addEventListener('popstate', function () { k2.onPop(); });
      this.bindSwipe();
    },

    onNavigate: function (page) {
      if (!this.ready) this.init();
      if (this.suppress > 0) return;
      var cur = this.stack[this.stack.length - 1];
      if (cur === page) return;
      this.stack.push(page);
      if (this.stack.length > 60) this.stack.shift();
      this.seq += 1;
      try { history.pushState({ k2: true, i: this.seq }, ''); } catch (e) {}
    },

    onPop: function () {
      if (this.stack.length > 1) this.stack.pop();
      var target = this.stack[this.stack.length - 1];
      if (!target) return;
      var self = this;
      self.suppress += 1;
      try {
        if (typeof navigateTo === 'function') navigateTo(target);
        else if (typeof window.navigateTo === 'function') window.navigateTo(target);
      } catch (e) {}
      self.suppress -= 1;
    },

    /* Edge swipe-back: a rightward drag starting within the left edge of the
       screen triggers "back" (like iOS), which returns to the prior in-app
       page. It only starts on the raw screen edge so it never collides with the
       media-player gesture layer or the bottom-nav menu. */
    bindSwipe: function () {
      var tracking = false;
      var startX = 0, startY = 0, startT = 0;
      var EDGE = 26;
      document.addEventListener('touchstart', function (e) {
        var t = e.touches && e.touches[0];
        if (!t) { tracking = false; return; }
        if (t.clientX <= EDGE && k2.stack && k2.stack.length > 1) {
          tracking = true; startX = t.clientX; startY = t.clientY; startT = Date.now();
        } else {
          tracking = false;
        }
      }, { passive: true });
      document.addEventListener('touchmove', function (e) {
        if (!tracking) return;
        var t = e.touches && e.touches[0];
        if (!t) return;
        var dx = t.clientX - startX;
        var dy = t.clientY - startY;
        if (dx > 34 && Math.abs(dy) < 60 && Date.now() - startT < 700) {
          tracking = false;
          try { history.back(); } catch (err) {}
        } else if (dx < -45 || Math.abs(dy) > 90) {
          tracking = false;
        }
      }, { passive: true });
      ['touchend', 'touchcancel'].forEach(function (ev) {
        document.addEventListener(ev, function () { tracking = false; }, { passive: true });
      });
    },

    back: function () {
      if (this.stack.length > 1) { try { history.back(); } catch (e) {} }
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { k2.init(); });
  } else {
    k2.init();
  }
})();
