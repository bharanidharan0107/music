/* ===================================================================
   FIT WITH DI8 — plain JavaScript version (no build step, no backend)
   - Hash router (#/dashboard etc.) so it also works when opened as a file
   - All calculators run in the browser
   - Data (meals, body scans, targets, profile) saved in localStorage
=================================================================== */
(function () {
  'use strict';

  /* ---------- Icons (Lucide paths, inlined so no CDN is needed) ---------- */
  const ICONS = {
  "activity": "<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\" />",
  "arrowRight": "<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />",
  "arrowUpRight": "<path d=\"M7 7h10v10\" /> <path d=\"M7 17 17 7\" />",
  "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\" /> <path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\" />",
  "brain": "<path d=\"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z\" /> <path d=\"M9 13a4.5 4.5 0 0 0 3-4\" /> <path d=\"M6.003 5.125A3 3 0 0 0 6.401 6.5\" /> <path d=\"M3.477 10.896a4 4 0 0 1 .585-.396\" /> <path d=\"M6 18a4 4 0 0 1-1.967-.516\" /> <path d=\"M12 13h4\" /> <path d=\"M12 18h6a2 2 0 0 1 2 2v1\" /> <path d=\"M12 8h8\" /> <path d=\"M16 8V5a2 2 0 0 1 2-2\" /> <circle cx=\"16\" cy=\"13\" r=\".5\" /> <circle cx=\"18\" cy=\"3\" r=\".5\" /> <circle cx=\"20\" cy=\"21\" r=\".5\" /> <circle cx=\"20\" cy=\"8\" r=\".5\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "clipboard": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\" /> <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\" /> <path d=\"M12 11h4\" /> <path d=\"M12 16h4\" /> <path d=\"M8 11h.01\" /> <path d=\"M8 16h.01\" />",
  "chevronRight": "<path d=\"m9 18 6-6-6-6\" />",
  "help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /> <path d=\"M12 17h.01\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16.5 12\" />",
  "dumbbell": "<path d=\"M14.4 14.4 9.6 9.6\" /> <path d=\"M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z\" /> <path d=\"m21.5 21.5-1.4-1.4\" /> <path d=\"M3.9 3.9 2.5 2.5\" /> <path d=\"M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z\" />",
  "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" />",
  "gauge": "<path d=\"m12 14 4-4\" /> <path d=\"M3.34 19a10 10 0 1 1 17.32 0\" />",
  "heart": "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\" /> <path d=\"M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27\" />",
  "flask": "<path d=\"M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2\" /> <path d=\"M8.5 2h7\" /> <path d=\"M7 16h10\" />",
  "leaf": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\" /> <path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" />",
  "dashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\" /> <rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" />",
  "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /> <line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /> <line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
  "more": "<circle cx=\"12\" cy=\"12\" r=\"1\" /> <circle cx=\"19\" cy=\"12\" r=\"1\" /> <circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "play": "<polygon points=\"6 3 20 12 6 21 6 3\" />",
  "plus": "<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />",
  "scan": "<path d=\"M3 7V5a2 2 0 0 1 2-2h2\" /> <path d=\"M17 3h2a2 2 0 0 1 2 2v2\" /> <path d=\"M21 17v2a2 2 0 0 1-2 2h-2\" /> <path d=\"M7 21H5a2 2 0 0 1-2-2v-2\" /> <path d=\"M7 12h10\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /> <path d=\"m21 21-4.3-4.3\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /> <path d=\"m9 12 2 2 4-4\" />",
  "target": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <circle cx=\"12\" cy=\"12\" r=\"6\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" />",
  "trending": "<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\" /> <polyline points=\"16 7 22 7 22 13\" />",
  "user": "<circle cx=\"12\" cy=\"8\" r=\"5\" /> <path d=\"M20 21a8 8 0 0 0-16 0\" />",
  "utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />",
  "x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />",
  "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />",
  "calculator": "<rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"6\" y2=\"6\" /> <line x1=\"16\" x2=\"16\" y1=\"14\" y2=\"18\" /> <path d=\"M16 10h.01\" /> <path d=\"M12 10h.01\" /> <path d=\"M8 10h.01\" /> <path d=\"M12 14h.01\" /> <path d=\"M8 14h.01\" /> <path d=\"M12 18h.01\" /> <path d=\"M8 18h.01\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />",
  "loader": "<path d=\"M21 12a9 9 0 1 1-6.219-8.56\" />",
  "alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />"
};
  const icon = (name, size = 16, cls = '') =>
    `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = n => String(n).padStart(2, '0');
  const num = v => (v === '' || v === null || v === undefined ? NaN : Number(v));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };

  /* ---------- Storage ---------- */
  const KEY = 'di8_state_v1';
  const DEFAULT_STATE = {
    user: null,                // { email, name }
    foodLog: [],               // { id, date, time, name, kcal, p, c, f }
    bodyScans: [],             // { date, bodyFat, lean, fat, bmi, whr }
    targets: { kcal: 2500, p: 180, c: 250, f: 75 },
    focus: null,               // title of the session queued as today's focus
    prefs: { goal: 0, days: 3, metric: 0, coach: 0 },
    workoutLog: [],            // { id, date, title, tag, min, sets, volume, load }
    daily: {},                 // { 'YYYY-MM-DD': { water, steps, sleep } }
    active: null,              // unfinished workout session
    settings: { water: 2500, name: '' },
  };
  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object') return { ...DEFAULT_STATE, ...raw, targets: { ...DEFAULT_STATE.targets, ...(raw.targets || {}) }, prefs: { ...DEFAULT_STATE.prefs, ...(raw.prefs || {}) }, settings: { ...DEFAULT_STATE.settings, ...(raw.settings || {}) } };
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  const S = loadState();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage may be blocked */ } }

  /* ---------- Date & data helpers ---------- */
  const dayKey = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const lastDays = n => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (n - 1 - i)); return d; });
  const dayData = (k = todayKey()) => ({ water: 0, steps: 0, sleep: 0, ...(S.daily[k] || {}) });
  function setDay(patch) { const k = todayKey(); S.daily[k] = { ...dayData(k), ...patch }; save(); }
  function streak() {
    const set = new Set(S.workoutLog.map(w => w.date));
    const d = new Date(); d.setHours(12, 0, 0, 0);
    if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const displayName = () => S.settings.name || (S.user ? S.user.name : 'Athlete');
  const initialsOf = n => (String(n).trim().split(/\s+/).map(x => x[0]).join('').slice(0, 2) || 'A').toUpperCase();
  const fmtNum = n => Math.round(n).toLocaleString();
  const mealsOn = k => S.foodLog.filter(m => m.date === k);
  const totalsOn = k => mealsOn(k).reduce((t, m) => ({ kcal: t.kcal + m.kcal, p: t.p + m.p, c: t.c + m.c, f: t.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });
  const loadOn = k => clamp(S.workoutLog.filter(w => w.date === k).reduce((s, w) => s + w.load, 0), 0, 100);
  function addFood(m) {
    const d = new Date();
    S.foodLog.push({ id: Date.now() + Math.random(), date: todayKey(), time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`, name: m.name, kcal: Math.round(m.kcal), p: Math.round(m.p), c: Math.round(m.c), f: Math.round(m.f) });
    save();
  }
  function notices() {
    const n = []; const h = new Date().getHours(); const t = todayKey(); const dd = dayData();
    if (S.active) n.push(['dumbbell', 'Unfinished workout', `${SESSIONS[S.active.idx].title} is still open.`, '/workouts/session']);
    const last = S.workoutLog.length ? S.workoutLog[S.workoutLog.length - 1].date : null;
    if (!last) n.push(['play', 'Start your first session', 'Pick a workout to begin building your streak.', '/workouts']);
    else { const diff = Math.floor((new Date(t) - new Date(last)) / 86400000); if (diff >= 2) n.push(['flame', `${diff} days since your last session`, 'A short session keeps the habit alive.', '/workouts']); }
    if (h >= 12 && !mealsOn(t).length) n.push(['utensils', 'No meals logged today', 'Log a meal to track your calories and macros.', '/scanners/food']);
    if (h >= 14 && dd.water < S.settings.water * 0.5) n.push(['gauge', 'Hydration is behind', `You are at ${Math.round(dd.water / S.settings.water * 100)}% of your water goal.`, '/dashboard']);
    return n;
  }

  /* ---------- Modal ---------- */
  let modalState = null;
  function fieldHtml(f) {
    if (f.type === 'select') return `<label class="m-field">${esc(f.label)}<select name="${f.name}">${(f.options || []).map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(f.value) ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
    return `<label class="m-field">${esc(f.label)}<input name="${f.name}" type="${f.type || 'text'}" value="${esc(f.value ?? '')}" ${f.min !== undefined ? `min="${f.min}"` : ''} ${f.max !== undefined ? `max="${f.max}"` : ''} ${f.step ? `step="${f.step}"` : ''} ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''} ${f.type === 'number' ? 'inputmode="decimal"' : ''} autocomplete="off"></label>`;
  }
  function closeModal() { const m = $('#modal'); if (m) m.remove(); modalState = null; }
  function openModal({ title, desc = '', fields = [], submit = 'Save', onSubmit = null, body = '', after = '' }) {
    closeModal();
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop'; wrap.id = 'modal';
    wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><h3>${esc(title)}</h3><button class="icon-button" data-modal-close aria-label="Close">${icon('x', 16)}</button></div>${desc ? `<p class="modal-desc">${desc}</p>` : ''}${body}
      <form id="modal-form" novalidate><div class="modal-fields">${fields.map(fieldHtml).join('')}</div>${after}<div id="modal-error"></div>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-modal-close>${submit ? 'Cancel' : 'Close'}</button>${submit ? `<button type="submit" class="btn btn-primary">${esc(submit)}</button>` : ''}</div></form></div>`;
    document.body.appendChild(wrap);
    modalState = { onSubmit };
    const first = wrap.querySelector('input,select'); if (first) first.focus();
  }

  /* ---------- Toasts ---------- */
  function toast(msg) {
    let root = $('#toast-root');
    if (!root) { root = document.createElement('div'); root.id = 'toast-root'; document.body.appendChild(root); }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 2800);
  }

  /* ---------- Static data ---------- */
  const NAV = [
    ['Overview', '/dashboard', 'dashboard'],
    ['Workouts', '/workouts', 'dumbbell'],
    ['Nutrition', '/nutrition', 'utensils'],
    ['Diet knowledge', '/nutrition/diet', 'leaf'],
    ['Daily intake', '/nutrition/daily-intake', 'target'],
    ['Daily intake guide', '/nutrition/daily-intake-guide', 'clipboard'],
    ['Food scanner', '/scanners/food', 'scan'],
    ['Body scanner', '/scanners/body', 'activity'],
    ['Supplement scanner', '/scanners/supplement', 'flask'],
    ['Progress', '/progress', 'trending'],
    ['Mind map', '/mind-map', 'brain'],
  ];

  const IMG = [
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
  ];

  const SESSIONS = [
    { title: 'PPL · Push Day A', sub: 'Chest, shoulders, triceps', tag: 'STRENGTH', min: 45, sets: 18, level: 'Intermediate', split: 'Push-pull legs', cat: 'Heavy lifter', muscles: ['Chest', 'Shoulder', 'Triceps'], img: IMG[0] },
    { title: 'Back width focus', sub: 'Lats, rhomboids, biceps', tag: 'HYPERTROPHY', min: 52, sets: 21, level: 'Intermediate', split: 'Bro split', cat: 'Body building', muscles: ['Back', 'Biceps'], img: IMG[1] },
    { title: 'Leg day annihilation', sub: 'Quads, hamstrings, calves', tag: 'CONDITIONING', min: 60, sets: 24, level: 'Pro', split: 'Push-pull legs', cat: 'Athletic', muscles: ['Legs'], img: IMG[2] },
    { title: 'Full-body foundations', sub: 'Squat, press, row', tag: 'CONDITIONING', min: 40, sets: 15, level: 'Beginner', split: 'Hybrid split', cat: 'General fitness', muscles: ['Legs', 'Chest', 'Back', 'Shoulder'], img: IMG[0] },
    { title: 'Upper body power', sub: 'Chest, back, shoulders', tag: 'STRENGTH', min: 45, sets: 20, level: 'Intermediate', split: 'Upper and lower body', cat: 'Athletic', muscles: ['Chest', 'Back', 'Shoulder'], img: IMG[1] },
    { title: 'Arms & core finisher', sub: 'Biceps, triceps, abs', tag: 'HYPERTROPHY', min: 35, sets: 16, level: 'Beginner', split: 'Bro split', cat: 'Body building', muscles: ['Biceps', 'Triceps', 'Core', 'Forearms'], img: IMG[2] },
  ];

  const HYPER = {
    Chest: { focus: 'Pressing strength and upper-chest volume', ex: ['Barbell bench press', 'Incline dumbbell press', 'Cable chest fly', 'Push-up mechanical drop set'] },
    Triceps: { focus: 'Elbow extension with controlled lockout', ex: ['Close-grip bench press', 'Overhead cable extension', 'Rope pressdown', 'EZ-bar skull crusher'] },
    Back: { focus: 'Lat width and mid-back thickness', ex: ['Pull-up or assisted pull-up', 'Chest-supported row', 'Neutral-grip lat pulldown', 'Straight-arm pulldown'] },
    Biceps: { focus: 'Lengthened curls and peak contraction', ex: ['Incline dumbbell curl', 'EZ-bar curl', 'Hammer curl', 'Bayesian cable curl'] },
    Shoulder: { focus: 'Medial-delt volume with stable pressing', ex: ['Seated dumbbell press', 'Cable lateral raise', 'Machine shoulder press', 'Reverse pec deck'] },
    Legs: { focus: 'Quad, hamstring, and glute hypertrophy', ex: ['Back squat', 'Romanian deadlift', 'Leg press', 'Seated leg curl'] },
    Core: { focus: 'Loaded flexion and anti-extension control', ex: ['Cable crunch', 'Hanging knee raise', 'Ab-wheel rollout', 'Pallof press'] },
    Forearms: { focus: 'Grip endurance and wrist flexor volume', ex: ['Farmer carry', 'Wrist curl', 'Reverse wrist curl', 'Dead hang'] },
  };

  const RECOVERY = [
    ['Chest', '48 hours', IMG[0]], ['Arms (Biceps & Triceps)', '48 hours', IMG[1]], ['Forearms', '24 hours', IMG[2]],
    ['Back', '48–72 hours', IMG[1]], ['Shoulders', '48 hours', IMG[0]], ['Legs (Quads, Hamstrings & Glutes)', '48–72 hours', IMG[2]],
    ['Abs (Core)', '24 hours', IMG[0]],
  ];

  const MEALS = [
    { name: 'Grilled salmon & asparagus', lead: 'A high-protein plate with clean, measured fuel.', kcal: 450, p: 40, c: 10, f: 28, tags: ['omega 3', 'lean protein', 'micronutrients'] },
    { name: 'Chicken burrito bowl', lead: 'Balanced plate with slow carbs and lean protein.', kcal: 620, p: 45, c: 68, f: 18, tags: ['lean protein', 'complex carbs', 'fibre'] },
    { name: 'Idli with sambar', lead: 'Light, fermented carbs with plant protein and fibre.', kcal: 360, p: 12, c: 66, f: 5, tags: ['fermented', 'plant protein', 'fibre'] },
    { name: 'Paneer tikka with roti', lead: 'Protein-forward plate; watch the added oil.', kcal: 540, p: 30, c: 45, f: 26, tags: ['dairy protein', 'calcium', 'whole grain'] },
    { name: 'Greek yogurt parfait', lead: 'Quick protein snack with probiotics.', kcal: 310, p: 24, c: 38, f: 7, tags: ['probiotics', 'protein', 'calcium'] },
    { name: 'Oats with banana & whey', lead: 'Pre-training fuel with steady-release carbs.', kcal: 480, p: 34, c: 70, f: 9, tags: ['slow carbs', 'protein', 'potassium'] },
    { name: 'Egg & avocado toast', lead: 'Healthy fats with moderate protein.', kcal: 430, p: 20, c: 34, f: 24, tags: ['healthy fats', 'protein', 'fibre'] },
  ];

  const KNOWLEDGE = [
    { title: 'Calorie deficit', summary: 'Eating fewer calories than you use over time can support weight loss.', guidance: 'Start conservatively, keep protein adequate, train consistently, and review trends over several weeks.' },
    { title: 'Calorie surplus', summary: 'Eating more calories than you use can support body-mass gain.', guidance: 'Prefer a measured surplus with progressive training so more of the gain can come from lean tissue.' },
    { title: 'Weight gain', summary: 'Body weight increases when average energy intake exceeds expenditure.', guidance: 'Track weekly averages, strength progress, appetite, digestion, and recovery—not one daily weigh-in.' },
    { title: 'Fat loss', summary: 'Fat loss is the reduction of stored body fat, usually through a sustained energy deficit.', guidance: 'Use a realistic pace, preserve resistance training, prioritize protein, sleep, and adherence.' },
    { title: 'Weight loss', summary: 'Weight loss includes changes in water, glycogen, food volume, muscle, and fat.', guidance: 'Look at multi-week trends and waist measurements to avoid overreacting to normal fluctuations.' },
    { title: 'Body recomposition', summary: 'Recomposition aims to reduce fat while maintaining or increasing lean mass.', guidance: 'It is more gradual: combine resistance training, adequate protein, recovery, and calories near maintenance.' },
  ];

  const INTAKE = [
    { name: 'Protein', amount: 'About 1.2–2.0 g/kg/day', note: 'Active people often benefit from the higher end; distribute across meals and adjust for health needs.' },
    { name: 'Carbohydrates', amount: 'About 45–65% of daily energy', note: 'Choose portions based on activity, training volume, preference, and total calorie needs.' },
    { name: 'Fat', amount: 'About 20–35% of daily energy', note: 'Include varied unsaturated sources; do not treat a percentage as a prescription.' },
    { name: 'Fibre', amount: 'About 25–38 g/day', note: 'Increase gradually with fluids using vegetables, fruit, legumes, whole grains, nuts, and seeds.' },
    { name: 'Micronutrients', amount: 'Vitamins and minerals from variety', note: 'Prioritize a diverse diet; supplements are not automatically safer or better than food.' },
  ];

  const MIND = [
    ['overview', null, 'Overview', 'root', 'Your performance system at a glance.'],
    ['workout-split', 'overview', 'Workout split', 'section', "Choose the right training intent for today's session."],
    ['all-sessions', 'workout-split', 'All sessions', 'branch', 'Browse strength, hypertrophy, conditioning, and recovery.'],
    ['strength', 'all-sessions', 'Strength', 'category', 'Low-rep, high-intent work for force production.'],
    ['hypertrophy', 'all-sessions', 'Hypertrophy', 'category', 'Volume-focused work for muscle growth.'],
    ['conditioning', 'all-sessions', 'Conditioning', 'category', 'Build work capacity and general fitness.'],
    ['recovery', 'all-sessions', 'Recovery', 'category', 'Mobility, breathing, and readiness work.'],
    ['athletic', 'strength', 'Athletic training', 'path', 'Power, speed, and useful strength.'],
    ['bodybuilding', 'hypertrophy', 'Bodybuilding', 'path', 'Muscle-building protocols with deliberate volume.'],
    ['muscular-endurance', 'hypertrophy', 'Muscular endurance', 'path', 'Sustain quality output under fatigue.'],
    ['heavy-lifter', 'hypertrophy', 'Heavy lifter', 'path', 'Progressive overload for experienced lifters.'],
    ['general-fitness', 'conditioning', 'General fitness', 'path', 'Accessible conditioning for daily performance.'],
    ['nutrition', 'overview', 'Nutrition', 'section', 'Understand the fuel behind your output.'],
    ['scanner', 'nutrition', 'Scanner', 'branch', 'Use data capture to reduce nutrition guesswork.'],
    ['food-scanner', 'scanner', 'Food scanner', 'tool', 'Estimate calories and macros from a meal.'],
    ['supplement-scanner', 'scanner', 'Supplement scanner', 'tool', 'Record ingredients, serving size, and intent.'],
    ['body-scanner', 'scanner', 'Body scanner', 'tool', 'Track body composition signals over time.'],
    ['bmi-calculator', 'nutrition', 'BMI calculator', 'calculator', 'A directional health metric from height and weight.'],
    ['body-composition', 'bmi-calculator', 'Body composition', 'metric', 'Use trends, not a single number, to understand change.'],
    ['protein', 'bmi-calculator', 'Protein', 'macro', 'Support repair and muscle retention.'],
    ['fibre', 'bmi-calculator', 'Fibre', 'macro', 'Support digestion and satiety.'],
    ['fat', 'bmi-calculator', 'Fat', 'macro', 'Support hormones and energy density.'],
    ['carbs', 'bmi-calculator', 'Carbs', 'macro', 'Fuel training output and recovery.'],
    ['diet-knowledge', 'overview', 'Diet knowledge', 'section', 'The principles behind calorie balance.'],
    ['calorie-deficit', 'diet-knowledge', 'Calorie deficit', 'principle', 'A sustainable deficit can support fat loss.'],
    ['calorie-surplus', 'diet-knowledge', 'Calorie surplus', 'principle', 'A measured surplus can support lean mass gain.'],
    ['fat-loss', 'calorie-deficit', 'Fat loss', 'outcome', 'Prioritize consistency, protein, and recovery.'],
    ['lean-gain', 'calorie-surplus', 'Lean gain', 'outcome', 'Build gradually while tracking performance.'],
  ].map(([id, parentId, label, kind, description]) => ({ id, parentId, label, kind, description }));

  const PREF_ROWS = [
    { key: 'goal', label: 'Primary goal', icon: 'target', opts: ['Build strength', 'Lose fat', 'Build muscle', 'Stay consistent'] },
    { key: 'days', label: 'Training days', icon: 'dumbbell', opts: ['2 days / week', '3 days / week', '4 days / week', '5 days / week', '6 days / week'] },
    { key: 'metric', label: 'Focus metric', icon: 'zap', opts: ['Power output', 'Body weight', 'Consistency', 'Recovery score'] },
    { key: 'coach', label: 'Coach guidance', icon: 'brain', opts: ['AI-assisted', 'Self-guided', 'Minimal prompts'] },
  ];

  /* ---------- Calculators (ported from the original server code) ---------- */
  const bmiCategory = b => (b < 18.5 ? 'underweight' : b < 25 ? 'healthy range' : b < 30 ? 'overweight' : 'obesity range');
  function calcBmi(h, w) {
    if (!(h >= 100 && h <= 240)) return { error: 'Height must be between 100 and 240 cm.' };
    if (!(w >= 25 && w <= 300)) return { error: 'Weight must be between 25 and 300 kg.' };
    const m = h / 100;
    const bmi = Number((w / (m * m)).toFixed(1));
    return { bmi, category: bmiCategory(bmi), min: Number((18.5 * m * m).toFixed(1)), max: Number((24.9 * m * m).toFixed(1)) };
  }
  function calcNutrition({ age = 30, sex = 'unspecified', h = 175, w, goal, activity }) {
    if (!(age >= 13 && age <= 100)) return { error: 'Age must be between 13 and 100.' };
    if (!(h >= 100 && h <= 240)) return { error: 'Height must be between 100 and 240 cm.' };
    if (!(w >= 25 && w <= 300)) return { error: 'Weight must be between 25 and 300 kg.' };
    const base = sex === 'male' ? 5 : sex === 'female' ? -161 : -78;
    const bmr = 10 * w + 6.25 * h - 5 * age + base;
    const factor = { light: 1.35, moderate: 1.55, high: 1.75 }[activity] || 1.55;
    const adj = { fat_loss: -300, muscle_gain: 250, maintenance: 0, body_recomposition: -50 }[goal] ?? 0;
    const calories = Math.max(1200, Math.round(bmr * factor + adj));
    const protein = Math.round(w * (['muscle_gain', 'body_recomposition'].includes(goal) ? 2.0 : 1.7));
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
    return { calories, protein, carbs, fat, fibre: Math.round(calories / 100) };
  }
  function calcBody(h, w, bf, waist) {
    if (!(h >= 100 && h <= 240)) return { error: 'Height must be between 100 and 240 cm.' };
    if (!(w >= 25 && w <= 300)) return { error: 'Weight must be between 25 and 300 kg.' };
    if (!(bf >= 2 && bf <= 70)) return { error: 'Body fat must be between 2 and 70 %.' };
    if (!(waist >= 40 && waist <= 250)) return { error: 'Waist must be between 40 and 250 cm.' };
    const hm = h / 100;
    const lean = Number((w * (1 - bf / 100)).toFixed(1));
    const whr = Number((waist / h).toFixed(2));
    return {
      bodyFat: bf, lean, fat: Number((w - lean).toFixed(1)), bmi: Number((w / (hm * hm)).toFixed(1)), whr,
      hydration: Number((60 - Math.max(0, bf - 15) * 0.15).toFixed(1)),
      note: whr < 0.5 ? 'Waist-to-height signal is below 0.50; keep tracking the trend.' : 'Waist-to-height signal is at or above 0.50; consider discussing context with a qualified professional.',
    };
  }
  function analyzeSupplement(name, ingredients) {
    const n = ingredients.toLowerCase();
    const findings = [];
    const add = (nm, type, note) => findings.push({ name: nm, type, note });
    if (/proprietary blend|matrix/.test(n)) add('Proprietary blend', 'transparency', 'Individual ingredient doses may be hidden; compare the label with products that disclose amounts.');
    if (/caffeine|guarana|coffee|tea extract|yohimbine|synephrine/.test(n)) add('Stimulant signal', 'stimulant', 'Check total stimulant exposure across servings, coffee, medications, and time of day.');
    if (/milk|whey|casein|lactose|soy|soya|egg|peanut|tree nut|gluten|wheat/.test(n)) add('Potential allergen', 'allergen', 'Review the allergen statement and avoid if it conflicts with your known allergy or intolerance.');
    if (/sucralose|acesulfame|aspartame|saccharin|sorbitol|erythritol/.test(n)) add('Sweetener / sugar alcohol', 'tolerance', 'Some people experience gastrointestinal symptoms; check serving size and personal tolerance.');
    if (/dmha|dmaa|ephedra|ephedrine|sibutramine|trenbolone|prohormone/.test(n)) add('High-concern ingredient', 'high attention', 'Do not use until independently verified with a qualified clinician and local regulator guidance.');
    if (!findings.length) add('No common flags detected', 'screening', 'A clean text screen does not prove purity, identity, dose accuracy, or authenticity.');
    const high = findings.some(f => f.type === 'high attention');
    return {
      productName: name,
      risk: high ? 'high' : findings.some(f => ['stimulant', 'allergen', 'transparency'].includes(f.type)) ? 'review' : 'low',
      summary: high ? 'A high-attention ingredient signal was found. Do not treat this screen as a safety clearance.' : 'The label has been screened for common ingredient signals; verify the manufacturer and serving details.',
      findings,
      checklist: ['Confirm the manufacturer, lot/batch number, and expiry date', 'Check a tamper seal and compare the label with the official product page', 'Look for independent quality testing or certification', 'Ask a pharmacist or clinician if pregnant, medicated, or managing a condition'],
    };
  }

  /* ---------- Per-page UI state ---------- */
  const P = {
    wk: { tab: 'All sessions', level: 'All levels', split: 'All splits', cat: 'All categories', focus: 'All muscle groups', length: 'Any duration', muscle: 'Chest' },
    scan: { busy: false, meal: 0, image: null },
    nt: { tab: 'knowledge', height: '175', weight: '75', bodyFat: '18', waist: '82', age: '30', sex: 'unspecified', activity: 'moderate', goal: 'maintenance', suppName: '', ingredients: '', bodyImage: null, suppImage: null, ocrBusy: false, body: null, supp: null, calc: null, err: null },
    mm: { sel: 'overview', calc: 'bmi', height: '175', weight: '75', goal: 'maintenance', activity: 'moderate', bmi: null, nut: null, err: null },
    pf: { prefs: { ...S.prefs }, saved: false },
    food: { q: '', serv: '1' },
  };
  let mobileOpen = false;

  /* ---------- Small UI builders ---------- */
  const brand = (compact = false) => `<div class="brand ${compact ? 'brand-compact' : ''}"><div class="brand-mark"><span>F</span><span>8</span></div><div><div class="brand-name">FIT WITH <b>DI8</b></div>${compact ? '' : '<div class="brand-subtitle">PERFORMANCE SYSTEM</div>'}</div></div>`;
  const btn = (html, attrs = '', variant = 'primary', cls = '') => `<button type="button" class="btn btn-${variant} ${cls}" ${attrs}>${html}</button>`;
  const options = (list, val) => list.map(o => `<option${o === val ? ' selected' : ''}>${esc(o)}</option>`).join('');
  const optionsKV = (list, val) => list.map(([v, l]) => `<option value="${v}"${v === val ? ' selected' : ''}>${esc(l)}</option>`).join('');
  const pageTitle = (eyebrow, title, desc, action = '') => `<section class="page-heading inner-heading"><div><div class="eyebrow"><span class="pulse"></span> ${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div><div class="heading-actions">${action}</div></section>`;

  /* ---------- Routing ---------- */
  const VALID = ['/', '/signin', '/dashboard', '/workouts', '/nutrition', '/nutrition/diet', '/nutrition/daily-intake', '/nutrition/daily-intake-guide', '/scanners', '/scanners/food', '/scanners/body', '/scanners/supplement', '/progress', '/mind-map', '/profile', '/workouts/session'];
  const currentPath = () => {
    let p = (location.hash || '').replace(/^#/, '') || '/';
    if (!p.startsWith('/')) p = '/' + p;
    return p.length > 1 ? p.replace(/\/+$/, '') : p;
  };
  const go = path => {
    closeModal();
    if (currentPath() === path) { render(true); return; }
    location.hash = '#' + path;
  };
  const NT_TAB = { '/nutrition': 'knowledge', '/nutrition/diet': 'knowledge', '/nutrition/daily-intake': 'calculator', '/nutrition/daily-intake-guide': 'daily-intake', '/scanners/body': 'body', '/scanners/supplement': 'supplement' };

  /* ===================== PAGES ===================== */

  /* ---- Landing ---- */
  function Landing() {
    const tool = (ic, n, t, c) => `<article class="tool-card"><div class="tool-top"><div class="tool-icon">${icon(ic, 18)}</div><span>${n}</span></div><h3>${t}</h3><p>${c}</p>${icon('arrowUpRight', 17, 'tool-arrow')}</article>`;
    return `<main class="landing">
      <div class="landing-hero"><div class="hero-image"></div><div class="hero-shade"></div>
        <header class="landing-nav">${brand(true)}<div class="landing-nav-right"><a data-scroll="tools">The system</a><a data-scroll="how">How it works</a><a data-scroll="method">Method</a><button class="sign-in-link" data-go="/signin">Sign in ${icon('arrowUpRight', 14)}</button></div></header>
        <div class="landing-copy"><div class="eyebrow light"><span class="pulse"></span> PERFORMANCE SYSTEM / 01</div><h1>Earn your<br><em>next level.</em></h1><p>A sharper system for the people who refuse to plateau. Training, fuel, and recovery — measured with intent.</p>
          <div class="landing-actions">${btn(`Enter the system ${icon('arrowRight', 15)}`, 'data-go="/dashboard"')}<button class="outline-link" data-scroll="tools">Explore the method <span class="arrow-down">↓</span></button></div></div>
        <div class="hero-note"><span>SCROLL TO EXPLORE</span><i></i></div><div class="hero-index">01 <span>/</span> 04</div></div>
      <section id="tools" class="tools-section"><div class="section-intro"><div><div class="eyebrow">THE DI8 SYSTEM</div><h2>Everything you need<br><em>to make progress visible.</em></h2></div><p>Precision tools for a less complicated kind of discipline. Built to remove guesswork from the work that matters.</p></div>
        <div class="tool-grid">${tool('dumbbell', '01', 'Training protocols', 'AI-structured sessions that adapt to the way you move.')}${tool('utensils', '02', 'Fuel intelligence', 'Scan your plate. Understand your output. Eat with intent.')}${tool('scan', '03', 'Body signals', 'Track the quiet metrics that tell the loudest story.')}${tool('trending', '04', 'Progress reports', 'See consistency compound across every session.')}</div></section>
      <section id="how" class="how-section"><div class="section-intro"><div><div class="eyebrow">HOW IT WORKS</div><h2>Three steps.<br><em>Zero guesswork.</em></h2></div><p>No account walls, no clutter. Open it, log it, and watch the pattern appear.</p></div><div class="how-grid"><article class="how-card"><span>01</span><h3>Train</h3><p>Pick a session, log every set and weight, and let the rest timer run the clock.</p></article><article class="how-card"><span>02</span><h3>Fuel</h3><p>Search the food database or add meals manually. Calories and macros update instantly.</p></article><article class="how-card"><span>03</span><h3>Review</h3><p>Streaks, load and nutrition adherence turn into charts that show what is working.</p></article></div></section>
      <section id="method" class="manifesto"><div class="manifesto-mark">DI8</div><div><div class="eyebrow">THE METHOD / 04</div><h2>Discipline is the<br><em>bridge between goals</em><br>and accomplishment.</h2>${btn(`Start building ${icon('arrowRight', 15)}`, 'data-go="/signin"')}</div></section>
      <footer class="landing-footer">${brand(true)}<span>© 2026 DI8 PERFORMANCE SYSTEM</span><div><a data-toast="Instagram link coming soon." style="cursor:pointer">Instagram</a><a data-toast="Privacy: your data stays in this browser." style="cursor:pointer">Privacy</a></div></footer>
    </main>`;
  }

  /* ---- Sign in (local demo auth) ---- */
  function SignIn() {
    return `<main class="auth"><div class="auth-image"><div class="auth-brand">${brand(true)}<span class="eyebrow light">AUTH / 01</span></div><div class="auth-quote"><span>“</span><p>Make the next<br>rep count.</p></div><div class="auth-copyright">DI8 / PERFORMANCE SYSTEM<br>© 2026 ALL RIGHTS RESERVED</div></div>
      <div class="auth-form-wrap"><button class="back-home" data-go="/">${icon('chevronRight', 15, 'back-arrow')} Back to home</button>
        <div class="auth-form"><div class="eyebrow">WELCOME BACK</div><h1>Sign in to<br><em>your system.</em></h1><p>Access your performance dashboard and keep the signal moving.</p>
          <form id="signin-form" novalidate><label>Email address<input name="email" type="email" placeholder="alex@athlete.com" autocomplete="email"></label><label>Password<input name="password" type="password" placeholder="••••••••" autocomplete="current-password"></label>
            <div id="signin-error"></div>
            <div class="form-options"><label class="check-label"><input type="checkbox" checked> <span>Remember me</span></label><button type="button" data-toast="Password reset instructions sent (demo).">Forgot password?</button></div>
            <button type="submit" class="btn btn-primary full-width">Enter dashboard ${icon('arrowRight', 15)}</button></form>
          <div class="auth-or"><span>OR CONTINUE WITH</span></div>
          <div class="socials"><button type="button" data-toast="Google sign-in needs a real backend — use email for this demo.">G <span>Google</span></button><button type="button" data-toast="Apple sign-in needs a real backend — use email for this demo.">● <span>Apple</span></button></div>
          <div class="auth-switch">New to DI8? <button type="button" data-toast="Just enter any email and password to create a local profile.">Create an account ${icon('arrowUpRight', 13)}</button></div></div></div></main>`;
  }

  /* ---- Dashboard ---- */
  function macro(label, val, target, tone) {
    const pct = clamp(Math.round((val / target) * 100), 0, 100);
    return `<div class="macro"><div class="macro-label"><span>${label}</span><b>${Math.round(val)}g <small>/ ${target}g</small></b></div><div class="bar"><i class="${tone}" style="width:${pct}%"></i></div></div>`;
  }
  function statCard(ic, label, value, detail, tone = 'red', attrs = '', extra = '') {
    return `<div class="stat-card ${attrs ? 'clickable' : ''}" ${attrs} ${attrs ? 'role="button" tabindex="0"' : ''}><div class="stat-icon ${tone}">${icon(ic, 17)}</div><div class="stat-copy"><span>${label}</span><strong>${value}</strong><small>${detail}</small>${extra}</div>${icon('arrowUpRight', 15, 'stat-arrow')}</div>`;
  }
  function suggestedIndex() { const i = SESSIONS.findIndex(s => s.title === S.focus); return i >= 0 ? i : S.workoutLog.length % SESSIONS.length; }
  function weekChart() {
    const days = lastDays(7);
    const loads = days.map(d => loadOn(dayKey(d)));
    const any = loads.some(x => x > 0);
    const pts = loads.map((v, i) => [i * (620 / 6), 135 - v * 1.15]);
    let path = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [px, py] = pts[i - 1], [x, y] = pts[i]; const mx = (px + x) / 2; path += ` C${mx} ${py}, ${mx} ${y}, ${x} ${y}`; }
    const goalY = 135 - 75 * 1.15;
    const labels = days.map(d => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()]);
    return `<div class="chart"><div class="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="chart-area"><div class="chart-grid-lines"><i></i><i></i><i></i><i></i></div>
      <svg viewBox="0 0 620 150" preserveAspectRatio="none" role="img" aria-label="Training load over the last 7 days"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e3131b"/><stop offset="1" stop-color="#e3131b" stop-opacity="0"/></linearGradient></defs>
      <line x1="0" x2="620" y1="${goalY}" y2="${goalY}" stroke="#56625a" stroke-dasharray="5 6" vector-effect="non-scaling-stroke"/>
      <path d="${path} L620 150 L0 150 Z" fill="url(#chartFill)" opacity=".18"/><path d="${path}" fill="none" stroke="#e3131b" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
      ${any ? '' : '<div class="chart-empty">Finish a workout to see your weekly load</div>'}
      <div class="chart-x">${labels.map(l => `<span>${l}</span>`).join('')}</div></div></div>`;
  }
  function Dashboard() {
    const d = new Date();
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const mons = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dateStr = `${days[d.getDay()]}, ${pad2(d.getDate())} ${mons[d.getMonth()]} ${d.getFullYear()}`;
    const hr = d.getHours();
    const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    const first = displayName().split(' ')[0];
    const t = totalsOn(todayKey()), tg = S.targets, dd = dayData();
    const deg = clamp(t.kcal / tg.kcal, 0, 1) * 360;
    const remaining = Math.max(0, tg.kcal - t.kcal);
    const si = S.active ? S.active.idx : suggestedIndex(), s = SESSIONS[si];
    const todays = S.foodLog.map((m, i) => ({ ...m, i })).filter(m => m.date === todayKey());
    const weekCount = S.workoutLog.filter(w => lastDays(7).map(dayKey).includes(w.date)).length;
    const sh = Math.floor(dd.sleep), sm = Math.round((dd.sleep - sh) * 60);
    return `
    <section class="page-heading"><div><div class="eyebrow"><span class="pulse"></span> ${dateStr}</div><h1>${greet}, ${esc(first)}<span class="red">.</span></h1><p>Train with intent. Your next level is already in motion.</p></div><div class="heading-actions"><div class="streak-pill">${icon('flame', 15)}<span><b>${streak()}</b> day streak</span></div><button class="more-button" data-action="settings" aria-label="Settings">${icon('settings', 18)}</button></div></section>
    <div class="hero-grid">
      <div class="workout-feature panel"><div class="panel-top"><div><span class="eyebrow red-text">${S.active ? 'SESSION IN PROGRESS' : "TODAY'S FOCUS / 01"}</span><h2>${esc(s.title)}<br><em>${esc(s.sub)}</em></h2></div><span class="status-chip"><span></span> ${S.active ? 'ACTIVE' : 'READY'}</span></div>
        <div class="feature-bottom"><div><span class="muted-label">ESTIMATED TIME</span><strong>${s.min} <small>MIN</small></strong></div><div class="feature-divider"></div><div><span class="muted-label">PLANNED SETS</span><strong>${s.sets} <small>SETS</small></strong></div>${btn(`${icon('play', 14)} ${S.active ? 'Resume workout' : 'Start workout'} ${icon('arrowRight', 15)}`, S.active ? 'data-go="/workouts/session"' : `data-action="wk-start" data-arg="${si}"`, 'primary', 'play-button')}</div></div>
      <div class="panel calorie-panel"><div class="panel-top"><span class="eyebrow">CALORIE METER</span><button class="text-action" data-action="settings">Targets</button></div>
        <div class="ring-wrap"><div class="ring" style="--ring:${deg}deg"><div><strong>${fmtNum(t.kcal)}</strong><span>KCAL</span></div></div><div class="ring-foot"><span><i class="dot red-dot"></i>of ${fmtNum(tg.kcal)}</span><b>${fmtNum(remaining)} kcal remaining</b></div></div></div>
    </div>
    <div class="content-grid">
      <div class="panel macros-panel"><div class="panel-top"><div><span class="eyebrow">NUTRITION MACROS</span><h3>Today's intake</h3></div><button class="text-action" data-go="/nutrition/daily-intake">Calculate targets ${icon('arrowRight', 13)}</button></div>${macro('Protein', t.p, tg.p, 'red')}${macro('Carbs', t.c, tg.c, 'green')}${macro('Fats', t.f, tg.f, 'cream')}</div>
      <div class="panel progress-panel"><div class="panel-top"><div><span class="eyebrow">WEEKLY PROGRESS</span><h3>Training load</h3></div><div class="chart-legend"><span><i class="dot red-dot"></i> Load</span><span><i class="dot gray-dot"></i> Goal</span></div></div>${weekChart()}</div>
    </div>
    <div class="stats-row">
      ${statCard('activity', 'STEPS', dd.steps ? fmtNum(dd.steps) : '—', dd.steps ? `${Math.round(dd.steps / 100)}% of 10,000 goal` : 'Tap to log today', 'red', 'data-action="log-steps"')}
      ${statCard('gauge', 'HYDRATION', `${(dd.water / 1000).toFixed(1)} L`, `${Math.round(dd.water / S.settings.water * 100)}% of ${(S.settings.water / 1000).toFixed(1)} L goal`, 'blue', 'data-action="water-edit"', '<button class="mini-add" data-action="water-add" data-arg="250">+250 ml</button>')}
      ${statCard('moon', 'SLEEP', dd.sleep ? `${sh}h ${pad2(sm)}m` : '—', dd.sleep ? (dd.sleep >= 7 ? 'Good recovery' : 'Below 7h target') : 'Tap to log last night', 'violet', 'data-action="log-sleep"')}
      ${statCard('heart', 'WORKOUTS (7 DAYS)', String(weekCount), `${streak()} day streak`, 'green', 'data-go="/progress"')}
    </div>
    <div class="panel fuel-log"><div class="panel-top"><div><span class="eyebrow">FUEL LOG</span><h3>Meals logged today</h3></div><div class="heading-actions">${btn(`${icon('plus', 13)} Add manually`, 'data-action="food-custom"', 'ghost', 'btn-sm')}${btn(`${icon('scan', 13)} Scan / search`, 'data-go="/scanners/food"', 'ghost', 'btn-sm')}</div></div>
      ${todays.length ? todays.map(m => `<div class="fuel-row"><span class="fuel-thumb">${icon('utensils', 15)}</span><div class="fuel-name"><strong>${esc(m.name)}</strong><span>${m.time} · P ${m.p}g · C ${m.c}g · F ${m.f}g</span></div><b>${m.kcal} kcal</b><button aria-label="Remove meal" data-action="fuel-remove" data-arg="${m.i}">${icon('x', 14)}</button></div>`).join('') : '<div class="fuel-log-empty">Nothing logged yet. Search the food database, scan a meal, or add one manually.</div>'}</div>`;
  }

  /* ---- Workouts ---- */
  function Workouts() {
    const w = P.wk;
    const list = SESSIONS.filter(s =>
      (w.level === 'All levels' || s.level === w.level) &&
      (w.split === 'All splits' || s.split === w.split) &&
      (w.cat === 'All categories' || s.cat === w.cat) &&
      (w.focus === 'All muscle groups' || s.muscles.includes(w.focus)) &&
      (w.length === 'Any duration' || (w.length === 'Under 45 min' ? s.min < 45 : s.min >= 45)) &&
      (w.tab !== 'Hypertrophy' || s.tag === 'HYPERTROPHY'));
    const sel = (label, key, opts) => `<label>${label}<select data-model="wk.${key}" data-rerender>${options(opts, w[key])}</select></label>`;
    const hyper = w.tab === 'Hypertrophy' ? `<div class="hypertrophy-workspace"><div class="panel workout-insight hypertrophy-insight"><div><span class="eyebrow red-text">HYPERTROPHY PROTOCOL</span><h2>Controlled volume, quality reps.</h2><p>Choose a muscle group to reveal exercises matched to the 8–12 rep range.</p></div><div class="rep-range"><strong>8–12</strong><span>reps per working set</span></div></div>
      <div class="hypertrophy-muscles">${Object.keys(HYPER).map(m => `<button class="hypertrophy-muscle ${w.muscle === m ? 'selected' : ''}" data-action="wk-muscle" data-arg="${m}"><span>${m}</span><small>8–12 reps</small></button>`).join('')}</div>
      <div class="panel exercise-recommendations"><div><span class="eyebrow red-text">TAILORED EXERCISES / ${w.muscle.toUpperCase()}</span><h3>${HYPER[w.muscle].focus}</h3><p>Perform 3–4 working sets per exercise with controlled tempo and 1–3 reps in reserve.</p></div><div class="exercise-list">${HYPER[w.muscle].ex.map((e, i) => `<div class="exercise-row"><span>${pad2(i + 1)}</span><b>${e}</b><strong>8–12</strong></div>`).join('')}</div></div></div>` : '';
    const rec = w.tab === 'Recovery' ? `<section class="recovery-section"><div class="recovery-heading"><div><span class="eyebrow red-text">RECOVERY INTELLIGENCE</span><h2>Give each muscle the time it needs.</h2><p>Use these evidence-informed recovery windows to plan your next hard session.</p></div>${icon('heart', 22)}</div>
      <div class="recovery-grid">${RECOVERY.map(([m, h, img]) => `<article class="recovery-card panel"><div class="recovery-image" style="background-image:linear-gradient(180deg,transparent 15%,rgba(8,10,10,.95) 100%),url('${img}')"><span>${m}</span></div><div class="recovery-copy"><span class="eyebrow">RECOVERY WINDOW</span><strong>${h}</strong><p>Wait before repeating high-intensity work.</p></div></article>`).join('')}</div></section>` : '';
    const cards = list.length ? list.map(s => {
      const idx = SESSIONS.indexOf(s);
      return `<article class="session-card panel"><div class="session-image" style="background-image:linear-gradient(180deg,transparent 26%,rgba(8,10,10,.95) 100%),url('${s.img}')"><span class="session-tag">${s.tag}</span></div>
        <div class="session-content"><span class="eyebrow">SESSION ${pad2(idx + 1)} / PERFORMANCE</span><h3>${esc(s.title)}</h3><p>${esc(s.sub)}</p><div class="session-meta"><span>${icon('clock', 13)} ${s.min} min</span><span>${icon('dumbbell', 13)} ${s.sets} sets</span></div>${btn(`${icon('play', 13)} Start session`, `data-action="wk-start" data-arg="${idx}"`, 'dark', 'session-cta')}</div></article>`;
    }).join('') : '<div class="empty-sessions panel">No sessions match these filters. Try widening your selection.</div>';
    const banner = S.active ? `<div class="panel resume-banner"><div><span class="eyebrow red-text"><span class="pulse"></span> SESSION IN PROGRESS</span><h3>${esc(SESSIONS[S.active.idx].title)}</h3></div>${btn(`${icon('play', 13)} Resume`, 'data-go="/workouts/session"')}</div>` : '';
    return pageTitle('TRAINING LIBRARY', 'Workouts', 'Choose your level, split, and training category, then start a session built for your current intent.', btn(`${icon('play', 15)} Start suggested session`, `data-action="wk-start" data-arg="${suggestedIndex()}"`, 'ghost')) + banner +
      `<div class="filter-panel panel"><div class="filter-tabs">${['All sessions', 'Hypertrophy', 'Recovery'].map(x => `<button class="${w.tab === x ? 'selected' : ''}" data-action="wk-tab" data-arg="${x}">${x}</button>`).join('')}</div>
      <div class="filters workout-selectors">${sel('LEVEL', 'level', ['All levels', 'Beginner', 'Intermediate', 'Pro'])}${sel('WORKOUT SPLIT', 'split', ['All splits', 'Bro split', 'Upper and lower body', 'Push-pull legs', 'Hybrid split'])}${sel('CATEGORY', 'cat', ['All categories', 'General fitness', 'Heavy lifter', 'Body building', 'Athletic'])}${sel('FOCUS', 'focus', ['All muscle groups', ...Object.keys(HYPER)])}${sel('SESSION LENGTH', 'length', ['Any duration', 'Under 45 min', '45+ min'])}</div>
      <div class="active-workout-filters"><span>LEVEL <b>${w.level}</b></span><span>SPLIT <b>${w.split}</b></span><span>CATEGORY <b>${w.cat}</b></span></div></div>` + hyper + rec + `<div class="session-grid">${cards}</div>`;
  }

  /* ---- Live workout session ---- */
  const REST = { STRENGTH: 120, HYPERTROPHY: 75, CONDITIONING: 45 };
  function buildExercises(s) {
    const reps = s.tag === 'STRENGTH' ? 5 : s.tag === 'HYPERTROPHY' ? 10 : 15;
    const per = s.muscles.length >= 4 ? 1 : 2;
    let names = [];
    s.muscles.forEach(m => ((HYPER[m] && HYPER[m].ex) || []).slice(0, per).forEach(n => names.push(n)));
    names = names.slice(0, 7);
    const nSets = clamp(Math.round(s.sets / Math.max(1, names.length)), 2, 5);
    return names.map(n => ({ name: n, sets: Array.from({ length: nSets }, () => ({ target: reps, reps: '', kg: '', done: false })) }));
  }
  function startSession(idx) {
    if (S.active && S.active.idx !== idx && !confirm('You have an unfinished session. Replace it with this one?')) { go('/workouts/session'); return; }
    if (!S.active || S.active.idx !== idx) { S.active = { idx, start: Date.now(), restUntil: 0, ex: buildExercises(SESSIONS[idx]) }; S.focus = SESSIONS[idx].title; }
    save(); go('/workouts/session');
  }
  function updateSet(el) {
    const [e, s, f] = el.dataset.ws.split(':');
    const st = S.active && S.active.ex[+e] && S.active.ex[+e].sets[+s];
    if (!st) return;
    const clean = el.value.replace(f === 'reps' ? /[^0-9]/g : /[^0-9.]/g, '');
    if (clean !== el.value) el.value = clean;
    st[f] = clean; save();
  }
  function WorkoutSession() {
    const a = S.active, s = SESSIONS[a.idx];
    const total = a.ex.reduce((n, e) => n + e.sets.length, 0), done = a.ex.reduce((n, e) => n + e.sets.filter(x => x.done).length, 0);
    const pct = total ? Math.round(done / total * 100) : 0;
    return pageTitle(`LIVE SESSION / ${s.tag}`, esc(s.title), `${esc(s.sub)} · ${REST[s.tag] || 60}s rest between sets`,
      btn(`${icon('check', 15)} Finish workout`, 'data-action="ws-finish"') + btn('Discard', 'data-action="ws-discard"', 'ghost')) +
      `<div class="ws-bar panel"><div><span class="muted-label">ELAPSED</span><strong id="ws-elapsed">00:00</strong></div><div><span class="muted-label">REST TIMER</span><strong id="ws-rest" class="ws-rest">—</strong></div>
        <div class="ws-progress"><div class="ws-progress-top"><span class="muted-label">SETS COMPLETE</span><b>${done} / ${total}</b></div><div class="bar"><i class="red" style="width:${pct}%"></i></div></div></div>` +
      a.ex.map((e, ei) => `<article class="panel ws-ex"><div class="panel-top"><div><span class="eyebrow red-text">EXERCISE ${pad2(ei + 1)}</span><h3>${esc(e.name)}</h3></div><span class="ws-count">${e.sets.filter(x => x.done).length}/${e.sets.length}</span></div>
        <div class="ws-table"><div class="ws-head"><span>SET</span><span>KG</span><span>REPS</span><span></span></div>
        ${e.sets.map((st, si) => `<div class="ws-row ${st.done ? 'done' : ''}"><span class="ws-n">${si + 1}</span><input class="ws-in" inputmode="decimal" data-ws="${ei}:${si}:kg" value="${esc(st.kg)}" placeholder="0" aria-label="Weight in kg, set ${si + 1}"><input class="ws-in" inputmode="numeric" data-ws="${ei}:${si}:reps" value="${esc(st.reps)}" placeholder="${st.target}" aria-label="Reps, set ${si + 1}"><button class="ws-check" data-action="ws-toggle" data-arg="${ei}:${si}" aria-label="Mark set ${si + 1} done" aria-pressed="${st.done}">${icon('check', 15)}</button></div>`).join('')}</div>
        <button class="text-action" data-action="ws-add-set" data-arg="${ei}">${icon('plus', 13)} Add set</button></article>`).join('');
  }
  setInterval(() => {
    const a = S.active;
    if (!a || currentPath() !== '/workouts/session') return;
    const el = $('#ws-elapsed');
    if (el) { const sec = Math.max(0, Math.floor((Date.now() - a.start) / 1000)); el.textContent = `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`; }
    const r = $('#ws-rest');
    if (r) {
      const left = Math.ceil((a.restUntil - Date.now()) / 1000);
      if (a.restUntil && left > 0) { r.textContent = `${Math.floor(left / 60)}:${pad2(left % 60)}`; r.classList.add('active'); }
      else { r.textContent = '—'; r.classList.remove('active'); if (a.restUntil) { a.restUntil = 0; save(); toast('Rest over — next set.'); } }
    }
  }, 500);

  /* ---- Food database (quick add) ---- */
  const FOODS = [
    ['Egg, boiled', '1 large', 78, 6, 0.6, 5], ['Banana', '1 medium', 105, 1.3, 27, 0.4], ['Apple', '1 medium', 95, 0.5, 25, 0.3],
    ['White rice, cooked', '1 cup', 205, 4.3, 45, 0.4], ['Chapati / roti', '1 medium', 104, 3, 18, 3], ['Idli', '2 pieces', 120, 4, 24, 0.5],
    ['Plain dosa', '1 piece', 133, 3, 22, 3.7], ['Sambar', '1 cup', 130, 7, 20, 3], ['Dal tadka', '1 cup', 210, 11, 28, 6],
    ['Paneer', '100 g', 265, 18, 3.6, 20], ['Chicken breast, grilled', '100 g', 165, 31, 0, 3.6], ['Chicken curry', '1 cup', 240, 22, 8, 13],
    ['Fish curry', '1 cup', 220, 24, 6, 11], ['Curd / plain yogurt', '1 cup', 150, 8, 11, 8], ['Greek yogurt', '170 g', 100, 17, 6, 0.7],
    ['Milk, whole', '1 cup', 150, 8, 12, 8], ['Whey protein', '1 scoop', 120, 24, 3, 1.5], ['Oats, dry', '40 g', 150, 5, 27, 3],
    ['Peanut butter', '1 tbsp', 95, 4, 3, 8], ['Almonds', '28 g', 164, 6, 6, 14], ['Avocado toast', '1 slice', 220, 5, 22, 13],
    ['Whole wheat bread', '1 slice', 80, 4, 14, 1], ['Sweet potato, baked', '1 medium', 112, 2, 26, 0.1], ['Broccoli, steamed', '1 cup', 55, 3.7, 11, 0.6],
    ['Salmon, grilled', '100 g', 208, 22, 0, 13], ['Tofu, firm', '100 g', 144, 17, 3, 9], ['Chickpeas, cooked', '1 cup', 270, 15, 45, 4],
    ['Rajma (kidney beans)', '1 cup', 225, 13, 40, 1], ['Upma', '1 cup', 220, 5, 32, 8], ['Chicken biryani', '1 cup', 290, 14, 38, 9],
    ['Pasta, cooked', '1 cup', 220, 8, 43, 1.3], ['Orange juice', '1 cup', 110, 2, 26, 0.5],
  ].map(([name, serving, kcal, p, c, f]) => ({ name, serving, kcal, p, c, f }));
  function foodRows() {
    const q = P.food.q.trim().toLowerCase(), m = Number(P.food.serv) || 1;
    const hits = FOODS.map((f, i) => ({ f, i })).filter(x => !q || x.f.name.toLowerCase().includes(q)).slice(0, 10);
    if (!hits.length) return '<div class="food-empty">No foods match. Use “Add manually” for a custom entry.</div>';
    return hits.map(({ f, i }) => `<div class="food-row"><div class="food-info"><strong>${esc(f.name)}</strong><span>${m === 1 ? '' : m + ' × '}${esc(f.serving)}</span></div><div class="food-macros"><b>${Math.round(f.kcal * m)} kcal</b><small>P ${Math.round(f.p * m)} · C ${Math.round(f.c * m)} · F ${Math.round(f.f * m)}</small></div>${btn(`${icon('plus', 13)} Add`, `data-action="food-add" data-arg="${i}"`, 'dark', 'btn-sm')}</div>`).join('');
  }
  function quickAdd() {
    return `<div class="panel quick-add"><div class="panel-top"><div><span class="eyebrow red-text">FOOD DATABASE</span><h3>Search &amp; quick add</h3></div>${btn(`${icon('plus', 13)} Add manually`, 'data-action="food-custom"', 'ghost', 'btn-sm')}</div>
      <div class="quick-add-bar"><label class="wide-label qa-search">SEARCH<input data-model="food.q" value="${esc(P.food.q)}" placeholder="e.g. idli, chicken, oats…" autocomplete="off"></label>
      <label class="wide-label qa-serv">PORTION<select data-model="food.serv" data-rerender>${optionsKV([['0.5', '½ serving'], ['1', '1 serving'], ['1.5', '1½ servings'], ['2', '2 servings']], String(P.food.serv))}</select></label></div>
      <div id="food-results" class="food-results">${foodRows()}</div></div>`;
  }

  /* ---- Food scanner ---- */
  function FoodScanner() {
    const s = P.scan, m = MEALS[s.meal];
    const imgStyle = s.image ? `style="background-image:linear-gradient(0deg,rgba(6,8,7,.42),rgba(6,8,7,.05)),url('${s.image}')"` : '';
    return pageTitle('AI INTELLIGENCE', 'Food intelligence', 'Use precision AI to understand what fuels your output.', btn(`${icon('plus', 15)} Add manually`, 'data-action="food-custom"', 'ghost')) +
      `<div class="scanner-layout"><div class="scan-visual panel"><div class="scan-visual-top"><span class="eyebrow red-text"><span class="pulse"></span> AI VISION ACTIVE</span><span class="scan-code">SCAN / 00${41 + s.meal}</span></div>
        <div class="scan-image food-image" ${imgStyle}><div class="scan-corner tl"></div><div class="scan-corner tr"></div><div class="scan-corner bl"></div><div class="scan-corner br"></div><div class="scan-line"></div><div class="food-overlay"><span>${s.busy ? 'ANALYZING COMPOSITION...' : 'COMPOSITION ESTIMATED'}</span><b>${esc(m.name.toUpperCase())}</b></div></div>
        <div class="scan-actions">${btn(s.busy ? `${icon('activity', 15, 'spin')} Analyzing...` : `${icon('scan', 15)} Scan food`, `data-action="scan-run" ${s.busy ? 'disabled' : ''}`)}<label class="btn btn-dark" style="cursor:pointer">${icon('plus', 15)} Upload<input type="file" accept="image/*" data-file="food" hidden></label></div>
        <p class="scan-note">Demo estimate: real photo recognition needs an AI service. This build cycles through sample meals — pick the closest match on the right, then log it.</p></div>
        <div class="analysis panel"><div class="analysis-header"><span class="status-chip green-chip"><span></span> MATCH FOUND</span>${icon('more', 17)}</div><h2>${esc(m.name)}</h2><p class="analysis-lead">${esc(m.lead)}</p>
          <div class="kcal"><strong>${m.kcal}</strong><span>kcal</span></div>
          <div class="nutrient-grid"><div><span>Protein</span><strong>${m.p}g</strong><i style="width:${clamp(m.p / 50 * 100, 5, 100)}%"></i></div><div><span>Carbs</span><strong>${m.c}g</strong><i style="width:${clamp(m.c / 80 * 100, 5, 100)}%"></i></div><div><span>Fats</span><strong>${m.f}g</strong><i style="width:${clamp(m.f / 35 * 100, 5, 100)}%"></i></div></div>
          <div class="ingredient-block"><span class="eyebrow">KEY INGREDIENTS</span><div>${m.tags.map(t => `<b>${t}</b>`).join('')}</div></div>
          <label class="wide-label" style="margin-bottom:14px">NOT RIGHT? CHOOSE MEAL<select data-model="scan.meal" data-rerender data-number>${MEALS.map((x, i) => `<option value="${i}"${i === s.meal ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label>
          ${btn(`${icon('check', 15)} Add to daily intake`, 'data-action="scan-log"', 'primary', 'full-width')}</div></div>${quickAdd()}`;
  }

  /* ---- Nutrition tools (diet knowledge, calculators, body & supplement scanners) ---- */
  function NutritionTools(standalone) {
    const n = P.nt, t = n.tab;
    const input = (label, key, mode = 'decimal') => `<label>${label}<input data-model="nt.${key}" value="${esc(n[key])}" inputmode="${mode}"></label>`;
    let body = '';
    const err = n.err ? `<div class="field-error">${esc(n.err)}</div>` : '';

    if (t === 'body') {
      const r = n.body;
      body = `<div class="nutrition-feature-grid"><div class="panel nutrition-form-panel"><div class="panel-top"><div><span class="eyebrow red-text">BODY SCANNER / COMPOSITION</span><h2>Find your lean signal.</h2></div>${icon('clipboard', 18, 'muted-icon')}</div>
        <p class="feature-copy">Upload a suitable full-body image for reference, then add measurements from a consistent method. The analysis estimates lean mass, fat mass, BMI, and a waist-to-height signal.</p>
        <label class="upload-drop"><input type="file" accept="image/*" data-file="body">${icon('dumbbell', 18)}<span>${n.bodyImage ? 'Body image ready for analysis' : 'Upload full-body image'}</span><small>JPG, PNG · max 8 MB · optional reference</small></label>
        ${n.bodyImage ? `<img class="scan-preview" src="${n.bodyImage}" alt="Uploaded body scan reference">` : ''}
        <div class="tool-form-grid">${input('HEIGHT (CM)', 'height')}${input('WEIGHT (KG)', 'weight')}${input('BODY FAT (%)', 'bodyFat')}${input('WAIST (CM)', 'waist')}</div>${err}
        ${btn(`${icon('dumbbell', 14)} Analyze body composition ${icon('arrowRight', 14)}`, 'data-action="nt-body"', 'primary', 'full-width')}
        <div class="tool-disclaimer">${icon('info', 14)} Bioimpedance, tape, and visual estimates can be inaccurate. Track the same method over time; consult a qualified professional for clinical assessment.</div></div>
        <div class="panel result-panel">${r ? `<span class="eyebrow">LATEST ESTIMATE</span><div class="metric-big"><strong>${r.bodyFat}%</strong><span>body fat</span></div><div class="metric-list"><div><span>Lean mass</span><b>${r.lean} kg</b></div><div><span>Fat mass</span><b>${r.fat} kg</b></div><div><span>BMI</span><b>${r.bmi}</b></div><div><span>Waist / height</span><b>${r.whr}</b></div></div><div class="signal-callout">${icon('check', 14)} ${esc(r.note)}</div>${btn(`${icon('check', 14)} Save to progress`, 'data-action="nt-body-save"', 'dark', 'full-width')}` : `<div class="empty-tool"><div>${icon('dumbbell', 25)}<h3>Your results appear here</h3><p>Enter your measurements to estimate body fat and lean mass signals.</p></div></div>`}</div></div>`;
    } else if (t === 'supplement') {
      const r = n.supp;
      body = `<div class="nutrition-feature-grid"><div class="panel nutrition-form-panel"><div class="panel-top"><div><span class="eyebrow red-text">SUPPLEMENT SCANNER / LABEL REVIEW</span><h2>Read beyond the front label.</h2></div>${icon('flask', 18, 'muted-icon')}</div>
        <p class="feature-copy">Upload a label/package image to extract readable text in your browser (OCR), then review or correct the ingredient panel before screening. You can also just paste the ingredients.</p>
        <label class="upload-drop compact-upload"><input type="file" accept="image/*" data-file="supp">${icon('flask', 18)}${n.ocrBusy ? '<span>Reading label text...</span><small>OCR is running locally — this can take 10–30 seconds</small>' : `<span>${n.suppImage ? 'Label image ready for review' : 'Upload label or package image'}</span><small>Browser OCR · JPG, PNG, WebP · max 8 MB</small>`}</label>
        ${n.suppImage ? `<img class="label-preview" src="${n.suppImage}" alt="Uploaded supplement label">` : ''}
        <label class="wide-label">PRODUCT NAME<input data-model="nt.suppName" value="${esc(n.suppName)}" placeholder="Example: Pre-workout / whey isolate"></label>
        <label class="wide-label">INGREDIENT PANEL<textarea data-model="nt.ingredients" rows="8" placeholder="OCR results appear here. Review or paste ingredients manually...">${esc(n.ingredients)}</textarea></label>${err}
        ${btn(`${icon('flask', 14)} Screen supplement label ${icon('arrowRight', 14)}`, 'data-action="nt-supp"', 'primary', 'full-width')}
        <div class="tool-disclaimer">${icon('alert', 14)} OCR can misread small or obscured text. This screen flags concerns but cannot prove authenticity, purity, contamination status, or safety for your medical history. Verify with the manufacturer and a pharmacist or clinician.</div></div>
        <div class="panel result-panel">${r ? `<div class="analysis-header"><span class="status-chip ${r.risk === 'low' ? 'green-chip' : 'red-chip'}"><span></span> ${r.risk.toUpperCase()} ATTENTION</span></div><span class="eyebrow" style="margin-top:14px">LABEL REVIEW</span><h2 style="margin:8px 0;color:#eff1ec;font:500 23px 'Space Grotesk'">${esc(r.productName)}</h2><p class="analysis-lead">${esc(r.summary)}</p>
          <div class="ingredient-findings">${r.findings.map(f => `<div class="ingredient-finding"><div><b>${esc(f.name)}</b><span>${esc(f.type)}</span></div><p>${esc(f.note)}</p></div>`).join('')}</div>
          <div class="verification-list"><b>Verification checklist</b>${r.checklist.map(c => `<span>${icon('check', 13)} ${esc(c)}</span>`).join('')}</div>` : `<div class="empty-tool"><div>${icon('flask', 25)}<h3>Upload a label to begin</h3><p>OCR extracts readable product, serving, ingredient, warning, and batch details for your review.</p></div></div>`}</div></div>`;
    } else if (t === 'calculator') {
      const r = n.calc;
      body = `<div class="nutrition-feature-grid"><div class="panel nutrition-form-panel"><div class="panel-top"><div><span class="eyebrow red-text">REQUIREMENTS / ESTIMATE</span><h2>Build your daily baseline.</h2></div>${icon('target', 18, 'muted-icon')}</div>
        <p class="feature-copy">Use age, sex, height, weight, activity, and goal to estimate calories, macros, fibre, and water. These are educational starting points—not medical prescriptions.</p>
        <div class="tool-form-grid">${input('AGE', 'age', 'numeric')}<label>SEX<select data-model="nt.sex">${optionsKV([['unspecified', 'Not specified'], ['female', 'Female'], ['male', 'Male']], n.sex)}</select></label>${input('HEIGHT (CM)', 'height')}${input('WEIGHT (KG)', 'weight')}
          <label>ACTIVITY<select data-model="nt.activity">${optionsKV([['light', 'Light'], ['moderate', 'Moderate'], ['high', 'High']], n.activity)}</select></label>
          <label>GOAL<select data-model="nt.goal">${optionsKV([['weight_gain', 'Weight gain'], ['fat_loss', 'Fat loss'], ['maintenance', 'Maintenance'], ['body_recomposition', 'Body recomposition']], n.goal)}</select></label></div>${err}
        ${btn(`${icon('target', 14)} Calculate daily requirements ${icon('arrowRight', 14)}`, 'data-action="nt-calc"', 'primary', 'full-width')}
        <div class="tool-disclaimer">${icon('info', 14)} Estimates vary by individual. Adjust based on multi-week trends and seek professional guidance for medical or individualized concerns.</div></div>
        <div class="panel result-panel">${r ? `<span class="eyebrow">ESTIMATED DAILY TARGETS</span><div class="metric-big"><strong>${r.calories}</strong><span>kcal</span></div><div class="metric-list"><div><span>Protein</span><b>${r.protein} g</b></div><div><span>Carbohydrates</span><b>${r.carbs} g</b></div><div><span>Fat</span><b>${r.fat} g</b></div><div><span>Fibre / water</span><b>${r.fibre} g · ${r.water} L</b></div></div><div class="signal-callout">${icon('check', 14)} Use the target as a starting baseline, then monitor energy, performance, hunger, and recovery.</div>${btn(`${icon('check', 14)} Use as my dashboard targets`, 'data-action="nt-calc-use"', 'dark', 'full-width')}` : `<div class="empty-tool"><div>${icon('target', 25)}<h3>Calculate your baseline</h3><p>Complete the profile inputs to see calories, protein, carbohydrates, fat, fibre, and water targets.</p></div></div>`}</div></div>`;
    } else if (t === 'knowledge') {
      body = `<div class="knowledge-grid">${KNOWLEDGE.map((k, i) => `<article class="panel knowledge-card"><div class="knowledge-number">${pad2(i + 1)}</div><h2>${k.title}</h2><p>${k.summary}</p><div><b>DI8 PRINCIPLE</b><span>${k.guidance}</span></div></article>`).join('')}</div>`;
    } else {
      body = `<div class="knowledge-grid daily-intake-grid">${INTAKE.map((k, i) => `<article class="panel knowledge-card"><div class="knowledge-number">${pad2(i + 1)}</div><h2>${k.name}</h2><p class="daily-amount">${k.amount}</p><div><b>DI8 GUIDE</b><span>${k.note}</span></div></article>`).join('')}</div>`;
    }
    const tabs = !standalone ? `<div class="nutrition-tabs">${[['knowledge', 'leaf', 'Diet knowledge'], ['calculator', 'target', 'Daily requirements'], ['daily-intake', 'utensils', 'Daily intake guide']].map(([k, ic, l]) => `<button class="${t === k ? 'active' : ''}" data-action="nt-tab" data-arg="${k}">${icon(ic, 15)} ${l}</button>`).join('')}</div>` : '';
    return `<section class="nutrition-tools-page"><div class="page-heading inner-heading"><div><div class="eyebrow"><span class="pulse"></span> NUTRITION INTELLIGENCE / 02</div><h1>Know what goes in<span class="red">.</span></h1><p>Estimate body composition, screen supplement labels, and learn the fundamentals behind the numbers.</p></div><div class="nutrition-safety">${icon('shield', 14)} ESTIMATES WITH CONTEXT</div></div>${tabs}${body}
      <div class="nutrition-footnote">${icon('target', 15)} Nutrition education is general information, not individualized medical advice. Your trend, symptoms, medications, and history matter.</div></section>`;
  }

  /* ---- Progress ---- */
  function Progress() {
    const days = lastDays(7), keys = days.map(dayKey);
    const wk = S.workoutLog.filter(w => keys.includes(w.date));
    const recent = S.workoutLog.slice(-12);
    const avgLoad = wk.length ? Math.round(wk.reduce((a, w) => a + w.load, 0) / wk.length) : null;
    const nut = keys.map(k => { const t = totalsOn(k).kcal; return t ? clamp(Math.round(t / S.targets.kcal * 100), 0, 100) : 0; });
    const logged = nut.filter(x => x > 0);
    const adh = logged.length ? Math.round(logged.reduce((a, b) => a + b, 0) / logged.length) : null;
    const dots = lastDays(28).map(d => S.workoutLog.some(w => w.date === dayKey(d)));
    const scans = S.bodyScans.slice(-3).reverse();
    const hist = S.workoutLog.slice(-8).reverse();
    const volWeek = wk.reduce((a, w) => a + w.volume, 0);
    return pageTitle('MEASURE WHAT MATTERS', 'Progress', 'Your performance is a pattern. See the signal, not the noise.', btn(`${icon('arrowUpRight', 14)} Export data`, 'data-action="export-data"', 'ghost')) +
      `<div class="progress-summary"><div class="panel highlight-stat"><span class="eyebrow">AVG TRAINING LOAD (7 DAYS)</span><strong>${avgLoad === null ? '—' : avgLoad}</strong><span class="positive">${icon('trending', 13)} ${wk.length} session${wk.length === 1 ? '' : 's'} · ${fmtNum(volWeek)} kg volume</span>
        ${recent.length ? `<div class="mini-bars">${recent.map((w, i) => `<i style="height:${Math.max(8, w.load)}%" class="${i >= recent.length - 3 ? 'hot' : ''}"></i>`).join('')}</div>` : '<p class="kpi-empty">Complete a workout to see your load trend.</p>'}</div>
      <div class="panel highlight-stat"><span class="eyebrow">STREAK</span><strong>${streak()} <small>DAYS</small></strong><span class="positive">${icon('flame', 13)} Last 28 days</span><div class="streak-dots">${dots.map(x => `<i class="${x ? 'filled' : ''}"></i>`).join('')}</div></div>
      <div class="panel highlight-stat"><span class="eyebrow">NUTRITION ADHERENCE</span><strong>${adh === null ? '—' : adh}<span class="unit">${adh === null ? '' : '%'}</span></strong><span class="positive">${icon('heart', 13)} ${logged.length ? `${logged.length} day${logged.length === 1 ? '' : 's'} logged this week` : 'Log meals to track this'}</span><div class="recovery-track"><i style="width:${adh || 0}%"></i></div></div></div>
      <div class="panel report-panel"><div class="panel-top"><div><span class="eyebrow">PERFORMANCE REPORT</span><h3>Training load vs nutrition adherence — last 7 days</h3></div><div class="chart-legend"><span><i class="dot red-dot"></i> Load</span><span><i class="dot gray-dot"></i> Calories vs target</span></div></div>
        <div class="report-chart"><div class="report-grid">${['100%', '75%', '50%', '25%', '0%'].map(x => `<span>${x}</span>`).join('')}</div><div class="report-bars">${days.map((d, i) => `<div class="report-day"><div class="report-bar-group"><i style="height:${loadOn(keys[i])}%" title="Load ${loadOn(keys[i])}%"></i><i style="height:${nut[i]}%" title="Calories ${nut[i]}%"></i></div><span>${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()]}</span></div>`).join('')}</div></div></div>
      <div class="panel fuel-log"><div class="panel-top"><div><span class="eyebrow">WORKOUT HISTORY</span><h3>Recent sessions</h3></div>${btn(`${icon('play', 13)} Browse workouts`, 'data-go="/workouts"', 'ghost', 'btn-sm')}</div>
        ${hist.length ? hist.map(w => `<div class="fuel-row"><span class="fuel-thumb">${icon('dumbbell', 15)}</span><div class="fuel-name"><strong>${esc(w.title)}</strong><span>${w.date} · ${w.min} min · ${w.sets} sets · ${fmtNum(w.volume)} kg volume</span></div><b>${w.load}%</b><button aria-label="Delete workout" data-action="wl-remove" data-arg="${w.id}">${icon('x', 14)}</button></div>`).join('') : '<div class="fuel-log-empty">No workouts logged yet. Start a session and finish it to see it here.</div>'}</div>` +
      (scans.length ? `<div class="panel fuel-log"><div class="panel-top"><div><span class="eyebrow">BODY SCAN LOG</span><h3>Saved estimates</h3></div><button class="text-action" data-go="/scanners/body">New scan ${icon('arrowRight', 13)}</button></div>${scans.map(s => `<div class="fuel-row"><span class="fuel-thumb">${icon('activity', 15)}</span><div class="fuel-name"><strong>${s.bodyFat}% body fat</strong><span>${s.date} · lean ${s.lean} kg · fat ${s.fat} kg · BMI ${s.bmi}</span></div></div>`).join('')}</div>` : '');
  }

  /* ---- Profile ---- */
  function Profile() {
    const name = displayName();
    const vol = S.workoutLog.reduce((a, w) => a + w.volume, 0);
    const active28 = new Set(S.workoutLog.map(w => w.date)).size;
    return pageTitle('PERSONAL SYSTEM', 'Profile', 'Tune the system to the way you train.',
      `${btn(`${icon('check', 15)} ${P.pf.saved ? 'Saved' : 'Save changes'}`, 'data-action="pf-save"')}${btn(`${icon('settings', 15)} Edit profile &amp; targets`, 'data-action="settings"', 'ghost')}${S.user ? btn('Sign out', 'data-action="pf-signout"', 'ghost') : btn('Sign in', 'data-go="/signin"', 'ghost')}`) +
      `<div class="profile-grid"><div class="panel profile-card"><div class="profile-avatar">${esc(initialsOf(name))}<span></span></div><h2>${esc(name)}</h2><p>${S.user ? esc(S.user.email) : 'Guest · data saved on this device'}</p><div class="profile-tags"><span>${esc(PREF_ROWS[0].opts[P.pf.prefs.goal]).toUpperCase()}</span><span>${P.pf.prefs.days + 2} DAYS / WEEK</span></div><div class="profile-divider"></div>
        <div class="profile-stat-row"><div><strong>${S.workoutLog.length}</strong><span>sessions</span></div><div><strong>${vol >= 10000 ? (vol / 1000).toFixed(1) + 't' : fmtNum(vol) + 'kg'}</strong><span>total volume</span></div><div><strong>${streak()}</strong><span>day streak</span></div></div>
        <p class="profile-note">${active28} active training day${active28 === 1 ? '' : 's'} recorded</p><div style="margin-top:18px">${btn('Reset local data', 'data-action="pf-reset"', 'ghost')}</div></div>
        <div class="panel preferences"><div class="panel-top"><div><span class="eyebrow">PREFERENCES</span><h3>Training setup <small class="hint">(click a row to change)</small></h3></div>${icon('settings', 17)}</div>
          ${PREF_ROWS.map(r => `<div class="preference-row" data-action="pf-cycle" data-arg="${r.key}" style="cursor:pointer" role="button" tabindex="0"><div class="preference-icon">${icon(r.icon, 16)}</div><div><span>${r.label}</span><strong>${r.opts[P.pf.prefs[r.key]] || r.opts[0]}</strong></div>${icon('chevronRight', 15)}</div>`).join('')}</div></div>`;
  }

  /* ---- Mind map ---- */
  const kindIcon = k => (['category', 'path'].includes(k) ? 'dumbbell' : ['tool', 'calculator'].includes(k) ? 'scan' : k === 'macro' ? 'leaf' : ['principle', 'outcome'].includes(k) ? 'target' : k === 'section' ? 'utensils' : 'brain');
  function MindMap() {
    const m = P.mm;
    const sel = MIND.find(x => x.id === m.sel) || MIND[0];
    const kids = MIND.filter(x => x.parentId === sel.id);
    const path = []; for (let c = sel; c; c = MIND.find(x => x.id === c.parentId)) path.unshift(c);
    const branches = MIND.filter(x => x.parentId === 'overview');
    const isBranchActive = id => { for (let c = sel; c; c = MIND.find(x => x.id === c.parentId)) if (c.id === id) return true; return false; };
    const field = (label, key) => `<label>${label}<input data-model="mm.${key}" value="${esc(m[key])}" inputmode="decimal"></label>`;
    return `<section class="mindmap-page"><div class="page-heading mindmap-heading"><div><div class="eyebrow"><span class="pulse"></span> SYSTEM MAP / RUNS IN YOUR BROWSER</div><h1>Information architecture<span class="red">.</span></h1><p>Move from the handwritten plan to a navigable performance system.</p></div><div class="mindmap-status"><span class="pulse"></span> LOCAL DATA LAYER</div></div>
      <div class="mindmap-layout"><div class="mindmap-canvas panel"><div class="mindmap-canvas-head"><div><span class="eyebrow red-text">DI8 PERFORMANCE MIND MAP</span><h2>Follow the signal.</h2></div><span class="mindmap-count">${MIND.length} nodes</span></div>
        <div class="mindmap-root-line"><div class="mindmap-node root-node" data-action="mm-select" data-arg="overview" role="button" tabindex="0">${icon('brain', 18)}<span>Overview</span><small>performance system</small></div><div class="mindmap-connector"></div></div>
        <div class="mindmap-branches">${branches.map(b => `<button class="mindmap-node branch-node ${isBranchActive(b.id) ? 'selected' : ''}" data-action="mm-select" data-arg="${b.id}">${icon(kindIcon(b.kind), 15)}<span>${b.label}</span>${icon('chevronRight', 13, 'node-arrow')}</button>`).join('')}</div>
        <div class="mindmap-detail-grid"><div class="mindmap-detail panel-inset"><span class="eyebrow">SELECTED BRANCH</span><h3>${sel.label}</h3><p>${sel.description}</p>
          <div class="mindmap-children">${kids.length ? kids.map(c => `<button data-action="mm-select" data-arg="${c.id}">${icon(kindIcon(c.kind), 14)}<span>${c.label}</span>${icon('arrowRight', 13)}</button>`).join('') : '<span class="empty-note">This node is an endpoint. Use the calculator and scanner tools to make it actionable.</span>'}</div></div>
          <div class="mindmap-path panel-inset"><span class="eyebrow">CURRENT PATH</span><div class="path-stack">${path.map((p, i) => `<button data-action="mm-select" data-arg="${p.id}"><span>${pad2(i + 1)}</span>${p.label}</button>`).join('')}</div><div class="path-note">${icon('info', 14)} Every branch maps to a future data source, workflow, or metric.</div></div></div></div>
        <aside class="mindmap-side"><div class="panel backend-panel"><div class="panel-top"><div><span class="eyebrow">DATA SIGNALS</span><h3>Data layer status</h3></div><span class="live-badge"><i></i> LIVE</span></div>
          <div class="backend-stats"><div><strong>${SESSIONS.length}</strong><span>workout protocols</span></div><div><strong>${S.foodLog.length}</strong><span>meals logged</span></div><div><strong>${S.workoutLog.length}</strong><span>sessions completed</span></div></div><div class="backend-note">${icon('dumbbell', 14)} Workout library loaded. Logs are stored on this device.</div></div>
          <div class="panel calculator-panel"><div class="panel-top"><div><span class="eyebrow">DECISION TOOLS</span><h3>Make the map measurable</h3></div>${icon('calculator', 17, 'muted-icon')}</div>
            <div class="calculator-tabs"><button class="${m.calc === 'bmi' ? 'active' : ''}" data-action="mm-calc-tab" data-arg="bmi">BMI</button><button class="${m.calc === 'nutrition' ? 'active' : ''}" data-action="mm-calc-tab" data-arg="nutrition">Nutrition</button></div>
            <div class="calculator-fields">${field('HEIGHT (CM)', 'height')}${field('WEIGHT (KG)', 'weight')}</div>
            ${m.calc === 'nutrition' ? `<div class="calculator-fields"><label>GOAL<select data-model="mm.goal">${optionsKV([['fat_loss', 'Fat loss'], ['muscle_gain', 'Muscle gain'], ['maintenance', 'Maintenance']], m.goal)}</select></label><label>ACTIVITY<select data-model="mm.activity">${optionsKV([['light', 'Light'], ['moderate', 'Moderate'], ['high', 'High']], m.activity)}</select></label></div>` : ''}
            ${m.err ? `<div class="field-error" style="margin-bottom:8px">${esc(m.err)}</div>` : ''}
            <button class="btn full-width calculator-submit" data-action="mm-calc">${icon('flame', 14)} Calculate ${m.calc === 'bmi' ? 'BMI' : 'targets'} ${icon('arrowRight', 14)}</button>
            ${m.bmi && m.calc === 'bmi' ? `<div class="result-card"><span class="eyebrow">BMI RESULT</span><strong>${m.bmi.bmi}</strong><b>${m.bmi.category}</b><small>Healthy directional range: ${m.bmi.min}–${m.bmi.max} kg</small></div>` : ''}
            ${m.nut && m.calc === 'nutrition' ? `<div class="result-card nutrition-result"><span class="eyebrow">DAILY TARGETS</span><strong>${m.nut.calories} <small>KCAL</small></strong><div><b>${m.nut.protein}g</b> protein <b>${m.nut.carbs}g</b> carbs <b>${m.nut.fat}g</b> fat</div><small>${m.nut.fibre}g fibre target</small></div>` : ''}</div></aside></div>
      <div class="mindmap-footnote"><span>${icon('scan', 14)} Food scanner</span><span>${icon('target', 14)} Body scanner</span><span>${icon('calculator', 14)} BMI calculator</span><span>${icon('leaf', 14)} Diet knowledge</span><span class="footnote-copy">Calculators run locally in your browser; logs are saved on this device only.</span></div></section>`;
  }

  /* ---- Not found ---- */
  function NotFound() {
    return `<main class="auth" style="display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px"><div><div class="eyebrow" style="justify-content:center">ERROR / 404</div><h1 style="font:500 56px 'Space Grotesk';letter-spacing:-.06em;margin:14px 0">Page not found<span class="red">.</span></h1><p style="color:#7f8b84;font-size:12px;margin-bottom:24px">That route doesn't exist in the DI8 system.</p>${btn('Back to home', 'data-go="/"')}</div></main>`;
  }

  /* ---- App shell ---- */
  function Shell(path, content) {
    const active = path === '/scanners' ? '/scanners/food' : path === '/workouts/session' ? '/workouts' : path;
    const initials = initialsOf(displayName());
    return `<div class="app-shell"><div class="mobile-overlay" id="overlay"></div>
      <div class="sidebar-wrap" id="sidebar"><aside class="sidebar"><div class="sidebar-top">${brand()}<div class="sidebar-live"><span></span> SYSTEM LIVE</div></div>
        <nav class="nav-list" aria-label="Primary navigation"><div class="nav-label">WORKSPACE</div>${NAV.map(([l, h, ic]) => `<a class="nav-item ${active === h ? 'active' : ''}" href="#${h}" data-nav ${active === h ? 'aria-current="page"' : ''}>${icon(ic, 16)}<span>${l}</span>${active === h ? icon('chevronRight', 14, 'nav-chevron') : ''}</a>`).join('')}</nav>
        <div class="sidebar-bottom"><div class="coach-card"><div class="coach-icon">${icon('brain', 15)}</div><div><strong>DI8 Coach</strong><span>Ready when you are</span></div><span class="coach-dot"></span></div>
          <a class="nav-item ${active === '/profile' ? 'active' : ''}" href="#/profile" data-nav>${icon('user', 16)}<span>Profile</span></a>
          <button class="nav-item nav-button" data-action="settings">${icon('settings', 16)}<span>Settings</span></button>
          <button class="nav-item nav-button" data-toast="Support: hello@di8.example (demo).">${icon('help', 16)}<span>Support</span></button>
          <div class="sidebar-footnote">DI8 / V1.0.4 <span>© 2026</span></div></div></aside></div>
      <div class="main-area"><header class="topbar"><button class="mobile-menu" data-action="menu" aria-label="Open menu">${icon('menu', 20)}</button>
        <div class="crumbs"><span>WORKSPACE</span>${icon('chevronRight', 13)}<strong>PERFORMANCE HUB</strong></div>
        <div class="top-actions"><button class="search-mini" data-action="quick-open">${icon('search', 14)}<span>Quick find</span><kbd>Ctrl K</kbd></button><button class="icon-button" data-action="notif" aria-label="Notifications">${icon('bell', 17)}${notices().length ? '<i></i>' : ''}</button><button class="avatar-button" data-go="/profile" aria-label="Profile">${esc(initials)}</button></div></header>
        <main class="workspace" id="workspace">${content}</main></div></div>`;
  }

  function pageContent(path) {
    switch (path) {
      case '/dashboard': return Dashboard();
      case '/workouts': return Workouts();
      case '/workouts/session': return WorkoutSession();
      case '/nutrition': case '/nutrition/diet': case '/nutrition/daily-intake': case '/nutrition/daily-intake-guide': return NutritionTools(false);
      case '/scanners/body': case '/scanners/supplement': return NutritionTools(true);
      case '/scanners': case '/scanners/food': return FoodScanner();
      case '/progress': return Progress();
      case '/mind-map': return MindMap();
      case '/profile': return Profile();
      default: return '';
    }
  }

  /* ---------- Render ---------- */
  let lastPath = null;
  function render(inPlace) {
    const root = $('#root');
    const path = currentPath();
    if (path === '/workouts/session' && !S.active) { location.replace('#/workouts'); return; }
    const routeChanged = path !== lastPath;
    if (routeChanged) { lastPath = path; mobileOpen = false; if (NT_TAB[path]) P.nt.tab = NT_TAB[path]; P.nt.err = null; P.mm.err = null; }
    if (!VALID.includes(path)) { root.innerHTML = NotFound(); document.title = 'Not found — Fit with Di8'; return; }
    if (path === '/') { root.innerHTML = Landing(); document.title = 'Fit with Di8 — Performance System'; window.scrollTo(0, 0); return; }
    if (path === '/signin') { root.innerHTML = SignIn(); document.title = 'Sign in — Fit with Di8'; window.scrollTo(0, 0); return; }
    const label = path === '/workouts/session' ? 'Live session' : (NAV.find(n => n[1] === (path === '/scanners' ? '/scanners/food' : path)) || ['Profile'])[0];
    document.title = `${label} — Fit with Di8`;
    const ws = $('#workspace');
    if (!routeChanged && ws) {
      // Update only the page content so the sidebar & scroll position stay put
      ws.classList.add('no-anim');
      const y = window.scrollY;
      ws.innerHTML = pageContent(path);
      window.scrollTo(0, y);
      return;
    }
    root.innerHTML = Shell(path, pageContent(path));
    window.scrollTo(0, 0);
  }

  /* ---------- Quick find (Ctrl/Cmd + K) ---------- */
  function openQuick() {
    if (!$('#workspace') || $('.qf-backdrop')) return;
    const wrap = document.createElement('div');
    wrap.className = 'qf-backdrop';
    wrap.innerHTML = `<div class="qf-box"><input type="text" placeholder="Jump to a page…" aria-label="Quick find"><div class="qf-list"></div></div>`;
    document.body.appendChild(wrap);
    const input = $('input', wrap), list = $('.qf-list', wrap);
    const items = [...NAV, ['Profile', '/profile', 'user']];
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      const hits = items.filter(i => i[0].toLowerCase().includes(q));
      list.innerHTML = hits.length ? hits.map((h, i) => `<button class="${i === 0 ? 'hl' : ''}" data-qf="${h[1]}">${icon(h[2], 15)}<span>${h[0]}</span></button>`).join('') : '<div class="qf-empty">No matches</div>';
    };
    const close = () => wrap.remove();
    input.addEventListener('input', draw);
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') { const f = $('[data-qf]', list); if (f) { close(); go(f.dataset.qf); } }
    });
    wrap.addEventListener('click', e => {
      const b = e.target.closest('[data-qf]');
      if (b) { close(); go(b.dataset.qf); } else if (e.target === wrap) close();
    });
    draw(); input.focus();
  }

  /* ---------- File handling ---------- */
  function readImage(file, cb) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please choose an image file.'); return; }
    if (file.size > 8_000_000) { toast('Please choose an image smaller than 8 MB.'); return; }
    const r = new FileReader();
    r.onload = () => cb(String(r.result));
    r.onerror = () => toast('Could not read that file.');
    r.readAsDataURL(file);
  }
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (window.Tesseract) return res();
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = () => rej(new Error('load failed'));
      document.head.appendChild(s);
    });
  }
  async function runOcr(dataUrl) {
    P.nt.ocrBusy = true; render(true);
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');
      const { data } = await window.Tesseract.recognize(dataUrl, 'eng');
      const text = (data.text || '').replace(/\s+\n/g, '\n').trim();
      if (!text) throw new Error('empty');
      const m = text.match(/ingredients?\s*[:\-]?\s*([\s\S]{3,})/i);
      P.nt.ingredients = (m ? m[1] : text).replace(/\n+/g, ' ').trim();
      toast('Label text extracted. Review it before screening.');
    } catch (e) {
      toast('Could not read this label automatically. Please paste the ingredients manually.');
    } finally {
      P.nt.ocrBusy = false;
      if (currentPath() === '/scanners/supplement') render(true);
    }
  }

  /* ---------- Actions ---------- */
  const ACTIONS = {
    menu() { mobileOpen = true; $('#sidebar')?.classList.add('open'); $('#overlay')?.classList.add('show'); },
    'quick-open'() { openQuick(); },
    'fuel-remove'(arg) { S.foodLog.splice(Number(arg), 1); save(); render(true); },
    /* workouts */
    'wk-tab'(arg) { P.wk.tab = arg; render(true); },
    'wk-muscle'(arg) { P.wk.muscle = arg; render(true); },
    'wk-start'(arg) { startSession(Number(arg)); },
    /* food scanner */
    'scan-run'() {
      if (P.scan.busy) return;
      P.scan.busy = true; render(true);
      setTimeout(() => {
        let next; do { next = Math.floor(Math.random() * MEALS.length); } while (next === P.scan.meal && MEALS.length > 1);
        P.scan.meal = next; P.scan.busy = false;
        if (currentPath().startsWith('/scanners')) { render(true); toast(`Match found: ${MEALS[next].name}`); }
      }, 1500);
    },
    'scan-log'() { const m = MEALS[P.scan.meal]; addFood(m); toast(`Added ${m.name} to today's fuel log.`); },
    /* nutrition tools */
    'nt-tab'(arg) { P.nt.tab = arg; P.nt.err = null; render(true); },
    'nt-body'() {
      const n = P.nt;
      const r = calcBody(num(n.height), num(n.weight), num(n.bodyFat), num(n.waist));
      if (r.error) { n.err = r.error; n.body = null; } else { n.err = null; n.body = r; }
      render(true);
    },
    'nt-body-save'() {
      const r = P.nt.body; if (!r) return;
      S.bodyScans.push({ date: new Date().toLocaleDateString(), bodyFat: r.bodyFat, lean: r.lean, fat: r.fat, bmi: r.bmi, whr: r.whr });
      save(); toast('Body scan saved to your progress log.');
    },
    'nt-calc'() {
      const n = P.nt;
      const goal = n.goal === 'weight_gain' ? 'muscle_gain' : n.goal;
      const r = calcNutrition({ age: num(n.age), sex: n.sex, h: num(n.height), w: num(n.weight), goal, activity: n.activity });
      if (r.error) { n.err = r.error; n.calc = null; } else { n.err = null; r.water = Math.round(num(n.weight) * 0.035 * 10) / 10; n.calc = r; }
      render(true);
    },
    'nt-calc-use'() {
      const r = P.nt.calc; if (!r) return;
      S.targets = { kcal: r.calories, p: r.protein, c: r.carbs, f: r.fat }; save();
      toast('Dashboard targets updated.');
    },
    'nt-supp'() {
      const n = P.nt;
      if (n.ingredients.trim().length < 3) { n.err = 'Paste or upload an ingredient panel first.'; n.supp = null; }
      else { n.err = null; n.supp = analyzeSupplement((n.suppName || '').trim() || 'Unknown supplement', n.ingredients); }
      render(true);
    },
    /* mind map */
    'mm-select'(arg) { P.mm.sel = arg; render(true); },
    'mm-calc-tab'(arg) { P.mm.calc = arg; P.mm.err = null; render(true); },
    'mm-calc'() {
      const m = P.mm, h = num(m.height), w = num(m.weight);
      if (m.calc === 'bmi') { const r = calcBmi(h, w); if (r.error) { m.err = r.error; m.bmi = null; } else { m.err = null; m.bmi = r; } }
      else { const r = calcNutrition({ h, w, goal: m.goal, activity: m.activity }); if (r.error) { m.err = r.error; m.nut = null; } else { m.err = null; m.nut = r; } }
      render(true);
    },
    /* quick logging */
    'log-steps'() {
      openModal({ title: 'Log steps', desc: "Enter today's total step count.", fields: [{ name: 'steps', label: 'STEPS TODAY', type: 'number', value: dayData().steps || '', min: 0, max: 100000, step: 1 }],
        onSubmit: v => { const n = Number(v.steps); if (v.steps === '' || !(n >= 0 && n <= 100000)) return 'Enter a value between 0 and 100,000.'; setDay({ steps: Math.round(n) }); toast('Steps updated.'); render(true); } });
    },
    'log-sleep'() {
      openModal({ title: 'Log sleep', desc: 'Hours slept last night (e.g. 7.5).', fields: [{ name: 'sleep', label: 'HOURS', type: 'number', value: dayData().sleep || '', min: 0, max: 24, step: 0.25 }],
        onSubmit: v => { const n = Number(v.sleep); if (v.sleep === '' || !(n >= 0 && n <= 24)) return 'Enter hours between 0 and 24.'; setDay({ sleep: n }); toast('Sleep updated.'); render(true); } });
    },
    'water-add'(arg) { const w = Math.min(10000, dayData().water + Number(arg)); setDay({ water: w }); toast(`Water: ${(w / 1000).toFixed(2)} L today.`); render(true); },
    'water-edit'() {
      openModal({ title: 'Hydration', desc: `Goal: ${(S.settings.water / 1000).toFixed(1)} L per day.`, fields: [{ name: 'water', label: 'WATER TODAY (ML)', type: 'number', value: dayData().water, min: 0, max: 10000, step: 50 }],
        onSubmit: v => { const n = Number(v.water); if (v.water === '' || !(n >= 0 && n <= 10000)) return 'Enter a value between 0 and 10,000 ml.'; setDay({ water: Math.round(n) }); toast('Hydration updated.'); render(true); } });
    },
    'food-custom'() {
      openModal({ title: 'Add a meal', desc: 'Enter the totals for what you ate.', submit: 'Add to log',
        fields: [{ name: 'name', label: 'MEAL NAME', value: '', placeholder: 'e.g. Chicken wrap' }, { name: 'kcal', label: 'CALORIES (KCAL)', type: 'number', min: 0, max: 10000, step: 1 }, { name: 'p', label: 'PROTEIN (G)', type: 'number', min: 0, max: 500, step: 0.1 }, { name: 'c', label: 'CARBS (G)', type: 'number', min: 0, max: 1000, step: 0.1 }, { name: 'f', label: 'FAT (G)', type: 'number', min: 0, max: 300, step: 0.1 }],
        onSubmit: v => {
          const name = (v.name || '').trim(); const kcal = Number(v.kcal), p = Number(v.p || 0), c = Number(v.c || 0), f = Number(v.f || 0);
          if (!name) return 'Give the meal a name.';
          if (v.kcal === '' || !(kcal >= 0 && kcal <= 10000)) return 'Calories must be between 0 and 10,000.';
          if ([p, c, f].some(x => !(x >= 0))) return 'Macros must be zero or more.';
          addFood({ name, kcal, p, c, f }); toast(`Added ${name}.`); render(true);
        } });
    },
    'food-add'(arg) {
      const f = FOODS[Number(arg)], m = Number(P.food.serv) || 1;
      addFood({ name: m === 1 ? f.name : `${f.name} ×${m}`, kcal: f.kcal * m, p: f.p * m, c: f.c * m, f: f.f * m });
      toast(`Added ${f.name} (${Math.round(f.kcal * m)} kcal).`);
    },
    'wl-remove'(arg) { S.workoutLog = S.workoutLog.filter(w => String(w.id) !== String(arg)); save(); render(true); },
    /* workout session */
    'ws-toggle'(arg) {
      const [e, s] = arg.split(':').map(Number); const a = S.active; if (!a) return;
      const st = a.ex[e].sets[s]; st.done = !st.done;
      if (st.done) { if (st.reps === '') st.reps = String(st.target); a.restUntil = Date.now() + (REST[SESSIONS[a.idx].tag] || 60) * 1000; } else a.restUntil = 0;
      save(); render(true);
    },
    'ws-add-set'(arg) { const a = S.active; const ex = a.ex[Number(arg)]; const prev = ex.sets[ex.sets.length - 1]; ex.sets.push({ target: prev ? prev.target : 10, reps: '', kg: prev ? prev.kg : '', done: false }); save(); render(true); },
    'ws-discard'() { if (!confirm('Discard this workout? Nothing will be saved.')) return; S.active = null; save(); toast('Workout discarded.'); go('/workouts'); },
    'ws-finish'() {
      const a = S.active; if (!a) return;
      const all = a.ex.flatMap(e => e.sets), done = all.filter(x => x.done);
      if (!done.length) { if (!confirm('No sets are marked complete. Finish without saving?')) return; S.active = null; save(); go('/workouts'); return; }
      const volume = done.reduce((v, x) => v + (Number(x.reps) || 0) * (Number(x.kg) || 0), 0);
      const s = SESSIONS[a.idx];
      S.workoutLog.push({ id: Date.now(), date: todayKey(), title: s.title, tag: s.tag, min: Math.max(1, Math.round((Date.now() - a.start) / 60000)), sets: done.length, volume: Math.round(volume), load: clamp(Math.round(done.length / all.length * 100), 0, 100) });
      S.active = null; S.focus = null; save();
      toast(`Workout saved — ${done.length} sets, ${fmtNum(volume)} kg volume.`); go('/progress');
    },
    /* settings, notifications, export */
    notif() {
      const list = notices();
      openModal({ title: 'Notifications', submit: null, body: list.length ? `<div class="notice-list">${list.map(n => `<button class="notice" data-go="${n[3]}">${icon(n[0], 16)}<div><strong>${esc(n[1])}</strong><span>${esc(n[2])}</span></div>${icon('chevronRight', 14)}</button>`).join('')}</div>` : `<div class="notice-empty">${icon('check', 18)}<strong>You're all caught up.</strong><span>Nothing needs your attention right now.</span></div>` });
    },
    settings() {
      openModal({ title: 'Profile & targets', desc: 'Stored on this device only.', submit: 'Save settings',
        fields: [{ name: 'name', label: 'DISPLAY NAME', value: S.settings.name || (S.user ? S.user.name : ''), placeholder: 'Your name' }, { name: 'water', label: 'DAILY WATER GOAL (ML)', type: 'number', value: S.settings.water, min: 500, max: 8000, step: 50 }, { name: 'kcal', label: 'CALORIE TARGET', type: 'number', value: S.targets.kcal, min: 800, max: 10000, step: 10 }, { name: 'p', label: 'PROTEIN TARGET (G)', type: 'number', value: S.targets.p, min: 0, max: 500 }, { name: 'c', label: 'CARB TARGET (G)', type: 'number', value: S.targets.c, min: 0, max: 1000 }, { name: 'f', label: 'FAT TARGET (G)', type: 'number', value: S.targets.f, min: 0, max: 300 }],
        after: `<div class="modal-tools">${btn(`${icon('arrowUpRight', 13)} Export my data`, 'data-action="export-data"', 'ghost', 'btn-sm')}${btn('Reset all data', 'data-action="pf-reset"', 'ghost', 'btn-sm')}</div>`,
        onSubmit: v => {
          const w = Number(v.water), k = Number(v.kcal), p = Number(v.p), c = Number(v.c), f = Number(v.f);
          if (!(w >= 500 && w <= 8000)) return 'Water goal must be 500–8000 ml.';
          if (!(k >= 800 && k <= 10000)) return 'Calories must be 800–10,000.';
          if (!(p >= 0 && p <= 500) || !(c >= 0 && c <= 1000) || !(f >= 0 && f <= 300)) return 'Check your macro targets.';
          S.settings.name = (v.name || '').trim().slice(0, 40); S.settings.water = w; S.targets = { kcal: k, p, c, f }; save(); toast('Settings saved.'); lastPath = null; render(false);
        } });
    },
    'export-data'() {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `di8-data-${todayKey()}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Data exported.');
    },
    /* profile */
    'pf-cycle'(arg) {
      const row = PREF_ROWS.find(r => r.key === arg);
      P.pf.prefs[arg] = (P.pf.prefs[arg] + 1) % row.opts.length; P.pf.saved = false; render(true);
    },
    'pf-save'() { S.prefs = { ...P.pf.prefs }; save(); P.pf.saved = true; toast('Profile preferences saved.'); render(true); },
    'pf-signout'() { S.user = null; save(); toast('Signed out.'); go('/'); },
    'pf-reset'() {
      if (!confirm('Clear all locally saved DI8 data (meals, scans, targets, profile)?')) return;
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      Object.assign(S, JSON.parse(JSON.stringify(DEFAULT_STATE)));
      P.pf.prefs = { ...S.prefs }; P.pf.saved = false; closeModal();
      toast('Local data cleared.'); lastPath = null; render(false);
    },
  };

  /* ---------- Event wiring (delegated) ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-modal-close]') || (t.classList && t.classList.contains('modal-backdrop'))) { closeModal(); return; }
    if (t.id === 'overlay') { $('#sidebar')?.classList.remove('open'); t.classList.remove('show'); mobileOpen = false; return; }
    if (t.closest('[data-nav]')) { $('#sidebar')?.classList.remove('open'); $('#overlay')?.classList.remove('show'); return; } // hash change handles routing
    const sc = t.closest('[data-scroll]');
    if (sc) { document.getElementById(sc.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }); return; }
    const g = t.closest('[data-go]');
    if (g) { go(g.dataset.go); return; }
    const tt = t.closest('[data-toast]');
    if (tt) { toast(tt.dataset.toast); return; }
    const a = t.closest('[data-action]');
    if (a && ACTIONS[a.dataset.action]) { if (a.disabled) return; ACTIONS[a.dataset.action](a.dataset.arg, a); }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { if ($('#workspace')) { e.preventDefault(); openQuick(); } return; }
    if (e.key === 'Enter' || e.key === ' ') {
      const row = e.target.closest && e.target.closest('[role="button"][data-action]');
      if (row && row.tagName !== 'BUTTON') { e.preventDefault(); ACTIONS[row.dataset.action]?.(row.dataset.arg, row); }
    }
  });

  function setModel(path, value) {
    const [group, key] = path.split('.');
    const target = { wk: P.wk, scan: P.scan, nt: P.nt, mm: P.mm, food: P.food }[group];
    if (target) target[key] = value;
  }
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset && el.dataset.ws) { updateSet(el); return; }
    if (el.dataset && el.dataset.model && !el.hasAttribute('data-rerender')) {
      setModel(el.dataset.model, el.value);
      if (el.dataset.model === 'food.q') { const box = $('#food-results'); if (box) box.innerHTML = foodRows(); }
    }
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset && el.dataset.model) {
      setModel(el.dataset.model, el.hasAttribute('data-number') ? Number(el.value) : el.value);
      if (el.hasAttribute('data-rerender')) render(true);
      return;
    }
    if (el.dataset && el.dataset.file) {
      const f = el.files && el.files[0];
      const kind = el.dataset.file;
      readImage(f, url => {
        if (kind === 'food') { P.scan.image = url; render(true); toast('Photo added. Press “Scan food”, then pick the closest meal.'); }
        if (kind === 'body') { P.nt.bodyImage = url; render(true); }
        if (kind === 'supp') { P.nt.suppImage = url; render(true); runOcr(url); }
      });
      el.value = '';
    }
  });

  document.addEventListener('submit', e => {
    if (e.target.id === 'modal-form') {
      e.preventDefault();
      const vals = Object.fromEntries(new FormData(e.target).entries());
      const err = modalState && modalState.onSubmit ? modalState.onSubmit(vals) : null;
      if (typeof err === 'string') { $('#modal-error').innerHTML = `<div class="field-error">${esc(err)}</div>`; return; }
      closeModal(); return;
    }
    if (e.target.id !== 'signin-form') return;
    e.preventDefault();
    const f = e.target;
    const email = f.email.value.trim(), pw = f.password.value;
    const errBox = $('#signin-error');
    const fail = m => { errBox.innerHTML = `<div class="field-error">${esc(m)}</div>`; };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Please enter a valid email address.');
    if (pw.length < 4) return fail('Password must be at least 4 characters.');
    const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    const name = local.split(' ').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ') || 'Athlete';
    S.user = { email, name }; save();
    toast(`Welcome, ${name.split(' ')[0]}.`);
    go('/dashboard');
  });

  window.addEventListener('hashchange', () => render(false));

  // Boot
  render(false);
})();