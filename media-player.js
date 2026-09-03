// =============================================
// 2k2 - In-App Media Players (video + audio/podcast)
// Lightweight, dependency-free, fully self-contained.
// - In-place <video>/<audio> players with branded controls
// - Themed full-screen/modal video player via openVideoPlayer()
// - Themed podcast/audio modal via openPodcastPlayer()
// - Dockable global "mini player" bar for continuous audio
// - Auto-upgrade: any element with data-video-src / data-audio-src
//   is upgraded to an in-app player on init.
// =============================================
(function () {
  'use strict';

  var _2k2 = window._2k2 = window._2k2 || {};
  _2k2.Media = _2k2.Media || {};

  var C = {
    pri: '#d4a853',
    bg: '#0e0a14',
    surface: '#181220',
    surface2: '#221a30',
    text: '#f5efe0',
    muted: '#a99c7e'
  };

  var fmt = function (secs) {
    if (!isFinite(secs) || secs < 0) secs = 0;
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    var s = Math.floor(secs % 60);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return (h > 0 ? h + ':' + pad(m) : m) + ':' + pad(s);
  };

  // ---------- shared helper: build an <audio>/<video> element ----------
  function makeSrc(src, type) {
    if (!src) return '';
    if (type) return '<source src="' + src + '" type="' + type + '">';
    // try to guess mime from extension else leave undeclared
    var m = src.toLowerCase();
    if (m.indexOf('.mp4') !== -1) return '<source src="' + src + '" type="video/mp4">';
    if (m.indexOf('.webm') !== -1) return '<source src="' + src + '" type="video/webm">';
    if (m.indexOf('.ogg') !== -1) return '<source src="' + src + '" type="video/ogg">';
    if (m.indexOf('.mp3') !== -1) return '<source src="' + src + '" type="audio/mpeg">';
    if (m.indexOf('.m4a') !== -1) return '<source src="' + src + '" type="audio/mp4">';
    if (m.indexOf('.wav') !== -1) return '<source src="' + src + '" type="audio/wav">';
    if (m.indexOf('.flac') !== -1) return '<source src="' + src + '" type="audio/flac">';
    return '<source src="' + src + '">';
  }

  // Detect a media element that we can actually play (HTMLMediaElement.canPlayType / onloadedmetadata).
  function mediaUsable(el) {
    if (!el) return false;
    try {
      return !!el.canPlayType;
    } catch (e) { return false; }
  }

  // ---------- CSS ----------
  var css = '\n' +
    '.k2-media-modal{position:fixed;inset:0;z-index:99999;background:rgba(6,4,10,.92);display:flex;align-items:center;justify-content:center;padding:24px;animation:k2MediaFade .18s ease;}\n' +
    '.k2-media-modal.hidden{display:none;}\n' +
    '.k2-media-modal-inner{width:min(880px,100%);max-height:94vh;display:flex;flex-direction:column;}\n' +
    '.k2-media-modal-head{display:flex;align-items:center;gap:14px;padding:10px 4px 14px;color:' + C.text + ';}\n' +
    '.k2-media-modal-title{flex:1;font-weight:700;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-media-modal-close{background:transparent;border:none;color:' + C.muted + ';font-size:1.4rem;cursor:pointer;padding:6px;line-height:1;}\n' +
    '.k2-media-modal-close:hover{color:' + C.text + ';}\n' +
    '.k2-media-video-wrap{background:#000;border-radius:14px;overflow:hidden;border:1px solid rgba(212,168,83,.3);}\n' +
    '.k2-media-video-wrap video{display:block;width:100%;max-height:74vh;background:#000;outline:none;}\n' +
    '@keyframes k2MediaFade{from{opacity:0}to{opacity:1}}\n' +
    // ---- in-place player card shell ----
    '.k2-player-card{width:100%;overflow:hidden;border-radius:14px;background:' + C.surface + ';border:1px solid rgba(212,168,83,.25);}\n' +
    '.k2-player-card video,.k2-player-card .k2-audio-stage{width:100%;display:block;background:#000;}\n' +
    // ---- shared control bar ----
    '.k2-controls{display:flex;align-items:center;gap:6px;padding:10px 12px;background:' + C.surface + ';color:' + C.text + ';}\n' +
    '.k2-btn{background:transparent;border:none;color:' + C.text + ';cursor:pointer;font-size:1rem;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:.15s;}\n' +
    '.k2-btn:hover{background:rgba(255,255,255,.1);}\n' +
    '.k2-btn.k2-play{background:' + C.pri + ';color:#211a0d;border-radius:50%;font-size:0.85rem;}\n' +
    '.k2-btn.k2-play:hover{transform:scale(1.06);background:#e0b45f;}\n' +
    '.k2-seek{flex:1;height:4px;background:rgba(255,255,255,.18);border-radius:99px;position:relative;cursor:pointer;}\n' +
    '.k2-seek-fill{position:absolute;left:0;top:0;bottom:0;width:0%;background:' + C.pri + ';border-radius:99px;}\n' +
    '.k2-time{font-size:0.74rem;color:' + C.muted + ';font-variant-numeric:tabular-nums;white-space:nowrap;}\n' +
    '.k2-vol{width:64px;height:4px;background:rgba(255,255,255,.18);border-radius:99px;position:relative;cursor:pointer;}\n' +
    '.k2-vol-fill{position:absolute;left:0;top:0;bottom:0;width:100%;background:' + C.text + ';border-radius:99px;}\n' +
    '.k2-speed{font-size:0.72rem;color:' + C.muted + ';cursor:pointer;padding:4px 8px;border-radius:8px;white-space:nowrap;}\n' +
    '.k2-speed:hover{color:' + C.text + ';background:rgba(255,255,255,.08);}\n' +
    // ---- audio player body ----
    '.k2-audio-stage{padding:18px 16px 8px;display:flex;align-items:center;gap:16px;}\n' +
    '.k2-audio-art{width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;color:#211a0d;font-size:1.3rem;flex-shrink:0;}\n' +
    '.k2-audio-art img{width:100%;height:100%;object-fit:cover;border-radius:12px;}\n' +
    '.k2-audio-meta{flex:1;min-width:0;}\n' +
    '.k2-audio-title{color:' + C.text + ';font-weight:700;font-size:0.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-audio-sub{color:' + C.muted + ';font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    // ---- docked mini player ----
    '.k2-mini{position:fixed;left:0;right:0;bottom:0;z-index:99000;background:' + C.surface2 + ';border-top:1px solid rgba(212,168,83,.35);box-shadow:0 -8px 24px rgba(0,0,0,.4);padding:10px 16px;display:flex;align-items:center;gap:12px;color:' + C.text + ';transform:translateY(110%);transition:transform .25s ease;}\n' +
    '.k2-mini.open{transform:translateY(0);}\n' +
    '.k2-mini-art{width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.9rem;}\n' +
    '.k2-mini-art img{width:100%;height:100%;object-fit:cover;border-radius:8px;}\n' +
    '.k2-mini-meta{flex:1;min-width:0;}\n' +
    '.k2-mini-title{font-size:0.82rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-mini-sub{font-size:0.72rem;color:' + C.muted + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-mini .k2-seek{height:3px;}\n' +
    '.k2-mini-btn{background:transparent;border:none;color:' + C.text + ';cursor:pointer;font-size:1rem;}\n' +
    '.k2-mini-close{color:' + C.muted + ';}\n' +
    '.k2-body-pad{padding-bottom:76px;}\n' +
    '';

  function injectCss() {
    if (document.getElementById('k2-media-css')) return;
    var el = document.createElement('style');
    el.id = 'k2-media-css';
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ---------- lightweight single media player (video OR audio) ----------
  function buildPlayer(opts) {
    // opts: kind ('video'|'audio'), src, title, sub, art, dark(for modal)
    var wrap = document.createElement('div');
    wrap.className = 'k2-player-card';

    var media;
    if (opts.kind === 'audio') {
      media = document.createElement('audio');
      media.preload = 'metadata';
      var stage = document.createElement('div');
      stage.className = 'k2-audio-stage';
      stage.innerHTML =
        '<div class="k2-audio-art">' + (opts.art ? '<img src="' + opts.art + '" alt="">' : '<i class="fas fa-podcast"></i>') + '</div>' +
        '<div class="k2-audio-meta"><div class="k2-audio-title">' + (opts.title || 'Audio') + '</div><div class="k2-audio-sub">' + (opts.sub || '') + '</div></div>';
      wrap.appendChild(stage);
      wrap.appendChild(media);
    } else {
      media = document.createElement('video');
      media.preload = 'metadata';
      media.setAttribute('playsinline', '');
      media.setAttribute('controlslist', 'nodownload');
      media.style.maxHeight = '74vh';
      wrap.appendChild(media);
    }

    media.src = opts.src;

    var controls = document.createElement('div');
    controls.className = 'k2-controls';
    controls.innerHTML =
      '<button type="button" class="k2-btn k2-play" aria-label="Play/Pause"><i class="fas fa-play"></i></button>' +
      '<span class="k2-time k2-now">0:00</span>' +
      '<div class="k2-seek"><div class="k2-seek-fill"></div></div>' +
      '<span class="k2-time k2-total">0:00</span>' +
      '<button type="button" class="k2-btn k2-mute"><i class="fas fa-volume-up"></i></button>' +
      '<div class="k2-vol"><div class="k2-vol-fill"></div></div>' +
      '<span class="k2-speed">1x</span>';
    wrap.appendChild(controls);

    var playBtn = controls.querySelector('.k2-play');
    var nowEl = controls.querySelector('.k2-now');
    var totalEl = controls.querySelector('.k2-total');
    var seekEl = controls.querySelector('.k2-seek');
    var fillEl = controls.querySelector('.k2-seek-fill');
    var muteBtn = controls.querySelector('.k2-mute');
    var volEl = controls.querySelector('.k2-vol');
    var volFill = controls.querySelector('.k2-vol-fill');
    var speedEl = controls.querySelector('.k2-speed');

    var started = false;
    function setMeta() {
      var d = media.duration;
      if (isFinite(d) && d) { totalEl.textContent = fmt(d); started = true; }
    }
    media.addEventListener('loadedmetadata', setMeta);
    media.addEventListener('durationchange', setMeta);

    function update() {
      var d = media.duration || 0;
      var c = media.currentTime || 0;
      nowEl.textContent = fmt(c);
      if (d) fillEl.style.width = ((c / d) * 100) + '%';
    }
    media.addEventListener('timeupdate', update);
    media.addEventListener('progress', update);

    function playing() { playBtn.innerHTML = '<i class="fas fa-pause"></i>'; }
    function paused() { playBtn.innerHTML = '<i class="fas fa-play"></i>'; }
    media.addEventListener('play', playing);
    media.addEventListener('pause', paused);
    media.addEventListener('ended', function () { paused(); media.currentTime = 0; });

    function togglePlay() {
      if (media.paused) {
        // Pause the shared mini/audio if playing somewhere else.
        try { if (window._2k2.Mini) window._2k2.Mini.pause(); } catch (e) {}
        media.play().catch(function () {});
      } else {
        media.pause();
      }
    }
    playBtn.addEventListener('click', togglePlay);
    media.addEventListener('dblclick', togglePlay);

    function seekAt(x, el) {
      var r = el.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (x - r.left) / r.width));
      if (media.duration) media.currentTime = p * media.duration;
    }
    seekEl.addEventListener('click', function (e) { seekAt(e.clientX, seekEl); });
    seekEl.addEventListener('touchstart', function (e) { if (e.touches[0]) seekAt(e.touches[0].clientX, seekEl); });

    function mute() {
      media.muted = !media.muted;
      muteBtn.innerHTML = media.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
    muteBtn.addEventListener('click', mute);
    volEl.addEventListener('click', function (e) {
      var r = volEl.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      media.volume = p; media.muted = false;
      volFill.style.width = (p * 100) + '%';
      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    });

    var speeds = [0.75, 1, 1.25, 1.5, 2];
    var si = 1;
    speedEl.addEventListener('click', function () {
      si = (si + 1) % speeds.length;
      media.playbackRate = speeds[si];
      speedEl.textContent = speeds[si] + 'x';
    });

    function destroy() {
      try { media.pause(); } catch (e) {}
      media.removeAttribute('src');
      wrap.innerHTML = '';
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    return { el: wrap, media: media, play: togglePlay, destroy: destroy };
  }

  // ---------- modal ----------
  function ensureModal() {
    injectCss();
    var existing = document.getElementById('k2-media-modal');
    if (existing) return existing;
    var m = document.createElement('div');
    m.id = 'k2-media-modal';
    m.className = 'k2-media-modal hidden';
    m.innerHTML =
      '<div class="k2-media-modal-inner">' +
      '<div class="k2-media-modal-head">' +
      '<div class="k2-media-modal-title"></div>' +
      '<button type="button" class="k2-media-modal-close"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="k2-media-modal-body"></div>' +
      '</div>';
    document.body.appendChild(m);
    var closeBtn = m.querySelector('.k2-media-modal-close');
    var close = function () {
      m.classList.add('hidden');
      var body = m.querySelector('.k2-media-modal-body');
      while (body.firstChild) body.removeChild(body.firstChild);
    };
    closeBtn.addEventListener('click', close);
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return m;
  }

  function openModal(kind, opts) {
    injectCss();
    var m = ensureModal();
    m.querySelector('.k2-media-modal-title').textContent = opts.title || (kind === 'video' ? 'Video' : 'Audio');
    var body = m.querySelector('.k2-media-modal-body');
    body.innerHTML = kind === 'video'
      ? '<div class="k2-media-video-wrap"></div>'
      : '<div class="k2-audio-stage k2-media-audio"></div><div class="k2-controls k2-media-audio-controls"></div>';
    m.classList.remove('hidden');

    var host = body.firstChild;
    if (kind === 'video') {
      var player = buildPlayer({ kind: 'video', src: opts.src, title: opts.title });
      host.appendChild(player.el);
      player.el.style.background = 'none';
      player.el.style.border = 'none';
    } else {
      // audio modal: reuse buildPlayer but inject into provided layout is complex;
      // simplest: build full card scaled inside modal.
      body.innerHTML = '';
      var p = buildPlayer({ kind: 'audio', src: opts.src, title: opts.title, sub: opts.sub, art: opts.art });
      body.appendChild(p.el);
    }
    body.__k2player = true;
    return m;
  }

  function openVideoPlayer(src, title) {
    if (!src) return;
    return openModal('video', { src: src, title: title || 'Video' });
  }

  function openPodcastPlayer(track) {
    if (!track || !track.src) return;
    return openModal('audio', { src: track.src, title: track.title, sub: track.sub, art: track.art });
  }

  // ---------- global mini player (continuous audio/podcast) ----------
  var mini = null;
  var miniPlayer = null;
  function buildMini() {
    if (mini) return;
    injectCss();
    mini = document.createElement('div');
    mini.className = 'k2-mini';
    mini.innerHTML =
      '<div class="k2-mini-art"><i class="fas fa-podcast"></i></div>' +
      '<div class="k2-mini-meta"><div class="k2-mini-title"></div><div class="k2-mini-sub"></div></div>' +
      '<button type="button" class="k2-mini-btn k2-mini-play"><i class="fas fa-play"></i></button>' +
      '<button type="button" class="k2-mini-btn k2-mini-close"><i class="fas fa-times"></i></button>';
    document.body.appendChild(mini);
    mini.querySelector('.k2-mini-close').addEventListener('click', function () { Mini.stop(); });
    document.body.classList.add('k2-body-pad');
  }

  function miniSetPlaying(p) {
    if (!mini) return;
    mini.querySelector('.k2-mini-play').innerHTML = p ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  }

  var Mini = {
    playTracks: function (list, index) {
      // list: [{src,title,sub,art}]
      buildMini();
      var idx = index || 0;
      function load() {
        var t = list[idx];
        if (!t) return;
        if (mini) {
          mini.querySelector('.k2-mini-title').textContent = t.title || 'Audio';
          mini.querySelector('.k2-mini-sub').textContent = t.sub || '';
          var art = mini.querySelector('.k2-mini-art');
          art.innerHTML = t.art ? '<img src="' + t.art + '" alt="">' : '<i class="fas fa-podcast"></i>';
        }
        if (miniPlayer) miniPlayer.destroy();
        miniPlayer = buildPlayer({ kind: 'audio', src: t.src, title: t.title, sub: t.sub, art: t.art });
        miniPlayer.media.addEventListener('ended', function () { if (list[++idx]) load(); else { Mini.pause(); } });
        miniPlayer.media.play().catch(function () {});
        miniSetPlaying(true);
        if (mini) {
          mini.querySelector('.k2-mini-play').onclick = function () { miniPlayer.play(); };
        }
      }
      load();
      if (mini) mini.classList.add('open');
    },
    playTrack: function (t) { this.playTracks([t], 0); },
    pause: function () { if (miniPlayer) miniPlayer.media.pause(); miniSetPlaying(false); },
    stop: function () {
      if (miniPlayer) miniPlayer.destroy();
      miniPlayer = null;
      if (mini) mini.classList.remove('open');
      miniSetPlaying(false);
    },
    isPlaying: function () { return !!(miniPlayer && !miniPlayer.media.paused); }
  };

  // ---------- auto-upgrade helpers ----------
  // Upgrade any element with data-video-src / data-audio-src inside a container.
  function upgrade(container) {
    if (!container) return;
    var scope = container.nodeType === 1 ? container : document;
    var cards, i;
    var videos = scope.querySelectorAll('[data-video-src]');
    for (i = 0; i < videos.length; i++) {
      var vEl = videos[i];
      var src = vEl.getAttribute('data-video-src');
      if (!src) continue;
      vEl.removeAttribute('data-video-src');
      var vp = buildPlayer({ kind: 'video', src: src, title: vEl.getAttribute('data-title') || '' });
      vEl.appendChild(vp.el);
    }
    var audios = scope.querySelectorAll('[data-audio-src]');
    for (i = 0; i < audios.length; i++) {
      var aEl = audios[i];
      var asrc = aEl.getAttribute('data-audio-src');
      if (!asrc) continue;
      aEl.removeAttribute('data-audio-src');
      var ap = buildPlayer({ kind: 'audio', src: asrc, title: aEl.getAttribute('data-title') || '', sub: aEl.getAttribute('data-sub') || '', art: aEl.getAttribute('data-art') || '' });
      aEl.appendChild(ap.el);
    }
  }

  // ---------- public API ----------
  _2k2.Media = {
    openVideoPlayer: openVideoPlayer,
    openPodcastPlayer: openPodcastPlayer,
    openAudio: openPodcastPlayer,
    buildPlayer: buildPlayer,
    upgrade: upgrade,
    init: function () { injectCss(); },
    Mini: Mini
  };
  window._2k2Media = _2k2.Media;
  window.openVideoPlayer = openVideoPlayer;   // convenience global
  window.openPodcastPlayer = openPodcastPlayer;
  window.playPodcast = Mini.playTrack;
})();
