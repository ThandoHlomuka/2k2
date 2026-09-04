// =============================================
// 2k2 - In-App Media Players (video + audio/podcast)
// YouTube-level video player + phone-style music player
// Features: double-tap skip, long-press 2x, swipe volume/brightness,
// fullscreen, PiP, keyboard shortcuts, sleep timer, buffering indicator,
// mobile responsive controls
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

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    return (h > 0 ? h + ':' + p(m) : m) + ':' + p(sec);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function toTracks(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input.filter(Boolean);
    if (input.tracks && Array.isArray(input.tracks)) return input.tracks.filter(Boolean);
    return [input];
  }

  // ---------- CSS ----------
  var css = '\n' +
    // Modal
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
    // Player card
    '.k2-player-card{width:100%;overflow:hidden;border-radius:14px;background:' + C.surface + ';border:1px solid rgba(212,168,83,.25);position:relative;}\n' +
    '.k2-player-card video,.k2-audio-stage{width:100%;display:block;background:#000;}\n' +
    // Video wrapper (gesture target)
    '.k2-vid-wrap{position:relative;background:#000;overflow:hidden;}\n' +
    '.k2-vid-wrap video{width:100%;display:block;}\n' +
    // Gesture layer
    '.k2-gesture{position:absolute;inset:0;z-index:2;}\n' +
    // Title overlay
    '.k2-vid-title{position:absolute;top:0;left:0;right:0;padding:28px 14px 18px;background:linear-gradient(rgba(0,0,0,.7),transparent);z-index:3;color:' + C.text + ';font-weight:700;font-size:.88rem;pointer-events:none;transition:opacity .3s;}\n' +
    // Center play button
    '.k2-center-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60px;height:60px;background:rgba(0,0,0,.45);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.4rem;z-index:5;cursor:pointer;transition:transform .2s,opacity .25s;border:2px solid rgba(255,255,255,.25);}\n' +
    '.k2-center-play:active{transform:translate(-50%,-50%) scale(.92);}\n' +
    '.k2-center-play.hidden{opacity:0;pointer-events:none;}\n' +
    // Buffering spinner
    '.k2-spinner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;z-index:4;pointer-events:none;}\n' +
    '.k2-spinner.hidden{display:none;}\n' +
    '.k2-spinner-ring{width:100%;height:100%;border:3px solid rgba(255,255,255,.15);border-top-color:' + C.pri + ';border-radius:50%;animation:k2spin .7s linear infinite;}\n' +
    '@keyframes k2spin{to{transform:rotate(360deg)}}\n' +
    // Skip ±10s buttons (left/right of center)
    '.k2-skip-zone{position:absolute;top:0;width:50%;height:100%;z-index:4;display:flex;align-items:center;justify-content:center;pointer-events:none;}\n' +
    '.k2-skip-left{left:0;justify-content:flex-start;padding-left:18%;}\n' +
    '.k2-skip-right{right:0;justify-content:flex-end;padding-right:18%;}\n' +
    '.k2-skip-zone .k2-skip-ico{width:44px;height:44px;background:rgba(0,0,0,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:.85rem;opacity:0;transition:opacity .15s;}\n' +
    '.k2-skip-zone:active .k2-skip-ico{opacity:1;transform:scale(.9);}\n' +
    // Double-tap animation
    '.k2-dtap-anim{position:absolute;top:50%;transform:translateY(-50%);width:50px;height:50px;background:rgba(0,0,0,.55);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:.75rem;font-weight:800;z-index:6;pointer-events:none;opacity:0;}\n' +
    '.k2-dtap-left{left:22%;}\n' +
    '.k2-dtap-right{right:22%;}\n' +
    '.k2-dtap-anim.show{animation:k2dtapPop .65s ease-out forwards;}\n' +
    '@keyframes k2dtapPop{0%{opacity:.95;transform:translateY(-50%) scale(.6);}60%{opacity:.7;}100%{opacity:0;transform:translateY(-50%) scale(1.3);}}\n' +
    // Long-press speed badge
    '.k2-speed-badge{position:absolute;top:12px;right:12px;background:' + C.pri + ';color:#211a0d;font-weight:800;font-size:.72rem;padding:3px 10px;border-radius:6px;z-index:7;opacity:0;transition:opacity .2s;pointer-events:none;}\n' +
    '.k2-speed-badge.show{opacity:1;}\n' +
    // Volume/brightness indicator
    '.k2-adj-indicator{position:absolute;top:8%;width:38px;height:84%;z-index:6;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;}\n' +
    '.k2-adj-indicator.show{opacity:1;}\n' +
    '.k2-adj-indicator.left{left:6%;}\n' +
    '.k2-adj-indicator.right{right:6%;}\n' +
    '.k2-adj-indicator .k2-adj-icon{color:white;font-size:.9rem;margin-bottom:8px;}\n' +
    '.k2-adj-indicator .k2-adj-bar{width:4px;height:60%;background:rgba(255,255,255,.15);border-radius:99px;position:relative;}\n' +
    '.k2-adj-indicator .k2-adj-fill{position:absolute;bottom:0;width:100%;background:' + C.pri + ';border-radius:99px;transition:height .08s;}\n' +
    '.k2-adj-indicator .k2-adj-val{color:white;font-size:.65rem;margin-top:8px;font-weight:700;}\n' +
    // Controls bar
    '.k2-controls{display:flex;flex-direction:column;gap:0;padding:0 10px 6px;background:linear-gradient(transparent,rgba(0,0,0,.85));}\n' +
    '.k2-seek-wrap{width:100%;padding:8px 0;position:relative;cursor:pointer;}\n' +
    '.k2-seek{width:100%;height:4px;background:rgba(255,255,255,.15);border-radius:99px;position:relative;transition:height .12s;}\n' +
    '.k2-seek-wrap:hover .k2-seek,.k2-seek.dragging{height:6px;}\n' +
    '.k2-seek-buffered{position:absolute;left:0;top:0;bottom:0;background:rgba(255,255,255,.2);border-radius:99px;}\n' +
    '.k2-seek-fill{position:absolute;left:0;top:0;bottom:0;background:' + C.pri + ';border-radius:99px;}\n' +
    '.k2-seek-thumb{position:absolute;top:50%;width:14px;height:14px;background:' + C.pri + ';border-radius:50%;transform:translate(-50%,-50%);opacity:0;transition:opacity .15s;z-index:1;}\n' +
    '.k2-seek-wrap:hover .k2-seek-thumb{opacity:1;}\n' +
    '.k2-controls-row{display:flex;align-items:center;gap:4px;color:' + C.text + ';}\n' +
    '.k2-btn{background:transparent;border:none;color:' + C.text + ';cursor:pointer;font-size:1rem;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:.15s;flex-shrink:0;}\n' +
    '.k2-btn:hover{background:rgba(255,255,255,.1);}\n' +
    '.k2-btn.k2-play{background:' + C.pri + ';color:#211a0d;border-radius:50%;font-size:.85rem;}\n' +
    '.k2-btn.k2-play:hover{background:#e0b45f;transform:scale(1.06);}\n' +
    '.k2-time{font-size:.72rem;color:' + C.muted + ';font-variant-numeric:tabular-nums;white-space:nowrap;min-width:36px;text-align:center;}\n' +
    '.k2-vol-wrap{display:flex;align-items:center;gap:4px;}\n' +
    '.k2-vol{width:60px;height:4px;background:rgba(255,255,255,.15);border-radius:99px;position:relative;cursor:pointer;}\n' +
    '.k2-vol-fill{position:absolute;left:0;top:0;bottom:0;width:100%;background:' + C.text + ';border-radius:99px;}\n' +
    '.k2-speed{font-size:.7rem;color:' + C.muted + ';cursor:pointer;padding:4px 8px;border-radius:8px;white-space:nowrap;flex-shrink:0;}\n' +
    '.k2-speed:hover{color:' + C.text + ';background:rgba(255,255,255,.08);}\n' +
    '.k2-controls-spacer{flex:1;}\n' +
    // Sleep timer menu
    '.k2-sleep-menu{position:absolute;bottom:100%;right:0;background:' + C.surface + ';border:1px solid rgba(212,168,83,.3);border-radius:10px;padding:6px 0;min-width:140px;z-index:10;margin-bottom:6px;}\n' +
    '.k2-sleep-item{padding:8px 14px;color:' + C.text + ';font-size:.8rem;cursor:pointer;}\n' +
    '.k2-sleep-item:hover{background:rgba(212,168,83,.1);}\n' +
    '.k2-sleep-item.active{color:' + C.pri + ';}\n' +
    // Audio stage
    '.k2-audio-stage{padding:18px 16px 8px;display:flex;align-items:center;gap:16px;}\n' +
    '.k2-audio-art{width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;color:#211a0d;font-size:1.3rem;flex-shrink:0;}\n' +
    '.k2-audio-art img{width:100%;height:100%;object-fit:cover;border-radius:12px;}\n' +
    '.k2-audio-meta{flex:1;min-width:0;}\n' +
    '.k2-audio-title{color:' + C.text + ';font-weight:700;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-audio-sub{color:' + C.muted + ';font-size:.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    // Phone-style music player
    '.k2-music-player{background:linear-gradient(160deg,' + C.surface2 + ',' + C.bg + ');border:1px solid rgba(212,168,83,.3);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;max-height:86vh;}\n' +
    '.k2-music-cover{display:flex;align-items:center;justify-content:center;padding:22px 22px 12px;}\n' +
    '.k2-music-cover-art{width:min(200px,40vw);height:min(200px,40vw);border-radius:18px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;color:#211a0d;font-size:3rem;box-shadow:0 18px 40px rgba(0,0,0,.5);}\n' +
    '.k2-music-cover-art img{width:100%;height:100%;object-fit:cover;border-radius:18px;}\n' +
    '.k2-music-info{text-align:center;padding:6px 22px 4px;}\n' +
    '.k2-music-title{color:' + C.text + ';font-size:1.15rem;font-weight:800;}\n' +
    '.k2-music-sub{color:' + C.muted + ';font-size:.85rem;margin-top:4px;}\n' +
    '.k2-music-progress{padding:16px 22px 4px;}\n' +
    '.k2-music-times{display:flex;justify-content:space-between;font-size:.74rem;color:' + C.muted + ';margin-bottom:8px;font-variant-numeric:tabular-nums;}\n' +
    '.k2-music-seek{height:5px;background:rgba(255,255,255,.15);border-radius:99px;position:relative;cursor:pointer;}\n' +
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
    '.k2-music-track-idx{width:26px;text-align:center;color:' + C.muted + ';font-size:.8rem;flex-shrink:0;}\n' +
    '.k2-music-track.current .k2-music-track-idx{color:' + C.pri + ';}\n' +
    '.k2-music-track-miniart{width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0;color:#211a0d;}\n' +
    '.k2-music-track-miniart img{width:100%;height:100%;object-fit:cover;border-radius:8px;}\n' +
    '.k2-music-track-meta{flex:1;min-width:0;}\n' +
    '.k2-music-track-name{color:' + C.text + ';font-size:.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-music-track-art{color:' + C.muted + ';font-size:.74rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-music-track-len{color:' + C.muted + ';font-size:.72rem;flex-shrink:0;font-variant-numeric:tabular-nums;}\n' +
    // Mini player
    '.k2-mini{position:fixed;left:0;right:0;bottom:0;z-index:99000;background:' + C.surface2 + ';border-top:1px solid rgba(212,168,83,.35);box-shadow:0 -8px 24px rgba(0,0,0,.4);padding:10px 16px;display:flex;align-items:center;gap:12px;color:' + C.text + ';transform:translateY(110%);transition:transform .25s ease;overflow:hidden;}\n' +
    '.k2-mini.open{transform:translateY(0);}\n' +
    '.k2-mini-art{width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,' + C.pri + ',#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.9rem;cursor:pointer;}\n' +
    '.k2-mini-art img{width:100%;height:100%;object-fit:cover;border-radius:8px;}\n' +
    '.k2-mini-meta{flex:1;min-width:0;cursor:pointer;}\n' +
    '.k2-mini-title{font-size:.82rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-mini-sub{font-size:.72rem;color:' + C.muted + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
    '.k2-mini-progress{position:absolute;left:0;top:0;height:3px;background:' + C.pri + ';width:0%;}\n' +
    '.k2-mini-btn{background:transparent;border:none;color:' + C.text + ';cursor:pointer;font-size:1rem;width:32px;height:32px;display:flex;align-items:center;justify-content:center;}\n' +
    '.k2-mini-btn:hover{color:' + C.pri + ';}\n' +
    '.k2-mini-close{color:' + C.muted + '}\n' +
    '.k2-body-pad{padding-bottom:76px;}\n' +
    // Fullscreen styles
    '.k2-player-card:fullscreen{border-radius:0;border:none;}\n' +
    '.k2-player-card:fullscreen .k2-vid-wrap{border-radius:0;}\n' +
    '.k2-player-card:fullscreen video{max-height:100vh;}\n' +
    '.k2-player-card:-webkit-full-screen{border-radius:0;border:none;}\n' +
    // Mobile responsive
    '@media(max-width:768px){\n' +
    '.k2-btn{width:30px;height:30px;font-size:.85rem;}\n' +
    '.k2-controls{padding:0 6px 4px;}\n' +
    '.k2-vol-wrap{display:none;}\n' +
    '.k2-speed{font-size:.6rem;padding:2px 5px;}\n' +
    '.k2-time{font-size:.65rem;min-width:28px;}\n' +
    '.k2-seek-wrap{padding:10px 0;}\n' +
    '.k2-center-play{width:50px;height:50px;font-size:1.15rem;}\n' +
    '.k2-skip-zone .k2-skip-ico{width:38px;height:38px;font-size:.75rem;}\n' +
    '.k2-music-cover-art{width:min(160px,50vw);height:min(160px,50vw);}\n' +
    '.k2-music-transport{gap:16px;padding:12px 16px;}\n' +
    '.k2-music-btn.k2-mp-play{width:52px;height:52px;}\n' +
    '}\n';

  function injectCss() {
    if (document.getElementById('k2-media-css')) return;
    var el = document.createElement('style');
    el.id = 'k2-media-css';
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ---------- YOUTUBE-LEVEL VIDEO PLAYER ----------
  function buildPlayer(opts) {
    injectCss();
    var wrap = document.createElement('div');
    wrap.className = 'k2-player-card';

    if (opts.kind === 'audio') {
      return buildAudioPlayer(opts, wrap);
    }

    // --- VIDEO PLAYER ---
    var vidWrap = document.createElement('div');
    vidWrap.className = 'k2-vid-wrap';

    var media = document.createElement('video');
    media.preload = 'metadata';
    media.setAttribute('playsinline', '');
    media.setAttribute('controlslist', 'nodownload');
    media.style.maxHeight = '74vh';
    media.src = opts.src;

    vidWrap.appendChild(media);

    // Title overlay
    var titleEl = document.createElement('div');
    titleEl.className = 'k2-vid-title';
    titleEl.textContent = opts.title || '';
    vidWrap.appendChild(titleEl);

    // Center play
    var centerPlay = document.createElement('div');
    centerPlay.className = 'k2-center-play';
    centerPlay.innerHTML = '<i class="fas fa-play" style="margin-left:3px"></i>';
    vidWrap.appendChild(centerPlay);

    // Buffering spinner
    var spinner = document.createElement('div');
    spinner.className = 'k2-spinner hidden';
    spinner.innerHTML = '<div class="k2-spinner-ring"></div>';
    vidWrap.appendChild(spinner);

    // Skip zones (mobile tap targets)
    var skipLeft = document.createElement('div');
    skipLeft.className = 'k2-skip-zone k2-skip-left';
    skipLeft.innerHTML = '<div class="k2-skip-ico"><i class="fas fa-undo"></i></div>';
    vidWrap.appendChild(skipLeft);

    var skipRight = document.createElement('div');
    skipRight.className = 'k2-skip-zone k2-skip-right';
    skipRight.innerHTML = '<div class="k2-skip-ico"><i class="fas fa-redo"></i></div>';
    vidWrap.appendChild(skipRight);

    // Double-tap animation elements
    var dtapLeft = document.createElement('div');
    dtapLeft.className = 'k2-dtap-anim k2-dtap-left';
    dtapLeft.innerHTML = '<i class="fas fa-undo" style="font-size:1rem"></i><span style="font-size:.6rem;margin-top:2px">10s</span>';
    dtapLeft.style.flexDirection = 'column';
    vidWrap.appendChild(dtapLeft);

    var dtapRight = document.createElement('div');
    dtapRight.className = 'k2-dtap-anim k2-dtap-right';
    dtapRight.innerHTML = '<i class="fas fa-redo" style="font-size:1rem"></i><span style="font-size:.6rem;margin-top:2px">10s</span>';
    dtapRight.style.flexDirection = 'column';
    vidWrap.appendChild(dtapRight);

    // Speed badge (long-press indicator)
    var speedBadge = document.createElement('div');
    speedBadge.className = 'k2-speed-badge';
    speedBadge.textContent = '2x';
    vidWrap.appendChild(speedBadge);

    // Volume/brightness indicators
    var volIndicator = document.createElement('div');
    volIndicator.className = 'k2-adj-indicator left';
    volIndicator.innerHTML = '<div class="k2-adj-icon"><i class="fas fa-volume-up"></i></div><div class="k2-adj-bar"><div class="k2-adj-fill" style="height:100%"></div></div><div class="k2-adj-val">100%</div>';
    vidWrap.appendChild(volIndicator);

    var brightIndicator = document.createElement('div');
    brightIndicator.className = 'k2-adj-indicator right';
    brightIndicator.innerHTML = '<div class="k2-adj-icon"><i class="fas fa-sun"></i></div><div class="k2-adj-bar"><div class="k2-adj-fill" style="height:100%"></div></div><div class="k2-adj-val">100%</div>';
    vidWrap.appendChild(brightIndicator);

    wrap.appendChild(vidWrap);

    // Gesture layer
    var gesture = document.createElement('div');
    gesture.className = 'k2-gesture';
    vidWrap.appendChild(gesture);

    // Controls bar
    var controls = document.createElement('div');
    controls.className = 'k2-controls';
    controls.innerHTML =
      '<div class="k2-seek-wrap"><div class="k2-seek"><div class="k2-seek-buffered"></div><div class="k2-seek-fill"></div><div class="k2-seek-thumb"></div></div></div>' +
      '<div class="k2-controls-row">' +
        '<button type="button" class="k2-btn k2-play" aria-label="Play/Pause"><i class="fas fa-play"></i></button>' +
        '<button type="button" class="k2-btn k2-back10" title="Back 10s"><i class="fas fa-undo" style="font-size:.75rem"></i><span style="font-size:.55rem;font-weight:800;position:absolute;margin-top:2px">10</span></button>' +
        '<button type="button" class="k2-btn k2-fwd10" title="Forward 10s"><i class="fas fa-redo" style="font-size:.75rem"></i><span style="font-size:.55rem;font-weight:800;position:absolute;margin-top:2px">10</span></button>' +
        '<span class="k2-time k2-now">0:00</span>' +
        '<span class="k2-time">/</span>' +
        '<span class="k2-time k2-total">0:00</span>' +
        '<div class="k2-controls-spacer"></div>' +
        '<div class="k2-vol-wrap">' +
          '<button type="button" class="k2-btn k2-mute"><i class="fas fa-volume-up"></i></button>' +
          '<div class="k2-vol"><div class="k2-vol-fill"></div></div>' +
        '</div>' +
        '<span class="k2-speed" title="Playback speed">1x</span>' +
        '<button type="button" class="k2-btn k2-pip" title="Picture-in-Picture"><i class="fas fa-external-link-alt" style="font-size:.75rem"></i></button>' +
        '<button type="button" class="k2-btn k2-sleep-btn" title="Sleep timer"><i class="fas fa-moon" style="font-size:.8rem"></i></button>' +
        '<button type="button" class="k2-btn k2-fs" title="Fullscreen"><i class="fas fa-expand"></i></button>' +
      '</div>';
    wrap.appendChild(controls);

    // Sleep menu
    var sleepMenu = document.createElement('div');
    sleepMenu.className = 'k2-sleep-menu';
    sleepMenu.style.display = 'none';
    sleepMenu.innerHTML = '<div class="k2-sleep-item" data-min="0">Off</div><div class="k2-sleep-item" data-min="15">15 min</div><div class="k2-sleep-item" data-min="30">30 min</div><div class="k2-sleep-item" data-min="45">45 min</div><div class="k2-sleep-item" data-min="60">1 hour</div><div class="k2-sleep-item" data-min="90">1.5 hours</div>';
    wrap.appendChild(sleepMenu);

    // --- Element refs ---
    var playBtn = controls.querySelector('.k2-play');
    var nowEl = controls.querySelector('.k2-now');
    var totalEl = controls.querySelector('.k2-total');
    var seekWrap = controls.querySelector('.k2-seek-wrap');
    var seekEl = controls.querySelector('.k2-seek');
    var seekFill = controls.querySelector('.k2-seek-fill');
    var seekBuffered = controls.querySelector('.k2-seek-buffered');
    var seekThumb = controls.querySelector('.k2-seek-thumb');
    var muteBtn = controls.querySelector('.k2-mute');
    var volEl = controls.querySelector('.k2-vol');
    var volFill = controls.querySelector('.k2-vol-fill');
    var speedEl = controls.querySelector('.k2-speed');
    var pipBtn = controls.querySelector('.k2-pip');
    var fsBtn = controls.querySelector('.k2-fs');
    var sleepBtn = controls.querySelector('.k2-sleep-btn');
    var back10Btn = controls.querySelector('.k2-back10');
    var fwd10Btn = controls.querySelector('.k2-fwd10');

    // --- State ---
    var controlsTimer = null;
    var sleepTimer = null;
    var sleepMinutes = 0;
    var prevSpeed = 1;
    var isLongPress = false;
    var longPressTimer = null;
    var gestureStartY = 0;
    var gestureStartX = 0;
    var gestureSwiping = false;
    var gestureSide = '';
    var gestureStartVol = 1;
    var gestureStartBright = 1;
    var lastTapTime = 0;
    var lastTapX = 0;
    var tapCount = 0;
    var tapTimer = null;

    // --- Media events ---
    function setMeta() { var d = media.duration; if (isFinite(d) && d) totalEl.textContent = fmt(d); }
    media.addEventListener('loadedmetadata', setMeta);
    media.addEventListener('durationchange', setMeta);

    function update() {
      var d = media.duration || 0, c = media.currentTime || 0;
      nowEl.textContent = fmt(c);
      if (d) {
        var pct = (c / d) * 100;
        seekFill.style.width = pct + '%';
        seekThumb.style.left = pct + '%';
      }
    }
    media.addEventListener('timeupdate', update);

    function updateBuffered() {
      if (media.buffered.length > 0) {
        var d = media.duration || 1;
        seekBuffered.style.width = (media.buffered.end(media.buffered.length - 1) / d * 100) + '%';
      }
    }
    media.addEventListener('progress', updateBuffered);
    media.addEventListener('timeupdate', updateBuffered);

    function playing() { playBtn.innerHTML = '<i class="fas fa-pause"></i>'; centerPlay.classList.add('hidden'); }
    function paused() { playBtn.innerHTML = '<i class="fas fa-play"></i>'; centerPlay.classList.remove('hidden'); }
    media.addEventListener('play', playing);
    media.addEventListener('pause', paused);
    media.addEventListener('ended', function () { paused(); media.currentTime = 0; });

    media.addEventListener('waiting', function () { spinner.classList.remove('hidden'); });
    media.addEventListener('canplay', function () { spinner.classList.add('hidden'); });
    media.addEventListener('playing', function () { spinner.classList.add('hidden'); });

    // --- Controls visibility ---
    function showControls() {
      controls.style.opacity = '1';
      titleEl.style.opacity = '1';
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(function () {
        if (!media.paused) {
          controls.style.opacity = '0';
          titleEl.style.opacity = '0';
        }
      }, 3500);
    }
    controls.style.transition = 'opacity .3s';
    titleEl.style.transition = 'opacity .3s';

    // --- Play/pause ---
    function togglePlay() {
      if (media.paused) {
        try { if (window._2k2.Mini) window._2k2.Mini.pause(); } catch (e) {}
        media.play().catch(function () {});
        showControls();
      } else {
        media.pause();
      }
    }
    playBtn.addEventListener('click', togglePlay);
    centerPlay.addEventListener('click', togglePlay);

    // --- Seek ---
    function seekAt(x) {
      var r = seekWrap.getBoundingClientRect();
      var p = clamp((x - r.left) / r.width, 0, 1);
      if (media.duration) media.currentTime = p * media.duration;
    }
    var seekDragging = false;
    seekWrap.addEventListener('mousedown', function (e) { seekDragging = true; seekAt(e.clientX); });
    seekWrap.addEventListener('touchstart', function (e) { seekDragging = true; if (e.touches[0]) seekAt(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('mousemove', function (e) { if (seekDragging) seekAt(e.clientX); });
    document.addEventListener('touchmove', function (e) { if (seekDragging && e.touches[0]) seekAt(e.touches[0].clientX); }, { passive: true });
    function seekEnd() { seekDragging = false; seekEl.classList.remove('dragging'); }
    document.addEventListener('mouseup', seekEnd);
    document.addEventListener('touchend', seekEnd);

    // --- Skip ±10s buttons ---
    function skipBy(sec) {
      if (media.duration) media.currentTime = clamp(media.currentTime + sec, 0, media.duration);
      showControls();
    }
    back10Btn.addEventListener('click', function () { skipBy(-10); });
    fwd10Btn.addEventListener('click', function () { skipBy(10); });

    // --- Volume ---
    function mute() {
      media.muted = !media.muted;
      muteBtn.innerHTML = media.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
    muteBtn.addEventListener('click', mute);
    volEl.addEventListener('click', function (e) {
      var r = volEl.getBoundingClientRect();
      var p = clamp((e.clientX - r.left) / r.width, 0, 1);
      media.volume = p; media.muted = false;
      volFill.style.width = (p * 100) + '%';
      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    });

    // --- Speed ---
    var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    var si = 2;
    speedEl.addEventListener('click', function () {
      si = (si + 1) % speeds.length;
      media.playbackRate = speeds[si];
      speedEl.textContent = speeds[si] + 'x';
    });

    // --- Fullscreen ---
    function toggleFullscreen() {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        fsBtn.innerHTML = '<i class="fas fa-expand"></i>';
      } else {
        var el = wrap;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        fsBtn.innerHTML = '<i class="fas fa-compress"></i>';
      }
    }
    fsBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', function () {
      fsBtn.innerHTML = document.fullscreenElement ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
    });

    // --- Picture-in-Picture ---
    pipBtn.addEventListener('click', function () {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(function () {});
      } else if (media.requestPictureInPicture) {
        media.requestPictureInPicture().catch(function () {});
      }
    });

    // --- Sleep timer ---
    sleepBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      sleepMenu.style.display = sleepMenu.style.display === 'none' ? '' : 'none';
    });
    sleepMenu.querySelectorAll('.k2-sleep-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        var min = parseInt(item.dataset.min, 10);
        sleepMinutes = min;
        sleepMenu.style.display = 'none';
        sleepMenu.querySelectorAll('.k2-sleep-item').forEach(function (i) { i.classList.remove('active'); });
        if (min > 0) {
          item.classList.add('active');
          if (sleepTimer) clearTimeout(sleepTimer);
          sleepTimer = setTimeout(function () {
            media.pause();
            sleepMinutes = 0;
            sleepMenu.querySelectorAll('.k2-sleep-item').forEach(function (i) { i.classList.remove('active'); });
          }, min * 60 * 1000);
        } else {
          if (sleepTimer) clearTimeout(sleepTimer);
          sleepTimer = null;
        }
      });
    });
    document.addEventListener('click', function () { sleepMenu.style.display = 'none'; });

    // --- Keyboard shortcuts ---
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      var k = e.key;
      if (k === ' ' || k === 'k' || k === 'K') { e.preventDefault(); togglePlay(); }
      else if (k === 'ArrowLeft') { e.preventDefault(); skipBy(-5); }
      else if (k === 'ArrowRight') { e.preventDefault(); skipBy(5); }
      else if (k === 'ArrowUp') { e.preventDefault(); media.volume = clamp(media.volume + 0.05, 0, 1); volFill.style.width = (media.volume * 100) + '%'; media.muted = false; showControls(); }
      else if (k === 'ArrowDown') { e.preventDefault(); media.volume = clamp(media.volume - 0.05, 0, 1); volFill.style.width = (media.volume * 100) + '%'; showControls(); }
      else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFullscreen(); }
      else if (k === 'm' || k === 'M') { e.preventDefault(); mute(); }
      else if (k === 'j' || k === 'J') { e.preventDefault(); skipBy(-10); }
      else if (k === 'l' || k === 'L') { e.preventDefault(); skipBy(10); }
      else if (k === '<' || k === ',') { e.preventDefault(); si = Math.max(0, si - 1); media.playbackRate = speeds[si]; speedEl.textContent = speeds[si] + 'x'; }
      else if (k === '>' || k === '.') { e.preventDefault(); si = Math.min(speeds.length - 1, si + 1); media.playbackRate = speeds[si]; speedEl.textContent = speeds[si] + 'x'; }
      else if (k >= '0' && k <= '9' && media.duration) { e.preventDefault(); media.currentTime = (parseInt(k) / 10) * media.duration; }
    }
    wrap._k2KeyHandler = onKey;
    document.addEventListener('keydown', onKey);

    // --- Touch gestures ---
    function getTouchSide(x) {
      var r = vidWrap.getBoundingClientRect();
      return (x - r.left) / r.width < 0.5 ? 'left' : 'right';
    }

    gesture.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      var t = e.touches[0];
      gestureStartX = t.clientX;
      gestureStartY = t.clientY;
      gestureSwiping = false;
      gestureSide = '';
      gestureStartVol = media.volume;
      // Detect double-tap
      var now = Date.now();
      var side = getTouchSide(t.clientX);
      if (now - lastTapTime < 300 && Math.abs(t.clientX - lastTapX) < 60) {
        tapCount++;
      } else {
        tapCount = 1;
      }
      lastTapTime = now;
      lastTapX = t.clientX;

      // Long press detection
      isLongPress = false;
      clearTimeout(longPressTimer);
      longPressTimer = setTimeout(function () {
        isLongPress = true;
        prevSpeed = media.playbackRate;
        media.playbackRate = 2;
        speedBadge.textContent = '2x';
        speedBadge.classList.add('show');
      }, 500);
    }, { passive: true });

    gesture.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 1) return;
      var t = e.touches[0];
      var dx = t.clientX - gestureStartX;
      var dy = t.clientY - gestureStartY;

      if (!gestureSwiping && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        gestureSwiping = true;
        gestureSide = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'seek' : 'seek') : getTouchSide(gestureStartX);
        clearTimeout(longPressTimer);
      }

      if (gestureSwiping) {
        e.preventDefault();
        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical swipe
          var r = vidWrap.getBoundingClientRect();
          var pct = clamp(-dy / r.height, -1, 1);
          if (gestureSide === 'left') {
            // Volume
            media.volume = clamp(gestureStartVol + pct, 0, 1);
            media.muted = false;
            volFill.style.width = (media.volume * 100) + '%';
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volIndicator.querySelector('.k2-adj-fill').style.height = (media.volume * 100) + '%';
            volIndicator.querySelector('.k2-adj-val').textContent = Math.round(media.volume * 100) + '%';
            volIndicator.classList.add('show');
          } else {
            // Brightness (CSS filter)
            var b = clamp(gestureStartBright + pct, 0.2, 1);
            media.style.filter = 'brightness(' + b + ')';
            brightIndicator.querySelector('.k2-adj-fill').style.height = (b * 100) + '%';
            brightIndicator.querySelector('.k2-adj-val').textContent = Math.round(b * 100) + '%';
            brightIndicator.classList.add('show');
          }
        }
      }

      // Cancel long-press if moved
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        clearTimeout(longPressTimer);
      }
    }, { passive: false });

    gesture.addEventListener('touchend', function (e) {
      clearTimeout(longPressTimer);

      // Restore long-press speed
      if (isLongPress) {
        isLongPress = false;
        media.playbackRate = prevSpeed;
        speedBadge.classList.remove('show');
      }

      // Hide indicators
      setTimeout(function () {
        volIndicator.classList.remove('show');
        brightIndicator.classList.remove('show');
      }, 300);

      // Handle double-tap
      if (!gestureSwiping && tapCount >= 2) {
        var side = getTouchSide(lastTapX);
        var dtapEl = side === 'left' ? dtapLeft : dtapRight;
        dtapEl.classList.remove('show');
        void dtapEl.offsetWidth; // reflow
        dtapEl.classList.add('show');
        setTimeout(function () { dtapEl.classList.remove('show'); }, 700);
        skipBy(side === 'left' ? -10 : 10);
        tapCount = 0;
      } else if (!gestureSwiping && tapCount === 1) {
        // Single tap: toggle controls
        setTimeout(function () {
          if (Date.now() - lastTapTime >= 280) {
            if (controls.style.opacity === '0' || !controls.style.opacity) {
              showControls();
            } else {
              controls.style.opacity = '0';
              titleEl.style.opacity = '0';
            }
          }
        }, 300);
      }

      if (!gestureSwiping) { tapCount = 0; }
      gestureSwiping = false;
    }, { passive: true });

    // Show controls on mouse move
    vidWrap.addEventListener('mousemove', showControls);
    vidWrap.addEventListener('mouseenter', showControls);

    // Destroy helper
    function destroy() {
      try { media.pause(); } catch (e) {}
      document.removeEventListener('keydown', onKey);
      if (sleepTimer) clearTimeout(sleepTimer);
      media.removeAttribute('src');
      wrap.innerHTML = '';
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    showControls();
    return { el: wrap, media: media, play: togglePlay, destroy: destroy };
  }

  // --- AUDIO PLAYER (kept from original) ---
  function buildAudioPlayer(opts, wrap) {
    var media = document.createElement('audio');
    media.preload = 'metadata';
    var stage = document.createElement('div');
    stage.className = 'k2-audio-stage';
    stage.innerHTML =
      '<div class="k2-audio-art">' + (opts.art ? '<img src="' + opts.art + '" alt="">' : '<i class="fas fa-podcast"></i>') + '</div>' +
      '<div class="k2-audio-meta"><div class="k2-audio-title">' + (opts.title || 'Audio') + '</div><div class="k2-audio-sub">' + (opts.sub || '') + '</div></div>';
    wrap.appendChild(stage);
    wrap.appendChild(media);
    media.src = opts.src;

    var controls = document.createElement('div');
    controls.className = 'k2-controls';
    controls.innerHTML =
      '<div class="k2-seek-wrap"><div class="k2-seek"><div class="k2-seek-buffered"></div><div class="k2-seek-fill"></div><div class="k2-seek-thumb"></div></div></div>' +
      '<div class="k2-controls-row">' +
        '<button type="button" class="k2-btn k2-play" aria-label="Play/Pause"><i class="fas fa-play"></i></button>' +
        '<span class="k2-time k2-now">0:00</span>' +
        '<span class="k2-time">/</span>' +
        '<span class="k2-time k2-total">0:00</span>' +
        '<div class="k2-controls-spacer"></div>' +
        '<button type="button" class="k2-btn k2-mute"><i class="fas fa-volume-up"></i></button>' +
        '<div class="k2-vol-wrap"><div class="k2-vol"><div class="k2-vol-fill"></div></div></div>' +
        '<span class="k2-speed">1x</span>' +
      '</div>';
    wrap.appendChild(controls);

    var playBtn = controls.querySelector('.k2-play');
    var nowEl = controls.querySelector('.k2-now');
    var totalEl = controls.querySelector('.k2-total');
    var seekWrap = controls.querySelector('.k2-seek-wrap');
    var seekFill = controls.querySelector('.k2-seek-fill');
    var seekBuffered = controls.querySelector('.k2-seek-buffered');
    var seekThumb = controls.querySelector('.k2-seek-thumb');
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
      if (d) { var pct = (c / d) * 100; seekFill.style.width = pct + '%'; seekThumb.style.left = pct + '%'; }
    }
    media.addEventListener('timeupdate', update);

    function updateBuffered() {
      if (media.buffered.length > 0) {
        seekBuffered.style.width = (media.buffered.end(media.buffered.length - 1) / (media.duration || 1) * 100) + '%';
      }
    }
    media.addEventListener('progress', updateBuffered);

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

    function seekAt(x) {
      var r = seekWrap.getBoundingClientRect();
      var p = clamp((x - r.left) / r.width, 0, 1);
      if (media.duration) media.currentTime = p * media.duration;
    }
    seekWrap.addEventListener('click', function (e) { seekAt(e.clientX); });
    seekWrap.addEventListener('touchstart', function (e) { if (e.touches[0]) seekAt(e.touches[0].clientX); }, { passive: true });

    function mute() { media.muted = !media.muted; muteBtn.innerHTML = media.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>'; }
    muteBtn.addEventListener('click', mute);
    volEl.addEventListener('click', function (e) {
      var r = volEl.getBoundingClientRect();
      var p = clamp((e.clientX - r.left) / r.width, 0, 1);
      media.volume = p; media.muted = false; volFill.style.width = (p * 100) + '%';
      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    });

    var speeds = [0.75, 1, 1.25, 1.5, 2];
    var si = 1;
    speedEl.addEventListener('click', function () {
      si = (si + 1) % speeds.length; media.playbackRate = speeds[si]; speedEl.textContent = speeds[si] + 'x';
    });

    function destroy() {
      try { media.pause(); } catch (e) {}
      media.removeAttribute('src');
      wrap.innerHTML = '';
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    return { el: wrap, media: media, play: togglePlay, destroy: destroy };
  }

  // ---------- SHARED AUDIO ENGINE ----------
  var engine = null;

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
  function buildMusicPlayer(tracks, startIndex) {
    injectCss();
    var m = ensureModal();
    m.querySelector('.k2-media-modal-title').textContent = 'Now Playing';
    var body = m.querySelector('.k2-media-modal-body');
    body.innerHTML = '<div class="k2-music-player"></div>';
    var root = body.querySelector('.k2-music-player');
    m.classList.remove('hidden');

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
      if (ni === idx && !repeat && !shuffle) return;
      idx = ni; setSrcAndMeta(); play();
    }
    function play() { audio.play().catch(function () {}); }
    function toggle() { if (audio.paused) play(); else audio.pause(); }
    function seek(x, el) {
      var r = el.getBoundingClientRect();
      var p = clamp((x - r.left) / r.width, 0, 1);
      if (audio.duration) audio.currentTime = p * audio.duration;
    }
    playBtn.addEventListener('click', toggle);
    prevBtn.addEventListener('click', function () { idx = (idx - 1 + tracks.length) % tracks.length; setSrcAndMeta(); play(); });
    nextBtn.addEventListener('click', function () { idx = nextIndex(); setSrcAndMeta(); play(); });
    shuffleBtn.addEventListener('click', function () { shuffle = !shuffle; shuffleBtn.classList.toggle('active', shuffle); });
    repeatBtn.addEventListener('click', function () { repeat = !repeat; repeatBtn.classList.toggle('active', repeat); });
    seekEl.addEventListener('click', function (e) { seek(e.clientX, seekEl); });
    seekEl.addEventListener('touchstart', function (e) { if (e.touches[0]) seek(e.touches[0].clientX, seekEl); }, { passive: true });

    var speeds = [0.75, 1, 1.25, 1.5, 2];
    var si = 1;
    speedEl.addEventListener('click', function () { si = (si + 1) % speeds.length; audio.playbackRate = speeds[si]; speedEl.textContent = speeds[si] + 'x'; });

    setSrcAndMeta();
    return { el: root, play: play, pause: function () { audio.pause(); }, audio: audio };
  }

  // ---------- MODAL ----------
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

  function openPodcastPlayer(input) {
    var tracks = toTracks(input);
    if (!tracks.length) return;
    var startIndex = (input && typeof input === 'object' && typeof input.startIndex === 'number') ? input.startIndex : 0;
    return buildMusicPlayer(tracks, startIndex);
  }

  // ---------- GLOBAL MINI PLAYER ----------
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
    if (miniEngine) miniEngine.destroy();
    miniEngine = ensureEngine();
    miniEngine.setSrc(t.src);
    var endH = function () { if (miniTracks.length) { miniIdx = (miniIdx + 1) % miniTracks.length; miniLoad(); } };
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
    pause: function () { if (miniEngine) miniEngine.pause(); miniSetPlaying(false); },
    play: function () { if (miniEngine) miniEngine.play(); miniSetPlaying(true); },
    stop: function () {
      if (miniProgressTimer) { clearInterval(miniProgressTimer); miniProgressTimer = null; }
      if (miniEngine) miniEngine.destroy();
      miniEngine = null; miniTracks = []; miniIdx = 0;
      if (mini) mini.classList.remove('open');
      miniSetPlaying(false);
    },
    isPlaying: function () { return !!(miniEngine && !miniEngine.audio.paused); }
  };

  // ---------- AUTO-UPGRADE ----------
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

  // ---------- PUBLIC API ----------
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
