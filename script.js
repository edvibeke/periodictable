/* Edvibe Periodic Table - Interactive Script */
(function () {
  'use strict';

  const DATA = window.PT_ELEMENTS || [];
  const tableEl = document.getElementById('periodic-table');
  const subfiltersEl = document.getElementById('subfilters');
  const searchEl = document.getElementById('element-search');
  const searchClear = document.getElementById('search-clear');
  const resultCount = document.getElementById('result-count');
  const modal = document.getElementById('element-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const TRENDS = {
    en: {
      key: 'en', label: 'Electronegativity', unit: 'Pauling', short: 'EN',
      what: "Electronegativity measures an atom's tendency to attract shared electrons in a chemical bond.",
      period: 'Generally increases left to right. More protons pull electrons more strongly in the same shell.',
      group: 'Generally decreases going down. Outer electrons are farther from the nucleus and more shielded.',
      note: 'Tip: Noble gases are often shown as N/A because they rarely form bonds.',
      lowColor: [68, 50, 28], highColor: [253, 150, 30]
    },
    ar: {
      key: 'ar', label: 'Atomic Radius', unit: 'pm', short: 'Radius',
      what: 'Atomic radius describes the size of an atom, typically measured in picometers (pm).',
      period: 'Generally decreases left to right. Increasing nuclear charge pulls electrons closer.',
      group: 'Generally increases going down. New electron shells make atoms larger.',
      note: 'Tip: Compare elements in the same period to see the left-to-right shrink clearly.',
      lowColor: [255, 220, 170], highColor: [253, 150, 30]
    },
    ie: {
      key: 'ie', label: 'First Ionization Energy', unit: 'kJ/mol', short: 'Ionization',
      what: 'First ionization energy is the energy needed to remove the outermost electron from a neutral atom.',
      period: 'Generally increases left to right. Electrons are held tighter by higher nuclear charge.',
      group: 'Generally decreases going down. Outer electrons are farther away and easier to remove.',
      note: 'Tip: Small dips happen (e.g., B vs Be) due to subshell structure — trends show the big picture.',
      lowColor: [20, 80, 70], highColor: [0, 184, 148]
    }
  };

  const CAT_LABELS = {
    alkali: 'Alkali Metal', alkaline: 'Alkaline Earth Metal', transition: 'Transition Metal',
    'post-transition': 'Post-Transition Metal', basic: 'Post-Transition Metal', metalloid: 'Metalloid',
    semimetal: 'Metalloid', nonmetal: 'Nonmetal', halogen: 'Halogen', noble: 'Noble Gas',
    lanthanide: 'Lanthanide', actinide: 'Actinide', unknown: 'Unknown'
  };

  const state = {
    filter: 'all', subfilter: null, search: '', view: 'table',
    trend: 'en', trendMode: 'period', trendSelector: 2, playing: false, playTimer: null
  };

  const elMap = new Map();
  let lastFocus = null;

  function init() {
    if (!DATA.length || !tableEl) return;
    renderTable();
    fixSpecialPlacement();
    bindControls();
    bindModal();
    bindTrends();
    updateTrendUI();
    applyState();
    animateIn();
  }

  function renderTable() {
    const frag = document.createDocumentFragment();
    DATA.forEach((e, i) => {
      const btn = document.createElement('button');
      btn.className = `element cat-${cssCat(e.cat)} phase-${e.phase}`;
      btn.type = 'button';
      btn.dataset.n = e.n;
      btn.dataset.sym = e.sym;
      btn.dataset.name = e.name;
      btn.dataset.cat = e.cat;
      btn.dataset.phase = e.phase;
      btn.dataset.group = e.group || '';
      btn.dataset.period = e.period || '';
      btn.style.gridColumn = String(gridCol(e));
      btn.style.gridRow = String(gridRow(e));
      btn.style.setProperty('--delay', `${Math.min(i * 8, 600)}ms`);
      btn.setAttribute('aria-label', `${e.name}, atomic number ${e.n}, ${CAT_LABELS[e.cat] || e.cat}`);
      btn.innerHTML = `
        <span class="el-num">${e.n}</span>
        <span class="el-sym">${e.sym}</span>
        <span class="el-name">${e.name}</span>
        <span class="el-mass">${e.mass}</span>
        <span class="trend-val" hidden></span>
      `;
      btn.addEventListener('click', () => openModal(e, btn));
      frag.appendChild(btn);
      elMap.set(e.n, { data: e, el: btn });
    });
    tableEl.appendChild(frag);
  }

  function cssCat(cat) {
    if (cat === 'semimetal') return 'metalloid';
    if (cat === 'basic') return 'post-transition';
    return cat || 'unknown';
  }

  function gridCol(e) {
    if (e.cat === 'lanthanide') return e.n - 54 + 2; // La(57)->col3 ... Lu(71)->col17? better map by n
    if (e.cat === 'actinide') return e.n - 86 + 2;
    // Standard placement: La/Ac placeholders in group 3
    return e.group || 3;
  }
  function gridRow(e) {
    if (e.cat === 'lanthanide') return 9;
    if (e.cat === 'actinide') return 10;
    return e.period || 1;
  }

  // Fix lanthanide/actinide column mapping precisely
  function fixSpecialPlacement() {
    DATA.forEach(e => {
      const item = elMap.get(e.n);
      if (!item) return;
      if (e.cat === 'lanthanide') { item.el.style.gridColumn = String(e.n - 57 + 3); item.el.style.gridRow = '9'; }
      else if (e.cat === 'actinide') { item.el.style.gridColumn = String(e.n - 89 + 3); item.el.style.gridRow = '10'; }
      else { item.el.style.gridColumn = String(e.group); item.el.style.gridRow = String(e.period); }
    });
  }

  function bindControls() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filter = btn.dataset.filter;
        state.subfilter = null;
        renderSubfilters();
        applyState();
      });
    });

    searchEl.addEventListener('input', (e) => {
      state.search = e.target.value.trim().toLowerCase();
      searchClear.hidden = !state.search;
      applyState();
    });
    searchClear.addEventListener('click', () => {
      searchEl.value = ''; state.search = ''; searchClear.hidden = true; applyState(); searchEl.focus();
    });

    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.view = btn.dataset.view;
        if (state.view === 'trends') {
          document.getElementById('trends-section').scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
        }
        applyState();
      });
    });

    document.getElementById('reset-all').addEventListener('click', resetAll);
  }

  function renderSubfilters() {
    const f = state.filter;
    let html = '';
    const mk = (label, val, active) => `<button class="chip ${active ? 'active' : ''}" data-sub="${val}">${label}</button>`;
    if (f === 'metal') {
      ['alkali|Alkali Metals','alkaline|Alkaline Earth','transition|Transition','post-transition|Post-Transition','lanthanide|Lanthanides','actinide|Actinides'].forEach(s => {
        const [v,l] = s.split('|'); html += mk(l,v,state.subfilter===v);
      });
    } else if (f === 'nonmetal') {
      ['nonmetal|Nonmetals','halogen|Halogens','noble|Noble Gases'].forEach(s => { const [v,l]=s.split('|'); html += mk(l,v,state.subfilter===v); });
    } else if (f === 'metalloid') {
      html += mk('Metalloids','metalloid',state.subfilter==='metalloid');
    } else if (f === 'state') {
      ['solid|Solid','liquid|Liquid','gas|Gas','unknown|Unknown'].forEach(s => { const [v,l]=s.split('|'); html += mk(l,v,state.subfilter===v); });
    } else if (f === 'group') {
      for (let i=1;i<=18;i++) html += mk(String(i),`g${i}`,state.subfilter===`g${i}`);
    } else if (f === 'period') {
      for (let i=1;i<=7;i++) html += mk(String(i),`p${i}`,state.subfilter===`p${i}`);
    }
    subfiltersEl.innerHTML = html;
    subfiltersEl.querySelectorAll('[data-sub]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.sub;
        state.subfilter = state.subfilter === val ? null : val;
        renderSubfilters();
        applyState();
      });
    });
  }

  function matchesFilter(e) {
    const f = state.filter, sf = state.subfilter;
    if (f === 'all') return true;
    if (f === 'metal') {
      const metals = ['alkali','alkaline','transition','post-transition','basic','lanthanide','actinide'];
      if (sf) return sf === 'post-transition' ? (e.cat === 'post-transition' || e.cat === 'basic') : e.cat === sf;
      return metals.includes(e.cat);
    }
    if (f === 'nonmetal') {
      const nons = ['nonmetal','halogen','noble'];
      if (sf) return e.cat === sf;
      return nons.includes(e.cat);
    }
    if (f === 'metalloid') {
      if (sf) return e.cat === 'metalloid' || e.cat === 'semimetal';
      return e.cat === 'metalloid' || e.cat === 'semimetal';
    }
    if (f === 'state') { if (sf) return e.phase === sf; return true; }
    if (f === 'group') { if (sf) return String(e.group) === sf.replace('g',''); return true; }
    if (f === 'period') { if (sf) return String(e.period) === sf.replace('p',''); return true; }
    return true;
  }

  function matchesSearch(e) {
    const q = state.search;
    if (!q) return true;
    return e.name.toLowerCase().includes(q) || e.sym.toLowerCase().includes(q) || String(e.n) === q || String(e.n).includes(q);
  }

  function applyState() {
    let visible = 0;
    DATA.forEach(e => {
      const item = elMap.get(e.n);
      if (!item) return;
      const fOk = matchesFilter(e);
      const sOk = matchesSearch(e);
      const show = fOk && sOk;
      item.el.classList.toggle('hidden-filter', !fOk);
      item.el.classList.toggle('dimmed', fOk && !sOk);
      item.el.classList.toggle('search-hit', !!state.search && sOk && fOk);
      if (show) visible++;
    });
    resultCount.textContent = `${visible} element${visible !== 1 ? 's' : ''}${state.search ? ` for "${state.search}"` : ''}`;
    applyTrend();
  }

  function resetAll() {
    state.filter = 'all'; state.subfilter = null; state.search = ''; state.view = 'table';
    searchEl.value = ''; searchClear.hidden = true;
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
    document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'table'));
    renderSubfilters();
    applyState();
  }

  /* ===== Trends ===== */
  function bindTrends() {
    document.querySelectorAll('[data-trend]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-trend]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.trend = btn.dataset.trend;
        updateTrendUI();
        applyTrend();
      });
    });
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.trendMode = btn.dataset.mode;
        stopPlay();
        updateTrendUI();
        applyTrend();
      });
    });
    document.getElementById('trend-selector').addEventListener('change', (e) => {
      state.trendSelector = parseInt(e.target.value, 10);
      stopPlay();
      applyTrend();
    });
    document.getElementById('trend-play').addEventListener('click', togglePlay);
    updateTrendUI();
  }

  function updateTrendUI() {
    const t = TRENDS[state.trend];
    const mode = state.trendMode;
    const sel = document.getElementById('trend-selector');
    const label = document.getElementById('trend-selector-label');
    const playBtn = document.getElementById('trend-play');
    sel.innerHTML = '';
    if (mode === 'period') {
      label.textContent = 'Period';
      for (let i=1;i<=7;i++) sel.add(new Option(`Period ${i}`, i));
      if (state.trendSelector < 1 || state.trendSelector > 7) state.trendSelector = 2;
      sel.value = String(state.trendSelector);
      sel.disabled = false; playBtn.disabled = false;
    } else if (mode === 'group') {
      label.textContent = 'Group';
      for (let i=1;i<=18;i++) sel.add(new Option(`Group ${i}`, i));
      if (state.trendSelector < 1 || state.trendSelector > 18) state.trendSelector = 1;
      sel.value = String(state.trendSelector);
      sel.disabled = false; playBtn.disabled = false;
    } else {
      label.textContent = 'View';
      sel.add(new Option('All elements', 'all'));
      sel.disabled = true; playBtn.disabled = true;
    }

    document.getElementById('explain-kicker').textContent = `${t.label} (${t.unit})`;
    document.getElementById('explain-title').textContent = trendTitle(t.key);
    document.getElementById('explain-what').textContent = t.what;
    document.getElementById('explain-period').textContent = t.period;
    document.getElementById('explain-group').textContent = t.group;
    document.getElementById('explain-note').textContent = t.note;
    updateLegend(t);
  }

  function trendTitle(key) {
    if (key === 'en') return 'How strongly an atom attracts electrons';
    if (key === 'ar') return 'How large an atom is';
    if (key === 'ie') return 'How hard it is to remove an electron';
    return '';
  }

  function getTrendValues(key) {
    const vals = DATA.map(e => e[key]).filter(v => v !== null && v !== undefined && !Number.isNaN(v));
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }

  function updateLegend(t) {
    const { min, max } = getTrendValues(t.key);
    document.getElementById('legend-min').textContent = `${min} ${t.unit}`;
    document.getElementById('legend-max').textContent = `${max} ${t.unit}`;
    const bar = document.getElementById('legend-bar');
    const c1 = `rgb(${t.lowColor.join(',')})`;
    const c2 = `rgb(${t.highColor.join(',')})`;
    bar.style.background = `linear-gradient(90deg, ${c1}, ${c2})`;
  }

  function trendColor(t, val, min, max) {
    if (val === null || val === undefined) return null;
    const ratio = max === min ? 0.5 : (val - min) / (max - min);
    const r = Math.round(t.lowColor[0] + (t.highColor[0] - t.lowColor[0]) * ratio);
    const g = Math.round(t.lowColor[1] + (t.highColor[1] - t.lowColor[1]) * ratio);
    const b = Math.round(t.lowColor[2] + (t.highColor[2] - t.lowColor[2]) * ratio);
    return { bg: `rgba(${r},${g},${b},0.32)`, border: `rgba(${r},${g},${b},0.65)`, text: `rgb(${Math.min(255,r+40)},${Math.min(255,g+40)},${Math.min(255,b+40)})` };
  }

  function isTrendFocus(e) {
    if (state.trendMode === 'all') return true;
    if (state.trendMode === 'period') return e.period === state.trendSelector;
    if (state.trendMode === 'group') return e.group === state.trendSelector;
    return true;
  }

  function applyTrend() {
    const t = TRENDS[state.trend];
    const { min, max } = getTrendValues(t.key);
    const active = state.view === 'trends';
    DATA.forEach(e => {
      const item = elMap.get(e.n);
      if (!item) return;
      const el = item.el;
      const val = e[t.key];
      const inFocus = isTrendFocus(e);
      const valEl = el.querySelector('.trend-val');

      el.classList.toggle('trend-active', active);
      el.classList.toggle('trend-na', active && (val === null || val === undefined));
      valEl.hidden = !(active && inFocus);

      if (active) {
        const c = trendColor(t, val, min, max);
        if (c) {
          el.style.background = c.bg;
          el.style.borderColor = c.border;
          el.style.boxShadow = inFocus ? `0 0 0 1px ${c.border}, 0 8px 24px rgba(0,0,0,.25)` : '';
        } else {
          el.style.background = 'rgba(255,255,255,.03)';
          el.style.borderColor = 'rgba(255,255,255,.08)';
          el.style.boxShadow = '';
        }
        el.style.opacity = inFocus ? '1' : '0.25';
        el.style.filter = inFocus ? 'none' : 'grayscale(.6)';
        if (inFocus && val !== null && val !== undefined) {
          valEl.textContent = `${val}`;
        } else {
          valEl.textContent = val === null ? 'N/A' : '';
        }
      } else {
        el.style.background = '';
        el.style.borderColor = '';
        el.style.boxShadow = '';
        el.style.opacity = '';
        el.style.filter = '';
        valEl.textContent = '';
      }
    });
    // Re-apply filter/search dimming on top of trend
    if (active) {
      DATA.forEach(e => {
        const item = elMap.get(e.n);
        const fOk = matchesFilter(e);
        const sOk = matchesSearch(e);
        if (!fOk) { item.el.style.opacity = '0.1'; item.el.style.filter = 'grayscale(.8)'; }
        else if (!sOk) { item.el.style.opacity = '0.2'; }
      });
    }
  }

  function togglePlay() {
    if (state.playing) { stopPlay(); return; }
    state.playing = true;
    document.getElementById('trend-play').textContent = 'Pause';
    const mode = state.trendMode;
    const max = mode === 'period' ? 7 : 18;
    let current = mode === 'period' ? 1 : 1;
    const tick = () => {
      state.trendSelector = current;
      document.getElementById('trend-selector').value = String(current);
      applyTrend();
      current++;
      if (current > max) current = 1;
    };
    tick();
    state.playTimer = setInterval(tick, 1800);
  }
  function stopPlay() {
    state.playing = false;
    document.getElementById('trend-play').textContent = 'Play';
    if (state.playTimer) { clearInterval(state.playTimer); state.playTimer = null; }
  }

  /* ===== Modal ===== */
  function bindModal() {
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
      if (e.key === 'Tab' && modal.classList.contains('open')) trapFocus(e);
    });
  }

  function openModal(e, sourceEl) {
    lastFocus = sourceEl || document.activeElement;
    document.querySelectorAll('.element.selected').forEach(n => n.classList.remove('selected'));
    if (sourceEl) sourceEl.classList.add('selected');
    modalBody.innerHTML = modalHTML(e);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const dialog = modal.querySelector('.modal-dialog');
    if (sourceEl && dialog && !prefersReduced()) {
      const r = sourceEl.getBoundingClientRect();
      const cx = r.left + r.width / 2 - window.innerWidth / 2;
      const cy = r.top + r.height / 2 - window.innerHeight / 2;
      dialog.animate([
        { transform: `translate(${cx}px, ${cy}px) scale(0.15) rotateY(360deg) rotateZ(-10deg)`, opacity: 0.05, filter: 'blur(2px)' },
        { offset: 0.72, transform: 'translate(0,0) scale(1.03) rotateY(0deg) rotateZ(1deg)', opacity: 1, filter: 'blur(0px)' },
        { transform: 'translate(0,0) scale(1) rotateY(0deg) rotateZ(0deg)', opacity: 1, filter: 'blur(0px)' }
      ], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    } else if (dialog && !prefersReduced()) {
      dialog.animate([
        { transform: 'translateY(30px) scale(0.92) rotateX(10deg)', opacity: 0 },
        { transform: 'translateY(0) scale(1) rotateX(0deg)', opacity: 1 }
      ], { duration: 450, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'both' });
    }
    requestAnimationFrame(() => {
      modalBody.querySelectorAll('.tbar-fill').forEach(bar => {
        const w = bar.dataset.w;
        bar.style.width = '0%';
        requestAnimationFrame(() => { bar.style.width = w + '%'; });
      });
    });
    modalClose.focus({ preventScroll: true });
  }

  function closeModal() {
    const dialog = modal.querySelector('.modal-dialog');
    if (lastFocus && dialog && !prefersReduced() && modal.classList.contains('open')) {
      const r = lastFocus.getBoundingClientRect();
      const cx = r.left + r.width / 2 - window.innerWidth / 2;
      const cy = r.top + r.height / 2 - window.innerHeight / 2;
      const anim = dialog.animate([
        { transform: 'translate(0,0) scale(1) rotateY(0deg) rotateZ(0deg)', opacity: 1 },
        { transform: `translate(${cx}px, ${cy}px) scale(0.15) rotateY(-180deg) rotateZ(8deg)`, opacity: 0 }
      ], { duration: 360, easing: 'cubic-bezier(.4,0,1,1)', fill: 'both' });
      anim.onfinish = finalizeClose;
      return;
    }
    finalizeClose();
  }
  function finalizeClose() {
    const dialog = modal.querySelector('.modal-dialog');
    if (dialog) {
      dialog.getAnimations().forEach(a => a.cancel());
      dialog.style.transform = '';
      dialog.style.opacity = '';
      dialog.style.filter = '';
    }
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelectorAll('.element.selected').forEach(n => n.classList.remove('selected'));
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function trapFocus(e) {
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function modalHTML(e) {
    const cat = CAT_LABELS[e.cat] || e.catLabel || e.cat;
    const tileBg = `linear-gradient(160deg, ${catColor(e.cat,0.45)}, ${catColor(e.cat,0.18)})`;
    const en = fmt(e.en, ''), ar = fmt(e.ar, ' pm'), ie = fmt(e.ie, ' kJ/mol');
    const { min: enMin, max: enMax } = getTrendValues('en');
    const { min: arMin, max: arMax } = getTrendValues('ar');
    const { min: ieMin, max: ieMax } = getTrendValues('ie');
    const safe = s => String(s || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const summary = safe(e.summary) || `${safe(e.name)} is a ${cat.toLowerCase()} in period ${e.period}${e.group ? `, group ${e.group}` : ''}.`;
    return `
      <div class="modal-hero">
        <div class="modal-tile" style="background:${tileBg};border-color:${catColor(e.cat,0.5)}">
          <span class="t-num">${e.n}</span>
          <span class="t-sym">${safe(e.sym)}</span>
          <span class="t-name">${safe(e.name)}</span>
          <span class="t-mass">${safe(e.mass)}</span>
        </div>
        <div class="modal-head">
          <span class="cat-pill" style="color:${catColor(e.cat,1)};border-color:${catColor(e.cat,0.35)};background:${catColor(e.cat,0.12)}">${cat}</span>
          <h2 id="modal-title">${safe(e.name)}</h2>
          <p class="modal-sub">${summary}</p>
          <div class="modal-quick">
            <span class="quick-chip"><strong>Phase:</strong> ${safe(cap(e.phase))}</span>
            <span class="quick-chip"><strong>Block:</strong> ${safe(String(e.block || '—').toUpperCase())}</span>
            <span class="quick-chip"><strong>Group:</strong> ${e.group ?? '—'}</span>
            <span class="quick-chip"><strong>Period:</strong> ${e.period ?? '—'}</span>
          </div>
        </div>
      </div>
      <div class="modal-grid">
        <div class="fact"><div class="fact-label">Atomic Mass</div><div class="fact-value">${safe(e.mass)}</div></div>
        <div class="fact"><div class="fact-label">Electron Config</div><div class="fact-value">${safe(e.cfg || '—')}</div></div>
        <div class="fact"><div class="fact-label">Oxidation States</div><div class="fact-value">${safe(e.ox || '—')}</div></div>
        <div class="fact"><div class="fact-label">Melting / Boiling</div><div class="fact-value">${safe(e.mp || 'N/A')} / ${safe(e.bp || 'N/A')}</div></div>
      </div>
      <div class="modal-section">
        <h3>Trend Snapshot</h3>
        <div class="modal-trend-bars">
          ${trendBar('Electronegativity', e.en, 'Pauling', enMin, enMax)}
          ${trendBar('Atomic Radius', e.ar, 'pm', arMin, arMax)}
          ${trendBar('Ionization Energy', e.ie, 'kJ/mol', ieMin, ieMax)}
        </div>
      </div>
      <div class="modal-cta">
        <a class="btn btn-primary btn-small" href="https://edvibe.co.ke/notes.php?subject=chemistry" target="_blank" rel="noopener noreferrer">Study Chemistry on Edvibe</a>
        <a class="btn btn-ghost btn-small" href="https://edvibe.co.ke/quizzes.php" target="_blank" rel="noopener noreferrer">Try a Quiz</a>
      </div>
    `;
  }

  function trendBar(label, val, unit, min, max) {
    const pct = (val === null || val === undefined) ? 0 : ((val - min) / (max - min)) * 100;
    const display = (val === null || val === undefined) ? 'N/A' : `${val} ${unit}`;
    return `<div class="tbar"><span class="tbar-label">${label}</span><div class="tbar-track"><div class="tbar-fill" data-w="${pct.toFixed(1)}"></div></div><span class="tbar-val">${display}</span></div>`;
  }

  function fmt(v, unit) { return v === null || v === undefined ? 'N/A' : `${v}${unit}`; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function catColor(cat, a) {
    const map = {alkali:[255,107,107],alkaline:[255,179,71],transition:[122,162,255],'post-transition':[77,208,225],basic:[77,208,225],metalloid:[155,123,255],semimetal:[155,123,255],nonmetal:[74,222,128],halogen:[244,114,182],noble:[250,204,21],lanthanide:[251,113,133],actinide:[192,132,252]};
    const c = map[cat] || [148,163,184];
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  }

  function prefersReduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function animateIn() {
    if (prefersReduced()) return;
    elMap.forEach(({ el }) => el.classList.add('animate-in'));
    setTimeout(() => elMap.forEach(({ el }) => el.classList.remove('animate-in')), 1200);
  }

  init();
})();
