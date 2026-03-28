// ==UserScript==
// @name         Vortex INC — Mines Predictor (Free Version)
// @namespace    https://vortex-inc.dev
// @version      5.0.0
// @description  Advanced mines prediction overlay for BloxFlip
// @author       Vortex INC
// @match        https://bloxflip.com/mines
// @match        https://www.bloxflip.com/mines
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     STYLES  —  minimal pure-black
  ───────────────────────────────────────── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root, #vortex-root {
      --vx-bg: #0e0e0e; --vx-border: rgba(255,255,255,0.08);
      --vx-border-2: rgba(255,255,255,0.04);
      --vx-text: #fff; --vx-text-mute: rgba(255,255,255,0.3);
      --vx-text-mute-2: rgba(255,255,255,0.55);
      --vx-btn: #181818; --vx-btn-hover: rgba(255,255,255,0.06);
      --vx-btn-act: rgba(255,255,255,0.1);
      --vx-icon: rgba(255,255,255,0.7);
      --vx-primary: #fff; --vx-primary-tx: #000;
      --vx-shadow: rgba(0,0,0,0.85); --vx-pop: #22c55e;
    }
    #vortex-root.theme-light, #vortex-notif-overlay.theme-light {
      --vx-bg: #ececec; --vx-border: rgba(0,0,0,0.12);
      --vx-border-2: rgba(0,0,0,0.06);
      --vx-text: #111; --vx-text-mute: rgba(0,0,0,0.45);
      --vx-text-mute-2: rgba(0,0,0,0.65);
      --vx-btn: #fefefe; --vx-btn-hover: rgba(0,0,0,0.05);
      --vx-btn-act: rgba(0,0,0,0.1);
      --vx-icon: rgba(0,0,0,0.6);
      --vx-primary: #111; --vx-primary-tx: #fff;
      --vx-shadow: rgba(0,0,0,0.18); --vx-pop: #16a34a;
    }
    #vortex-root.theme-abyss, #vortex-notif-overlay.theme-abyss {
      --vx-bg: #090a0f; --vx-border: rgba(99,102,241,0.22);
      --vx-border-2: rgba(99,102,241,0.12);
      --vx-text: #e2e8f0; --vx-text-mute: #818cf8;
      --vx-text-mute-2: rgba(99,102,241,0.8);
      --vx-btn: #12151e; --vx-btn-hover: rgba(99,102,241,0.15);
      --vx-btn-act: rgba(99,102,241,0.25);
      --vx-icon: #818cf8;
      --vx-primary: #6366f1; --vx-primary-tx: #fff;
      --vx-shadow: rgba(0,0,0,0.9); --vx-pop: #4ade80;
    }

    #vortex-root { position: fixed; top: 72px; right: 16px; z-index: 999999; font-family: 'Inter', sans-serif; user-select: none; transition: left 0.08s, top 0.08s; color: var(--vx-text); }
    #vortex-root.dragging { transition: none; }
    #vortex-panel { width: 272px; background: var(--vx-bg); border-radius: 16px; border: 1px solid var(--vx-border); box-shadow: 0 24px 64px var(--vx-shadow); overflow: hidden; transition: background 0.3s, border-color 0.3s, color 0.3s; }
    
    #vortex-header { padding: 13px 16px 12px; display: flex; align-items: center; justify-content: space-between; cursor: grab; border-bottom: 1px solid var(--vx-border); transition: border-color 0.3s; }
    #vortex-header:active { cursor: grabbing; }
    #vortex-header-left { display: flex; align-items: center; gap: 9px; }
    #vortex-header-icon { width: 30px; height: 30px; background: var(--vx-border-2); border: 1px solid var(--vx-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    #vortex-header-icon svg { stroke: var(--vx-icon); }
    #vortex-header-text { display: flex; flex-direction: column; gap: 1px; }
    #vortex-title { font-size: 13px; font-weight: 600; color: var(--vx-text); letter-spacing: -0.3px; line-height: 1; transition: color 0.3s; }
    #vortex-subtitle { font-size: 11px; font-weight: 400; color: var(--vx-text-mute); transition: color 0.3s; }
    #vortex-status { display: flex; align-items: center; gap: 5px; }
    #vortex-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--vx-pop); animation: vx-pulse 2.4s ease-in-out infinite; transition: background 0.3s; }
    #vortex-status-label { font-size: 11px; font-weight: 500; color: var(--vx-pop); transition: color 0.3s; }

    @keyframes vx-pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
    #vortex-body { padding: 0; }
    .vx-section { padding: 12px 16px; border-bottom: 1px solid var(--vx-border); transition: border-color 0.3s; }
    .vx-section:last-child { border-bottom: none; }
    .vx-label { font-size: 10px; font-weight: 500; color: var(--vx-text-mute); letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 8px; transition: color 0.3s; }
    
    #vx-stats { display: flex; }
    .vx-stat { flex: 1; text-align: center; padding: 6px 0; position: relative; }
    .vx-stat + .vx-stat::before { content: ''; position: absolute; left: 0; top: 15%; bottom: 15%; width: 1px; background: var(--vx-border); }
    .vx-stat-num { font-size: 24px; font-weight: 700; letter-spacing: -1px; line-height: 1; color: var(--vx-text); transition: color 0.3s; }
    .vx-stat-cap { font-size: 10px; font-weight: 400; color: var(--vx-text-mute); margin-top: 4px; transition: color 0.3s;}
    
    #vx-stepper { display: flex; align-items: center; background: var(--vx-btn); border: 1px solid var(--vx-border); border-radius: 10px; height: 42px; transition: background 0.3s, border-color 0.3s; }
    .vx-step-btn { width: 46px; height: 42px; background: none; border: none; color: var(--vx-text-mute-2); font-size: 20px; font-weight: 300; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; transition: color 0.12s, background 0.12s;}
    .vx-step-btn:hover { background: var(--vx-btn-hover); color: var(--vx-text); }
    .vx-step-btn:active { background: var(--vx-btn-act); }
    #vx-step-divider-l, #vx-step-divider-r { width: 1px; height: 20px; background: var(--vx-border); }
    #vx-stepper-val { flex: 1; text-align: center; font-size: 18px; font-weight: 700; color: var(--vx-text); letter-spacing: -0.5px; }

    #vx-presets { display: flex; gap: 4px; margin-top: 8px; }
    .vx-preset { flex: 1; height: 28px; background: var(--vx-btn); border: 1px solid var(--vx-border); border-radius: 7px; color: var(--vx-text-mute); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; padding: 0; transition: all 0.2s; }
    .vx-preset:hover { background: var(--vx-btn-hover); color: var(--vx-text); }
    .vx-preset.active { background: var(--vx-primary); color: var(--vx-primary-tx); border-color: var(--vx-primary); font-weight: 600; }

    #vx-segment { display: flex; background: var(--vx-btn); border: 1px solid var(--vx-border); border-radius: 9px; padding: 3px; gap: 3px; transition: background 0.3s, border-color 0.3s; }
    .vx-seg-btn { flex: 1; height: 28px; background: none; border: none; border-radius: 6px; color: var(--vx-text-mute); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; cursor: pointer; padding: 0; transition: all 0.18s ease; }
    .vx-seg-btn.active { background: var(--vx-primary); color: var(--vx-primary-tx); font-weight: 600; box-shadow: 0 1px 4px var(--vx-shadow); }
    
    #vx-conf-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    #vx-conf-pct { font-size: 13px; font-weight: 600; color: var(--vx-text); letter-spacing: -0.2px; transition: color 0.3s;}
    #vx-conf-track { height: 3px; background: var(--vx-border); border-radius: 99px; overflow: hidden; transition: background 0.3s; }
    #vx-conf-fill { height: 100%; width: 0%; background: var(--vx-primary); border-radius: 99px; transition: width 0.7s, background 0.3s; }
    
    #vortex-predict-btn { display: block; width: 100%; height: 44px; background: var(--vx-primary); border: none; border-radius: 10px; color: var(--vx-primary-tx); font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.15s, transform 0.12s, background 0.3s, color 0.3s; }
    #vortex-predict-btn:hover { opacity: 0.88; }
    #vortex-predict-btn:active { transform: scale(0.98); opacity: 0.75; }
    #vortex-predict-btn.running { opacity: 0.4; pointer-events: none; }
    
    #vx-btn-row { display: flex; gap: 6px; margin-top: 6px; }
    #vortex-clear-btn { flex: 1; height: 36px; background: var(--vx-btn); border: 1px solid var(--vx-border); border-radius: 9px; color: var(--vx-text-mute); font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    #vortex-clear-btn:hover { background: var(--vx-btn-hover); color: var(--vx-text); }
    
    #vx-status-line { font-size: 10px; font-weight: 400; color: var(--vx-text-mute); text-align: center; margin-top: 8px; min-height: 13px; transition: color 0.3s; }

    #vortex-notif-overlay { position: fixed; inset: 0; z-index: 9999998; pointer-events: none; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 30px; }
    #vortex-notif { pointer-events: all; display: flex; align-items: center; gap: 12px; background: var(--vx-bg); border: 1px solid var(--vx-border); border-radius: 14px; padding: 13px 16px; box-shadow: 0 8px 32px var(--vx-shadow); transform: translateY(110%) scale(0.96); opacity: 0; transition: transform 0.38s, opacity 0.3s; max-width: 320px; font-family: 'Inter', sans-serif; color: var(--vx-text); }
    #vortex-notif.show { transform: translateY(0%) scale(1); opacity: 1; }
    #vx-notif-icon svg { width: 20px; height: 20px; stroke: var(--vx-text-mute-2); }
    #vx-notif-text { flex: 1; }
    #vortex-notif-title { font-size: 13px; font-weight: 600; color: var(--vx-text); margin-bottom: 2px; }
    #vortex-notif-body { font-size: 12px; font-weight: 400; color: var(--vx-text-mute); }
    #vortex-notif-close { background: var(--vx-btn); border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: var(--vx-text-mute); cursor: pointer; flex-shrink: 0; transition: background 0.15s; }
    #vortex-notif-close:hover { background: var(--vx-btn-hover); color: var(--vx-text); }

    .vortex-tile-highlight { outline: 2px solid var(--vx-primary) !important; outline-offset: -2px !important; box-shadow: 0 0 14px var(--vx-border), inset 0 0 0 9999px var(--vx-border-2) !important; animation: vx-glow 2s ease-in-out infinite !important; position: relative !important; }
    .vortex-tile-highlight > * { position: relative !important; z-index: 1 !important; }
    @keyframes vx-glow { 0%,100% { box-shadow: 0 0 10px var(--vx-border), inset 0 0 0 9999px var(--vx-border-2) !important; } 50% { box-shadow: 0 0 20px var(--vx-border), inset 0 0 0 9999px var(--vx-border) !important; } }
    
    .vortex-conf-badge { position: absolute !important; top: 4px !important; right: 4px !important; background: var(--vx-primary) !important; border-radius: 4px !important; font-family: 'Inter', sans-serif !important; font-size: 9px !important; font-weight: 700 !important; color: var(--vx-primary-tx) !important; padding: 2px 4px !important; pointer-events: none !important; z-index: 99999 !important; }`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ─────────────────────────────────────────
     BUILD DOM
  ───────────────────────────────────────── */

  // Notification
  const notifOverlay = document.createElement('div');
  notifOverlay.id = 'vortex-notif-overlay';
  notifOverlay.innerHTML = `
    <div id="vortex-notif">
      <div id="vx-notif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <div id="vx-notif-text">
        <div id="vortex-notif-title">Game Not Started</div>
        <div id="vortex-notif-body">Please start a game before predicting.</div>
      </div>
      <button id="vortex-notif-close">✕</button>
    </div>`;
  document.body.appendChild(notifOverlay);

  // Panel
  const root = document.createElement('div');
  root.id = 'vortex-root';
  root.innerHTML = `
    <div id="vortex-panel">

      <div id="vortex-header">
        <div id="vortex-header-left">
          <div id="vortex-header-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
          <div id="vortex-header-text">
            <div id="vortex-title">Vortex - Free</div>
            <div id="vortex-subtitle">Free build - <span id="vortex-user-tag" style="color:#fff;font-weight:600;"></span></div>
          </div>
        </div>
        
        <div id="vortex-status" style="border-right: 1px solid var(--vx-border); padding-right: 12px; margin-right: 12px;">
          <div id="vortex-status-dot"></div>
          <span id="vortex-status-label">Live</span>
        </div>
        <div id="vortex-settings-icon" style="cursor: pointer; display: flex; align-items: center; color: var(--vx-icon); transition: opacity 0.2s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
      </div>
      
      <div id="vortex-settings-menu" style="display: none; padding: 12px 16px; border-bottom: 1px solid var(--vx-border); background: var(--vx-border-2);">
        <div class="vx-label">Theme Customizer</div>
        <div style="display:flex; gap: 8px;">
           <button class="vx-preset" id="theme-dark">Dark</button>
           <button class="vx-preset" id="theme-light">Light</button>
           <button class="vx-preset" id="theme-abyss">Abyss</button>
        </div>
      </div>

      <div id="vortex-body">

        <!-- STATS -->
        <div class="vx-section" style="padding-bottom:10px;padding-top:10px;">
          <div id="vx-stats">
            <div class="vx-stat">
              <div class="vx-stat-num" id="vortex-mines-val">3</div>
              <div class="vx-stat-cap">Mines</div>
            </div>
            <div class="vx-stat">
              <div class="vx-stat-num" id="vortex-safe-val">21</div>
              <div class="vx-stat-cap">Safe</div>
            </div>
            <div class="vx-stat">
              <div class="vx-stat-num">24</div>
              <div class="vx-stat-cap">Total</div>
            </div>
          </div>
        </div>

        <!-- MINE COUNT -->
        <div class="vx-section">
          <div class="vx-label">Mine Count</div>
          <div id="vx-stepper">
            <button class="vx-step-btn" id="vortex-mine-dec">−</button>
            <div id="vx-step-divider-l"></div>
            <div id="vx-stepper-val">3</div>
            <div id="vx-step-divider-r"></div>
            <button class="vx-step-btn" id="vortex-mine-inc">+</button>
          </div>
          <div id="vx-presets">
            <button class="vx-preset" data-v="1">1</button>
            <button class="vx-preset active" data-v="3">3</button>
            <button class="vx-preset" data-v="5">5</button>
            
          </div>
        </div>

        <!-- ALGORITHM -->
        <div class="vx-section">
          <div class="vx-label">Algorithm</div>
          <div id="vx-segment">
            <button class="vx-seg-btn active" data-algo="basic">Basic</button>
            <button class="vx-seg-btn" data-algo="heuristic">Heuristic</button>
            <button class="vx-seg-btn" data-algo="standard">Standard</button>
          </div>
        </div>

        <!-- CONFIDENCE -->
        <div class="vx-section">
          <div id="vx-conf-row">
            <div class="vx-label" style="margin-bottom:0;">Confidence</div>
            <div id="vx-conf-pct">—</div>
          </div>
          <div style="margin-top:8px;">
            <div id="vx-conf-track"><div id="vx-conf-fill"></div></div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="vx-section">
          <button id="vortex-predict-btn">Predict Mines</button>
          <div id="vx-btn-row">
            <button id="vortex-clear-btn">Clear</button>
            
          </div>
          <div id="vx-status-line">Ready</div>
        </div>

      </div>
    </div>`;
  document.body.appendChild(root);

  /* ─────────────────────────────────────────
     STATE
  ───────────────────────────────────────── */
  let minesCount = 3;
  let activeAlgo = 'basic';
  let highlightedTiles = [];
  let badgeEls = [];
  let notifTimer = null;

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  const getTiles = () =>
    Array.from(document.querySelectorAll('button[aria-label^="Open mine"]'));

  function isGameActive() {
    for (const btn of document.querySelectorAll('button')) {
      const txt = btn.textContent.trim().toLowerCase();
      if (txt.includes('start new game') || txt.includes('start game')) {
        const s = window.getComputedStyle(btn);
        if (s.display !== 'none' && s.visibility !== 'hidden') return false;
      }
    }
    return getTiles().length > 0;
  }

  function addLog(msg) {
    const sl = document.getElementById('vx-status-line');
    if (sl) sl.textContent = msg;
  }

  function showNotif() {
    const n = document.getElementById('vortex-notif');
    n.classList.add('show');
    clearTimeout(notifTimer);
    notifTimer = setTimeout(() => n.classList.remove('show'), 5500);
    playError();
  }

  function syncStats() {
    document.getElementById('vortex-mines-val').textContent = minesCount;
    document.getElementById('vortex-safe-val').textContent = 24 - minesCount;
    document.getElementById('vx-stepper-val').textContent = minesCount;
    document.querySelectorAll('.vx-preset').forEach(b =>
      b.classList.toggle('active', +b.dataset.v === minesCount));
  }

  function setMines(n) {
    minesCount = Math.max(1, Math.min(5, n));
    syncStats();
  }

  function clearHighlights() {
    badgeEls.forEach(b => b.remove());
    badgeEls = [];
    highlightedTiles.forEach(t => {
      t.classList.remove('vortex-tile-highlight');
      t.style.position = '';
    });
    highlightedTiles = [];
    document.getElementById('vx-conf-fill').style.width = '0%';
    document.getElementById('vx-conf-pct').textContent = '—';
  }

  /* ─────────────────────────────────────────
     ALGORITHM ENGINE
  ───────────────────────────────────────── */
  function mkRng(seed) {
    let s = seed >>> 0;
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }

  function shuffle(arr, rng) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function perTileConf(overall, count, rng) {
    return Array.from({ length: count }, () =>
      Math.min(99, Math.max(38, overall + Math.floor((rng() - 0.5) * 18))));
  }

  function runAlgo(algo, count, tileCount) {
    const seed = (Date.now() ^ algo.charCodeAt(0) * 0x9e3779b9) >>> 0;
    const rng = mkRng(seed);
    const all = Array.from({ length: tileCount }, (_, i) => i);
    let picked, overall;

    if (algo === 'basic') {
      picked = shuffle(shuffle(all, rng), mkRng(seed ^ 0xdeadbeef)).slice(0, count);
      overall = 41 + Math.floor(rng() * 19);
    } else if (algo === 'heuristic') {
      const r2 = mkRng(seed ^ 0xcafebabe);
      const weighted = all.map(i => {
        const row = Math.floor(i / 5), col = i % 5;
        const edge = row === 0 || row === 4 || col === 0 || col === 4;
        const corner = (row === 0 || row === 4) && (col === 0 || col === 4);
        return { i, w: r2() + (edge ? 0.15 : 0) + (corner ? 0.09 : 0) };
      });
      weighted.sort((a, b) => b.w - a.w);
      picked = weighted.slice(0, count).map(x => x.i);
      overall = 46 + Math.floor(rng() * 17);
    } else {
      const quads = [[], [], [], []];
      all.forEach(i => {
        const row = Math.floor(i / 5), col = i % 5;
        quads[(row < 2 ? 0 : 2) + (col < 3 ? 0 : 1)].push(i);
      });
      picked = [];
      quads.forEach((q, qi) => {
        picked.push(...shuffle(q, mkRng(seed ^ qi * 0x12345)).slice(0, Math.ceil(count / 4)));
      });
      picked = picked.slice(0, count);
      overall = 36 + Math.floor(rng() * 21);
    }

    return { picked, overall, confs: perTileConf(overall, picked.length, rng) };
  }

  /* ─────────────────────────────────────────
     PREDICT
  ───────────────────────────────────────── */
  function predict() {
    if (!isGameActive()) {
      showNotif();
      addLog('No active game — start one first.');
      return;
    }
    const tiles = getTiles();
    if (!tiles.length) {
      showNotif();
      addLog('Tile buttons not found.');
      return;
    }
    clearHighlights();

    const btn = document.getElementById('vortex-predict-btn');
    btn.classList.add('running');
    btn.textContent = 'Analyzing…';

    setTimeout(() => {
      const { picked, overall, confs } = runAlgo(activeAlgo, minesCount, tiles.length);

      picked.forEach((idx, i) => {
        const tile = tiles[idx];
        if (!tile) return;
        tile.classList.add('vortex-tile-highlight');
        tile.style.position = 'relative';
        highlightedTiles.push(tile);

        const badge = document.createElement('div');
        badge.className = 'vortex-conf-badge';
        badge.textContent = confs[i] + '%';
        tile.appendChild(badge);
        badgeEls.push(badge);
      });

      document.getElementById('vx-conf-fill').style.width = overall + '%';
      document.getElementById('vx-conf-pct').textContent = overall + '%';
      addLog(activeAlgo + ' · ' + picked.length + ' tiles · ' + overall + '% conf');

      btn.classList.remove('running');
      btn.textContent = 'Predict Mines';
    }, 950);
  }

  /* ─────────────────────────────────────────
     DRAG
  ───────────────────────────────────────── */
  let dragging = false, ox = 0, oy = 0;
  document.addEventListener('mousedown', e => {
    const h = document.getElementById('vortex-header');
    if (h && h.contains(e.target)) {
      dragging = true;
      root.classList.add('dragging');
      const r = root.getBoundingClientRect();
      ox = e.clientX - r.left; oy = e.clientY - r.top;
    }
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    root.style.left = Math.max(0, Math.min(window.innerWidth - root.offsetWidth, e.clientX - ox)) + 'px';
    root.style.top = Math.max(0, Math.min(window.innerHeight - root.offsetHeight, e.clientY - oy)) + 'px';
    root.style.right = 'auto';
    root.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      root.classList.remove('dragging');
    }
  });

  /* ─────────────────────────────────────────
     SOUNDS
  ───────────────────────────────────────── */
  function playClick() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) { }
  }

  function playError() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const gain = ctx.createGain();
      o1.frequency.setValueAtTime(880, ctx.currentTime);
      o1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      o2.frequency.setValueAtTime(660, ctx.currentTime);
      o2.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      o1.connect(gain); o2.connect(gain); gain.connect(ctx.destination);
      o1.start(); o2.start();
      o1.stop(ctx.currentTime + 0.2); o2.stop(ctx.currentTime + 0.2);
    } catch (e) { }
  }

  /* ─────────────────────────────────────────
     EVENTS
  ───────────────────────────────────────── */
  document.getElementById('vortex-notif-close')
    .addEventListener('click', () => { playClick(); document.getElementById('vortex-notif').classList.remove('show'); });

  document.getElementById('vortex-mine-inc')
    .addEventListener('click', () => { playClick(); setMines(minesCount + 1); addLog('Mines \u2192 ' + minesCount); });
  document.getElementById('vortex-mine-dec')
    .addEventListener('click', () => { playClick(); setMines(minesCount - 1); addLog('Mines \u2192 ' + minesCount); });

  document.querySelectorAll('.vx-preset').forEach(b =>
    b.addEventListener('click', () => { playClick(); setMines(+b.dataset.v); addLog('Mines \u2192 ' + minesCount); }));

  document.querySelectorAll('.vx-seg-btn').forEach(tab =>
    tab.addEventListener('click', () => {
      playClick();
      document.querySelectorAll('.vx-seg-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeAlgo = tab.dataset.algo;
      addLog('Algorithm \u2192 ' + activeAlgo);
    }));

  document.getElementById('vortex-predict-btn').addEventListener('click', () => { playClick(); predict(); });
  document.getElementById('vortex-clear-btn').addEventListener('click', () => {
    playClick();
    clearHighlights();
    addLog('Cleared.');
  });

  const stIcon = document.getElementById('vortex-settings-icon');
  const stMenu = document.getElementById('vortex-settings-menu');
  if (stIcon && stMenu) {
    stIcon.addEventListener('click', () => {
      playClick();
      stMenu.style.display = stMenu.style.display === 'none' ? 'block' : 'none';
      stIcon.style.opacity = stMenu.style.display === 'block' ? '0.5' : '1';
    });
  }

  document.getElementById('theme-dark').addEventListener('click', () => { playClick(); root.className = 'theme-dark'; const n = document.getElementById('vortex-notif-overlay'); if (n) n.className = 'theme-dark'; });
  document.getElementById('theme-light').addEventListener('click', () => { playClick(); root.className = 'theme-light'; const n = document.getElementById('vortex-notif-overlay'); if (n) n.className = 'theme-light'; });
  document.getElementById('theme-abyss').addEventListener('click', () => { playClick(); root.className = 'theme-abyss'; const n = document.getElementById('vortex-notif-overlay'); if (n) n.className = 'theme-abyss'; });



  syncStats();
  addLog('Ready');

  /* Resolve BloxFlip username */
  (async function resolveUsername() {
    const tag = document.getElementById('vortex-user-tag');
    if (!tag) return;

    /* Words that must never be treated as a username */
    const BLOCKED = new Set([
      'Bloxflip', 'BloxFlip', 'bloxflip', 'Mines', 'Crash', 'Jackpot',
      'Roulette', 'Plinko', 'Live', 'Chat', 'Logout', 'Profile', 'Settings',
      'Deposit', 'Withdraw', 'Leaderboard', 'Rewards', 'Affiliate',
    ]);

    function isValidName(txt) {
      return txt && /^[A-Za-z0-9_]{3,20}$/.test(txt) && !BLOCKED.has(txt);
    }

    function set(name) { tag.textContent = '@' + name; }

    /* 1 — fetch /profile, target the profileMainUserText container specifically */
    try {
      const res = await fetch('/profile', { credentials: 'include' });
      const html = await res.text();

      /* Primary: look inside profileMainUserText div for an smHeadlines paragraph */
      const container = html.match(/profileMainUserText[^>]*>[\s\S]{0,300}?smHeadlines[^>]*>([^<]{3,20})</);
      if (container && isValidName(container[1].trim())) {
        set(container[1].trim()); return;
      }

      /* Secondary: any smHeadlines element in the HTML */
      const simple = html.match(/smHeadlines[^>]*>([A-Za-z0-9_]{3,20})</);
      if (simple && isValidName(simple[1])) {
        set(simple[1]); return;
      }
    } catch (e) { }

    /* 2 — MutationObserver: watch the live DOM on the mines page
       (BloxFlip nav likely renders the username here too) */
    let resolved = false;
    function scanDOM() {
      const els = document.querySelectorAll('[class*="smHeadlines"],[class*="profileMainUserText"] p');
      for (const el of els) {
        const txt = el.textContent.trim();
        if (isValidName(txt)) { set(txt); resolved = true; return true; }
      }
      return false;
    }

    if (scanDOM()) return;

    const obs = new MutationObserver(() => { if (scanDOM()) obs.disconnect(); });
    obs.observe(document.body, { childList: true, subtree: true });

    /* Give up after 20 s */
    setTimeout(() => obs.disconnect(), 20000);
  })();

})();
