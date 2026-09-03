// =============================================
// 2k2 - In-App Media Players (video + audio/podcast)
// Lightweight, dependency-free, fully self-contained.
// - Video: in-place <video> player + themed modal (openVideoPlayer)
// - Audio/Podcast: PHONE-STYLE MUSIC PLAYER (playlist, prev/next/skip,
//   shuffle, repeat, artwork, clickable track list) via openPodcastPlayer
// - Dockable global "mini player" bar with prev/play-next + progress
// - Auto-upgrade: data-video-src / data-audio-src -> in-app player
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
    surface3: '#2a2138',
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

  // Normalize input to a tracks array [{src,title,sub,art}].
  function toTracks(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input.filter(function (t) { return t; });
    if (input.tracks && Array.isArray(input.tracks)) return input.tracks.filter(function (t) { return t; });
    return [input];
  }

  // ---------- CSS ----------
  var css = '\n' +
    '.k2-media-modal{position:fixed;inset:0;z-index:99999;background:rgba(6,4,10,.92);display:flex;align-items:center;justify-content:center;padding:24px;animation:k2MediaFade .18s ease;}\n' +
    '.k2-media-modal.hidden{display:none;}\n' +
    '.k2-media-modal-inner{width:min(920px,100%);max-height:94vh;display:flex;flex-direction:column;}\n' +
    '.k2-media-modal-head{display:flex;align-items:center;gap:14px;padding:10px 4px 14px;color:' + C.text + ';}\n' +
    '.k2-media-modal-title{flex:1;font-weight:700;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-media-modal-close{background:transparent;border:none;color:' + C.muted + ';font-size:1.4rem;cursor:pointer;padding:6px;line-height:1;}\n' +
    '.k2-media-modal-close:hover{color:' + C.text + ';}\n' +
    '.k2-media-video-wrap{background:#000;border-radius:14px;overflow:hidden;border:1px solid rgba(212,168,83,.3);}\n' +
    '.k2-media-video-wrap video{display:block;width:100%;max-height:74vh;background:#000;outline:none;}\n' +
    '@keyframes k2MediaFade{from{opacity:0}to{opacity:1}}\n' +
    // ---- in-place player card shell ----
    '.k2-player-card{width:100%;overflow:hidden;border-radius:14px;background:' + C.surface + ';border:1px solid rgba(212,168,83,.25);}\n' +
    '.k2-player-card video,.k2-audio-stage{width:100%;display:block;background:#000;}\n' +
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
    // ---- PHONE-STYLE MUSIC PLAYER (modal) ----
    '.k2-music-player{background:linear-gradient(160deg,' + C.surface2 + ',' + C.bg + ');border:1px solid rgba(212,168,83,.3);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;max-height:86vh;}\n' +
    '.k2-music-cover{display:flex;align-items:center;justify-content:center;padding:22px 22px 12px;}\n' +
    '.k2-music-cover-art{width:min(200px,40vw);height:min(200px,40vw);border-radius:18px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;color:#211a0d;font-size:3rem;box-shadow:0 18px 40px rgba(0,0,0,.5);}\n' +
    '.k2-music-cover-art img{width:100%;height:100%;object-fit:cover;border-radius:18px;}\n' +
    '.k2-music-info{text-align:center;padding:6px 22px 4px;}\n' +
    '.k2-music-title{color:' + C.text + ';font-size:1.15rem;font-weight:800;}\n' +
    '.k2-music-sub{color:' + C.muted + ';font-size:0.85rem;margin-top:4px;}\n' +
    '.k2-music-progress{padding:16px 22px 4px;}\n' +
    '.k2-music-times{display:flex;justify-content:space-between;font-size:0.74rem;color:' + C.muted + ';margin-bottom:8px;font-variant-numeric:tabular-nums;}\n' +
    '.k2-music-seek{height:5px;background:rgba(255,255,255,.18);border-radius:99px;position:relative;cursor:pointer;}\n' +
    '.k2-music-seek-fill{position:absolute;left:0;top:0;bottom:0;width:0%;background:' + C.pri + ';border-radius:99px;}\n' +
    '.k2-music-transport{display:flex;align-items:center;justify-content:center;gap:22px;padding:16px 22px;}\n' +
    '.k2-music-btn{background:transparent;border:none;color:' + C.text + ';cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:.15s;}\n' +
    '.k2-music-btn:hover{color:' + C.pri + ';}\n' +
    '.k2-music-btn.active{color:' + C.pri + ';}\n' +
    '.k2-music-btn.k2-mp-play{width:60px;height:60px;background:' + C.pri + ';color:#211a0d;font-size:1.2rem;box-shadow:0 8px 24px rgba(212,168,83,.35);}\n' +
    '.k2-music-btn.k2-mp-play:hover{background:#e0b45f;color:#211a0d;transform:scale(1.05);}\n' +
    '.k2-music-btn.k2-mp-skip{font-size:1.5rem;color:' + C.text + ';}\n' +
    '.k2-music-btn.k2-mp-toggle{font-size:1.05rem;color:' + C.muted + ';}\n' +
    '.k2-music-top{display:flex;align-items:center;justify-content:center;gap:18px;padding:0 22px 4px;}\n' +
    '.k2-music-playlist{flex:1;overflow-y:auto;border-top:1px solid rgba(255,255,255,.08);margin-top:10px;padding:8px 0;}\n' +
    '.k2-music-track{display:flex;align-items:center;gap:12px;padding:9px 22px;cursor:pointer;border-left:3px solid transparent;transition:.12s;}\n' +
    '.k2-music-track:hover{background:rgba(255,255,255,.05);}\n' +
    '.k2-music-track.current{border-left-color:' + C.pri + ';background:rgba(212,168,83,.08);}\n' +
    '.k2-music-track-idx{width:26px;text-align:center;color:' + C.muted + ';font-size:0.8rem;flex-shrink:0;}\n' +
    '.k2-music-track.current .k2-music-track-idx{color:' + C.pri + ';}\n' +
    '.k2-music-track-miniart{width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;color:#211a0d;}\n' +
    '.k2-music-track-miniart img{width:100%;height:100%;object-fit:cover;border-radius:8px;}\n' +
    '.k2-music-track-meta{flex:1;min-width:0;}\n' +
    '.k2-music-track-name{color:' + C.text + ';font-size:0.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-music-track-art{color:' + C.muted + ';font-size:0.74rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-music-track-len{color:' + C.muted + ';font-size:0.72rem;flex-shrink:0;font-variant-numeric:tabular-nums;}\n' +
    // ---- docked mini player ----
    '.k2-mini{position:fixed;left:0;right:0;bottom:0;z-index:99000;background:' + C.surface2 + ';border-top:1px solid rgba(212,168,83,.35);box-shadow:0 -8px 24px rgba(0,0,0,.4);padding:10px 16px;display:flex;align-items:center;gap:12px;color:' + C.text + ';transform:translateY(110%);transition:transform .25s ease;}\n' +
    '.k2-mini.open{transform:translateY(0);}\n' +
    '.k2-mini-art{width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.9rem;cursor:pointer;}\n' +
    '.k2-mini-art img{width:100%;height:100%;object-fit:cover;border-radius:8px;}\n' +
    '.k2-mini-meta{flex:1;min-width:0;cursor:pointer;}\n' +
    '.k2-mini-title{font-size:0.82rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-mini-sub{font-size:0.72rem;color:' + C.muted + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-mini-progress{position:absolute;left:0;top:0;height:3px;background:' + C.pri + ';width:0%;}\n' +
    '.k2-mini-btn{background:transparent;border:none;color:' + C.text + ';cursor:pointer;font-size:1rem;width:32px;height:32px;display:flex;align-items:center;justify-content:center;}\n' +
    '.k2-mini-btn:hover{color:' + C.pri + ';}\n' +
    '.k2-mini-close{color:' + C.muted + '}\n' +
    '.k2-body-pad{padding-bottom:76px;}\n' +
    '.k2-mini{overflow:hidden;}\n' +
    '';

  function injectCss() {
    if (document.getElementById('k2-media-css')) return;
    var el = document.createElement('style');
    el.id = 'k2-media-css';
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ---------- lightweight single player (video, or bare audio) ----------
  function buildPlayer(opts) {
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

    function setMeta() { var d = media.duration; if (isFinite(d) && d) totalEl.textContent = fmt(d); }
    media.addEventListener('loadedmetadata', setMeta);
    media.addEventListener('durationchange', setMeta);

    function update() {
      var d = media.duration || 0, c = media.currentTime || 0;
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
        try { if (window._2k2.Mini) window._2k2.Mini.pause(); } catch (e) {}
        media.play().catch(function () {});
      } else media.pause();
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

    function mute() { media.muted = !media.muted; muteBtn.innerHTML = media.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>'; }
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

  // ---------- SHARED AUDIO ENGINE (one playing audio at a time) ----------
  var engine = null; // {audio, play, pause, setOnEnd, destroy, pausedCheck}

  function ensureEngine() {
    if (!engine) {
      var a = document.createElement('audio');
      a.preload = 'metadata';
      a.style.display = 'none';
      document.body.appendChild(a);
      engine = {
        audio: a,
        play: function () { a.play().catch(function () {}); },
        pause: function () { a.pause(); },
        destroy: function () { try { a.pause(); } catch (e) {} a.removeAttribute('src'); a.load(); if (a.parentNode) a.parentNode.removeChild(a); engine = null; },
        setSrc: function (src) { a.src = src; },
        pausedCheck: function () { return a.paused; }
      };
    }
    return engine;
  }

  // ---------- PHONE-STYLE MUSIC PLAYER ----------
  // Build full music player UI with playlist.
  function buildMusicPlayer(tracks, startIndex) {
    injectCss();
    var m = ensureModal();
    m.querySelector('.k2-media-modal-title').textContent = 'Now Playing';
    var body = m.querySelector('.k2-media-modal-body');
    body.innerHTML = '<div class="k2-music-player"></div>';
    var root = body.querySelector('.k2-music-player');
    m.classList.remove('hidden');

    // stop any engine/other audio
    try { if (window._2k2.Mini && window._2k2.Mini.isPlaying()) window._2k2.Mini.pause(); } catch (e) {}

    var idx = Math.min(Math.max(0, startIndex || 0), tracks.length - 1);
    var shuffle = false, repeat = false;
    var audio = ensureEngine().audio;

    function track(i) { return tracks[i]; }

    function setSrcAndMeta() {
      var t = track(idx);
      if (!t) return;
      engine.setSrc(t.src);
      coverArt.innerHTML = (t.art ? '<img src="' + t.art + '" alt="">' : '<i class="fas fa-headphones"></i>');
      titleEl.textContent = t.title || 'Audio';
      subEl.textContent = t.sub || '';
      renderList();
    }

    // ---- build DOM ----
    root.innerHTML =
      '<div class="k2-music-cover"><div class="k2-music-cover-art" id="k2mc-art"></div></div>' +
      '<div class="k2-music-info"><div class="k2-music-title" id="k2mc-title">-</div><div class="k2-music-sub" id="k2mc-sub"></div></div>' +
      '<div class="k2-music-progress">' +
        '<div class="k2-music-times"><span id="k2mc-now">0:00</span><span id="k2mc-total">0:00</span></div>' +
        '<div class="k2-music-seek" id="k2mc-seek"><div class="k2-music-seek-fill" id="k2mc-fill"></div></div>' +
      '</div>' +
      '<div class="k2-music-transport">' +
        '<button type="button" class="k2-music-btn k2-mp-toggle" id="k2mc-shuffle" title="Shuffle"><i class="fas fa-random"></i></button>' +
        '<button type="button" class="k2-music-btn k2-mp-skip" id="k2mc-prev" title="Previous"><i class="fas fa-step-backward"></i></button>' +
        '<button type="button" class="k2-music-btn k2-mp-play" id="k2mc-play" title="Play/Pause"><i class="fas fa-play"></i></button>' +
        '<button type="button" class="k2-music-btn k2-mp-skip" id="k2mc-next" title="Next"><i class="fas fa-step-forward"></i></button>' +
        '<button type="button" class="k2-music-btn k2-mp-toggle" id="k2mc-repeat" title="Repeat"><i class="fas fa-redo"></i></button>' +
      '</div>' +
      '<div class="k2-music-top"><span class="k2-speed" id="k2mc-speed">1x</span></div>' +
      '<div class="k2-music-playlist" id="k2mc-list"></div>';

    var coverArt = root.querySelector('#k2mc-art');
    var titleEl = root.querySelector('#k2mc-title');
    var subEl = root.querySelector('#k2mc-sub');
    var nowEl = root.querySelector('#k2mc-now');
    var totalEl = root.querySelector('#k2mc-total');
    var fillEl = root.querySelector('#k2mc-fill');
    var seekEl = root.querySelector('#k2mc-seek');
    var playBtn = root.querySelector('#k2mc-play');
    var prevBtn = root.querySelector('#k2mc-prev');
    var nextBtn = root.querySelector('#k2mc-next');
    var shuffleBtn = root.querySelector('#k2mc-shuffle');
    var repeatBtn = root.querySelector('#k2mc-repeat');
    var speedEl = root.querySelector('#k2mc-speed');

    function renderList() {
      var listEl = root.querySelector('#k2mc-list');
      listEl.innerHTML = tracks.map(function (t, i) {
        var current = i === idx;
        return '<div class="k2-music-track' + (current ? ' current' : '') + '" data-i="' + i + '">' +
          '<span class="k2-music-track-idx">' + (current ? '\u25b6' : (i + 1)) + '</span>' +
          '<span class="k2-music-track-miniart">' + (t.art ? '<img src="' + t.art + '" alt="">' : '<i class="fas fa-music"></i>') + '</span>' +
          '<span class="k2-music-track-meta"><span class="k2-music-track-name">' + (t.title || 'Track') + '</span><span class="k2-music-track-art">' + (t.sub || '') + '</span></span>' +
          '</div>';
      }).join('');
      listEl.querySelectorAll('.k2-music-track').forEach(function (rowEl) {
        rowEl.addEventListener('click', function () { idx = parseInt(rowEl.getAttribute('data-i'), 10); setSrcAndMeta(); play(); });
      });
    }

    function setMeta() { var d = audio.duration; if (isFinite(d) && d) totalEl.textContent = fmt(d); }
    function update() {
      var d = audio.duration || 0, c = audio.currentTime || 0;
      nowEl.textContent = fmt(c);
      if (d) fillEl.style.width = ((c / d) * 100) + '%';
    }
    function playing() { playBtn.innerHTML = '<i class="fas fa-pause"></i>'; }
    function paused() { playBtn.innerHTML = '<i class="fas fa-play"></i>'; renderList(); }
    audio.addEventListener('loadedmetadata', setMeta);
    audio.addEventListener('durationchange', setMeta);
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('progress', update);
    audio.addEventListener('play', playing);
    audio.addEventListener('pause', paused);
    audio.addEventListener('ended', onEnd);

    function nextIndex() {
      if (shuffle) { var r; do { r = Math.floor(Math.random() * tracks.length); } while (r === idx && tracks.length > 1); return r; }
      return (idx + 1) % tracks.length;
    }
    function onEnd() {
      if (repeat) { setSrcAndMeta(); play(); return; }
      var ni = nextIndex();
      if (ni === idx && !repeat && !shuffle) { return; } // single track, no wrap repeat
      idx = ni;
      setSrcAndMeta();
      play();
    }
    function play() { audio.play().catch(function () {}); }
    function toggle() { if (audio.paused) play(); else audio.pause(); }
    function seek(x, el) {
      var r = el.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (x - r.left) / r.width));
      if (audio.duration) audio.currentTime = p * audio.duration;
    }
    playBtn.addEventListener('click', toggle);
    prevBtn.addEventListener('click', function () { idx = (idx - 1 + tracks.length) % tracks.length; setSrcAndMeta(); play(); });
    nextBtn.addEventListener('click', function () { idx = nextIndex(); setSrcAndMeta(); play(); });
    shuffleBtn.addEventListener('click', function () { shuffle = !shuffle; shuffleBtn.classList.toggle('active', shuffle); });
    repeatBtn.addEventListener('click', function () { repeat = !repeat; repeatBtn.classList.toggle('active', repeat); });
    seekEl.addEventListener('click', function (e) { seek(e.clientX, seekEl); });
    seekEl.addEventListener('touchstart', function (e) { if (e.touches[0]) seek(e.touches[0].clientX, seekEl); });

    var speeds = [0.75, 1, 1.25, 1.5, 2];
    var si = 1;
    speedEl.addEventListener('click', function () { si = (si + 1) % speeds.length; audio.playbackRate = speeds[si]; speedEl.textContent = speeds[si] + 'x'; });

    setSrcAndMeta();
    return { el: root, play: play, pause: function () { audio.pause(); }, audio: audio };
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
      while (body.firstChild) { try { body.firstChild.remove(); } catch (e) { body.removeChild(body.firstChild); } }
      // keep audio running (persists in mini-independent engine) but clear bindings via load
      var a = (engine && engine.audio);
      if (a) { try { a.removeAttribute('ontimeupdate'); } catch (e) {} }
    };
    closeBtn.addEventListener('click', close);
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return m;
  }

  function openModalVideo(opts) {
    injectCss();
    var m = ensureModal();
    m.querySelector('.k2-media-modal-title').textContent = opts.title || 'Video';
    var body = m.querySelector('.k2-media-modal-body');
    body.innerHTML = '<div class="k2-media-video-wrap"></div>';
    m.classList.remove('hidden');
    var host = body.firstChild;
    var player = buildPlayer({ kind: 'video', src: opts.src, title: opts.title });
    host.appendChild(player.el);
    player.el.style.background = 'none';
    player.el.style.border = 'none';
    return m;
  }

  function openVideoPlayer(src, title) {
    if (!src) return;
    return openModalVideo({ src: src, title: title || 'Video' });
  }

  // Open phone-style music/podcast player. Accepts:
  //  - a single track {src,title,sub,art}
  //  - an array of tracks
  //  - { tracks: [...], title }
  function openPodcastPlayer(input) {
    var tracks = toTracks(input);
    if (!tracks.length) return;
    var startIndex = (input && typeof input === 'object' && typeof input.startIndex === 'number') ? input.startIndex : 0;
    return buildMusicPlayer(tracks, startIndex);
  }

  // ---------- global docked mini player ----------
  var mini = null;
  var miniEngine = null;
  var miniTracks = [];
  var miniIdx = 0;
  var miniShuffle = false;
  var miniProgressTimer = null;

  function buildMini() {
    if (mini) return;
    injectCss();
    mini = document.createElement('div');
    mini.className = 'k2-mini';
    mini.innerHTML =
      '<div class="k2-mini-progress" id="k2mp-fill"></div>' +
      '<div class="k2-mini-art"><i class="fas fa-podcast"></i></div>' +
      '<div class="k2-mini-meta"><div class="k2-mini-title"></div><div class="k2-mini-sub"></div></div>' +
      '<button type="button" class="k2-mini-btn k2-mini-prev"><i class="fas fa-step-backward"></i></button>' +
      '<button type="button" class="k2-mini-btn k2-mini-play"><i class="fas fa-play"></i></button>' +
      '<button type="button" class="k2-mini-btn k2-mini-next"><i class="fas fa-step-forward"></i></button>' +
      '<button type="button" class="k2-mini-btn k2-mini-open"><i class="fas fa-expand"></i></button>' +
      '<button type="button" class="k2-mini-btn k2-mini-close"><i class="fas fa-times"></i></button>';
    document.body.appendChild(mini);
    document.body.classList.add('k2-body-pad');
    mini.querySelector('.k2-mini-art').addEventListener('click', miniOpenFull);
    mini.querySelector('.k2-mini-meta').addEventListener('click', miniOpenFull);
    mini.querySelector('.k2-mini-open').addEventListener('click', miniOpenFull);
    mini.querySelector('.k2-mini-close').addEventListener('click', function () { Mini.stop(); });
    mini.querySelector('.k2-mini-play').addEventListener('click', miniToggle);
    mini.querySelector('.k2-mini-prev').addEventListener('click', function () { miniStep(-1); });
    mini.querySelector('.k2-mini-next').addEventListener('click', function () { miniStep(1); });
  }

  function miniRefreshMeta() {
    if (!mini) return;
    var t = miniTracks[miniIdx];
    if (!t) return;
    mini.querySelector('.k2-mini-title').textContent = t.title || 'Audio';
    mini.querySelector('.k2-mini-sub').textContent = t.sub || '';
    var art = mini.querySelector('.k2-mini-art');
    art.innerHTML = t.art ? '<img src="' + t.art + '" alt="">' : '<i class="fas fa-podcast"></i>';
  }
  function miniSetPlaying(p) {
    if (!mini) return;
    mini.querySelector('.k2-mini-play').innerHTML = p ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  }
  function miniProgress() {
    var fill = mini && mini.querySelector('#k2mp-fill');
    if (!fill || !miniEngine || !miniEngine.audio) { if (fill) fill.style.width = '0%'; return; }
    var d = miniEngine.audio.duration || 0, c = miniEngine.audio.currentTime || 0;
    fill.style.width = (d ? (c / d) * 100 : 0) + '%';
  }
  function miniLoad() {
    var t = miniTracks[miniIdx];
    if (!t) { Mini.stop(); return; }
    miniRefreshMeta();
    if (miniEngine) { miniEngine.destroy(); }
    miniEngine = ensureEngine();
    miniEngine.setSrc(t.src);
    if (miniEngine.__endBound) try { miniEngine.__end.removeEventListener('ended', miniEngine.__end); } catch (e) {}
    var endH = function () { if (miniTracks.length) { miniIdx = (miniIdx + 1) % miniTracks.length; miniLoad(); } };
    miniEngine.__end = endH;
    miniEngine.audio.addEventListener('ended', endH);
    miniEngine.audio.addEventListener('timeupdate', miniProgress);
    miniEngine.play();
    miniSetPlaying(true);
    if (miniProgressTimer) clearInterval(miniProgressTimer);
    miniProgressTimer = setInterval(miniProgress, 400);
  }
  function miniStep(dir) {
    if (!miniTracks.length) return;
    if (dir > 0) miniIdx = (miniIdx + 1) % miniTracks.length;
    else miniIdx = (miniIdx - 1 + miniTracks.length) % miniTracks.length;
    miniLoad();
  }
  function miniToggle() {
    if (!miniEngine) return;
    if (miniEngine.audio.paused) { miniEngine.play(); miniSetPlaying(true); }
    else { miniEngine.pause(); miniSetPlaying(false); }
  }
  function miniOpenFull() {
    openPodcastPlayer({ tracks: miniTracks, startIndex: miniIdx });
  }

  var Mini = {
    playTracks: function (list, index) {
      buildMini();
      var tracks = toTracks(list);
      if (!tracks.length) return;
      miniTracks = tracks;
      miniIdx = Math.min(Math.max(0, index || 0), tracks.length - 1);
      if (mini) mini.classList.add('open');
      miniLoad();
    },
    playTrack: function (t) { this.playTracks([t], 0); },
    pause: function () { if (miniEngine) { miniEngine.pause(); } miniSetPlaying(false); },
    play: function () { if (miniEngine) { miniEngine.play(); } miniSetPlaying(true); },
    stop: function () {
      if (miniProgressTimer) { clearInterval(miniProgressTimer); miniProgressTimer = null; }
      if (miniEngine) miniEngine.destroy();
      miniEngine = null;
      miniTracks = [];
      miniIdx = 0;
      if (mini) mini.classList.remove('open');
      miniSetPlaying(false);
    },
    isPlaying: function () { return !!(miniEngine && !miniEngine.audio.paused); }
  };

  // ---------- auto-upgrade helpers ----------
  function upgrade(container) {
    if (!container) return;
    var scope = container.nodeType === 1 ? container : document;
    var i;
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
    openMusicPlayer: openPodcastPlayer,
    buildPlayer: buildPlayer,
    upgrade: upgrade,
    init: function () { injectCss(); },
    Mini: Mini
  };
  window._2k2Media = _2k2.Media;
  window.openVideoPlayer = openVideoPlayer;
  window.openPodcastPlayer = openPodcastPlayer;
  window.playPodcast = Mini.playTrack;
})();
